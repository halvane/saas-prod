/**
 * Vercel AI SDK - Core AI Service
 * Provides easy-to-use AI functions for the application
 * https://vercel.com/docs/ai-sdk/concepts/generating-text
 */

import { generateText, streamText, generateObject } from 'ai';
import { z } from 'zod';
import { getModel } from './models';

/**
 * Generate text response
 * @param prompt - The prompt to send to AI
 * @param model - Model tier: 'fast', 'standard', 'advanced'
 * @returns Generated text
 */
export async function generateAIResponse(
  prompt: string,
  model: 'fast' | 'standard' | 'advanced' = 'standard'
): Promise<string> {
  const { text } = await generateText({
    model: getModel(model),
    prompt,
    system: 'You are a helpful AI assistant for content creation. Be concise and clear.',
  });

  return text;
}

/**
 * Generate AI response with chat history
 * @param messages - Array of chat messages
 * @param model - Model tier
 * @returns Generated response
 */
export async function generateAIChatResponse(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  model: 'fast' | 'standard' | 'advanced' = 'standard'
): Promise<string> {
  const { text } = await generateText({
    model: getModel(model),
    messages,
    system: 'You are a helpful AI assistant for content creation. Be concise, clear, and professional.',
  });

  return text;
}

/**
 * Stream AI response (for real-time responses)
 * @param prompt - The prompt to send to AI
 * @param model - Model tier
 * @returns Readable stream
 */
export async function streamAIResponse(
  prompt: string,
  model: 'fast' | 'standard' | 'advanced' = 'fast'
) {
  return streamText({
    model: getModel(model),
    prompt,
    system: 'You are a helpful AI assistant for content creation. Be concise and clear.',
  });
}

/**
 * Stream AI response with chat history
 * @param messages - Array of chat messages
 * @param model - Model tier
 * @returns Stream object
 */
export async function streamAIChatResponse(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  model: 'fast' | 'standard' | 'advanced' = 'fast'
) {
  return streamText({
    model: getModel(model),
    messages,
    system: 'You are a helpful AI assistant for content creation. Be concise, clear, and professional.',
  });
}

/**
 * Generate structured output (JSON)
 * @param prompt - The prompt
 * @param schema - Zod schema for output validation
 * @param model - Model tier
 * @returns Validated structured data
 */
export async function generateAIStructured<T>(
  prompt: string,
  schema: z.ZodSchema,
  model: 'standard' | 'advanced' = 'standard'
): Promise<T> {
  const { object } = await generateObject({
    model: getModel(model),
    prompt,
    schema,
    system: 'You are a helpful AI assistant. Generate valid JSON output.',
  });

  return object as T;
}

/**
 * Generate content variations (for social media, emails, etc.)
 * @param topic - Content topic
 * @param platform - Target platform (twitter, linkedin, instagram, email, blog)
 * @param count - Number of variations
 * @returns Array of content variations
 */
export async function generateContentVariations(
  topic: string,
  platform: 'twitter' | 'linkedin' | 'instagram' | 'email' | 'blog',
  count: number = 3
): Promise<string[]> {
  const platformGuides = {
    twitter: 'Short, engaging, max 280 characters. Include relevant hashtags.',
    linkedin: 'Professional, insightful, 1-3 paragraphs. Use industry language.',
    instagram: 'Engaging, visual-focused, 1-3 sentences. Use emojis.',
    email: 'Clear subject line and body (5-7 sentences). Professional tone.',
    blog: 'Comprehensive, well-structured. 200-400 words. Include examples.',
  };

  const { text } = await generateText({
    model: getModel('fast'),
    prompt: `Generate ${count} unique variations of content about "${topic}" for ${platform}.
    
Guidelines: ${platformGuides[platform]}

Return as numbered list (1. ... 2. ... etc).`,
    system: 'You are a creative content writer. Generate unique, engaging content variations.',
  });

  // Parse numbered list into array
  return text
    .split('\n')
    .filter((line) => line.match(/^\d+\./))
    .map((line) => line.replace(/^\d+\.\s*/, '').trim());
}

/**
 * Improve/rewrite existing content
 * @param content - Original content
 * @param instruction - What to improve (e.g., "make it more concise")
 * @param model - Model tier
 * @returns Improved content
 */
export async function improveAIContent(
  content: string,
  instruction: string = 'improve clarity and engagement',
  model: 'fast' | 'standard' = 'standard'
): Promise<string> {
  const { text } = await generateText({
    model: getModel(model),
    prompt: `Original content:\n"${content}"\n\nInstructions: ${instruction}\n\nProvide only the improved content without explanation.`,
    system: 'You are an expert content editor. Provide high-quality, polished content.',
  });

  return text;
}

/**
 * Analyze content (tone, sentiment, readability, etc.)
 * @param content - Content to analyze
 * @param model - Model tier
 * @returns Analysis result with metrics
 */
export async function analyzeAIContent(
  content: string,
  model: 'standard' | 'advanced' = 'standard'
): Promise<{
  sentiment: 'positive' | 'negative' | 'neutral';
  tone: string;
  readability: 'easy' | 'moderate' | 'difficult';
  engagement: number; // 1-10
  suggestions: string[];
}> {
  const schema = z.object({
    sentiment: z.enum(['positive', 'negative', 'neutral']),
    tone: z.string(),
    readability: z.enum(['easy', 'moderate', 'difficult']),
    engagement: z.number().min(1).max(10),
    suggestions: z.array(z.string()),
  });

  return generateAIStructured(
    `Analyze this content:\n"${content}"\n\nProvide sentiment, tone, readability level, engagement score (1-10), and 2-3 improvement suggestions.`,
    schema,
    model
  );
}
