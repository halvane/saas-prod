export type SectionCategory = 'header' | 'hero' | 'product' | 'footer' | 'overlay' | 'text' | 'badge';

export type Mood = 
  | 'energetic' 
  | 'trustworthy' 
  | 'luxury' 
  | 'playful' 
  | 'minimalist' 
  | 'urgent' 
  | 'calm' 
  | 'corporate';

export type Purpose = 
  | 'conversion' 
  | 'awareness' 
  | 'education' 
  | 'engagement' 
  | 'retention';

export type VisualDensity = 'low' | 'medium' | 'high';

export interface SectionMetadata {
  moods: Mood[];
  purpose: Purpose[];
  density: VisualDensity;
  tags: string[];
  description?: string;
}

export type EffectCategory = 
  | 'shadow' 
  | 'border' 
  | 'background' 
  | 'filter' 
  | 'overlay' 
  | 'texture' 
  | 'shape' 
  | 'highlight' 
  | 'animation';

export interface Effect {
  id: string;
  name: string;
  category: EffectCategory;
  className: string; // Tailwind class or custom class
  css?: Record<string, string>; // Inline styles if needed
  requiresWrapper?: boolean; // If true, might need a wrapper div
}

export interface Section {
  id: string;
  name: string;
  category: SectionCategory;
  height: number; // Expected height in px
  html: string; // The HTML content
  variables: Record<string, any>;
  metadata: SectionMetadata;
  compatibleEffects?: EffectCategory[]; // Which effects work well with this section
}

export type AssetType = 'photo' | 'vector' | 'illustration' | 'icon' | 'brand';

export interface Asset {
  id: string;
  url: string;
  type: AssetType;
  source: 'unsplash' | 'pixabay' | 'brand' | 'upload';
  alt?: string;
  metadata?: {
    width?: number;
    height?: number;
    author?: string;
  };
}
