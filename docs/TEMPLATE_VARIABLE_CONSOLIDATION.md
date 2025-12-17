# Template Variable & CSS Consolidation System

## Overview

This document describes the centralized template variable and CSS system that reduces database storage, lowers AI credit consumption, and improves maintainability.

## Problem Statement

Previously, each template stored:
- **Full variable definitions** (type, label, description, default) - duplicated across 100+ templates
- **Separate CSS** - duplicated CSS variables and styles in each template
- **Large LLM schemas** sent to AI - consuming excessive tokens

This resulted in:
- ❌ High database storage costs
- ❌ Excessive AI credit consumption (sending full schemas for each template)
- ❌ Difficult maintenance (updating variables required changing multiple templates)
- ❌ Inconsistent styling across templates

## Solution Architecture

### 1. Centralized Variable Registry

**File:** `lib/templates/template-variables.ts`

All template variables are now defined in a **single registry** (`TEMPLATE_VARIABLES`). Templates reference variables by **key** instead of storing full definitions.

#### Example Variable Definition:

```typescript
export const TEMPLATE_VARIABLES = {
  headline: {
    type: 'text',
    label: 'Main Headline',
    description: 'Primary headline or title for the template',
    category: 'text',
    placeholder: 'Enter compelling headline...',
    required: true,
  },
  hero_image: {
    type: 'image',
    label: 'Hero Image',
    description: 'Main hero or background image',
    category: 'image',
    default: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200',
  },
  // ... 40+ more variables
};
```

#### Variable Categories:

- **text**: Headlines, descriptions, body text
- **image**: Photos, logos, backgrounds
- **cta**: Call-to-action buttons and links
- **social_proof**: Reviews, testimonials, ratings
- **metadata**: Dates, authors, categories
- **branding**: Brand names, taglines

### 2. Common CSS System

**File:** `lib/templates/common-template-styles.css`

A shared CSS file containing:
- **CSS Variables**: Brand colors, fonts, spacing, shadows
- **Utility Classes**: Layout helpers, text utilities, color classes
- **Component Styles**: Buttons, cards, badges, overlays
- **Animations**: Fade-in, slide-up, scale-in

#### Example Usage in Templates:

```html
<!-- Old Way (duplicated styles) -->
<div style="background:#0066cc;padding:16px;border-radius:8px;">

<!-- New Way (using CSS variables) -->
<div style="background:var(--brand-primary);padding:var(--space-4);border-radius:var(--radius-md);">
```

### 3. Template Structure (New Format)

Templates now use **variableKeys** instead of full variable objects:

```typescript
{
  id: "podcast-interview-dual",
  name: "Podcast Interview Duo",
  description: "Dual host/guest layout perfect for interview promotions.",
  
  // NEW: Reference variables by key
  variableKeys: ["headline", "subheadline", "host_name", "guest_name", "host_image", "guest_image", "date_time"],
  
  // Keep variables for backward compatibility (auto-generated from keys)
  variables: {
    headline: "Diving Deeper into Financial Mastery",
    subheadline: "Strategies to Level Up",
    // ... defaults
  },
  
  htmlTemplate: `<div>{{headline}}</div>`,
  cssTemplate: "",
}
```

## Benefits

### ✅ Reduced Database Storage

**Before:**
```json
{
  "variables": {
    "headline": {
      "type": "text",
      "label": "Main Headline",
      "description": "Primary headline or title for the template",
      "category": "text",
      "placeholder": "Enter compelling headline...",
      "required": true,
      "default": "Example Headline"
    },
    "subheadline": { /* ... */ },
    "image": { /* ... */ }
  }
}
```

**After:**
```json
{
  "variableKeys": ["headline", "subheadline", "image"],
  "variables": {
    "headline": "Example Headline",
    "subheadline": "Example Subtitle",
    "image": "https://..."
  }
}
```

**Savings:** ~80% reduction in variable storage per template

### ✅ Lower AI Credit Consumption

**Before (per template):**
```typescript
const llmSchema = {
  headline: {
    type: 'string',
    description: 'Primary headline or title for the template',
    default: 'Example Headline'
  },
  // ... 10+ more variables with full descriptions
};
// ~500-1000 tokens per schema
```

**After (shared schema):**
```typescript
// Generate minified schema from keys
const llmSchema = generateLlmSchemaFromKeys(['headline', 'subheadline']);
// ~100-200 tokens per schema (80% reduction!)
```

**Savings:** ~70-80% reduction in AI tokens per generation

### ✅ Easier Maintenance

**Before:** To add a new variable type, update 100+ templates individually

**After:** Add once to `TEMPLATE_VARIABLES`, available to all templates

**Example - Adding a new variable:**

```typescript
// lib/templates/template-variables.ts
export const TEMPLATE_VARIABLES = {
  // ... existing variables
  
  // NEW: Add once, use everywhere
  discount_badge: {
    type: 'text',
    label: 'Discount Badge',
    description: 'Promotional discount text',
    category: 'metadata',
    default: 'SAVE 20%',
  },
};
```

Now any template can use `{{discount_badge}}` by adding `'discount_badge'` to its `variableKeys`.

### ✅ Consistent Styling

All templates automatically get access to:
- Brand color variables (`--brand-primary`, `--brand-secondary`, etc.)
- Spacing system (`--space-4`, `--space-8`, etc.)
- Typography scale (`--text-xl`, `--text-2xl`, etc.)
- Utility classes (`.template-button`, `.template-card`, etc.)

## API Reference

### Helper Functions

#### `getVariableDefinition(key: string)`

Get the full definition for a variable by key.

```typescript
const def = getVariableDefinition('headline');
// Returns: { type: 'text', label: 'Main Headline', ... }
```

