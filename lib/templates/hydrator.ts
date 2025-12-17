import { db } from '@/lib/db/drizzle';
import { templateSections } from '@/lib/db/schema';
import { inArray } from 'drizzle-orm';
import { SECTIONS } from '@/lib/builder/library';

/**
 * Hydrates a Master Template (which only contains a list of section IDs)
 * into a full Template object with HTML, CSS, and Variables.
 */
export async function hydrateMasterTemplate(masterTemplate: any) {
  // If it's not a master layout or has no composition, return as is
  if (!masterTemplate.isMasterLayout || !masterTemplate.sectionComposition || masterTemplate.sectionComposition.length === 0) {
    return masterTemplate;
  }

  const compositionIds = masterTemplate.sectionComposition as string[];

  // 1. Map IDs (slugs) to Names using the Library
  // We do this because the DB uses integer IDs, but our composition uses stable string slugs
  const names = compositionIds.map(slug => {
    const section = SECTIONS.find(s => s.id === slug);
    return section ? section.name : null;
  }).filter(Boolean) as string[];

  if (names.length === 0) {
    console.warn(`[Hydrator] No matching sections found for template: ${masterTemplate.name}`);
    return masterTemplate;
  }

  // 2. Fetch Sections from DB
  const dbSections = await db.query.templateSections.findMany({
    where: inArray(templateSections.name, names)
  });

  // 3. Sort sections to match the composition order
  // We create a map of Name -> Section to easily retrieve them in order
  const sectionMap = new Map(dbSections.map(s => [s.name, s]));
  
  const orderedSections = compositionIds.map(slug => {
    const libSection = SECTIONS.find(s => s.id === slug);
    if (!libSection) return null;
    return sectionMap.get(libSection.name);
  }).filter(Boolean);

  // 4. Stitch HTML and CSS
  // We wrap each section in a div with a unique ID or class if needed, 
  // but for now simple concatenation works as they are usually self-contained blocks.
  // We also inject a background layer if one isn't present to ensure "Pro" look.
  
  let htmlTemplate = orderedSections.map((s: any) => s.html).join('\n');
  const cssTemplate = orderedSections.map((s: any) => s.css).join('\n');

  // Check if we have a hero or background section
  const hasBackground = compositionIds.some(id => id.includes('hero') || id.includes('background'));
  
  if (!hasBackground) {
      // Inject a subtle gradient background if missing
      htmlTemplate = `
        <div class="absolute inset-0 z-0 bg-gradient-to-br from-[var(--brand-secondary)] to-gray-100"></div>
        ${htmlTemplate}
      `;
  }

  // 5. Merge Variables
  // We merge all variables from all sections. 
  // Later, the Content Mapper will fill these.
  const variables = orderedSections.reduce((acc: any, s: any) => {
    return { ...acc, ...(s.variables || {}) };
  }, {});

  // 6. Return Hydrated Template
  // We preserve the original ID and metadata, but populate the content fields
  return {
    ...masterTemplate,
    htmlTemplate,
    cssTemplate,
    variables,
    // We can also store the hydrated state to avoid re-hydration if cached
    isHydrated: true
  };
}
