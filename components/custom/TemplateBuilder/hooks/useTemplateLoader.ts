import { useState, useEffect } from 'react';
import type { CustomTemplate, VisualElement } from '../types';
import { DEMO_TEMPLATES_FALLBACK } from '../data/demoTemplates';
import { extractElementsFromHTMLAsync } from '../utils/extractElements';

export function useTemplateLoader(
  setVisualElements: (elements: VisualElement[]) => void,
  setRawHtmlTemplate: (html: string) => void,
  setRawCssTemplate: (css: string) => void,
  setVariableValues: (values: Record<string, any>) => void,
  setSelectedTemplate: (template: CustomTemplate) => void,
  toast: any
) {
  const [templates, setTemplates] = useState<CustomTemplate[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);

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
          setTemplates(DEMO_TEMPLATES_FALLBACK);
        }
      } else {
        setTemplates(DEMO_TEMPLATES_FALLBACK);
      }
    } catch (error: any) {
      console.error('Failed to load templates:', error);
      setTemplates(DEMO_TEMPLATES_FALLBACK);
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const parseHTMLToVisualElements = async (template: CustomTemplate) => {
    console.log('🔄 parseHTMLToVisualElements called with:', {
      name: template.name,
      hasHTML: !!template.htmlTemplate,
      hasCSS: !!template.cssTemplate,
      hasVariables: !!template.variables,
      variablesType: typeof template.variables,
      variablesKeys: Object.keys(template.variables || {}),
      variablesRaw: JSON.stringify(template.variables, null, 2)
    });

    // Store raw templates for variable substitution
    setRawHtmlTemplate(template.htmlTemplate || '');
    setRawCssTemplate(template.cssTemplate || '');

    // Initialize variable values
    const initialValues: Record<string, any> = {};
    if (template.variables && typeof template.variables === 'object') {
      Object.entries(template.variables).forEach(([key, value]) => {
        // Handle different variable structures
        if (typeof value === 'object' && value !== null) {
          // Structure: { type: 'text', label: 'Label', default: 'Value' }
          const def = (value as any).default;
          initialValues[key] = (def !== undefined && def !== null) ? String(def) : '';
        } else {
          // Direct value: 'Value'
          initialValues[key] = (value !== undefined && value !== null) ? String(value) : '';
        }
        console.log(`📌 Variable ${key}:`, initialValues[key]);
      });
    }
    
    console.log('📦 All initial variable values:', initialValues);
    setVariableValues(initialValues);

    // Apply variables to HTML/CSS
    let processedHTML = template.htmlTemplate || '';
    let processedCSS = template.cssTemplate || '';
    
    console.log('📋 BEFORE replacement - HTML preview:', processedHTML.substring(0, 300));
    
    // Apply variables if they exist
    if (template.variables && typeof template.variables === 'object') {
      console.log('📝 Applying variables:', Object.keys(template.variables));
      Object.entries(template.variables).forEach(([key, value]) => {
        const varPattern = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        
        // Get default value from variable structure
        let defaultValue;
        if (typeof value === 'object' && value !== null) {
          const def = (value as any).default;
          defaultValue = (def !== undefined && def !== null) ? String(def) : '';
        } else {
          defaultValue = (value !== undefined && value !== null) ? String(value) : '';
        }
        
        const beforeHTML = processedHTML.includes(`{{${key}}}`);
        const beforeCSS = processedCSS.includes(`{{${key}}}`);
        
        console.log(`  🔍 Looking for {{${key}}} (value: "${defaultValue}") - HTML: ${beforeHTML}, CSS: ${beforeCSS}`);
        
        processedHTML = processedHTML.replace(varPattern, String(defaultValue || ''));
        processedCSS = processedCSS.replace(varPattern, String(defaultValue || ''));
        
        if (beforeHTML || beforeCSS) {
          console.log(`  ✅ Replaced {{${key}}} with: "${defaultValue}"`);
        }
      });
      
      // Check if any placeholders remain and clean them up
      const remainingPlaceholders = processedHTML.match(/\{\{[^}]+\}\}/g);
      if (remainingPlaceholders) {
        console.warn('⚠️ Remaining placeholders found and removed:', remainingPlaceholders);
        processedHTML = processedHTML.replace(/\{\{[^}]+\}\}/g, '');
        processedCSS = processedCSS.replace(/\{\{[^}]+\}\}/g, '');
      } else {
        console.log('✅ All placeholders replaced successfully');
      }
    }

    console.log('✨ Processed result:', {
      htmlLength: processedHTML.length,
      cssLength: processedCSS.length,
      htmlPreview: processedHTML.substring(0, 300) + '...',
      cssPreview: processedCSS.substring(0, 200) + '...'
    });

    // Update template with processed HTML/CSS
    setSelectedTemplate({
      ...template,
      width: template.width || 1080,
      height: template.height || 1080,
      htmlTemplate: processedHTML,
      cssTemplate: processedCSS
    });

    // Extract visual elements from the processed HTML/CSS for interactive editing
    console.log('🎨 Extracting visual elements for interactive editing...');
    const elements = await extractElementsFromHTMLAsync(
      processedHTML,
      processedCSS,
      template.width || 1080,
      template.height || 1080
    );
    
    console.log(`✅ Extracted ${elements.length} interactive elements`);
    setVisualElements(elements);
    
    toast({
      title: '✅ Template loaded successfully',
      description: `${elements.length} interactive elements ready to edit`,
    });
  };

  const loadTemplate = async (templateId: string) => {
    try {
      const demoTemplate = DEMO_TEMPLATES_FALLBACK.find(t => t.id === templateId);
      if (demoTemplate) {
        parseHTMLToVisualElements(demoTemplate);
        return;
      }

      const response = await fetch(`/api/admin/custom-templates/${templateId}`);
      if (response.ok) {
        const loadedTemplate = await response.json();
        parseHTMLToVisualElements(loadedTemplate);
      } else {
        throw new Error('Failed to load template');
      }
    } catch (error: any) {
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
