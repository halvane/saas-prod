export const STANDARD_CSS_VARIABLES = [
  '--brand-primary',
  '--brand-secondary',
  '--brand-accent',
  '--font-heading',
  '--font-body',
  '--brand-logo',
];

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
        --brand-secondary: ${secondary};
        --brand-accent: ${accent};
        --font-heading: ${brandSettings.brandFont || 'sans-serif'};
        --font-body: ${brandSettings.brandFont || 'sans-serif'};
      }
    `;
    
    mergedCss = `${rootStyles}\n${mergedCss}`;
  }

  return { html: mergedHtml, css: mergedCss };
}
