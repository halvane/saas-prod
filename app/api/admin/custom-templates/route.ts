import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { templates } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const allTemplates = await db.query.templates.findMany({
      where: eq(templates.isActive, true),
      orderBy: [desc(templates.createdAt)],
      // Optimization: Exclude heavy fields for list view if possible, 
      // but the builder might need them for preview. 
      // For now, we fetch everything as the builder expects full objects.
    });

    return NextResponse.json({ templates: allTemplates });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
