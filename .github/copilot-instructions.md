# Purlema SaaS Platform - AI Copilot Instructions

## CRITICAL RULES

### 1. NO TODO LISTS
- ❌ **FORBIDDEN**: Creating todo lists in responses
- ❌ **FORBIDDEN**: Proposing "next steps" as a checklist
- ❌ **FORBIDDEN**: Creating implementation plan markdown files
- ✅ **MANDATORY**: Directly implement all requested features
- ✅ **MANDATORY**: If a task has multiple parts, implement all of them in the same response
- ✅ **MANDATORY**: Use `multi_replace_string_in_file` for simultaneous multiple modifications
- 📝 **Exception**: User explicitly asks "create a todo list" or "make a plan"

## Architecture Overview

**Viral Loop Engine** is a multi-tenant SaaS content management platform built on Next.js 15 (App Router) with Drizzle ORM, PostgreSQL, and Stripe integration. The platform enables teams to create, schedule, and manage social media content across multiple platforms.

### Tech Stack
- **Frontend**: Next.js 15 (Canary), React 19, TypeScript, Tailwind CSS v4, shadcn/ui
- **Backend**: Next.js API Routes, Server Actions (`'use server'`)
- **Database**: PostgreSQL (Neon) + Drizzle ORM
- **Auth**: JWT cookies (jose library), bcryptjs for passwords
- **Payments**: Stripe integration
- **AI**: Vercel AI Gateway + OpenAI SDK (unified API for multiple models)
- **UI Components**: Radix UI primitives + shadcn/ui

## Critical Architecture Patterns

### 1. Multi-Tenancy (Teams Model)
The entire system revolves around **teams**. Every user belongs to at least one team:
```
users → teamMembers ← teams
```
**Key Points:**
- **STRICT**: Every piece of data (brand, content, settings, products) MUST be linked to a `userId` or `teamId`.
- **ISOLATION**: DB queries must ALWAYS filter by the connected user/team (`where: { userId: user.id }` or `teamId`).
- **CUSTOMIZATION**: Displayed content must be unique to the connected user. No global or shared content by default.
- **CACHE**: Watch out for cache keys and revalidation (Next.js), they must be scoped by user to avoid data leaks between tenants.
- **PERSISTENCE**: Brand data (Brand DNA) must persist between sessions and reloads.
- Use `getTeamForUser()` to get the authenticated user's team
- Role-based permissions: `member` vs `owner` per team
- Activity logs always include `teamId` for audit trails

**Location:** `lib/db/schema.ts` (users, teams, teamMembers tables)

### 2. Server Actions Pattern
Use `'use server'` for form submissions and data mutations:
```typescript
// app/(login)/actions.ts
export const signIn = validatedAction(signInSchema, async (data, formData) => {
  // Zod validation + database logic
  // Always include error handling and logging
});
```
**When to use:**
- Form submissions (login, signup, invitations)
- Data mutations from client components
- Protected operations requiring auth

**Location:** `app/(login)/actions.ts`, `app/api/` routes

### 3. Client/Server Component Separation
- Files with `'use client'` = interactive components (state, hooks)
- Files without = server components (can use secrets, database directly)
- ALL custom components in `/components/custom/**` must have `'use client'` (they use React hooks)

**Key Components:**
- `(dashboard)/layout.tsx` - Client wrapper for Header, Sidebar, BottomNavigation
- `components/custom/Dashboard/*` - Dashboard UI (WeeklyTimeline, ActivityFeed, QuickStats)
- `components/custom/Editor/*` - Content editor pages (EditorPage, PostEditor, TwitterEditor, etc.)

### 4. Layout Hierarchy & Navigation
```
app/layout.tsx (client) → SWRConfig
├── (login)/layout.tsx → Login forms
└── (dashboard)/layout.tsx (client) → Header + Sidebar + Content + BottomNavigation
    ├── dashboard/page.tsx → QuickStats + WeeklyTimeline + ActivityFeed
    ├── editor/page.tsx → EditorPage
    ├── radar/page.tsx → RadarPage (trend research)
    ├── mixer/page.tsx → MixerPage (campaign builder)
    ├── timeline/page.tsx → TimelinePage (scheduling)
    ├── settings/page.tsx → SettingsPage
    ├── templates/page.tsx → TemplatesPage
    ├── library/page.tsx → ContentLibrary
    └── drafts/page.tsx → DraftsPage
└── (admin)/layout.tsx (server) → Admin Layout (RBAC protected)
    ├── admin/page.tsx → Admin Dashboard Overview
    └── admin/users/page.tsx → User Management
```

