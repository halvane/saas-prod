/**
 * Centralized Template Variable System
 * 
 * This file defines ALL possible template variables in one place to:
 * - Reduce database storage (store keys instead of full schemas)
 * - Lower AI credit consumption (single shared schema)
 * - Improve maintainability (update variables in one place)
 * - Provide type safety (TypeScript interfaces)
 */

export type TemplateVariableType = 'text' | 'image' | 'color' | 'url' | 'date' | 'number';

export interface TemplateVariableDefinition {
  type: TemplateVariableType;
  label: string;
  description: string;
  category: 'text' | 'image' | 'metadata' | 'social_proof' | 'branding' | 'dates' | 'cta';
  default?: string | number;
  placeholder?: string;
  required?: boolean;
}

/**
 * Complete Variable Registry
 * 
 * All template variables are defined here with their metadata.
 * Templates reference these by key instead of storing the full definition.
 */
export const TEMPLATE_VARIABLES: Record<string, TemplateVariableDefinition> = {
  // ===== TEXT CONTENT VARIABLES =====
  headline: {
    type: 'text',
    label: 'Main Headline',
    description: 'Primary headline or title for the template',
    category: 'text',
    placeholder: 'Enter compelling headline...',
    required: true,
  },
  subheadline: {
    type: 'text',
    label: 'Subheadline',
    description: 'Secondary headline or subtitle',
    category: 'text',
    placeholder: 'Enter subtitle...',
  },
  title: {
    type: 'text',
    label: 'Title',
    description: 'Content title',
    category: 'text',
    placeholder: 'Enter title...',
  },
  body: {
    type: 'text',
    label: 'Body Text',
    description: 'Main body content or description',
    category: 'text',
    placeholder: 'Enter body text...',
  },
  description: {
    type: 'text',
    label: 'Description',
    description: 'Content description',
    category: 'text',
    placeholder: 'Enter description...',
  },
  tagline: {
    type: 'text',
    label: 'Tagline',
    description: 'Short memorable phrase',
    category: 'text',
    placeholder: 'Enter tagline...',
  },
  
  // ===== CALL TO ACTION (CTA) =====
  cta: {
    type: 'text',
    label: 'Call to Action',
    description: 'Call to action button text',
    category: 'cta',
    default: 'Learn More',
    placeholder: 'Enter CTA text...',
  },
  cta_text: {
    type: 'text',
    label: 'CTA Text',
    description: 'Call to action text',
    category: 'cta',
    default: 'Get Started',
  },
  cta_url: {
    type: 'url',
    label: 'CTA URL',
    description: 'Call to action link URL',
    category: 'cta',
    placeholder: 'https://...',
  },
  button_text: {
    type: 'text',
    label: 'Button Text',
    description: 'Button label text',
    category: 'cta',
    default: 'Click Here',
  },
  
  // ===== IMAGE VARIABLES =====
  hero_image: {
    type: 'image',
    label: 'Hero Image',
    description: 'Main hero or background image',
    category: 'image',
    default: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200',
  },
  product_image: {
    type: 'image',
    label: 'Product Image',
    description: 'Product or item image',
    category: 'image',
    default: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
  },
  background_image: {
    type: 'image',
    label: 'Background Image',
    description: 'Background image',
    category: 'image',
  },
  logo: {
    type: 'image',
    label: 'Logo',
    description: 'Brand logo image',
    category: 'branding',
    default: 'https://via.placeholder.com/150?text=Logo',
  },
  photo: {
    type: 'image',
    label: 'Photo',
    description: 'Generic photo',
    category: 'image',
  },
  image: {
    type: 'image',
    label: 'Image',
    description: 'Generic image',
    category: 'image',
  },
  
  // ===== SOCIAL PROOF / TESTIMONIALS =====
  review_text: {
    type: 'text',
    label: 'Review Text',
    description: 'Customer review or testimonial text',
    category: 'social_proof',
    placeholder: 'Enter review...',
  },
  reviewer_name: {
    type: 'text',
    label: 'Reviewer Name',
    description: 'Name of person giving review',
    category: 'social_proof',
    placeholder: 'Enter name...',
  },
  reviewer_role: {
    type: 'text',
    label: 'Reviewer Role',
    description: 'Job title or role of reviewer',
    category: 'social_proof',
    placeholder: 'Enter role...',
  },
  reviewer_image: {
    type: 'image',
    label: 'Reviewer Photo',
    description: 'Photo of reviewer',
    category: 'social_proof',
    default: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  },
  testimonial: {
    type: 'text',
    label: 'Testimonial',
    description: 'Customer testimonial',
    category: 'social_proof',
  },
  
  // ===== PODCAST / VIDEO SPECIFIC =====
  host_name: {
    type: 'text',
    label: 'Host Name',
    description: 'Name of podcast/video host',
    category: 'metadata',
    placeholder: 'Enter host name...',
  },
  host_image: {
    type: 'image',
    label: 'Host Photo',
    description: 'Photo of host',
    category: 'image',
    default: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600',
  },
  guest_name: {
    type: 'text',
    label: 'Guest Name',
    description: 'Name of guest',
    category: 'metadata',
    placeholder: 'Enter guest name...',
  },
  guest_image: {
    type: 'image',
    label: 'Guest Photo',
    description: 'Photo of guest',
    category: 'image',
    default: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600',
  },
  episode_number: {
    type: 'text',
    label: 'Episode Number',
    description: 'Episode or video number',
    category: 'metadata',
    placeholder: 'Episode #...',
  },
  
  // ===== DATES & TIMES =====
  date: {
    type: 'date',
    label: 'Date',
    description: 'Event or publication date',
    category: 'dates',
  },
  date_time: {
    type: 'text',
    label: 'Date & Time',
    description: 'Combined date and time',
    category: 'dates',
    placeholder: 'Enter date/time...',
  },
  publish_date: {
    type: 'date',
    label: 'Publish Date',
    description: 'Publication date',
    category: 'dates',
  },
  event_date: {
    type: 'date',
    label: 'Event Date',
    description: 'Date of event',
    category: 'dates',
  },
  
  // ===== METADATA =====
  author: {
    type: 'text',
    label: 'Author',
    description: 'Author name',
    category: 'metadata',
    placeholder: 'Enter author name...',
  },
  author_image: {
    type: 'image',
    label: 'Author Photo',
    description: 'Photo of author',
    category: 'metadata',
    default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
  },
  category: {
    type: 'text',
    label: 'Category',
    description: 'Content category or tag',
    category: 'metadata',
  },
  badge: {
    type: 'text',
    label: 'Badge',
    description: 'Badge or label text',
    category: 'metadata',
  },
  label: {
    type: 'text',
    label: 'Label',
    description: 'Label text',
    category: 'metadata',
  },
  
  // ===== BRANDING =====
  brand_name: {
    type: 'text',
    label: 'Brand Name',
    description: 'Brand or company name',
    category: 'branding',
    placeholder: 'Enter brand name...',
  },
  brand_tagline: {
    type: 'text',
    label: 'Brand Tagline',
    description: 'Brand tagline or slogan',
    category: 'branding',
  },
  
  // ===== PRICING / PRODUCT =====
  price: {
    type: 'text',
    label: 'Price',
    description: 'Product price',
    category: 'metadata',
    placeholder: '$0.00',
  },
  old_price: {
    type: 'text',
    label: 'Original Price',
    description: 'Original price (for discounts)',
    category: 'metadata',
  },
  discount: {
    type: 'text',
    label: 'Discount',
    description: 'Discount percentage or amount',
    category: 'metadata',
  },
  
  // ===== STATISTICS / NUMBERS =====
  stat_1: {
    type: 'text',
    label: 'Statistic 1',
    description: 'First statistic value',
    category: 'metadata',
  },
  stat_2: {
    type: 'text',
    label: 'Statistic 2',
    description: 'Second statistic value',
    category: 'metadata',
  },
  stat_3: {
    type: 'text',
    label: 'Statistic 3',
    description: 'Third statistic value',
    category: 'metadata',
  },
};

