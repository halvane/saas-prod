import { generateObject } from 'ai';
import { z } from 'zod';
import { gateway } from '@/lib/ai/gateway';
import { getModel } from '@/lib/ai/models';
import { db } from '@/lib/db/drizzle';
import { brandSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Define the Content Matrix Schema
export const contentMatrixSchema = z.object({
  headlines: z.array(z.string()).describe('Catchy, brand-aligned headlines (short & punchy)'),
  subheadlines: z.array(z.string()).describe('Supporting text or subtitles'),
  body_text: z.array(z.string()).describe('Longer descriptive text paragraphs'),
  ctas: z.array(z.string()).describe('Call to action button text'),
  quotes: z.array(z.string()).describe('Inspirational or brand-relevant quotes'),
  hashtags: z.array(z.string()).describe('Relevant social media hashtags'),
  features: z.array(z.string()).describe('Short feature highlights'),
  benefits: z.array(z.string()).describe('Key benefit statements'),
  statistics: z.array(z.string()).describe('Impressive numbers or stats (e.g., "99% Satisfaction", "10k+ Users")'),
  questions: z.array(z.string()).describe('Engaging questions for the audience'),
  dates: z.array(z.string()).describe('Generic date/time phrases (e.g., "Limited Time", "Ends Soon", "Today Only")'),
  prices: z.array(z.string()).describe('Price placeholders (e.g., "$49", "Free Trial", "Best Value")'),
  steps: z.array(z.string()).describe('Process steps (e.g., "Step 1: Sign Up", "Easy Setup")'),
  locations: z.array(z.string()).describe('Location placeholders (e.g., "Online", "Worldwide", "New York")'),
  contact_info: z.array(z.string()).describe('Contact placeholders (e.g., "www.brand.com", "@handle", "Link in Bio")'),
  visual_style: z.string().describe('A short description of the visual style for images (e.g., "Minimalist, bright, professional, tech-focused")'),
  image_keywords: z.array(z.string()).describe('5-10 specific search keywords for finding high-quality Unsplash images matching the brand'),
});

export type ContentMatrix = z.infer<typeof contentMatrixSchema>;

export async function generateBrandContentMatrix(brandId: number, brandContext: string): Promise<ContentMatrix> {
  if (!gateway.isConfigured()) {
    throw new Error('AI Gateway is not configured');
  }

  console.log('[ContentMatrix] Generating new matrix for brand:', brandId);

  const prompt = `
    You are a Brand Strategist. Generate a "Content Matrix" for this brand.
    This matrix will be used to populate hundreds of social media templates automatically.
    
    Brand Context:
    ${brandContext}
    
    Generate a diverse set of assets (at least 5-10 items per category) that capture the brand's voice, values, and selling points.
    Make them varied in length and tone (within the brand's voice).

    IMPORTANT: You MUST generate values for ALL of the following categories:
    1. headlines
    2. subheadlines
    3. body_text
    4. ctas
    5. quotes
    6. hashtags
    7. features
    8. benefits
    9. statistics
    10. questions
    11. dates
    12. prices
    13. steps
    14. locations
    15. contact_info
    16. visual_style
    17. image_keywords

    CRITICAL INSTRUCTIONS FOR NEW CATEGORIES:
    - Statistics: Invent plausible, impressive numbers relevant to this brand (e.g., "98% Success Rate", "10k+ Happy Clients").
    - Questions: Write engaging questions to hook the audience (e.g., "Ready to transform?", "Tired of X?").
    - Dates: Use generic urgency phrases (e.g., "Offer Ends Soon", "Limited Time Only", "Book Now").
    - Prices: Use representative price points or value statements (e.g., "Starting at $XX", "Free Consultation").
    - Steps: Simple 1-2-3 process steps (e.g., "1. Sign Up", "2. Customize", "3. Launch").
    - Locations: Relevant locations or "Available Worldwide", "Online & In-Store".
    - Contact: Standard placeholders like "Link in Bio", "www.brand.com", "Call Us".
  `;

  try {
    const { object } = await generateObject({
      model: getModel('fast'), // GPT-4o-mini is perfect for this
      schema: contentMatrixSchema,
      prompt,
    });

    // Save to DB
    await db.update(brandSettings)
      .set({ contentMatrix: object })
      .where(eq(brandSettings.id, brandId));

    return object;
  } catch (error) {
    console.error('[ContentMatrix] Generation failed:', error);
    throw error;
  }
}

export async function getOrCreateContentMatrix(brandId: number, brandContext: string): Promise<ContentMatrix> {
  // 1. Check DB
  const brand = await db.query.brandSettings.findFirst({
    where: eq(brandSettings.id, brandId),
  });

  if (brand?.contentMatrix) {
    return brand.contentMatrix as ContentMatrix;
  }

  // 2. Generate if missing
  return await generateBrandContentMatrix(brandId, brandContext);
}
