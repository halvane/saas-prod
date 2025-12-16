import { generateObject } from 'ai';
import { z } from 'zod';
import { gateway } from '@/lib/ai/gateway';
import { getModel } from '@/lib/ai/models';

export async function populateTemplate(llmSchema: any, userContent: string, brandContext?: string) {
  if (!gateway.isConfigured()) {
    throw new Error('AI Gateway is not configured');
  }

  const prompt = `
    You are a content generator for social media templates.
    
    User Content: "${userContent}"
    Brand Context: "${brandContext || 'None'}"
    
    Template Schema (JSON):
    ${JSON.stringify(llmSchema, null, 2)}
    
    Generate a JSON object that matches the Template Schema.
    Fill in the values based on the User Content and Brand Context.
    Keep text concise and engaging.
  `;

  const { object } = await generateObject({
    model: getModel('fast'), // Fast model is enough for population
    schema: z.record(z.any()), // We expect a JSON object matching the schema
    prompt,
  });

  return object;
}
