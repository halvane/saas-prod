import { db } from '@/lib/db/drizzle';
import { templates, generatedTemplateValues } from '@/lib/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { generateBatchTemplateValues } from '@/lib/ai/template-generator';

export async function getTemplatesForUser(userId: number) {
  // 1. Fetch all active templates
  // Optimization: Exclude heavy htmlTemplate and cssTemplate to save bandwidth
  const activeTemplates = await db.query.templates.findMany({
    where: eq(templates.isActive, true),
    columns: {
      id: true,
      name: true,
      description: true,
      category: true,
      platform: true,
      width: true,
      height: true,
      variables: true,
      llmSchema: true,
      semanticTags: true,
      isActive: true,
      isPublic: true,
      usageCount: true,
      createdAt: true,
      updatedAt: true,
      // htmlTemplate: false, // Excluded
      // cssTemplate: false,  // Excluded
    }
  });

  if (activeTemplates.length === 0) {
    return [];
  }

  // 2. Fetch existing generated values for this user
  const userValues = await db.query.generatedTemplateValues.findMany({
    where: eq(generatedTemplateValues.userId, userId),
  });

  // Map values by templateId for easy lookup
  const valuesMap = new Map(userValues.map((v) => [v.templateId, v.values]));

  // 3. Identify templates missing values
  const missingValueTemplates = activeTemplates.filter(
    (t) => !valuesMap.has(t.id)
  );

  // 4. Trigger generation for missing values (Background / Async)
  // We don't await this to keep the UI fast, unless it's critical.
  // For now, we'll trigger it and return what we have.
  // If it's the first time, the user might see empty templates until refresh.
  // Ideally, this should be done at onboarding.
  if (missingValueTemplates.length > 0) {
    // Fire and forget (or use a queue in production)
    generateBatchTemplateValues(userId, missingValueTemplates).catch((err) =>
      console.error('Background template generation failed:', err)
    );
  }

  // 5. Return templates with values injected
  return activeTemplates.map((t) => {
    const generated = valuesMap.get(t.id) as Record<string, any> | undefined;
    
    // Merge generated values with default variables (if any)
    // Generated values take precedence
    const mergedVariables = {
      ...(t.variables as Record<string, any>),
      ...generated,
    };

    return {
      ...t,
      variables: mergedVariables,
      isPersonalized: !!generated,
    };
  });
}

export async function regenerateAllTemplatesForUser(userId: number) {
  const activeTemplates = await db.query.templates.findMany({
    where: eq(templates.isActive, true),
  });
  
  if (activeTemplates.length > 0) {
    return await generateBatchTemplateValues(userId, activeTemplates);
  }
  return [];
}
