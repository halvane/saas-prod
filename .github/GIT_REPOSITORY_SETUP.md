# Git Repository Setup - Development & Production

## Overview
This guide establishes two separate GitHub repositories:
- **Development Repository** (`purlema-saas-dev`) - for active development, feature branches, PR workflows
- **Production Repository** (`purlema-saas-prod`) - for stable, production-ready code, Vercel deployments only

Both repositories maintain identical code structure but different deployment pipelines and environment management.

---

## Prerequisites
- GitHub account with proper SSH keys configured
- Vercel account (for production deployments)
- Local git configured: `git config --global user.name "Your Name"` and `git config --global user.email "your.email@github.com"`

---

## Step 1: Create GitHub Repositories

### 1A. Create Development Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `purlema-saas-dev`
3. Description: "Purlema SaaS Platform - Development"
4. Visibility: **Private** (recommended)
5. Do NOT initialize with README, .gitignore, or license (we have them locally)
6. Click **Create repository**

### 1B. Create Production Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `purlema-saas-prod`
3. Description: "Purlema SaaS Platform - Production Ready"
4. Visibility: **Private** (recommended)
5. Do NOT initialize with README, .gitignore, or license
6. Click **Create repository**

---

## Step 2: Initialize Local Development Repository

```bash
# Navigate to your project
cd c:\Users\Windows\ 11\ Pro\saas

# Initialize git
git init

# Add all files (respects .gitignore)
git add .

# Create initial commit
git commit -m "Initial commit: Purlema SaaS Platform with Next.js 15, Drizzle ORM, Stripe integration"

# Add development remote
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/purlema-saas-dev.git

# Push to development branch
git branch -M main
git push -u origin main
```

**After push:**
- Your development repo is now live on `purlema-saas-dev`
- All commits, branches, and PRs will be on this repo

---

## Step 3: Set Up .env.example for Security

Create clean environment file without secrets:

```bash
# Create .env.example (commit to git)
cat > .env.example << 'EOF'
# Database Configuration - Neon PostgreSQL
POSTGRES_URL=postgresql://user:password@your-neon-endpoint/dbname?sslmode=require
POSTGRES_URL_NON_POOLING=postgresql://user:password@your-neon-endpoint-direct/dbname?sslmode=require
POSTGRES_PRISMA_URL=postgresql://user:password@your-neon-endpoint/dbname?connect_timeout=15&sslmode=require

# Stripe Configuration (get keys from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE

# Application Configuration
BASE_URL=http://localhost:3000

# Authentication Secret (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
AUTH_SECRET=your-32-character-random-string

EOF
```

**Add to git:**
```bash
git add .env.example
git commit -m "docs: Add .env.example with placeholder values"
git push
```

---

## Step 4: Security - Protect Secrets

### 4A. Verify .gitignore Covers All Secrets

Your `.gitignore` already includes:
```
.env
.env*.local
.vercel
```

Verify nothing sensitive is committed:
```bash
# Check for accidental commits
git log --all --full-history -- .env
git log --all --full-history -- .env.local

# If .env was committed, purge it from history:
# git filter-branch --tree-filter 'rm -f .env' -- --all
# git push -u origin main --force-with-lease
```

### 4B. Add GitHub Secrets (Development)

1. Go to **Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Add these secrets (copy from your local `.env`):

| Secret Name | Value |
|------------|-------|
| `POSTGRES_URL` | From `.env` |
| `POSTGRES_URL_NON_POOLING` | From `.env` |
| `POSTGRES_PRISMA_URL` | From `.env` |
| `STRIPE_SECRET_KEY` | From `.env` |
| `STRIPE_WEBHOOK_SECRET` | From `.env` |
| `AUTH_SECRET` | From `.env` |

---

## Step 5: Create Production Branch & Repository Sync

### 5A. Create Production Branch Locally

```bash
# Create production branch (never merge to it directly)
git checkout -b production

# Push to dev repository first
git push origin production

# Optionally protect main/production branches on GitHub:
# Settings → Branches → Add branch protection rule
# - Branch name pattern: main, production
# - Require pull request reviews
# - Require status checks to pass
# - Include administrators
```

### 5B. Set Up Production Repository as Remote

```bash
# Add production remote
git remote add prod https://github.com/YOUR_GITHUB_USERNAME/purlema-saas-prod.git

# Push production branch to prod repo
git push prod production:main

# Verify both remotes exist
git remote -v
# origin: https://github.com/YOUR_GITHUB_USERNAME/purlema-saas-dev.git (fetch)
# origin: https://github.com/YOUR_GITHUB_USERNAME/purlema-saas-dev.git (push)
# prod:   https://github.com/YOUR_GITHUB_USERNAME/purlema-saas-prod.git (fetch)
# prod:   https://github.com/YOUR_GITHUB_USERNAME/purlema-saas-prod.git (push)
```

---

## Step 6: GitHub Actions CI/CD Setup

### 6A. Development CI (Auto-test on PR)

Create `.github/workflows/dev-ci.yml`:

```yaml
name: Development CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm run lint
      - run: pnpm run build
      - run: pnpm run type-check
```

### 6B. Production CD (Deploy to Vercel)

Create `.github/workflows/prod-deploy.yml`:

```yaml
name: Production Deploy

on:
  push:
    branches: [production]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: vercel/action@v5
        with:
          token: ${{ secrets.VERCEL_TOKEN }}
          prod: true
        env:
          POSTGRES_URL: ${{ secrets.POSTGRES_URL_PROD }}
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY_PROD }}
          AUTH_SECRET: ${{ secrets.AUTH_SECRET_PROD }}
```

**Add these files to git:**
```bash
git add .github/workflows/dev-ci.yml
git add .github/workflows/prod-deploy.yml
git commit -m "ci: Add GitHub Actions workflows for dev CI and prod deployment"
git push
```

---

## Step 7: Vercel Production Setup

### 7A. Connect Production Repo to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Paste: `https://github.com/YOUR_GITHUB_USERNAME/purlema-saas-prod`
4. Click **Continue**
5. Select **Next.js** as framework
6. Environment Variables:
   - `POSTGRES_URL` → Prod database URL
   - `POSTGRES_URL_NON_POOLING` → Prod database URL
   - `STRIPE_SECRET_KEY` → Prod Stripe key
   - `STRIPE_WEBHOOK_SECRET` → Prod webhook secret
   - `AUTH_SECRET` → New 32-char string
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` → Prod publishable key
7. Click **Deploy**

### 7B. Get Vercel Token

1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click **Create Token**
3. Name: `github-actions`
4. Expiration: 90 days (rotate regularly)
5. Copy token
6. Add to **GitHub production repo → Settings → Secrets → New repository secret**
   - Name: `VERCEL_TOKEN`
   - Value: Your token

---

## Step 8: Workflow - Daily Development

### Development Workflow:
```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Commit changes
git add .
git commit -m "feat: Add new feature"

# 3. Push to origin (dev repo)
git push origin feature/my-feature

# 4. Create Pull Request on GitHub
# Settings → Reviewers → Add team member
# Auto-runs CI tests

# 5. After approval & tests pass
git checkout main
git pull origin main
git merge feature/my-feature
git push origin main

# 6. Delete feature branch
git branch -d feature/my-feature
git push origin --delete feature/my-feature
```

### Production Release Workflow:
```bash
# 1. Ensure main is stable
git checkout main
git pull origin main

# 2. Create release commit
git commit --allow-empty -m "chore: Release v1.2.0"

# 3. Push to production branch
git checkout production
git pull origin production
git merge main
git push origin production

# 4. Verify production branch pushes to prod repo
git push prod production:main

# 5. Monitor Vercel deployment at vercel.com
```

---

## Step 9: Security Best Practices

### ✅ DO:
- [ ] Rotate Stripe keys quarterly
- [ ] Rotate AUTH_SECRET every 6 months
- [ ] Use branch protection on `main` and `production`
- [ ] Require code reviews on all PRs
- [ ] Monitor GitHub security alerts
- [ ] Store all secrets in GitHub Secrets, never in code
- [ ] Use environment-specific databases (dev: Neon dev, prod: Neon prod)
- [ ] Add 2FA to GitHub account

### ❌ NEVER:
- Don't commit `.env` files
- Don't push to production from feature branches
- Don't use development keys in production
- Don't commit API keys in code
- Don't share secrets via Slack/email
- Don't push to `prod` remote directly (always via `production` branch)

---

## Step 10: Cleanup Existing Code Before Commit

### Remove Sensitive Data:

```bash
# 1. Update .env with placeholder values or delete
rm .env

# 2. Update .env.example in root
# (already done above)

# 3. Check for hardcoded keys
grep -r "sk_test_" src/ app/ lib/
grep -r "pk_test_" src/ app/ lib/
grep -r "whsec_" src/ app/ lib/

# 4. If found, replace with environment variables
# Example: const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
```

### Clean Commit:
```bash
# Verify only safe files are staged
git status

# Commit
git add .
git commit -m "security: Remove .env, use environment variables exclusively"
git push origin main
```

---

## Step 11: Verify Setup

### Checklist:
- [ ] Two repositories created (dev & prod) on GitHub
- [ ] Local repo initialized with both remotes
- [ ] `.env.example` committed (no actual secrets)
- [ ] `.gitignore` properly excludes `.env`
- [ ] GitHub Secrets configured in both repos
- [ ] CI workflow (dev) created and passing
- [ ] CD workflow (prod) created
- [ ] Vercel connected to production repo
- [ ] Branch protection rules enabled
- [ ] No secrets in git history

### Test Push:
```bash
# Make a small change
echo "# Verified!" >> README.md

# Commit and push
git add README.md
git commit -m "docs: Verify git setup"
git push origin main

# Check GitHub repo to confirm
```

---

## Step 12: Long-term Maintenance

### Monthly:
- Review GitHub security alerts
- Check Stripe webhook health
- Verify database backups

### Quarterly:
- Rotate Stripe API keys
- Review access permissions
- Update dependencies

### Annually:
- Rotate AUTH_SECRET
- Review security policies
- Audit git commit history

---

## Quick Reference Commands

```bash
# Push to dev repo
git push origin main

# Push to prod repo (from production branch)
git checkout production
git push prod production:main

# View remotes
git remote -v

# Add new remote
git remote add <name> <url>

# Verify clean history (no secrets)
git log --oneline | head -20
```

---

## Support

For any issues:
1. Check GitHub Secrets are set correctly
2. Verify both repositories are accessible
3. Ensure local `.env` is NOT committed
4. Review GitHub Actions logs for CI/CD failures

