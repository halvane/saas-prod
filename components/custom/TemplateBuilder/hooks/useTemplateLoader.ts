import { useState, useEffect } from 'react';
import type { CustomTemplate, VisualElement } from '../types';
import { DEMO_TEMPLATES_FALLBACK } from '../data/demoTemplates';
import { FULL_DEMO_TEMPLATES } from '@/lib/builder/fullTemplates';
import { extractElementsFromHTMLAsync } from '../utils/extractElements';
import { getTemplateWithMatrixAction } from '@/app/(dashboard)/templates/actions';

export function useTemplateLoader(
  setVisualElements: (elements: VisualElement[]) => void,
  setRawHtmlTemplate: (html: string) => void,
  setRawCssTemplate: (css: string) => void,
  setVariableValues: (values: Record<string, any>) => void,
  setSelectedTemplate: (template: CustomTemplate) => void,
  toast: any,
  brandSettings?: any,
  setIsExtracting?: (isExtracting: boolean) => void
) {
  const [templates, setTemplates] = useState<CustomTemplate[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);

  // Helper to fetch stock images
  const fetchStockImage = async (keyword: string): Promise<string | null> => {
    try {
      const response = await fetch(`/api/stock?q=${encodeURIComponent(keyword)}&provider=pixabay&per_page=3`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          // Return a random image from the top 3 results to add variety
          const randomIndex = Math.floor(Math.random() * Math.min(data.length, 3));
          return data[randomIndex].src.large || data[randomIndex].src.medium;
        }
      }
    } catch (error) {
      console.error('Failed to fetch stock image:', error);
    }
    return null;
  };

  const loadTemplates = async () => {
    setIsLoadingTemplates(true);
    try {
      // Use fetch instead of api.get
      const response = await fetch('/api/admin/custom-templates');
      if (response.ok) {
        const data = await response.json();
        if (data.templates && data.templates.length > 0) {
          setTemplates(data.templates);
        } else {
          setTemplates([...FULL_DEMO_TEMPLATES, ...DEMO_TEMPLATES_FALLBACK]);
        }
      } else {
        setTemplates([...FULL_DEMO_TEMPLATES, ...DEMO_TEMPLATES_FALLBACK]);
      }
    } catch (error: any) {
      console.error('Failed to load templates:', error);
      setTemplates([...FULL_DEMO_TEMPLATES, ...DEMO_TEMPLATES_FALLBACK]);
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const parseHTMLToVisualElements = async (template: CustomTemplate) => {

    // Store raw templates for variable substitution
    setRawHtmlTemplate(template.htmlTemplate || '');
    setRawCssTemplate(template.cssTemplate || '');

    // Initialize variable values
    const initialValues: Record<string, any> = {};
    
    // Ensure template.variables exists and is an object
    const templateVars = template.variables && typeof template.variables === 'object' 
      ? template.variables 
      : {};
    
    if (Object.keys(templateVars).length > 0) {
      const variableEntries = Object.entries(templateVars);
      
      // Process variables in parallel to fetch stock images if needed
      await Promise.all(variableEntries.map(async ([key, value]) => {
        // 1. Get default value from template definition
        let val = '';
        if (typeof value === 'object' && value !== null) {
          const def = (value as any).default;
          val = (def !== undefined && def !== null) ? String(def) : '';
        } else {
          val = (value !== undefined && value !== null) ? String(value) : '';
        }
        
        // Skip if still empty after template defaults
        if (!val) {
          console.warn(`⚠️ Variable ${key} has no default value, will keep placeholder`);
        }

        // 2. Smart Population from Brand Settings
        if (brandSettings) {
          const lowerKey = key.toLowerCase();
          
          // Text Variables
          if (lowerKey === 'brand_name' || lowerKey === 'brandname') {
            if (brandSettings.brandName) val = brandSettings.brandName;
          } else if (lowerKey === 'tagline' || lowerKey === 'brand_tagline') {
            if (brandSettings.brandTagline) val = brandSettings.brandTagline;
          } else if (lowerKey === 'website' || lowerKey === 'url') {
            if (brandSettings.brandUrl) val = brandSettings.brandUrl;
          } else if (lowerKey.includes('product_name') || lowerKey.includes('productname')) {
            if (brandSettings.products && brandSettings.products.length > 0) {
              val = brandSettings.products[0].name;
            }
          } else if (lowerKey === 'price') {
            if (brandSettings.products && brandSettings.products.length > 0 && brandSettings.products[0].price) {
              val = brandSettings.products[0].price;
            }
          }
          
          // Image Variables
          else if (lowerKey.includes('image') || lowerKey.includes('photo') || lowerKey.includes('bg') || lowerKey.includes('background')) {
            let imageFound = false;

            // A. Try Brand Logo
            if (lowerKey.includes('logo') && brandSettings.brandLogo) {
              val = brandSettings.brandLogo;
              imageFound = true;
            }
            
            // B. Try Product Image
            if (!imageFound && lowerKey.includes('product') && brandSettings.products && brandSettings.products.length > 0) {
              const p = brandSettings.products[0];
              const pUrl = typeof p.imageUrl === 'string' ? p.imageUrl : (p.imageUrl as any)?.url;
              if (pUrl) {
                val = pUrl;
                imageFound = true;
              }
            }

            // C. Try Brand Images
            if (!imageFound && brandSettings.brandImages && brandSettings.brandImages.length > 0) {
              // Pick a random image from brand images to add variety, or sequential based on key hash?
              // For now, just pick the first one or random
              const imgs = brandSettings.brandImages;
              const img = imgs[Math.floor(Math.random() * imgs.length)];
              const url = typeof img === 'string' ? img : (img as any)?.url;
              if (url) {
                val = url;
                imageFound = true;
              }
            }

            // D. Fallback to Stock Images (Pixabay/Unsplash)
            if (!imageFound) {
              // Determine keyword
              let keyword = 'business'; // Default
              if (brandSettings.brandIndustry) keyword = brandSettings.brandIndustry;
              if (lowerKey.includes('host')) keyword = 'portrait professional';
              if (lowerKey.includes('guest')) keyword = 'portrait business';
              if (lowerKey.includes('product')) keyword = 'product packaging';
              if (lowerKey.includes('food')) keyword = 'food';
              if (lowerKey.includes('tech')) keyword = 'technology';
              
              const stockUrl = await fetchStockImage(keyword);
              if (stockUrl) {
                val = stockUrl;
                imageFound = true;
              } else {
                // Ultimate fallback if API fails
                val = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80';
                imageFound = true;
              }
            }
          }
        }

        initialValues[key] = val;
      }));
    }
    
    setVariableValues(initialValues);

    // Apply variables to HTML/CSS
    let processedHTML = template.htmlTemplate || '';
    let processedCSS = template.cssTemplate || '';
    
    // CRITICAL: Use initialValues (brand settings + defaults) for replacement, NOT template.variables
    // This ensures brand customization is applied to the visual preview
    if (Object.keys(initialValues).length > 0) {
      Object.entries(initialValues).forEach(([key, value]) => {
        // Skip CSS variables (they use -- prefix, not {{ }} syntax)
        if (key.startsWith('--')) {
          return;
        }
        
        const varPattern = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        
        // Use the computed value from initialValues (includes brand settings)
        const replacementValue = (value !== undefined && value !== null && value !== '') 
          ? String(value) 
          : `{{${key}}}`; // Keep placeholder if no value
        
        // CRITICAL: Escape special characters in replacement value to prevent breaking CSS
        // This is especially important for URLs and gradients
        const safeReplacementValue = replacementValue.replace(/\\/g, '\\\\');
        
        processedHTML = processedHTML.replace(varPattern, safeReplacementValue);
        processedCSS = processedCSS.replace(varPattern, safeReplacementValue);
      });
      
      // Check if any placeholders remain
      // DO NOT REMOVE THEM! If we remove them, the src becomes empty string ""
      // Keep them for the extractor to see
    }

    // Update template with processed HTML/CSS
    setSelectedTemplate({
      ...template,
      width: template.width || 1080,
      height: template.height || 1080,
      htmlTemplate: processedHTML,
      cssTemplate: processedCSS
    });

    // NEW LOGIC: Check if template already has JSON elements
    if ((template as any).elements && Array.isArray((template as any).elements) && (template as any).elements.length > 0) {
      setVisualElements((template as any).elements);
      toast({
        title: '✅ Template loaded instantly',
        description: 'Loaded from high-performance JSON format',
      });
      return;
    }

    // FALLBACK: Extract visual elements from the processed HTML/CSS for interactive editing
    
    // Set extraction state to show loader
    if (setIsExtracting) setIsExtracting(true);
    
    const elements = await extractElementsFromHTMLAsync(
      processedHTML,
      processedCSS,
      template.width || 1080,
      template.height || 1080
    );
    
    setVisualElements(elements);
    
    // Clear extraction state
    if (setIsExtracting) setIsExtracting(false);
    
    toast({
      title: '✅ Template loaded successfully',
      description: `${elements.length} interactive elements ready to edit`,
    });
  };

  const loadTemplate = async (templateId: string) => {
    try {
      // Check in full demo templates first
      const fullDemoTemplate = FULL_DEMO_TEMPLATES.find(t => t.id === templateId);
      if (fullDemoTemplate) {
        parseHTMLToVisualElements(fullDemoTemplate);
        return;
      }

      // Check in fallback demo templates
      const demoTemplate = DEMO_TEMPLATES_FALLBACK.find(t => t.id === templateId);
      if (demoTemplate) {
        parseHTMLToVisualElements(demoTemplate);
        return;
      }

      // Use server action to get template with matrix data populated
      const loadedTemplate = await getTemplateWithMatrixAction(templateId);
      
      if (loadedTemplate) {
        // Cast to any because the type definition might not match exactly what we return (mappedVariables)
        parseHTMLToVisualElements(loadedTemplate as any);
      } else {
        throw new Error('Failed to load template');
      }
    } catch (error: any) {
      console.error('Error loading template:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de charger le template',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  return {
    templates,
    isLoadingTemplates,
    loadTemplate,
    parseHTMLToVisualElements,
  };
}