**Navigation Flow:**
- Header buttons call `onNavigate()` callbacks
- Sidebar navigation handled in `(dashboard)/layout.tsx`
- All navigation uses `router.push('/route-name')` from `'next/navigation'`
- Active page determined by `pathname` via `usePathname()`

### 5. Authentication Flow
```
Sign In/Up → validatedAction (Zod schema) → Database lookup
→ JWT token generation → HTTP-only cookie → Middleware verification
```

**Key Files:**
- `lib/auth/session.ts` - JWT signing/verification, password hashing
- `middleware.ts` - Protects `/dashboard` routes, refreshes session tokens
- `lib/auth/middleware.ts` - `validatedAction`, `validatedActionWithUser` wrappers
- `.env` required: `AUTH_SECRET` (32+ character string for JWT)

**Protected Route Pattern:**
```typescript
export const myAction = validatedActionWithUser(
  zod_schema,
  async (data, user) => { /* logged in user available */ }
);
```

### 6. Database Queries
Always use Drizzle ORM from `lib/db/drizzle.ts`:

### 7. Admin Dashboard Architecture
The platform includes a dedicated admin area at `/admin` for system management.

**Security Model:**
- Protected by `app/(admin)/layout.tsx`
- Requires `user.role === 'admin'` in the database
- Uses server-side checks in `getUser()` and admin actions

**Key Components:**
- `app/(admin)/admin/page.tsx`: System overview (stats, health)
- `app/(admin)/admin/users/page.tsx`: User management (list, delete)
- `app/(admin)/admin/actions.ts`: Dedicated server actions for admin operations

**Best Practices:**
- Never expose admin actions to public routes
- Always verify `user.role === 'admin'` inside every admin server action
- Use `revalidatePath` to refresh admin data after mutations

```typescript
import { db } from '@/lib/db/drizzle';
import { users, teams } from '@/lib/db/schema';

// Query example with team filtering
const result = await db
  .select()
  .from(users)
  .where(eq(users.teamId, teamId))
  .limit(1);
```

**Important Commands:**
- `npm run db:generate` - Generate migrations after schema changes
- `npm run db:migrate` - Apply migrations to database
- `npm run db:setup` - Initialize fresh database
- `npm run db:seed` - Populate with test data
- `npm run db:studio` - Open Drizzle Studio GUI

## Developer Workflows

### Starting Development
```bash
npm install
npm run db:setup      # Initialize Neon PostgreSQL
npm run db:seed       # Add test user: test@test.com / admin123
npm run dev           # Start on http://localhost:3000
```

### Adding a New Feature
1. **Update schema** (`lib/db/schema.ts`) → Add table/fields
2. **Generate migration** → `npm run db:generate`
3. **Apply migration** → `npm run db:migrate`
4. **Write queries** → Add to `lib/db/queries.ts`
5. **Add Server Action** → `app/(login)/actions.ts` or new file in `app/api/`
6. **Build UI** → Create `.tsx` files in `app/(dashboard)/` or `components/custom/`
7. **Add navigation** → Update `(dashboard)/layout.tsx` if new page

### Component Creation
- **Page components**: `app/(dashboard)/[feature]/page.tsx` with `'use client'` directive
- **UI components**: `components/custom/[Feature]/[ComponentName].tsx` with `'use client'`
- **Reusable components**: `components/ui/` (use shadcn/ui with Radix UI)
- **Always** include TypeScript interfaces for props
- **Always** add `'use client'` if component has hooks/state

## Project-Specific Conventions

