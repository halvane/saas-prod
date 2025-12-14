'use server';

import crypto from 'crypto';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { users, brandSettings, brandProducts } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';
import { revalidatePath } from 'next/cache';
import { createUserProfile, generateJwt, getUserProfile } from '@/lib/upload-post/service';
import { getShopifyIntegration } from '@/lib/shopify/service';
import { uploadAsset } from '@/lib/storage';

// Helper to process and upload images to Vercel Blob
async function processImage(imageUrl: string | null | undefined, folder: string): Promise<string | null> {
  if (!imageUrl) return null;
  
  // If it's already a Vercel Blob URL, return it as is
  if (imageUrl.includes('public.blob.vercel-storage.com')) {
    return imageUrl;
  }

  // Check if token is present
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('[processImage] ❌ BLOB_READ_WRITE_TOKEN is missing in environment variables');
    return imageUrl;
  }

  try {
    console.log(`[processImage] Processing image: ${imageUrl.substring(0, 50)}...`);
    
    let buffer: Buffer;
    let ext = 'jpg';

    // Handle Data URLs directly
    if (imageUrl.startsWith('data:')) {
      console.log('[processImage] Detected Data URL');
      const base64Data = imageUrl.split(',')[1];
      buffer = Buffer.from(base64Data, 'base64');
      const mimeType = imageUrl.split(';')[0].split(':')[1];
      ext = mimeType.split('/')[1] || 'png';
    } else {
      console.log(`[processImage] Downloading image from URL`);
      const response = await fetch(imageUrl);
      if (!response.ok) {
        console.warn(`[processImage] Failed to fetch image: ${response.statusText}`);
        return imageUrl; // Fallback to original URL
      }
      const arrayBuffer = await response.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      
      // Try to guess extension from content-type
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('png')) ext = 'png';
      else if (contentType?.includes('webp')) ext = 'webp';
      else if (contentType?.includes('svg')) ext = 'svg';
    }

    // Generate SHA-256 hash for de-duplication
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    const filename = `${hash}.${ext}`;
    
    console.log(`[processImage] Uploading to Blob (Hash: ${hash}): ${folder}/${filename}`);
    
    // Use allowOverwrite: true to avoid errors if the file already exists (since we use content hashing, it's the same file)
    const blobUrl = await uploadAsset(filename, buffer, folder);
    
    console.log(`[processImage] ✅ Upload success: ${blobUrl}`);
    return blobUrl;
  } catch (error) {
    console.error('[processImage] ❌ Error processing image:', error);
    return imageUrl; // Fallback to original URL
  }
}

export async function getBrandSettings() {
  console.log('[getBrandSettings] Fetching brand settings');
  const user = await getUser();
  if (!user) {
    console.log('[getBrandSettings] No user found');
    return null;
  }
  console.log('[getBrandSettings] User found:', user.id);

  const settings = await db
    .select()
    .from(brandSettings)
    .where(eq(brandSettings.userId, user.id))
    .limit(1);

  if (settings.length === 0) {
    console.log('[getBrandSettings] No settings found for user');
    return null;
  }

  console.log('[getBrandSettings] Settings found, ID:', settings[0].id);

  const s = settings[0];
  
  // Fetch products
  const products = await db
    .select()
    .from(brandProducts)
    .where(eq(brandProducts.brandId, s.id));

  const parsedProducts = products.map(p => {
    try {
      return {
        ...p,
        metadata: p.metadata ? JSON.parse(p.metadata as string) : {}
      };
    } catch (e) {
      console.error('[getBrandSettings] Error parsing product metadata:', e);
      return { ...p, metadata: {} };
    }
  });

  const safeParse = (json: string | null, fallback: any = []) => {
    if (!json) return fallback;
    try {
      return JSON.parse(json);
    } catch (e) {
      console.error('[getBrandSettings] Error parsing JSON:', e);
      return fallback;
    }
  };

  return {
    ...s,
    brandColors: safeParse(s.brandColors),
    brandImages: safeParse(s.brandImages),
    brandUsps: safeParse(s.brandUniqueSellingPoints),
    brandPainPoints: safeParse(s.brandPainPoints),
    customerDesires: safeParse(s.brandCustomerDesires),
    adAngles: safeParse(s.adAngles),
    products: parsedProducts || [],
  };
}

