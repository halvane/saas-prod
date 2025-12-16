import { NextResponse } from 'next/server';

const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY || "52729879-0472c956f4800651705449fb5";
const PEXELS_API_KEY = process.env.PEXELS_API_KEY || "Bu7AFiicKVoy77b6e47eI0kMlpapPqvMYDKyzJ89WaHusaNYyV2xGG6K";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || 'nature';
  const type = searchParams.get('type') || 'photo'; // photo, illustration, vector
  const provider = searchParams.get('provider') || 'all'; // pixabay, pexels, all
  const page = searchParams.get('page') || '1';
  const per_page = '20';

  let results: any[] = [];

  try {
    const promises = [];

    // Pixabay Search
    if (provider === 'all' || provider === 'pixabay') {
      const pixabayType = type === 'photo' ? 'photo' : type; // illustration, vector
      const pixabayUrl = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=${pixabayType}&per_page=${per_page}&page=${page}&safesearch=true`;
      
      promises.push(
        fetch(pixabayUrl)
          .then(res => res.json())
          .then(data => {
            if (data.hits) {
              return data.hits.map((img: any) => ({
                id: `pixabay-${img.id}`,
                src: {
                  small: img.previewURL,
                  medium: img.webformatURL,
                  large: img.largeImageURL,
                  original: img.imageURL
                },
                width: img.imageWidth,
                height: img.imageHeight,
                alt: img.tags,
                provider: 'pixabay',
                type: img.type
              }));
            }
            return [];
          })
          .catch(err => {
            console.error('Pixabay API Error:', err);
            return [];
          })
      );
    }

    // Pexels Search (Only supports photos)
    if ((provider === 'all' || provider === 'pexels') && type === 'photo') {
      const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${per_page}&page=${page}`;
      
      promises.push(
        fetch(pexelsUrl, {
          headers: { Authorization: PEXELS_API_KEY }
        })
          .then(res => res.json())
          .then(data => {
            if (data.photos) {
              return data.photos.map((img: any) => ({
                id: `pexels-${img.id}`,
                src: {
                  small: img.src.tiny,
                  medium: img.src.medium,
                  large: img.src.large,
                  original: img.src.original
                },
                width: img.width,
                height: img.height,
                alt: img.alt,
                provider: 'pexels',
                type: 'photo'
              }));
            }
            return [];
          })
          .catch(err => {
            console.error('Pexels API Error:', err);
            return [];
          })
      );
    }

    const resultsArrays = await Promise.all(promises);
    results = resultsArrays.flat();

    // Shuffle results for better mix if 'all'
    if (provider === 'all') {
      results = results.sort(() => Math.random() - 0.5);
    }

    return NextResponse.json({ results });

  } catch (error) {
    console.error('Stock API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch stock images' }, { status: 500 });
  }
}
