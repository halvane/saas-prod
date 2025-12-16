import { db } from '@/lib/db/drizzle';
import { templates } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getTemplatesForUser(userId: number) {
  // Fetch all active templates
  // We need htmlTemplate and cssTemplate for rendering
  const activeTemplates = await db.query.templates.findMany({
    where: eq(templates.isActive, true),
  });

  return activeTemplates;
}

