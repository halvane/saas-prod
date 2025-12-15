'use server';

import { db } from '@/lib/db/drizzle';
import { templates, templateEmbeddings } from '@/lib/db/schema';
import { eq, desc, like, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getUser } from '@/lib/db/queries';
import { analyzeTemplate, generateEmbedding } from '@/lib/ai/templates/ingestion';
import { nanoid } from 'nanoid';

export async function getTemplates(
  page: number = 1, 
  limit: number = 20,
  search: string = '',
  category: string = 'all',
  platform: string = 'all',
  status: string = 'all'
) {
  const user = await getUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const offset = (page - 1) * limit;
  
  const conditions = [];

  if (search) {
    conditions.push(like(templates.name, `%${search}%`));
  }
  
  if (category !== 'all') {
    conditions.push(eq(templates.category, category));
  }

  if (platform !== 'all') {
    conditions.push(like(templates.platform, `%${platform}%`));
  }

  if (status !== 'all') {
    conditions.push(eq(templates.isActive, status === 'active'));
  }

  // Optimize query with select only needed fields for list view
  const data = await db.select({
    id: templates.id,
    name: templates.name,
    category: templates.category,
    platform: templates.platform,
    isActive: templates.isActive,
    usageCount: templates.usageCount,
    thumbsUpCount: templates.thumbsUpCount,
    thumbsDownCount: templates.thumbsDownCount,
    createdAt: templates.createdAt,
    htmlTemplate: templates.htmlTemplate,
    cssTemplate: templates.cssTemplate,
    width: templates.width,
    height: templates.height,
    llmSchema: templates.llmSchema,
    variables: templates.variables,
  })
    .from(templates)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(templates.createdAt))
    .limit(limit)
    .offset(offset);
    
  return data;
}


export async function deleteTemplate(templateId: string) {
  const user = await getUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  await db.delete(templates)
    .where(eq(templates.id, templateId));

  revalidatePath('/admin/templates');
}

const MOCK_TEMPLATE = {
  name: "Webinar Confirmation Card",
  description: "A clean, professional confirmation card for webinar registration with date, time, and 'Add to Calendar' CTA.",
  category: "business",
  platform: ["linkedin", "twitter"],
  htmlTemplate: `<div class="card">
  <div class="header">
    <span class="badge">WEBINAR CONFIRMED</span>
  </div>
  <div class="content">
    <h1>{{webinarTitle}}</h1>
    <div class="details">
      <div class="detail-item">
        <span class="icon">📅</span>
        <span>{{date}}</span>
      </div>
      <div class="detail-item">
        <span class="icon">⏰</span>
        <span>{{time}}</span>
      </div>
    </div>
    <p class="description">{{description}}</p>
  </div>
  <div class="footer">
    <div class="cta-button">Add to Calendar</div>
  </div>
</div>`,
  cssTemplate: `.card { background: var(--brand-bg, #ffffff); border-radius: 16px; padding: 32px; font-family: var(--brand-font, sans-serif); box-shadow: 0 10px 30px rgba(0,0,0,0.1); max-width: 600px; margin: 0 auto; } .header { margin-bottom: 24px; } .badge { background: var(--brand-accent, #0070f3); color: white; padding: 6px 12px; border-radius: 100px; font-size: 12px; font-weight: 700; letter-spacing: 1px; } h1 { color: var(--brand-text, #111); font-size: 32px; line-height: 1.2; margin: 0 0 24px 0; } .details { display: flex; gap: 24px; margin-bottom: 24px; } .detail-item { display: flex; align-items: center; gap: 8px; color: var(--brand-text-secondary, #666); font-weight: 500; } .description { color: var(--brand-text-secondary, #666); line-height: 1.6; margin-bottom: 32px; } .cta-button { background: var(--brand-primary, #000); color: white; text-align: center; padding: 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }`,
  width: 1200,
  height: 630,
  tags: ["webinar", "event", "business", "confirmation"]
};

