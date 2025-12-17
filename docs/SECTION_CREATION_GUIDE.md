# Section Creation Guide

This guide details the architecture and best practices for creating reusable **Sections** for the Template Builder. Sections are the fundamental building blocks (Heroes, Footers, Features, etc.) that are composed to create full social media templates.

## 1. Architecture Overview

Sections are stored in the `template_sections` database table and are dynamically loaded by the Builder. Unlike static templates, sections are designed to be mix-and-match components.

### Data Model (`template_sections`)

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Internal descriptive name (e.g., "Modern Hero 1") |
| `category` | `string` | `hero`, `features`, `footer`, `overlay`, `text`, `product` |
| `html` | `text` | The raw HTML structure with Tailwind classes |
| `css` | `text` | Scoped CSS (optional, prefer Tailwind) |
| `variables` | `json` | Array of variable keys used in the HTML (e.g., `["headline", "cta_text"]`) |
| `tags` | `string[]` | Metadata for AI retrieval (e.g., `["minimal", "dark-mode"]`) |

## 2. The Canvas Environment

All sections are rendered within a fixed-size container, typically **1080x1080px** (Instagram Post standard).

*   **Width**: Always assume `100%` width corresponds to `1080px`.
*   **Height**: Sections should have a defined height or be flexible.
    *   *Overlays*: `height: 100%` (cover the whole canvas).
    *   *Heroes/Content*: Fixed height (e.g., `500px`) or auto-calculated.
*   **Positioning**:
    *   The Builder stacks sections vertically using `transform: translateY(...)`.
    *   Avoid `position: fixed`. Use `position: absolute` with caution inside the section.

## 3. Creating a Section

### A. HTML Structure & Tailwind

Use standard HTML5 with Tailwind CSS v4.

```html
<!-- Good Example: Hero Section -->
<div class="w-full h-[600px] flex flex-col items-center justify-center p-12 text-center">
  <h1 class="text-6xl font-bold mb-6 text-[var(--brand-primary)] font-heading">
    {{ headline }}
  </h1>
  <p class="text-2xl text-gray-600 mb-8 font-body max-w-2xl">
    {{ subheadline }}
  </p>
  <div class="bg-[var(--brand-accent)] text-white px-8 py-4 rounded-full text-xl font-bold">
    {{ cta_text }}
  </div>
</div>
```

### B. Dynamic Variables

Use Handlebars-style syntax `{{ variable_name }}` to make content dynamic. The Builder automatically detects these and creates input fields for the user.

**Standard Variable Names:**
*   `{{ headline }}`
*   `{{ subheadline }}`
*   `{{ cta_text }}`
*   `{{ image_url }}` (for `src` attributes)
*   `{{ price }}`
*   `{{ product_name }}`

### C. Brand System Integration (CSS Variables)

**CRITICAL**: Never hardcode colors or fonts. Always use the CSS variables provided by the `BrandDNA` system.

| CSS Variable | Usage |
|--------------|-------|
| `--brand-primary` | Main brand color (headings, primary elements) |
| `--brand-secondary` | Secondary color (backgrounds, accents) |
| `--brand-accent` | Call-to-action buttons, highlights |
| `--font-heading` | The brand's chosen heading font family |
| `--font-body` | The brand's chosen body text font family |

**Example Usage:**
```html
<h2 style="font-family: var(--font-heading); color: var(--brand-primary);">
  Title
</h2>
```
*Note: Tailwind arbitrary values `text-[var(--brand-primary)]` are supported and recommended.*

## 4. Effects System

Effects (Shadows, Glows, Borders) are managed via the `EffectRegistry` and applied as utility classes.

*   **Do not** hardcode complex box-shadows in the section HTML if they are meant to be user-changeable.
*   **Do**: Use standard Tailwind classes for structural styling (padding, layout).

## 5. Best Practices

1.  **Scoped Styling**: Avoid global tag selectors (`h1 { ... }`). Use classes or inline styles to prevent bleeding into other sections.
2.  **Images**: Use `object-cover` for background images to ensure they fill their container without distortion.
    ```html
    <img src="{{ image_url }}" class="absolute inset-0 w-full h-full object-cover -z-10" />
    ```
3.  **Text Overflow**: Always account for variable text lengths. Use `overflow-hidden` or `line-clamp` where appropriate.
4.  **Contrast**: Ensure text is readable against backgrounds. Use semi-transparent overlays if necessary.
    ```html
    <div class="absolute inset-0 bg-black/50"></div> <!-- Dark overlay -->
    ```

## 6. Workflow: Adding a New Section

