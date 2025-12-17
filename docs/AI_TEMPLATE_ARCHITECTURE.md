# AI-Driven Creative Engine Architecture
> **Objective**: Transform the static template system into a dynamic, AI-powered creative engine capable of generating "human-quality" social media ads by intelligently selecting, composing, and styling sections based on user intent, brand DNA, and marketing psychology.

## 1. Core Philosophy: "Metadata is the Interface"
To achieve high creativity with low AI cost, we decouple the **Selection Phase** from the **Rendering Phase**. The LLM never sees the full HTML during selection. Instead, it interacts with a rich **Semantic Metadata Layer**.

*   **Current System**: `ID` + `HTML` (Too simple, AI guesses based on name).
*   **New System**: `ID` + `Psychological Profile` + `Visual Semantics` + `Conversion Intent`.

## 2. Enhanced Data Schema
We will extend the `Section` interface to include a `meta` object. This is the only part the AI "reads" to make decisions.

```typescript
// lib/builder/types.ts (Proposed)

export type Mood = 'energetic' | 'calm' | 'trustworthy' | 'luxury' | 'playful' | 'urgent' | 'minimalist';
export type Purpose = 'conversion' | 'awareness' | 'engagement' | 'education' | 'social-proof';
export type VisualDensity = 'low' (text heavy) | 'balanced' | 'high' (image heavy);

export interface SectionMetadata {
  // AI-Optimized Description (for Vector Embeddings)
  // e.g., "A high-impact hero section with split layout, ideal for fashion brands showcasing a single hero product with urgent CTA."
  llmDescription: string; 
  
  // Categorization Tags
  tags: string[]; // ['sale', 'summer', 'tech', 'dark-mode', 'typography-focus']
  
  // Psychological Profiling
  mood: Mood[];
  purpose: Purpose[];
  
  // Visual Characteristics
  visualDensity: VisualDensity;
  compatibleBackgrounds: ('solid' | 'gradient' | 'image' | 'video')[];
  
  // Performance Scoring (Reinforcement Learning placeholder)
  performanceScore?: number; // 0-100, updates based on user "saves"
}

export interface Section {
  id: string;
  name: string;
  category: 'header' | 'hero' | 'product' | 'footer' | 'overlay' | 'text' | 'badge';
  height: number;
  html: string;
  variables: Record<string, any>;
  
  // NEW: The Brain
  meta: SectionMetadata;
}
```

## 3. The Selection Engine (Algorithm)

The selection process mimics a human designer's thought process: **Understand Context -> Filter Options -> Rank by Fit -> Assemble.**

### Step 1: Intent Analysis (LLM - Cheap Model)
**Input**: "Make a high-energy instagram story for a summer sale on sneakers."
**Output (JSON)**:
```json
{
  "target_mood": ["energetic", "urgent"],
  "target_purpose": "conversion",
  "visual_preference": "high",
  "keywords": ["sneakers", "summer", "sale", "sport"]
}
```

### Step 2: Semantic Filtering (Vector Search + Rules)
Instead of asking the LLM to pick from 500 templates (context limit issues), we use a **RAG (Retrieval-Augmented Generation)** approach.

1.  **Hard Filter**: Exclude sections that don't match the `category` (Header/Hero/etc).
2.  **Soft Filter**: Prioritize sections where `meta.mood` overlaps with `target_mood`.
3.  **Vector Search**: Compare `keywords` embedding with `meta.llmDescription` embedding.
    *   *Example*: "Sneakers" matches "Split Modern Hero" (high visual) better than "Text Only Hero".

### Step 3: Composition & Assembly
The engine selects the top 1 candidate for each required slot (Header, Hero, Product, Footer).

*   **Constraint Checking**: Ensure visual consistency.
    *   *Rule*: If `Hero` is "Dark Mode", `Footer` must support "Dark Mode" or be neutral.
    *   *Rule*: If `VisualDensity` is "High" for Hero, choose "Low" for Body to avoid clutter.

## 4. Dynamic Styling & "Human Touch"
To avoid the "boring static HTML" look, we introduce **Style Modifiers** injected at runtime.

### A. Smart CSS Variables
We expand the Brand DNA to include "Contextual Variables" that change based on the ad's intent.
*   `--layout-gap`: Tight (urgent) vs Loose (luxury).
*   `--border-radius`: 0px (sharp/tech) vs 20px (friendly/consumer).
*   `--shadow-depth`: Flat vs Deep.

### B. Layout Variants
Sections can have internal logic (using CSS classes) to toggle layouts without changing HTML structure.
*   `<div class="hero {{layout_variant}}">`
*   AI selects `layout_variant`: `'image-left'` or `'image-right'` or `'image-bottom'` based on the image aspect ratio provided.

## 5. Centralized Asset & Effect System (The "Visual Core")
This system will be centralized and accessible across the entire platform (Editor, AI Generator, Manual Builder).

### A. Asset Integration (Pixabay/Unsplash/Vectors)
*   **Unified Asset Provider**: A single API layer (`lib/assets/provider.ts`) that aggregates Unsplash (Photos), Pixabay (Vectors/Illustrations), and Brand Assets.
*   **AI Selection**: The "Designer Agent" can request specific asset types:
    *   `"illustration:startup-rocket"` -> Fetches vector from Pixabay.
    *   `"photo:happy-team"` -> Fetches photo from Unsplash.
*   **Editor Integration**: The Left Sidebar in the editor will pull from this same centralized system, allowing users to swap AI-selected assets manually.

### B. Professional Effect Library (CSS-in-JS / Tailwind Classes)
We will define a standardized "Effect Registry" that the AI can apply to *any* element (Text, Image, Container).

