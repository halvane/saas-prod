import type { VisualElement } from '../types/index';

/**
 * Extract visual elements from HTML/CSS for interactive editing
 * Creates hidden iframe to render and measure DOM elements
 */
export async function extractElementsFromHTMLAsync(
  html: string,
  css: string,
  templateWidth: number,
  templateHeight: number
): Promise<VisualElement[]> {
  return new Promise((resolve) => {
    const elements: VisualElement[] = [];
    
    try {
      // Create a hidden iframe to render and measure elements
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.style.width = `${templateWidth}px`;
      iframe.style.height = `${templateHeight}px`;
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        document.body.removeChild(iframe);
        resolve([]);
        return;
      }

      // Write HTML and CSS to iframe
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body { 
              width: ${templateWidth}px; 
              height: ${templateHeight}px; 
              margin: 0;
              padding: 0;
            }
            ${css}
          </style>
        </head>
        <body>${html}</body>
        </html>
      `);
      iframeDoc.close();

      // Wait for styles to apply and images to load
      setTimeout(() => {
        try {
          const allElements = iframeDoc.body.querySelectorAll('*');
          let zIndex = 0;
          
          allElements.forEach((el) => {
            // Skip non-visual elements
            if (el.tagName === 'HTML' || el.tagName === 'HEAD' || el.tagName === 'BODY' || 
                el.tagName === 'STYLE' || el.tagName === 'SCRIPT' || el.tagName === 'BR') {
              return;
            }

            const id = el.id || `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const rect = el.getBoundingClientRect();
            const computedStyle = iframe.contentWindow?.getComputedStyle(el);
            
            if (!computedStyle) {
              return;
            }
            
            // Skip elements that are too small or hidden
            if (rect.width < 1 || rect.height < 1) {
              return;
            }
            
            if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden' || computedStyle.opacity === '0') {
              return;
            }

            // Get position relative to body
            const bodyRect = iframeDoc.body.getBoundingClientRect();
            const left = rect.left - bodyRect.left;
            const top = rect.top - bodyRect.top;
            
            // Determine element type
            let type: VisualElement['type'] = 'rectangle';
            let content = '';
            let src = '';
            
            // Skip container/wrapper elements that have class names suggesting they're containers
            const className = el.className?.toString() || '';
            
            // Check if element has visible background (color or gradient/image)
            const hasVisibleBackground = 
              (computedStyle.backgroundColor && computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' && computedStyle.backgroundColor !== 'transparent') ||
              (computedStyle.backgroundImage && computedStyle.backgroundImage !== 'none');

            if (className.includes('visual-canvas') || className.includes('container') || className.includes('wrapper')) {
              // This is likely a container
              
              // If it has a visible background, we keep it as a rectangle (background layer)
              if (!hasVisibleBackground) {
                // No background, so check if it has direct text content
                const hasDirectTextContent = Array.from(el.childNodes).some(
                  node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
                );
                
                // If no background and no direct text, and has children, it's just a layout wrapper -> skip
                if (!hasDirectTextContent && el.children.length > 0) {
                  return; 
                }
              }
            }

            if (el.tagName === 'IMG') {
              type = 'image';
              src = (el as HTMLImageElement).src;
            } else if (el.textContent?.trim()) {
              // Check if it's primarily a text element
              const hasTextContent = el.childNodes.length > 0 && 
                Array.from(el.childNodes).some(node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim());
              
              if (hasTextContent || el.children.length === 0) {
                type = 'text';
                content = el.textContent.trim();
              }
            }

            // Check if it's a circle based on border-radius
            const borderRadius = parseFloat(computedStyle.borderRadius);
            if (borderRadius >= Math.min(rect.width, rect.height) / 2) {
              type = 'circle';
            }

            // Create visual element
            const visualElement: VisualElement = {
              id,
              type,
              x: Math.round(left),
              y: Math.round(top),
              width: Math.round(rect.width),
              height: Math.round(rect.height),
              zIndex: zIndex++,
              opacity: parseFloat(computedStyle.opacity) || 1,
              rotation: 0,
              visible: computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden',
              locked: false,
            };

            // Add type-specific properties
            if (type === 'text') {
              visualElement.content = content;
              visualElement.fontSize = parseFloat(computedStyle.fontSize) || 16;
              visualElement.color = computedStyle.color || '#000000';
              visualElement.fontFamily = computedStyle.fontFamily || 'Arial, sans-serif';
              visualElement.fontWeight = computedStyle.fontWeight || 'normal';
              visualElement.fontStyle = computedStyle.fontStyle || 'normal';
              visualElement.textDecoration = computedStyle.textDecoration || 'none';
              visualElement.textAlign = (computedStyle.textAlign as any) || 'left';
              visualElement.lineHeight = parseFloat(computedStyle.lineHeight) / parseFloat(computedStyle.fontSize) || 1.4;
              visualElement.letterSpacing = parseFloat(computedStyle.letterSpacing) || 0;
              visualElement.textTransform = (computedStyle.textTransform as any) || 'none';
              visualElement.textShadow = computedStyle.textShadow !== 'none' ? computedStyle.textShadow : undefined;
              visualElement.WebkitTextStroke = computedStyle.webkitTextStroke !== 'none' ? computedStyle.webkitTextStroke : undefined;
            } else if (type === 'image') {
              visualElement.src = src;
              visualElement.objectFit = (computedStyle.objectFit as any) || 'cover';
            } else if (type === 'rectangle' || type === 'circle') {
              visualElement.backgroundColor = computedStyle.backgroundColor || 'transparent';
              visualElement.backgroundImage = computedStyle.backgroundImage !== 'none' ? computedStyle.backgroundImage : undefined;
              visualElement.borderRadius = borderRadius || 0;
              visualElement.borderWidth = parseFloat(computedStyle.borderWidth) || 0;
              visualElement.borderColor = computedStyle.borderColor || '#000000';
              visualElement.borderStyle = (computedStyle.borderStyle as any) || 'solid';
            }

            elements.push(visualElement);
          });

          // Clean up iframe
          document.body.removeChild(iframe);
          
          console.log(`🎨 Extracted ${elements.length} visual elements from HTML`);
          resolve(elements);
        } catch (error) {
          console.error('Error processing iframe elements:', error);
          document.body.removeChild(iframe);
          resolve([]);
        }
      }, 500); // Increased timeout to ensure CSS and images are fully loaded
    } catch (error) {
      console.error('Error extracting elements from HTML:', error);
      resolve([]);
    }
  });
}
