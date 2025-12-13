import 'server-only';
import { db } from '@/lib/db/drizzle';
import { shopifyIntegrations } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET;
const SHOPIFY_APP_URL = process.env.SHOPIFY_APP_URL;
const SHOPIFY_SCOPES = process.env.SHOPIFY_SCOPES || 'read_products,read_content';

if (!SHOPIFY_API_KEY || !SHOPIFY_API_SECRET || !SHOPIFY_APP_URL) {
  console.warn('Shopify environment variables are missing');
}

export function getShopifyAuthUrl(shop: string, state: string) {
  const redirectUri = `${SHOPIFY_APP_URL}/api/shopify/callback`;
  const scopes = SHOPIFY_SCOPES;
  
  return `https://${shop}/admin/oauth/authorize?client_id=${SHOPIFY_API_KEY}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
}

export async function exchangeCodeForToken(shop: string, code: string) {
  const url = `https://${shop}/admin/oauth/access_token`;
  const body = {
    client_id: SHOPIFY_API_KEY,
    client_secret: SHOPIFY_API_SECRET,
    code,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange Shopify token: ${error}`);
  }

  return response.json(); // { access_token, scope }
}

export async function getShopifyIntegration(userId: number) {
  const integration = await db
    .select()
    .from(shopifyIntegrations)
    .where(eq(shopifyIntegrations.userId, userId))
    .limit(1);
    
  return integration[0] || null;
}

export async function saveShopifyIntegration(userId: number, shop: string, accessToken: string, scope: string) {
  // Check if exists
  const existing = await getShopifyIntegration(userId);
  
  if (existing) {
    return await db
      .update(shopifyIntegrations)
      .set({
        shopUrl: shop,
        accessToken,
        scope,
        updatedAt: new Date(),
      })
      .where(eq(shopifyIntegrations.id, existing.id))
      .returning();
  } else {
    return await db
      .insert(shopifyIntegrations)
      .values({
        userId,
        shopUrl: shop,
        accessToken,
        scope,
      })
      .returning();
  }
}

export async function getShopifyProducts(userId: number) {
  const integration = await getShopifyIntegration(userId);
  if (!integration) return [];

  const response = await fetch(`https://${integration.shopUrl}/admin/api/2025-10/products.json`, {
    headers: {
      'X-Shopify-Access-Token': integration.accessToken,
    },
  });

  if (!response.ok) return [];
  const data = await response.json();
  return data.products || [];
}

export async function getShopifyBlogs(userId: number) {
  const integration = await getShopifyIntegration(userId);
  if (!integration) return [];

  const response = await fetch(`https://${integration.shopUrl}/admin/api/2025-10/blogs.json`, {
    headers: {
      'X-Shopify-Access-Token': integration.accessToken,
    },
  });

  if (!response.ok) return [];
  const data = await response.json();
  return data.blogs || [];
}
