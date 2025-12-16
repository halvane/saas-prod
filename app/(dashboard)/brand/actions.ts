'use server';

import { getUser } from '@/lib/db/queries';
import { db } from '@/lib/db/drizzle';
import { templates, brandSettings, brandProducts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getOrCreateContentMatrix } from '@/lib/ai/content-matrix';
import { fillTemplateFromMatrix } from '@/lib/templates/matrix-mapper';

export async function generateAllTemplatesJSON() {
  const user = await getUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }

  // Fetch all active templates
  const allTemplates = await db.select().from(templates).where(eq(templates.isActive, true));

  // Fetch user's brand settings for context
  const userBrand = await db.query.brandSettings.findFirst({
    where: eq(brandSettings.userId, user.id),
  });

  if (!userBrand) {
    throw new Error('No Brand DNA found. Please configure Brand Settings first.');
  }

  // Fetch brand products
  const products = await db.select().from(brandProducts).where(eq(brandProducts.brandId, userBrand.id));

  // Prepare Image Assets
  let generalImages: string[] = [];
  try {
    if (userBrand.brandImages) {
      const parsed = JSON.parse(userBrand.brandImages);
      if (Array.isArray(parsed)) generalImages = parsed;
    }
  } catch (e) {
    console.error("Failed to parse brandImages", e);
  }

  const brandImages = {
    logo: userBrand.brandLogo || undefined,
    general: generalImages,
    products: products.map(p => p.imageUrl).filter(Boolean) as string[]
  };

  const brandContext = `
    Brand Name: ${userBrand.brandName}
    Industry: ${userBrand.brandIndustry}
    Voice: ${userBrand.brandVoice}
    Audience: ${userBrand.brandAudience}
    Values: ${userBrand.brandValues}
    Mission: ${userBrand.brandMission}
  `;

  // 1. Get or Generate the Content Matrix (One AI call for ALL templates)
  // This is the key optimization: O(1) AI calls instead of O(N)
  const matrix = await getOrCreateContentMatrix(userBrand.id, brandContext);

  const results = [];

  // Process templates
  for (const template of allTemplates) {
    try {
      if (!template.llmSchema) continue;

      // 2. Map matrix content to template (Instant, local heuristic mapping)
      const variables = fillTemplateFromMatrix(
        template.llmSchema as Record<string, any>, 
        matrix,
        brandImages
      );

      results.push({
        templateId: template.id,
        templateName: template.name,
        variables: variables
      });
    } catch (error) {
      console.error(`Failed to generate for template ${template.id}:`, error);
      results.push({
        templateId: template.id,
        templateName: template.name,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return results;
}

export async function checkIsAdmin() {
    const user = await getUser();
    return user?.role === 'admin';
}
