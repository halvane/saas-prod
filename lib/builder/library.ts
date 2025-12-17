import { Section, SectionMetadata, Effect, Asset } from './types';
// New reusable atomic sections only - old template files disabled due to metadata issues
import { HERO_SECTIONS } from './sections/hero-sections';
import { CTA_SECTIONS } from './sections/cta-sections';
import { TEXT_SECTIONS as ATOMIC_TEXT_SECTIONS } from './sections/text-sections';
import { REVIEW_SECTIONS } from './sections/review-sections';
import { IMAGE_SECTIONS } from './sections/image-sections';
import { FOOTER_SECTIONS } from './sections/footer-sections';
import { STATS_SECTIONS } from './sections/stats-sections';
import { TIMELINE_SECTIONS } from './sections/timeline-sections';
import { ICON_SECTIONS } from './sections/icon-sections';
import { COMPARISON_SECTIONS } from './sections/comparison-sections';
import { EffectRegistry } from './effects';
import { AssetProvider } from '@/lib/assets/provider';

export type { Section, SectionMetadata, Effect, Asset };
export { EffectRegistry, AssetProvider };

export const SECTIONS: Section[] = [
  // Old template files commented out due to metadata issues
  // ...HEADERS,
  // ...HEROES,
  // ...PRODUCTS,
  // ...FOOTERS,
  // ...OVERLAYS,
  // ...TEXT_SECTIONS,
  // ...BRIDGES,
  // ...UI_MIMICS,
  // ...FRAMES,
  // ...ADVANCED,
  // ...SOCIAL_PRO,
  // ...IMPORTED_TEMPLATES,
  // New atomic sections
  ...HERO_SECTIONS,
  ...CTA_SECTIONS,
  ...ATOMIC_TEXT_SECTIONS,
  ...REVIEW_SECTIONS,
  ...IMAGE_SECTIONS,
  ...FOOTER_SECTIONS,
  ...STATS_SECTIONS,
  ...TIMELINE_SECTIONS,
  ...ICON_SECTIONS,
  ...COMPARISON_SECTIONS
];

// Helper to stack sections into a full template
export function buildTemplateFromSections(
  name: string, 
  description: string, 
  sections: string[], 
  baseVariables: Record<string, any> = {},
  background: string = '#ffffff',
  width: number = 1080,
  height: number = 1080
) {
  let currentTop = 0;
  let combinedHtml = '';
  let combinedVariables = { ...baseVariables };

  // Handle background styles (color, gradient, or image)
  let backgroundStyle = '';
  if (background.startsWith('http') || background.startsWith('/')) {
    backgroundStyle = `background-image: url('${background}'); background-size: cover; background-position: center;`;
  } else {
    backgroundStyle = `background: ${background};`;
  }

  // Always add a background/overlay first if present (they usually take full height)
  // But for stacking logic, we need to handle "flow" vs "absolute"
  
  // Simple stacking strategy:
  // 1. Overlays are placed at top:0, left:0, full width/height
  // 2. Content sections are stacked vertically
  
  const selectedSections = sections.map(id => SECTIONS.find(s => s.id === id)).filter(Boolean) as Section[];
  
  // 1. Render Overlays
  selectedSections.filter(s => s.category === 'overlay').forEach(s => {
    combinedHtml += s.html; // Assumes overlay handles its own positioning (usually full cover)
    Object.assign(combinedVariables, s.variables);
  });

  // 2. Render Content Stack
  const contentSections = selectedSections.filter(s => s.category !== 'overlay');
  
  // Calculate total height of content to center it vertically? 
  // Or just start from top? Let's start from top + padding.
  currentTop = 0; // Reset to 0 for better control

  // If we only have one section, let it take full height
  const isSingleSection = contentSections.length === 1;

  contentSections.forEach(s => {
    // We need to inject the 'top' position into the HTML
    // The HTML strings in SECTIONS usually have 'top:0'. We need to replace it or wrap it.
    // Wrapping is safer.
    
    // Use absolute positioning with explicit height for each section
    // This ensures h-full inside the section refers to the section height, not the template height
    
    let wrapperStyle = '';
    if (isSingleSection) {
        wrapperStyle = `position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden;display:flex;align-items:center;justify-content:center;`;
    } else {
        wrapperStyle = `position:absolute;top:${currentTop}px;left:0;width:100%;height:${s.height}px;overflow:hidden;`;
    }

    const positionedHtml = `<div style="${wrapperStyle}">${s.html}</div>`;
    
    combinedHtml += positionedHtml;
    Object.assign(combinedVariables, s.variables);
    currentTop += s.height;
  });

  // Ensure min-height matches the intended canvas height, or grows if content is taller
  const totalHeight = Math.max(height, currentTop);

  return {
    name,
    description,
    htmlTemplate: `
      <div style="width:${width}px;height:${totalHeight}px;${backgroundStyle}position:relative;overflow:hidden;font-family:var(--font-body);container-type:inline-size;">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@400;700&family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet">
        <style>
          html, body { margin: 0; padding: 0; width: 100%; height: 100%; }
          :root {
            --brand-primary: #000000;
            --brand-secondary: #ffffff;
            --brand-accent: #3b82f6;
            --brand-primary-light: #333333;
            --brand-primary-dark: #000000;
            --font-heading: 'Inter', sans-serif;
            --font-body: 'Inter', sans-serif;
          }
        </style>
        ${combinedHtml}
      </div>`,
    variables: combinedVariables,
    category: 'custom',
    platform: ['instagram', 'facebook']
  };
}
