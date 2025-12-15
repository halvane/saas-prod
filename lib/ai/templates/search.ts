import { db } from '@/lib/db/drizzle';
import { templates, templateEmbeddings } from '@/lib/db/schema';
import { generateEmbedding } from './ingestion';
import { cosineDistance, desc, gt, sql, eq } from 'drizzle-orm';

export async function findMatchingTemplates(prompt: string, limit = 5) {
  const vector = await generateEmbedding(prompt);
  
  // Cosine similarity = 1 - cosine distance
  const similarity = sql<number>`1 - (${cosineDistance(templateEmbeddings.embedding, vector)})`;
  
  const results = await db
    .select({
      template: templates,
      similarity,
    })
    .from(templateEmbeddings)
    .innerJoin(templates, eq(templateEmbeddings.templateId, templates.id))
    .where(gt(similarity, 0.5)) // Threshold
    .orderBy(desc(similarity))
    .limit(limit);
    
  return results.map(r => ({ ...r.template, score: r.similarity }));
}
