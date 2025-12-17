import { db } from '@/lib/db/drizzle';
import { templateSections } from '@/lib/db/schema';
import { STATS_SECTIONS } from '@/lib/builder/sections/stats-sections';
import { TIMELINE_SECTIONS } from '@/lib/builder/sections/timeline-sections';
import { ICON_SECTIONS } from '@/lib/builder/sections/icon-sections';
import { COMPARISON_SECTIONS } from '@/lib/builder/sections/comparison-sections';

async function seedNewSections() {
  console.log('🌱 Seeding new sections to database...');

  const allSections = [
    ...STATS_SECTIONS,
    ...TIMELINE_SECTIONS,
    ...ICON_SECTIONS,
    ...COMPARISON_SECTIONS,
  ];

  console.log(`Found ${allSections.length} sections to seed`);

  for (const section of allSections) {
    try {
      // Check if section already exists
      const existing = await db.query.templateSections.findFirst({
        where: (sections, { eq }) => eq(sections.name, section.name),
      });

      if (existing) {
        console.log(`⏭️  Skipping existing section: ${section.name}`);
        continue;
      }

      // Insert new section
      await db.insert(templateSections).values({
        name: section.name,
        category: section.category,
        html: section.html,
        css: '', // Sections use inline styles
        variables: section.variables,
        tags: section.metadata?.tags || [],
        thumbnailUrl: null,
        isActive: true,
      });

      console.log(`✅ Added section: ${section.name} (${section.category})`);
    } catch (error) {
      console.error(`❌ Failed to add section ${section.name}:`, error);
    }
  }

  console.log('✨ Seeding complete!');
  process.exit(0);
}

seedNewSections().catch(console.error);
