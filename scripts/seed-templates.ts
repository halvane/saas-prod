import { db } from '@/lib/db/drizzle';
import { templates, templateEmbeddings } from '@/lib/db/schema';
import { MASTER_TEMPLATES } from '@/lib/templates/master-templates';
import { SECTIONS, buildTemplateFromSections } from '@/lib/builder/library';
import { eq } from 'drizzle-orm';
import { generateEmbedding } from '@/lib/ai/templates/ingestion';
import { generateLlmSchemaFromKeys, validateVariableKeys } from '@/lib/templates/template-variables';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config({ path: '.env' });

// Helper to generate simple LLM schema from variables (LEGACY - for backward compatibility)
function generateLlmSchema(variables: Record<string, any>) {
  const properties: Record<string, any> = {};
  for (const [key, value] of Object.entries(variables)) {
    properties[key] = {
      type: 'string',
      description: `Content for ${key}`,
      default: value
    };
  }
  return {
    type: 'object',
    properties,
    required: Object.keys(variables)
  };
}

// Define New Pro Templates
const PRO_TEMPLATES = [
  buildTemplateFromSections(
    'Neon Cyber Launch',
    'High contrast dark theme with gradient overlay and bold typography.',
    ['overlay-dark-gradient', 'header-modern-nav', 'hero-impact-overlay', 'footer-bold-cta']
  ),
  buildTemplateFromSections(
    'Minimalist Collection',
    'Modern split layout with product focus and light aesthetic.',
    ['header-centered-logo', 'hero-split-modern', 'product-feature-list', 'footer-social-minimal']
  ),
  buildTemplateFromSections(
    'Glass Product Showcase',
    'Trendy glass effect product showcase with mesh gradient.',
    ['overlay-brand-mesh', 'header-modern-nav', 'product-glass-card', 'footer-bold-cta']
  ),
  buildTemplateFromSections(
    'Storyteller Brand',
    'Simple centered layout for storytelling.',
    ['header-centered-logo', 'hero-split-modern', 'testimonial-modern-card', 'footer-social-minimal']
  ),
  buildTemplateFromSections(
    'Feature Heavy Promo',
    'Detailed product features with strong call to action.',
    ['overlay-dark-gradient', 'header-modern-nav', 'product-feature-list', 'footer-bold-cta']
  ),
  buildTemplateFromSections(
    'Trust & Social Proof',
    'Build trust with testimonials and feature highlights.',
    ['header-centered-logo', 'testimonial-modern-card', 'features-grid-4', 'footer-social-minimal']
  ),
  buildTemplateFromSections(
    'Bold Statement',
    'Impactful hero section with strong footer.',
    ['overlay-dark-gradient', 'hero-impact-overlay', 'footer-bold-cta']
  ),
  buildTemplateFromSections(
    'Elegant Product',
    'Clean product presentation with minimal footer.',
    ['header-centered-logo', 'product-glass-card', 'footer-social-minimal']
  ),
  buildTemplateFromSections(
    'Modern Split',
    'Split layout for balanced content.',
    ['header-modern-nav', 'hero-split-modern', 'footer-bold-cta']
  ),
  buildTemplateFromSections(
    'Quick Promo',
    'Fast and effective promotional template.',
    ['overlay-brand-mesh', 'hero-impact-overlay', 'footer-social-minimal']
  )
];

async function seed() {
  console.log('🌱 Starting template seed (V2 Architecture)...');

  try {
    // 1. Clean old templates
    console.log('🧹 Cleaning old templates...');
    await db.delete(templates);
    await db.delete(templateEmbeddings);
    console.log('✅ Database cleaned.');

    // 2. Insert Master Templates (Original + Pro)
    const allTemplates = [
      ...MASTER_TEMPLATES,
      ...PRO_TEMPLATES.map(t => ({
        id: `pro-${t.name.toLowerCase().replace(/\s+/g, '-')}`,
        ...t,
        cssTemplate: '', // Modular templates use inline styles
        tags: ['pro', 'dynamic', 'v2']
      }))
    ];

    console.log(`Found ${allTemplates.length} templates to insert.`);

    for (const tmpl of allTemplates) {
      console.log(`Processing: ${tmpl.name}`);

      // NEW: Use centralized variable system if variableKeys exist
      let llmSchema;
      if (tmpl.variableKeys && Array.isArray(tmpl.variableKeys)) {
        console.log(`  - Using centralized variable system (${tmpl.variableKeys.length} keys)`);
        
        // Validate variable keys
        const validation = validateVariableKeys(tmpl.variableKeys);
        if (!validation.valid) {
          console.warn(`  ⚠️ Unknown variables: ${validation.missing.join(', ')}`);
        }
        
        // Generate minified LLM schema from keys (saves tokens!)
        llmSchema = generateLlmSchemaFromKeys(tmpl.variableKeys);
      } else {
        // LEGACY: Use old system for backward compatibility
        console.log(`  - Using legacy variable system`);
        llmSchema = generateLlmSchema(tmpl.variables);
      }

      // Note: We are NOT pre-generating the 'elements' JSON here because
      // extractElementsFromHTMLAsync relies on a real browser environment (iframe rendering)
      // which is hard to polyfill perfectly in Node.js.
      // Instead, we rely on the "Legacy Fallback" in the Loader to generate it 
      // the first time the user opens the template.
      
      console.log(`  - Inserting new template...`);
      await db.insert(templates).values({
        id: tmpl.id,
        name: tmpl.name,
        description: tmpl.description,
        htmlTemplate: tmpl.htmlTemplate, // Stored for legacy fallback extraction
        cssTemplate: tmpl.cssTemplate,   // Stored for legacy fallback extraction
        variables: tmpl.variables,
        llmSchema: llmSchema,
        category: tmpl.category,
        platform: tmpl.platform,
        isActive: true,
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        elements: [], // Empty initially, will be populated by the editor on first load
      });

      // 3. Generate Embedding (if possible)
      try {
        if (process.env.OPENAI_API_KEY || process.env.AI_GATEWAY_TOKEN) {
          console.log(`  - Generating embedding...`);
          const embedding = await generateEmbedding(tmpl.description);
          
          await db.insert(templateEmbeddings).values({
            templateId: tmpl.id,
            embedding: embedding,
            sourceText: tmpl.description
          });
        }
      } catch (err) {
        console.warn(`  ⚠️ Failed to generate embedding: ${err}`);
      }
    }

    console.log('✅ Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