### Naming Conventions
- **Files**: kebab-case (`dashboard-layout.tsx`)
- **Components**: PascalCase exports (`export function DashboardLayout()`)
- **Tables**: camelCase (`teamMembers`, `activityLogs`)
- **Columns**: snake_case in database (`created_at`, `stripe_customer_id`)

### Import Aliases
Use path alias `@/*` for all imports:
```typescript
import { db } from '@/lib/db/drizzle';           // ✓ Good
import { db } from '../../../../lib/db/drizzle'; // ✗ Avoid
```

### UI Components Pattern
All shadcn/ui components use **Radix UI** primitives with Tailwind classes:
```typescript
// Example: Button with variants
<Button variant="primary" size="medium" onClick={handleClick}>
  Action
</Button>

// Always pass className for custom styling
<Card className="bg-white rounded-xl shadow-lg">
  {children}
</Card>
```

### Stripe Integration
- Test keys stored in `.env`
- Webhook handler: `app/api/stripe/webhook/route.ts`
- Update subscription: `lib/payments/actions.ts`
- Checkout flow: `app/api/stripe/checkout/route.ts`

### Environment Variables
Required `.env` file (copy from `.env.example`):
```
POSTGRES_URL=postgresql://...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
AUTH_SECRET=<32+ char random string>
BASE_URL=http://localhost:3000
```

## Best Practices & Code Quality

### 1. Minimal Code Philosophy
**Write the least amount of code necessary to solve the problem.**

- ✅ **DO**: Use existing utilities and components before creating new ones
- ✅ **DO**: Leverage Next.js and React built-in features (Server Components, Suspense, etc.)
- ✅ **DO**: Import only what you need: `import { Button } from '@/components/ui/button'`
- ❌ **AVOID**: Creating wrapper components that add no value
- ❌ **AVOID**: Over-engineering solutions for simple problems
- ❌ **AVOID**: Duplicating logic that exists elsewhere

**Example - Bad (Unnecessary abstraction):**
```typescript
// Unnecessary wrapper that adds no value
function MyCustomButton({ text, onClick }: Props) {
  return <Button onClick={onClick}>{text}</Button>;
}
```

**Example - Good (Direct usage):**
```typescript
// Use the component directly
<Button onClick={handleClick}>Save Changes</Button>
```

### 2. No Unnecessary Code
**Every line must serve a purpose. Remove dead code immediately.**

- ✅ **DO**: Delete unused imports, functions, and variables
- ✅ **DO**: Remove commented-out code (use git history if needed)
- ✅ **DO**: Simplify complex conditionals with early returns
- ❌ **AVOID**: "Just in case" code that isn't currently used
- ❌ **AVOID**: Over-abstraction (multiple layers for simple operations)
- ❌ **AVOID**: Premature optimization without proven need

**Example - Bad (Unnecessary complexity):**
```typescript
// Over-engineered for simple operation
const getUserData = async (userId: string) => {
  try {
    const result = await db.select().from(users).where(eq(users.id, userId));
    if (result && result.length > 0) {
      return { success: true, data: result[0] };
    } else {
      return { success: false, data: null };
    }
  } catch (error) {
    return { success: false, data: null };
  }
};
```

**Example - Good (Minimal and clear):**
```typescript
// Simple and direct
const getUserData = async (userId: string) => {
  return await db.select().from(users).where(eq(users.id, userId)).limit(1);
};
```

### 3. Scalability Principles
**Build for growth without over-engineering.**

#### Database Queries
- ✅ Always include `.limit()` to prevent unbounded queries
- ✅ Filter by `teamId` in multi-tenant queries
- ✅ Use indexes for frequently queried fields (add in schema)
- ✅ Paginate results for large datasets
- ❌ Never use `SELECT *` - specify needed columns

```typescript
// Scalable query pattern
const posts = await db
  .select({ id: posts.id, title: posts.title, createdAt: posts.createdAt })
  .from(posts)
  .where(and(eq(posts.teamId, teamId), isNull(posts.deletedAt)))
  .orderBy(desc(posts.createdAt))
  .limit(50)
  .offset(page * 50);
```

