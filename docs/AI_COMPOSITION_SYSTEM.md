# AI-Driven Template Composition System

## Overview

This system enables AI to **dynamically select and compose sections** based on:
- **User Intent**: "Create a product launch post for Instagram"
- **Brand DNA**: User's brand archetype, industry, voice, and personality
- **Platform**: Instagram, LinkedIn, TikTok, etc.

The system is **fully prepared** for AI integration but does not yet have the AI logic implemented.

---

## Architecture Components

### 1. Database Schema (✅ COMPLETE)

**Templates Table** (`templates`):
```typescript
{
  id: 'ml-social-proof-stack',
  name: 'Social Proof Stack',
  isMasterLayout: true,                     // Pre-designed starting point
  layoutArchetype: 'social-proof-stack',    // Semantic identifier
  sectionComposition: ['hero-impact-overlay', 'bridge-review-card'], // Section IDs
  compositionRules: {
    minSections: 2,
    maxSections: 4,
    requiredCategories: ['hero'],
    heightBudget: 1080,
    allowOverlap: true
  },
  intentMapping: {
    primary: 'product-launch',
    secondary: ['social-proof', 'conversion']
  },
  brandDnaCompatibility: {
    archetypes: ['hero', 'ruler'],
    industries: ['ecommerce', 'fashion'],
    platforms: ['instagram', 'facebook']
  },
  usageGuidance: 'Best for product launches...',
  aiGenerationPrompt: 'Generate content for social proof stack...'
}
```

**Sections Table** (`template_sections`):
```typescript
{
  id: 1,
  name: 'Impact Hero Overlay',
  category: 'hero',
  html: '<div>...</div>',
  css: '...',
  intentKeywords: ['launch', 'announcement', 'impact'], // AI search terms
  brandArchetypeMatch: ['hero', 'explorer'],          // Compatible brand personalities
  industryFit: ['ecommerce', 'fashion', 'tech'],      // Works best for these industries
  platformOptimized: ['instagram', 'facebook'],       // Platform-specific design
  contentType: 'announcement',                        // Content classification
  emotionalTone: ['energetic', 'urgent'],             // Mood/vibe
  conversionGoal: 'awareness',                        // Business objective
  aiScore: 85                                          // Quality score (0-100)
}
```

### 2. Intent System (✅ COMPLETE)

**Location**: `lib/ai/intent-system.ts`

**Intent Maps**: Predefined mappings of user intent → preferred sections
```typescript
INTENT_SECTION_MAP = {
  'product-launch': {
    preferredCategories: ['hero', 'product', 'bridge'],
    preferredTags: ['impact', 'product', 'cta', 'price'],
    emotionalTone: ['urgent', 'energetic', 'exciting'],
    conversionGoal: 'conversion'
  },
  'social-proof': { /* ... */ },
  'educational-post': { /* ... */ },
  // ... 7 total intent types
}
```

**Brand Archetype Maps**: Aligns section aesthetics with brand personality
```typescript
ARCHETYPE_SECTION_MAP = {
  'hero': {
    preferredMoods: ['energetic', 'urgent', 'powerful'],
    avoidMoods: ['minimalist', 'calm'],
    preferredDensity: ['high', 'medium']
  },
  'sage': { /* ... */ },
  // ... 6 archetypes
}
```

### 3. Template Composer (✅ COMPLETE)

**Location**: `lib/ai/template-composer.ts`

**Key Functions**:
- `querySectionsByCriteria(criteria)` - Database queries with smart filtering
- `composeTemplateFromIntent(intent, brandDNA)` - Main composition logic
- `calculateSectionScore(section, intent, brandDNA)` - 0-100 compatibility score
- `validateComposition(sections, rules)` - Ensures composition follows constraints

**Scoring Algorithm**:
```typescript
calculateSectionScore(section, intent, brandDNA) {
  score = 0;
  
  // Intent keyword matching (30%)
  if (section.intentKeywords includes intent.primary) score += 30;
  
  // Brand archetype alignment (25%)
  if (section.brandArchetypeMatch includes brandDNA.archetype) score += 25;
  
  // Industry fit (20%)
  if (section.industryFit includes brandDNA.industry) score += 20;
  
  // Platform optimization (15%)
  if (section.platformOptimized includes intent.platform) score += 15;
  
  // Emotional tone match (10%)
  if (section.emotionalTone includes brandDNA.emotionalTone) score += 10;
  
  return score; // 0-100
}
```