#### `getVariablesByCategory(category: string)`

Get all variables in a specific category.

```typescript
const imageVars = getVariablesByCategory('image');
// Returns: { hero_image: {...}, product_image: {...}, ... }
```

#### `getVariableDefaults(keys: string[])`

Get default values for a list of variable keys.

```typescript
const defaults = getVariableDefaults(['headline', 'cta']);
// Returns: { cta: 'Learn More' }
// (headline has no default, so it's omitted)
```

#### `generateLlmSchemaFromKeys(keys: string[])`

Generate a minified LLM schema for AI generation.

```typescript
const schema = generateLlmSchemaFromKeys(['headline', 'subheadline']);
// Returns: { headline: { type: 'string', description: '...' }, ... }
```

#### `validateVariableKeys(keys: string[])`

Validate that variable keys exist in the registry.

```typescript
const result = validateVariableKeys(['headline', 'unknown_var']);
// Returns: { valid: false, missing: ['unknown_var'] }
```

## Migration Guide

### For Existing Templates

1. **Identify variables** used in your template HTML
2. **Check registry** - are they in `TEMPLATE_VARIABLES`?
3. **Add missing variables** to registry if needed
4. **Add `variableKeys`** array to template definition
5. **Keep `variables`** for default values (backward compatibility)

### Example Migration:

**Before:**
```typescript
{
  id: "my-template",
  variables: {
    title: {
      type: 'text',
      label: 'Title',
      description: 'Main title',
      default: 'My Title'
    }
  },
  htmlTemplate: `<h1>{{title}}</h1>`
}
```

**After:**
```typescript
{
  id: "my-template",
  variableKeys: ['title'], // Reference by key
  variables: {
    title: 'My Title' // Just the default value
  },
  htmlTemplate: `<h1>{{title}}</h1>`
}
```

## CSS Migration Guide

### Using Common CSS in Templates

The renderer automatically includes common CSS. To use it:

```typescript
import { mergeTemplate } from '@/lib/templates/renderer';

const result = mergeTemplate({
  html: templateHtml,
  css: templateCss,
  variables: values,
  brandSettings: brand,
  includeCommonCss: true, // Enable common CSS (default)
});
```

### Available Utility Classes

```html
<!-- Buttons -->
<button class="template-button">Primary Action</button>
<button class="template-button-outline">Secondary Action</button>

<!-- Cards -->
<div class="template-card">Content card</div>
<div class="template-card-glass">Glass effect card</div>

<!-- Layout -->
<div class="flex items-center justify-between">Flex layout</div>

<!-- Typography -->
<h1 class="text-center font-bold">Centered bold text</h1>

<!-- Gradients -->
<div class="gradient-primary">Primary gradient background</div>
```

## Performance Impact

### Database Query Optimization

**Before:**
- Full variable schemas stored in JSONB columns
- Average template row: ~5KB
- 100 templates = ~500KB

**After:**
- Variable keys as string arrays
- Average template row: ~1KB (80% reduction)
- 100 templates = ~100KB

### AI Generation Optimization

**Before:**
- Send full variable schema per request
- Average schema size: 500-1000 tokens
- 1000 generations = 500,000-1,000,000 tokens

**After:**
- Send minified schema from centralized registry
- Average schema size: 100-200 tokens (80% reduction)
- 1000 generations = 100,000-200,000 tokens

**Cost Savings:** ~$4-8 per 1000 generations (at $0.01/1K tokens)

## Testing

### Run Template Seed Script

```bash
npm run db:seed
```

This will:
1. Load centralized variable definitions
2. Validate variable keys in all templates
3. Generate minified LLM schemas
4. Insert templates into database with new structure

### Test Template Loading

```typescript
import { getTemplateWithMatrixAction } from '@/app/(dashboard)/templates/actions';

const result = await getTemplateWithMatrixAction('podcast-interview-dual');
// Should load template with variables from centralized registry
```

## Troubleshooting

### "Unknown variable" warnings

If you see warnings about unknown variables:

```
⚠️ Unknown variables: custom_field
```

**Solution:** Add the variable to `TEMPLATE_VARIABLES`:

```typescript
export const TEMPLATE_VARIABLES = {
  // ... existing variables
  custom_field: {
    type: 'text',
    label: 'Custom Field',
    description: 'Your custom field',
    category: 'text',
  },
};
```

### CSS not applying

Ensure `includeCommonCss: true` in renderer:

```typescript
const result = mergeTemplate({
  // ... other options
  includeCommonCss: true, // Must be true
});
```

### Variables not populating in AI generation

Use the new `populateTemplateByKeys` function:

```typescript
import { populateTemplateByKeys } from '@/lib/ai/templates/generation';

const values = await populateTemplateByKeys(
  ['headline', 'subheadline'], // Variable keys
  'My content prompt',
  'Brand context'
);
```

## Future Enhancements

- [ ] Variable validation in template builder UI
- [ ] Visual variable picker (autocomplete from registry)
- [ ] CSS theme variants (dark mode, high contrast)
- [ ] Variable type enforcement (runtime validation)
- [ ] Analytics on most-used variables

## Contributing

When adding new variables to the registry:

1. **Check for duplicates** - does a similar variable exist?
2. **Use clear naming** - `hero_image` not `img1`
3. **Provide defaults** - helps with fallback content
4. **Add description** - AI uses this for context
5. **Set category** - enables filtering and organization

## See Also

- [Template System Architecture](./TEMPLATE_SYSTEM_ARCHITECTURE.md)
- [Template Generation Rules](./TEMPLATE_GENERATION_RULES.md)
- [Database Schema](../lib/db/schema.ts)
