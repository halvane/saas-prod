# Purlema SaaS Platform - AI Copilot Instructions

## Architecture Overview

**Viral Loop Engine** is a multi-tenant SaaS content management platform built on Next.js 15 (App Router) with Drizzle ORM, PostgreSQL, and Stripe integration. The platform enables teams to create, schedule, and manage social media content across multiple platforms.

### Tech Stack
- **Frontend**: Next.js 15 (Canary), React 19, TypeScript, Tailwind CSS v4, shadcn/ui
- **Backend**: Next.js API Routes, Server Actions (`'use server'`)
- **Database**: PostgreSQL (Neon) + Drizzle ORM
- **Auth**: JWT cookies (jose library), bcryptjs for passwords
- **Payments**: Stripe integration
- **UI Components**: Radix UI primitives + shadcn/ui

## Critical Architecture Patterns

### 1. Multi-Tenancy (Teams Model)
The entire system revolves around **teams**. Every user belongs to at least one team:
```
users → teamMembers ← teams
```
**Key Points:**
- All data queries MUST filter by `teamId` (see `lib/db/queries.ts`)
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
