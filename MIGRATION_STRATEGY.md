# Template Migration Strategy: Old Architecture to New Sections

## Overview
This document outlines the strategy to migrate "full templates" (1080x1080 social media posts) from the old architecture into the new "Section-based" architecture.

## Source Data
- **File**: `templates_2025-12-10_13-38_408-templates.json`
- **Format**: JSON array of objects
- **Structure**: Fixed dimensions (1080x1080), inline styles, specific categories.

## Target Architecture
- **Table**: `template_sections`
- **Format**: Responsive HTML/CSS, specific section categories (Hero, Testimonials, etc.).
- **Goal**: "Atomic" sections that can be stacked to build a website.

## Migration Logic

### 1. HTML Transformation
The old templates are fixed-size containers. To make them responsive sections:
- **Action**: Modify the root `<div>` style.
- **From**: `width:1080px;height:1080px;`
- **To**: `width:100%;min-height:600px;` (preserves aspect ratio logic but allows fluid width).
- **Constraint**: Keep `position:relative;overflow:hidden` to ensure absolute positioned elements inside stay contained.

### 2. Category Mapping
We map the old specific categories to the new broad section types:

| Old Category/Tag | New Section Category |
|------------------|----------------------|
| `testimonial`, `quote` | **Testimonials** |
| `typography`, `statement` | **Hero** |
| `list`, `steps` | **Steps** |
| `gallery`, `showcase` | **Gallery** |
| `pricing`, `offer` | **Pricing** |
| *Default* | **Content** |

### 3. Variable Extraction
- **Old**: `variables: { "text": "value", "img": "url" }`
- **New**: `variables: ["text", "img"]` (Array of keys)
- **Action**: Extract `Object.keys(oldVariables)` to populate the new `variables` column.

### 4. Tagging
- **Action**: Copy existing tags directly. Add the original category as a tag for reference.

## Implementation Script
A script `scripts/migrate-templates.ts` has been created to automate this process.

### Usage
```bash
npx tsx scripts/migrate-templates.ts
```

### Code Logic (Snippet)
```typescript
const newHtml = oldHtml.replace(
  /width:1080px;height:1080px;/g, 
  'width:100%;min-height:600px;max-width:1200px;margin:0 auto;'
);
```

## Next Steps
1. Run the migration script.
2. Review the imported sections in the Admin Dashboard (`/admin/sections`).
3. Manually fine-tune any complex layouts that break with the responsive change.
