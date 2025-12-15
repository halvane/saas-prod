'use server';

import { findMatchingTemplates } from '@/lib/ai/templates/search';
import { populateTemplate } from '@/lib/ai/templates/generation';
import { db } from '@/lib/db/drizzle';
import { brandSettings, templates } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getUser } from '@/lib/db/queries';
import { getTemplatesForUser } from '@/lib/templates/service';

export async function getUserTemplatesAction() {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');
  
  const templates = await getTemplatesForUser(user.id);
  const brand = await db.query.brandSettings.findFirst({
    where: eq(brandSettings.userId, user.id),
  });

  return { templates, brand };
}

export async function searchTemplatesAction(prompt: string) {
  return await findMatchingTemplates(prompt);
}

export async function generateContentAction(templateId: string, userContent: string) {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');

  const template = await db.query.templates.findFirst({
    where: (templates, { eq }) => eq(templates.id, templateId),
  });

  if (!template) throw new Error('Template not found');

  const brand = await db.query.brandSettings.findFirst({
    where: eq(brandSettings.userId, user.id),
  });

  const content = await populateTemplate(template.llmSchema, userContent, brand?.brandVoice || '');
  
  return { content, brand };
}
