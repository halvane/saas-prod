/**
 * API Route: Stream Text
 * POST /api/ai/stream
 * Streams AI responses in real-time
 */

import { NextRequest, NextResponse } from 'next/server';
import { streamAIChatResponse } from '@/lib/ai';
import { z } from 'zod';

// Input validation schema
const streamSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string().min(1),
    })
  ),
  model: z.enum(['fast', 'standard', 'advanced']).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, model = 'fast' } = streamSchema.parse(body);

    // Stream response
    const stream = await streamAIChatResponse(messages, model);

    // Convert to Web Stream API for Next.js
    return new NextResponse(stream.toReadableStream(), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request format' },
        { status: 400 }
      );
    }

    console.error('AI stream error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to stream response' },
      { status: 500 }
    );
  }
}
