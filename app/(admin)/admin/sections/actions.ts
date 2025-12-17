'use server';

import { z } from 'zod';
import { db } from '@/lib/db/drizzle';
import { templateSections } from '@/lib/db/schema';
import { eq, desc, like, and } from 'drizzle-orm';
import { validatedActionWithUser } from '@/lib/auth/middleware';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { generateObject } from 'ai';
import { gateway } from '@/lib/ai/gateway';

const sectionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  html: z.string().min(1, 'HTML is required'),
  css: z.string().optional().default(''),
  variables: z.string().optional(), // JSON string
  tags: z.string().optional(), // Comma separated
  thumbnailUrl: z.string().optional(),
});

export const createSection = validatedActionWithUser(
  sectionSchema,
  async (data, formData, user) => {
    if (user.role !== 'admin') {
      return { error: 'Unauthorized' };
    }

    const variables = data.variables ? JSON.parse(data.variables) : [];
    const tags = data.tags ? data.tags.split(',').map(t => t.trim()) : [];

    await db.insert(templateSections).values({
      name: data.name,
      category: data.category,
      html: data.html,
      css: data.css || '',
      variables,
      tags,
      thumbnailUrl: data.thumbnailUrl,
    });

    revalidatePath('/admin/sections');
    redirect('/admin/sections');
  }
);

export const updateSection = validatedActionWithUser(
  sectionSchema.extend({ id: z.string() }),
  async (data, formData, user) => {
    if (user.role !== 'admin') {
      return { error: 'Unauthorized' };
    }

    const variables = data.variables ? JSON.parse(data.variables) : [];
    const tags = data.tags ? data.tags.split(',').map(t => t.trim()) : [];

    await db
      .update(templateSections)
      .set({
        name: data.name,
        category: data.category,
        html: data.html,
        css: data.css || '',
        variables,
        tags,
        thumbnailUrl: data.thumbnailUrl,
        updatedAt: new Date(),
      })
      .where(eq(templateSections.id, parseInt(data.id)));

    revalidatePath('/admin/sections');
    revalidatePath(`/admin/sections/${data.id}`);
    return { success: 'Section updated successfully' };
  }
);

export const deleteSection = validatedActionWithUser(
  z.object({ id: z.string() }),
  async (data, formData, user) => {
    if (user.role !== 'admin') {
      return { error: 'Unauthorized' };
    }

    await db
      .delete(templateSections)
      .where(eq(templateSections.id, parseInt(data.id)));

    revalidatePath('/admin/sections');
    redirect('/admin/sections');
  }
);

export async function getSections(search?: string, category?: string) {
  try {
    const conditions = [];
    
    if (search) {
      conditions.push(like(templateSections.name, `%${search}%`));
    }
    
    if (category && category !== 'all') {
      conditions.push(eq(templateSections.category, category));
    }

    const result = await db
      .select()
      .from(templateSections)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(templateSections.createdAt))
      .limit(50);
    
    return result || [];
  } catch (error) {
    console.error('Error fetching sections:', error);
    return [];
  }
}

export async function getSection(id: number) {
  try {
    const result = await db
      .select()
      .from(templateSections)
      .where(eq(templateSections.id, id))
      .limit(1);
    
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching section:', error);
    return null;
  }
}

const generateSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  count: z.coerce.number().min(1).default(1),
  model: z.string().optional(),
});

export const generateSectionsAI = validatedActionWithUser(
  generateSchema,
  async (data, formData, user) => {
    if (user.role !== 'admin') {
      return { error: 'Unauthorized' };
    }

    if (!gateway.isConfigured()) {
      console.error('AI Gateway not configured');
      return { error: 'AI Gateway is not configured. Please check your environment variables.' };
    }

    try {
      console.log('Starting AI generation with model:', data.model);
      const result = await generateObject({
        model: gateway.getModel(data.model || 'claude-3-7-sonnet-20250219'),
        schema: z.object({
          sections: z.array(z.object({
            name: z.string(),
            category: z.string(),
            html: z.string(),
            css: z.string(),
            tags: z.array(z.string()),
          })),
        }),
        prompt: data.prompt,
      });

      console.log('AI generation successful, sections:', result.object.sections.length);
      return { sections: result.object.sections };
    } catch (error) {
      console.error('AI Generation Error:', error);
      return { error: error instanceof Error ? error.message : 'Failed to generate sections. Please try again.' };
    }
  }
);

const generateImageSchema = z.object({
  prompt: z.string(),
  model: z.string().optional(),
});

