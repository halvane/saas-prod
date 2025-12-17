/**
 * AI Intent System - Maps user intent to template/section selection
 * 
 * This system will be used by AI to:
 * 1. Analyze user's request ("create a product launch post")
 * 2. Extract Brand DNA compatibility
 * 3. Select appropriate sections dynamically
 * 4. Compose templates on-the-fly
 * 
 * Example Flow:
 * User: "Create a product announcement for my new sneakers"
 * → AI extracts: intent='product-launch', contentType='product', industry='fashion'
 * → System queries sections matching criteria
 * → AI composes: ['hero-impact-overlay', 'bridge-price-bubble', 'footer-bold-cta']
 * → AI populates variables from Brand DNA + Content Matrix
 */

export interface UserIntent {
  primary: string; // 'product-launch', 'educational-post', 'social-proof', 'announcement'
  secondary?: string[]; // Additional context
  platform: string[]; // ['instagram', 'linkedin']
  urgency?: 'high' | 'medium' | 'low';
  conversionGoal?: 'awareness' | 'engagement' | 'conversion' | 'retention';
}

export interface BrandDNAContext {
  archetype?: string; // From brand_settings.brandArchetype
  industry?: string; // From brand_settings.brandIndustry
  voice?: string; // From brand_settings.brandVoice
  emotionalTone?: string[]; // Derived from archetype
  targetAudience?: string; // From brand_settings.brandAudience
}

export interface SectionSelectionCriteria {
  category?: string; // 'hero', 'product', 'footer', etc.
  intentKeywords?: string[];
  brandArchetypeMatch?: string[];
  industryFit?: string[];
  platformOptimized?: string[];
  contentType?: string;
  emotionalTone?: string[];
  conversionGoal?: string;
  minAiScore?: number; // Minimum quality threshold
}

export interface CompositionRules {
  minSections: number;
  maxSections: number;
  requiredCategories: string[]; // e.g., ['hero'] - must have at least one hero
  optionalCategories: string[]; // e.g., ['footer', 'bridge']
  heightBudget: number; // Total height constraint (1080 for Instagram)
  allowOverlap: boolean; // Can use bridges/overlays that violate height budget
}

/**
 * Intent to Section Mapping
 * Defines which section types work best for each user intent
 */
export const INTENT_SECTION_MAP: Record<string, {
  preferredCategories: string[];
  preferredTags: string[];
  emotionalTone: string[];
  conversionGoal: string;
}> = {
  'product-launch': {
    preferredCategories: ['hero', 'product', 'bridge'],
    preferredTags: ['impact', 'product', 'cta', 'price'],
    emotionalTone: ['urgent', 'energetic', 'exciting'],
    conversionGoal: 'conversion'
  },
  'social-proof': {
    preferredCategories: ['ui-mimic', 'bridge', 'text'],
    preferredTags: ['testimonial', 'review', 'trust', 'authority'],
    emotionalTone: ['trustworthy', 'professional', 'calm'],
    conversionGoal: 'engagement'
  },
  'educational-post': {
    preferredCategories: ['advanced', 'text', 'features'],
    preferredTags: ['checklist', 'guide', 'tutorial', 'data'],
    emotionalTone: ['professional', 'informative', 'helpful'],
    conversionGoal: 'awareness'
  },
  'announcement': {
    preferredCategories: ['hero', 'ui-mimic', 'footer'],
    preferredTags: ['notification', 'alert', 'news', 'cta'],
    emotionalTone: ['urgent', 'exciting', 'professional'],
    conversionGoal: 'awareness'
  },
  'brand-story': {
    preferredCategories: ['frame', 'hero', 'text'],
    preferredTags: ['aesthetic', 'storytelling', 'emotional', 'vintage'],
    emotionalTone: ['calm', 'nostalgic', 'warm'],
    conversionGoal: 'engagement'
  },
  'comparison': {
    preferredCategories: ['advanced', 'product'],
    preferredTags: ['versus', 'comparison', 'before-after', 'data'],
    emotionalTone: ['analytical', 'professional'],
    conversionGoal: 'conversion'
  },
  'flash-sale': {
    preferredCategories: ['hero', 'bridge', 'footer'],
    preferredTags: ['urgent', 'price', 'cta', 'countdown'],
    emotionalTone: ['urgent', 'energetic', 'exciting'],
    conversionGoal: 'conversion'
  }
};

/**
 * Brand Archetype to Section Mapping
 * Aligns section aesthetics with brand personality
 */