1.  **Design**: Create the HTML/Tailwind markup in a scratchpad or the `template-builder` dev tool.
2.  **Tokenize**: Replace static text/colors with `{{ variables }}` and `var(--brand-...)`.
3.  **Register**:
    *   **Option A (Database)**: Use the Admin Dashboard (`/admin/sections/new`) to insert it directly.
    *   **Option B (Seeding)**: Add it to `lib/builder/library.ts` and run `npm run seed:sections`.

## 7. Example: "Product Showcase" Section

```typescript
// lib/builder/sections/products.ts

export const PRODUCT_SHOWCASE_1: Section = {
  id: 'product-showcase-1',
  name: 'Minimal Product Card',
  category: 'product',
  height: 600, // Explicit height for stacking calculations
  html: `
    <div class="w-full h-full flex items-center justify-center p-8 bg-white">
      <div class="relative w-full max-w-lg aspect-square rounded-3xl overflow-hidden shadow-xl">
        <!-- Product Image -->
        <img src="{{ product_image }}" class="w-full h-full object-cover" />
        
        <!-- Price Tag Overlay -->
        <div class="absolute bottom-6 right-6 bg-white/90 backdrop-blur px-6 py-3 rounded-full">
          <span class="text-2xl font-bold text-[var(--brand-primary)] font-heading">
            {{ price }}
          </span>
        </div>
      </div>
    </div>
  `,
  variables: {
    product_image: 'https://via.placeholder.com/600',
    price: '$99.00'
  },
  metadata: {
    tags: ['minimal', 'clean', 'product-focus']
  }
};

## 9. Advanced Techniques for "Natural" Flow

To implement the "Pro" harmonization techniques:

### A. Implementing "The Bridge" (Overlapping Elements)
To make an element (like a price tag or avatar) overlap into the *next* section:
1.  **Negative Margin**: Use `-mb-12` (negative margin bottom) on the element in the top section.
2.  **Z-Index**: Ensure the overlapping element has `z-20` or higher so it sits on top of the next section's background.
3.  **Pointer Events**: If it's just visual, use `pointer-events-none` to avoid blocking clicks in the section below.

```html
<!-- Example: Price Bubble hanging off the bottom -->
<div class="absolute -bottom-8 right-12 z-20 bg-white p-4 rounded-full shadow-xl">
  {{ price }}
</div>
```

### B. Implementing Shape Dividers
To create a curved or angled bottom edge:
1.  **Clip Path**: Use CSS `clip-path` on the container.
    *   *Angle*: `clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);`
2.  **SVG Divider**: Place an SVG at the absolute bottom of the section.
    ```html
    <div class="absolute bottom-0 left-0 w-full leading-none text-white">
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" class="w-full h-[50px] fill-current">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
      </svg>
    </div>
    ```

### C. Implementing Global Textures
Textures are usually implemented as a separate "Overlay" section that covers the full 1080x1080 canvas.
*   **Blend Modes**: Use `mix-blend-overlay` or `mix-blend-multiply` to blend the texture with the content below.
*   **Opacity**: Keep it subtle (opacity 10-30%).

```html
<!-- Texture Overlay Section -->
<div class="absolute inset-0 w-full h-full pointer-events-none z-50 mix-blend-overlay opacity-20" 
     style="background-image: url('{{ texture_url }}'); background-size: cover;">
</div>
```


## 8. Composition & Visual Consistency

To ensure different sections look like a cohesive design when stacked:

### A. The "Vertical Budget" (1080px)
The canvas is fixed at **1080px height**. You must budget your sections accordingly.
*   **Hero**: Typically 600px - 800px.
*   **Footer/CTA**: Typically 200px - 400px.
*   **Strategy**: Design sections to be flexible or provide variants (e.g., "Hero - Tall", "Hero - Short").

### B. Seamless Edges
To avoid "hard cuts" between sections:
1.  **Transparent Backgrounds**: By default, make section backgrounds transparent so the global background color (or a full-height background image) shows through.
2.  **Matching Backgrounds**: If a section needs a specific background color, ensure it matches the adjacent section or uses a deliberate separator (like a border or wave SVG).

### C. Spacing Rhythm
Standardize padding to ensure alignment.
*   **Horizontal Padding**: Use `px-12` (48px) or `px-16` (64px) as the standard side margin for text.
*   **Vertical Padding**: Use `py-8` or `py-12` to prevent content from touching the section edges.

### D. Z-Index Layering
*   **Base (z-0)**: Background images/colors.
*   **Content (z-10)**: Text, buttons, product images.
*   **Overlays (z-20)**: Gradients, texture overlays that sit on top of everything.
*   **Floating Elements (z-30)**: Badges, stickers.

```
