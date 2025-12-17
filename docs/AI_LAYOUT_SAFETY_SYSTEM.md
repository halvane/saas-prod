# AI Layout Safety & Professionalism Architecture
*Code Name: "The Iron Grid"*

This document defines the strict rule system that ensures AI-generated templates are **unbreakable**, **professional**, and **human-quality**. It prevents "robotic" errors like text overflow, overlapping elements, and poor contrast.

## 1. The "Elastic Box" Philosophy
To prevent elements from going out of borders, we move away from rigid pixel-perfect absolute positioning for *content* and adopt a **Hybrid Anchor System**.

### A. The Container Hierarchy
Every section is composed of three layers:
1.  **The Canvas (Absolute)**: The root container of the section (fixed height).
2.  **The Grid (Relative)**: A CSS Grid/Flex overlay that defines "Safe Zones".
3.  **The Content (Fluid)**: Text and images live inside the Grid, never floating freely without constraints.

**Rule:** *AI never places text at `top: 123px`. AI places text in `grid-area: headline`.*

### B. Safe Zones & Padding
*   **Global Padding**: All sections enforce a minimum `padding: var(--safe-zone)` (e.g., 60px) from the edges.
*   **No-Go Zones**: The edges of the canvas are strictly reserved for background elements only. Content entering the "Danger Zone" is automatically pushed back.

## 2. Smart Typography Engine (Text Safety)
Handling long text is the #1 failure point of AI generation. We implement a **Triple-Defense System**.

### Defense 1: CSS Line Clamping
Every text element MUST have a line limit based on its role.
```css
.headline {
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Max 3 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### Defense 2: Fluid Typography (`clamp()`)
Font sizes are never static. They adapt to the viewport and container width.
```css
font-size: clamp(2rem, 5vw, 4rem); /* Minimum 2rem, Ideal 5vw, Max 4rem */
```

### Defense 3: The "Fit-Text" Observer (Runtime)
A small JS utility that runs after rendering. If text overflows its container:
1.  Reduce font size by 10%.
2.  If still overflowing, reduce line-height.
3.  If still overflowing, truncate with ellipsis `...`.

## 3. Visual Hierarchy & Contrast Guard
To ensure "Professional" results, we enforce strict contrast rules.

### A. The "Text-on-Image" Law
**Rule:** Text NEVER sits directly on a raw image.
*   **Mandatory Overlay**: If text is placed over an image, a `gradient-overlay` or `solid-backdrop` (glassmorphism) is **automatically injected**.
*   **Contrast Check**: Text color is forced to `white` on dark backgrounds and `black` on light backgrounds.

### B. Spacing System (The 8pt Grid)
AI cannot choose arbitrary margins like `13px`. It must snap to the **8pt Grid System**:
*   `gap-2` (8px)
*   `gap-4` (16px)
*   `gap-8` (32px)
*   `gap-12` (48px)

## 4. Asset Integrity (No Stretching)
**Rule:** Images are strictly controlled to prevent distortion.
*   **Object-Fit**: ALL images must use `object-fit: cover` or `contain`.
*   **Aspect Ratio Locking**: Containers enforce aspect ratios (`aspect-video`, `aspect-square`) to prevent layout shifts.

## 5. The "Linter" Agent (Validation Step)
Before showing a template to the user, a lightweight "Linter" runs checks:
1.  **Collision Detection**: Do two absolute elements overlap unintentionally? -> *Move them apart.*
2.  **Empty Check**: Are any variables (e.g., `{{headline}}`) empty? -> *Inject fallback content.*
3.  **Boundary Check**: Is any element `left < 0` or `right > 100%`? -> *Clamp to 0-100%.*

## 6. Implementation Strategy (Tailwind)

We will create a set of **Utility Classes** that the AI *must* use.

| Utility Class | Purpose |
| :--- | :--- |
| `.safe-text` | Enforces line-clamp and overflow hiding. |
| `.smart-grid` | Creates a 12-column grid with safe margins. |
| `.auto-contrast` | Adds a background dim if text is white. |
| `.img-cover` | Enforces `object-fit: cover` and `width: 100%`. |
| `.anchor-bottom-left` | Positions element safely in the bottom-left corner. |

## 7. Example: The "Unbreakable" Hero

```html
<!-- The Canvas -->
<div class="relative w-full h-[600px] overflow-hidden">
  
  <!-- Background (Safe to bleed) -->
  <img src="..." class="absolute inset-0 w-full h-full object-cover" />
  
  <!-- Contrast Guard -->
  <div class="absolute inset-0 bg-black/40"></div>

  <!-- The Grid (Safe Zone) -->
  <div class="absolute inset-0 p-12 flex flex-col justify-center items-start">
    
    <!-- Content (Fluid & Clamped) -->
    <h1 class="text-white font-bold text-6xl line-clamp-3 max-w-3xl">
      {{headline}}
    </h1>
    
    <p class="text-white/90 text-xl mt-6 line-clamp-2 max-w-2xl">
      {{subheadline}}
    </p>

    <!-- Button (Anchored) -->
    <button class="mt-8 px-8 py-4 bg-blue-600 text-white rounded-lg hover:scale-105 transition">
      {{cta}}
    </button>

  </div>
</div>
```

## 8. Pro Design Standards (The "Perfect Pixel" Rules)
To achieve "ultra-professional" results, we enforce strict design constraints beyond just safety.

### A. Typography Scale (No Random Sizes)
AI must strictly adhere to the **Pro Type Scale**. No arbitrary pixel values (e.g., `17px`).
*   **Headlines**: Use `.pro-h1` (60px), `.pro-h2` (48px), `.pro-h3` (32px).
*   **Body**: Use `.pro-body` (18px) for readability.
*   **Captions**: Use `.pro-caption` (14px, uppercase, tracking-wide).

### B. Visibility & Contrast (The "Never Light-on-Light" Rule)
*   **Text Shadow**: Use `.text-shadow-sm` for subtle lift on mixed backgrounds.
*   **Glass Panels**: Use `.glass-panel` for text blocks over busy images.
*   **Dark Panels**: Use `.dark-panel` for high-contrast text blocks.
*   **Gradient Overlays**: ALWAYS use `.auto-contrast-dark` when placing white text over a user-uploaded image.

### C. Positioning & Spacing
*   **Safe Padding**: Always use `.safe-padding` (var(--safe-zone)) to keep content away from edges.
*   **Vertical Rhythm**: Use `.safe-margin-bottom` (2rem) between headings and body text.
*   **Centering**: Use `.center-absolute` to perfectly center content without manual calculation.

### D. Color Logic
*   **Brand Colors**: Use `var(--brand-primary)` for main text, `var(--brand-accent)` for CTAs.
*   **Neutral Text**: Use `text-white` on dark backgrounds, `text-gray-900` on light backgrounds. NEVER use pure black (`#000`).

---

**Status**: Ready for Implementation.
**Action**: Say "GO" to apply these rules to the codebase.
