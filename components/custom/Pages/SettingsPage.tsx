'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { Settings, Palette, Globe, Bell, Shield, Zap, Share2, Instagram, Facebook, Linkedin, Twitter, Youtube, ShoppingBag, CheckCircle, ExternalLink, Upload, Plus, X, ChevronDown, ChevronUp, Loader2, Target, Lightbulb, Heart, ShoppingCart, Tag, BrainCircuit, Sparkles } from 'lucide-react';
import { connectSocialMedia, getConnectedAccounts, getShopifyStatus, getBrandSettings, saveBrandSettings } from '@/app/(dashboard)/settings/actions';
import { AIProcessingLoader } from '@/components/custom/AI/AIProcessingLoader';
import { toast } from 'sonner';

export function SettingsPage() {
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [connectedAccounts, setConnectedAccounts] = React.useState<any[]>([]);
  const [shopifyShop, setShopifyShop] = React.useState('');
  const [shopifyStatus, setShopifyStatus] = React.useState<{ shopUrl: string } | null>(null);
  const [brandColors, setBrandColors] = React.useState<string[]>(['#8B5CF6', '#EC4899', '#10B981']);
  const [brandDnaExpanded, setBrandDnaExpanded] = React.useState(false);
  const [brandUrl, setBrandUrl] = React.useState('');
  const [isScrapingBrand, setIsScrapingBrand] = React.useState(false);
  const [scrapingProgress, setScrapingProgress] = React.useState(0);
  const [scrapingStep, setScrapingStep] = React.useState(0);

  const scrapingSteps = [
    'Analyzing website content...',
    'Extracting brand information...',
    'Analyzing visual elements...',
    'Generating strategic insights...',
    'Finalizing brand analysis...'
  ];
  
  // Brand DNA fields
  const [brandName, setBrandName] = React.useState('');
  const [brandLogo, setBrandLogo] = React.useState<string | null>(null);
  const [brandVoice, setBrandVoice] = React.useState('');
  const [brandAudience, setBrandAudience] = React.useState('');
  const [brandIndustry, setBrandIndustry] = React.useState('');
  const [brandValues, setBrandValues] = React.useState('');
  const [brandStory, setBrandStory] = React.useState('');
  const [brandImages, setBrandImages] = React.useState<string[]>([]);

  // Deep Brand Analysis Fields
  const [brandArchetype, setBrandArchetype] = React.useState('');
  const [brandTagline, setBrandTagline] = React.useState('');
  const [brandMission, setBrandMission] = React.useState('');
  const [brandUsps, setBrandUsps] = React.useState<string[]>([]);
  const [brandPainPoints, setBrandPainPoints] = React.useState<string[]>([]);
  const [customerDesires, setCustomerDesires] = React.useState<string[]>([]);
  const [adAngles, setAdAngles] = React.useState<string[]>([]);
  const [products, setProducts] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const [accounts, shopify, brandSettings] = await Promise.all([
        getConnectedAccounts(),
        getShopifyStatus(),
        getBrandSettings()
      ]);
      setConnectedAccounts(accounts);
      setShopifyStatus(shopify);

      if (brandSettings) {
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
        setBrandImages(brandSettings.brandImages || []);
        
        // Load deep brand data
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
  }, []);

  const handleConnectSocial = async () => {
    setIsConnecting(true);
    try {
      const url = await connectSocialMedia();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      toast.error('Failed to connect social media');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnectShopify = () => {
    if (!shopifyShop) {
      toast.error('Please enter your Shopify store URL');
      return;
    }
    
    // Clean up shop URL
    let shop = shopifyShop.replace('https://', '').replace('http://', '').replace(/\/$/, '');
    if (!shop.includes('.myshopify.com')) {
      shop += '.myshopify.com';
    }

    window.location.href = `/api/shopify/auth?shop=${shop}`;
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

  const handleSaveBrandDNA = async () => {
    try {
      await saveBrandSettings({
        brandName,
        brandUrl,
        brandLogo,
        brandColors,
        brandVoice,
        brandAudience,
        brandIndustry,
        brandValues,
        brandStory,
        brandImages,
        brandArchetype,
        brandTagline,
        brandMission,
        brandUsps,
        brandPainPoints,
        customerDesires,
        adAngles,
        products
      });
      toast.success('✨ Brand DNA saved successfully!');
    } catch (error) {
      console.error('Failed to save brand DNA:', error);
      toast.error('Failed to save Brand DNA');
    }
  };

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('instagram')) return <Instagram className="w-4 h-4 text-pink-600" />;
    if (p.includes('facebook')) return <Facebook className="w-4 h-4 text-blue-600" />;
    if (p.includes('linkedin')) return <Linkedin className="w-4 h-4 text-blue-700" />;
    if (p.includes('twitter') || p.includes('x')) return <Twitter className="w-4 h-4 text-black" />;
    if (p.includes('youtube')) return <Youtube className="w-4 h-4 text-red-600" />;
    return <Globe className="w-4 h-4 text-gray-600" />;
  };

  // Helper for list inputs
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
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Icon className="w-4 h-4 text-purple-500" />
          {label}
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            placeholder={placeholder}
            className="flex-1"
          />
          <Button onClick={add} size="sm" variant="outline">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <div key={i} className="bg-purple-50 text-purple-700 px-3 py-2 rounded-lg text-sm flex items-start justify-between gap-2 border border-purple-100">
              <span className="whitespace-pre-wrap">{item}</span>
              <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="hover:text-purple-900 mt-0.5 flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* AI Processing Loader */}
      <AIProcessingLoader
        isOpen={isScrapingBrand}
        title="⚡ AI is Analyzing Your Brand..."
        subtitle={`Analyzing "${brandUrl}"`}
        steps={scrapingSteps}
        currentStep={scrapingStep}
        progress={scrapingProgress}
        icon={<Sparkles className="w-12 h-12 text-[#8B5CF6] animate-spin" />}
      />

      {/* Header */}
      <div>
        <h2 className="gradient-text mb-2">Settings</h2>
        <p className="text-[#6B7280]">Configure your application preferences</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#8B5CF6]" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              label="Workspace Name"
              defaultValue="Sarah's Creative Studio"
            />
            <Select
              label="Default Language"
              options={[
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Spanish' },
                { value: 'fr', label: 'French' },
                { value: 'de', label: 'German' }
              ]}
            />
            <Select
              label="Timezone"
              options={[
                { value: 'pst', label: 'Pacific Time (PST)' },
                { value: 'est', label: 'Eastern Time (EST)' },
                { value: 'utc', label: 'UTC' }
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Media Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#EC4899]" />
            Social Media Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Connect your social media accounts to enable auto-posting.
            </p>
            
            {connectedAccounts.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-4">
                {connectedAccounts.map((account) => (
                  <div 
                    key={account.platform} 
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    {getPlatformIcon(account.platform)}
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-900 capitalize">{account.platform}</span>
                      <span className="text-[10px] text-gray-500">{account.username}</span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-500 ml-2" />
                  </div>
                ))}
              </div>
            )}

            <Button 
              onClick={handleConnectSocial} 
              disabled={isConnecting}
              className="bg-gradient-to-r from-pink-500 to-violet-500 text-white"
            >
              {isConnecting ? 'Connecting...' : 'Connect Accounts'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Blog & E-commerce Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#10B981]" />
            Blog & E-commerce
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Connect your Shopify store to sync products and blogs.
            </p>
            
            {shopifyStatus ? (
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-full shadow-sm">
                    <ShoppingBag className="w-5 h-5 text-[#95BF47]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Connected to Shopify</h4>
                    <p className="text-xs text-gray-500">{shopifyStatus.shopUrl}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    Active
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input 
                  placeholder="your-store.myshopify.com" 
                  value={shopifyShop}
                  onChange={(e) => setShopifyShop(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleConnectShopify}
                  className="bg-[#95BF47] hover:bg-[#82A83B] text-white"
                >
                  Connect Shopify
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Brand Settings */}
      <Card>
        <div 
          className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors select-none"
          onClick={() => setBrandDnaExpanded(!brandDnaExpanded)}
        >
          <div className="flex items-center gap-3 flex-1">
            <Palette className="w-5 h-5 text-[#8B5CF6]" />
            <div>
              <h3 className="font-semibold text-gray-900">Brand DNA & Intelligence</h3>
              <p className="text-sm text-gray-500 mt-1">
                Define your brand identity, products, and strategic positioning
              </p>
            </div>
          </div>
          {brandDnaExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
          )}
        </div>
        
        {brandDnaExpanded && (
          <CardContent>
            <div className="space-y-8">
              {/* URL Scraper */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200 shadow-sm">
                <label className="block text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-purple-600" />
                  AI Brand Analysis
                </label>
                <p className="text-sm text-gray-600 mb-4">
                  Enter your website URL to automatically extract brand identity, products, and generate strategic marketing angles using AI.
                </p>
                <div className="flex gap-3">
                  <Input
                    placeholder="https://example.com"
                    value={brandUrl}
                    onChange={(e) => setBrandUrl(e.target.value)}
                    className="flex-1 h-11"
                    disabled={isScrapingBrand}
                  />
                  <Button
                    onClick={async () => {
                      if (!brandUrl) {
                        toast.error('Please enter a website URL');
                        return;
                      }
                      setIsScrapingBrand(true);
                      setScrapingProgress(5);
                      setScrapingStep(0);

                      // Simulate progress updates
                      const progressInterval = setInterval(() => {
                        setScrapingProgress((prev) => {
                          if (prev >= 95) {
                            clearInterval(progressInterval);
                            return prev;
                          }
                          const increment = Math.random() * 20 + 5;
                          const newProgress = Math.min(prev + increment, 95);
                          
                          // Update step based on progress
                          const stepIndex = Math.floor((newProgress / 100) * scrapingSteps.length);
                          setScrapingStep(Math.min(stepIndex, scrapingSteps.length - 1));
                          
                          return newProgress;
                        });
                      }, 400);

                      try {
                        const response = await fetch('/api/brand/scrape', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ url: brandUrl })
                        });
                        
                        if (!response.ok) {
                          const error = await response.json();
                          throw new Error(error.error || 'Failed to scrape website');
                        }
                        
                        const data = await response.json();
                        
                        console.log('[Brand Analysis] Received data from API:', {
                          name: data.name,
                          logo: !!data.logo,
                          colors: data.colors?.length,
                          images: data.images?.length,
                          tone: !!data.tone,
                          audience: !!data.audience,
                          industry: !!data.industry,
                          story: !!data.story,
                          mission: !!data.mission,
                          usps: data.usps?.length,
                          painPoints: data.painPoints?.length,
                          adAngles: data.adAngles?.length,
                          allKeys: Object.keys(data)
                        });
                        
                        // Mark as complete
                        setScrapingProgress(100);
                        setScrapingStep(scrapingSteps.length - 1);
                        clearInterval(progressInterval);
                        
                        // Populate ALL brand data fields
                        if (data.colors?.length > 0) setBrandColors(data.colors.slice(0, 5));
                        if (data.name) setBrandName(data.name);
                        if (data.logo) setBrandLogo(data.logo);
                        if (data.tone) setBrandVoice(data.tone);
                        if (data.audience) setBrandAudience(data.audience);
                        if (data.industry) setBrandIndustry(data.industry);
                        if (data.values) setBrandValues(data.values);
                        if (data.story) setBrandStory(data.story);
                        if (data.images?.length > 0) setBrandImages(data.images.slice(0, 10));
                        
                        // Deep data
                        if (data.archetype) setBrandArchetype(data.archetype);
                        if (data.tagline) setBrandTagline(data.tagline);
                        if (data.mission) setBrandMission(data.mission);
                        if (data.usps) setBrandUsps(data.usps);
                        if (data.painPoints) setBrandPainPoints(data.painPoints);
                        if (data.customerDesires) setCustomerDesires(data.customerDesires);
                        if (data.adAngles) setAdAngles(data.adAngles);
                        if (data.products) setProducts(data.products);
                        
                        console.log('[Brand Analysis] State updated. Check fields below.');
                        
                        setTimeout(() => {
                          toast.success('🎉 Brand analysis complete!');
                          setIsScrapingBrand(false);
                        }, 500);
                      } catch (error: any) {
                        clearInterval(progressInterval);
                        setIsScrapingBrand(false);
                        toast.error(error.message || 'Failed to import brand data');
                        console.error('Brand scraping error:', error);
                      }
                    }}
                    disabled={isScrapingBrand || !brandUrl}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white h-11 px-6"
                  >
                    {isScrapingBrand ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4 mr-2" />
                        Analyze Brand
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Identity */}
                <div className="space-y-6">
                  <h4 className="font-medium text-gray-900 border-b pb-2">Brand Identity</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name</label>
                    <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                    <Input value={brandTagline} onChange={(e) => setBrandTagline(e.target.value)} placeholder="e.g. Just Do It" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand Archetype</label>
                    <Input value={brandArchetype} onChange={(e) => setBrandArchetype(e.target.value)} placeholder="e.g. The Hero, The Creator" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand Colors</label>
                    <div className="space-y-2">
                      {brandColors.map((color, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="relative">
                            <input
                              type="color"
                              value={color}
                              onChange={(e) => updateBrandColor(index, e.target.value)}
                              className="w-10 h-10 rounded-lg border-2 border-gray-200 cursor-pointer"
                            />
                          </div>
                          <Input
                            value={color}
                            onChange={(e) => updateBrandColor(index, e.target.value)}
                            className="flex-1 font-mono h-10"
                          />
                          {brandColors.length > 1 && (
                            <Button variant="ghost" size="sm" onClick={() => removeBrandColor(index)}>
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      {brandColors.length < 5 && (
                        <Button variant="outline" size="sm" onClick={addBrandColor} className="w-full border-dashed">
                          <Plus className="w-4 h-4 mr-2" /> Add Color
                        </Button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand Logo</label>
                    {brandLogo ? (
                      <div className="relative bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <img src={brandLogo} alt="Brand logo" className="h-24 object-contain mx-auto mb-2" />
                        <Button size="sm" variant="outline" onClick={() => setBrandLogo(null)} className="w-full">Change Logo</Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">Upload Logo</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Strategy */}
                <div className="space-y-6">
                  <h4 className="font-medium text-gray-900 border-b pb-2">Strategic Positioning</h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mission Statement</label>
                    <textarea
                      value={brandMission}
                      onChange={(e) => setBrandMission(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      rows={3}
                      placeholder="What is your brand's core mission?"
                    />
                  </div>

                  <ListInput 
                    items={brandUsps} 
                    setItems={setBrandUsps} 
                    placeholder="Add a USP..." 
                    label="Unique Selling Points (USPs)"
                    icon={Target}
                  />

                  <ListInput 
                    items={brandPainPoints} 
                    setItems={setBrandPainPoints} 
                    placeholder="Add a pain point..." 
                    label="Customer Pain Points"
                    icon={Heart}
                  />

                  <ListInput 
                    items={adAngles} 
                    setItems={setAdAngles} 
                    placeholder="Add an angle..." 
                    label="Marketing Angles"
                    icon={Lightbulb}
                  />
                </div>
              </div>

              {/* Products Section */}
              {products.length > 0 && (
                <div className="pt-6 border-t">
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-purple-600" />
                    Identified Products ({products.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product, i) => (
                      <div key={i} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col">
                        <div className="aspect-video bg-gray-100 relative">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <ShoppingBag className="w-8 h-8" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {product.price || 'N/A'}
                          </div>
                        </div>
                        <div className="p-3 flex-1 flex flex-col">
                          <h5 className="font-medium text-sm line-clamp-1 mb-1">{product.name}</h5>
                          <p className="text-xs text-gray-500 line-clamp-2 mb-2 flex-1">{product.description}</p>
                          <a 
                            href={product.productUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-purple-600 hover:underline flex items-center gap-1 mt-auto"
                          >
                            View Product <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Brand Images */}
              {brandImages.length > 0 && (
                <div className="pt-6 border-t">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📸 Brand Assets
                  </label>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
                    {brandImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative group rounded-lg overflow-hidden bg-gray-100 aspect-square border border-gray-200"
                      >
                        <img
                          src={image}
                          alt={`Brand image ${index + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setBrandImages(brandImages.filter((_, i) => i !== index))}
                            className="opacity-0 group-hover:opacity-100 text-white bg-red-600 hover:bg-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="pt-4 border-t">
                <Button 
                  onClick={handleSaveBrandDNA}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-shadow h-12 text-lg"
                >
                  Save Brand DNA & Intelligence
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* AI Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#8B5CF6]" />
            AI Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select
              label="AI Model"
              options={[
                { value: 'gpt4', label: 'GPT-4 (Recommended)' },
                { value: 'gpt35', label: 'GPT-3.5 (Faster)' },
                { value: 'custom', label: 'Custom Model' }
              ]}
            />
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">
                Content Safety
              </label>
              <div className="space-y-2">
                {[
                  { id: 'moderation', label: 'Enable content moderation', enabled: true },
                  { id: 'nsfw', label: 'Filter NSFW content', enabled: true },
                  { id: 'controversial', label: 'Warn about controversial topics', enabled: false }
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 hover:bg-[#F9FAFB] rounded-lg transition-colors">
                    <span className="text-sm text-[#1F2937]">{item.label}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={item.enabled} />
                      <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#8B5CF6]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#E5E7EB] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B5CF6]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button variant="primary" size="large">
          Save All Settings
        </Button>
      </div>
    </div>
  );
}
