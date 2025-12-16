import React from 'react';
import { 
  Type, Image, Square, Circle, Triangle, Minus, Upload, Search, Layers, Lock, Eye, EyeOff, Trash2, MoveUp, MoveDown,
  Hexagon, Octagon, Pentagon, Star, Heart, Cloud, MessageCircle, Zap, Sun, Moon, Check, X, Shield, Tag, Bookmark, 
  Layout, Smartphone, Monitor, CreditCard, Ticket, Stamp, Facebook, Instagram, Twitter, Linkedin, Youtube, Github,
  ArrowRight, ArrowLeft, Diamond, CircleDot, User, Home, Settings, Bell, Tablet, CircleDashed, MessageSquareQuote, 
  Laptop, Watch, AppWindow, Film, Mail, Folder, Book, Clipboard, Contact
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import stockElements from '../data/stockElements.json';
import textStyles from '../data/textStyles.json';
import elementsData from '../data/elements.json';
import { SECTIONS } from '@/lib/builder/library';

export const DEFAULT_VARIABLES: Record<string, string> = {
  brand_name: 'ACME CORP',
  brandName: 'ACME CORP',
  BRAND_NAME: 'ACME CORP',
  tagline: 'Innovation for Future',
  TAGLINE: 'Innovation for Future',
  headline: 'Transform Your Business',
  HEADLINE: 'Transform Your Business',
  subheadline: 'Leverage the power of AI to streamline your workflow and boost productivity.',
  SUBHEADLINE: 'Leverage the power of AI to streamline your workflow and boost productivity.',
  hero_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600',
  heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600',
  HERO_IMAGE: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600',
  product_image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
  productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
  PRODUCT_IMAGE: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
  product_name: 'Premium Watch',
  productName: 'Premium Watch',
  PRODUCT_NAME: 'Premium Watch',
  price: '$299',
  PRICE: '$299',
  feature_1: 'Smart Tracking',
  feature1: 'Smart Tracking',
  FEATURE_1: 'Smart Tracking',
  feature_2: 'All-day Battery',
  feature2: 'All-day Battery',
  FEATURE_2: 'All-day Battery',
  feature_3: 'Water Resistant',
  feature3: 'Water Resistant',
  FEATURE_3: 'Water Resistant',
  website: 'www.acme.com',
  websiteUrl: 'www.acme.com',
  WEBSITE: 'www.acme.com',
  cta: 'Get Started',
  ctaText: 'Get Started',
  CTA: 'Get Started',
  quote: 'This product completely changed my workflow. Highly recommended!',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  author: 'Sarah Jenkins',
  role: 'Creative Director',
  feat1_title: 'Fast', feat1_desc: 'Lightning speed',
  feat2_title: 'Powerful', feat2_desc: 'Do more',
  feat3_title: 'Secure', feat3_desc: 'Bank-grade',
  feat4_title: 'Premium', feat4_desc: 'Top quality'
};

// Icon mapping
const IconMap: Record<string, any> = {
  Square, Circle, Triangle, Star, Heart, Hexagon, Octagon, Pentagon, Cloud, MessageCircle, Zap, Sun, Moon, Check, X, 
  Shield, Tag, Bookmark, ArrowRight, ArrowLeft, Diamond, CircleDot, User, Home, Settings, Bell, Smartphone, Tablet, 
  Layout, Image, CircleDashed, CreditCard, Ticket, Stamp, MessageSquareQuote, Monitor, Laptop, Watch, AppWindow, 
  Film, Mail, Folder, Book, Clipboard, Contact
};

interface BrandAssets {
  images: Array<string | { url: string; metadata?: any }>;
  products: Array<{ imageUrl: string; name: string; price?: string }>;
}

interface ToolPanelProps {
  onClose: () => void;
  addElement: (type: any, payload?: any) => void;
  onAddHtml?: (html: string) => void;
  brandAssets?: BrandAssets;
}

export function TextPanel({ onClose, addElement }: ToolPanelProps) {
  const [activeCategory, setActiveCategory] = React.useState('Neon');
  
  // Get unique categories
  const categories = Array.from(new Set(textStyles.map(s => s.category)));

  return (
    <div className="absolute top-16 left-4 w-80 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 p-4 z-50 animate-in slide-in-from-left-5 fade-in duration-200 h-[80vh] flex flex-col">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h3 className="font-semibold text-slate-800">Text</h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0 rounded-full">×</Button>
      </div>
      
      <div className="space-y-3 shrink-0 mb-4">
        <Button 
          variant="outline" 
          className="w-full justify-start text-left h-12 text-2xl font-bold"
          onClick={() => addElement('text', { text: 'Add a heading', fontSize: 48, fontWeight: 'bold' })}
        >
          Add a heading
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start text-left h-10 text-lg font-semibold"
          onClick={() => addElement('text', { text: 'Add a subheading', fontSize: 32, fontWeight: 'semibold' })}
        >
          Add a subheading
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start text-left h-8 text-sm"
          onClick={() => addElement('text', { text: 'Add a little bit of body text', fontSize: 16, fontWeight: 'normal' })}
        >
          Add a little bit of body text
        </Button>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <h4 className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider shrink-0">Font Combinations</h4>
        
        <Tabs defaultValue="Neon" value={activeCategory} onValueChange={setActiveCategory} className="w-full flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="shrink-0 mb-2 overflow-x-auto">
            <TabsList className="w-full justify-start inline-flex">
              {categories.map(cat => (
                <TabsTrigger key={cat} value={cat} className="text-xs px-3">{cat}</TabsTrigger>
              ))}
            </TabsList>
          </div>

          <ScrollArea className="flex-1 w-full min-h-0">
            {categories.map(cat => (
              <TabsContent key={cat} value={cat} className="mt-0">
                <div className="grid grid-cols-2 gap-2 pr-3 pb-4">
                  {textStyles.filter(s => s.category === cat).map((style, i) => (
                    <div 
                      key={i}
                      className="aspect-video bg-slate-50 hover:bg-purple-50 rounded cursor-pointer border border-transparent hover:border-purple-200 transition-all flex items-center justify-center overflow-hidden p-2"
                      onClick={() => addElement('text', { text: style.preview, ...style.style })}
                    >
                      <span 
                        style={{
                          fontSize: '24px',
                          whiteSpace: 'nowrap' as const,
                          textAlign: ((style.style as any)?.textAlign || 'left') as React.CSSProperties['textAlign']
                        } as React.CSSProperties}
                        className="text-center"
                      >
                        {style.preview}
                      </span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
}

// Helper component for stock photos
function StockPhotosList({ addElement, query, type }: { addElement: (type: any, payload?: any) => void, query: string, type: string }) {
  const [photos, setPhotos] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(false);
      try {
        const q = query || 'nature'; // Default query
        const res = await fetch(`/api/stock?q=${encodeURIComponent(q)}&type=${type}`);
        const data = await res.json();
        if (data.results) {
          setPhotos(data.results);
        } else {
          setPhotos([]);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [query, type]);

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[300px] flex flex-col items-center justify-center text-red-400 text-sm text-center p-4">
        <p>Failed to load images.</p>
        <p className="text-xs mt-1 opacity-70">Please check your connection.</p>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="h-[300px] flex flex-col items-center justify-center text-slate-400 text-sm text-center p-4">
        <p>No results found for "{query}".</p>
        <p className="text-xs mt-1 opacity-70">Try a different search term.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px] pr-2">
      <div className="grid grid-cols-2 gap-2">
        {photos.map((img) => (
          <div 
            key={img.id} 
            className="aspect-square bg-slate-100 rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity group relative"
            style={{
              backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
            }}
            onClick={() => addElement('image', { src: img.src.medium })}
          >
            <img 
              src={img.src.small} 
              alt={img.alt} 
              className="w-full h-full object-cover bg-white/50 backdrop-blur-[1px]"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement?.classList.add('image-error');
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 hidden group-[.image-error]:flex">
              <span className="text-[10px]">Broken Image</span>
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[8px] px-1 rounded opacity-70">
              {img.provider}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

export function MediaPanel({ onClose, addElement, brandAssets }: ToolPanelProps) {
  const [mediaType, setMediaType] = React.useState('photo');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeQuery, setActiveQuery] = React.useState('nature');

  const triggerSearch = () => {
    if (searchQuery) setActiveQuery(searchQuery);
  };

  return (
    <div className="absolute top-16 left-4 w-80 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 p-4 z-50 animate-in slide-in-from-left-5 fade-in duration-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-slate-800">Media</h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0 rounded-full">×</Button>
      </div>

      <div className="mb-4">
        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white gap-2">
          <Upload className="w-4 h-4" /> Upload Media
        </Button>
      </div>

      <Tabs defaultValue="brand" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="brand">Brand</TabsTrigger>
          <TabsTrigger value="photos">Stock</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="brand" className="mt-0">
          <ScrollArea className="h-[350px] pr-2">
            {brandAssets && (brandAssets.images.length > 0 || brandAssets.products.length > 0) ? (
              <div className="space-y-4">
                {brandAssets.products.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase">Products</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {brandAssets.products.map((prod, i) => (
                        <div 
                          key={i} 
                          className="aspect-square bg-slate-100 rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity group relative border border-slate-200"
                          onClick={() => addElement('image', { src: prod.imageUrl })}
                        >
                          <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] p-1 truncate">
                            {prod.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {brandAssets.images.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase">Brand Assets</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {brandAssets.images.map((img, i) => {
                        const url = typeof img === 'string' ? img : img.url;
                        return (
                          <div 
                            key={i} 
                            className="aspect-square bg-slate-100 rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity group relative border border-slate-200"
                            onClick={() => addElement('image', { src: url })}
                          >
                            <img src={url} alt="Brand Asset" className="w-full h-full object-cover" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-slate-400 text-sm text-center p-4">
                <p>No brand assets found.</p>
                <p className="text-xs mt-1 opacity-70">Upload assets in Brand Settings.</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="photos" className="mt-0">
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={`Search ${mediaType}s...`}
                className="pl-8" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    triggerSearch();
                  }
                }}
              />
            </div>
            <Select value={mediaType} onValueChange={(val) => setMediaType(val)}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="photo">Photos</SelectItem>
                <SelectItem value="illustration">Art</SelectItem>
                <SelectItem value="vector">Vectors</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <StockPhotosList addElement={addElement} query={activeQuery} type={mediaType} />
        </TabsContent>
        <TabsContent value="videos">
          <div className="flex flex-col items-center justify-center h-[300px] text-slate-400 text-sm">
            <p>Video support coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function ElementsPanel({ onClose, addElement, onAddHtml, brandAssets }: ToolPanelProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('sections');

  // Construct dynamic default variables based on brand assets
  const dynamicDefaults = React.useMemo(() => {
    const defaults = { ...DEFAULT_VARIABLES };
    
    if (brandAssets) {
      // Use first product image if available
      if (brandAssets.products.length > 0) {
        defaults.product_image = brandAssets.products[0].imageUrl;
        defaults.productImage = brandAssets.products[0].imageUrl;
        defaults.product_name = brandAssets.products[0].name;
        defaults.productName = brandAssets.products[0].name;
        if (brandAssets.products[0].price) {
          defaults.price = brandAssets.products[0].price;
        }
      }
      
      // Use brand assets if available
      if (brandAssets.images.length > 0) {
        // Use first image as hero fallback
        const firstImage = brandAssets.images[0];
        const url = typeof firstImage === 'string' ? firstImage : firstImage?.url;
        
        if (url) {
          defaults.hero_image = url;
          defaults.heroImage = url;
        }
      }
    }
    return defaults;
  }, [brandAssets]);

  const categories = [
    { id: 'sections', label: 'Smart Blocks' },
    { id: 'shapes', label: 'Shapes' },
    { id: 'frames', label: 'Frames' },
    { id: 'buttons', label: 'Buttons' },
    { id: 'badges', label: 'Badges' },
    { id: 'titles', label: 'Titles' },
    { id: 'social', label: 'Social' },
  ];

  // --- SECTIONS ---
  const legacySections = elementsData.map((item: any) => ({
    id: item.id,
    label: item.name,
    category: item.category,
    preview: (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 p-2 text-center overflow-hidden">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.category}</div>
        <div className="text-xs font-medium text-slate-700 leading-tight">{item.name}</div>
      </div>
    ),
    action: () => { 
      if (onAddHtml) {
        let content = item.content;
        // Interpolate with dynamic variables
        Object.entries(dynamicDefaults).forEach(([key, value]) => {
          content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
        });
        onAddHtml(content);
        onClose();
      }
    }
  }));

  const smartSections = SECTIONS.map((item) => ({
    id: item.id,
    label: item.name,
    category: 'Smart Blocks',
    preview: (
      <div className="w-full h-full flex flex-col items-center justify-center bg-purple-50 p-2 text-center overflow-hidden border border-purple-100">
        <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1">Tailwind</div>
        <div className="text-xs font-medium text-purple-900 leading-tight">{item.name}</div>
      </div>
    ),
    action: () => { 
      if (onAddHtml) {
        let content = item.html;
        // Interpolate variables with dynamic values, merging item-specific variables with global defaults
        const variables = { ...dynamicDefaults, ...(item.variables || {}) };
        
        Object.entries(variables).forEach(([key, value]) => {
          let strValue = String(value);
          // Handle object values (e.g. image objects)
          if (typeof value === 'object' && value !== null) {
             if ('src' in value) strValue = (value as any).src;
             else if ('url' in value) strValue = (value as any).url;
             else strValue = JSON.stringify(value);
          }
          content = content.replace(new RegExp(`{{${key}}}`, 'g'), strValue);
        });
        onAddHtml(content);
        onClose();
      }
    }
  }));

  // Filter out duplicates from legacy if they exist in smart sections (by ID)
  const sections = [
    ...smartSections,
    ...legacySections.filter(l => !SECTIONS.find(s => s.id === l.id))
  ];

  // --- SOCIAL ---
  const social = [
    { label: 'Facebook', icon: <Facebook className="w-6 h-6 text-blue-600" />, action: () => { addElement('image', { src: 'https://api.iconify.design/logos:facebook.svg' }); onClose(); } },
    { label: 'Instagram', icon: <Instagram className="w-6 h-6 text-pink-600" />, action: () => { addElement('image', { src: 'https://api.iconify.design/skill-icons:instagram.svg' }); onClose(); } },
    { label: 'Twitter', icon: <Twitter className="w-6 h-6 text-sky-500" />, action: () => { addElement('image', { src: 'https://api.iconify.design/logos:twitter.svg' }); onClose(); } },
    { label: 'LinkedIn', icon: <Linkedin className="w-6 h-6 text-blue-700" />, action: () => { addElement('image', { src: 'https://api.iconify.design/logos:linkedin-icon.svg' }); onClose(); } },
    { label: 'YouTube', icon: <Youtube className="w-6 h-6 text-red-600" />, action: () => { addElement('image', { src: 'https://api.iconify.design/logos:youtube-icon.svg' }); onClose(); } },
    { label: 'GitHub', icon: <Github className="w-6 h-6" />, action: () => { addElement('image', { src: 'https://api.iconify.design/logos:github-icon.svg' }); onClose(); } },
    { label: 'TikTok', icon: <span className="font-bold">TikTok</span>, action: () => { addElement('image', { src: 'https://api.iconify.design/logos:tiktok-icon.svg' }); onClose(); } },
    { label: 'Pinterest', icon: <span className="font-bold text-red-600">Pin</span>, action: () => { addElement('image', { src: 'https://api.iconify.design/logos:pinterest.svg' }); onClose(); } },
    { label: 'Discord', icon: <span className="font-bold text-indigo-500">Discord</span>, action: () => { addElement('image', { src: 'https://api.iconify.design/logos:discord-icon.svg' }); onClose(); } },
    { label: 'WhatsApp', icon: <span className="font-bold text-green-500">WA</span>, action: () => { addElement('image', { src: 'https://api.iconify.design/logos:whatsapp-icon.svg' }); onClose(); } },
    { label: 'Telegram', icon: <span className="font-bold text-sky-400">TG</span>, action: () => { addElement('image', { src: 'https://api.iconify.design/logos:telegram.svg' }); onClose(); } },
    { label: 'Snapchat', icon: <span className="font-bold text-yellow-400">Snap</span>, action: () => { addElement('image', { src: 'https://api.iconify.design/logos:snapchat.svg' }); onClose(); } },
    { label: 'Reddit', icon: <span className="font-bold text-orange-500">Reddit</span>, action: () => { addElement('image', { src: 'https://api.iconify.design/logos:reddit-icon.svg' }); onClose(); } },
    { label: 'Medium', icon: <span className="font-bold">Medium</span>, action: () => { addElement('image', { src: 'https://api.iconify.design/logos:medium-icon.svg' }); onClose(); } },
    { label: 'Spotify', icon: <span className="font-bold text-green-500">Spotify</span>, action: () => { addElement('image', { src: 'https://api.iconify.design/logos:spotify-icon.svg' }); onClose(); } },
    { label: 'Twitch', icon: <span className="font-bold text-purple-500">Twitch</span>, action: () => { addElement('image', { src: 'https://api.iconify.design/logos:twitch.svg' }); onClose(); } },
    { label: 'Slack', icon: <span className="font-bold text-purple-600">Slack</span>, action: () => { addElement('image', { src: 'https://api.iconify.design/logos:slack-icon.svg' }); onClose(); } },
    { label: 'Dribbble', icon: <span className="font-bold text-pink-500">Drib</span>, action: () => { addElement('image', { src: 'https://api.iconify.design/logos:dribbble-icon.svg' }); onClose(); } },
    { label: 'Behance', icon: <span className="font-bold text-blue-600">Be</span>, action: () => { addElement('image', { src: 'https://api.iconify.design/logos:behance.svg' }); onClose(); } },
    { label: 'Figma', icon: <span className="font-bold text-purple-400">Figma</span>, action: () => { addElement('image', { src: 'https://api.iconify.design/logos:figma.svg' }); onClose(); } },
  ];

  // Helper to get items from JSON
  const getItems = (category: string) => {
    const cat = stockElements.find(c => c.category === category);
    return cat ? cat.items : [];
  };

  const shapes = getItems('shapes').map((item: any) => ({
    ...item,
    icon: React.createElement(IconMap[item.icon] || Square, { className: "w-6 h-6" }),
    action: () => { addElement(item.type, item.payload); onClose(); }
  }));

  const frames = getItems('frames').map((item: any) => ({
    ...item,
    icon: React.createElement(IconMap[item.icon] || Layout, { className: "w-6 h-6" }),
    action: () => { addElement(item.type, item.payload); onClose(); }
  }));

  const buttons = getItems('buttons').map((item: any) => ({
    ...item,
    preview: item.previewType === 'css' ? (
      <div className="flex items-center justify-center w-full h-full scale-75 origin-center" style={{ pointerEvents: 'none' }}>
        <div style={{
          ...item.payload,
          width: 'auto',
          height: 'auto',
          minWidth: 60,
          minHeight: 24,
          fontSize: 10,
          padding: '4px 8px',
          textAlign: (item.payload?.textAlign || 'left') as React.CSSProperties['textAlign']
        } as React.CSSProperties}>
          {item.payload.content}
        </div>
      </div>
    ) : null,
    action: () => { addElement(item.type, item.payload); onClose(); }
  }));

  const badges = getItems('badges').map((item: any) => ({
    ...item,
    preview: item.previewType === 'css' ? (
      <div className="flex items-center justify-center w-full h-full scale-90 origin-center" style={{ pointerEvents: 'none' }}>
        <div style={{
          ...item.payload,
          width: 'auto',
          height: 'auto',
          fontSize: 8,
          padding: '2px 6px',
          textAlign: (item.payload?.textAlign || 'left') as React.CSSProperties['textAlign']
        } as React.CSSProperties}>
          {item.payload.content}
        </div>
      </div>
    ) : null,
    action: () => { addElement(item.type, item.payload); onClose(); }
  }));

  const titles = getItems('titles').map((item: any) => ({
    ...item,
    preview: item.previewType === 'css' ? (
      <div className="flex items-center justify-center w-full h-full scale-50 origin-center" style={{ pointerEvents: 'none' }}>
        <div style={{
          ...item.payload,
          width: 'auto',
          height: 'auto',
          whiteSpace: 'nowrap',
          textAlign: (item.payload?.textAlign || 'left') as React.CSSProperties['textAlign']
        } as React.CSSProperties}>
          {item.payload.content}
        </div>
      </div>
    ) : null,
    action: () => { addElement(item.type, item.payload); onClose(); }
  }));

  const filterItems = (items: any[]) => items.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="absolute top-16 left-4 w-80 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 p-4 z-50 animate-in slide-in-from-left-5 fade-in duration-200 flex flex-col h-[80vh] overflow-hidden">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h3 className="font-semibold text-slate-800">Elements</h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0 rounded-full">×</Button>
      </div>

      <div className="relative mb-4 shrink-0">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search elements..." 
          className="pl-8" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="shapes" value={activeCategory} onValueChange={setActiveCategory} className="w-full flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="shrink-0 mb-2 overflow-x-auto">
          <TabsList className="w-full justify-start inline-flex">
            {categories.map(cat => (
              <TabsTrigger key={cat.id} value={cat.id} className="text-xs px-3">{cat.label}</TabsTrigger>
            ))}
          </TabsList>
        </div>

        <ScrollArea className="flex-1 w-full min-h-0">            <TabsContent value="sections" className="mt-0">
              <div className="grid grid-cols-2 gap-2 pr-2 pb-4">
                {filterItems(sections).map((item, i) => (
                  <div 
                    key={i}
                    className="aspect-video bg-white hover:bg-purple-50 rounded-lg cursor-pointer border border-slate-200 hover:border-purple-200 transition-all flex items-center justify-center overflow-hidden relative group shadow-sm"
                    onClick={item.action}
                  >
                    {item.preview}
                  </div>
                ))}
              </div>
            </TabsContent>
          <TabsContent value="shapes" className="mt-0">
            <div className="grid grid-cols-3 gap-2 pr-3 pb-4">
              {filterItems(shapes).map((shape, i) => (
                <button 
                  key={i}
                  onClick={shape.action}
                  className="aspect-square bg-slate-50 hover:bg-purple-50 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors border border-slate-100 hover:border-purple-200 group p-1"
                  title={shape.label}
                >
                  <div className="text-slate-600 group-hover:text-purple-600 transition-colors">
                    {shape.icon}
                  </div>
                  <span className="text-[8px] text-slate-600 font-medium text-center truncate w-full">{shape.label}</span>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="frames" className="mt-0">
            <div className="grid grid-cols-3 gap-2 pr-3 pb-4">
              {filterItems(frames).map((frame, i) => (
                <button 
                  key={i}
                  onClick={frame.action}
                  className="aspect-square bg-slate-50 hover:bg-purple-50 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors border border-slate-100 hover:border-purple-200 p-1 group"
                >
                  <div className="text-slate-400 group-hover:text-purple-500 transition-colors">
                    {frame.icon}
                  </div>
                  <span className="text-[8px] text-slate-600 font-medium text-center truncate w-full">{frame.label}</span>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="buttons" className="mt-0">
            <div className="grid grid-cols-3 gap-2 pr-3 pb-4">
              {filterItems(buttons).map((btn, i) => (
                <button 
                  key={i}
                  onClick={btn.action}
                  className="aspect-square bg-slate-50 hover:bg-purple-50 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors border border-slate-100 hover:border-purple-200 p-1 overflow-hidden"
                >
                  <div className="scale-100 origin-center">
                    {btn.preview}
                  </div>
                  <span className="text-[8px] text-slate-600 font-medium text-center truncate w-full">{btn.label}</span>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="badges" className="mt-0">
            <div className="grid grid-cols-3 gap-2 pr-3 pb-4">
              {filterItems(badges).map((badge, i) => (
                <button 
                  key={i}
                  onClick={badge.action}
                  className="aspect-square bg-slate-50 hover:bg-purple-50 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors border border-slate-100 hover:border-purple-200 p-1 overflow-hidden"
                >
                  <div className="scale-100 origin-center">
                    {badge.preview}
                  </div>
                  <span className="text-[8px] text-slate-600 font-medium text-center truncate w-full">{badge.label}</span>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="titles" className="mt-0">
            <div className="grid grid-cols-3 gap-2 pr-3 pb-4">
              {filterItems(titles).map((title, i) => (
                <button 
                  key={i}
                  onClick={title.action}
                  className="aspect-square bg-slate-50 hover:bg-purple-50 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors border border-slate-100 hover:border-purple-200 p-1 overflow-hidden"
                >
                  <div className="scale-100 origin-center w-full flex justify-center">
                    {title.preview}
                  </div>
                  <span className="text-[8px] text-slate-600 font-medium text-center truncate w-full">{title.label}</span>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="social" className="mt-0">
            <div className="grid grid-cols-3 gap-2 pr-3 pb-4">
              {filterItems(social).map((item, i) => (
                <button 
                  key={i}
                  onClick={item.action}
                  className="aspect-square bg-slate-50 hover:bg-purple-50 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors border border-slate-100 hover:border-purple-200 group p-1"
                  title={item.label}
                >
                  <div className="scale-75">
                    {item.icon}
                  </div>
                  <span className="text-[8px] text-slate-600 font-medium text-center truncate w-full">{item.label}</span>
                </button>
              ))}
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}

interface LayersPanelProps {
  elements: any[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onReorder: (id: string, direction: 'up' | 'down') => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function LayersPanel({ elements, selectedId, onSelect, onReorder, onDelete, onClose }: LayersPanelProps) {
  return (
    <div className="absolute top-16 right-4 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 p-4 z-50 animate-in slide-in-from-right-5 fade-in duration-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <Layers className="w-4 h-4" /> Layers
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0 rounded-full">×</Button>
      </div>

      <ScrollArea className="h-[400px] pr-2">
        <div className="space-y-1">
          {[...elements].reverse().map((el, index) => (
            <div 
              key={el.id}
              className={`flex items-center gap-2 p-2 rounded-lg text-sm transition-colors group ${
                selectedId === el.id ? 'bg-purple-100 text-purple-900' : 'hover:bg-slate-50 text-slate-700'
              }`}
              onClick={() => onSelect(el.id)}
            >
              <div className="w-4 h-4 flex items-center justify-center text-slate-400">
                {el.type === 'text' && <Type className="w-3 h-3" />}
                {el.type === 'image' && <Image className="w-3 h-3" />}
                {el.type === 'rectangle' && <Square className="w-3 h-3" />}
                {el.type === 'circle' && <Circle className="w-3 h-3" />}
              </div>
              
              <span className="flex-1 truncate font-medium">
                {el.type === 'text' ? (el.content || 'Text') : `${el.type} ${elements.length - index}`}
              </span>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); onReorder(el.id, 'up'); }}
                  className="p-1 hover:bg-slate-200 rounded"
                >
                  <MoveUp className="w-3 h-3" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onReorder(el.id, 'down'); }}
                  className="p-1 hover:bg-slate-200 rounded"
                >
                  <MoveDown className="w-3 h-3" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(el.id); }}
                  className="p-1 hover:bg-red-100 text-red-500 rounded"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
          {elements.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs">
              No layers yet
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
