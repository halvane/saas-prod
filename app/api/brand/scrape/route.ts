import { NextRequest, NextResponse } from 'next/server';
import { scrapeBrandFromUrl } from '@/lib/brand-scraper/service';
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
  adAngles: z.array(z.string()).describe('Array of 3 marketing angles for ad campaigns (specific strategies with hooks)')
});

// AI analysis using Vercel AI SDK
async function analyzeWithAI(brandName: string, normalizedUrl: string, textContent: string, products: any[]) {
  try {
    console.log('[AI Analysis] Starting with Vercel AI SDK...');
    
    const productSummary = products.slice(0, 3).map(p => `${p.name}: ${p.description || ''}`).join('\n');
    console.log('[AI Analysis] Context:', {
      brandName,
      textLength: textContent.length,
      productsCount: products.length
    });

    const prompt = `Analyze this brand based on their website content and products.

Brand Name: ${brandName || 'Unknown'}
Website: ${normalizedUrl}
Website Content Summary: ${textContent.substring(0, 10000) || 'N/A'}
Key Products: ${productSummary}

Provide a deep strategic analysis. You MUST fill every field with detailed, high-quality strategic insights. Do not leave any field empty. Infer information from the content if not explicitly stated.`;

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
        adAngles: object.adAngles?.length || 0
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
