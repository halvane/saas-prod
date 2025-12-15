import { getAdminStats, getAllUsers } from './actions';
import { AdminClientPage } from '@/components/custom/Admin/AdminClientPage';
import { db } from '@/lib/db/drizzle';
import { templates } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export default async function AdminPage() {
  const stats = await getAdminStats();
  const users = await getAllUsers();
  const allTemplates = await db.select().from(templates).orderBy(desc(templates.createdAt));

  return <AdminClientPage stats={stats} users={users} templates={allTemplates} />;
}
