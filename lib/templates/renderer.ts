export const STANDARD_CSS_VARIABLES = [
  '--brand-primary',
  '--brand-secondary',
  '--brand-accent',
  '--font-heading',
  '--font-body',
  '--brand-logo',
];

// Simple color utility to lighten/darken hex
function adjustColor(color: string, amount: number) {
    try {
        return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
    } catch (e) { return color; }
}

// Convert hex to RGB for opacity support
function hexToRgb(hex: string) {
    try {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
    } catch (e) { return '0, 0, 0'; }
}

export interface RenderOptions {
  html: string;
  css: string;
  variables: Record<string, any>;
  brandSettings?: any; // Type from schema
}

export function mergeTemplate({ html, css, variables, brandSettings }: RenderOptions) {
  let mergedHtml = html || '';
  let mergedCss = css || '';

  // 1. Inject Content Variables
  for (const [key, value] of Object.entries(variables || {})) {
    const placeholder = `{{${key}}}`;
    // Global replace
    if (mergedHtml) mergedHtml = mergedHtml.split(placeholder).join(String(value));
    if (mergedCss) mergedCss = mergedCss.split(placeholder).join(String(value));
  }

  // 1.5 Cleanup remaining placeholders
  // This prevents 404s for missing variables like {{photo1}}
  if (mergedHtml) {
    mergedHtml = mergedHtml.replace(/\{\{([^}]+)\}\}/g, '');
  }
  if (mergedCss) {
    mergedCss = mergedCss.replace(/\{\{([^}]+)\}\}/g, '');
  }

  // 2. Inject Brand Settings (CSS Variables)
  if (brandSettings) {
    const brandColors = typeof brandSettings.brandColors === 'string' 
      ? JSON.parse(brandSettings.brandColors) 
      : brandSettings.brandColors || [];
      
    const primary = brandColors[0] || '#000000';
    const secondary = brandColors[1] || '#ffffff';
    const accent = brandColors[2] || '#cccccc';
    
    const rootStyles = `
      :root {
        --brand-primary: ${primary};
        --brand-primary-light: ${adjustColor(primary, 40)};
        --brand-primary-dark: ${adjustColor(primary, -40)};
        --brand-primary-rgb: ${hexToRgb(primary)};
        
        --brand-secondary: ${secondary};
        --brand-secondary-light: ${adjustColor(secondary, 40)};
        --brand-secondary-dark: ${adjustColor(secondary, -40)};
        --brand-secondary-rgb: ${hexToRgb(secondary)};
        
        --brand-accent: ${accent};
        --brand-accent-light: ${adjustColor(accent, 40)};
        --brand-accent-dark: ${adjustColor(accent, -40)};
        --brand-accent-rgb: ${hexToRgb(accent)};
        
        --font-heading: ${brandSettings.brandFont || 'sans-serif'};
        --font-body: ${brandSettings.brandFont || 'sans-serif'};
      }
    `;
    
    mergedCss = `${rootStyles}\n${mergedCss}`;
  }

  return { html: mergedHtml, css: mergedCss };
}
