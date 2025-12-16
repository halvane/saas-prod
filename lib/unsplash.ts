
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export async function searchUnsplashImages(query: string, count: number = 5): Promise<string[]> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('UNSPLASH_ACCESS_KEY is not set. Returning fallback images.');
    return getFallbackImages();
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
      return getFallbackImages();
    }

    const data = await response.json();
    return data.results.map((img: any) => img.urls.regular);
  } catch (error) {
    console.error('Error searching Unsplash:', error);
    return getFallbackImages();
  }
}

function getFallbackImages(): string[] {
  return [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', // Business/Tech
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80', // Meeting
    'https://images.unsplash.com/photo-1504384308090-c54be3855833?w=800&q=80', // Office
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', // Analytics
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80', // Team
  ];
}