---

## Data Status

### ✅ Sections Enriched (19 sections)
All sections have AI metadata:
- Heroes (2): Impact Overlay, Split Modern
- Bridges (3): Review Card, Price Bubble, Product Overlap
- UI Mimics (3): Tweet Card, iOS Notification, Google Search
- Frames (3): Polaroid Single, Polaroid Scatter, Film Strip
- Advanced (4): Feature Anatomy, Versus Split, Data Insight, Checklist
- Products (2): Glass Card, Feature List
- Footers (2): Social Minimal, Bold CTA

### ✅ Master Templates Created (17 templates)
All templates have AI composition metadata:
- E-Commerce (7): Social Proof Stack, Feature Anatomy, Versus Comparison, etc.
- B2B/Authority (5): Tweet Authority, Big Number Stats, Checklist, etc.
- Lifestyle (3): Polaroid layouts, Film Strip
- Combo (2): Hero + CTA, Testimonial + Stats

---

## How AI Will Use This System

### User Workflow
```
1. User: "Create a product launch post for my sneakers on Instagram"
2. System extracts:
   - Intent: 'product-launch'
   - Platform: ['instagram']
   - Content Type: 'product'
3. System fetches Brand DNA from database:
   - Archetype: 'hero'
   - Industry: 'fashion'
   - Voice: 'energetic'
4. AI calls: composeTemplateFromIntent(intent, brandDNA)
5. System returns: {
     sectionIds: ['hero-impact-overlay', 'bridge-price-bubble', 'footer-bold-cta'],
     totalHeight: 1080,
     scoreBreakdown: [
       { sectionId: 'hero-impact-overlay', score: 95, reason: 'Perfect match for product launch' },
       { sectionId: 'bridge-price-bubble', score: 88, reason: 'Urgency aligns with energetic brand' },
       { sectionId: 'footer-bold-cta', score: 80, reason: 'Conversion-focused CTA' }
     ]
   }
6. AI populates sections with Brand DNA Content Matrix
7. Template rendered with brand colors, fonts, images
```

### AI Implementation (TODO)

**When ready to implement AI, create**:
`lib/ai/content-generator.ts`:
```typescript
import { composeTemplateFromIntent } from './template-composer';
import { createModel } from './gateway';

export async function generateTemplateFromPrompt(
  userPrompt: string,
  userId: number
) {
  // 1. Extract intent from user prompt (use AI to analyze)
  const model = createModel('fast');
  const intentAnalysis = await model.generateText({
    prompt: `Extract intent from: "${userPrompt}". Return JSON: { primary, platform, conversionGoal }`
  });
  
  // 2. Fetch Brand DNA from database
  const brandDNA = await getBrandSettings(userId);
  
  // 3. Compose template
  const composition = await composeTemplateFromIntent(
    intentAnalysis,
    brandDNA
  );
  
  // 4. Populate sections with Content Matrix
  const populatedSections = await populateSectionsFromBrandDNA(
    composition.sectionIds,
    brandDNA.contentMatrix
  );
  
  return {
    sectionIds: composition.sectionIds,
    content: populatedSections,
    scores: composition.scoreBreakdown
  };
}
```

---

## Example Queries AI Can Execute

### Find Best Hero for Product Launch (Fashion Brand)
```typescript
await querySectionsByCriteria({
  category: 'hero',
  intentKeywords: ['launch', 'product'],
  industryFit: ['fashion'],
  platformOptimized: ['instagram'],
  conversionGoal: 'conversion'
});
```

### Find Social Proof Sections for SaaS
```typescript
await querySectionsByCriteria({
  contentType: 'social-proof',
  industryFit: ['saas'],
  platformOptimized: ['linkedin'],
  brandArchetypeMatch: ['sage', 'hero']
});
```

### Get Recommended Master Templates
```typescript
// Query templates table where isMasterLayout = true
// Filter by intentMapping.primary and brandDnaCompatibility
```

---

## Configuration Files

### Intent Keywords (7 types)
- `product-launch`
- `social-proof`
- `educational-post`
- `announcement`
- `brand-story`
- `comparison`
- `flash-sale`

