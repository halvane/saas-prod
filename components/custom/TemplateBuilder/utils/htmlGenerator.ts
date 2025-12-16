import { VisualElement } from '../types';

/**
 * Generates a high-fidelity HTML string from the VisualElement JSON state.
 * This is used for:
 * 1. Generating the 'htmlTemplate' for backward compatibility/previews.
 * 2. Exporting the design to an image (via Puppeteer/html2canvas).
 */
export function generateHtmlFromElements(
  elements: VisualElement[],
  width: number,
  height: number,
  backgroundColor: string = '#ffffff'
): { html: string; css: string } {
  
  let css = `
    .container {
      position: relative;
      width: ${width}px;
      height: ${height}px;
      background-color: ${backgroundColor};
      overflow: hidden;
    }
    .element {
      position: absolute;
      box-sizing: border-box;
    }
  `;

  let html = `<div class="container">`;

  // Sort by zIndex to ensure correct stacking order
  const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);

  sortedElements.forEach((el) => {
    const id = `el-${el.id}`;
    
    // Base styles common to all elements
    let elementCss = `
      #${id} {
        left: ${el.x}px;
        top: ${el.y}px;
        width: ${el.width}px;
        height: ${el.height}px;
        opacity: ${el.opacity ?? 1};
        transform: rotate(${el.rotation || 0}deg) ${el.flipX ? 'scaleX(-1)' : ''} ${el.flipY ? 'scaleY(-1)' : ''};
        z-index: ${el.zIndex};
    `;

    // Type-specific styles and HTML
    if (el.type === 'text') {
      elementCss += `
        font-family: ${el.fontFamily || 'Arial, sans-serif'};
        font-size: ${el.fontSize || 16}px;
        font-weight: ${el.fontWeight || 'normal'};
        font-style: ${el.fontStyle || 'normal'};
        text-decoration: ${el.textDecoration || 'none'};
        text-align: ${el.textAlign || 'left'};
        line-height: ${el.lineHeight || 1.4};
        letter-spacing: ${el.letterSpacing || 0}px;
        color: ${el.color || '#000000'};
        text-transform: ${el.textTransform || 'none'};
        display: flex;
        align-items: center;
        white-space: pre-wrap;
        word-break: break-word;
      `;
      
      if (el.textShadow) elementCss += `text-shadow: ${el.textShadow};`;
      if (el.WebkitTextStroke) elementCss += `-webkit-text-stroke: ${el.WebkitTextStroke};`;
      if (el.padding) elementCss += `padding: ${typeof el.padding === 'number' ? el.padding + 'px' : el.padding};`;
      if (el.backgroundColor) elementCss += `background-color: ${el.backgroundColor};`;
      if (el.borderRadius) elementCss += `border-radius: ${el.borderRadius}px;`;
      if (el.border) elementCss += `border: ${el.border};`;
      if (el.boxShadow) elementCss += `box-shadow: ${el.boxShadow};`;

      html += `<div id="${id}" class="element">${el.content || ''}</div>`;

    } else if (el.type === 'image') {
      elementCss += `
        object-fit: ${el.objectFit || 'cover'};
        border-radius: ${el.borderRadius || 0}px;
      `;
      
      // Handle image source (variables vs static)
      const src = el.src || '';
      
      html += `<img id="${id}" class="element" src="${src}" alt="Image" />`;

    } else if (el.type === 'rectangle' || el.type === 'circle') {
      elementCss += `
        background-color: ${el.backgroundColor || 'transparent'};
        border-radius: ${el.type === 'circle' ? '50%' : (el.borderRadius || 0) + 'px'};
      `;

      if (el.backgroundImage) {
        elementCss += `
          background-image: ${el.backgroundImage};
          background-size: cover;
          background-position: center;
        `;
      }
      
      if (el.borderWidth && el.borderColor) {
        elementCss += `border: ${el.borderWidth}px ${el.borderStyle || 'solid'} ${el.borderColor};`;
      } else if (el.border) {
        elementCss += `border: ${el.border};`;
      }

      if (el.boxShadow) elementCss += `box-shadow: ${el.boxShadow};`;
      else if (el.shadow) {
        elementCss += `box-shadow: ${el.shadow.x}px ${el.shadow.y}px ${el.shadow.blur}px ${el.shadow.color};`;
      }

      html += `<div id="${id}" class="element"></div>`;
    }

    elementCss += `}`;
    css += elementCss;
  });

  html += `</div>`;

  return { html, css };
}