export const generateSectionsFromImages = validatedActionWithUser(
  generateImageSchema,
  async (data, formData, user) => {
    console.log('generateSectionsFromImages action started');
    try {
      if (user.role !== 'admin') {
        console.warn('Unauthorized access attempt');
        return { error: 'Unauthorized' };
      }

      if (!gateway.isConfigured()) {
        console.error('AI Gateway not configured');
        return { error: 'AI Gateway not configured' };
      }

      const images = formData.getAll('images') as File[];
      console.log(`Received ${images?.length} images`);
      
      if (!images || images.length === 0) {
        console.warn('No images provided in formData');
        return { error: 'No images provided' };
      }

      try {
      console.log('Starting image processing...');
      // Convert images to base64 or buffers for the AI SDK
      const imageParts = await Promise.all(images.map(async (file) => {
        console.log(`Processing file: ${file.name} (${file.size} bytes, ${file.type})`);
        const buffer = await file.arrayBuffer();
        return {
          type: 'image' as const,
          image: buffer,
        };
      }));
      console.log(`Processed ${imageParts.length} images successfully.`);

      // STEP 1: Analyze image with fast vision model (GPT-4o-mini) to identify sections
      console.log('Step 1: Analyzing image structure with GPT-4o-mini...');
      let detectedSections: { title: string; description: string; type: string }[] = [];
      
      try {
        // Use a try-catch block specifically for the model retrieval to debug
        let visionModel;
        try {
           console.log('Retrieving gpt-4o-mini model...');
           visionModel = gateway.getModel('gpt-4o-mini');
           console.log('Model retrieved successfully');
        } catch (e) {
           console.error('Failed to get gpt-4o-mini model:', e);
           // Fallback to default model if specific one fails
           visionModel = gateway.getModel();
           console.log('Falling back to default model');
        }

        console.log('Calling generateObject for analysis...');
        const analysisResult = await generateObject({
          model: visionModel, 
          schema: z.object({
            sections: z.array(z.object({
              title: z.string().describe("Short title of the section"),
              description: z.string().describe("Detailed visual description of the section, including colors, layout, and content"),
              type: z.string().describe("Type of section (must be one of: Hero, Features, Testimonials, Pricing, FAQ, CTA, Header, Footer, Gallery, Steps, Team, Blog, Contact, Stats, Content)")
            })),
          }),
          messages: [
            {
              role: 'user',
              content: [
                { 
                  type: 'text', 
                  text: `Analyze this website screenshot. Break it down into distinct, independent UI sections. 
                  
                  Identify each section as one of the following types:
                  - Hero
                  - Features
                  - Testimonials
                  - Pricing
                  - FAQ
                  - Call to Action (CTA)
                  - Header
                  - Footer
                  - Gallery
                  - Steps
                  - Team
                  - Blog
                  - Contact
                  - Stats
                  - Content
                  
                  Return a JSON list of these sections. For each section, provide:
                  1. A short title.
                  2. The type from the list above.
                  3. A detailed visual description (colors, layout, typography, specific content).
                  
                  CRITICAL: If the image contains multiple sections (e.g. a Hero followed by Features), you MUST list them as separate items in the array. Do not group them.` 
                },
                ...imageParts,
              ],
            },
          ],
        });
        detectedSections = analysisResult.object.sections;
        console.log(`Step 1 Complete. Detected ${detectedSections.length} sections:`, detectedSections.map(s => s.title));
      } catch (step1Error) {
        console.error('Step 1 (Analysis) failed:', step1Error);
        console.log('Falling back to direct generation...');
      }

      // STEP 2: Generate code using the selected model, guided by the analysis
      console.log(`Step 2: Generating code with ${data.model || 'claude-3-7-sonnet-20250219'}...`);
      
      let analysisContext = "";
      if (detectedSections.length > 0) {
        analysisContext = `
I have analyzed the image and identified the following distinct sections. 
You must generate a SEPARATE code object for EACH section listed below.

${detectedSections.map((s, i) => `ITEM ${i + 1}: ${s.title} (Type: ${s.type})
Description: ${s.description}
`).join('\n')}

INSTRUCTIONS:
1. Generate a separate entry in the 'sections' array for EACH item listed above.
2. For each section, generate ONLY the HTML/CSS for that specific component.
3. Do NOT generate a full page layout (no <html>, <body>, <head>).
4. Do NOT combine multiple sections into one.
5. Use the 'category' field to match the section type (e.g., "Hero", "Features").
`;
      } else {
        analysisContext = "Please analyze the image and identify all distinct sections. Generate a separate object for each section found.";
      }

      console.log('Calling generateObject for code generation...');
      const result = await generateObject({
        model: gateway.getModel(data.model || 'claude-3-7-sonnet-20250219'),
        schema: z.object({
          sections: z.array(z.object({
            name: z.string(),
            category: z.string(),
            html: z.string(),
            css: z.string(),
            tags: z.array(z.string()),
          })),
        }),
        messages: [
          {
            role: 'system',
            content: data.prompt + "\n\n" + analysisContext
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: "Generate the code for the sections identified in the analysis, using the image as a visual reference." },
              ...imageParts,
            ],
          },
        ],
      });

      console.log('Step 2 Complete. Generated sections:', result.object.sections.length);
      return { sections: result.object.sections };
      } catch (innerError) {
        console.error('Image Generation Error (Inner):', innerError);
        return { error: innerError instanceof Error ? innerError.message : 'Failed to generate sections from images.' };
      }
    } catch (outerError) {
      console.error('Image Generation Error (Outer):', outerError);
      return { error: 'An unexpected error occurred during section generation.' };
    }
  }
);
