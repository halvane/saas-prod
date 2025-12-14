import { ReactNode } from 'react';

export interface BrandSettings {
  brandName: string;
  brandLogo?: string | null;
  brandColors: string[]; // [primary, secondary, accent, ...]
  brandFont?: string;
  brandUrl?: string;
}

export interface TemplateContent {
  title?: string;
  subtitle?: string;
  body?: string;
  image?: string;
  cta?: string;
  author?: string;
  authorImage?: string;
  date?: string;
}

export type AspectRatio = 'square' | 'portrait' | 'landscape' | 'story';

export interface TemplateProps {
  brand: BrandSettings;
  content: TemplateContent;
  aspectRatio: AspectRatio;
  className?: string;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  category: 'quote' | 'announcement' | 'article' | 'promotion' | 'testimonial';
  platform: 'instagram' | 'twitter' | 'linkedin' | 'facebook' | 'blog';
  component: React.ComponentType<TemplateProps>;
  defaultContent: TemplateContent;
}
