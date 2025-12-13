'use server';

import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';
import { createUserProfile, generateJwt, getUserProfile } from '@/lib/upload-post/service';

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
