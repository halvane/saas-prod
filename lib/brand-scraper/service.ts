import 'server-only';
import * as cheerio from 'cheerio';

interface BrandData {
  name?: string;
  colors: string[];
  logo?: string;
  images?: string[];
  story?: string;
  textContent?: string;
  industry?: string;
  tone?: string;
  audience?: string;
  values?: string;
  products?: ProductData[];
  socialLinks?: Record<string, string>;
}

interface ProductData {
  name: string;
  description?: string;
  price?: string;
  currency?: string;
  url?: string;
  image?: string;
  metadata?: Record<string, any>;
}

export async function scrapeBrandFromUrl(url: string): Promise<BrandData> {
  try {
    const fetchWithFallback = async (targetUrl: string, retries = 1): Promise<Response> => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        
        const res = await fetch(targetUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0',
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        return res;
      } catch (err: any) {
        if (retries > 0) {
          // If DNS error and no www, try adding www
          if ((err.cause?.code === 'ENOTFOUND' || err.cause?.code === 'EAI_AGAIN') && !targetUrl.includes('://www.')) {
            const newUrl = targetUrl.replace('://', '://www.');
            console.log(`[Scraper] DNS failed for ${targetUrl}, retrying with ${newUrl}`);
            return fetchWithFallback(newUrl, retries - 1);
          }
          // General retry
          await new Promise(r => setTimeout(r, 1000));
          return fetchWithFallback(targetUrl, retries - 1);
        }
        throw err;
      }
    };

    const response = await fetchWithFallback(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Extract brand data using Cheerio
    const colors = extractColors(html, $);
    const logo = extractLogo($, url);
    const name = extractBrandName($, html);
    const images = extractImages($, url);
    const textContent = extractTextContent($);
    const products = extractProducts($, url);
    const socialLinks = extractSocialLinks($);

    return {
      name,
      colors,
      logo,
      images: images.slice(0, 15),
      textContent,
      products,
      socialLinks,
    };
  } catch (error: any) {
    console.error('Brand scraping error:', error);
    // Return a more specific error message
    if (error.cause?.code === 'ENOTFOUND') {
      throw new Error(`Could not find website "${url}". Please check the URL and try again.`);
    }
    throw new Error(error.message || 'Failed to scrape brand data from URL');
  }
}

