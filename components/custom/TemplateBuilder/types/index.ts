// Visual Editor Element Interface (Canva-inspired)
export interface VisualElement {
  id: string;
  type: 'text' | 'image' | 'rectangle' | 'circle' | 'group';
  x: number;
  y: number;
  width: number;
  height: number;
  
  // Text properties
  content?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  textAlign?: string;
  lineHeight?: number;
  letterSpacing?: number;
  textShadow?: string;
  WebkitTextStroke?: string;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  
  // Image properties
  src?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  
  // Shape properties
  backgroundColor?: string;
  backgroundImage?: string;
  color?: string;
  borderRadius?: number;
  border?: string;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  
  // Transform
  opacity?: number;
  rotation?: number;
  flipX?: boolean;
  flipY?: boolean;
  
  // Shadow & Effects
  shadow?: {
    x: number;
    y: number;
    blur: number;
    color: string;
  };
  
  // Layer management
  zIndex: number;
  locked?: boolean;
  visible?: boolean;
  
  // Group properties
  children?: string[];
  parentId?: string;
  
  // Variable linking (for bidirectional sync)
  linkedVariable?: string;
  linkedProperty?: 'content' | 'src' | 'backgroundColor' | 'color';
  
  // Frame properties
  isFrame?: boolean;
}

export interface CustomTemplate {
  id?: string;
  name: string;
  description?: string;
  category: string;
  platform: string[];
  htmlTemplate: string;
  cssTemplate: string;
  width: number;
  height: number;
  variables: Record<string, any>;
  tags: string[];
  isActive: boolean;
  isPublic: boolean;
  thumbnailUrl?: string;
  previewUrl?: string;
  usageCount?: number;
}

export interface HistoryState {
  elements: VisualElement[];
  timestamp: number;
}

export const PLATFORM_DIMENSIONS: Record<string, { width: number; height: number }> = {
  instagram: { width: 1080, height: 1080 },
  pinterest: { width: 1000, height: 1500 },
  facebook: { width: 1200, height: 630 },
  tiktok: { width: 1080, height: 1920 },
  linkedin: { width: 1200, height: 627 },
};

export const DEFAULT_TEMPLATE: CustomTemplate = {
  name: 'Nouveau Template Visual',
  description: 'Créé avec l\'éditeur visuel',
  category: 'pinterest',
  platform: ['pinterest'],
  htmlTemplate: '<div class="visual-canvas"></div>',
  cssTemplate: '.visual-canvas { position: relative; width: 1000px; height: 1500px; background: #ffffff; }',
  width: 1000,
  height: 1500,
  variables: {},
  tags: ['visual-editor'],
  isActive: true,
  isPublic: false
};
