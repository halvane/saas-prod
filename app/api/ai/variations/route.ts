/**
 * API Route: Content Variations
 * POST /api/ai/variations
 * Generates multiple content variations for different platforms
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateContentVariations } from '@/lib/ai';
import { z } from 'zod';

// Input validation schema
const variationsSchema = z.object({
  topic: z.string().min(1),
  platform: z.enum(['twitter', 'linkedin', 'instagram', 'email', 'blog']),
  count: z.number().min(1).max(10).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, platform, count = 3 } = variationsSchema.parse(body);

    // Generate variations
    const variations = await generateContentVariations(topic, platform, count);

    return NextResponse.json(
      { success: true, variations, platform, topic },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request format' },
        { status: 400 }
      );
    }

    console.error('Content variation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate variations' },
      { status: 500 }
    );
  }
}
