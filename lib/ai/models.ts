/**
 * Vercel AI SDK - Model Configuration
 * Defines available AI models and their settings
 * https://vercel.com/docs/ai-sdk
 */

import { openai } from '@ai-sdk/openai';

export const AI_MODELS = {
  // Fast, cheap, for simple tasks
  fast: openai('gpt-4o-mini'),

  // Standard, balanced performance and cost
  standard: openai('gpt-4-turbo'),

  // Advanced, best quality (use sparingly)
  advanced: openai('gpt-4o'),

  // Structured output (for JSON responses)
  structured: openai('gpt-4o'),
};

/**
 * Get model by tier
 * Usage: const model = getModel('fast');
 */
export const getModel = (tier: 'fast' | 'standard' | 'advanced' | 'structured' = 'standard') => {
  return AI_MODELS[tier];
};
