import { NextRequest, NextResponse } from 'next/server';
import { scrapeBrandFromUrl, matchImagesToProducts } from '@/lib/brand-scraper/service';
import { generateObject } from 'ai';
import { getModel } from '@/lib/ai/models';
import { z } from 'zod';

function normalizeUrl(input: string): string {
  let url = input.trim();
  
  // Remove common prefixes that aren't protocols
  url = url.replace(/^(www\.)/, '');
  
  // Check if it has a protocol
  if (!url.match(/^https?:\/\//i)) {
    // Add https by default
    url = `https://${url}`;
  }
  
  return url;
}

// Brand analysis schema for structured output
const brandAnalysisSchema = z.object({
  tone: z.string().describe('Brand voice tone: professional, casual, inspiring, educational, playful, luxury, bold, or minimalist'),
  audience: z.string().describe('Detailed description of target customer demographics and psychographics (at least 2 sentences)'),
  industry: z.string().describe('Industry category: fashion, beauty, fitness, food, tech, travel, education, finance, real-estate, or other'),
  values: z.string().describe('Core brand values as comma-separated keywords (5 keywords)'),
  story: z.string().describe('A compelling 3-4 sentence brand story highlighting their mission and origin'),
  tagline: z.string().describe('A catchy tagline that summarizes their value proposition'),
  mission: z.string().describe('The brand\'s core mission statement (inferred if not explicit)'),
  archetype: z.string().describe('The Brand Archetype: Hero, Sage, Lover, Jester, Caregiver, Ruler, Creator, Innocent, Explorer, Magician, Everyman, or Rebel'),
  usps: z.array(z.string()).describe('Array of 4 unique selling points (detailed, specific advantages)'),
  painPoints: z.array(z.string()).describe('Array of 4 customer pain points this brand addresses (detailed problems)'),
  customerDesires: z.array(z.string()).describe('Array of 3 key customer desires this brand fulfills (aspirations and goals)'),
  adAngles: z.array(z.string()).describe('Array of 3 marketing angles for ad campaigns (specific strategies with hooks)'),
  detectedProducts: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
    price: z.string().optional(),
    marketing_angles: z.array(z.string()).optional().describe('3 marketing angles specific to this product'),
    visual_context: z.string().optional().describe('Inferred visual description of the product based on text context'),
    colors: z.array(z.string()).optional().describe('Dominant colors of the product (e.g. ["#FF0000", "Gold"])')
  })).optional().describe('List of products or services detected in the text content if not explicitly provided')
});

