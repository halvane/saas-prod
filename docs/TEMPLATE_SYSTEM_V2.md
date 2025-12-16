# Template System V2: JSON Architecture

## Overview
The Template System has been migrated from a legacy HTML/CSS storage model to a high-performance JSON-based architecture. This ensures instant loading, pixel-perfect editing, and robust export capabilities.

## Core Concepts

### 1. Source of Truth: `VisualElement[]`
Instead of storing raw HTML strings, we now store an array of `VisualElement` objects in the database (`templates.elements` column).
This JSON structure defines every aspect of the design:
- Position (`x`, `y`)
- Dimensions (`width`, `height`)
- Styling (`color`, `font`, `borderRadius`, `shadow`)
- Content (`text`, `src`)
- Logic (`linkedVariable`, `locked`)

### 2. The Loader (`useTemplateLoader`)
- **High Performance Mode**: Checks if `template.elements` exists. If yes, it loads the JSON directly into the editor state. This bypasses the slow iframe extraction process.
- **Legacy Fallback**: If no JSON is found (old templates), it falls back to the `extractElementsFromHTMLAsync` utility to parse the HTML string one last time.

### 3. The Generator (`htmlGenerator.ts`)
Since we don't edit HTML directly, we need a way to generate it for previews and exports.
- **Function**: `generateHtmlFromElements(elements, width, height)`
- **Output**: Returns clean, semantic HTML and CSS strings.
- **Usage**: Called automatically on **Save**. The generated HTML is stored in `htmlTemplate` for backward compatibility with the grid view and other read-only previews.

## Data Flow

1. **Load**: DB (`elements` JSON) -> Redux/State (`visualElements`)
2. **Edit**: User manipulates React components in `Canvas.tsx`.
3. **Save**: 
   - State (`visualElements`) -> DB (`elements` column)
   - Generator -> HTML/CSS -> DB (`htmlTemplate` column for preview)

## Key Files

- `components/custom/TemplateBuilder/types/index.ts`: Defines the `VisualElement` schema.
- `components/custom/TemplateBuilder/utils/htmlGenerator.ts`: Converts JSON to HTML.
- `components/custom/TemplateBuilder/hooks/useTemplateLoader.ts`: Handles loading logic (JSON vs Legacy).
- `components/custom/TemplateBuilder/index.tsx`: Main editor component, handles the Save action.

## Migration Guide
Existing templates will be automatically migrated the next time they are opened and saved in the editor. The loader will parse the old HTML, and the save action will write the new JSON.
