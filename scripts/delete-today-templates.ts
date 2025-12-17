import { db } from '@/lib/db/drizzle';
import { templates } from '@/lib/db/schema';
import { gte } from 'drizzle-orm';

(async () => {
  const today = new Date();
  today.setHours(8, 0, 0, 0);

  console.log(`Deleting templates created after ${today.toISOString()}...`);

  const result = await db.delete(templates).where(
    gte(templates.createdAt, today)
  ).returning();

  console.log(`✅ Deleted ${result.length} templates`);
  result.forEach(t => console.log(`  - ${t.name}`));

  process.exit(0);
})();
