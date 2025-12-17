import { db } from '../lib/db/drizzle';
import { templateSections } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import { SECTIONS } from '../lib/builder/library';

/**
 * Enriches existing sections with AI metadata
 * This adds intent keywords, archetype matching, and industry fit
 * to enable AI-driven section selection
 */

const AI_METADATA_ENRICHMENT: Record<string, {
  intentKeywords: string[];
  brandArchetypeMatch: string[];
  industryFit: string[];
  platformOptimized: string[];
  contentType: string;
  emotionalTone: string[];
  conversionGoal: string;
}> = {
  // Heroes
  'hero-impact-overlay': {
    intentKeywords: ['launch', 'announcement', 'impact', 'product', 'urgent'],
    brandArchetypeMatch: ['hero', 'explorer', 'ruler'],
    industryFit: ['ecommerce', 'fashion', 'tech', 'automotive', 'sports'],
    platformOptimized: ['instagram', 'facebook', 'tiktok'],
    contentType: 'announcement',
    emotionalTone: ['energetic', 'urgent', 'powerful'],
    conversionGoal: 'awareness'
  },
  'hero-split-modern': {
    intentKeywords: ['product', 'clean', 'modern', 'professional', 'minimal'],
    brandArchetypeMatch: ['sage', 'creator', 'ruler'],
    industryFit: ['saas', 'tech', 'fashion', 'design', 'architecture'],
    platformOptimized: ['linkedin', 'instagram', 'pinterest'],
    contentType: 'product',
    emotionalTone: ['professional', 'calm', 'trustworthy'],
    conversionGoal: 'engagement'
  },

  // Bridges
  'bridge-review-card': {
    intentKeywords: ['review', 'testimonial', 'social-proof', 'trust', 'rating'],
    brandArchetypeMatch: ['caregiver', 'sage', 'everyman'],
    industryFit: ['ecommerce', 'saas', 'services', 'hospitality', 'beauty'],
    platformOptimized: ['instagram', 'facebook', 'linkedin'],
    contentType: 'social-proof',
    emotionalTone: ['trustworthy', 'warm', 'authentic'],
    conversionGoal: 'conversion'
  },
  'bridge-price-bubble': {
    intentKeywords: ['sale', 'price', 'discount', 'offer', 'urgent', 'limited'],
    brandArchetypeMatch: ['hero', 'magician', 'jester'],
    industryFit: ['ecommerce', 'fashion', 'retail', 'beauty', 'food'],
    platformOptimized: ['instagram', 'facebook', 'tiktok'],
    contentType: 'product',
    emotionalTone: ['urgent', 'exciting', 'energetic'],
    conversionGoal: 'conversion'
  },
  'bridge-product-overlap': {
    intentKeywords: ['product', 'feature', 'showcase', 'premium', 'luxury'],
    brandArchetypeMatch: ['ruler', 'creator', 'hero'],
    industryFit: ['ecommerce', 'tech', 'fashion', 'automotive', 'luxury'],
    platformOptimized: ['instagram', 'facebook', 'pinterest'],
    contentType: 'product',
    emotionalTone: ['premium', 'sophisticated', 'modern'],
    conversionGoal: 'engagement'
  },

  // UI Mimics
  'ui-tweet-card': {
    intentKeywords: ['social', 'testimonial', 'quote', 'authority', 'expert'],
    brandArchetypeMatch: ['sage', 'hero', 'everyman'],
    industryFit: ['saas', 'tech', 'consulting', 'education', 'media'],
    platformOptimized: ['linkedin', 'twitter', 'instagram'],
    contentType: 'social-proof',
    emotionalTone: ['trustworthy', 'professional', 'authentic'],
    conversionGoal: 'engagement'
  },
  'ui-ios-notification': {
    intentKeywords: ['alert', 'notification', 'urgent', 'reminder', 'update'],
    brandArchetypeMatch: ['hero', 'magician', 'everyman'],
    industryFit: ['saas', 'tech', 'events', 'education', 'services'],
    platformOptimized: ['instagram', 'facebook', 'linkedin'],
    contentType: 'announcement',
    emotionalTone: ['urgent', 'attention', 'important'],
    conversionGoal: 'awareness'
  },
  'ui-google-search': {
    intentKeywords: ['search', 'seo', 'query', 'curiosity', 'education'],
    brandArchetypeMatch: ['sage', 'explorer', 'magician'],
    industryFit: ['saas', 'education', 'consulting', 'media', 'tech'],
    platformOptimized: ['linkedin', 'instagram', 'facebook'],
    contentType: 'educational',
    emotionalTone: ['curious', 'informative', 'professional'],
    conversionGoal: 'awareness'
  },

  // Frames
  'frame-polaroid-single': {
    intentKeywords: ['aesthetic', 'memory', 'vintage', 'moment', 'story'],
    brandArchetypeMatch: ['creator', 'caregiver', 'explorer'],
    industryFit: ['lifestyle', 'photography', 'travel', 'fashion', 'food'],
    platformOptimized: ['instagram', 'pinterest', 'tiktok'],
    contentType: 'lifestyle',
    emotionalTone: ['nostalgic', 'warm', 'casual'],
    conversionGoal: 'engagement'
  },
  'frame-polaroid-scatter': {
    intentKeywords: ['memories', 'collection', 'story', 'aesthetic', 'casual'],
    brandArchetypeMatch: ['creator', 'explorer', 'jester'],
    industryFit: ['lifestyle', 'photography', 'travel', 'events', 'personal'],
    platformOptimized: ['instagram', 'pinterest', 'facebook'],
    contentType: 'lifestyle',
    emotionalTone: ['playful', 'warm', 'casual'],
    conversionGoal: 'engagement'
  },
  'frame-film-strip': {
    intentKeywords: ['cinema', 'sequence', 'story', 'vintage', 'artistic'],
    brandArchetypeMatch: ['creator', 'explorer', 'magician'],
    industryFit: ['film', 'photography', 'art', 'events', 'creative'],
    platformOptimized: ['instagram', 'pinterest', 'tiktok'],
    contentType: 'lifestyle',
    emotionalTone: ['artistic', 'cinematic', 'nostalgic'],
    conversionGoal: 'engagement'
  },

  // Advanced
  'advanced-feature-anatomy': {
    intentKeywords: ['features', 'benefits', 'product', 'tech', 'showcase'],
    brandArchetypeMatch: ['magician', 'hero', 'sage'],
    industryFit: ['tech', 'saas', 'automotive', 'electronics', 'innovation'],
    platformOptimized: ['linkedin', 'instagram', 'facebook'],
    contentType: 'product',
    emotionalTone: ['innovative', 'impressive', 'modern'],
    conversionGoal: 'engagement'
  },
  'advanced-versus-split': {
    intentKeywords: ['comparison', 'before-after', 'transformation', 'upgrade'],
    brandArchetypeMatch: ['hero', 'magician', 'ruler'],
    industryFit: ['tech', 'beauty', 'fitness', 'saas', 'automotive'],
    platformOptimized: ['instagram', 'facebook', 'linkedin'],
    contentType: 'comparison',
    emotionalTone: ['analytical', 'impressive', 'transformative'],
    conversionGoal: 'conversion'
  },
  'advanced-data-insight': {
    intentKeywords: ['data', 'statistics', 'proof', 'results', 'roi'],
    brandArchetypeMatch: ['sage', 'hero', 'ruler'],
    industryFit: ['saas', 'consulting', 'finance', 'tech', 'b2b'],
    platformOptimized: ['linkedin', 'twitter', 'instagram'],
    contentType: 'educational',
    emotionalTone: ['professional', 'impressive', 'trustworthy'],
    conversionGoal: 'awareness'
  },
  'advanced-checklist': {
    intentKeywords: ['guide', 'tips', 'checklist', 'education', 'tutorial'],
    brandArchetypeMatch: ['sage', 'caregiver', 'everyman'],
    industryFit: ['education', 'saas', 'consulting', 'productivity', 'health'],
    platformOptimized: ['linkedin', 'instagram', 'pinterest'],
    contentType: 'educational',
    emotionalTone: ['helpful', 'informative', 'actionable'],
    conversionGoal: 'awareness'
  },

  // Products
  'product-glass-card': {
    intentKeywords: ['product', 'premium', 'modern', 'luxury', 'showcase'],
    brandArchetypeMatch: ['ruler', 'creator', 'magician'],
    industryFit: ['ecommerce', 'tech', 'fashion', 'luxury', 'design'],
    platformOptimized: ['instagram', 'facebook', 'pinterest'],
    contentType: 'product',
    emotionalTone: ['premium', 'modern', 'sophisticated'],
    conversionGoal: 'conversion'
  },
  'product-feature-list': {
    intentKeywords: ['features', 'benefits', 'product', 'details', 'specs'],
    brandArchetypeMatch: ['sage', 'hero', 'everyman'],
    industryFit: ['ecommerce', 'tech', 'automotive', 'electronics', 'saas'],
    platformOptimized: ['instagram', 'facebook', 'linkedin'],
    contentType: 'product',
    emotionalTone: ['informative', 'professional', 'clear'],
    conversionGoal: 'engagement'
  },

  // Footers
  'footer-social-minimal': {
    intentKeywords: ['social', 'contact', 'follow', 'connect', 'minimal'],
    brandArchetypeMatch: ['everyman', 'caregiver', 'sage'],
    industryFit: ['all'],
    platformOptimized: ['instagram', 'linkedin', 'facebook', 'pinterest'],
    contentType: 'engagement',
    emotionalTone: ['friendly', 'approachable', 'calm'],
    conversionGoal: 'retention'
  },
  'footer-bold-cta': {
    intentKeywords: ['cta', 'action', 'urgent', 'conversion', 'button'],
    brandArchetypeMatch: ['hero', 'magician', 'ruler'],
    industryFit: ['all'],
    platformOptimized: ['instagram', 'facebook', 'linkedin'],
    contentType: 'conversion',
    emotionalTone: ['urgent', 'bold', 'clear'],
    conversionGoal: 'conversion'
  }
};

