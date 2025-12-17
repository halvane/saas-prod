'use server';

import { findMatchingTemplates } from '@/lib/ai/templates/search';
import { db } from '@/lib/db/drizzle';
import { brandSettings, brandProducts, templates } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getUser } from '@/lib/db/queries';
import { getTemplatesForUser } from '@/lib/templates/service';
import { getOrCreateContentMatrix } from '@/lib/ai/content-matrix';
import { fillTemplateFromMatrix } from '@/lib/templates/matrix-mapper';
import { searchUnsplashImages } from '@/lib/unsplash';
import { hydrateMasterTemplate } from '@/lib/templates/hydrator';
import { generateVariations } from '@/lib/templates/variation-engine';
import { FULL_DEMO_TEMPLATES } from '@/lib/builder/fullTemplates';

import { revalidatePath } from 'next/cache';

async function ensureBrandImages(brandId: number, currentImagesJson: string | null, matrix: any) {
  let generalImages = currentImagesJson ? JSON.parse(currentImagesJson) : [];
  
  // If we have no images but have keywords, fetch them
  if (generalImages.length === 0 && matrix.image_keywords && matrix.image_keywords.length > 0) {
      console.log('[ensureBrandImages] Fetching Unsplash images for keywords:', matrix.image_keywords);
      
      // Pick top 3 keywords to get variety
      const keywords = matrix.image_keywords.slice(0, 3);
      const newImages: string[] = [];
      
      // Fetch 2 images per keyword
      for (const keyword of keywords) {
          const results = await searchUnsplashImages(keyword, 2);
          newImages.push(...results);
      }
      
      // Deduplicate just in case
      const uniqueImages = Array.from(new Set(newImages));
      
      if (uniqueImages.length > 0) {
          // Update DB
          await db.update(brandSettings)
            .set({ brandImages: JSON.stringify(uniqueImages) })
            .where(eq(brandSettings.id, brandId));
            
          generalImages = uniqueImages;
          console.log(`[ensureBrandImages] Updated brand images with ${uniqueImages.length} new photos`);
      }
  }
  
  return generalImages;
}

export async function getUserTemplatesAction(timestamp?: number, page: number = 1, limit: number = 20) {
  console.log(`[getUserTemplatesAction] START - Timestamp: ${timestamp}, Page: ${page}, Limit: ${limit}`);
  const user = await getUser();
  if (!user) {
    console.error('[getUserTemplatesAction] Unauthorized: No user found');
    throw new Error('Unauthorized');
  }
  
  // Force revalidation to ensure fresh data
  revalidatePath('/templates');
  
  console.log(`[getUserTemplatesAction] User ID: ${user.id}`);
  
  // 1. Fetch Brand & Products
  const brand = await db.query.brandSettings.findFirst({
    where: eq(brandSettings.userId, user.id),
  });

  if (!brand) {
    console.warn('[getUserTemplatesAction] No brand settings found for user');
    return { templates: [], brand: null, hasMore: false };
  }
  console.log(`[getUserTemplatesAction] Brand found: ${brand.brandName} (ID: ${brand.id})`);

  const products = await db.query.brandProducts.findMany({
    where: eq(brandProducts.brandId, brand.id),
  });
  console.log(`[getUserTemplatesAction] Products found: ${products.length}`);

  // 2. Get Content Matrix (Auto-generate if missing)
  const brandContext = `
    Brand: ${brand.brandName}
    Industry: ${brand.brandIndustry}
    Description: ${brand.brandStory || ''}
    Values: ${brand.brandValues}
  `;
  
  console.log('[getUserTemplatesAction] Fetching/Generating Content Matrix...');
  const matrix = await getOrCreateContentMatrix(brand.id, brandContext);
  console.log(`[getUserTemplatesAction] Matrix ready. Headlines: ${matrix.headlines?.length}, CTAs: ${matrix.ctas?.length}`);

  // 3. Prepare Images
  const generalImages = await ensureBrandImages(brand.id, brand.brandImages as string, matrix);

  const images = {
    logo: brand.brandLogo || undefined,
    general: generalImages,
    products: products.map(p => p.imageUrl).filter(Boolean) as string[],
  };
  console.log(`[getUserTemplatesAction] Images prepared. Logo: ${!!images.logo}, General: ${images.general.length}, Products: ${images.products.length}`);

  // 4. Fetch Master Templates (Base Pool)
  // TEMPORARY OVERRIDE: Use FULL_DEMO_TEMPLATES instead of DB templates
  // This ensures users see working, full templates immediately
  
  // We fetch ALL master templates first because we need them as seeds for variations
  /*
  const allMasterTemplates = await db.query.templates.findMany({
    where: and(
      eq(templates.isActive, true),
      eq(templates.isMasterLayout, true)
    )
  });
  */
  const allMasterTemplates = FULL_DEMO_TEMPLATES.map(t => ({
    ...t,
    isMasterLayout: true,
    llmSchema: t.variables, // Map variables to schema for matrix filling
    platform: t.platform || ['web'],
    tags: t.tags || [],
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: user.id,
    teamId: null,
    isPublic: true,
    isActive: true,
    usageCount: 0,
    thumbnailUrl: null,
    previewUrl: null
  }));

  console.log(`[getUserTemplatesAction] Master templates fetched: ${allMasterTemplates.length}`);

  let resultTemplates: any[] = [];

  if (page === 1) {
    // Page 1: Return the Master Templates directly
    resultTemplates = [...allMasterTemplates];
    
    // Skip variations for now to keep it simple and stable
    /*
    const needed = limit - resultTemplates.length;
    if (needed > 0) {
      const variations = generateVariations(allMasterTemplates, { seed: 1, count: needed });
      resultTemplates.push(...variations);
    }
    */
  } else {
    // Page 2+: No more templates for now
    resultTemplates = [];
  }

  // 5. Hydrate Templates (Stitch Sections)
  // FULL_DEMO_TEMPLATES are already hydrated (they have HTML), so we can skip hydration if htmlTemplate exists
  console.log(`[getUserTemplatesAction] Hydrating ${resultTemplates.length} templates...`);
  const hydratedTemplates = await Promise.all(
    resultTemplates.map(async t => {
      if (t.htmlTemplate) return t;
      return hydrateMasterTemplate(t);
    })
  );

  // 6. Populate Templates using Matrix
  const filledTemplates = hydratedTemplates.map(template => {
    // console.log(`[getUserTemplatesAction] Mapping template: ${template.name} (${template.id})`);
    
    // Use llmSchema if available, otherwise fallback to variables keys
    const schema = template.llmSchema || template.variables || {};
    const mappedVariables = fillTemplateFromMatrix(schema as Record<string, any>, matrix, images);
    
    // console.log(`[getUserTemplatesAction] Variables mapped for ${template.name}:`, JSON.stringify(mappedVariables, null, 2));
    return {
      ...template,
      mappedVariables, // Send as a distinct property to avoid conflict/overwriting issues
      variables: mappedVariables, // Also try to overwrite the original
    };
  });

  console.log('[getUserTemplatesAction] END - Returning templates');
  return { 
    templates: filledTemplates, 
    brand,
    hasMore: false // Disable infinite scroll for now
  };
}

