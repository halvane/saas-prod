
import fs from 'fs';
import path from 'path';
import { db } from '@/lib/db/drizzle';
import { templates } from '@/lib/db/schema';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

const JSON_PATH = path.join(process.cwd(), '..', 'purlema', 'Purval', 'purlema-ai-platform', 'backups', 'templates', 'templates_2025-12-10_13-38_408-templates.json');

async function seedTemplates() {
  try {
    console.log('Reading templates from:', JSON_PATH);
    if (!fs.existsSync(JSON_PATH)) {
        console.error('File not found:', JSON_PATH);
        process.exit(1);
    }
    const fileContent = fs.readFileSync(JSON_PATH, 'utf-8');
    const allTemplates = JSON.parse(fileContent);

    const templatesToInsert = allTemplates;
    console.log(`Found ${allTemplates.length} templates. Inserting all...`);

    for (const t of templatesToInsert) {
      // Use the variables exactly as they are in the JSON
      const variables = t.variables || {};

      // Generate a simple LLM schema: "key": "Value for key"
      const llmSchema = Object.keys(variables).reduce((acc: any, key) => {
        acc[key] = `Value for ${key}`;
        return acc;
      }, {});

      await db.insert(templates).values({
        id: t.id,
        name: t.name,
        description: t.description,
        htmlTemplate: t.htmlTemplate,
        cssTemplate: t.cssTemplate || '', // Ensure not null
        llmSchema: llmSchema,
        variables: t.variables,
        semanticTags: t.tags,
        category: t.category,
        platform: t.platform,
        thumbnailUrl: t.thumbnailUrl,
        previewUrl: t.previewUrl,
        isPublic: t.isPublic,
        isActive: t.isActive,
        width: t.width,
        height: t.height,
        usageCount: t.usageCount,
        thumbsUpCount: 0,
        thumbsDownCount: 0,
        createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
        updatedAt: t.updatedAt ? new Date(t.updatedAt) : new Date(),
      }).onConflictDoUpdate({
        target: templates.id,
        set: {
            name: t.name,
            description: t.description,
            htmlTemplate: t.htmlTemplate,
            cssTemplate: t.cssTemplate || '',
            llmSchema: llmSchema,
            variables: t.variables,
            semanticTags: t.tags,
            category: t.category,
            platform: t.platform,
            thumbnailUrl: t.thumbnailUrl,
            previewUrl: t.previewUrl,
            isPublic: t.isPublic,
            isActive: t.isActive,
            width: t.width,
            height: t.height,
            updatedAt: new Date(),
        }
      });
      console.log(`Inserted/Updated template: ${t.name}`);
    }

    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding templates:', error);
    process.exit(1);
  }
}

seedTemplates();
