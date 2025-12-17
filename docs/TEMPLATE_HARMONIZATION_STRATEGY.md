# Template Harmonization Strategy

This document outlines the strategy to ensure all Template Sections (Heroes, Products, Footers, etc.) work together seamlessly to create "natural," professional-looking templates.

## 1. The "1080px Budget" System

The core constraint is the **1080px x 1080px** canvas. To ensure sections always fit without overflowing or leaving awkward gaps, we will classify sections into strict **Height Buckets**.

### Height Buckets

| Bucket Name | Height | Usage |
|-------------|--------|-------|
| **Full** | 1080px | Standalone designs (e.g., Quote of the Day, Big Announcement). |
| **Dominant** | 700px | The main focus (Hero). Leaves 380px for a Footer/CTA. |
| **Balanced** | 540px | Split screen (Top/Bottom). Two Balanced sections = 1 Full Template. |
| **Supporting** | 380px | Secondary content (Product List, Testimonial). Pairs with Dominant. |
| **Compact** | 200px | Footers, Headers, simple CTAs. |
| **Micro** | 100px | Branding strips, tickers, spacers. |

### Valid Combinations (The "Recipes")

We will enforce these combinations in the Builder UI to prevent broken layouts:

1.  **The Classic**: Dominant (700px) + Supporting (380px) ≈ 1080px
2.  **The Split**: Balanced (540px) + Balanced (540px) = 1080px
3.  **The Stack**: Supporting (380px) + Supporting (380px) + Compact (320px) ≈ 1080px
    *(Note: We allow a small margin of error, e.g., +/- 20px, handled by the builder's auto-centering)*

## 2. Refactoring Plan: "The Clean Slate"

Current sections often have hardcoded positioning (`absolute top-0`) and inconsistent padding. We will refactor all sections to follow these rules:

### Rule 1: No Internal Positioning
**Bad:**
```html
<div class="absolute top-0 left-0 w-full h-[600px] ...">
```
**Good:**
```html
<div class="w-full h-full flex flex-col ...">
```
*Reasoning*: The Builder logic (`lib/builder/library.ts`) is responsible for placing the section at `top: X`. The section itself should just fill the container it's given.

### Rule 2: Standardized Padding (The "Grid")
To ensure text aligns vertically across different sections:
*   **Horizontal Padding**: Always use **`px-12` (48px)** or **`px-16` (64px)**.
*   **Safe Zone**: No critical content within 40px of the edge.

### Rule 3: Z-Index Layers
Standardize `z-index` to prevent layering issues:
*   `z-0`: Backgrounds (Images, Colors)
*   `z-10`: Standard Content (Text, Cards)
*   `z-20`: Interactive/Floating Elements (Buttons, Badges)
*   `z-30`: Overlays (Gradients, Textures)

## 3. Visual "Glue" Strategy

How to make separate sections look like one cohesive design:

### A. The "Transparent Default"
All sections must default to a **transparent background**.
*   *Why?* This allows a global background (image or gradient) applied to the *Template* to show through all sections, instantly unifying them.
*   *Exception*: "Card" sections or specific "Split" designs that require a background color.

### B. Typography Scale
Enforce a strict typography scale using Tailwind classes mapped to Brand DNA:
*   **Headline**: `text-5xl` or `text-6xl` + `font-heading`
*   **Subhead**: `text-2xl` or `text-3xl` + `font-body`
*   **Body**: `text-lg` or `text-xl` + `font-body`
*   **Caption**: `text-sm` + `font-body` + `uppercase tracking-widest`

### C. "Connector" Elements
Introduce a new category of sections called **Connectors**:
*   **Dividers**: Lines, Waves, Zig-zags (Height: 50-100px).
*   **Fades**: Gradient fades to smooth transitions between contrasting backgrounds.

## 4. Advanced Harmonization Techniques (The "Pro" Look)

Based on analysis of high-converting social media designs, we are implementing these advanced techniques to break the "blocky" look.

### A. The "Bridge" Technique (Overlapping)
**Concept**: Elements that physically cross the boundary between two sections destroy the illusion of separate blocks.
*   **Implementation**: Use negative margins (`-mt-12`) or absolute positioning with `z-20` to make an element (like a Price Bubble, Avatar, or Product Image) hang halfway off its own section and into the next.
*   **Example**: A "Review Card" in the bottom section has an Avatar that pops up into the Hero image above it.

### B. Global Texture Layers (The "Atmosphere")
**Concept**: A subtle texture overlay that sits on top of *all* sections makes them feel like they exist in the same physical space (e.g., printed on the same paper).
*   **Implementation**: A `z-50` pointer-events-none overlay covering the entire 1080x1080 canvas.
*   **Textures**:
    *   *Shadows*: Leaf shadows, window blinds (adds depth).
    *   *Grain*: Film grain, paper texture (adds warmth).
    *   *Light Leaks*: Subtle gradients (adds energy).

### C. Shape Dividers (Organic Flow)
**Concept**: Straight horizontal lines are boring and artificial. Real design uses curves and angles.
*   **Implementation**:
    *   **Curves**: SVG waves at the bottom of a Hero section.
    *   **Diagonals**: Angled backgrounds (`clip-path: polygon(...)`) to create dynamic energy.
    *   **Torn Paper**: Rough edges for a casual/creative vibe.

### D. Framing Devices
**Concept**: Instead of full-width backgrounds, use "containers" that span across sections.
*   **Film Strips**: A tilted film strip container that holds images from the Hero AND the Body section.
*   **Polaroids**: White frames with shadows that can be scattered across the canvas, ignoring section boundaries.

## 5. Implementation Checklist


For every section in `lib/builder/sections/`:

- [ ] **Height Check**: Does it fit into a Bucket (700, 540, 380, 200)?
- [ ] **Positioning**: Removed `absolute top-0`?
- [ ] **Padding**: Is `px-12` or `px-16` used?
- [ ] **Background**: Is it transparent by default (unless necessary)?
- [ ] **Variables**: Are colors using `var(--brand-...)`?

## 5. Next Steps

1.  **Audit**: Run a script to scan all sections and report their heights and padding classes.
2.  **Refactor**: Update `heroes.ts`, `footers.ts`, etc., to match the new rules.
3.  **Update Builder**: Modify `buildTemplateFromSections` to enforce the "Recipes" logic (preventing users from picking 3 Hero sections).