export async function searchTemplatesAction(prompt: string) {
  return await findMatchingTemplates(prompt);
}

export async function getTemplateWithMatrixAction(templateId: string) {
  console.log(`[getTemplateWithMatrixAction] START - Template ID: ${templateId}`);
  const user = await getUser();
  if (!user) {
    console.error('[getTemplateWithMatrixAction] Unauthorized: No user found');
    throw new Error('Unauthorized');
  }

  // 1. Fetch Template First (to ensure it exists)
  // Check FULL_DEMO_TEMPLATES first
  const demoTemplate = FULL_DEMO_TEMPLATES.find(t => t.id === templateId);
  
  let template: any = null;

  if (demoTemplate) {
    template = {
      ...demoTemplate,
      isMasterLayout: true,
      llmSchema: demoTemplate.variables,
      platform: demoTemplate.platform || ['web'],
      tags: demoTemplate.tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user.id,
      teamId: null,
      isPublic: true,
      isActive: true,
      usageCount: 0,
      thumbnailUrl: null,
      previewUrl: null
    };
  } else {
    template = await db.query.templates.findFirst({
      where: eq(templates.id, templateId),
    });
  }

  if (!template) {
    console.error(`[getTemplateWithMatrixAction] Template not found: ${templateId}`);
    throw new Error('Template not found');
  }

  // HYDRATION STEP
  if (template.isMasterLayout) {
    template = await hydrateMasterTemplate(template);
  }

  console.log(`[getTemplateWithMatrixAction] Template found: ${template.name}`);

  // 2. Get Brand Settings (optional)
  const brand = await db.query.brandSettings.findFirst({
    where: eq(brandSettings.userId, user.id),
  });

  if (!brand) {
    console.warn('[getTemplateWithMatrixAction] No brand settings found, using template defaults');
    // Return template with original variables (no AI mapping)
    const originalVars = typeof template.variables === 'string' 
      ? JSON.parse(template.variables) 
      : (template.variables || {});
    
    return {
      ...template,
      variables: originalVars,
      mappedVariables: originalVars,
    };
  }

  const products = await db.query.brandProducts.findMany({
    where: eq(brandProducts.brandId, brand.id),
  });

  // 3. Get Content Matrix
  const brandContext = `
    Brand: ${brand.brandName}
    Industry: ${brand.brandIndustry}
    Description: ${brand.brandStory || ''}
    Values: ${brand.brandValues}
  `;
  
  const matrix = await getOrCreateContentMatrix(brand.id, brandContext);

  // 4. Prepare Images
  const generalImages = await ensureBrandImages(brand.id, brand.brandImages as string, matrix);

  const images = {
    logo: brand.brandLogo || undefined,
    general: generalImages,
    products: products.map(p => p.imageUrl).filter(Boolean) as string[],
  };

  // 5. Populate Template with AI Mapping
  console.log(`[getTemplateWithMatrixAction] Mapping template: ${template.name}`);
  
  // Parse llmSchema if it's a string
  const schema = typeof template.llmSchema === 'string' 
    ? JSON.parse(template.llmSchema) 
    : template.llmSchema;
  
  // Extract properties from schema (schema.properties contains the actual variable definitions)
  const schemaProps = schema?.properties || schema || {};
  // console.log(`[getTemplateWithMatrixAction] Schema keys:`, Object.keys(schemaProps));
  
  const mappedVariables = fillTemplateFromMatrix(schemaProps, matrix, images);
  // console.log(`[getTemplateWithMatrixAction] Variables mapped:`, JSON.stringify(mappedVariables, null, 2));
  
  // CRITICAL: Merge with original variables to ensure no keys are lost
  // This prevents the "disappearing elements" bug
  const originalVars = typeof template.variables === 'string' 
    ? JSON.parse(template.variables) 
    : (template.variables || {});
  
  const mergedVariables = { ...originalVars, ...mappedVariables };
  // console.log(`[getTemplateWithMatrixAction] Merged variables (original + mapped):`, Object.keys(mergedVariables));

  return {
    ...template,
    mappedVariables,
    variables: mergedVariables, // Use merged to preserve all keys
  };
}

