/**
 * POST /api/ai/chat
 * 
 * Stream text completion using Vercel AI Gateway
 * Supports streaming responses for real-time updates
 * 
 * Body: { message: string, model?: string }
 * Response: ReadableStream<AIStreamChunk>
 */

import { streamText } from 'ai';
import { gateway } from '@/lib/ai/gateway';

export async function POST(req: Request) {
  try {
    const { message, model } = await req.json();

    if (!message?.trim()) {
      return new Response('Message is required', { status: 400 });
    }

    if (!gateway.isConfigured()) {
      return new Response('AI Gateway not configured', { status: 503 });
    }

    // Stream text using Vercel AI SDK
    const result = streamText({
      model: gateway.getModel(model),
      messages: [{ role: 'user', content: message }],
    });

    // Convert to readable stream for streaming response
    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
