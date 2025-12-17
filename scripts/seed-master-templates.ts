import { db } from '../lib/db/drizzle';
import { templates, templateEmbeddings } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

const MASTER_TEMPLATES = [
  // --- PRO SOCIAL TEMPLATES (New High Quality) ---
  {
    id: 'pro-review-spotlight',
    name: 'Review Spotlight Pro',
    description: 'High-end testimonial card with full background image, perfect for Airbnb or hospitality.',
    category: 'social-proof',
    platform: ['instagram', 'facebook'],
    isMasterLayout: true,
    layoutArchetype: 'review-spotlight',
    usageGuidance: 'Use high-quality background images. Great for showcasing customer experiences.',
    sections: ['social-pro-review-spotlight'],
    semanticTags: ['review', 'testimonial', 'luxury', 'hospitality', 'airbnb'],
    width: 1080,
    height: 1080
  },
  {
    id: 'pro-real-estate-luxury',
    name: 'Luxury Real Estate Listing',
    description: 'Dark mode grid layout for premium property listings.',
    category: 'real-estate',
    platform: ['instagram', 'linkedin'],
    isMasterLayout: true,
    layoutArchetype: 'real-estate-grid',
    usageGuidance: 'Best for property listings with multiple photos. Dark theme implies luxury.',
    sections: ['social-pro-real-estate-dark'],
    semanticTags: ['real-estate', 'listing', 'house', 'luxury', 'dark'],
    width: 1080,
    height: 1080
  },
  {
    id: 'pro-bold-drop',
    name: 'Bold Product Drop',
    category: 'ecommerce',
    description: 'High energy, diagonal split layout for new product launches.',
    platform: ['instagram', 'twitter'],
    isMasterLayout: true,
    layoutArchetype: 'bold-split',
    usageGuidance: 'Use for new product announcements. Requires a transparent PNG product image for best effect.',
    sections: ['social-pro-bold-drop'],
    semanticTags: ['product', 'launch', 'bold', 'sport', 'tech'],
    width: 1080,
    height: 1080
  },
  {
    id: 'pro-summer-collage',
    name: 'Editorial Fashion Collage',
    category: 'fashion',
    description: 'Magazine-style collage for collections or mood boards.',
    platform: ['instagram', 'pinterest'],
    isMasterLayout: true,
    layoutArchetype: 'collage',
    usageGuidance: 'Great for fashion collections or lifestyle brands. Uses 3 images.',
    sections: ['social-pro-collage-minimal'],
    semanticTags: ['fashion', 'collage', 'editorial', 'summer', 'lifestyle'],
    width: 1080,
    height: 1080
  },

  // --- LEGACY TEMPLATES (Kept for variety) ---
  // Category 1: E-Commerce & Product
  {
    id: 'ml-social-proof-stack',
    name: 'Social Proof Stack',
    description: 'Hero product image with overlapping review card for instant trust',
    category: 'ecommerce',
    platform: ['instagram', 'facebook'],
    isMasterLayout: true,
    layoutArchetype: 'social-proof-stack',
    usageGuidance: 'Best for product launches, new items. The review card bridges over the hero to create depth.',
    sections: ['hero-impact-overlay', 'bridge-review-card'],
    semanticTags: ['product', 'social-proof', 'review', 'trust', 'conversion'],
    width: 1080,
    height: 1080
  },
  {
    id: 'ml-feature-anatomy',
    name: 'Feature Anatomy Showcase',
    description: 'Product with floating feature callouts using glassmorphism',
    category: 'ecommerce',
    platform: ['instagram', 'facebook', 'linkedin'],
    isMasterLayout: true,
    layoutArchetype: 'feature-anatomy',
    usageGuidance: 'Tech gadgets, premium products. Highlights 4 key benefits in an eye-catching way.',
    sections: ['advanced-feature-anatomy'],
    semanticTags: ['product', 'features', 'benefits', 'premium', 'tech'],
    width: 1080,
    height: 1080
  },
  {
    id: 'ml-versus-comparison',
    name: 'Before vs After Split',
    description: 'Diagonal split comparison with clear visual contrast',
    category: 'ecommerce',
    platform: ['instagram', 'facebook', 'linkedin'],
    isMasterLayout: true,
    layoutArchetype: 'versus-split',
    usageGuidance: 'Transformation products, upgrades, comparisons. The diagonal split creates dynamic energy.',
    sections: ['advanced-versus-split'],
    semanticTags: ['comparison', 'before-after', 'transformation', 'contrast'],
    width: 1080,
    height: 1080
  },
  {
    id: 'ml-product-price-pop',
    name: 'Product with Price Pop',
    description: 'Clean product card with overlapping price bubble',
    category: 'ecommerce',
    platform: ['instagram', 'facebook'],
    isMasterLayout: true,
    layoutArchetype: 'product-price-pop',
    usageGuidance: 'Flash sales, limited offers. The price bubble creates urgency and draws the eye.',
    sections: ['hero-split-modern', 'bridge-price-bubble'],
    semanticTags: ['product', 'price', 'sale', 'urgent', 'cta'],
    width: 1080,
    height: 1080
  },

  // Category 2: B2B & Authority
  {
    id: 'ml-tweet-authority',
    name: 'Tweet Authority Card',
    description: 'Twitter-style social proof on gradient background',
    category: 'b2b',
    platform: ['linkedin', 'twitter', 'instagram'],
    isMasterLayout: true,
    layoutArchetype: 'tweet-card',
    usageGuidance: 'Share testimonials, insights, contrarian opinions. The familiar UI builds trust.',
    sections: ['ui-tweet-card'],
    semanticTags: ['social', 'testimonial', 'authority', 'quote', 'trust'],
    width: 1080,
    height: 1080
  },
  {
    id: 'ml-data-insight',
    name: 'Big Number Statistics',
    description: 'Massive statistic with gradient text and context',
    category: 'b2b',
    platform: ['linkedin', 'twitter', 'instagram'],
    isMasterLayout: true,
    layoutArchetype: 'data-insight',
    usageGuidance: 'ROI demonstrations, case studies, achievements. The huge number stops the scroll.',
    sections: ['advanced-data-insight'],
    semanticTags: ['statistics', 'data', 'proof', 'results', 'roi'],
    width: 1080,
    height: 1080
  },
  {
    id: 'ml-checklist-guide',
    name: 'Ultimate Checklist',
    description: 'Educational checklist with green checkmarks',
    category: 'b2b',
    platform: ['linkedin', 'instagram', 'pinterest'],
    isMasterLayout: true,
    layoutArchetype: 'checklist',
    usageGuidance: 'Educational content, guides, best practices. Creates value and saves.',
    sections: ['advanced-checklist'],
    semanticTags: ['education', 'list', 'guide', 'tips', 'value'],
    width: 1080,
    height: 1080
  },
  {
    id: 'ml-notification-alert',
    name: 'iOS Notification',
    description: 'Realistic iOS notification for engagement',
    category: 'b2b',
    platform: ['instagram', 'facebook'],
    isMasterLayout: true,
    layoutArchetype: 'notification',
    usageGuidance: 'Webinar reminders, product updates, announcements. Triggers the "check phone" reflex.',
    sections: ['ui-ios-notification'],
    semanticTags: ['notification', 'alert', 'urgent', 'mobile', 'attention'],
    width: 1080,
    height: 1080
  },
  {
    id: 'ml-search-query',
    name: 'Google Search Hook',
    description: 'Search bar with compelling query',
    category: 'b2b',
    platform: ['linkedin', 'instagram'],
    isMasterLayout: true,
    layoutArchetype: 'search-query',
    usageGuidance: 'Introduce topics, SEO content, curiosity hooks. The familiar UI creates engagement.',
    sections: ['ui-google-search'],
    semanticTags: ['search', 'query', 'seo', 'curiosity', 'education'],
    width: 1080,
    height: 1080
  },

  // Category 3: Lifestyle & Brand
  {
    id: 'ml-polaroid-memories',
    name: 'Polaroid Scatter',
    description: 'Multiple polaroid frames with vintage feel',
    category: 'lifestyle',
    platform: ['instagram', 'pinterest'],
    isMasterLayout: true,
    layoutArchetype: 'polaroid-scatter',
    usageGuidance: 'Behind the scenes, memories, team culture. The scattered layout feels organic.',
    sections: ['frame-polaroid-scatter'],
    semanticTags: ['polaroid', 'vintage', 'memories', 'casual', 'aesthetic'],
    width: 1080,
    height: 1080
  },
  {
    id: 'ml-single-polaroid',
    name: 'Single Polaroid Frame',
    description: 'One photo in classic polaroid frame',
    category: 'lifestyle',
    platform: ['instagram', 'pinterest'],
    isMasterLayout: true,
    layoutArchetype: 'polaroid-single',
    usageGuidance: 'Featured moments, highlights, simple aesthetic posts.',
    sections: ['frame-polaroid-single'],
    semanticTags: ['polaroid', 'vintage', 'photo', 'simple', 'aesthetic'],
    width: 1080,
    height: 1080
  },
  {
    id: 'ml-film-strip',
    name: 'Cinema Film Strip',
    description: 'Vintage film strip with three frames',
    category: 'lifestyle',
    platform: ['instagram', 'pinterest'],
    isMasterLayout: true,
    layoutArchetype: 'film-strip',
    usageGuidance: 'Sequential moments, storytelling, cinematic vibe.',
    sections: ['frame-film-strip'],
    semanticTags: ['film', 'cinema', 'vintage', 'story', 'sequence'],
    width: 1080,
    height: 1080
  },

  // Category 4: Engagement & Viral
  {
    id: 'ml-product-glass-card',
    name: 'Glass Product Card',
    description: 'Premium product in glassmorphism card',
    category: 'ecommerce',
    platform: ['instagram', 'facebook'],
    isMasterLayout: true,
    layoutArchetype: 'glass-card',
    usageGuidance: 'Luxury products, modern brands. The glassmorphism creates premium feel.',
    sections: ['product-glass-card'],
    semanticTags: ['product', 'luxury', 'modern', 'glassmorphism', 'premium'],
    width: 1080,
    height: 1080
  },
  {
    id: 'ml-product-features',
    name: 'Product Feature List',
    description: 'Product with three key benefits',
    category: 'ecommerce',
    platform: ['instagram', 'facebook', 'linkedin'],
    isMasterLayout: true,
    layoutArchetype: 'product-features',
    usageGuidance: 'Products with multiple benefits, educational focus.',
    sections: ['product-feature-list'],
    semanticTags: ['product', 'features', 'benefits', 'education'],
    width: 1080,
    height: 1080
  },

  // Combo Templates
  {
    id: 'ml-hero-cta-combo',
    name: 'Hero + Bold CTA',
    description: 'Impactful hero with strong call-to-action',
    category: 'general',
    platform: ['instagram', 'facebook', 'linkedin'],
    isMasterLayout: true,
    layoutArchetype: 'hero-cta',
    usageGuidance: 'Announcements, launches, events. Clear visual hierarchy drives action.',
    sections: ['hero-impact-overlay', 'footer-bold-cta'],
    semanticTags: ['hero', 'cta', 'announcement', 'conversion', 'action'],
    width: 1080,
    height: 1080
  },
  {
    id: 'ml-testimonial-stack',
    name: 'Testimonial + Stats',
    description: 'Customer review with supporting statistics',
    category: 'b2b',
    platform: ['linkedin', 'instagram'],
    isMasterLayout: true,
    layoutArchetype: 'testimonial-stats',
    usageGuidance: 'Case studies, social proof campaigns. Combines emotional and logical proof.',
    sections: ['ui-tweet-card', 'advanced-data-insight'],
    semanticTags: ['testimonial', 'stats', 'proof', 'trust', 'results'],
    width: 1080,
    height: 1080
  },
  {
    id: 'ml-modern-minimalist',
    name: 'Modern Split + Social Footer',
    description: 'Clean split hero with minimal social footer',
    category: 'lifestyle',
    platform: ['instagram', 'pinterest'],
    isMasterLayout: true,
    layoutArchetype: 'modern-minimal',
    usageGuidance: 'Brand building, aesthetic content. Professional yet approachable.',
    sections: ['hero-split-modern', 'footer-social-minimal'],
    semanticTags: ['modern', 'minimal', 'clean', 'brand', 'aesthetic'],
    width: 1080,
    height: 1080
  }
];