export const ARCHETYPE_SECTION_MAP: Record<string, {
  preferredMoods: string[];
  avoidMoods: string[];
  preferredDensity: string[];
}> = {
  'hero': {
    preferredMoods: ['energetic', 'urgent', 'powerful'],
    avoidMoods: ['minimalist', 'calm'],
    preferredDensity: ['high', 'medium']
  },
  'sage': {
    preferredMoods: ['trustworthy', 'professional', 'calm'],
    avoidMoods: ['playful', 'chaotic'],
    preferredDensity: ['medium', 'low']
  },
  'explorer': {
    preferredMoods: ['adventurous', 'energetic', 'bold'],
    avoidMoods: ['conservative', 'minimal'],
    preferredDensity: ['high', 'medium']
  },
  'creator': {
    preferredMoods: ['artistic', 'unique', 'aesthetic'],
    avoidMoods: ['corporate', 'conservative'],
    preferredDensity: ['medium', 'high']
  },
  'ruler': {
    preferredMoods: ['luxury', 'premium', 'powerful'],
    avoidMoods: ['casual', 'playful'],
    preferredDensity: ['low', 'medium']
  },
  'caregiver': {
    preferredMoods: ['warm', 'trustworthy', 'friendly'],
    avoidMoods: ['aggressive', 'urgent'],
    preferredDensity: ['medium', 'low']
  }
};

/**
 * Default Composition Rules by Platform
 */
export const PLATFORM_COMPOSITION_RULES: Record<string, CompositionRules> = {
  instagram: {
    minSections: 1,
    maxSections: 4,
    requiredCategories: ['hero'],
    optionalCategories: ['bridge', 'footer', 'product'],
    heightBudget: 1080,
    allowOverlap: true // Bridges can exceed budget
  },
  linkedin: {
    minSections: 2,
    maxSections: 5,
    requiredCategories: ['hero'],
    optionalCategories: ['features', 'footer', 'text'],
    heightBudget: 1080,
    allowOverlap: false
  },
  facebook: {
    minSections: 1,
    maxSections: 4,
    requiredCategories: ['hero'],
    optionalCategories: ['bridge', 'footer', 'product'],
    heightBudget: 1080,
    allowOverlap: true
  },
  twitter: {
    minSections: 1,
    maxSections: 3,
    requiredCategories: ['hero'],
    optionalCategories: ['ui-mimic', 'text'],
    heightBudget: 1080,
    allowOverlap: true
  },
  pinterest: {
    minSections: 1,
    maxSections: 5,
    requiredCategories: ['hero'],
    optionalCategories: ['frame', 'text', 'product'],
    heightBudget: 1080,
    allowOverlap: true
  }
};

/**
 * AI Section Scoring Algorithm
 * (To be implemented in AI service)
 * 
 * Calculates compatibility score (0-100) for a section based on:
 * - Intent keyword matching (30%)
 * - Brand archetype alignment (25%)
 * - Industry fit (20%)
 * - Platform optimization (15%)
 * - Emotional tone match (10%)
 * 
 * Example:
 * calculateSectionScore(section, userIntent, brandDNA) => 85
 */
export function calculateSectionScore(
  section: any, // TemplateSection from DB
  intent: UserIntent,
  brandDNA: BrandDNAContext
): number {
  let score = 0;

  // Intent keyword matching (30 points)
  const intentKeywordMatches = section.intentKeywords?.filter((kw: string) => 
    intent.primary.includes(kw) || intent.secondary?.includes(kw)
  ).length || 0;
  score += Math.min(intentKeywordMatches * 10, 30);

  // Brand archetype alignment (25 points)
  if (brandDNA.archetype && section.brandArchetypeMatch?.includes(brandDNA.archetype)) {
    score += 25;
  }

  // Industry fit (20 points)
  if (brandDNA.industry && section.industryFit?.includes(brandDNA.industry)) {
    score += 20;
  }

  // Platform optimization (15 points)
  const platformMatches = section.platformOptimized?.filter((p: string) => 
    intent.platform.includes(p)
  ).length || 0;
  score += Math.min(platformMatches * 7.5, 15);

  // Emotional tone match (10 points)
  const toneMatches = section.emotionalTone?.filter((t: string) => 
    brandDNA.emotionalTone?.includes(t)
  ).length || 0;
  score += Math.min(toneMatches * 5, 10);

  return Math.min(score, 100);
}

/**
 * Template Selection Strategy
 * (To be called by AI service)
 * 
 * 1. User provides intent: "Create a product launch post for Instagram"
 * 2. System extracts: UserIntent + BrandDNAContext
 * 3. Query sections with matching criteria
 * 4. Score each section using calculateSectionScore()
 * 5. Compose template respecting CompositionRules
 * 6. Return section IDs for AI to populate
 */
