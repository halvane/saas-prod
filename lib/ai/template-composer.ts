import { db } from '../db/drizzle';
import { templateSections } from '../db/schema';
import { eq, and, inArray, sql } from 'drizzle-orm';
import { 
  UserIntent, 
  BrandDNAContext, 
  SectionSelectionCriteria,
  CompositionRules,
  PLATFORM_COMPOSITION_RULES,
  INTENT_SECTION_MAP,
  calculateSectionScore
} from '../ai/intent-system';

/**
 * AI Template Composer
 * Dynamically selects and composes sections based on user intent and Brand DNA
 * 
 * This module will be used by the AI service to:
 * 1. Analyze user requests
 * 2. Query compatible sections from database
 * 3. Score sections by compatibility
 * 4. Compose optimal template layouts
 * 5. Return section IDs for content population
 */

export interface ComposedTemplate {
  sectionIds: string[];
  totalHeight: number;
  compositionStrategy: string;
  scoreBreakdown: {
    sectionId: string;
    score: number;
    reason: string;
  }[];
}

/**
 * Query sections from database based on criteria
 */
export async function querySectionsByCriteria(
  criteria: SectionSelectionCriteria
): Promise<any[]> {
  const conditions = [];

  if (criteria.category) {
    conditions.push(eq(templateSections.category, criteria.category));
  }

  if (criteria.contentType) {
    conditions.push(eq(templateSections.contentType, criteria.contentType));
  }

  if (criteria.conversionGoal) {
    conditions.push(eq(templateSections.conversionGoal, criteria.conversionGoal));
  }

  // Array field filtering (PostgreSQL array operations)
  if (criteria.intentKeywords && criteria.intentKeywords.length > 0) {
    conditions.push(
      sql`${templateSections.intentKeywords} && ARRAY[${sql.join(
        criteria.intentKeywords.map(k => sql`${k}`),
        sql`, `
      )}]::text[]`
    );
  }

  if (criteria.platformOptimized && criteria.platformOptimized.length > 0) {
    conditions.push(
      sql`${templateSections.platformOptimized} && ARRAY[${sql.join(
        criteria.platformOptimized.map(p => sql`${p}`),
        sql`, `
      )}]::text[]`
    );
  }

  const query = db
    .select()
    .from(templateSections)
    .where(and(...conditions));

  return await query;
}

/**
 * Smart Section Composer
 * Main AI composition logic
 */
export async function composeTemplateFromIntent(
  intent: UserIntent,
  brandDNA: BrandDNAContext
): Promise<ComposedTemplate> {
  // Get composition rules for platform
  const rules = intent.platform[0] 
    ? PLATFORM_COMPOSITION_RULES[intent.platform[0]] 
    : PLATFORM_COMPOSITION_RULES.instagram;

  // Get intent mapping
  const intentConfig = INTENT_SECTION_MAP[intent.primary];
  
  const scoreBreakdown: { sectionId: string; score: number; reason: string }[] = [];
  const selectedSections: any[] = [];

  // Step 1: Find hero section (required)
  const heroCriteria: SectionSelectionCriteria = {
    category: 'hero',
    platformOptimized: intent.platform,
    intentKeywords: intentConfig?.preferredTags || [],
    conversionGoal: intent.conversionGoal || intentConfig?.conversionGoal
  };

  const heroSections = await querySectionsByCriteria(heroCriteria);
  const scoredHeroes = heroSections.map(section => ({
    section,
    score: calculateSectionScore(section, intent, brandDNA)
  }));
  scoredHeroes.sort((a, b) => b.score - a.score);

  if (scoredHeroes.length > 0) {
    const bestHero = scoredHeroes[0];
    selectedSections.push(bestHero.section);
    scoreBreakdown.push({
      sectionId: bestHero.section.id,
      score: bestHero.score,
      reason: `Selected as primary hero (score: ${bestHero.score})`
    });
  }

  // Step 2: Find complementary sections based on intent
  if (intentConfig) {
    for (const category of intentConfig.preferredCategories) {
      if (category === 'hero') continue; // Already selected

      const categoryCriteria: SectionSelectionCriteria = {
        category,
        platformOptimized: intent.platform,
        intentKeywords: intentConfig.preferredTags,
        emotionalTone: intentConfig.emotionalTone,
        conversionGoal: intentConfig.conversionGoal
      };

      const categorySections = await querySectionsByCriteria(categoryCriteria);
      const scoredSections = categorySections.map(section => ({
        section,
        score: calculateSectionScore(section, intent, brandDNA)
      }));
      scoredSections.sort((a, b) => b.score - a.score);

      // Take top section from this category if score is good
      if (scoredSections.length > 0 && scoredSections[0].score >= 50) {
        const bestSection = scoredSections[0];
        selectedSections.push(bestSection.section);
        scoreBreakdown.push({
          sectionId: bestSection.section.id,
          score: bestSection.score,
          reason: `Selected for ${category} (score: ${bestSection.score})`
        });

        // Stop if we've reached max sections
        if (selectedSections.length >= rules.maxSections) break;
      }
    }
  }

  // Calculate total height
  const totalHeight = selectedSections.reduce(
    (sum, section) => sum + (section.metadata?.height || 0), 
    0
  );

  return {
    sectionIds: selectedSections.map(s => s.id),
    totalHeight,
    compositionStrategy: `Intent-driven composition for ${intent.primary} (${selectedSections.length} sections)`,
    scoreBreakdown
  };
}

/**
 * Get master template recommendations
 * Returns pre-composed templates that match user intent
 */
export async function getMasterTemplateRecommendations(
  intent: UserIntent,
  brandDNA: BrandDNAContext,
  limit: number = 5
): Promise<any[]> {
  // This will query the templates table for isMasterLayout=true
  // and score them based on intentMapping and brandDnaCompatibility
  // (To be implemented when templates table is populated with AI metadata)
  
  return [];
}

/**
 * Validate section composition
 * Ensures composition follows rules and constraints
 */
export function validateComposition(
  sections: any[],
  rules: CompositionRules
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check section count
  if (sections.length < rules.minSections) {
    errors.push(`Too few sections: ${sections.length} < ${rules.minSections}`);
  }
  if (sections.length > rules.maxSections) {
    errors.push(`Too many sections: ${sections.length} > ${rules.maxSections}`);
  }

  // Check required categories
  for (const requiredCat of rules.requiredCategories) {
    if (!sections.some(s => s.category === requiredCat)) {
      errors.push(`Missing required category: ${requiredCat}`);
    }
  }

  // Check height budget (unless overlaps allowed)
  if (!rules.allowOverlap) {
    const totalHeight = sections.reduce((sum, s) => sum + (s.metadata?.height || 0), 0);
    if (totalHeight > rules.heightBudget) {
      errors.push(`Height budget exceeded: ${totalHeight} > ${rules.heightBudget}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
