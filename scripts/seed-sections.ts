
import { db } from '../lib/db/drizzle';
import { templateSections } from '../lib/db/schema';
import { SECTIONS } from '../lib/builder/library';
import { EffectRegistry } from '../lib/builder/effects';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Seeding sections from Builder Library...');
  
  try {
    // 1. Seed Sections
    console.log(`Found ${SECTIONS.length} sections.`);
    for (const section of SECTIONS) {
      // Check if exists
      const existing = await db.query.templateSections.findFirst({
        where: (table, { eq }) => eq(table.name, section.name)
      });

      const values = {
        name: section.name,
        category: section.category,
        html: section.html,
        css: '', // Library sections use Tailwind
        variables: Object.keys(section.variables || {}),
        tags: section.metadata?.tags || [],
        thumbnailUrl: '', 
        isActive: true,
      };

      if (existing) {
        console.log(`  - Updating ${section.name}`);
        await db.update(templateSections)
          .set(values)
          .where(eq(templateSections.id, existing.id));
      } else {
        console.log(`  - Inserting ${section.name}`);
        await db.insert(templateSections).values(values);
      }
    }

    // 2. Seed Effects
    const effects = EffectRegistry.getAll();
    console.log(`Found ${effects.length} effects.`);
    
    for (const effect of effects) {
      const existing = await db.query.templateSections.findFirst({
        where: (table, { eq }) => eq(table.name, effect.name)
      });

      const values = {
        name: effect.name,
        category: 'effect',
        html: '<div class="demo-box w-full h-full bg-gray-200 flex items-center justify-center">Effect Demo</div>',
        css: `.${effect.className} { /* Tailwind: ${effect.className} */ }`, 
        variables: [],
        tags: [effect.category, 'effect'],
        isActive: true,
      };

      if (existing) {
        console.log(`  - Updating Effect: ${effect.name}`);
        await db.update(templateSections)
          .set(values)
          .where(eq(templateSections.id, existing.id));
      } else {
        console.log(`  - Inserting Effect: ${effect.name}`);
        await db.insert(templateSections).values(values);
      }
    }

    console.log('✅ Done!');
  } catch (error) {
    console.error('Error seeding sections:', error);
  }
  process.exit(0);
}

seed();
