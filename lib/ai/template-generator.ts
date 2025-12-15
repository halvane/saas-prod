import { generateObject } from 'ai';
import { z } from 'zod';
import { gateway } from '@/lib/ai/gateway';
import { db } from '@/lib/db/drizzle';
import { brandSettings, brandProducts, templates, generatedTemplateValues } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Define the output schema for the LLM
const BatchTemplateValuesSchema = z.object({
  results: z.array(
    z.object({
      templateId: z.string(),
      values: z.record(z.string()),
    })
  ),
});

export async function generateBatchTemplateValues(
  userId: number,
  templateList: Pick<typeof templates.$inferSelect, 'id' | 'name' | 'description' | 'llmSchema'>[]
) {
  // 1. Fetch Brand DNA and Products
  const brand = await db.query.brandSettings.findFirst({
    where: eq(brandSettings.userId, userId),
  });

  if (!brand) {
    throw new Error('Brand settings not found for user');
  }

  const products = await db.query.brandProducts.findMany({
    where: eq(brandProducts.brandId, brand.id),
  });

  // 2. Construct the prompt
  const brandContext = `
Brand Name: ${brand.brandName}
Brand Voice: ${brand.brandVoice}
Brand Audience: ${brand.brandAudience}
Brand Values: ${brand.brandValues}
Brand Mission: ${brand.brandMission}
Brand Archetype: ${brand.brandArchetype}
Tagline: ${brand.brandTagline}
USPs: ${brand.brandUniqueSellingPoints}
Pain Points: ${brand.brandPainPoints}
Customer Desires: ${brand.brandCustomerDesires}
Ad Angles: ${brand.adAngles}
`;

  const productContext = products
    .map((p) => `- ${p.name}: ${p.description} (${p.price})`)
    .join('\n');

  const templateContext = templateList
    .map(
      (t) => `
Template ID: ${t.id}
Name: ${t.name}
Description: ${t.description}
Required Variables (Schema): ${JSON.stringify(t.llmSchema)}
`
    )
    .join('\n---\n');

  const prompt = `
You are an expert creative director and copywriter.
Your task is to generate specific content values for a list of design templates, tailored to a specific brand and its products.

Brand DNA:
${brandContext}

Products:
${productContext}

Templates to Populate:
${templateContext}

Instructions:
1. For each template, generate values for ALL keys listed in "Required Variables".
2. The content must be highly relevant to the brand's voice and audience.
3. Use the provided products where appropriate (e.g. for product showcases).
4. Ensure the tone matches the Brand Archetype.
5. Return the result as a JSON object with a "results" array.
`;

  // 3. Call AI Gateway
  try {
    const { object } = await generateObject({
      model: gateway.getModel('gpt-4o'), // Use a capable model for batch generation
      schema: BatchTemplateValuesSchema,
      prompt: prompt,
      temperature: 0.7,
    });

    // 4. Save to Database
    const results = object.results;
    const savedValues = [];

    for (const result of results) {
      // Verify that the templateId exists in our list (sanity check)
      const template = templateList.find((t) => t.id === result.templateId);
      if (!template) continue;

      // Upsert the values
      const [saved] = await db
        .insert(generatedTemplateValues)
        .values({
          userId,
          templateId: result.templateId,
          values: result.values,
          version: 1, // TODO: Track schema versions
        })
        .onConflictDoUpdate({
          target: [generatedTemplateValues.userId, generatedTemplateValues.templateId],
          set: {
            values: result.values,
            updatedAt: new Date(),
          },
        })
        .returning();
      
      savedValues.push(saved);
    }

    return savedValues;
  } catch (error) {
    console.error('Error generating template values:', error);
    throw error;
  }
}