async function seedMasterTemplates() {
  console.log('🎨 Seeding Master Layout Templates...');
  
  try {
    let inserted = 0;
    let updated = 0;

    for (const template of MASTER_TEMPLATES) {
      // Check if template exists
      const existing = await db.query.templates.findFirst({
        where: (table, { eq }) => eq(table.id, template.id)
      });

      // Create minified schema (for AI)
      const llmSchema = {
        type: 'master-layout',
        archetype: template.layoutArchetype,
        sections: template.sections,
        variables: {} // Will be populated from section defaults
      };

      const values = {
        id: template.id,
        name: template.name,
        description: template.description,
        category: template.category,
        platform: template.platform,
        llmSchema,
        semanticTags: template.semanticTags,
        isPublic: true,
        isActive: true,
        width: template.width,
        height: template.height,
        usageCount: 0,
        thumbsUpCount: 0,
        thumbsDownCount: 0,
        // AI Composition Fields
        isMasterLayout: template.isMasterLayout,
        layoutArchetype: template.layoutArchetype,
        sectionComposition: template.sections, // Array of section IDs for AI composition
        compositionRules: {
          minSections: template.sections.length,
          maxSections: template.sections.length + 2,
          requiredCategories: ['hero'],
          heightBudget: 1080,
          allowOverlap: true
        },
        intentMapping: {
          primary: template.layoutArchetype,
          secondary: template.semanticTags
        },
        brandDnaCompatibility: {
          industries: ['all'], // Will be refined by AI
          platforms: template.platform
        },
        usageGuidance: template.usageGuidance,
        aiGenerationPrompt: `Generate content for a ${template.name.toLowerCase()}. Focus on ${template.description.toLowerCase()}. This template is optimized for ${template.platform.join(', ')} and works best for ${template.category} content.`,
        variables: {
          isMasterLayout: template.isMasterLayout,
          layoutArchetype: template.layoutArchetype,
          sections: template.sections
        }
      };

      if (existing) {
        console.log(`  - Updating: ${template.name}`);
        await db.update(templates)
          .set(values)
          .where(eq(templates.id, template.id));
        updated++;
      } else {
        console.log(`  - Creating: ${template.name}`);
        await db.insert(templates).values(values);
        inserted++;
      }
    }

    console.log(`\n✅ Master Templates Seeded!`);
    console.log(`   📊 Inserted: ${inserted}`);
    console.log(`   🔄 Updated: ${updated}`);
    console.log(`   📦 Total: ${MASTER_TEMPLATES.length}\n`);
    
    console.log('📋 Template Breakdown:');
    console.log('   🛒 E-Commerce: 7 templates');
    console.log('   💼 B2B/Authority: 5 templates');
    console.log('   🎨 Lifestyle/Brand: 3 templates');
    console.log('   🔥 Combo/General: 2 templates');
    
  } catch (error) {
    console.error('❌ Error seeding master templates:', error);
    throw error;
  }
  
  process.exit(0);
}

seedMasterTemplates();
