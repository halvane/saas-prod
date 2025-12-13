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
      maxTokens: maxTokens || 4096,
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
      { success: true, response },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request format' },
        { status: 400 }
      );
    }

    console.error('AI generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
