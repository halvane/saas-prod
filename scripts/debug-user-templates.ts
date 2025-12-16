
import { getUserTemplatesAction } from '../app/(dashboard)/templates/actions';
import { db } from '../lib/db/drizzle';
import { users } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

// Mock getUser to return the first user
jest.mock('../lib/db/queries', () => ({
  getUser: async () => {
    const user = await db.query.users.findFirst();
    return user;
  },
}));

async function debugUserTemplates() {
  console.log('Fetching first user...');
  const user = await db.query.users.findFirst();
  if (!user) {
    console.error('No user found in DB.');
    process.exit(1);
  }
  console.log(`User found: ${user.email} (${user.id})`);

  // We need to mock the session context for the action to work if it relies on cookies
  // But getUserTemplatesAction calls getUser() which we mocked above (sort of, but we can't easily mock module imports in a simple script without ts-node/register magic or jest)
  
  // Instead, let's replicate the logic of getUserTemplatesAction here directly
  // to see what it produces.

  const { getUserTemplatesAction } = await import('../app/(dashboard)/templates/actions');
  
  // We need to hack the getUser import in the compiled file or just copy the logic.
  // Since we can't easily mock in this environment, I will copy the logic to this script for debugging.
  
  console.log('--- Replicating Logic ---');
  
  const { brandSettings, brandProducts, templates } = await import('../lib/db/schema');
  const { getOrCreateContentMatrix } = await import('../lib/ai/content-matrix');
  const { fillTemplateFromMatrix } = await import('../lib/templates/matrix-mapper');
  const { getTemplatesForUser } = await import('../lib/templates/service');

  // 1. Fetch Brand
  const brand = await db.query.brandSettings.findFirst({
    where: eq(brandSettings.userId, user.id),
  });

  if (!brand) {
    console.log('No brand settings found.');
    return;
  }
  console.log(`Brand: ${brand.brandName}`);

  // 2. Fetch Products
  const products = await db.query.brandProducts.findMany({
    where: eq(brandProducts.brandId, brand.id),
  });
  console.log(`Products found: ${products.length}`);

  // 3. Get Matrix
  const brandContext = `Brand: ${brand.brandName}`;
  const matrix = await getOrCreateContentMatrix(brand.id, brandContext);
  console.log('Content Matrix loaded.');
  console.log('Headlines sample:', matrix.headlines.slice(0, 3));

  // 4. Prepare Images
  const images = {
    logo: brand.brandLogo || undefined,
    general: brand.brandImages ? JSON.parse(brand.brandImages as string) : [],
    products: products.map(p => p.imageUrl).filter(Boolean) as string[],
  };
  console.log('Images prepared:', { logo: !!images.logo, general: images.general.length, products: images.products.length });

  // 5. Fetch Templates
  const rawTemplates = await getTemplatesForUser(user.id);
  console.log(`Templates found: ${rawTemplates.length}`);

  if (rawTemplates.length > 0) {
    const template = rawTemplates[0];
    console.log(`\nTesting Template: ${template.name}`);
    console.log('Schema keys:', Object.keys(template.llmSchema));

    const variables = fillTemplateFromMatrix(template.llmSchema, matrix, images);
    console.log('\nGenerated Variables:');
    console.log(JSON.stringify(variables, null, 2));
  }

  process.exit(0);
}

debugUserTemplates().catch(err => {
  console.error(err);
  process.exit(1);
});
