'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserTemplatesAction } from './actions';
import { mergeTemplate } from '@/lib/templates/renderer';
import { Loader2, RefreshCw, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function TemplatePreview({ template, brand }: { template: any, brand: any }) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    if (template && brand && template.htmlTemplate) {
      console.log(`[TemplatePreview] Rendering ${template.name}`);
      console.log(`[TemplatePreview] Mapped Variables:`, template.mappedVariables);
      console.log(`[TemplatePreview] Original Variables:`, template.variables);
      
      // Prefer mappedVariables if available
      const activeVariables = template.mappedVariables || template.variables || {};

      const { html: mergedHtml, css: mergedCss } = mergeTemplate({
        html: template.htmlTemplate,
        css: template.cssTemplate,
        variables: activeVariables, 
        brandSettings: brand,
      });
      
      console.log(`[TemplatePreview] Merged HTML (first 200 chars):`, mergedHtml.substring(0, 200));

      const fullHtml = `
        <html>
          <head>
            <style>
              body { margin: 0; overflow: hidden; display: flex; align-items: center; justify-content: center; height: 100vh; background: transparent; }
              ${mergedCss}
            </style>
          </head>
          <body>${mergedHtml}</body>
        </html>
      `;
      setHtml(fullHtml);
    }
  }, [template, brand]);

  if (!template.htmlTemplate) {
    if (template.previewUrl) {
      return (
        <div className="w-full aspect-square bg-muted/20 rounded-md overflow-hidden border relative">
          <img 
            src={template.previewUrl} 
            alt={template.name} 
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
    return (
      <div className="w-full aspect-square bg-muted/20 rounded-md flex items-center justify-center border">
        <span className="text-muted-foreground text-xs">No Preview</span>
      </div>
    );
  }

  return (
    <div className="w-full aspect-square bg-muted/20 rounded-md overflow-hidden border relative">
      <iframe
        srcDoc={html}
        className="w-full h-full border-0 pointer-events-none scale-[0.5] origin-top-left w-[200%] h-[200%]"
        title={`Preview ${template.name}`}
        sandbox="allow-scripts"
      />
    </div>
  );
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [brand, setBrand] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      console.log('[TemplatesPage] Loading templates...');
      // Pass timestamp to bust cache
      const { templates: fetchedTemplates, brand: fetchedBrand } = await getUserTemplatesAction(Date.now());
      console.log('[TemplatesPage] Received templates:', fetchedTemplates.length);
      if (fetchedTemplates.length > 0) {
          console.log('[TemplatesPage] First template variables:', fetchedTemplates[0].variables);
      }
      setTemplates(fetchedTemplates);
      setBrand(fetchedBrand);
    } catch (error) {
      console.error('[TemplatesPage] Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Your Brand Templates</h1>
            <p className="text-muted-foreground">
              AI-generated templates tailored to {brand?.brandName || 'your brand'}.
            </p>
          </div>
          <Button variant="outline" onClick={loadTemplates} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button asChild>
            <Link href="/template-builder">
              <Plus className="mr-2 h-4 w-4" />
              Create New
            </Link>
          </Button>
        </div>
      </div>

      {loading && templates.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-lg leading-tight">{template.name}</CardTitle>
                  {template.isPersonalized && (
                    <Badge variant="secondary" className="text-[10px] h-5">AI Generated</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2 space-y-4">
                <TemplatePreview template={template} brand={brand} />
                
                <div className="flex flex-wrap gap-1">
                  {template.semanticTags?.slice(0, 3).map((tag: string) => (
                    <span key={tag} className="px-1.5 py-0.5 bg-secondary/50 text-secondary-foreground rounded text-[10px]">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1" size="sm" variant="default">
                    Use Template
                  </Button>
                  <Button className="flex-1" size="sm" variant="outline" asChild>
                    <Link href={`/template-builder/${template.id}`}>
                      Edit
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {!loading && templates.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No active templates found. Ask your admin to enable some templates.</p>
        </div>
      )}
    </div>
  );
}