#### Component Design
- ✅ Keep components small (<200 lines) and focused
- ✅ Extract reusable logic to hooks or utils
- ✅ Use Server Components by default, Client Components only when needed
- ✅ Memoize expensive computations with `useMemo`
- ❌ Don't create 10+ component props - use composition or context

```typescript
// Scalable component pattern
'use client';
import { useMemo } from 'react';

export function DataTable({ items, teamId }: Props) {
  const filteredItems = useMemo(
    () => items.filter(item => item.teamId === teamId),
    [items, teamId]
  );
  
  return <table>{/* render filteredItems */}</table>;
}
```

#### API Routes & Server Actions
- ✅ Validate inputs with Zod schemas
- ✅ Handle errors gracefully with try/catch
- ✅ Return consistent response shapes
- ✅ Use streaming for large responses
- ❌ Don't expose internal error details to clients

```typescript
// Scalable Server Action
export const createPost = validatedActionWithUser(
  postSchema,
  async (data, user) => {
    const team = await getTeamForUser(user.id);
    if (!team) return { error: 'No team found' };
    
    const post = await db.insert(posts).values({
      ...data,
      teamId: team.id,
      userId: user.id,
    }).returning();
    
    return { success: true, post: post[0] };
  }
);
```

#### File Organization
- ✅ Group related files by feature/domain, not by type
- ✅ Keep file length under 300 lines - split when larger
- ✅ Use barrel exports (`index.ts`) for cleaner imports
- ✅ Colocate tests with source files when practical

```
app/(dashboard)/
  posts/
    page.tsx              # Main posts page
    actions.ts            # Post-related Server Actions
    components/
      PostCard.tsx        # Feature-specific components
      PostForm.tsx
```

### 4. Performance & Efficiency
- ✅ Use Next.js Image component for optimized images
- ✅ Implement pagination/infinite scroll for lists
- ✅ Cache expensive operations (Redis via CacheService)
- ✅ Use SWR for client-side data caching
- ❌ Don't fetch data in loops - batch queries
- ❌ Don't render large lists without virtualization

### 5. Code Review Checklist
Before committing, verify:
- [ ] No unused imports or variables (TypeScript warnings)
- [ ] All database queries include team filtering
- [ ] All Server Actions use `validatedAction` or `validatedActionWithUser`
- [ ] Components under 200 lines
- [ ] API routes return consistent shapes
- [ ] No console.logs in production code
- [ ] No hardcoded values - use env vars or constants
- [ ] Error handling present for external calls

## Common Tasks

### Adding a New Dashboard Page
1. Create `app/(dashboard)/[feature]/page.tsx`
2. Add `'use client'` directive (for interactivity)
3. Import custom components from `components/custom/`
4. Update `(dashboard)/layout.tsx` navigation mapping
5. Add route case to `handleNavigate()` switch statement

Example:
```typescript
// app/(dashboard)/myfeature/page.tsx
'use client';
import { MyFeatureComponent } from '@/components/custom/MyFeature/MyFeatureComponent';

export default function MyFeaturePage() {
  return <MyFeatureComponent />;
}
```

### Adding Database Fields
1. Edit `lib/db/schema.ts` - add field to pgTable
2. Run `npm run db:generate` - creates migration file
3. Run `npm run db:migrate` - applies to Neon
4. Update `lib/db/queries.ts` if needed
5. Update `app/(login)/actions.ts` if affects auth

### Protecting API Routes
```typescript
// app/api/[feature]/route.ts
import { getUser } from '@/lib/db/queries';

export async function GET() {
  const user = await getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  
  // Protected logic here
}
```

## Integration Points & External Dependencies
### Vercel AI Gateway Integration
**Purpose**: Unified API for multiple AI models with caching, rate limiting, and observability

**Configuration**:
```env
# .env file
OPENAI_API_KEY=sk_your_key_here
AI_GATEWAY_TOKEN=your_vercel_ai_gateway_token
AI_MODEL_CHAT=gpt-4o-mini
AI_MODEL_EMBEDDING=text-embedding-3-small
AI_ENABLED=true
AI_MAX_TOKENS=4096
AI_TEMPERATURE=0.7
```

