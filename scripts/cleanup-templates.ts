
import { db } from '../lib/db/drizzle';
import { templates } from '../lib/db/schema';
import { asc, inArray, notInArray } from 'drizzle-orm';

async function cleanupTemplates() {
  console.log('Fetching templates...');
  const allTemplates = await db.query.templates.findMany({
    orderBy: [asc(templates.createdAt)],
    columns: {
      id: true,
      name: true,
      createdAt: true,
    },
  });

  console.log(`Found ${allTemplates.length} templates.`);

  if (allTemplates.length <= 10) {
    console.log('Less than or equal to 10 templates found. No action needed.');
    process.exit(0);
  }

  const templatesToKeep = allTemplates.slice(0, 10);
  const idsToKeep = templatesToKeep.map((t) => t.id);

  console.log(`Keeping the following 10 templates:`);
  templatesToKeep.forEach((t) => console.log(`- ${t.name} (${t.id})`));

  const templatesToDelete = allTemplates.slice(10);
  const idsToDelete = templatesToDelete.map((t) => t.id);

  console.log(`Deleting ${idsToDelete.length} templates...`);

  if (idsToDelete.length > 0) {
    await db.delete(templates).where(inArray(templates.id, idsToDelete));
    console.log('Deletion complete.');
  } else {
    console.log('No templates to delete.');
  }

  process.exit(0);
}

cleanupTemplates().catch((err) => {
  console.error('Error cleaning up templates:', err);
  process.exit(1);
});