**Shadows & Depth**
*   `effect-shadow-soft`: Soft drop shadow
*   `effect-shadow-long`: Long shadow (trend)
*   `effect-shadow-inner`: Inner shadow
*   `effect-shadow-ambient`: Ambient shadow (diffuse)
*   `effect-shadow-text`: Text shadow (subtle)
*   `effect-glow-soft`: Glow (soft)
*   `effect-glow-neon`: Glow (neon)
*   `effect-reflection`: Soft reflection
*   `effect-depth-layering`: Depth layering (foreground/mid/background)

**Borders & Strokes**
*   `effect-stroke-outer`: Outer stroke (outline)
*   `effect-stroke-inner`: Inner stroke
*   `effect-stroke-gradient`: Gradient stroke
*   `effect-corner-rounded`: Rounded corners
*   `effect-corner-soft`: Soft corner radius (cards)
*   `effect-corner-hard`: Hard corner radius (posters)
*   `effect-border-minimal`: Minimal border frame

**Backgrounds & Fills**
*   `effect-bg-solid`: Solid background fill
*   `effect-bg-gradient-linear`: Linear gradient background
*   `effect-bg-gradient-radial`: Radial gradient background
*   `effect-bg-mesh`: Mesh / multi-stop gradient
*   `effect-bg-split`: Split color background

**Image Processing (CSS Filters)**
*   `effect-filter-duotone`: Duotone image
*   `effect-filter-monotone`: Monotone image
*   `effect-filter-bw`: Black & white
*   `effect-filter-sepia`: Sepia
*   `effect-filter-contrast-high`: High contrast
*   `effect-filter-matte`: Soft contrast / matte
*   `effect-filter-vibrance`: Vibrance boost
*   `effect-filter-blur`: Blur background
*   `effect-glass`: Frosted glass blur

**Overlays & Textures**
*   `effect-overlay-vignette`: Vignette
*   `effect-overlay-lightleak`: Light leak overlay
*   `effect-overlay-tint`: Color overlay / tint
*   `effect-overlay-dark`: Dark overlay (text readability)
*   `effect-texture-grain`: Grain / noise texture
*   `effect-texture-paper`: Paper texture
*   `effect-texture-film`: Film texture

**Creative Shapes & Masks**
*   `effect-mask-circle`: Mask shapes (circle)
*   `effect-mask-blob`: Mask shapes (blob)
*   `effect-clip-frame`: Image clipping (frame)
*   `effect-cutout-shadow`: Sticker / cut-out shadow
*   `effect-cutout-outline`: Outline cut-out effect
*   `effect-frame-polaroid`: Polaroid frame
*   `effect-shape-ribbon`: Badge / label ribbon
*   `effect-shape-diagonal`: Diagonal section cut

**Text Highlights**
*   `effect-text-gradient`: Gradient text
*   `effect-highlight-underline`: Highlight underline
*   `effect-highlight-brush`: Marker / brush highlight
*   `effect-highlight-pill`: Text background pill
*   `effect-text-fade`: Opacity fade edges

### C. Positioning & Transformation
*   **Free Positioning**: The architecture supports `position: absolute` with `top/left/rotation` coordinates, allowing the AI to place "Stickers" or "Vectors" arbitrarily, not just in grid slots.
*   **Rotation**: `transform: rotate(Ndeg)` supported on all elements.

## 6. Cost & Performance Strategy

| Feature | Strategy | Benefit |
| :--- | :--- | :--- |
| **Token Cost** | Feed only `meta` JSON to LLM, not HTML. | **90% reduction** in prompt size. |
| **Latency** | Pre-compute Vector Embeddings for all sections. | **<50ms** search time. |
| **Quality** | "Few-Shot Prompting" with examples of high-performing ads. | AI mimics top-tier design patterns. |
| **Scalability** | New sections added to `sections/*.ts` are auto-indexed. | Zero-maintenance scaling. |

## 6. Implementation Roadmap

1.  **Phase 1: Data Enrichment (Immediate)**
    *   Update `types.ts` with `SectionMetadata`.
    *   Refactor existing `sections/*.ts` to include rich metadata.

2.  **Phase 2: The "Designer" Agent**
    *   Create `lib/ai/designer.ts`.
    *   Implement `analyzeIntent(prompt)` -> returns structured design goals.
    *   Implement `selectSections(goals)` -> returns list of Section IDs.

3.  **Phase 3: Vector Search (Optional but Recommended)**
    *   Use Vercel Postgres (pgvector) or a simple in-memory cosine similarity search (if <1000 templates) to match descriptions.

4.  **Phase 4: The "Assembler"**
    *   Update `TemplateBuilder` to accept an "AI Generated" plan and render it instantly.

## 7. Example of AI Decision Flow

**User**: "I need a trustworthy testimonial for my law firm."

**AI "Designer" Agent**:
1.  **Analysis**: Mood=`trustworthy`, Industry=`legal`, Purpose=`social-proof`.
2.  **Search**: Looks for `category: text` + `tag: testimonial`.
3.  **Ranking**:
    *   *Option A (Neon Cyber Testimonial)*: Mood=`energetic`. **Score: 20/100**.
    *   *Option B (Minimal Serif Card)*: Mood=`trustworthy`, `luxury`. **Score: 95/100**.
4.  **Selection**: Picks Option B.
5.  **Refinement**: Sets `--font-heading` to a Serif font (if available in Brand DNA) to reinforce "Law Firm" vibe.

---
**Status**: Ready for Review.
**Next Step**: If approved, I will implement the `SectionMetadata` interface and update the library files.
