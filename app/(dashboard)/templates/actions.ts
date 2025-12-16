'use server';

import { findMatchingTemplates } from '@/lib/ai/templates/search';
import { db } from '@/lib/db/drizzle';
import { brandSettings, brandProducts, templates } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getUser } from '@/lib/db/queries';
import { getTemplatesForUser } from '@/lib/templates/service';
import { getOrCreateContentMatrix } from '@/lib/ai/content-matrix';
import { fillTemplateFromMatrix } from '@/lib/templates/matrix-mapper';
import { searchUnsplashImages } from '@/lib/unsplash';

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

export async function getUserTemplatesAction(timestamp?: number) {
  console.log(`[getUserTemplatesAction] START - Timestamp: ${timestamp}`);
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
    return { templates: [], brand: null };
  }
  console.log(`[getUserTemplatesAction] Brand found: ${brand.brandName} (ID: ${brand.id})`);

  const products = await db.query.brandProducts.findMany({
    where: eq(brandProducts.brandId, brand.id),
  });
  console.log(`[getUserTemplatesAction] Products found: ${products.length}`);

  // 2. Get Content Matrix (Auto-generate if missing)
  // We pass a basic context string if generation is needed
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

  // 4. Fetch Templates
  const rawTemplates = await getTemplatesForUser(user.id);
  console.log(`[getUserTemplatesAction] Raw templates fetched: ${rawTemplates.length}`);

  // 5. Populate Templates using Matrix
  const templates = rawTemplates.map(template => {
    console.log(`[getUserTemplatesAction] Mapping template: ${template.name} (${template.id})`);
    const mappedVariables = fillTemplateFromMatrix(template.llmSchema as Record<string, any>, matrix, images);
    console.log(`[getUserTemplatesAction] Variables mapped for ${template.name}:`, JSON.stringify(mappedVariables, null, 2));
    return {
      ...template,
      mappedVariables, // Send as a distinct property to avoid conflict/overwriting issues
      variables: mappedVariables, // Also try to overwrite the original
    };
  });

  console.log('[getUserTemplatesAction] END - Returning templates');
  return { templates, brand };
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
  const template = await db.query.templates.findFirst({
    where: eq(templates.id, templateId),
  });

  if (!template) {
    console.error(`[getTemplateWithMatrixAction] Template not found: ${templateId}`);
    throw new Error('Template not found');
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
  console.log(`[getTemplateWithMatrixAction] Schema keys:`, Object.keys(schemaProps));
  
  const mappedVariables = fillTemplateFromMatrix(schemaProps, matrix, images);
  console.log(`[getTemplateWithMatrixAction] Variables mapped:`, JSON.stringify(mappedVariables, null, 2));
  
  // CRITICAL: Merge with original variables to ensure no keys are lost
  // This prevents the "disappearing elements" bug
  const originalVars = typeof template.variables === 'string' 
    ? JSON.parse(template.variables) 
    : (template.variables || {});
  
  const mergedVariables = { ...originalVars, ...mappedVariables };
  console.log(`[getTemplateWithMatrixAction] Merged variables (original + mapped):`, Object.keys(mergedVariables));

  return {
    ...template,
    mappedVariables,
    variables: mergedVariables, // Use merged to preserve all keys
  };
}

