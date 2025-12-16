import { ContentMatrix } from '@/lib/ai/content-matrix';

export interface BrandImages {
  logo?: string;
  general: string[];
  products: string[];
}

/**
 * Maps a template's LLM schema to values from the Content Matrix.
 * This avoids per-template AI calls by intelligently matching variable names.
 */
export function fillTemplateFromMatrix(
  templateSchema: Record<string, any>, 
  matrix: ContentMatrix,
  images: BrandImages
): Record<string, any> {
  // Safety check: ensure schema exists
  if (!templateSchema || typeof templateSchema !== 'object') {
    console.warn('[fillTemplateFromMatrix] Invalid schema, returning empty object');
    return {};
  }
  
  // console.log('[fillTemplateFromMatrix] START mapping');
  const result: Record<string, any> = {};
  
  // Helper to pick random item from array with safety check
  const pick = (arr: string[] | undefined, fallback?: string) => {
    if (!arr || arr.length === 0) return fallback || "Content Placeholder";
    return arr[Math.floor(Math.random() * arr.length)];
  };

  for (const [key, schema] of Object.entries(templateSchema)) {
    const lowerKey = key.toLowerCase();
    const description = (schema.description || '').toLowerCase();
    const type = (schema.type || '').toLowerCase();
    
    // console.log(`[fillTemplateFromMatrix] Processing key: ${key}, Type: ${type}`);

    // 0. Images (Priority Check)
    // Check explicit type first, then fallback to key name heuristics
    if (type === 'image' || type === 'img' || type === 'url' && (lowerKey.includes('image') || lowerKey.includes('photo') || lowerKey.includes('bg') || lowerKey.includes('logo'))) {
        // Logo
        if (lowerKey.includes('logo')) {
            result[key] = images.logo || 'https://via.placeholder.com/150?text=Logo';
            continue;
        }
        
        // Product Image
        if (lowerKey.includes('product') || lowerKey.includes('item') || lowerKey.includes('book') || lowerKey.includes('cover')) {
             // Try products first, then general
             const pool = images.products.length > 0 ? images.products : images.general;
             result[key] = pick(pool, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80');
             continue;
        }

        // General / Background Image
        const pool = images.general.length > 0 ? images.general : images.products;
        result[key] = pick(pool, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80');
        continue;
    }

    // Fallback for images if type is missing but key is strong indicator
    if (!type && (
      lowerKey.includes('image') || lowerKey.includes('photo') || lowerKey.includes('bg') || lowerKey.includes('background') || 
      lowerKey.includes('icon') || lowerKey.includes('avatar') || lowerKey.includes('picture') ||
      lowerKey.includes('img') || lowerKey.includes('thumbnail') || lowerKey.includes('cover') || lowerKey.includes('screenshot')
    )) {
         // Exclude "logoText" or similar text fields
         if (lowerKey.includes('text') || lowerKey.includes('label') || lowerKey.includes('title')) {
             // It's likely text, skip to text handlers
         } else {
             // Treat as image
             if (lowerKey.includes('logo')) {
                result[key] = images.logo || 'https://via.placeholder.com/150?text=Logo';
                continue;
             }
             
             const pool = images.general.length > 0 ? images.general : images.products;
             result[key] = pick(pool, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80');
             continue;
         }
    }

    // Colors (Fix for CSS breaking)
    if (lowerKey.includes('color')) {
        if (lowerKey.includes('primary')) result[key] = 'var(--brand-primary)';
        else if (lowerKey.includes('secondary')) result[key] = 'var(--brand-secondary)';
        else if (lowerKey.includes('accent')) result[key] = 'var(--brand-accent)';
        else result[key] = '#000000';
        continue;
    }

    // Category / Tag (Fix for long text)
    if (lowerKey.includes('category') || lowerKey.includes('badge') || lowerKey.includes('label')) {
        result[key] = "New Arrival"; 
        continue;
    }

    // 1. Headlines / Titles
    if (
      lowerKey.includes('headline') || lowerKey.includes('title') || lowerKey.includes('heading') || lowerKey.includes('h1') || 
      lowerKey.includes('hook') || lowerKey.includes('header') || lowerKey.includes('masthead') || lowerKey.includes('topic') || lowerKey.includes('subject')
    ) {
      result[key] = pick(matrix.headlines);
      continue;
    }

    // 2. Subtitles / Captions
    if (
      lowerKey.includes('sub') || lowerKey.includes('caption') || lowerKey.includes('tagline') || lowerKey.includes('intro') || 
      lowerKey.includes('desc') || lowerKey.includes('summary') || lowerKey.includes('bio') || lowerKey.includes('overview')
    ) {
      result[key] = pick(matrix.subheadlines);
      continue;
    }

    // 3. CTAs / Buttons
    if (
      lowerKey.includes('cta') || lowerKey.includes('button') || lowerKey.includes('action') || lowerKey.includes('join') || 
      lowerKey.includes('rsvp') || lowerKey.includes('invite') || lowerKey.includes('click')
    ) {
      result[key] = pick(matrix.ctas);
      continue;
    }

    // 4. Quotes / Testimonials
    if (
      lowerKey.includes('quote') || lowerKey.includes('testimonial') || lowerKey.includes('review') || lowerKey.includes('speech') || 
      lowerKey.includes('message') || lowerKey.includes('comment') || lowerKey.includes('author') || lowerKey.includes('customer')
    ) {
      result[key] = pick(matrix.quotes);
      continue;
    }

    // 5. Features / Benefits / Points
    if (
      lowerKey.includes('feature') || lowerKey.includes('benefit') || lowerKey.includes('point') || lowerKey.includes('highlight') || 
      lowerKey.includes('check') || lowerKey.includes('item') || lowerKey.includes('ingredient') || lowerKey.includes('tip')
    ) {
      result[key] = pick(matrix.features.concat(matrix.benefits));
      continue;
    }

    // 6. Statistics / Numbers
    if (
      lowerKey.includes('stat') || lowerKey.includes('number') || lowerKey.includes('value') || lowerKey.includes('count') || 
      lowerKey.includes('rating') || lowerKey.includes('score') || lowerKey.includes('percent') || lowerKey.includes('amount') ||
      lowerKey.includes('stars')
    ) {
      result[key] = pick(matrix.statistics || ['99%', '10k+', '5 Stars', '#1']);
      continue;
    }

    // 7. Dates / Times
    if (
      lowerKey.includes('date') || lowerKey.includes('time') || lowerKey.includes('schedule') || lowerKey.includes('deadline') || 
      lowerKey.includes('launch') || lowerKey.includes('duration') || lowerKey.includes('period') || lowerKey.includes('hour') || 
      lowerKey.includes('minute') || lowerKey.includes('day') || lowerKey.includes('week') || lowerKey.includes('month')
    ) {
      result[key] = pick(matrix.dates || ['Today', 'Tomorrow', 'Limited Time', 'Coming Soon']);
      continue;
    }

    // 8. Prices / Costs
    if (
      lowerKey.includes('price') || lowerKey.includes('cost') || lowerKey.includes('fee') || lowerKey.includes('discount') || 
      lowerKey.includes('sale') || lowerKey.includes('offer')
    ) {
      result[key] = pick(matrix.prices || ['$49', 'Free', '50% OFF', 'Best Value']);
      continue;
    }

    // 9. Contact Info / Locations
    if (
      lowerKey.includes('email') || lowerKey.includes('phone') || lowerKey.includes('website') || lowerKey.includes('address') || 
      lowerKey.includes('location') || lowerKey.includes('handle') || lowerKey.includes('username') || lowerKey.includes('contact') ||
      lowerKey.includes('site') || lowerKey.includes('link')
    ) {
      result[key] = pick(matrix.contact_info || ['www.brand.com', '@brand', 'Link in Bio', 'Contact Us']);
      continue;
    }

    // 10. Steps / Process
    if (lowerKey.includes('step') || lowerKey.includes('phase') || lowerKey.includes('module')) {
      result[key] = pick(matrix.steps || ['Step 1', 'Start Here', 'Easy Process']);
      continue;
    }

    // 11. Questions
    if (lowerKey.includes('question') || lowerKey.includes('ask') || lowerKey.includes('query')) {
      result[key] = pick(matrix.questions || ['Ready?', 'Why wait?', 'Did you know?']);
      continue;
    }

    // 12. Hashtags
    if (lowerKey.includes('hash') || lowerKey.includes('tag')) {
      result[key] = matrix.hashtags.slice(0, 3).join(' '); // Return a few hashtags
      continue;
    }

    // 13. Names / Titles (Brand, Product, etc.)
    if (lowerKey.includes('name') && !lowerKey.includes('username')) {
      if (lowerKey.includes('brand')) {
        result[key] = 'Your Brand';
      } else if (lowerKey.includes('product')) {
        result[key] = 'Premium Product';
      } else {
        result[key] = pick(matrix.headlines) || 'Title';
      }
      continue;
    }

    // 14. Body Text / Description (Default fallback for text)
    if (
      lowerKey.includes('body') || lowerKey.includes('text') || lowerKey.includes('content') || lowerKey.includes('paragraph') || 
      lowerKey.includes('note') || lowerKey.includes('info')
    ) {
      result[key] = pick(matrix.body_text);
      continue;
    }

    // 15. FINAL FALLBACK: Use schema default or generic content
    // This ensures ALL keys are preserved in the result
    if (schema.default !== undefined && schema.default !== null) {
      // Use the default value from the template definition
      result[key] = schema.default;
    } else if (schema.type === 'string' || typeof schema === 'string') {
      // Generic text content as last resort
      result[key] = pick(matrix.features) || "Content";
    } else {
      // Unknown type - keep the key with placeholder
      result[key] = `{{${key}}}`;
    }
  }

  return result;
}
