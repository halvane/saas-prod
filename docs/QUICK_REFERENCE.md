# Git Quick Reference - Purlema SaaS

## 🚀 Quick Commands

### Check Status
```bash
git status
git remote -v
git branch -a
```

### Daily Development Workflow
```bash
# Pull latest from dev repo
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/my-feature

# Make changes, commit, push
git add .
git commit -m "feat: description"
git push origin feature/my-feature
```

### Release to Production
```bash
# Switch to production
git checkout production
git pull origin production

# Merge latest stable code
git merge main

# Push to both repos
git push origin production
git push prod production:main
```

---

## 🔐 Environment Setup

### Create .env locally (never commit!)
```bash
# Copy example file
cp .env.example .env

# Edit with actual values
# Get credentials from:
# - Neon: https://console.neon.tech/
# - Stripe: https://dashboard.stripe.com/apikeys
```

### Generate AUTH_SECRET
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🌳 Branch Structure

```
main (development)
  ↓ (pull requests, feature branches)
production (stable)
  ↓ (push to prod repo)
saas-prod repo → Vercel deployment
```

---

## 📝 Commit Message Format

```
type(scope): subject

feat(editor): add content editor
fix(auth): resolve login issue
docs(readme): update setup guide
style(ui): format button component
refactor(db): optimize queries
test(api): add user endpoint tests
chore(deps): update dependencies
```

---

## 🔄 Common Scenarios

### Sync all branches
```bash
git fetch origin
git fetch prod
git status
```

### Undo last commit (not pushed)
```bash
git reset --soft HEAD~1
git reset .
```

### Undo last commit (already pushed)
```bash
git revert HEAD
git push origin main
```

### Recover deleted branch
```bash
git reflog
git checkout -b recovered-branch <commit-hash>
```

### Merge specific commit from another branch
```bash
git cherry-pick <commit-hash>
git push origin main
```

---

## 🛑 Stop! Before Pushing

- [ ] No `.env` file committed?
- [ ] No API keys in code?
- [ ] Tests passing locally?
- [ ] Code formatted (eslint/prettier)?
- [ ] Commit message is descriptive?
- [ ] Changes are minimal & focused?

---

## 📞 Repository URLs

**Development**: `https://github.com/halvane/saas-dev.git`  
**Production**: `https://github.com/halvane/saas-prod.git`

---

## 🔑 Secrets to Configure

Add to GitHub Secrets in both repos:

| Secret | Source | Example |
|--------|--------|---------|
| `POSTGRES_URL` | Neon console | postgresql://user:pass@endpoint/db |
| `POSTGRES_URL_NON_POOLING` | Neon console | postgresql://user:pass@endpoint-direct/db |
| `STRIPE_SECRET_KEY` | Stripe dashboard | sk_test_xxx... |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhooks | whsec_xxx... |
| `AUTH_SECRET` | Generate locally | (32 random hex chars) |

---

## 🚨 Emergency: Undo Everything

```bash
# Undo last push (CAREFUL!)
git push origin --force-with-lease main

# Or reset to remote state
git fetch origin
git reset --hard origin/main
```

---

## 📊 View History

```bash
# Last 10 commits
git log --oneline -10

# Changes in current branch
git log origin/main..HEAD

# File history
git log --follow -- filename.ts

# Visual branch graph
git log --graph --oneline --all --decorate
```

---

## 🔗 Useful Links

- **GitHub Repos**: https://github.com/halvane
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Neon Console**: https://console.neon.tech
- **Vercel Dashboard**: https://vercel.com/dashboard
- **VS Code SSH**: https://code.visualstudio.com/docs/remote/ssh

---

## 💡 Pro Tips

1. **Use SSH keys** instead of HTTPS for faster pushes
   ```bash
   git remote set-url origin git@github.com:halvane/saas-dev.git
   ```

2. **Set default branch** for safer force-push
   ```bash
   git config --global push.default simple
   ```

3. **Auto-sign commits** (optional)
   ```bash
   git config --global commit.gpgSign true
   ```

4. **Create aliases** for common commands
   ```bash
   git config --global alias.st status
   git config --global alias.co checkout
   git config --global alias.br branch
   git config --global alias.ci commit
   ```

5. **Use `.gitkeep`** for empty directories
   ```bash
   touch empty-folder/.gitkeep
   ```

---

**Remember**: Commit often, push carefully, document always! 🎯
