# Content Matrix System Architecture

## Overview

The **Content Matrix System** is a high-performance, cost-effective architecture for populating thousands of social media templates with brand-specific content. 

It replaces the traditional "Per-Template AI Generation" model with a **"Generate Once, Map Many"** pattern.

### The Problem (Old Approach)
Previously, to fill 100 templates, the system would:
1. Loop through each template.
2. Send the template schema + Brand DNA to the AI.
3. Wait for generation.
4. Repeat 100 times.

**Issues:**
- **High Cost:** 100 API calls per user.
- **High Latency:** Minutes of waiting time.
- **Redundancy:** The AI generates similar "headlines" and "CTAs" over and over.

### The Solution (Content Matrix)
The new system separates **Content Generation** from **Template Mapping**.

1. **Generation (O(1)):** We make **ONE** AI call to generate a "Content Matrix" — a pool of brand-aligned assets (headlines, quotes, CTAs, body text).
2. **Mapping (O(N)):** We locally map these assets to templates using intelligent heuristics.

**Benefits:**
- **99% Cost Reduction:** 1 call vs 100 calls.
- **Instant Results:** Mapping 1000 templates takes milliseconds.
- **Consistency:** All content comes from the same approved "pool".

---

## Architecture Components

### 1. Database Schema (`brand_settings`)
We added a `contentMatrix` JSON column to the `brand_settings` table. This acts as a cache for the generated assets.

```typescript
// Schema Structure
{
  headlines: string[],    // ["Unlock Your Potential", "Grow Faster..."]
  subheadlines: string[], // ["The ultimate guide to...", "Don't miss out..."]
  ctas: string[],         // ["Sign Up Now", "Learn More"]
  quotes: string[],       // ["Innovation is key...", "Just do it"]
  features: string[],     // ["Fast", "Secure", "Reliable"]
  // ...
}
```

### 2. The Generator (`lib/ai/content-matrix.ts`)
This service handles the interaction with the Vercel AI Gateway.
- **Function:** `getOrCreateContentMatrix(brandId)`
- **Logic:** Checks if a matrix exists in the DB. If not, it prompts the AI (GPT-4o-mini) to generate a diverse set of assets based on the Brand DNA.

### 3. The Mapper (`lib/templates/matrix-mapper.ts`)
This is the "brain" of the local operation. It takes a template's variable schema and finds the best matching content from the matrix **without AI**.

**Heuristic Matching Logic:**
It looks at the variable name (e.g., `headline_1`, `cta_text`) and matches it to the matrix category:

| Template Variable Regex | Matrix Category |
|-------------------------|-----------------|
| `headline`, `title`, `h1` | `matrix.headlines` |
| `sub`, `caption`, `tagline` | `matrix.subheadlines` |
| `cta`, `button`, `action` | `matrix.ctas` |
| `quote` | `matrix.quotes` |
| `feature`, `benefit` | `matrix.features` |
| `image`, `photo`, `bg` | `brandImages` (Logo, Products, General) |
| *Default / Fallback* | `matrix.body_text` |

### Image Handling
The system also handles image variables (`logo`, `productImage`, `background`) by fetching assets from the `brand_settings` and `brand_products` tables.

- **Logo:** Uses `brandSettings.brandLogo`.
- **Products:** Randomly picks from `brandProducts` images.
- **General/Background:** Picks from `brandSettings.brandImages` (or falls back to products).

### 4. The Orchestrator (`app/(dashboard)/brand/actions.ts`)
The server action `generateAllTemplatesJSON` ties it all together:
1. Fetches User's Brand DNA.
2. Calls `getOrCreateContentMatrix` (Fast or Cached).
3. Loops through all templates.
4. Calls `fillTemplateFromMatrix` for each (Instant).
5. Returns the fully populated JSON.

---

## Workflow Diagram

```mermaid
graph TD
    A[User Request] --> B{Matrix Exists?}
    B -- No --> C[Call AI Gateway]
    C --> D[Generate Asset Pool]
    D --> E[Save to DB]
    B -- Yes --> E
    E --> F[Content Matrix (In Memory)]
    
    F --> G[Loop Templates]
    G --> H[Template 1 Schema]
    G --> I[Template 2 Schema]
    G --> J[Template N Schema]
    
    H --> K[Matrix Mapper]
    I --> K
    J --> K
    
    K --> L[Filled Template JSONs]
```

## How to Extend

### Adding New Categories
1. Update `contentMatrixSchema` in `lib/ai/content-matrix.ts`.
2. Update the prompt in `generateBrandContentMatrix` to request these new items.
3. Update `fillTemplateFromMatrix` in `lib/templates/matrix-mapper.ts` to add a new matching rule (e.g., for "hashtags" or "colors").

### Regenerating Content
To refresh the content, simply set `contentMatrix` to `null` in the database or create a "Regenerate Matrix" button that calls `generateBrandContentMatrix` directly (bypassing the `getOrCreate` check).
