import { generateObject } from 'ai';
import { z } from 'zod';
import { gateway } from '@/lib/ai/gateway';
import { getModel } from '@/lib/ai/models';
import { generateLlmSchemaFromKeys } from '@/lib/templates/template-variables';

/**
 * Populate template using centralized variable system
 * 
 * @param variableKeys - Array of variable keys (from TEMPLATE_VARIABLES registry)
 * @param userContent - User's content/prompt
 * @param brandContext - Brand context for personalization
 */
export async function populateTemplateByKeys(
  variableKeys: string[], 
  userContent: string, 
  brandContext?: string
) {
  if (!gateway.isConfigured()) {
    throw new Error('AI Gateway is not configured');
  }

  // Generate minified schema from variable keys
  const llmSchema = generateLlmSchemaFromKeys(variableKeys);

  const prompt = `
    You are a content generator for social media templates.
    
    User Content: "${userContent}"
    Brand Context: "${brandContext || 'None'}"
    
    Template Variables (JSON):
    ${JSON.stringify(llmSchema, null, 2)}
    
    Generate a JSON object that matches the Template Variables.
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

/**
 * Legacy function for backward compatibility
 * Populate template with custom schema (not using centralized variables)
 */
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
