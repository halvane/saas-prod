import { SECTIONS } from '@/lib/builder/library';

/**
 * Variation Engine
 * Generates infinite variations of Master Templates by swapping compatible sections.
 */

export interface VariationOptions {
  seed: number;
  count: number;
}

export function generateVariations(masterTemplates: any[], options: VariationOptions) {
  const { seed, count } = options;
  const variations: any[] = [];
  
  // Helper for deterministic randomness
  let currentSeed = seed;
  const random = () => {
    const x = Math.sin(currentSeed++) * 10000;
    return x - Math.floor(x);
  };
  
  const pick = <T>(arr: T[]): T => arr[Math.floor(random() * arr.length)];

  // Group sections by category for easy swapping
  const sectionsByCategory: Record<string, string[]> = {};
  SECTIONS.forEach(s => {
    if (!sectionsByCategory[s.category]) sectionsByCategory[s.category] = [];
    sectionsByCategory[s.category].push(s.id);
  });

  for (let i = 0; i < count; i++) {
    // 1. Pick a base template
    if (masterTemplates.length === 0) break;
    const base = pick(masterTemplates);
    
    // 2. Clone it
    const variation = { ...base };
    variation.id = `${base.id}-v${options.seed}-${i}`;
    variation.isVariation = true;
    
    // 3. Perform a "Remix" (Swap 1-2 sections)
    const composition = [...(base.sectionComposition || [])];
    
    // Try to swap the Hero (usually the first section)
    // or a random section
    const swapIndex = Math.floor(random() * composition.length);
    const originalSectionId = composition[swapIndex];
    const originalSection = SECTIONS.find(s => s.id === originalSectionId);
    
    if (originalSection) {
      const category = originalSection.category;
      const candidates = sectionsByCategory[category] || [];
      
      // Filter out the current one to ensure a change
      const alternatives = candidates.filter(id => id !== originalSectionId);
      
      if (alternatives.length > 0) {
        const replacement = pick(alternatives);
        composition[swapIndex] = replacement;
        
        // Update metadata
        variation.name = `${base.name} ${String.fromCharCode(65 + i)}`; // "Social Proof Stack A"
        variation.sectionComposition = composition;
        
        // Add variation tag
        variation.semanticTags = [...(variation.semanticTags || []), 'remix'];
      }
    }
    
    variations.push(variation);
  }

  return variations;
}
