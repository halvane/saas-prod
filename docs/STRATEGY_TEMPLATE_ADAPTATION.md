# Strategy: Brand-Adapted Template System

## Goal
When a user opens the Templates page, they should see **Master Templates** that are:
1.  **Structurally Composed**: Built dynamically from their defined sections (Heroes, Bridges, etc.).
2.  **Brand-Adapted**: Styled with their Brand DNA colors and fonts.
3.  **Content-Populated**: Filled with their specific product images, logos, and AI-generated copy (headlines, CTAs) derived from their Brand Info.

## The Challenge
Our new **Master Templates** are stored as *recipes* (lists of section IDs), not as static HTML files. The current frontend expects static HTML. We need a **Hydration Layer** to bridge this gap.

---

## 1. Architecture: The "Hydration" Pipeline

We will implement a server-side hydration process in `getUserTemplatesAction`.

### Step A: Fetch & Compose
When loading templates:
1.  Identify **Master Templates** (`isMasterLayout: true`).
2.  Read their `sectionComposition` array (e.g., `['hero-impact-overlay', 'bridge-review-card']`).
3.  Fetch the actual HTML/CSS for these sections from the `template_sections` table.
4.  **Stitch** them together:
    *   `htmlTemplate` = `section1.html + section2.html + ...`
    *   `cssTemplate` = `section1.css + section2.css + ...`
    *   `variables` = Merge of all section variables.

### Step B: Content Mapping (The "Brain")
We will enhance `fillTemplateFromMatrix` to intelligently map Brand Assets to Section Variables.

| Section Variable | Source Priority | Fallback |
| :--- | :--- | :--- |
| `{{hero_image}}` | 1. Brand Product Image<br>2. Unsplash (Brand Keywords) | Placeholder |
| `{{headline}}` | 1. Content Matrix `headlines` (AI-generated)<br>2. Brand Tagline | "Your Headline Here" |
| `{{cta_text}}` | 1. Content Matrix `ctas`<br>2. "Shop Now" | "Learn More" |
| `{{brand_logo}}` | 1. Brand Logo URL | Text Brand Name |
| `{{price}}` | 1. Product Price (from DB) | "$99.00" |

### Step C: Visual Adaptation (The "Skin")
The `renderer.ts` already handles CSS Variables. We will ensure all Sections use the standard Brand DNA variables:
*   `var(--brand-primary)`
*   `var(--brand-secondary)`
*   `var(--brand-accent)`
*   `var(--font-heading)`

---

## 2. Scalability & Pagination Strategy (Infinite Scroll)

To support "hundreds of possibilities" with high performance, we will implement a **Deterministic Variation Engine** with pagination.

### The "Infinite Possibility" Algorithm
We won't just show the 17 Master Templates. We will generate variations on the fly based on the requested page number.

**Page 1 (Items 1-20):**
-   **The Core Collection**: The 17 curated Master Templates (Best for new users).
-   **3 Remixes**: Slight variations of the top 3 templates (e.g., different Hero section).

**Page 2+ (Items 21+):**
-   **Algorithmic Remixing**: The system takes a Master Template and swaps sections with compatible alternatives.
    -   *Example*: Take "Social Proof Stack" (Hero + Review Bridge).
    -   *Variation*: Swap "Impact Hero" for "Split Modern Hero".
-   **Content Rotation**: Same layout, but mapped to different products or different content angles (e.g., "Feature Focus" vs "Benefit Focus").

### Pagination Implementation
The `getUserTemplatesAction` will accept `{ page: number, limit: number }`.
-   **Limit**: Default 20.
-   **Logic**:
    -   Fetch Master Templates.
    -   Fetch All Compatible Sections.
    -   If `page > 1`, run `generateVariations(masterTemplates, allSections, seed=page)`.
    -   Hydrate and Map Content.
    -   Return batch.

---

## 3. Implementation Plan

### Phase 1: The Template Hydrator (Server-Side)
Create `lib/templates/hydrator.ts`:
```typescript
export async function hydrateMasterTemplate(masterTemplate: Template) {
  // 1. Fetch sections
  const sections = await db.query.templateSections.findMany({
    where: inArray(templateSections.id, masterTemplate.sectionComposition)
  });
  
  // 2. Sort sections to match composition order
  const orderedSections = mapOrder(sections, masterTemplate.sectionComposition, 'id');
  
  // 3. Concatenate
  return {
    ...masterTemplate,
    htmlTemplate: orderedSections.map(s => s.html).join('\n'),
    cssTemplate: orderedSections.map(s => s.css).join('\n'),
    variables: orderedSections.reduce((acc, s) => ({ ...acc, ...s.variables }), {})
  };
}
```

### Phase 2: Variation Engine
Create `lib/templates/variation-engine.ts`:
-   `generateVariations(templates, sections, count)`
-   Logic to swap sections based on `category` and `compatibility`.

### Phase 3: Enhanced Content Mapper
Update `lib/templates/matrix-mapper.ts` to handle specific section variable patterns:
*   Detect `review_text` -> Map to Content Matrix `reviews` or generic positive sentiment.
*   Detect `stat_number` -> Map to "98%", "10k+", etc.
*   Detect `feature_1`, `feature_2` -> Map to Brand USPs.

### Phase 4: Frontend Integration
Update `app/(dashboard)/templates/actions.ts`:
*   Iterate through fetched templates.
*   If `isMasterLayout`, run `hydrateMasterTemplate`.
*   Then run `fillTemplateFromMatrix`.
*   Return fully ready-to-render templates to the frontend.

Update `app/(dashboard)/templates/page.tsx`:
*   Add `Load More` button.
*   Append new templates to the list.

---

## 4. User Experience

1.  **User visits `/templates`**.
2.  **System loads**:
    *   Fetches User's Brand DNA (e.g., "Nike", "Athletic", "Just Do It").
    *   Fetches User's Products (e.g., "Air Max", "Jordan").
3.  **System processes "Social Proof Stack" Master Template**:
    *   **Hero Section**: Gets "Air Max" image + "Run Faster" headline.
    *   **Review Bridge**: Gets "Best shoes ever!" text.
    *   **Colors**: Applies Nike Black/White/Red.
4.  **User sees**: A fully formed, branded post featuring *their* product.
5.  **User clicks**: Opens the Builder with everything pre-loaded, ready to tweak.

## 4. Why This Approach?
*   **Zero Latency**: No external AI API calls during render (uses pre-computed Content Matrix).
*   **High Relevance**: Users see *their* brand, not generic placeholders.
*   **Scalable**: Works for 10 or 10,000 templates instantly.