// AI analysis using Vercel AI SDK
async function analyzeWithAI(brandName: string, normalizedUrl: string, textContent: string, products: any[]) {
  try {
    console.log('[AI Analysis] Starting with Vercel AI SDK...');
    
    const productSummary = products.length > 0 
      ? products.slice(0, 5).map(p => `
        Product: ${p.name}
        Price: ${p.price || 'N/A'}
        Image Alt Text: ${p.metadata?.visual_context || 'N/A'}
        Description: ${p.description || 'N/A'}
      `).join('\n---\n')
      : 'No products detected via scraper. Please extract products or services from the website content.';
      
    console.log('[AI Analysis] Context:', {
      brandName,
      textLength: textContent.length,
      productsCount: products.length
    });

    const prompt = `Analyze this brand based on their website content and products.

Brand Name: ${brandName || 'Unknown'}
Website: ${normalizedUrl}
Website Content Summary: ${textContent.substring(0, 15000) || 'N/A'}
Key Products: ${productSummary}

Provide a deep strategic analysis. You MUST fill every field with detailed, high-quality strategic insights. Do not leave any field empty. Infer information from the content if not explicitly stated.

FOR PRODUCTS:
If "Key Products" are provided, analyze them and generate "marketing_angles" and "visual_context" for each if missing.
If "Key Products" is empty, you MUST extract products, services, or pricing plans from the "Website Content Summary" and populate the "detectedProducts" field. Look for pricing tables, service lists, or product descriptions.`;

    try {
      // Use 'fast' model (GPT-4o-mini) to avoid rate limits and credit card requirements on free tier
      const { object } = await generateObject({
        model: getModel('fast'),
        schema: brandAnalysisSchema,
        prompt,
        system: 'You are an expert Brand Strategist and Marketing Director. Your goal is to deeply analyze a brand to create high-converting ad campaigns. You MUST fill every field with detailed, high-quality strategic insights. Never return empty values - always infer from available context. IMPORTANT: Return ONLY the JSON object containing the analysis data.',
      });

      console.log('[AI Analysis] Successfully generated structured response');
      console.log('[AI Analysis] Fields populated:', {
        tone: !!object.tone,
        audience: !!object.audience,
        industry: !!object.industry,
        story: !!object.story,
        mission: !!object.mission,
        usps: object.usps?.length || 0,
        painPoints: object.painPoints?.length || 0,
        adAngles: object.adAngles?.length || 0,
        detectedProducts: object.detectedProducts?.length || 0
      });

      return object;
    } catch (genError: any) {
      // Check for Vercel AI Gateway billing/verification errors
      if (genError.message?.includes('credit card') || genError.message?.includes('verification_required')) {
        console.error('\n\n🔴 [AI Analysis] CRITICAL ERROR: Vercel AI Gateway requires verification.');
        console.error('👉 ACTION REQUIRED: Go to https://vercel.com/dashboard/settings/billing and add a payment method to unlock free credits.\n\n');
      }

      console.error('[AI Analysis] generateObject failed, trying fallback:', genError);
      
      // Fallback: Use generateText with manual JSON parsing
      // This helps if the Gateway has issues with structured output endpoints
      const { generateText } = await import('ai');
      const { text } = await generateText({
        model: getModel('fast'),
        prompt: prompt + '\n\nIMPORTANT: Return the result as a valid JSON object matching this structure:\n' + 
          `{
            "tone": "string",
            "audience": "string",
            "industry": "string",
            "values": "string",
            "story": "string",
            "tagline": "string",
            "mission": "string",
            "archetype": "string",
            "usps": ["string"],
            "painPoints": ["string"],
            "customerDesires": ["string"],
            "adAngles": ["string"]
          }`,
        system: 'You are an expert Brand Strategist. Return ONLY valid JSON. Do not include markdown formatting like ```json.',
      });

      try {
        const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
        const parsed = JSON.parse(cleanText);
        console.log('[AI Analysis] Fallback successful');
        return parsed;
      } catch (parseError) {
        console.error('[AI Analysis] Fallback parsing failed:', parseError);
        throw genError; // Throw original error if fallback fails
      }
    }
  } catch (error) {
    console.error('[AI Analysis] ERROR:', error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Normalize and validate URL
    let normalizedUrl: string;
    try {
      normalizedUrl = normalizeUrl(url);
      new URL(normalizedUrl);
    } catch {
      return NextResponse.json({ 
        error: 'Please enter a valid website URL (e.g., example.com or https://example.com)' 
      }, { status: 400 });
    }

    console.log('[Brand Scrape] Starting brand analysis for:', normalizedUrl);

    // Scrape brand data
    const brandData = await scrapeBrandFromUrl(normalizedUrl);
    console.log('[Brand Scrape] Scraped data:', {
      name: brandData.name,
      logo: brandData.logo ? 'YES' : 'NO',
      colors: brandData.colors?.length || 0,
      images: brandData.images?.length || 0,
      products: brandData.products?.length || 0,
      textContentLength: brandData.textContent?.length || 0
    });

    // Try AI analysis (optional, graceful fallback)
    console.log('[Brand Scrape] Starting AI analysis...');
    const analysis = await analyzeWithAI(
      brandData.name || 'Unknown',
      normalizedUrl,
      brandData.textContent || '',
      brandData.products || []
    );
    
    console.log('[Brand Scrape] AI analysis result:', analysis ? 'SUCCESS' : 'FAILED (using fallback)');
    
    // Merge AI product insights back into scraped products
    let enhancedProducts = brandData.products || [];
    if (analysis && analysis.detectedProducts && analysis.detectedProducts.length > 0) {
      // If scraper found nothing, use AI detected products
      if (enhancedProducts.length === 0) {
        enhancedProducts = analysis.detectedProducts.map(p => ({
          name: p.name,
          description: p.description,
          price: p.price,
          metadata: {
            marketing_angles: p.marketing_angles,
            visual_context: p.visual_context,
            source: 'ai_detected'
          }
        }));
      } else {
        // If scraper found products, try to enhance them with AI insights
        // This is a simple merge strategy - could be improved with fuzzy matching
        enhancedProducts = enhancedProducts.map(p => {
          const aiMatch = analysis.detectedProducts?.find(ap => ap.name.includes(p.name) || p.name.includes(ap.name));
          return {
            ...p,
            metadata: {
              ...p.metadata,
              marketing_angles: aiMatch?.marketing_angles || [],
              visual_context: aiMatch?.visual_context || p.metadata?.visual_context || 'Product image',
              colors: aiMatch?.colors || [],
              analyzed: true
            }
          };
        });
      }
    }

    if (analysis) {
      console.log('[Brand Scrape] AI fields populated:', {
        tone: !!analysis.tone,
        audience: !!analysis.audience,
        industry: !!analysis.industry,
        story: !!analysis.story,
        mission: !!analysis.mission,
        usps: analysis.usps?.length || 0,
        painPoints: analysis.painPoints?.length || 0,
        adAngles: analysis.adAngles?.length || 0
      });
    }

    const finalData = {
      ...brandData,
      products: enhancedProducts,
      ...(analysis || {
        tone: '',
        audience: '',
        industry: '',
        values: '',
        story: '',
        tagline: '',
        mission: '',
        archetype: '',
        usps: [],
        painPoints: [],
        customerDesires: [],
        adAngles: []
      }),
    };

    // Merge AI detected products if scraper found none
    if ((!finalData.products || finalData.products.length === 0) && analysis?.detectedProducts && analysis.detectedProducts.length > 0) {
      console.log('[Brand Scrape] Merging AI detected products:', analysis.detectedProducts.length);
      finalData.products = analysis.detectedProducts.map((p: any) => ({
        name: p.name,
        description: p.description,
        price: p.price,
        url: normalizedUrl // Fallback URL since AI can't reliably extract links from text summary
      }));
    }

    // Post-processing: Try to match images to products if they are missing
    if (finalData.products && finalData.products.length > 0 && finalData.images && finalData.images.length > 0) {
      console.log('[Brand Scrape] Running image matching for products...');
      finalData.products = matchImagesToProducts(finalData.products, finalData.images);
    }

    console.log('[Brand Scrape] Final response keys:', Object.keys(finalData));
    
    return NextResponse.json(finalData);
  } catch (error) {
    console.error('[Brand Scrape] ERROR:', error);
    return NextResponse.json(
      { error: 'Failed to scrape brand data' },
      { status: 500 }
    );
  }
}