**Setup**:
1. Create account at [vercel.com/ai-gateway](https://vercel.com/ai-gateway)
2. Get OpenAI API key from [platform.openai.com](https://platform.openai.com)
3. Configure keys in GitHub Secrets (dev & prod repos)
4. No markup on tokens - 0% cost increase vs direct API

**Key Files**:
- `lib/ai/gateway.ts` - Core gateway configuration & model management
- `app/api/ai/chat/route.ts` - Streaming chat endpoint
- `app/api/ai/generate/route.ts` - Non-streaming text generation
- `lib/hooks/useAI.ts` - React hook for frontend integration

**Usage in Components**:
```typescript
'use client';
import { useAI } from '@/lib/hooks/useAI';

export function ChatComponent() {
  const { messages, isLoading, streamChat } = useAI();

  const handleSend = async (message: string) => {
    await streamChat(message); // Real-time streaming
  };

  return (
    <div>
      {messages.map((msg) => (
        <p key={msg.content}>{msg.role}: {msg.content}</p>
      ))}
      <button onClick={() => handleSend('Hello AI!')} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Send'}
      </button>
    </div>
  );
}
```

**API Endpoints**:

**POST /api/ai/chat** - Streaming response
```json
// Request
{ "message": "What's the weather?", "model": "gpt-4o-mini" }

// Response: ReadableStream with real-time text chunks
```

**POST /api/ai/generate** - Non-streaming response
```json
// Request
{ "prompt": "Generate a tweet", "model": "gpt-4o-mini", "maxTokens": 280 }

// Response
{
  "text": "Generated text here...",
  "usage": { "promptTokens": 10, "completionTokens": 25, "totalTokens": 35 },
  "finishReason": "stop"
}
```

**Features**:
- ✅ Unified API - seamlessly switch between models
- ✅ Caching - reduce redundant requests
- ✅ Spend Monitoring - track costs per model
- ✅ Failover - automatic retries to fallback providers
- ✅ OpenAI Compatible - use with OpenAI SDK if needed
- ✅ Real-time Streaming - Server-Sent Events support
- ✅ Full Observability - headers for analytics

**Best Practices**:
1. Always check `isConfigured()` before making requests
2. Set reasonable `maxTokens` to control costs
3. Use streaming for long-form content
4. Use non-streaming for quick responses
5. Never expose API keys in client code
6. Validate user input before sending to AI
7. Cache results when appropriate
8. Monitor usage in Vercel dashboard

**Switching Models**:
```typescript
// Runtime model selection
await streamChat(message, 'gpt-4'); // Override default

// Available models (via AI Gateway):
// - gpt-4o (latest, best reasoning)
// - gpt-4o-mini (fast, cheaper)
// - gpt-3.5-turbo (legacy, cheapest)
// - claude-3-opus (anthropic)
// - claude-3-sonnet (anthropic)
// See: https://vercel.com/docs/ai-gateway/models
```
### Stripe Webhook Handling
- Endpoint: `POST /api/stripe/webhook`
- Events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
- Update `teams.subscriptionStatus` based on webhook

### SWR Data Fetching
- Used for client-side caching: `useSWR<T>('/api/endpoint', fetcher)`
- Configured in root `layout.tsx` with initial fallback data
- Example: `/api/user` returns current authenticated user

### Activity Logging
All critical operations log to `activityLogs` table:
```typescript
await logActivity(teamId, userId, 'SIGN_IN', ipAddress);
```

### Integrations
- **Social Media**: Uses `upload-post` API via `lib/upload-post/service.ts`.
  - Fetches connected accounts from user's Upload-Post profile.
  - Supports Instagram, Facebook, LinkedIn, Twitter, YouTube, TikTok, Pinterest.
  - Routes: `/api/upload-post/callback` (implicit in OAuth flow).
  - Displays connected accounts in Settings with usernames and icons.

- **Shopify**: Uses OAuth flow via `lib/shopify/service.ts`.
  - Stores tokens in `shopify_integrations` table.
  - Routes: `/api/shopify/auth`, `/api/shopify/callback`.
  - Requires `SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`, `SHOPIFY_APP_URL`.
  - Provides `getShopifyProducts(userId)` and `getShopifyBlogs(userId)` functions.
  - Settings page shows connected store URL and status.

### AI Integration
- **MANDATORY**: Use Vercel AI Gateway via `lib/ai/gateway.ts` and `@ai-sdk/gateway`.
- **FORBIDDEN**: Do NOT use `@ai-sdk/openai` or direct OpenAI API calls.
- Unified API for multiple models (OpenAI, Anthropic, etc.) via Vercel.
- Requires `AI_GATEWAY_API_KEY` (starts with `vck_`).
- Properly configured to use AI Gateway endpoint (`https://gateway.ai.vercel.com/openai/v1`).

### AI Development Rules
1. **Always use `lib/ai/gateway.ts`**: Never instantiate providers manually.
2. **Use `lib/ai/models.ts`**: Import models from here (e.g., `getModel('fast')`).
3. **No Direct SDKs**: Do not install or use `openai`, `@ai-sdk/openai`, or `anthropic` SDKs directly.
4. **Error Handling**: Handle `GatewayInternalServerError` (credit card required) gracefully.
5. **Model Selection**: Use `fast` (gpt-4o-mini) for high-volume tasks to avoid rate limits.

## Known Limitations & Notes

1. **Error Handling**: Missing global `error.tsx` files - add to `(dashboard)/` for error boundaries
2. **Testing**: No test suite yet - prioritize critical API routes and auth flows
3. **Monitoring**: No Sentry/analytics setup - consider for production
4. **Rate Limiting**: Not implemented - recommended before public launch
5. **Documentation**: README.md minimal - expand with deployment guide

## Tips for Productivity

- **Preview changes**: `npm run dev` with hot reload enabled
- **Check types**: `tsc --noEmit` for full TypeScript check
- **Database GUI**: `npm run db:studio` opens web interface for inspecting/editing data
- **Debug**: Next.js includes sourcemaps - use browser DevTools
- **Passwords**: Stored as bcryptjs hash - never log plaintext
- **Team queries**: Always include `isNull(users.deletedAt)` for soft deletes

### 12. Brand Intelligence System
The platform includes a sophisticated system for extracting and analyzing brand data from URLs.

**Key Components:**
- **Scraper**: `lib/brand-scraper/service.ts` (Cheerio-based)
- **API**: `app/api/brand/scrape/route.ts` (Orchestrates scraping + AI analysis)
- **Database**: `brand_settings` (Deep JSON fields) and `brand_products` tables
- **UI**: `components/custom/Pages/SettingsPage.tsx`

**Data Flow:**
1. User enters URL in Settings.
2. API calls `scrapeBrandFromUrl` to get raw HTML data (metadata, products, text).
3. API calls Vercel AI Gateway (gpt-4o-mini) to analyze the raw data and generate strategic insights (Archetype, USPs, Angles).
4. Data is returned to UI for review.
5. User saves data -> `saveBrandSettings` action updates `brand_settings` and `brand_products` tables.

**Rules for Modification:**
- When modifying the scraper, ensure `cheerio` selectors are robust.
- When updating the AI prompt in `route.ts`, maintain the strict JSON output format.
- Always handle the `products` array when saving/loading brand settings.
- The `brand_products` table is linked to `brand_settings` via `brandId`.

### 13. Blob Storage Pattern (Vercel Blob)
Use Vercel Blob for storing user-generated content and static assets (images, videos, documents).

**Key Components:**
- **Helper**: `lib/storage.ts` -> `uploadAsset(filename, body, folder)`
- **Package**: `@vercel/blob`

**Usage Rules:**
1. **Always use the helper**: Import `uploadAsset` from `@/lib/storage`.
2. **Folder Structure**: Use meaningful folders (e.g., `brand-logos`, `products`, `generated-posts`).
3. **Public Access**: Assets are public by default (`access: 'public'`).
4. **Database Storage**: Store the returned `url` string in the database, NOT the file itself.

**Example:**
```typescript
import { uploadAsset } from '@/lib/storage';

// Inside a Server Action
const url = await uploadAsset('logo.png', file, 'brand-logos');
await db.update(brandSettings).set({ brandLogo: url })...
```

