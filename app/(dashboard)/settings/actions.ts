'use server';

import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { users, brandSettings, brandProducts } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';
import { createUserProfile, generateJwt, getUserProfile } from '@/lib/upload-post/service';
import { getShopifyIntegration } from '@/lib/shopify/service';

export async function getBrandSettings() {
  const user = await getUser();
  if (!user) return null;

  const settings = await db
    .select()
    .from(brandSettings)
    .where(eq(brandSettings.userId, user.id))
    .limit(1);

  if (settings.length === 0) return null;

  const s = settings[0];
  
  // Fetch products
  const products = await db
    .select()
    .from(brandProducts)
    .where(eq(brandProducts.brandId, s.id));

  return {
    ...s,
    brandColors: s.brandColors ? JSON.parse(s.brandColors) : [],
    brandImages: s.brandImages ? JSON.parse(s.brandImages) : [],
    brandUsps: s.brandUniqueSellingPoints ? JSON.parse(s.brandUniqueSellingPoints as string) : [],
    brandPainPoints: s.brandPainPoints ? JSON.parse(s.brandPainPoints as string) : [],
    customerDesires: s.brandCustomerDesires ? JSON.parse(s.brandCustomerDesires as string) : [],
    adAngles: s.adAngles ? JSON.parse(s.adAngles as string) : [],
    products: products || [],
  };
}

export async function saveBrandSettings(data: any) {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');

  const existing = await db
    .select()
    .from(brandSettings)
    .where(eq(brandSettings.userId, user.id))
    .limit(1);

  const payload = {
    userId: user.id,
    brandName: data.brandName,
    brandUrl: data.brandUrl,
    brandLogo: data.brandLogo,
    brandColors: JSON.stringify(data.brandColors || []),
    brandVoice: data.brandVoice,
    brandAudience: data.brandAudience,
    brandIndustry: data.brandIndustry,
    brandValues: data.brandValues,
    brandStory: data.brandStory,
    brandImages: JSON.stringify(data.brandImages || []),
    
    // New deep brand fields
    brandArchetype: data.brandArchetype,
    brandTagline: data.brandTagline,
    brandMission: data.brandMission,
    brandUniqueSellingPoints: JSON.stringify(data.brandUsps || []),
    brandPainPoints: JSON.stringify(data.brandPainPoints || []),
    brandCustomerDesires: JSON.stringify(data.customerDesires || []),
    adAngles: JSON.stringify(data.adAngles || []),
    
    updatedAt: new Date(),
  };

  let brandId;

  if (existing.length > 0) {
    brandId = existing[0].id;
    await db
      .update(brandSettings)
      .set(payload)
      .where(eq(brandSettings.id, brandId));
  } else {
    const res = await db.insert(brandSettings).values(payload).returning({ id: brandSettings.id });
    brandId = res[0].id;
  }

  // Save products if provided
  if (data.products && Array.isArray(data.products)) {
    // First delete existing products for this brand (simple sync strategy)
    await db.delete(brandProducts).where(eq(brandProducts.brandId, brandId));
    
    if (data.products.length > 0) {
      await db.insert(brandProducts).values(
        data.products.map((p: any) => ({
          brandId,
          name: p.name,
          description: p.description,
          price: p.price,
          imageUrl: p.imageUrl,
          productUrl: p.productUrl,
          metadata: JSON.stringify(p.metadata || {}),
        }))
      );
    }
  }
  
  return { success: true };
}

export async function getShopifyStatus() {
  const user = await getUser();
  if (!user) return null;
  
  const integration = await getShopifyIntegration(user.id);
  if (!integration) return null;

  return {
    shopUrl: integration.shopUrl,
    connectedAt: integration.createdAt,
  };
}

export async function getConnectedAccounts() {
  const user = await getUser();
  if (!user) {
    return [];
  }

  const username = `user_${user.id}`;
  
  try {
    const profile = await getUserProfile(username);
    
    if (profile && profile.social_accounts) {
      // social_accounts is an object like { tiktok: "", facebook: { ... } }
      // We want to return the details for connected platforms
      return Object.entries(profile.social_accounts)
        .filter(([_, value]) => value && typeof value === 'object')
        .map(([platform, value]: [string, any]) => ({
          platform,
          username: value.handle || value.display_name || 'Connected',
          displayName: value.display_name,
          image: value.social_images
        }));
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch connected accounts:', error);
    return [];
  }
}

export async function connectSocialMedia() {
  const user = await getUser();
  if (!user) {
    throw new Error('User not found');
  }

  const username = `user_${user.id}`;

  // Ensure user exists in Upload-Post
  if (!user.uploadPostSynced) {
    try {
      await createUserProfile(username);
      await db.update(users)
        .set({ uploadPostSynced: true })
        .where(eq(users.id, user.id));
    } catch (error) {
      console.error('Failed to create Upload-Post profile:', error);
      throw new Error('Failed to initialize social media connection');
    }
  }

  // Generate JWT and get redirect URL
  try {
    const { access_url } = await generateJwt(username);
    return access_url;
  } catch (error) {
    console.error('Failed to generate connection URL:', error);
    throw new Error('Failed to generate connection URL');
  }
}
