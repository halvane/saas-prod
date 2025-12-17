# Admin Sections Manager Architecture

## 1. Overview
The **Admin Sections Manager** is a centralized system for managing the building blocks (Sections) of the Template Builder. Instead of hardcoding HTML snippets in the codebase, sections will be stored in the database, making them dynamic, versionable, and AI-ready.

This system allows admins to:
- Create, Edit, and Delete sections (HTML/CSS snippets).
- Categorize sections (Headers, Features, Footers, etc.).
- Define dynamic variables (e.g., `{{brand_name}}`, `{{primary_color}}`).
- Preview sections live using an isolated iframe environment.
- Manage metadata for AI retrieval (tags, descriptions, embeddings).

## 2. Database Schema Design

We will introduce a new table `template_sections` to store the components.

### Table: `template_sections`
| Column | Type | Description |
|--------|------|-------------|
| `id` | `serial` | Primary Key |
| `name` | `varchar(255)` | Internal name (e.g., "Modern Hero 1") |
| `category` | `varchar(50)` | e.g., "hero", "features", "testimonials", "cta" |
| `html` | `text` | The raw HTML structure |
| `css` | `text` | Scoped CSS for this section |
| `variables` | `jsonb` | Schema of variables used (e.g., `["title", "image"]`) |
| `tags` | `text[]` | Array of tags for filtering (e.g., ["dark", "minimal"]) |
| `thumbnail_url` | `text` | URL to a screenshot of the section |
| `is_active` | `boolean` | Soft delete/hide flag |
| `created_at` | `timestamp` | Creation date |
| `updated_at` | `timestamp` | Last update |

### Table: `section_categories` (Optional, or use Enum)
To keep it simple initially, we can use a TypeScript Enum or a const array, but a table allows dynamic category creation.

## 3. UI/UX Architecture

### Location
`app/(admin)/admin/sections/`

### Page Structure
1.  **List View (`/admin/sections`)**
    *   **Sidebar**: Filter by Category (Hero, Footer, etc.) and Tags.
    *   **Search Bar**: Real-time search by name or content.
    *   **Grid Layout**: Cards displaying the section thumbnail/preview.
    *   **Actions**: "Create New", "Edit", "Delete".

2.  **Editor View (`/admin/sections/[id]` & `/admin/sections/new`)**
    *   **Split Screen**:
        *   **Left**: Code Editor (Monaco/CodeMirror) for HTML & CSS.
        *   **Right**: Live Preview (Iframe).
    *   **Metadata Form**: Name, Category, Tags.
    *   **Variable Detector**: Auto-detect `{{variable}}` patterns in HTML and list them.

### Component Hierarchy
```
AdminSectionsPage
├── SectionsSidebar (Filters)
├── SectionsHeader (Search + Add Button)
└── SectionsGrid
    └── SectionCard
        ├── IframePreview (Isolated rendering)
        └── ActionMenu (Edit/Delete)
```

## 4. Technical Implementation Details

### A. Live Preview (Iframe Strategy)
To ensure the admin preview matches the builder exactly, we will reuse the `Bridge` pattern or a simplified version.
- **Isolation**: Each card uses a `srcDoc` iframe.
- **Scaling**: CSS `transform: scale(x)` to fit large sections into small cards.
- **Scoped CSS**: Ensure the CSS stored in the DB is injected into the iframe `head`.

### B. Dynamic Variable System
Instead of hardcoding, the system will parse the HTML for Handlebars-style syntax `{{ key }}`.
- **Storage**: When saving, extract keys -> store in `variables` JSON column.
- **Usage**: In the Builder, these keys become inputs in the "Edit Section" panel.

### C. AI Integration Readiness
To make this "AI Controllable" in the future:
1.  **Semantic Search**: Add a `description` field to `template_sections`.
2.  **Embeddings**: Future column `embedding vector(1536)` to allow AI to "find a hero section with high energy".
3.  **JSON Schema**: The `variables` column serves as the schema for the AI to know what content to generate for that section.

## 5. Development Roadmap

### Phase 1: Core Infrastructure
1.  Create `template_sections` table in Drizzle schema.
2.  Run migrations.
3.  Create Server Actions (`createSection`, `updateSection`, `getSections`).

### Phase 2: Admin UI
1.  Build the `SectionCard` with Iframe preview.
2.  Build the `SectionsGrid` with search/filter.
3.  Build the Editor Page with Split View.

### Phase 3: Builder Integration
1.  Update `TemplateBuilder` to fetch sections from the DB instead of hardcoded files.
2.  Implement "Drag from Library" using the dynamic data.

## 6. Best Practices Applied
- **Separation of Concerns**: UI (Admin) is separate from Consumption (Builder).
- **Single Source of Truth**: Database stores the definitions, not code files.
- **Security**: Admin routes protected by Role-Based Access Control (RBAC).
- **Performance**: Iframes in the list view should be lazy-loaded or use screenshots (generated via Puppeteer/Edge Functions) to avoid heavy DOM rendering. *For V1, we will use live iframes with `loading="lazy"`.*

