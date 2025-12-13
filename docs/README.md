# 📚 Documentation

Complete guides and references for the Purlema SaaS Platform.

## 📋 Contents

### Getting Started
- [**SETUP_COMPLETE.md**](./SETUP_COMPLETE.md) - Git repository setup completion status and next steps
- [**GIT_REPOSITORY_SETUP.md**](./GIT_REPOSITORY_SETUP.md) - Detailed guide for setting up dev and production repositories

### Development Guides
- [**copilot-instructions.md**](./copilot-instructions.md) - AI Copilot guidelines for the project (best practices, patterns, workflows)
- [**AI_GATEWAY_GUIDE.md**](./AI_GATEWAY_GUIDE.md) - Complete Vercel AI Gateway integration guide with examples
- [**QUICK_REFERENCE.md**](./QUICK_REFERENCE.md) - Git command quick reference
- [**AI_QUICK_REFERENCE.md**](./AI_QUICK_REFERENCE.md) - AI SDK quick reference for developers

---

## 🚀 Quick Start by Role

### New Developer
1. Read: [SETUP_COMPLETE.md](./SETUP_COMPLETE.md) - Understand the repository structure
2. Read: [GIT_REPOSITORY_SETUP.md](./GIT_REPOSITORY_SETUP.md) - Set up your environment
3. Reference: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Git commands
4. Reference: [copilot-instructions.md](./copilot-instructions.md) - Coding standards

### AI Feature Development
1. Read: [AI_GATEWAY_GUIDE.md](./AI_GATEWAY_GUIDE.md) - Complete AI integration guide
2. Reference: [AI_QUICK_REFERENCE.md](./AI_QUICK_REFERENCE.md) - Quick code examples
3. Reference: [copilot-instructions.md](./copilot-instructions.md) - AI integration patterns

### DevOps / Infrastructure
1. Read: [GIT_REPOSITORY_SETUP.md](./GIT_REPOSITORY_SETUP.md) - Repository structure
2. Read: [SETUP_COMPLETE.md](./SETUP_COMPLETE.md) - Deployment information
3. Reference: [copilot-instructions.md](./copilot-instructions.md) - Architecture overview

---

## 📖 File Descriptions

| File | Purpose | Audience |
|------|---------|----------|
| **SETUP_COMPLETE.md** | Repository setup status, next steps, security checklist | DevOps, Team Lead |
| **GIT_REPOSITORY_SETUP.md** | Detailed git workflow, branch strategy, CI/CD | Developers, DevOps |
| **copilot-instructions.md** | AI agent guidelines, code patterns, conventions | All Developers, AI Agents |
| **AI_GATEWAY_GUIDE.md** | Vercel AI Gateway integration, examples, best practices | AI Developers |
| **QUICK_REFERENCE.md** | Git command cheatsheet | Developers |
| **AI_QUICK_REFERENCE.md** | AI SDK cheatsheet, code examples | AI Developers |

---

## 🏗️ Architecture Overview

```
Purlema SaaS Platform
├── Frontend (Next.js 15)
│   ├── App Router pages
│   ├── React components (shadcn/ui + custom)
│   └── API routes for backend
├── Backend Services
│   ├── Authentication (JWT)
│   ├── Database (Neon PostgreSQL)
│   ├── Payments (Stripe)
│   └── AI (Vercel AI Gateway)
└── Documentation (this folder)
```

---

## 🔑 Key Technologies

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: Neon PostgreSQL + Drizzle ORM
- **UI**: shadcn/ui + Tailwind CSS
- **Auth**: JWT cookies + bcryptjs
- **Payments**: Stripe API
- **AI**: Vercel AI Gateway + AI SDK
- **Deployment**: Vercel

---

## 🔐 Security & Secrets

All sensitive configuration is handled via **environment variables**:
- Database credentials in `.env` (never committed)
- API keys in GitHub Secrets
- `.env.example` with placeholders is committed

See [GIT_REPOSITORY_SETUP.md](./GIT_REPOSITORY_SETUP.md#step-4-security---protect-secrets) for details.

---

## 📞 Repository Links

- **Development**: https://github.com/halvane/saas-dev
- **Production**: https://github.com/halvane/saas-prod

---

## 🎯 Best Practices Summary

✅ **Code**: Minimal, clean, scalable (see [copilot-instructions.md](./copilot-instructions.md#best-practices--code-quality))  
✅ **Git**: Feature branches → PR → Review → Merge to main  
✅ **Secrets**: Environment variables only, never in code  
✅ **AI**: Use Vercel AI Gateway for all LLM calls  
✅ **Database**: Always filter by `teamId` for multi-tenancy  
✅ **TypeScript**: Strict mode enabled  

---

## 📞 Questions?

- Check the relevant `.md` file above
- Look for examples in the codebase
- Review [copilot-instructions.md](./copilot-instructions.md) for patterns

---

**Last Updated**: December 13, 2025  
**Repository**: Purlema SaaS Platform
