# Purlema SaaS Platform

A modern, full-featured SaaS content management platform built with Next.js 15, Vercel AI Gateway, PostgreSQL, and Stripe.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- pnpm or npm
- Neon PostgreSQL account
- Stripe account (for payments)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/halvane/saas-dev.git
cd saas-dev

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# 4. Set up database
pnpm run db:setup

# 5. Seed test data
pnpm run db:seed

# 6. Start development server
pnpm run dev
```

Visit `http://localhost:3000` - Login with `test@test.com` / `admin123`

---

## 📚 Documentation

All documentation is in the [`docs/`](./docs/) folder:

- **[SETUP_COMPLETE.md](./docs/SETUP_COMPLETE.md)** - Repository setup status
- **[GIT_REPOSITORY_SETUP.md](./docs/GIT_REPOSITORY_SETUP.md)** - Git workflow guide
- **[copilot-instructions.md](./docs/copilot-instructions.md)** - Coding standards & patterns
- **[AI_GATEWAY_GUIDE.md](./docs/AI_GATEWAY_GUIDE.md)** - Vercel AI Gateway integration
- **[QUICK_REFERENCE.md](./docs/QUICK_REFERENCE.md)** - Git quick commands
- **[AI_QUICK_REFERENCE.md](./docs/AI_QUICK_REFERENCE.md)** - AI SDK quick commands

See [docs/README.md](./docs/README.md) for complete documentation index.

---

## 🏗️ Architecture

```
Purlema SaaS
├── Frontend (Next.js 15 App Router)
│   ├── Dashboard & Pages
│   ├── Content Editor
│   ├── Calendar & Timeline
│   └── AI Chat Integration
├── Backend (Node.js + Express-like)
│   ├── Authentication (JWT)
│   ├── API Routes (/api/*)
│   └── Database ORM (Drizzle)
├── Services
│   ├── AI (Vercel AI Gateway)
│   ├── Payments (Stripe)
│   ├── Database (Neon PostgreSQL)
│   └── Auth (JWT + bcryptjs)
└── Documentation (docs/)
```

---

## 🔑 Tech Stack

- **Framework**: Next.js 15.6+ (App Router)
- **Language**: TypeScript 5.8
- **Frontend**: React 19 + shadcn/ui + Tailwind CSS
- **Database**: Neon PostgreSQL + Drizzle ORM
- **Authentication**: JWT + bcryptjs
- **Payments**: Stripe API
- **AI**: Vercel AI Gateway + AI SDK
- **Deployment**: Vercel
- **Package Manager**: pnpm

---

## ✨ Features

✅ **Multi-tenant Architecture** - Teams-based access control  
✅ **Authentication** - JWT-based with secure sessions  
✅ **Dashboard** - Real-time stats, activity feed, timeline  
✅ **Content Editor** - Blog, Twitter, LinkedIn editors  
✅ **AI Integration** - Streaming chat, content generation  
✅ **Payments** - Stripe checkout & webhooks  
✅ **Database** - PostgreSQL with migrations  
✅ **Type Safety** - Full TypeScript strict mode  

---

## 🚀 Available Scripts

```bash
pnpm run dev          # Start dev server (port 3000)
pnpm run build        # Production build
pnpm run start        # Start production server
pnpm run lint         # Run ESLint
pnpm run type-check   # Run TypeScript check
pnpm run db:setup     # Initialize database
pnpm run db:seed      # Seed test data
pnpm run db:studio    # Open Drizzle Studio
```

---

## 🔐 Environment Variables

Required variables in `.env.local`:

```
POSTGRES_URL=postgresql://...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
AUTH_SECRET=<32-char-random>
VERCEL_AI_GATEWAY_KEY=... (for AI)
```

See `.env.example` for complete list.

---

## 🔄 Git Workflow

Two repositories for dev/prod separation:

- **[saas-dev](https://github.com/halvane/saas-dev)** - Development (main & feature branches)
- **[saas-prod](https://github.com/halvane/saas-prod)** - Production (production branch only)

See [docs/GIT_REPOSITORY_SETUP.md](./docs/GIT_REPOSITORY_SETUP.md) for detailed workflow.

---

## 🤖 AI Integration

Built-in Vercel AI Gateway for:
- Streaming chat responses
- Text generation
- Multiple model support (GPT-4, Claude, etc.)

API endpoints:
- `POST /api/ai/chat` - Streaming chat
- `POST /api/ai/generate` - Text generation

See [docs/AI_GATEWAY_GUIDE.md](./docs/AI_GATEWAY_GUIDE.md) for examples.

---

## 📦 Project Structure

```
saas/
├── app/                    # Next.js App Router
│   ├── (dashboard)/        # Protected dashboard routes
│   ├── (login)/            # Auth pages
│   └── api/                # API endpoints
├── components/             # React components
│   ├── custom/             # App-specific components
│   └── ui/                 # Reusable UI components
├── lib/                    # Utilities & services
│   ├── ai/                 # AI Gateway integration
│   ├── auth/               # Authentication
│   ├── db/                 # Database (Drizzle ORM)
│   └── hooks/              # React hooks
├── docs/                   # Documentation (ALL .md files)
├── middleware.ts           # Auth middleware
└── package.json
```

---

## 🧪 Testing & Quality

- TypeScript strict mode
- ESLint for code quality
- Format with Prettier (via ESLint)
- Database migrations tracked

---

## 🚢 Deployment

### To Vercel

1. Connect production repo to Vercel
2. Add environment variables (GitHub Secrets)
3. Deploy on push to `production` branch

See [docs/SETUP_COMPLETE.md](./docs/SETUP_COMPLETE.md#step-7-vercel-production-setup) for details.

---

## 📝 Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes (follow [copilot guidelines](./docs/copilot-instructions.md))
3. Commit: `git commit -m "feat: description"`
4. Push: `git push origin feature/my-feature`
5. Create Pull Request
6. After approval: merge to `main`
7. For production: merge `main` → `production` branch

---

## 🐛 Issues & Support

- Check [docs/](./docs/) for guides
- Review code examples in relevant components
- Check GitHub Issues on [saas-dev](https://github.com/halvane/saas-dev/issues)

---

## 📄 License

[See LICENSE](./LICENSE)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Vercel](https://vercel.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Stripe](https://stripe.com/)

---

**Repository**: [github.com/halvane/saas-dev](https://github.com/halvane/saas-dev)  
**Production**: [github.com/halvane/saas-prod](https://github.com/halvane/saas-prod)
  