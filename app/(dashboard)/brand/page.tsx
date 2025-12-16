'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from '@/components/ui/label';
import { Palette, Globe, Zap, CheckCircle, ExternalLink, Upload, Plus, X, Loader2, Target, Lightbulb, Heart, Tag, BrainCircuit, Sparkles, Image as ImageIcon, Trash2, Edit2, ChevronLeft, ChevronRight, ShoppingBag, Download, FileJson } from 'lucide-react';
import { getBrandSettings, saveBrandSettings, deleteBrandSettings } from '@/app/(dashboard)/settings/actions';
import { generateAllTemplatesJSON, checkIsAdmin } from './actions';
import { AIProcessingLoader } from '@/components/custom/AI/AIProcessingLoader';
import { toast } from 'sonner';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function BrandPage() {
  const [brandName, setBrandName] = React.useState('');
  const [brandLogo, setBrandLogo] = React.useState<string | null>(null);
  const [brandColors, setBrandColors] = React.useState<string[]>(['#8B5CF6', '#EC4899', '#10B981']);
  const [brandUrl, setBrandUrl] = React.useState('');
  const [brandVoice, setBrandVoice] = React.useState('');
  const [brandAudience, setBrandAudience] = React.useState('');
  const [brandIndustry, setBrandIndustry] = React.useState('');
  const [brandValues, setBrandValues] = React.useState('');
  const [brandStory, setBrandStory] = React.useState('');
  
  // Deep Brand Analysis Fields
  const [brandArchetype, setBrandArchetype] = React.useState('');
  const [brandTagline, setBrandTagline] = React.useState('');
  const [brandMission, setBrandMission] = React.useState('');
  const [brandUsps, setBrandUsps] = React.useState<string[]>([]);
  const [brandPainPoints, setBrandPainPoints] = React.useState<string[]>([]);
  const [customerDesires, setCustomerDesires] = React.useState<string[]>([]);
  const [adAngles, setAdAngles] = React.useState<string[]>([]);
  const [products, setProducts] = React.useState<any[]>([]);

  const [isScrapingBrand, setIsScrapingBrand] = React.useState(false);
  const [scrapingProgress, setScrapingProgress] = React.useState(0);
  const [scrapingStep, setScrapingStep] = React.useState(0);
  const [isEditingUrl, setIsEditingUrl] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [hasSavedData, setHasSavedData] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDirty, setIsDirty] = React.useState(false);
  const [isViewMode, setIsViewMode] = React.useState(true);

  // Admin Debug State
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isDebugModalOpen, setIsDebugModalOpen] = React.useState(false);
  const [debugJson, setDebugJson] = React.useState<string>('');
  const [isGeneratingDebug, setIsGeneratingDebug] = React.useState(false);

  React.useEffect(() => {
    checkIsAdmin().then(setIsAdmin);
  }, []);

  const handleGenerateDebug = async () => {
    setIsGeneratingDebug(true);
    try {
      const data = await generateAllTemplatesJSON();
      setDebugJson(JSON.stringify(data, null, 2));
      setIsDebugModalOpen(true);
      toast.success('Debug JSON generated!');
    } catch (error) {
      toast.error('Failed to generate debug JSON');
      console.error(error);
    } finally {
      setIsGeneratingDebug(false);
    }
  };

  const handleDownloadDebug = () => {
    const blob = new Blob([debugJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'templates-debug.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAnalyzeBrand = async () => {
    if (!brandUrl) {
      toast.error('Please enter a website URL');
      return;
    }

    setIsScrapingBrand(true);
    setScrapingProgress(0);
    setScrapingStep(0);

    try {
      const progressInterval = setInterval(() => {
        setScrapingProgress(prev => Math.min(prev + 1, 90));
      }, 500);

      const stepInterval = setInterval(() => {
        setScrapingStep(prev => (prev < 4 ? prev + 1 : prev));
      }, 2000);

      const response = await fetch('/api/brand/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: brandUrl }),
      });

      clearInterval(progressInterval);
      clearInterval(stepInterval);
      setScrapingProgress(100);
      setScrapingStep(4);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to analyze brand');
      }

      const data = await response.json();
      
      // Map API response (scraper format) to Page state (DB format)
      setBrandName(data.name || data.brandName || '');
      setBrandLogo(data.logo || data.brandLogo || null);
      
      // Handle colors which might be 'colors' (scraper) or 'brandColors' (DB)
      const colors = data.colors || data.brandColors || [];
      if (colors.length > 0) setBrandColors(colors);
      
      setBrandVoice(data.tone || data.brandVoice || '');
      setBrandAudience(data.audience || data.brandAudience || '');
      setBrandIndustry(data.industry || data.brandIndustry || '');
      setBrandValues(data.values || data.brandValues || '');
      setBrandStory(data.story || data.brandStory || '');
      
      setBrandArchetype(data.archetype || data.brandArchetype || '');
      setBrandTagline(data.tagline || data.brandTagline || '');
      setBrandMission(data.mission || data.brandMission || '');
      
      setBrandUsps(data.usps || data.brandUsps || []);
      setBrandPainPoints(data.painPoints || data.brandPainPoints || []);
      setCustomerDesires(data.customerDesires || []);
      setAdAngles(data.adAngles || []);
      
      // Handle products
      if (data.products && Array.isArray(data.products)) {
        // Map scraper product format to UI format if needed
        const mappedProducts = data.products.map((p: any) => ({
          name: p.name,
          price: p.price || '',
          description: p.description || '',
          imageUrl: p.image || p.imageUrl || '', // Scraper uses 'image', UI uses 'imageUrl'
          metadata: p.metadata || {}
        }));
        setProducts(mappedProducts);
      }

      // Handle images
      const images = data.images || data.brandImages || [];
      setBrandImages(dedupeImages(images));

      toast.success('Brand analysis complete!');
      setIsViewMode(false); 
      setHasSavedData(true);

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to analyze brand');
      console.error(error);
    } finally {
      setTimeout(() => setIsScrapingBrand(false), 1000);
    }
  };

  // Manual Add State
  const [isAddProductOpen, setIsAddProductOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [newProduct, setNewProduct] = React.useState({ name: '', price: '', description: '', imageUrl: '' });
  const [newAssetUrl, setNewAssetUrl] = React.useState('');

  interface BrandAsset {
    url: string;
    metadata: {
      alt?: string;
      description?: string;
      tags?: string[];
      colors?: string[];
      mood?: string;
      marketing_angles?: string[];
      analyzed?: boolean;
      source?: string;
      context?: string;
    };
  }

  const [brandImages, setBrandImages] = React.useState<BrandAsset[]>([]);

  // Dynamic Brand Color System
  const getBrandColor = React.useCallback((index: number, fallback: string) => {
    return brandColors[index] || fallback;
  }, [brandColors]);

  const lightenColor = React.useCallback((hex: string, percent: number) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, ((num >> 16) + Math.round((255 - (num >> 16)) * percent)));
    const g = Math.min(255, (((num >> 8) & 0x00FF) + Math.round((255 - ((num >> 8) & 0x00FF)) * percent)));
    const b = Math.min(255, ((num & 0x0000FF) + Math.round((255 - (num & 0x0000FF)) * percent)));
    return `#${(0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }, []);

  const hexToRgb = React.useCallback((hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 139, g: 92, b: 246 };
  }, []);

  const brandTheme = React.useMemo(() => {
    const primary = getBrandColor(0, '#8B5CF6');
    const secondary = getBrandColor(1, '#EC4899');
    const accent = getBrandColor(2, '#10B981');
    
    const primaryRgb = hexToRgb(primary);
    const secondaryRgb = hexToRgb(secondary);
    const accentRgb = hexToRgb(accent);

    return {
      primary,
      secondary,
      accent,
      primaryLight: lightenColor(primary, 0.8),
      secondaryLight: lightenColor(secondary, 0.8),
      accentLight: lightenColor(accent, 0.8),
      primaryRgb: `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`,
      secondaryRgb: `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`,
      accentRgb: `${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}`,
      gradient: `linear-gradient(135deg, ${primary}, ${secondary}, ${accent})`,
    };
  }, [brandColors, getBrandColor, lightenColor, hexToRgb]);

  const sanitizeImageUrl = React.useCallback((url: string) => {
    if (!url) return '';
    const trimmed = url.trim();
    if (trimmed.startsWith('//')) return `https:${trimmed}`;
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    return `https://${trimmed.replace(/^https?:\/\//, '')}`;
  }, []);

  const dedupeImages = React.useCallback(
    (images: (string | BrandAsset)[]) => {
      const uniqueMap = new Map<string, BrandAsset>();
      
      images.forEach(img => {
        if (!img) return;
        const url = typeof img === 'string' ? img : img.url;
        const cleanUrl = sanitizeImageUrl(url);
        
        if (!uniqueMap.has(cleanUrl)) {
          if (typeof img === 'string') {
            uniqueMap.set(cleanUrl, { 
              url: cleanUrl, 
              metadata: { 
                source: 'scraped', 
                analyzed: false,
                context: 'brand_asset',
                marketing_angles: [],
                tags: []
              } 
            });
          } else {
            uniqueMap.set(cleanUrl, { ...img, url: cleanUrl });
          }
        }
      });

      return Array.from(uniqueMap.values()).slice(0, 12);
    },
    [sanitizeImageUrl]
  );

  const getDisplayImage = React.useCallback(
    (url: string) => {
      const clean = sanitizeImageUrl(url);
      if (!clean) return '';
      if (clean.includes('public.blob.vercel-storage.com')) {
        return clean;
      }
      return `https://wsrv.nl/?url=${encodeURIComponent(clean)}&w=900&h=900&fit=inside&output=webp`;
    },
    [sanitizeImageUrl]
  );

  React.useEffect(() => {
    const fetchData = async () => {
      const brandSettings = await getBrandSettings();

      if (brandSettings) {
        setHasSavedData(true);
        setIsViewMode(true);
        setBrandName(brandSettings.brandName || '');
        setBrandUrl(brandSettings.brandUrl || '');
        setBrandLogo(brandSettings.brandLogo || null);
        if (brandSettings.brandColors && brandSettings.brandColors.length > 0) {
          setBrandColors(brandSettings.brandColors);
        }
        setBrandVoice(brandSettings.brandVoice || '');
        setBrandAudience(brandSettings.brandAudience || '');
        setBrandIndustry(brandSettings.brandIndustry || '');
        setBrandValues(brandSettings.brandValues || '');
        setBrandStory(brandSettings.brandStory || '');
        setBrandImages(dedupeImages(brandSettings.brandImages || []));
        
        setBrandArchetype(brandSettings.brandArchetype || '');
        setBrandTagline(brandSettings.brandTagline || '');
        setBrandMission(brandSettings.brandMission || '');
        setBrandUsps(brandSettings.brandUsps || []);
        setBrandPainPoints(brandSettings.brandPainPoints || []);
        setCustomerDesires(brandSettings.customerDesires || []);
        setAdAngles(brandSettings.adAngles || []);
        setProducts(brandSettings.products || []);
      }
    };
    fetchData();
  }, [dedupeImages]);

  const handleSaveBrandDNA = async (dataOverride?: any) => {
    setIsSaving(true);
    try {
      const cleanedImages = dedupeImages(dataOverride?.brandImages || brandImages);
      if (!dataOverride) {
        setBrandImages(cleanedImages);
      }
      
      const dataToSave = dataOverride || {
        brandName,
        brandUrl,
        brandLogo,
        brandColors,
        brandVoice,
        brandAudience,
        brandIndustry,
        brandValues,
        brandStory,
        brandImages: cleanedImages,
        brandArchetype,
        brandTagline,
        brandMission,
        brandUsps,
        brandPainPoints,
        customerDesires,
        adAngles,
        products
      };
      
      await saveBrandSettings(dataToSave);
      toast.success('✨ Brand DNA saved to database!');
      setIsDirty(false);
      setIsViewMode(true);
      
      setTimeout(async () => {
        const freshData = await getBrandSettings();
        if (freshData) {
          setBrandLogo(freshData.brandLogo);
          setBrandImages(freshData.brandImages);
          setProducts(freshData.products);
        }
      }, 500);
    } catch (error) {
      toast.error(`Failed to save Brand DNA: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBrandData = async () => {
    setIsDeleting(true);
    try {
      await deleteBrandSettings();
      setBrandName('');
      setBrandUrl('');
      setBrandLogo(null);
      setBrandColors(['#8B5CF6', '#EC4899', '#10B981']);
      setBrandVoice('');
      setBrandAudience('');
      setBrandIndustry('');
      setBrandValues('');
      setBrandStory('');
      setBrandImages([]);
      setBrandArchetype('');
      setBrandTagline('');
      setBrandMission('');
      setBrandUsps([]);
      setBrandPainPoints([]);
      setCustomerDesires([]);
      setAdAngles([]);
      setProducts([]);
      setHasSavedData(false);
      setIsEditingUrl(false);
      toast.success('Brand data deleted successfully');
    } catch (error) {
      toast.error('Failed to delete brand data');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addBrandColor = () => {
    if (brandColors.length < 5) {
      setBrandColors([...brandColors, '#000000']);
    }
  };

  const updateBrandColor = (index: number, color: string) => {
    const newColors = [...brandColors];
    newColors[index] = color;
    setBrandColors(newColors);
  };

  const removeBrandColor = (index: number) => {
    if (brandColors.length > 1) {
      setBrandColors(brandColors.filter((_, i) => i !== index));
    }
  };

  const ListInput = ({ 
    items, 
    setItems, 
    placeholder, 
    label, 
    icon: Icon 
  }: { 
    items: string[], 
    setItems: (items: string[]) => void, 
    placeholder: string, 
    label: string,
    icon: any
  }) => {
    const [newItem, setNewItem] = React.useState('');

    const add = () => {
      if (newItem.trim()) {
        setItems([...items, newItem.trim()]);
        setNewItem('');
      }
    };

    return (
      <div>
        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
          <Icon className="w-4 h-4" style={{ color: brandTheme.primary }} />
          <span style={{ color: brandTheme.primary, fontWeight: 600 }}>{label}</span>
        </label>
        {!isViewMode && (
          <div className="flex gap-2 mb-2">
            <Input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && add()}
              placeholder={placeholder}
              className="flex-1 backdrop-blur-sm border-white/40 focus:border-white/60 transition-all"
              style={{ 
                backgroundColor: `rgba(${brandTheme.primaryRgb}, 0.05)`,
                borderColor: `rgba(${brandTheme.primaryRgb}, 0.2)`
              }}
            />
            <Button 
              onClick={add} 
              size="sm" 
              variant="outline"
              className="backdrop-blur-sm hover:scale-105 transition-all"
              style={{ 
                backgroundColor: `rgba(${brandTheme.primaryRgb}, 0.1)`,
                borderColor: `rgba(${brandTheme.primaryRgb}, 0.3)`,
                color: brandTheme.primary
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}
        <div className="flex flex-col gap-2">
          {items.length > 0 ? items.map((item, i) => (
            <div 
              key={i} 
              className="px-3 py-2 rounded-lg text-sm flex items-start justify-between gap-2 backdrop-blur-sm border transition-all hover:scale-[1.02] hover:shadow-md"
              style={{
                backgroundColor: `rgba(${brandTheme.primaryRgb}, 0.08)`,
                borderColor: `rgba(${brandTheme.primaryRgb}, 0.2)`,
                color: brandTheme.primary
              }}
            >
              <span className="whitespace-pre-wrap font-medium">{item}</span>
              {!isViewMode && (
                <button 
                  onClick={() => setItems(items.filter((_, idx) => idx !== i))} 
                  className="mt-0.5 flex-shrink-0 transition-all hover:scale-110"
                  style={{ color: brandTheme.secondary }}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )) : (
            isViewMode && <div className="text-sm text-gray-500 italic">No items</div>
          )}
        </div>
      </div>
    );
  };

  const scrapingSteps = [
    'Analyzing website content...',
    'Extracting brand information...',
    'Analyzing visual elements...',
    'Generating strategic insights...',
    'Finalizing brand analysis...'
  ];

  return (
    <div 
      className="relative min-h-screen overflow-x-hidden"
      style={{
        background: `linear-gradient(135deg, ${brandTheme.primaryLight} 0%, ${brandTheme.secondaryLight} 50%, ${brandTheme.accentLight} 100%)`
      }}
    >
      {/* Animated Gradient Background */}
      <div 
        className="fixed inset-0 -z-20 animate-gradient-xy"
        style={{
          background: `linear-gradient(135deg, ${brandTheme.primaryLight}, ${brandTheme.secondaryLight}, ${brandTheme.accentLight})`
        }}
      ></div>
      <div className="fixed inset-0 -z-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxNDgsMTYzLDE4NCwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 space-y-8 p-8 max-w-[1600px] mx-auto min-h-screen"
      >
      <AIProcessingLoader
        isOpen={isScrapingBrand}
        title="⚡ AI is Analyzing Your Brand..."
        subtitle={`Analyzing "${brandUrl}"`}
        steps={scrapingSteps}
        currentStep={scrapingStep}
        progress={scrapingProgress}
        icon={<Sparkles className="w-12 h-12 text-[#8B5CF6] animate-spin" />}
      />

      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 
            className="text-6xl font-black bg-clip-text text-transparent drop-shadow-sm"
            style={{
              backgroundImage: brandTheme.gradient
            }}
          >
            Brand DNA
          </h2>
          <p className="text-gray-700 mt-3 text-lg font-semibold tracking-wide">Manage your brand identity, assets, and strategic positioning</p>
        </div>
        <div className="flex gap-3">
          {isAdmin && (
            <Button
              onClick={handleGenerateDebug}
              disabled={isGeneratingDebug}
              variant="outline"
              className="bg-white/50 backdrop-blur-sm border-white/40 hover:bg-white/80"
            >
              {isGeneratingDebug ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <FileJson className="w-5 h-5" />
              )}
            </Button>
          )}
          {hasSavedData && isViewMode && (
            <Button 
              onClick={() => setIsViewMode(false)} 
              size="lg"
              variant="outline"
              className="bg-white/50 backdrop-blur-sm border-white/40 hover:bg-white/80"
            >
              <Edit2 className="w-5 h-5 mr-2" />
              Edit Brand DNA
            </Button>
          )}
          
          {(!isViewMode || !hasSavedData) && (
            <Button 
              onClick={() => handleSaveBrandDNA()} 
              disabled={isSaving}
              size="lg"
              style={{
                background: brandTheme.gradient,
                color: 'white'
              }}
              className="hover:opacity-90 transition-opacity shadow-lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Identity & Visuals */}
        <div className="space-y-6 lg:col-span-1">
          <GlassCard>
            <CardHeader className="overflow-visible pb-4">
              <CardTitle className="flex items-center gap-4 overflow-visible">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="flex-shrink-0 flex items-center justify-center p-1"
                  style={{ width: '32px', height: '32px', minWidth: '32px' }}
                >
                  <Palette className="w-6 h-6" style={{ color: brandTheme.primary }} />
                </motion.div>
                <span 
                  className="bg-clip-text text-transparent font-bold"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${brandTheme.primary}, ${brandTheme.secondary})`
                  }}
                >
                  Visual Identity
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo */}
              <div>
                <Label>Brand Logo</Label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden relative group">
                    {brandLogo ? (
                      <>
                        <img src={brandLogo} alt="Brand Logo" className="w-full h-full object-contain" />
                        {!isViewMode && (
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button variant="ghost" size="icon" className="text-white" onClick={() => setBrandLogo(null)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <Upload className="w-6 h-6 text-gray-400" />
                    )}
                    {!isViewMode && (
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={(e) => handleFileUpload(e, setBrandLogo)}
                      />
                    )}
                  </div>
                  {!isViewMode && (
                    <div className="text-sm text-gray-500">
                      <p>Recommended: 512x512px</p>
                      <p>PNG or SVG with transparent background</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Colors */}
              <div>
                <Label>Brand Colors</Label>
                <div className="flex flex-wrap gap-3 mt-2">
                  {brandColors.map((color, index) => (
                    <div key={index} className="group relative">
                      {isViewMode ? (
                        <div 
                          className="w-10 h-10 rounded-full border border-gray-200 shadow-sm"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ) : (
                        <Popover>
                          <PopoverTrigger asChild>
                            <div 
                              className="w-10 h-10 rounded-full border border-gray-200 shadow-sm cursor-pointer transition-transform hover:scale-110"
                              style={{ backgroundColor: color }}
                            />
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-3">
                            <HexColorPicker color={color} onChange={(newColor) => updateBrandColor(index, newColor)} />
                            <div className="mt-2 flex items-center gap-2">
                               <span className="text-xs text-gray-500">Hex:</span>
                               <Input 
                                 value={color} 
                                 onChange={(e) => updateBrandColor(index, e.target.value)}
                                 className="h-8 text-xs font-mono"
                               />
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                      {!isViewMode && brandColors.length > 1 && (
                        <button 
                          onClick={() => removeBrandColor(index)}
                          className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3 text-gray-500" />
                        </button>
                      )}
                    </div>
                  ))}
                  {!isViewMode && brandColors.length < 5 && (
                    <button
                      onClick={addBrandColor}
                      className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 hover:border-gray-400 flex items-center justify-center cursor-pointer transition-all hover:scale-110 bg-white/50 backdrop-blur-sm"
                      style={{ 
                        borderColor: `rgba(${brandTheme.primaryRgb}, 0.3)`,
                        backgroundColor: `rgba(${brandTheme.primaryRgb}, 0.05)`
                      }}
                    >
                      <Plus className="w-5 h-5" style={{ color: brandTheme.primary }} />
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardHeader className="overflow-visible pb-4">
              <CardTitle className="flex items-center gap-4 overflow-visible">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex-shrink-0 flex items-center justify-center p-1"
                  style={{ width: '32px', height: '32px', minWidth: '32px' }}
                >
                  <Globe className="w-6 h-6" style={{ color: brandTheme.secondary }} />
                </motion.div>
                <span 
                  className="bg-clip-text text-transparent font-bold"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${brandTheme.secondary}, ${brandTheme.accent})`
                  }}
                >
                  Core Info
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isViewMode ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Brand Name</Label>
                    <div className="text-lg font-medium text-gray-900">{brandName || '-'}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Website URL</Label>
                    <a href={brandUrl} target="_blank" rel="noopener noreferrer" className="text-lg font-medium text-blue-600 hover:underline flex items-center gap-2">
                      {brandUrl || '-'}
                      {brandUrl && <ExternalLink className="w-4 h-4" />}
                    </a>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Industry</Label>
                    <div className="text-lg font-medium text-gray-900">{brandIndustry || '-'}</div>
                  </div>
                </div>
              ) : (
                <>
                  <Input 
                    label="Brand Name" 
                    value={brandName} 
                    onChange={(e) => setBrandName(e.target.value)} 
                    placeholder="e.g. Acme Corp"
                    brandColor={brandTheme.primary}
                  />
                  <div className="space-y-2">
                    <Input 
                      label="Website URL" 
                      value={brandUrl} 
                      onChange={(e) => setBrandUrl(e.target.value)} 
                      placeholder="https://example.com"
                      brandColor={brandTheme.primary}
                    />
                    <Button 
                      onClick={handleAnalyzeBrand}
                      disabled={isScrapingBrand || !brandUrl}
                      className="w-full"
                      style={{
                        background: brandTheme.gradient,
                        color: 'white'
                      }}
                    >
                      {isScrapingBrand ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Analyze Brand
                        </>
                      )}
                    </Button>
                  </div>
                  <Input 
                    label="Industry" 
                    value={brandIndustry} 
                    onChange={(e) => setBrandIndustry(e.target.value)} 
                    placeholder="e.g. SaaS, Fashion, Health"
                    brandColor={brandTheme.primary}
                  />
                </>
              )}
            </CardContent>
          </GlassCard>

          {/* Products Section */}
          <GlassCard>
            <CardHeader className="overflow-visible pb-4">
              <CardTitle className="flex items-center justify-between overflow-visible">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex-shrink-0 flex items-center justify-center p-1"
                    style={{ width: '32px', height: '32px', minWidth: '32px' }}
                  >
                    <ShoppingBag className="w-6 h-6" style={{ color: brandTheme.accent }} />
                  </motion.div>
                  <span 
                    className="bg-clip-text text-transparent font-bold"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${brandTheme.accent}, ${brandTheme.primary})`
                    }}
                  >
                    Products
                  </span>
                </div>
                <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                  {!isViewMode && (
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                  )}
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Product</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Product Name</Label>
                        <Input 
                          value={newProduct.name} 
                          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                          placeholder="e.g. Premium Plan"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Price</Label>
                        <Input 
                          value={newProduct.price} 
                          onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                          placeholder="e.g. $29/mo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input 
                          value={newProduct.description} 
                          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                          placeholder="Short description..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Image URL</Label>
                        <div className="flex gap-2">
                          <Input 
                            value={newProduct.imageUrl} 
                            onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})}
                            placeholder="https://..."
                            className="flex-1"
                          />
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 opacity-0 cursor-pointer w-full"
                              onChange={(e) => handleFileUpload(e, (url) => setNewProduct({...newProduct, imageUrl: url}))}
                            />
                            <Button variant="outline" size="icon">
                              <Upload className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => {
                        if (newProduct.name) {
                          setProducts([...products, newProduct]);
                          setNewProduct({ name: '', price: '', description: '', imageUrl: '' });
                          setIsAddProductOpen(false);
                          toast.success('Product added!');
                        }
                      }}>Add Product</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {products.length > 0 ? (
                <Carousel className="w-full">
                  <CarouselContent>
                    {products.map((product, index) => (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                            <div className="aspect-square bg-gray-100 relative overflow-hidden">
                              {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain p-2" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <ShoppingBag className="w-12 h-12" />
                                </div>
                              )}
                            </div>
                            <div className="p-3 border-t">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <div>
                                  <h5 className="font-medium text-sm line-clamp-1">{product.name}</h5>
                                  {product.price && (
                                    <p className="text-sm font-semibold mt-0.5" style={{ color: brandTheme.secondary }}>{product.price}</p>
                                  )}
                                </div>
                                {!isViewMode && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6 -mt-1 -mr-1 text-gray-400 hover:text-red-500 shrink-0"
                                    onClick={() => setProducts(products.filter((_, i) => i !== index))}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 line-clamp-2 mt-1">{product.description}</p>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <CarouselPrevious className="static translate-y-0" />
                    <CarouselNext className="static translate-y-0" />
                  </div>
                </Carousel>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <ShoppingBag className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No products yet</p>
                </div>
              )}
            </CardContent>
          </GlassCard>
        </div>

        {/* Middle Column: Strategy & Voice */}
        <div className="space-y-6 lg:col-span-2">
          {/* Image Assets Slider */}
          <GlassCard>
            <CardHeader className="overflow-visible pb-4">
              <CardTitle className="flex items-center justify-between overflow-visible">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="flex-shrink-0 flex items-center justify-center p-1"
                    style={{ width: '32px', height: '32px', minWidth: '32px' }}
                  >
                    <ImageIcon className="w-6 h-6" style={{ color: brandTheme.primary }} />
                  </motion.div>
                  <span 
                    className="bg-clip-text text-transparent font-bold"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${brandTheme.primary}, ${brandTheme.accent})`
                    }}
                  >
                    Brand Assets
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {!isViewMode && (
                    <Button variant="outline" size="sm" className="relative">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={(e) => handleFileUpload(e, (url) => setBrandImages([...brandImages, { url, metadata: {} }]))}
                      />
                    </Button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {brandImages.length > 0 ? (
                <Carousel className="w-full max-w-xl mx-auto">
                  <CarouselContent>
                    {brandImages.map((img, index) => (
                      <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                          <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                            <img 
                              src={getDisplayImage(img.url)} 
                              alt={`Brand asset ${index + 1}`} 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="secondary" size="icon" className="h-8 w-8">
                                    <ExternalLink className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl bg-white p-1">
                                  <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                                    <X className="h-6 w-6" />
                                    <span className="sr-only">Close</span>
                                  </DialogClose>
                                  <div className="relative w-full h-[80vh] flex items-center justify-center bg-white rounded-lg overflow-hidden">
                                    <img 
                                      src={getDisplayImage(img.url)} 
                                      alt="Asset Preview" 
                                      className="max-w-full max-h-full object-contain"
                                    />
                                  </div>
                                </DialogContent>
                              </Dialog>
                              {!isViewMode && (
                                <Button 
                                  variant="destructive" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => setBrandImages(brandImages.filter((_, i) => i !== index))}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No brand assets uploaded yet</p>
                </div>
              )}
            </CardContent>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard>
              <CardHeader className="overflow-visible pb-4">
                <CardTitle className="flex items-center gap-4 overflow-visible">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="flex-shrink-0 flex items-center justify-center p-1"
                    style={{ width: '32px', height: '32px', minWidth: '32px' }}
                  >
                    <Target className="w-6 h-6" style={{ color: brandTheme.secondary }} />
                  </motion.div>
                  <span 
                    className="bg-clip-text text-transparent font-bold"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${brandTheme.secondary}, ${brandTheme.primary})`
                    }}
                  >
                    Strategy
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isViewMode ? (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Brand Archetype</Label>
                      <div className="text-lg font-medium text-gray-900">{brandArchetype || '-'}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Tagline</Label>
                      <div className="text-lg font-medium text-gray-900">{brandTagline || '-'}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Mission Statement</Label>
                      <div className="text-gray-800 font-medium whitespace-pre-wrap">{brandMission || '-'}</div>
                    </div>
                  </div>
                ) : (
                  <>
                    <Input 
                      label="Brand Archetype" 
                      value={brandArchetype} 
                      onChange={(e) => setBrandArchetype(e.target.value)} 
                      placeholder="e.g. The Creator, The Hero"
                      brandColor={brandTheme.primary}
                    />
                    <Input 
                      label="Tagline" 
                      value={brandTagline} 
                      onChange={(e) => setBrandTagline(e.target.value)} 
                      placeholder="Your catchy slogan"
                      brandColor={brandTheme.primary}
                    />
                    <div>
                      <Label className="mb-2 block" style={{ color: brandTheme.primary, fontWeight: 600 }}>Mission Statement</Label>
                      <textarea 
                        className="w-full min-h-[100px] p-3 rounded-md border text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-sm transition-all"
                        style={{
                          backgroundColor: `rgba(${brandTheme.primaryRgb}, 0.05)`,
                          borderColor: `rgba(${brandTheme.primaryRgb}, 0.2)`,
                          color: brandTheme.primary
                        }}
                        value={brandMission}
                        onChange={(e) => setBrandMission(e.target.value)}
                        placeholder="What is your brand's mission?"
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </GlassCard>

            <GlassCard>
              <CardHeader className="overflow-visible pb-4">
                <CardTitle className="flex items-center gap-4 overflow-visible">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex-shrink-0 flex items-center justify-center p-1"
                    style={{ width: '32px', height: '32px', minWidth: '32px' }}
                  >
                    <Lightbulb className="w-6 h-6" style={{ color: brandTheme.accent }} />
                  </motion.div>
                  <span 
                    className="bg-clip-text text-transparent font-bold"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${brandTheme.accent}, ${brandTheme.secondary})`
                    }}
                  >
                    Voice & Audience
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isViewMode ? (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Brand Voice</Label>
                      <div className="text-lg font-medium text-gray-900">{brandVoice || '-'}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Target Audience</Label>
                      <div className="text-lg font-medium text-gray-900">{brandAudience || '-'}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Brand Story</Label>
                      <div className="text-gray-800 font-medium whitespace-pre-wrap">{brandStory || '-'}</div>
                    </div>
                  </div>
                ) : (
                  <>
                    <Input 
                      label="Brand Voice" 
                      value={brandVoice} 
                      onChange={(e) => setBrandVoice(e.target.value)} 
                      placeholder="e.g. Professional, Friendly, Witty"
                      brandColor={brandTheme.primary}
                    />
                    <Input 
                      label="Target Audience" 
                      value={brandAudience} 
                      onChange={(e) => setBrandAudience(e.target.value)} 
                      placeholder="e.g. Small Business Owners"
                      brandColor={brandTheme.primary}
                    />
                    <div>
                      <Label className="mb-2 block" style={{ color: brandTheme.primary, fontWeight: 600 }}>Brand Story</Label>
                      <textarea 
                        className="w-full min-h-[100px] p-3 rounded-md border text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-sm transition-all"
                        style={{
                          backgroundColor: `rgba(${brandTheme.primaryRgb}, 0.05)`,
                          borderColor: `rgba(${brandTheme.primaryRgb}, 0.2)`,
                          color: brandTheme.primary
                        }}
                        value={brandStory}
                        onChange={(e) => setBrandStory(e.target.value)}
                        placeholder="Tell your brand's story..."
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </GlassCard>
          </div>

          <GlassCard>
            <CardHeader className="overflow-visible pb-4">
              <CardTitle className="flex items-center gap-4 overflow-visible">
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="flex-shrink-0 flex items-center justify-center p-1"
                  style={{ width: '32px', height: '32px', minWidth: '32px' }}
                >
                  <BrainCircuit className="w-6 h-6" style={{ color: brandTheme.primary }} />
                </motion.div>
                <span 
                  className="bg-clip-text text-transparent font-bold"
                  style={{
                    backgroundImage: brandTheme.gradient
                  }}
                >
                  Deep Analysis
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ListInput 
                label="Unique Selling Points (USPs)" 
                items={brandUsps} 
                setItems={setBrandUsps} 
                placeholder="Add a USP..." 
                icon={Sparkles}
              />
              <ListInput 
                label="Customer Pain Points" 
                items={brandPainPoints} 
                setItems={setBrandPainPoints} 
                placeholder="Add a pain point..." 
                icon={Heart}
              />
              <ListInput 
                label="Customer Desires" 
                items={customerDesires} 
                setItems={setCustomerDesires} 
                placeholder="Add a desire..." 
                icon={Target}
              />
              <ListInput 
                label="Marketing Angles" 
                items={adAngles} 
                setItems={setAdAngles} 
                placeholder="Add an angle..." 
                icon={Tag}
              />
            </CardContent>
          </GlassCard>
        </div>
      </div>

      {/* Delete Data - Bottom Position */}
      {hasSavedData && (
        <div className="mt-12 pb-8 flex justify-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                disabled={isDeleting}
                className="text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete All Brand Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your brand data, including images, products, and analysis. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteBrandData}
                  style={{ background: `linear-gradient(135deg, #DC2626, #991B1B)` }}
                  className="text-white hover:opacity-90"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Everything'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {/* Admin Debug Modal */}
      <Dialog open={isDebugModalOpen} onOpenChange={setIsDebugModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileJson className="w-5 h-5" />
              Template Variables Debug
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto bg-slate-950 text-slate-50 p-4 rounded-md font-mono text-xs">
            <pre>{debugJson}</pre>
          </div>
          <DialogFooter>
            <Button onClick={handleDownloadDebug} className="gap-2">
              <Download className="w-4 h-4" />
              Download JSON
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </motion.div>
    </div>
  );
}
