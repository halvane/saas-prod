'use server';

import { db } from '@/lib/db/drizzle';
import { users, teams, teamMembers, activityLogs } from '@/lib/db/schema';
import { count, desc, eq, sql } from 'drizzle-orm';
import { getUser } from '@/lib/db/queries';
import { revalidatePath } from 'next/cache';
import { hashPassword } from '@/lib/auth/session';

export async function getAdminStats() {
  const user = await getUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const [userCount] = await db.select({ count: count() }).from(users);
  const [teamCount] = await db.select({ count: count() }).from(teams);
  
  // Calculate MRR (Mock calculation based on plan names)
  // Assuming Pro = $99, Business = $199, Starter = $29
  const allTeams = await db.select({ planName: teams.planName }).from(teams);
  let mrr = 0;
  const planCounts: Record<string, number> = {};

  allTeams.forEach(team => {
    const plan = team.planName || 'Free';
    planCounts[plan] = (planCounts[plan] || 0) + 1;
    
    if (plan === 'Pro') mrr += 99;
    else if (plan === 'Business') mrr += 199;
    else if (plan === 'Starter') mrr += 29;
  });

  // Get recent activity
  const recentActivity = await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      timestamp: activityLogs.timestamp,
      userEmail: users.email,
    })
    .from(activityLogs)
    .leftJoin(users, eq(activityLogs.userId, users.id))
    .orderBy(desc(activityLogs.timestamp))
    .limit(5);

  // Format plan distribution
  const planDistribution = Object.entries(planCounts).map(([plan, count]) => ({
    plan,
    users: count,
    revenue: plan === 'Pro' ? `$${count * 99}` : plan === 'Business' ? `$${count * 199}` : plan === 'Starter' ? `$${count * 29}` : '$0'
  }));

  return {
    totalUsers: userCount.count,
    totalTeams: teamCount.count,
    mrr,
    recentActivity: recentActivity.map(log => ({
      type: 'info',
      message: `${log.action} by ${log.userEmail || 'Unknown'}`,
      time: log.timestamp.toLocaleString(),
      action: null
    })),
    planDistribution
  };
}

export async function getAllUsers() {
  const user = await getUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  // Join users with teams to get plan info
  // This assumes one team per user for simplicity in this view, or takes the first one
  const usersWithPlans = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
      plan: teams.planName,
      status: teams.subscriptionStatus,
      teamId: teams.id,
      credits: teams.credits,
      stripeCustomerId: teams.stripeCustomerId,
    })
    .from(users)
    .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
    .leftJoin(teams, eq(teamMembers.teamId, teams.id))
    .orderBy(desc(users.createdAt));

  return usersWithPlans.map(u => ({
    id: u.id.toString(),
    name: u.name || 'No Name',
    email: u.email,
    role: u.role,
    plan: u.plan || 'Free',
    status: u.status || 'Active',
    usage: `${u.credits || 0} credits`,
    created: u.createdAt.toLocaleDateString(),
    teamId: u.teamId,
    credits: u.credits || 0,
    stripeCustomerId: u.stripeCustomerId,
  }));
}

export async function updateUserCredits(teamId: number, credits: number) {
  const user = await getUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  await db.update(teams)
    .set({ credits })
    .where(eq(teams.id, teamId));
  
  revalidatePath('/admin');
  return { success: true };
}

export async function updateUserPlan(teamId: number, planName: string) {
  const user = await getUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  await db.update(teams)
    .set({ planName })
    .where(eq(teams.id, teamId));
  
  revalidatePath('/admin');
  return { success: true };
}

export async function deleteUser(userId: number) {
  const user = await getUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  await db.delete(users).where(eq(users.id, userId));
  return { success: true };
}

export async function createUserWithStripe(data: {
  name: string;
  email: string;
  password: string;
  role: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  planName?: string;
  subscriptionStatus?: string;
  credits?: number;
}) {
  const user = await getUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const passwordHash = await hashPassword(data.password);

  // 1. Create User
  const [newUser] = await db.insert(users).values({
    name: data.name,
    email: data.email,
    passwordHash: passwordHash,
    role: data.role as any,
  }).returning();

  // 2. Create Team
  const [newTeam] = await db.insert(teams).values({
    name: `${data.name}'s Team`,
    stripeCustomerId: data.stripeCustomerId || null,
    stripeSubscriptionId: data.stripeSubscriptionId || null,
    planName: data.planName || 'Free',
    subscriptionStatus: data.subscriptionStatus || 'active',
    credits: data.credits || 0,
  }).returning();

  // 3. Link User to Team
  await db.insert(teamMembers).values({
    userId: newUser.id,
    teamId: newTeam.id,
    role: 'owner',
  });

  revalidatePath('/admin');
  return { success: true, userId: newUser.id };
}