export async function seedTemplatesAction() {
  const user = await getUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  try {
    const analysis = await analyzeTemplate(MOCK_TEMPLATE.htmlTemplate, MOCK_TEMPLATE.cssTemplate);
    const embedding = await generateEmbedding(analysis.description);
    const templateId = nanoid();
    
    await db.transaction(async (tx) => {
      await tx.insert(templates).values({
        id: templateId,
        name: MOCK_TEMPLATE.name,
        description: analysis.description,
        category: MOCK_TEMPLATE.category,
        platform: MOCK_TEMPLATE.platform,
        htmlTemplate: MOCK_TEMPLATE.htmlTemplate,
        cssTemplate: MOCK_TEMPLATE.cssTemplate,
        width: MOCK_TEMPLATE.width,
        height: MOCK_TEMPLATE.height,
        llmSchema: analysis.llmSchema,
        semanticTags: [...MOCK_TEMPLATE.tags, ...analysis.semanticTags],
        isActive: true,
        isPublic: true,
        usageCount: Math.floor(Math.random() * 100),
        thumbsUpCount: Math.floor(Math.random() * 50),
        thumbsDownCount: Math.floor(Math.random() * 10),
      });

      await tx.insert(templateEmbeddings).values({
        templateId: templateId,
        embedding: embedding,
      });
    });

    revalidatePath('/admin/templates');
    return { success: true };
  } catch (error) {
    console.error('Seed failed:', error);
    return { success: false, error: 'Failed to seed templates' };
  }
}

export async function importTemplatesJson(jsonString: string) {
  const user = await getUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  try {
    const parsed = JSON.parse(jsonString);
    const items = Array.isArray(parsed) ? parsed : [parsed];
    
    let successCount = 0;
    let failCount = 0;

    for (const item of items) {
      try {
        // Basic validation
        if (!item.name || !item.htmlTemplate || !item.cssTemplate) {
          console.warn('Skipping invalid template:', item);
          failCount++;
          continue;
        }

        // Analyze and generate embedding
        const analysis = await analyzeTemplate(item.htmlTemplate, item.cssTemplate);
        const embedding = await generateEmbedding(analysis.description);
        const templateId = nanoid();

        await db.transaction(async (tx) => {
          await tx.insert(templates).values({
            id: templateId,
            name: item.name,
            description: item.description || analysis.description,
            category: item.category || 'imported',
            platform: item.platform || ['generic'],
            htmlTemplate: item.htmlTemplate,
            cssTemplate: item.cssTemplate,
            width: item.width || 1080,
            height: item.height || 1080,
            llmSchema: item.llmSchema || analysis.llmSchema,
            semanticTags: [...(item.tags || []), ...analysis.semanticTags],
            isActive: true,
            isPublic: true,
            usageCount: 0,
            thumbsUpCount: 0,
            thumbsDownCount: 0,
          });

          await tx.insert(templateEmbeddings).values({
            templateId: templateId,
            embedding: embedding,
          });
        });
        successCount++;
      } catch (err) {
        console.error('Failed to import item:', item.name, err);
        failCount++;
      }
    }

    revalidatePath('/admin/templates');
    return { success: true, count: successCount, failed: failCount };
  } catch (error) {
    console.error('Import failed:', error);
    return { success: false, error: 'Failed to parse or import JSON' };
  }
}

export async function getTemplate(id: string) {
  const user = await getUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const template = await db.select()
    .from(templates)
    .where(eq(templates.id, id))
    .limit(1);

  return template[0] || null;
}

export async function updateTemplate(id: string, data: any) {
  const user = await getUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  try {
    await db.update(templates)
      .set({
        name: data.name,
        category: data.category,
        platform: data.platform,
        htmlTemplate: data.htmlTemplate,
        cssTemplate: data.cssTemplate,
        width: data.width,
        height: data.height,
        llmSchema: data.llmSchema, // Variables schema
        visualEditorData: data.visualEditorData,
      })
      .where(eq(templates.id, id));

    revalidatePath('/admin/templates');
    return { success: true };
  } catch (error) {
    console.error('Update failed:', error);
    return { success: false, error: 'Failed to update template' };
  }
}

export async function toggleTemplateStatus(id: string, isActive: boolean) {
  const user = await getUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  try {
    await db.update(templates)
      .set({ isActive })
      .where(eq(templates.id, id));

    revalidatePath('/admin/templates');
    return { success: true };
  } catch (error) {
    console.error('Toggle status failed:', error);
    return { success: false, error: 'Failed to update status' };
  }
}
