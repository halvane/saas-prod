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
}

export async function scrapeBrandFromUrl(url: string): Promise<BrandData> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PurlemaBrandScraper/2.0; +https://purlema.com)',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.statusText}`);
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
  } catch (error) {
    console.error('Brand scraping error:', error);
    throw new Error('Failed to scrape brand data from URL');
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
    const src = $(el).attr('src');
    if (src && !src.includes('icon') && !src.includes('logo') && !src.startsWith('data:')) {
      // Filter out small images (likely icons/spacers)
      const width = $(el).attr('width');
      const height = $(el).attr('height');
      if ((width && parseInt(width) < 100) || (height && parseInt(height) < 100)) return;
      
      images.add(resolveUrl(src, baseUrl));
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
  
  // 1. Extract from Schema.org Product
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const json = JSON.parse($(el).html() || '{}');
      const data = Array.isArray(json) ? json : [json];
      
      for (const item of data) {
        if (item['@type'] === 'Product') {
          products.push({
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
    $('.product-card, .product-item, .grid-view-item').each((_, el) => {
      const name = $(el).find('h3, .product-title, .title').text().trim();
      const price = $(el).find('.price, .money').text().trim();
      const image = $(el).find('img').attr('src');
      const link = $(el).find('a').attr('href');
      
      if (name) {
        products.push({
          name,
          price,
          image: image ? resolveUrl(image, baseUrl) : undefined,
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
    const base = new URL(baseUrl);
    return new URL(url, base.origin).href;
  } catch {
    return url;
  }
}
