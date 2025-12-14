import { put } from '@vercel/blob';

/**
 * Uploads a file or data to Vercel Blob Storage.
 * 
 * @param filename - The name of the file (e.g., 'logo.png')
 * @param body - The file content (File, Blob, string, or Buffer)
 * @param folder - Optional folder path (default: 'uploads')
 * @returns The public URL of the uploaded file
 */
export async function uploadAsset(
  filename: string,
  body: string | File | Blob | Buffer,
  folder: string = 'uploads'
): Promise<string> {
  // Ensure clean path construction
  const path = folder ? `${folder}/${filename}` : filename;
  
  const { url } = await put(path, body, { 
    access: 'public',
    // Add any default token config here if needed, 
    // but usually it picks up BLOB_READ_WRITE_TOKEN from env
  });

  return url;
}
