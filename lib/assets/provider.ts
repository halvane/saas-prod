import { Asset, AssetType } from '@/lib/builder/types';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY; // Needs to be added to .env

export class AssetProvider {
  
  static async search(query: string, type: AssetType = 'photo', count: number = 10): Promise<Asset[]> {
    const assets: Asset[] = [];

    // 1. Search Brand Assets (Mocked for now - should query DB)
    // const brandAssets = await getBrandAssets(query);
    // assets.push(...brandAssets);

    // 2. Search External Providers
    if (type === 'photo') {
      const unsplashImages = await this.searchUnsplash(query, count);
      assets.push(...unsplashImages);
    } else if (type === 'vector' || type === 'illustration') {
      const pixabayVectors = await this.searchPixabay(query, type, count);
      assets.push(...pixabayVectors);
    }

    return assets;
  }

  private static async searchUnsplash(query: string, count: number): Promise<Asset[]> {
    if (!UNSPLASH_ACCESS_KEY) {
      console.warn('UNSPLASH_ACCESS_KEY is not set. Returning fallback images.');
      return this.getFallbackImages().map(url => ({
        id: `fallback-${Math.random()}`,
        url,
        type: 'photo',
        source: 'unsplash',
        alt: 'Fallback Image'
      }));
    }

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      if (!response.ok) {
        console.error('Unsplash API error:', response.statusText);
        return [];
      }

      const data = await response.json();
      return data.results.map((img: any) => ({
        id: img.id,
        url: img.urls.regular,
        type: 'photo',
        source: 'unsplash',
        alt: img.alt_description || 'Unsplash Image',
        metadata: {
          width: img.width,
          height: img.height,
          author: img.user.name
        }
      }));
    } catch (error) {
      console.error('Error searching Unsplash:', error);
      return [];
    }
  }

  private static async searchPixabay(query: string, type: 'vector' | 'illustration', count: number): Promise<Asset[]> {
    if (!PIXABAY_API_KEY) {
      console.warn('PIXABAY_API_KEY is not set.');
      return [];
    }

    try {
      const imageType = type === 'vector' ? 'vector' : 'illustration';
      const response = await fetch(
        `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=${imageType}&per_page=${count}`
      );

      if (!response.ok) {
        console.error('Pixabay API error:', response.statusText);
        return [];
      }

      const data = await response.json();
      return data.hits.map((img: any) => ({
        id: String(img.id),
        url: img.largeImageURL, // Or webformatURL for smaller
        type: type,
        source: 'pixabay',
        alt: img.tags,
        metadata: {
          width: img.imageWidth,
          height: img.imageHeight,
          author: img.user
        }
      }));
    } catch (error) {
      console.error('Error searching Pixabay:', error);
      return [];
    }
  }

  private static getFallbackImages(): string[] {
    return [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', // Business/Tech
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80', // Meeting
      'https://images.unsplash.com/photo-1504384308090-c54be3855833?w=800&q=80', // Office
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', // Analytics
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80', // Team
    ];
  }
}
