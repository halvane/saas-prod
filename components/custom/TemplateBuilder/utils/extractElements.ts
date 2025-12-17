import type { VisualElement } from '../types/index';
import { TEMPLATE_ENGINE_CSS } from '@/lib/templates/styles';

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

      // Copy styles from main document to ensure variables and fonts are available
      const mainStyles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
        .map(el => el.outerHTML)
        .join('\n');

      // Write HTML and CSS to iframe
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          ${mainStyles}
          <style>
            ${TEMPLATE_ENGINE_CSS}
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body { 
              width: ${templateWidth}px; 
              height: ${templateHeight}px; 
              margin: 0;
              padding: 0;
              container-type: inline-size;
            }
            ${css}
          </style>
        </head>
        <body>
          <div class="template-root" style="width: 100%; height: 100%;">
            ${html}
          </div>
        </body>
        </html>
      `);
      iframeDoc.close();

      // PRE-PROCESS: Inject placeholders for variable images to prevent layout collapse
      // This fixes the "ecrasé" (crushed) issue where broken images have 0x0 size
      const images = iframeDoc.querySelectorAll('img');
      
      images.forEach(img => {
        const src = img.getAttribute('src');
        if (src && src.includes('{{')) {
          // Store original src in data attribute
          img.setAttribute('data-original-src', src);
          
          // CRITICAL: Preserve existing inline styles before modifying
          const existingStyle = img.getAttribute('style') || '';
          
          // Use a neutral placeholder that will hold space
          // We use a data URI to avoid network requests and ensure immediate availability
          // A 400x300 gray rectangle
          img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%2394a3b8'%3EVariable Image%3C/text%3E%3C/svg%3E";
          
          // Add minimum size WITHOUT destroying existing inline styles
          // Only set these if they don't already exist
          if (!img.style.minWidth) img.style.minWidth = '50px';
          if (!img.style.minHeight) img.style.minHeight = '50px';
          if (!img.style.display || img.style.display === '') img.style.display = 'block';
          
          // Store the original style string for later retrieval
          img.setAttribute('data-original-style', existingStyle);
        }
      });

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
            
            // VISIBILITY CHECK
            // Skip elements that are explicitly hidden
            if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden' || computedStyle.opacity === '0') {
              return;
            }

            // SIZE CHECK
            // Images and Text might report 0 size if not loaded yet, but we should keep them
            const isImage = el.tagName === 'IMG';
            
            // Check for direct text content (ignoring whitespace)
            const hasDirectText = Array.from(el.childNodes).some(
              node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim().length! > 0
            );
            
            // Also check if it's a leaf node with text (e.g. <span>Text</span>)
            const isLeafWithText = el.children.length === 0 && el.textContent?.trim().length! > 0;

            // If it's very small (effectively invisible) and NOT content, skip it
            if ((rect.width < 1 || rect.height < 1) && !isImage && !hasDirectText && !isLeafWithText) {
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
              (computedStyle.backgroundImage && computedStyle.backgroundImage !== 'none') ||
              (computedStyle.boxShadow && computedStyle.boxShadow !== 'none') ||
              (computedStyle.backdropFilter && computedStyle.backdropFilter !== 'none') ||
              (el.getAttribute('style')?.includes('background')) ||
              (el.getAttribute('style')?.includes('backdrop-filter')) ||
              (el.getAttribute('style')?.includes('box-shadow')); // Fallback check for inline styles

            // Check if element has visible border
            const hasVisibleBorder = 
              parseFloat(computedStyle.borderWidth) > 0 && 
              computedStyle.borderColor !== 'transparent' && 
              computedStyle.borderColor !== 'rgba(0, 0, 0, 0)';

            // Skip invisible layout containers
            // If it has no visible background, no visible border, and has children (is a container)
            if (!hasVisibleBackground && !hasVisibleBorder && el.children.length > 0 && !isImage) {
              // If no direct text content, it's just a layout wrapper -> skip
              // BUT: If it has a gradient background defined in style attribute but computed as image, we should keep it
              
              const isRootLike = rect.width >= templateWidth * 0.9 && rect.height >= templateHeight * 0.9;
              
              if (!hasDirectText && !isRootLike) {
                return; 
              }
            }

            if (isImage) {
              type = 'image';
              // Use getAttribute to get the raw value (e.g. {{variable}}) instead of resolved URL
              // This is CRITICAL for preserving variables and handling broken links gracefully
              const originalSrc = el.getAttribute('data-original-src');
              const rawSrc = originalSrc || el.getAttribute('src');
              src = rawSrc || (el as HTMLImageElement).src || '';
              
              // Remove debug logs
              /* console.log('📷 Image extracted:', { 
                id, 
                rawSrc, 
                finalSrc: src,
                outerHTML: el.outerHTML,
                hasSrcAttribute: el.hasAttribute('src')
              }); */
            } else if (hasDirectText || isLeafWithText) {
              type = 'text';
              content = el.textContent?.trim() || '';
            }

            // Check if it's a circle based on border-radius
            // BUT: Don't convert images to circles - images can have border-radius:50% and still be images
            const borderRadius = parseFloat(computedStyle.borderRadius);
            if (!isImage && borderRadius >= Math.min(rect.width, rect.height) / 2) {
              type = 'circle';
            }

            // Calculate dimensions with fallback for collapsed images
            let width = Math.round(rect.width);
            let height = Math.round(rect.height);

            if (type === 'image' && (width < 1 || height < 1)) {
               console.warn(`⚠️ Image ${id} was collapsed (0x0). Forcing default size.`);
               width = 200;
               height = 200;
            }
            
            // CRITICAL: Preserve original inline styles to prevent CSS loss
            // For images with placeholders, use the original style we saved
            let rawStyle = el.getAttribute('data-original-style') || el.getAttribute('style') || '';
            
            // DEBUG: Log rawStyle for images
            if (type === 'image' && rawStyle) {
              console.log('🔍 Image rawStyle captured:', { id, rawStyle, borderRadius });
            }

            // Create visual element
            const visualElement: VisualElement = {
              id,
              type,
              x: Math.round(left),
              y: Math.round(top),
              width,
              height,
              zIndex: zIndex++,
              opacity: parseFloat(computedStyle.opacity) || 1,
              rotation: 0,
              visible: computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden',
              locked: computedStyle.pointerEvents === 'none',
              rawStyle, // Preserve all inline styles
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
              
              // Preserve text background and padding
              if (computedStyle.backgroundColor && computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)') {
                visualElement.backgroundColor = computedStyle.backgroundColor;
              }
              if (computedStyle.padding && computedStyle.padding !== '0px') {
                visualElement.padding = computedStyle.padding;
              }
              if (computedStyle.borderRadius && parseFloat(computedStyle.borderRadius) > 0) {
                visualElement.borderRadius = parseFloat(computedStyle.borderRadius);
              }
              if (computedStyle.border && computedStyle.border !== 'none') {
                visualElement.border = computedStyle.border;
              }
              if (computedStyle.boxShadow && computedStyle.boxShadow !== 'none') {
                visualElement.boxShadow = computedStyle.boxShadow;
              }
              if (computedStyle.backgroundImage && computedStyle.backgroundImage !== 'none') {
                visualElement.backgroundImage = computedStyle.backgroundImage;
              }
            } else if (type === 'image') {
              visualElement.src = src;
              visualElement.objectFit = (computedStyle.objectFit as any) || 'cover';
              
              // Preserve border properties for images (e.g., circular images with border-radius:50%)
              if (borderRadius > 0) {
                visualElement.borderRadius = borderRadius;
              }
              if (computedStyle.border && computedStyle.border !== 'none') {
                visualElement.border = computedStyle.border;
              }
              if (parseFloat(computedStyle.borderWidth) > 0) {
                visualElement.borderWidth = parseFloat(computedStyle.borderWidth);
                visualElement.borderColor = computedStyle.borderColor || '#000000';
                visualElement.borderStyle = (computedStyle.borderStyle as any) || 'solid';
              }
            } else if (type === 'rectangle' || type === 'circle') {
              visualElement.backgroundColor = computedStyle.backgroundColor || 'transparent';
              
              // Try to get raw background image from inline style first to preserve variables
              let bgImage = computedStyle.backgroundImage !== 'none' ? computedStyle.backgroundImage : undefined;
              
              // Check inline style for variables in background-image
              const inlineStyle = el.getAttribute('style');
              if (inlineStyle) {
                // Look for background-image or background shorthand with variables
                // Matches: background-image: url('{{var}}') or background: ... url('{{var}}') ...
                const bgMatch = inlineStyle.match(/(?:^|;\s*)(?:background-image|background)\s*:.*?url\(['"]?([^'")]+)['"]?\)/i);
                if (bgMatch && bgMatch[1].includes('{{')) {
                   bgImage = `url('${bgMatch[1]}')`;
                }
              }

              visualElement.backgroundImage = bgImage;
              visualElement.borderRadius = borderRadius || 0;
              visualElement.borderWidth = parseFloat(computedStyle.borderWidth) || 0;
              visualElement.borderColor = computedStyle.borderColor || '#000000';
              visualElement.borderStyle = (computedStyle.borderStyle as any) || 'solid';
              
              // Preserve additional CSS properties that might disappear
              if (computedStyle.boxShadow && computedStyle.boxShadow !== 'none') {
                visualElement.boxShadow = computedStyle.boxShadow;
              }
              if (computedStyle.backdropFilter && computedStyle.backdropFilter !== 'none') {
                visualElement.backdropFilter = computedStyle.backdropFilter;
              }
              // Preserve background size/position for gradients
              if (computedStyle.backgroundSize && computedStyle.backgroundSize !== 'auto') {
                visualElement.backgroundSize = computedStyle.backgroundSize;
              }
              if (computedStyle.backgroundPosition && computedStyle.backgroundPosition !== '0% 0%') {
                visualElement.backgroundPosition = computedStyle.backgroundPosition;
              }
            }

            elements.push(visualElement);
          });

          // Clean up iframe
          document.body.removeChild(iframe);
          
          resolve(elements);
        } catch (error) {
          console.error('Error processing iframe elements:', error);
          document.body.removeChild(iframe);
          resolve([]);
        }
      }, 1000); // Increased timeout to ensure CSS and images are fully loaded
    } catch (error) {
      console.error('Error extracting elements from HTML:', error);
      resolve([]);
    }
  });
}
