# Master Layout Strategy: The "Skeleton" System

This document defines the strategy for creating **Master Layouts** (Placeholder Templates). These are structural blueprints that guarantee professional, "designer-quality" results by baking in harmonization rules, overlapping techniques, and visual hierarchy before any content is added.

## 1. The Philosophy: "Smart Layers"

To achieve "natural" templates that don't look like stacked blocks, we move beyond simple vertical stacking. Every Master Layout consists of four conceptual layers:

1.  **Layer 0: The Canvas (Global Background)**
    *   A single image, gradient, or solid color that spans the full 1080px height.
    *   *Role*: Unifies the design instantly.
2.  **Layer 1: The Structure (Sections)**
    *   The vertical stack of components (Hero, Body, Footer).
    *   *Crucial Rule*: Most sections must have **transparent backgrounds** to let Layer 0 show through.
3.  **Layer 2: The Bridge (Overlaps)**
    *   Specific elements (Cards, Images, Buttons) that physically cross section boundaries using negative margins (`-mt-12`) or absolute positioning.
4.  **Layer 3: The Atmosphere (Overlays)**
    *   Global textures (grain, shadows, light leaks) or frames (borders, film strips) that sit on top of everything (`z-50`).

## 2. The 5 Core Archetypes

We will create empty placeholder templates for these 5 archetypes, which cover 95% of social media use cases.

### Archetype A: "The Heroic Bridge"
*   **Best For**: Product Highlights, Personal Branding, Announcements.
*   **Structure**:
    *   **Top**: Dominant Hero (700px).
    *   **Bottom**: Supporting Content (380px).
*   **The "Pro" Trick**:
    *   The Bottom section contains a **Floating Card** with a negative top margin (`-mt-24`).
    *   *Result*: The content card sits "on top" of the hero image, creating depth.
*   **Placeholder Config**:
    *   `Hero`: "Impact Image" (Placeholder Img)
    *   `Footer`: "Floating Card" (Placeholder Text)

### Archetype B: "The Cinematic Frame"
*   **Best For**: Lifestyle, Fashion, Travel, "Vibe" posts.
*   **Structure**:
    *   **Layer 0**: Full-height Background Image.
    *   **Layer 3**: A "Frame" Overlay (Polaroid, Film Strip, Minimal Border).
    *   **Sections**:
        *   Top: Minimal Text (Date/Location).
        *   Bottom: Caption/Quote.
*   **The "Pro" Trick**:
    *   The Frame is a `z-50` PNG overlay. The content sections are padded to fit *inside* the frame.

### Archetype C: "The Organic Flow"
*   **Best For**: Health, Wellness, Food, Eco-friendly brands.
*   **Structure**:
    *   **Top**: Hero with **Shape Divider** (Wave/Curve) at the bottom.
    *   **Bottom**: Solid color matching the Shape Divider.
*   **The "Pro" Trick**:
    *   Seamless transition. The curve makes it look like one continuous liquid shape.

### Archetype D: "The Object Focus" (The "Pop-Out")
*   **Best For**: E-commerce, Gadgets, Shoes.
*   **Structure**:
    *   **Layer 0**: Dynamic Gradient.
    *   **Center**: A "Product" section where the image is scaled to 110% and has a drop shadow.
    *   **Top/Bottom**: "Micro" sections for Branding and Price.
*   **The "Pro" Trick**:
    *   The Product Image has `z-20` and overlaps the text behind it (or the text overlaps the image).

### Archetype E: "The Editorial Grid"
*   **Best For**: Lists, Tips, Educational Content.
*   **Structure**:
    *   **Top**: Compact Header (Title).
    *   **Middle**: "List" Section (3-4 items).
    *   **Bottom**: Compact Footer (CTA).
*   **The "Pro" Trick**:
    *   Alternating background colors for list items, or a "Glassmorphism" effect over a blurred background.

## 3. Implementation Strategy: "Smart Seeds"

We will not just seed "Sections"; we will seed **Full Templates** that act as these placeholders.

### Step 1: Create "Bridge" Sections
We need specific sections designed to overlap.
*   `footer-bridge-card`: A footer with a white card that has `-mt-20`.
*   `hero-overlap-text`: A hero where the text sits very low, intended to be covered partially.

### Step 2: Create "Frame" Overlays
We need a library of transparent PNG frames stored in `public/assets/frames/`.
*   `polaroid.png`
*   `film-strip.png`
*   `phone-mockup.png`

### Step 3: The "Placeholder Generator" Script
We will create a script `scripts/seed-placeholders.ts` that generates these templates.

**Example JSON Structure for a Placeholder:**
```json
{
  "name": "Archetype A - Heroic Bridge",
  "category": "placeholder",
  "elements": [
    { "type": "section", "id": "hero-impact-image", "props": { "image": "placeholder.jpg" } },
    { "type": "section", "id": "footer-bridge-card", "props": { "title": "Insert Title", "text": "Insert text here..." } }
  ],
  "global_settings": {
    "background": "#f3f4f6",
    "overlay": null
  }
}
```

## 4. Execution Roadmap

1.  **Design the "Bridge" Sections**: Create the HTML/Tailwind for sections that support negative margins.
2.  **Design the "Frame" Overlays**: Create/Source the PNG assets.
3.  **Build the Placeholders**: Assemble the sections into the 5 Archetypes.
4.  **Seed**: Run the script to populate the DB with these "Starter Templates".

## 5. User Workflow

1.  User clicks "Create New".
2.  User sees "Choose a Layout" (The 5 Archetypes).
3.  User selects "Heroic Bridge".
4.  The Builder loads with the structure pre-filled.
5.  User just swaps the image and text. **The overlap and harmony are already there.**
