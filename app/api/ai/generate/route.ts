/**
 * POST /api/ai/generate
 * 
 * Generate text completion using Vercel AI Gateway
 * Non-streaming response (use /chat for streaming)
 * 
 * Request body:
 * {
 *   prompt: string       // The input prompt
 *   model?: string       // Optional model override (default: gpt-4o-mini)
 *   maxTokens?: number   // Token limit
 *   temperature?: number // Response creativity (0-2)
 * }
 * 
 * Response:
 * {
 *   text: string
 *   usage: { promptTokens, completionTokens, totalTokens }
 *   finishReason: 'stop' | 'length' | 'error'
 * }
 */

import { generateText } from 'ai';
import { gateway } from '@/lib/ai/gateway';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, model, maxTokens, temperature } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!gateway.isConfigured()) {
      return NextResponse.json({ error: 'AI Gateway not configured' }, { status: 503 });
    }

    // Generate text using Vercel AI SDK + Gateway
    const result = await generateText({
      model: gateway.getModel(model),
      prompt,
      temperature: temperature ?? undefined,
    });

    return NextResponse.json({
      text: result.text,
      usage: result.usage,
      finishReason: result.finishReason,
    });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
