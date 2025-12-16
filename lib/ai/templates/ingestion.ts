import { generateObject, embed } from 'ai';
import { z } from 'zod';
import { gateway } from '@/lib/ai/gateway';
import { getModel } from '@/lib/ai/models';

export const TemplateMetadataSchema = z.object({
  description: z.string().describe('A verbose description of the template for vector search'),
  semanticTags: z.array(z.string()).describe('List of semantic tags describing the style, mood, and use-case'),
  llmSchema: z.record(z.any()).describe('A minified JSON schema for the variables in the template'),
});

export async function analyzeTemplate(html: string, css: string) {
  if (!gateway.isConfigured()) {
    throw new Error('AI Gateway is not configured');
  }

  const prompt = `
    Analyze the following HTML and CSS template.
    Generate a verbose description suitable for vector search (describe layout, style, mood, use-case).
    Extract semantic tags.
    Generate a minified JSON schema for the variables found in the HTML (e.g. {{variable}}).
    
    HTML:
    ${html.substring(0, 10000)}
    
    CSS:
    ${css.substring(0, 5000)}
  `;

  const { object } = await generateObject({
    model: getModel('advanced'), // Use a strong model for analysis
    schema: TemplateMetadataSchema,
    prompt,
  });

  return object;
}

export async function generateEmbedding(text: string) {
  if (!gateway.isConfigured()) {
    throw new Error('AI Gateway is not configured');
  }

  const { embedding } = await embed({
    model: gateway.getEmbeddingModel('text-embedding-3-small'),
    value: text,
  });

  return embedding;
}