async function enrichSectionsWithAI() {
  console.log('🧠 Enriching sections with AI metadata...\n');

  let updated = 0;
  let skipped = 0;

  for (const [sectionId, metadata] of Object.entries(AI_METADATA_ENRICHMENT)) {
    try {
      // Find section by matching the id stored in the name field from seed script
      const sections = await db.select().from(templateSections);
      const existing = sections.find(s => {
        // Check if the section was seeded with this ID
        const sectionFromLibrary = SECTIONS.find(sec => sec.id === sectionId);
        return sectionFromLibrary && s.name === sectionFromLibrary.name;
      });

      if (!existing) {
        console.log(`  ⚠️  Section not found: ${sectionId}`);
        skipped++;
        continue;
      }

      await db.update(templateSections)
        .set({
          intentKeywords: metadata.intentKeywords,
          brandArchetypeMatch: metadata.brandArchetypeMatch,
          industryFit: metadata.industryFit,
          platformOptimized: metadata.platformOptimized,
          contentType: metadata.contentType,
          emotionalTone: metadata.emotionalTone,
          conversionGoal: metadata.conversionGoal,
          aiScore: 85 // Default quality score
        })
        .where(eq(templateSections.id, existing.id));

      console.log(`  ✅ Enriched: ${existing.name}`);
      updated++;
    } catch (error) {
      console.error(`  ❌ Error enriching ${sectionId}:`, error);
      skipped++;
    }
  }

  console.log(`\n✅ AI Enrichment Complete!`);
  console.log(`   📊 Updated: ${updated}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   📦 Total: ${Object.keys(AI_METADATA_ENRICHMENT).length}\n`);
  
  process.exit(0);
}

enrichSectionsWithAI();