function extractColors(html: string, $: cheerio.CheerioAPI): string[] {
  const colors = new Set<string>();
  
  // Extract from inline styles
  const styleMatches = html.matchAll(/(?:background-color|color|border-color|fill):\s*([#rgb][^;}"']+)/gi);
  for (const match of styleMatches) {
    const color = normalizeColor(match[1].trim());
    if (color) colors.add(color);
  }
  
  // Extract from style tags
  $('style').each((_, el) => {
    const content = $(el).html() || '';
    const colorMatches = content.matchAll(/(?:background-color|color|border-color|fill):\s*([#rgb][^;}"']+)/gi);
    for (const match of colorMatches) {
      const color = normalizeColor(match[1].trim());
      if (color) colors.add(color);
    }
  });

  // Filter out white, black, and grays
  const filteredColors = Array.from(colors).filter(color => {
    if (!color.startsWith('#')) return false;
    const hex = color.substring(1);
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Skip if too close to white or black
    if ((r > 240 && g > 240 && b > 240) || (r < 15 && g < 15 && b < 15)) {
      return false;
    }
    
    // Skip grays
    if (Math.abs(r - g) < 10 && Math.abs(g - b) < 10 && Math.abs(r - b) < 10) {
      return false;
    }
    
    return true;
  });

  return filteredColors.slice(0, 5);
}

function normalizeColor(color: string): string | null {
  const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]).toString(16).padStart(2, '0');
    const g = parseInt(rgbMatch[2]).toString(16).padStart(2, '0');
    const b = parseInt(rgbMatch[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }
  
  if (color.startsWith('#') && (color.length === 7 || color.length === 4)) {
    return color.length === 4 
      ? `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
      : color;
  }
  
  return null;
}

function extractLogo($: cheerio.CheerioAPI, baseUrl: string): string | undefined {
  // 1. Check Schema.org Organization logo
  const schemaScripts = $('script[type="application/ld+json"]');
  for (const script of schemaScripts) {
    try {
      const json = JSON.parse($(script).html() || '{}');
      const data = Array.isArray(json) ? json : [json];
      for (const item of data) {
        if (item['@type'] === 'Organization' && item.logo) {
          return resolveUrl(typeof item.logo === 'string' ? item.logo : item.logo.url, baseUrl);
        }
      }
    } catch {}
  }

  // 2. Check common logo selectors
  const selectors = [
    'img[class*="logo"]',
    'img[id*="logo"]',
    'img[alt*="logo" i]',
    '.logo img',
    'header img',
    'link[rel="icon"]',
    'link[rel="apple-touch-icon"]'
  ];

  for (const selector of selectors) {
    const el = $(selector).first();
    const src = el.attr('src') || el.attr('href');
    if (src) return resolveUrl(src, baseUrl);
  }

  return undefined;
}

function extractBrandName($: cheerio.CheerioAPI, html: string): string | undefined {
  // 1. Check Schema.org
  const schemaScripts = $('script[type="application/ld+json"]');
  for (const script of schemaScripts) {
    try {
      const json = JSON.parse($(script).html() || '{}');
      const data = Array.isArray(json) ? json : [json];
      for (const item of data) {
        if (item['@type'] === 'Organization' && item.name) {
          return item.name;
        }
      }
    } catch {}
  }

  // 2. Meta tags
  const ogSiteName = $('meta[property="og:site_name"]').attr('content');
  if (ogSiteName) return ogSiteName;

  // 3. Title tag
  const title = $('title').text();
  if (title) {
    return title.split('|')[0].split('-')[0].trim();
  }

  return undefined;
}

function extractImages($: cheerio.CheerioAPI, baseUrl: string): string[] {
  const images = new Set<string>();
  
  $('img').each((_, el) => {
    const $el = $(el);
    let src = $el.attr('src');
    const dataSrc = $el.attr('data-src') || $el.attr('data-lazy-src') || $el.attr('data-original');
    const srcset = $el.attr('srcset') || $el.attr('data-srcset');
    
    // Prefer data-src if available (lazy loading)
    if (dataSrc) {
      src = dataSrc;
    } 
    // Parse srcset if no src or data-src
    else if (srcset) {
      // srcset format: "url1 1x, url2 2x" or "url1 300w, url2 600w"
      const srcCandidates = srcset.split(',').map(s => s.trim().split(/\s+/)[0]);
      if (srcCandidates.length > 0) {
        // Take the last one (usually largest/highest quality)
        src = srcCandidates[srcCandidates.length - 1];
      }
    }

    if (src && !src.startsWith('data:')) {
      // Filter out icons, logos, and common placeholders
      const lowerSrc = src.toLowerCase();
      if (lowerSrc.includes('icon') || 
          lowerSrc.includes('logo') || 
          lowerSrc.includes('placeholder') || 
          lowerSrc.includes('spacer') || 
          lowerSrc.includes('blank') ||
          lowerSrc.includes('pixel') ||
          lowerSrc.includes('transparent') ||
          lowerSrc.includes('button') ||
          lowerSrc.includes('arrow') ||
          lowerSrc.includes('nav') ||
          lowerSrc.includes('menu')) {
        return;
      }

      // Filter out small images (likely icons/spacers)
      const width = $el.attr('width');
      const height = $el.attr('height');
      
      if ((width && parseInt(width) < 100) || (height && parseInt(height) < 100)) return;
      
      // Filter out images that are likely hidden
      if ($el.css('display') === 'none' || $el.css('visibility') === 'hidden') return;

      const resolved = resolveUrl(src, baseUrl);
      if (resolved && resolved.startsWith('http')) {
        images.add(resolved);
      }
    }
  });

  return Array.from(images);
}

function extractTextContent($: cheerio.CheerioAPI): string {
  // Remove non-content elements
  $('script, style, noscript, iframe').remove();
  
  // Get text from main content areas first
  const mainText = $('main, article, #content, .content').text();
  if (mainText.length > 500) {
    return cleanText(mainText).substring(0, 15000);
  }
  
  return cleanText($('body').text()).substring(0, 15000);
}

function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function extractProducts($: cheerio.CheerioAPI, baseUrl: string): ProductData[] {
  const products: ProductData[] = [];
  const seenUrls = new Set<string>();
  
  // Helper to add unique products
  const addProduct = (p: ProductData) => {
    if (p.name && !seenUrls.has(p.url || p.name)) {
      products.push(p);
      if (p.url) seenUrls.add(p.url);
      else seenUrls.add(p.name);
    }
  };

  // 1. Extract from Schema.org Product
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const json = JSON.parse($(el).html() || '{}');
      const data = Array.isArray(json) ? json : [json];
      
      for (const item of data) {
        if (item['@type'] === 'Product') {
          addProduct({
            name: item.name,
            description: item.description,
            image: item.image ? (Array.isArray(item.image) ? item.image[0] : item.image) : undefined,
            price: item.offers?.price,
            currency: item.offers?.priceCurrency,
            url: item.url ? resolveUrl(item.url, baseUrl) : undefined
          });
        }
      }
    } catch {}
  });

  // 2. If no schema products, try common e-commerce selectors
  if (products.length === 0) {
    const productSelectors = [
      '.product-card', '.product-item', '.grid-view-item',
      '[class*="product-card"]', '[class*="product-item"]',
      '.shop-item', '.collection-item',
      'article[class*="product"]',
      '.woocommerce-LoopProduct-link'
    ];

    $(productSelectors.join(', ')).each((_, el) => {
      const name = $(el).find('h3, h2, h4, .product-title, .title, .name, .woocommerce-loop-product__title').first().text().trim();
      const price = $(el).find('.price, .money, .amount, .current-price').first().text().trim();
      
      // Enhanced image extraction
      let image = $(el).find('img').attr('src') || 
                  $(el).find('img').attr('data-src') || 
                  $(el).find('source').attr('srcset')?.split(',')[0]?.split(' ')[0] ||
                  $(el).find('img').attr('srcset')?.split(',')[0]?.split(' ')[0];
      
      // Extract alt text for visual context
      const altText = $(el).find('img').attr('alt') || '';

      // Try background image if no img tag
      if (!image) {
        const bgImage = $(el).find('[style*="background-image"]').css('background-image');
        if (bgImage) {
          image = bgImage.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
        }
      }

      // Try finding image in previous sibling (common in list layouts)
      if (!image) {
        const prevImg = $(el).prev().find('img').attr('src');
        if (prevImg) image = prevImg;
      }

      const link = $(el).find('a').attr('href') || ($(el).is('a') ? $(el).attr('href') : undefined);
      
      if (name) {
        addProduct({
          name,
          price,
          image: image ? resolveUrl(image, baseUrl) : undefined,
          url: link ? resolveUrl(link, baseUrl) : undefined,
          metadata: {
            visual_context: altText ? `Image shows: ${altText}` : 'Product image',
            source: 'scraped'
          }
        });
      }
    });
  }

  // 3. Fallback: Look for Pricing Cards (SaaS/Service products)
  if (products.length === 0) {
    const pricingSelectors = [
      '.pricing-card', '.pricing-table', '.plan-card',
      '[class*="pricing-card"]', '[class*="plan-card"]',
      '[class*="price-table"]'
    ];

    $(pricingSelectors.join(', ')).each((_, el) => {
      const name = $(el).find('h3, h2, h4, .plan-name, .title').first().text().trim();
      const price = $(el).find('.price, .amount, .plan-price').first().text().trim();
      const description = $(el).find('.description, .features, ul').first().text().trim().substring(0, 200);
      const link = $(el).find('a[href*="checkout"], a[href*="buy"], a[class*="button"]').attr('href');

      if (name && price) {
        addProduct({
          name: `${name} Plan`,
          description,
          price,
          url: link ? resolveUrl(link, baseUrl) : undefined
        });
      }
    });
  }

  return products.slice(0, 10); // Limit to 10 products
}

function extractSocialLinks($: cheerio.CheerioAPI): Record<string, string> {
  const links: Record<string, string> = {};
  const platforms = ['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok', 'pinterest'];
  
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    for (const platform of platforms) {
      if (href.includes(platform + '.com')) {
        links[platform] = href;
      }
    }
  });
  
  return links;
}

function resolveUrl(url: string, baseUrl: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('//')) return `https:${url}`;
  
  try {
    // Use the full baseUrl to correctly resolve relative paths
    // e.g. new URL('image.jpg', 'https://site.com/shop/') -> 'https://site.com/shop/image.jpg'
    return new URL(url, baseUrl).href;
  } catch {
    return url;
  }
}

export function matchImagesToProducts(products: ProductData[], images: string[]): ProductData[] {
  const usedImages = new Set<string>();
  
  // First pass: Try to match by product name in image URL
  let matchedProducts = products.map(product => {
    if (product.image) {
      usedImages.add(product.image);
      return product;
    }

    const slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    // Try to find an image that contains the product name
    const match = images.find(img => {
      if (usedImages.has(img)) return false;
      const imgName = img.split('/').pop()?.toLowerCase() || '';
      return imgName.includes(slug) || slug.includes(imgName.split('.')[0]);
    });

    if (match) {
      usedImages.add(match);
      return { ...product, image: match };
    }

    return product;
  });

  // Second pass: Assign remaining high-quality images to products that still lack images
  // But only if we have enough images and they look like product images (not logos/icons)
  matchedProducts = matchedProducts.map(product => {
    if (product.image) return product;

    const nextImage = images.find(img => !usedImages.has(img));
    if (nextImage) {
      usedImages.add(nextImage);
      return { ...product, image: nextImage };
    }

    return product;
  });

  return matchedProducts;
}