export async function saveBrandSettings(data: any) {
  console.log('[saveBrandSettings] Starting save operation');
  console.log('[saveBrandSettings] Input data keys:', Object.keys(data));
  console.log('[saveBrandSettings] Brand name:', data.brandName);
  console.log('[saveBrandSettings] Brand images count:', data.brandImages?.length);
  
  const user = await getUser();
  
  console.log('[saveBrandSettings] User result:', user ? { id: user.id, email: user.email } : 'NULL');
  
  if (!user) {
    console.error('[saveBrandSettings] ❌ No user found - Unauthorized');
    console.error('[saveBrandSettings] Session cookie missing or invalid');
    throw new Error('Unauthorized - Please sign in again');
  }
  
  console.log('[saveBrandSettings] ✅ User authenticated, ID:', user.id);

  // Process images before saving
  const processedLogo = await processImage(data.brandLogo, 'brand-logos');
  
  let processedBrandImages: any[] = [];
  if (data.brandImages && Array.isArray(data.brandImages)) {
    processedBrandImages = await Promise.all(
      data.brandImages.map(async (img: string | { url: string, metadata?: any }) => {
        const url = typeof img === 'string' ? img : img.url;
        const processedUrl = await processImage(url, 'brand-assets');
        
        // Ensure we store as object with metadata structure
        if (typeof img === 'string') {
          return { 
            url: processedUrl, 
            metadata: { 
              source: 'scraped',
              analyzed: false,
              context: 'brand_asset'
            } 
          };
        }
        return { 
          ...img, 
          url: processedUrl 
        };
      })
    );
    // Filter out items where url is null (though processImage usually returns original url on failure)
    processedBrandImages = processedBrandImages.filter(img => img && img.url);
  }

  const existing = await db
    .select()
    .from(brandSettings)
    .where(eq(brandSettings.userId, user.id))
    .limit(1);
  
  console.log('[saveBrandSettings] Existing records found:', existing.length);

  const payload = {
    userId: user.id,
    brandName: data.brandName,
    brandUrl: data.brandUrl,
    brandLogo: processedLogo,
    brandColors: JSON.stringify(data.brandColors || []),
    brandVoice: data.brandVoice,
    brandAudience: data.brandAudience,
    brandIndustry: data.brandIndustry,
    brandValues: data.brandValues,
    brandStory: data.brandStory,
    brandImages: JSON.stringify(processedBrandImages),
    
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
    console.log('[saveBrandSettings] Updating existing brand settings, ID:', brandId);
    const updateResult = await db
      .update(brandSettings)
      .set(payload)
      .where(eq(brandSettings.id, brandId))
      .returning({ id: brandSettings.id });
    console.log('[saveBrandSettings] Update completed:', updateResult);
  } else {
    console.log('[saveBrandSettings] Creating new brand settings');
    const res = await db.insert(brandSettings).values(payload).returning({ id: brandSettings.id });
    brandId = res[0].id;
    console.log('[saveBrandSettings] Insert completed, new ID:', brandId);
  }

  // Save products if provided
  if (data.products && Array.isArray(data.products)) {
    console.log('[saveBrandSettings] Saving products, count:', data.products.length);
    // First delete existing products for this brand (simple sync strategy)
    await db.delete(brandProducts).where(eq(brandProducts.brandId, brandId));
    
    if (data.products.length > 0) {
      // Process product images in parallel
      const processedProducts = await Promise.all(
        data.products.map(async (p: any) => {
          const processedImageUrl = await processImage(p.imageUrl, 'brand-products');
          return {
            brandId,
            name: p.name,
            description: p.description,
            price: p.price,
            imageUrl: processedImageUrl,
            productUrl: p.productUrl,
            metadata: JSON.stringify(p.metadata || {}),
          };
        })
      );

      await db.insert(brandProducts).values(processedProducts);
      console.log('[saveBrandSettings] Products saved successfully');
    }
  }
  
  // Revalidate the settings page to clear Next.js cache
  revalidatePath('/settings');
  revalidatePath('/(dashboard)/settings');
  revalidatePath('/brand');
  revalidatePath('/(dashboard)/brand');
  
  console.log('[saveBrandSettings] ✅ Save operation completed successfully');
  return { success: true };
}

export async function deleteBrandSettings() {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');

  const settings = await db
    .select()
    .from(brandSettings)
    .where(eq(brandSettings.userId, user.id))
    .limit(1);

  if (settings.length > 0) {
    const brandId = settings[0].id;
    // Delete products first
    await db.delete(brandProducts).where(eq(brandProducts.brandId, brandId));
    // Delete settings
    await db.delete(brandSettings).where(eq(brandSettings.id, brandId));
  }

  revalidatePath('/settings');
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
