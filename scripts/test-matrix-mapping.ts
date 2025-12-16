
import { db } from '../lib/db/drizzle';
import { brandSettings, brandProducts } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import { getOrCreateContentMatrix } from '../lib/ai/content-matrix';
import { fillTemplateFromMatrix } from '../lib/templates/matrix-mapper';

async function testMatrixMapping() {
  console.log('🚀 Starting End-to-End Matrix Mapping Test...');

  // 1. Fetch User & Brand (Simulating User ID 1)
  const userId = 1;
  console.log(`\n1️⃣ Fetching Brand Settings for User ID: ${userId}`);
  
  const brand = await db.query.brandSettings.findFirst({
    where: eq(brandSettings.userId, userId),
  });

  if (!brand) {
    console.error('❌ No brand found for user 1. Please seed the DB first.');
    process.exit(1);
  }
  console.log(`✅ Brand Found: ${brand.brandName}`);

  // 2. Fetch Products
  const products = await db.query.brandProducts.findMany({
    where: eq(brandProducts.brandId, brand.id),
  });
  console.log(`✅ Products Found: ${products.length}`);

  // 3. Get Content Matrix
  console.log('\n2️⃣ Fetching/Generating Content Matrix...');
  const brandContext = `Brand: ${brand.brandName}, Industry: ${brand.brandIndustry}`;
  const matrix = await getOrCreateContentMatrix(brand.id, brandContext);
  
  if (!matrix || !matrix.headlines || matrix.headlines.length === 0) {
    console.error('❌ Matrix generation failed or returned empty.');
    process.exit(1);
  }
  console.log('✅ Content Matrix Ready.');
  console.log(`   - Headlines: ${matrix.headlines.length}`);
  console.log(`   - CTAs: ${matrix.ctas.length}`);

  // 4. Prepare Images
  const images = {
    logo: brand.brandLogo || undefined,
    general: brand.brandImages ? JSON.parse(brand.brandImages as string) : [],
    products: products.map(p => p.imageUrl).filter(Boolean) as string[],
  };

  // 5. Fetch Real Templates from DB
  console.log('\n3️⃣ Fetching Real Templates from DB...');
  const realTemplates = await db.query.templates.findMany({
    limit: 5, // Test with first 5 templates
  });
  console.log(`✅ Found ${realTemplates.length} templates.`);

  // 6. Run Mapping Test
  console.log('\n4️⃣ Testing Mapping Logic on Real Templates...');

  for (const t of realTemplates) {
    console.log(`\n📋 Template: ${t.name}`);
    // console.log('   Schema:', JSON.stringify(t.llmSchema));
    
    const result = fillTemplateFromMatrix(t.llmSchema as Record<string, any>, matrix, images);
    
    console.log('   Mapped Variables:');
    Object.entries(result).forEach(([key, value]) => {
      let displayValue = value;
      if (typeof value === 'string' && value.length > 50) {
        displayValue = value.substring(0, 50) + '...';
      }
      console.log(`   - ${key}: "${displayValue}"`);
    });

    // Basic Validation
    const keys = Object.keys(result);
    const schemaKeys = Object.keys(t.llmSchema as object);
    const missing = schemaKeys.filter(k => !keys.includes(k));
    
    if (missing.length > 0) {
      console.warn(`   ⚠️ Missing keys: ${missing.join(', ')}`);
    } else {
      console.log('   ✅ All keys mapped.');
    }
  }

  console.log('\n✅ End-to-End Test Complete.');
  process.exit(0);
}

testMatrixMapping().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
