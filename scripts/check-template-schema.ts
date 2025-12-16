
import { db } from '../lib/db/drizzle';
import { templates } from '../lib/db/schema';

async function checkTemplate() {
  const template = await db.query.templates.findFirst();
  if (!template) {
    console.log('No templates found');
    return;
  }
  console.log('Template Name:', template.name);
  console.log('HTML Content:', template.htmlTemplate);
  console.log('LLM Schema:', JSON.stringify(template.llmSchema, null, 2));
  process.exit(0);
}

checkTemplate();