/**
 * Helper function to get variable definition by key
 */
export function getVariableDefinition(key: string): TemplateVariableDefinition | undefined {
  return TEMPLATE_VARIABLES[key];
}

/**
 * Helper function to get all variables for a specific category
 */
export function getVariablesByCategory(category: TemplateVariableDefinition['category']) {
  return Object.entries(TEMPLATE_VARIABLES)
    .filter(([_, def]) => def.category === category)
    .reduce((acc, [key, def]) => ({ ...acc, [key]: def }), {});
}

/**
 * Helper function to get variable defaults for a list of keys
 */
export function getVariableDefaults(keys: string[]): Record<string, any> {
  const defaults: Record<string, any> = {};
  
  for (const key of keys) {
    const definition = TEMPLATE_VARIABLES[key];
    if (definition?.default !== undefined) {
      defaults[key] = definition.default;
    }
  }
  
  return defaults;
}

/**
 * Generate a minified LLM schema from variable keys
 * This is used for AI generation to minimize token usage
 */
export function generateLlmSchemaFromKeys(keys: string[]): Record<string, any> {
  const schema: Record<string, any> = {};
  
  for (const key of keys) {
    const definition = TEMPLATE_VARIABLES[key];
    if (definition) {
      schema[key] = {
        type: definition.type === 'image' ? 'url' : 'string',
        description: definition.description,
        ...(definition.default && { default: definition.default }),
      };
    }
  }
  
  return schema;
}

/**
 * Validate that all variable keys exist in registry
 */
export function validateVariableKeys(keys: string[]): { valid: boolean; missing: string[] } {
  const missing = keys.filter(key => !TEMPLATE_VARIABLES[key]);
  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * TypeScript type for variable values
 */
export type TemplateVariableValues = Partial<Record<keyof typeof TEMPLATE_VARIABLES, string | number>>;