### Brand Archetypes (6 types)
- `hero` - Bold, courageous, action-oriented
- `sage` - Knowledgeable, trustworthy, analytical
- `explorer` - Adventurous, independent, discovery-focused
- `creator` - Artistic, unique, innovative
- `ruler` - Premium, powerful, authoritative
- `caregiver` - Warm, nurturing, helpful

### Industries (12+ types)
- `ecommerce`, `fashion`, `tech`, `saas`, `beauty`
- `automotive`, `food`, `health`, `education`, `finance`
- `consulting`, `services`, `lifestyle`, `all`

### Platforms (5 types)
- `instagram` (1080x1080, visual-first)
- `linkedin` (professional, data-driven)
- `facebook` (casual, engagement)
- `tiktok` (vertical video adapted to square)
- `pinterest` (aesthetic, discovery)

---

## Next Steps for AI Implementation

### Phase 1: Basic AI Selection (Week 1-2)
- [ ] Create `lib/ai/content-generator.ts`
- [ ] Implement prompt → intent extraction using Vercel AI Gateway
- [ ] Test `composeTemplateFromIntent` with real Brand DNA
- [ ] Build UI to trigger AI generation ("Generate Post" button)

### Phase 2: Content Population (Week 3-4)
- [ ] Use Brand DNA Content Matrix to populate section variables
- [ ] Implement `populateSectionsFromBrandDNA()`
- [ ] Auto-select product images from `brand_products` table
- [ ] Generate headlines/CTAs from brand voice + intent

### Phase 3: Refinement & Learning (Week 5+)
- [ ] Track which templates get thumbs up/down
- [ ] Adjust `aiScore` based on user feedback
- [ ] A/B test section combinations
- [ ] Build "Regenerate" button to try different compositions

---

## Benefits of This Architecture

✅ **Fully AI-Ready**: Database schema and logic prepared for AI integration  
✅ **No Hardcoding**: Sections can be mixed, matched, and scored dynamically  
✅ **Brand-Aware**: Every decision considers user's brand personality  
✅ **Platform-Optimized**: Templates adapt to Instagram vs LinkedIn aesthetics  
✅ **Scalable**: Add new sections without changing AI logic  
✅ **Transparent**: AI scores show why each section was selected  
✅ **Flexible**: User can override AI suggestions in Template Builder  

---

## Technical Details

### Database Queries Use PostgreSQL Array Operations
```sql
-- Find sections matching intent keywords
SELECT * FROM template_sections
WHERE intent_keywords && ARRAY['launch', 'product']::text[];

-- Find sections for specific platforms
SELECT * FROM template_sections
WHERE platform_optimized && ARRAY['instagram']::text[];
```

### Composition Rules Enforce Constraints
```typescript
{
  minSections: 1,        // At least 1 section
  maxSections: 4,        // Max 4 to avoid clutter
  requiredCategories: ['hero'], // Must have hero
  heightBudget: 1080,    // Instagram square
  allowOverlap: true     // Bridges can overlap
}
```

### Validation Prevents Bad Compositions
```typescript
validateComposition(sections, rules);
// Returns: { isValid: false, errors: ['Missing required category: hero'] }
```

---

## Files Created

1. ✅ **Schema Migration** (`lib/db/migrations/0016_massive_stellaris.sql`)
   - Added AI metadata fields to `templates` and `template_sections`

2. ✅ **Intent System** (`lib/ai/intent-system.ts`)
   - Maps user intent → section preferences
   - Brand archetype → aesthetic preferences
   - Platform → composition rules

3. ✅ **Template Composer** (`lib/ai/template-composer.ts`)
   - Smart section queries
   - Scoring algorithm
   - Validation logic

4. ✅ **Enrichment Script** (`scripts/enrich-sections-ai.ts`)
   - Populated 19 sections with AI metadata

5. ✅ **Master Templates** (`scripts/seed-master-templates.ts`)
   - Created 17 professional layouts
   - Added AI composition metadata

---

## Summary

**The system is now fully prepared for AI integration.** All metadata, scoring algorithms, and composition logic are in place. When ready to implement AI:

1. Create AI service that calls `composeTemplateFromIntent()`
2. Connect to Vercel AI Gateway to analyze user prompts
3. Populate sections with Brand DNA Content Matrix
4. Render final template with brand styling

**No hardcoded sections** - everything is dynamic, scored, and AI-optimized! 🚀
