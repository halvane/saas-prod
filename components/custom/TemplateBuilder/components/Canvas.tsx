import { useEffect, useState } from 'react';
import { BRIDGE_SCRIPT } from '@/lib/builder/bridge';
import { mergeTemplate } from '@/lib/templates/renderer';
import { TEMPLATE_ENGINE_CSS } from '@/lib/templates/styles';
import type { CustomTemplate } from '../types';

interface CanvasProps {
  selectedTemplate: CustomTemplate;
  variableValues: Record<string, any>;
  zoom: number;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  onElementSelected: (data: any) => void;
  onSelectionCleared: () => void;
  selectedElementId: string | null;
  brandSettings?: any;
}

export function Canvas({
  selectedTemplate,
  variableValues,
  zoom,
  iframeRef,
  onElementSelected,
  onSelectionCleared,
  selectedElementId,
  brandSettings
}: CanvasProps) {
  const [selectedRect, setSelectedRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  // Generate HTML
  const { html, css } = mergeTemplate({
    html: selectedTemplate.htmlTemplate || '',
    css: selectedTemplate.cssTemplate || '',
    variables: variableValues,
    brandSettings: brandSettings || {}
  });

  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@400;700&family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          ${TEMPLATE_ENGINE_CSS}
          ${css}
          html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
          .template-root { width: 100%; height: 100%; }
          body { font-family: 'Inter', sans-serif; }
        </style>
        <script>
          ${BRIDGE_SCRIPT}
        </script>
      </head>
      <body>
        <div class="template-root">
          ${html}
        </div>
      </body>
    </html>
  `;

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'ELEMENT_SELECTED') {
        const { id, rect } = event.data.payload;
        setSelectedRect(rect);
        onElementSelected(event.data.payload);
      } else if (event.data.type === 'SELECTION_CLEARED') {
        setSelectedRect(null);
        onSelectionCleared();
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onElementSelected, onSelectionCleared]);

  const handleLoad = () => {
    if (iframeRef.current?.contentWindow) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        const script = doc.createElement('script');
        script.textContent = BRIDGE_SCRIPT;
        doc.body.appendChild(script);
      }
    }
  };

  return (
    <div className="relative bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center p-8">
      <div 
        style={{ 
          width: selectedTemplate.width || 1080, 
          height: selectedTemplate.height || 1080,
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'center center'
        }}
        className="relative shadow-2xl bg-white"
      >
        <iframe
          ref={iframeRef}
          srcDoc={srcDoc}
          className="w-full h-full border-none pointer-events-auto"
          onLoad={handleLoad}
          sandbox="allow-scripts allow-popups"
        />
        
        {/* Overlay UI (Selection Box) */}
        {selectedRect && selectedElementId && (
          <div 
            className="absolute border-2 border-blue-500 pointer-events-none transition-all duration-75"
            style={{
              top: selectedRect.top,
              left: selectedRect.left,
              width: selectedRect.width,
              height: selectedRect.height
            }}
          >
            {/* Resize Handles could go here */}
          </div>
        )}
      </div>
    </div>
  );
}

