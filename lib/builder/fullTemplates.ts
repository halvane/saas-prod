import { buildTemplateFromSections } from './library';
import type { CustomTemplate } from '@/components/custom/TemplateBuilder/types';

// ========================================================================
// 25 TEMPLATE CONFIGURATIONS USING ATOMIC SECTIONS
// ========================================================================
// Organized by domain: Stats (10), Timeline (5), Features (5), Comparison (5) = 25 total templates

const TEMPLATE_CONFIGS = [

  // ========================================================================
  // STATS/METRICS TEMPLATES (51-60)
  // ========================================================================
  {
    id: 'stats-performance-51',
    name: 'Performance Stats',
    description: 'Four column performance metrics',
    sections: ['hero-title-accent', 'stats-four-column'],
    category: 'stats',
    tags: ['stats', 'metrics', 'numbers'],
    width: 1080,
    height: 1080
  },
  {
    id: 'stats-growth-52',
    name: 'Growth Stats',
    description: 'Large two-column growth metrics',
    sections: ['stats-two-column-large', 'text-description-block'],
    category: 'stats',
    tags: ['stats', 'growth', 'numbers'],
    width: 1080,
    height: 1080
  },
  {
    id: 'stats-progress-53',
    name: 'Progress Metrics',
    description: 'Stats with progress bar visualization',
    sections: ['hero-title-accent', 'stats-progress-bar'],
    category: 'stats',
    tags: ['stats', 'progress', 'metrics'],
    width: 1080,
    height: 1080
  },
  {
    id: 'stats-achievement-54',
    name: 'Achievement Stats',
    description: 'Achievement metrics with CTA',
    sections: ['stats-four-column', 'cta-primary-button'],
    category: 'stats',
    tags: ['stats', 'achievement', 'cta'],
    width: 1080,
    height: 1080
  },
  {
    id: 'stats-comparison-55',
    name: 'Comparison Stats',
    description: 'Stats comparison with testimonial',
    sections: ['stats-two-column-large', 'review-minimal-quote'],
    category: 'stats',
    tags: ['stats', 'comparison', 'testimonial'],
    width: 1080,
    height: 1080
  },
  {
    id: 'stats-full-report-56',
    name: 'Full Stats Report',
    description: 'Comprehensive stats with progress bars and CTA',
    sections: ['hero-title-accent', 'stats-progress-bar', 'cta-dual-buttons'],
    category: 'stats',
    tags: ['stats', 'report', 'comprehensive'],
    width: 1080,
    height: 1080
  },
  {
    id: 'stats-visual-data-57',
    name: 'Visual Data Stats',
    description: 'Stats with image background',
    sections: ['hero-image-overlay', 'stats-four-column'],
    category: 'stats',
    tags: ['stats', 'visual', 'image'],
    width: 1080,
    height: 1080
  },
  {
    id: 'stats-milestone-58',
    name: 'Milestone Stats',
    description: 'Milestone achievements with footer',
    sections: ['stats-two-column-large', 'text-description-block', 'footer-contact-simple'],
    category: 'stats',
    tags: ['stats', 'milestone', 'achievement'],
    width: 1080,
    height: 1080
  },
  {
    id: 'stats-performance-bars-59',
    name: 'Performance Bar Chart',
    description: 'Performance metrics as progress bars',
    sections: ['text-quote-prominent', 'stats-progress-bar'],
    category: 'stats',
    tags: ['stats', 'performance', 'bars'],
    width: 1080,
    height: 1080
  },
  {
    id: 'stats-annual-report-60',
    name: 'Annual Report Stats',
    description: 'Annual statistics overview',
    sections: ['hero-title-accent', 'stats-four-column', 'text-description-block'],
    category: 'stats',
    tags: ['stats', 'annual', 'report'],
    width: 1080,
    height: 1080
  },

  // ========================================================================
  // TIMELINE/PROCESS TEMPLATES (61-65)
  // ========================================================================
  {
    id: 'timeline-process-61',
    name: 'Three Step Process',
    description: 'Simple three-step process timeline',
    sections: ['hero-title-accent', 'timeline-three-step'],
    category: 'timeline',
    tags: ['timeline', 'process', 'steps'],
    width: 1080,
    height: 1080
  },
  {
    id: 'timeline-history-62',
    name: 'Company History',
    description: 'Vertical timeline with milestones',
    sections: ['timeline-vertical', 'footer-social-links'],
    category: 'timeline',
    tags: ['timeline', 'history', 'milestones'],
    width: 1080,
    height: 1080
  },
  {
    id: 'timeline-roadmap-63',
    name: 'Product Roadmap',
    description: 'Roadmap timeline with CTA',
    sections: ['hero-title-accent', 'timeline-three-step', 'cta-primary-button'],
    category: 'timeline',
    tags: ['timeline', 'roadmap', 'product'],
    width: 1080,
    height: 1080
  },
  {
    id: 'timeline-journey-64',
    name: 'Customer Journey',
    description: 'Customer journey timeline',
    sections: ['timeline-three-step', 'review-star-card'],
    category: 'timeline',
    tags: ['timeline', 'journey', 'customer'],
    width: 1080,
    height: 1080
  },
  {
    id: 'timeline-evolution-65',
    name: 'Evolution Timeline',
    description: 'Product evolution with images',
    sections: ['hero-title-accent', 'timeline-vertical', 'image-split-layout'],
    category: 'timeline',
    tags: ['timeline', 'evolution', 'history'],
    width: 1080,
    height: 1080
  },

  // ========================================================================
  // ICON/FEATURE TEMPLATES (66-70)
  // ========================================================================
  {
    id: 'icon-features-66',
    name: 'Icon Feature Grid',
    description: 'Four icon feature grid',
    sections: ['hero-title-accent', 'icon-grid-four'],
    category: 'features',
    tags: ['icons', 'features', 'grid'],
    width: 1080,
    height: 1080
  },
  {
    id: 'icon-benefits-67',
    name: 'Icon Benefits List',
    description: 'Vertical icon benefits with CTA',
    sections: ['icon-list-vertical', 'cta-primary-button'],
    category: 'features',
    tags: ['icons', 'benefits', 'list'],
    width: 1080,
    height: 1080
  },
  {
    id: 'icon-service-68',
    name: 'Service Icon Grid',
    description: 'Service features with testimonial',
    sections: ['icon-grid-four', 'review-minimal-quote'],
    category: 'features',
    tags: ['icons', 'service', 'testimonial'],
    width: 1080,
    height: 1080
  },
  {
    id: 'icon-checklist-69',
    name: 'Icon Checklist',
    description: 'Feature checklist with footer',
    sections: ['hero-title-accent', 'icon-list-vertical', 'footer-newsletter'],
    category: 'features',
    tags: ['icons', 'checklist', 'features'],
    width: 1080,
    height: 1080
  },
  {
    id: 'icon-value-prop-70',
    name: 'Value Proposition',
    description: 'Icon grid value proposition with dual CTAs',
    sections: ['icon-grid-four', 'cta-dual-buttons'],
    category: 'features',
    tags: ['icons', 'value', 'proposition'],
    width: 1080,
    height: 1080
  },

  // ========================================================================
  // COMPARISON TEMPLATES (71-75)
  // ========================================================================
  {
    id: 'comparison-before-after-71',
    name: 'Before After Transformation',
    description: 'Before and after comparison layout',
    sections: ['hero-title-accent', 'comparison-before-after'],
    category: 'comparison',
    tags: ['comparison', 'before-after', 'transformation'],
    width: 1080,
    height: 1080
  },
  {
    id: 'comparison-vs-competitor-72',
    name: 'VS Competitor',
    description: 'Head-to-head competitor comparison',
    sections: ['comparison-vs-table', 'cta-primary-button'],
    category: 'comparison',
    tags: ['comparison', 'vs', 'competitor'],
    width: 1080,
    height: 1080
  },
  {
    id: 'comparison-results-73',
    name: 'Results Comparison',
    description: 'Before/after results with testimonial',
    sections: ['comparison-before-after', 'review-star-card'],
    category: 'comparison',
    tags: ['comparison', 'results', 'testimonial'],
    width: 1080,
    height: 1080
  },
  {
    id: 'comparison-features-74',
    name: 'Feature Comparison',
    description: 'Feature comparison with stats',
    sections: ['hero-title-accent', 'comparison-vs-table', 'stats-four-column'],
    category: 'comparison',
    tags: ['comparison', 'features', 'stats'],
    width: 1080,
    height: 1080
  },
  {
    id: 'comparison-upgrade-75',
    name: 'Upgrade Comparison',
    description: 'Upgrade benefits comparison with CTA',
    sections: ['comparison-before-after', 'cta-dual-buttons'],
    category: 'comparison',
    tags: ['comparison', 'upgrade', 'benefits'],
    width: 1080,
    height: 1080
  }
];

// Generate the full templates
export const FULL_DEMO_TEMPLATES: CustomTemplate[] = TEMPLATE_CONFIGS.map(config => {
  const built = buildTemplateFromSections(
    config.name,
    config.description,
    config.sections,
    {},
    '#ffffff',
    config.width,
    config.height
  );

  return {
    id: config.id,
    name: config.name,
    description: config.description,
    category: config.category,
    platform: ['instagram', 'twitter', 'linkedin'],
    width: config.width,
    height: config.height,
    htmlTemplate: built.htmlTemplate,
    cssTemplate: '',
    variables: built.variables || {},
    tags: config.tags,
    isActive: true,
    isPublic: true,
    usageCount: 0
  };
});

/**
 * Get a template by ID
 */
export function getTemplateById(id: string): CustomTemplate | undefined {
  return FULL_DEMO_TEMPLATES.find(t => t.id === id);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string): CustomTemplate[] {
  return FULL_DEMO_TEMPLATES.filter(t => t.category === category);
}

/**
 * Get all templates
 */
export function getAllTemplates(): CustomTemplate[] {
  return FULL_DEMO_TEMPLATES;
}
