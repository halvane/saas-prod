# Purlema SaaS Platform

Application SaaS complète pour la création et la gestion de contenu multi-plateforme, construite avec Next.js 15 et intégrant Stripe pour les paiements.

## 🚀 Fonctionnalités

### Pages Principales de l'Application
- **Dashboard** - Tableau de bord principal avec statistiques et activités
- **Radar** - Découverte de contenu (Trend Surfer, URL Thief, Brain Dump)
- **Editor** - Éditeur de contenu multi-plateforme (Blog, Twitter, LinkedIn, Instagram)
- **Mixer** - Mélangeur de contenu pour créer des variations
- **Timeline** - Calendrier de planification du contenu
- **Library** - Bibliothèque de contenus
- **Drafts** - Gestion des brouillons
- **Templates** - Modèles réutilisables
- **Settings** - Paramètres utilisateur

### Pages du Starter (Disponibles)
- **Pricing** (`/pricing`) - Page de tarification avec intégration Stripe
- **Admin Dashboard** (`/dashboard/dashboard`) - Administration avec gestion utilisateurs, équipes et sécurité
- **Sign In / Sign Up** - Authentification email/mot de passe avec JWT
- **User Profile** - Gestion du profil utilisateur

## 🛠️ Stack Technique

- **Framework**: Next.js 15 (App Router)
- **Base de données**: PostgreSQL
- **ORM**: Drizzle
- **Paiements**: Stripe
- **UI**: shadcn/ui + Radix UI
- **Styles**: Tailwind CSS v4
- **Auth**: JWT avec cookies
- **TypeScript**: Full type safety

## 📦 Installation

### Prérequis
- Node.js 18+ 
- PostgreSQL (local ou cloud)
- Compte Stripe (mode test pour démarrer)

### Étapes

1. **Cloner et installer les dépendances**
```bash
cd saas
npm install
# ou
pnpm install
```

2. **Configuration de la base de données**

Créer un fichier `.env` à partir de `.env.example`:
```bash
cp .env.example .env
```

Éditer `.env` et remplir vos variables:
```env
POSTGRES_URL=postgresql://user:password@localhost:5432/purlema_saas
AUTH_SECRET=un-secret-tres-long-et-aleatoire-min-32-caracteres
STRIPE_SECRET_KEY=sk_test_votre_cle_stripe
STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_secret
BASE_URL=http://localhost:3000
```

3. **Initialiser la base de données**
```bash
npm run db:setup
npm run db:migrate
npm run db:seed  # Optionnel: données de test
```

4. **Lancer en développement**
```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🔑 Configuration Stripe

1. Créer un compte sur [stripe.com](https://stripe.com)
2. Récupérer votre clé secrète dans le dashboard Stripe (mode test)
3. Créer des produits et prix dans Stripe
4. Configurer le webhook:
   - URL: `http://localhost:3000/api/stripe/webhook` (en dev avec Stripe CLI)
   - Événements: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
5. Récupérer le secret du webhook

### Tester Stripe en local avec Stripe CLI
```bash
# Installer Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook

# La commande affichera votre webhook secret
```

## 📝 Scripts Disponibles

```bash
npm run dev          # Démarrer en mode développement (avec Turbopack)
npm run build        # Build de production
npm run start        # Démarrer en production
npm run db:setup     # Configuration initiale de la DB
npm run db:seed      # Remplir avec des données de test
npm run db:generate  # Générer les migrations Drizzle
npm run db:migrate   # Exécuter les migrations
npm run db:studio    # Ouvrir Drizzle Studio (GUI pour la DB)
```

## 🎨 Structure du Projet

```
saas/
├── app/                          # Next.js App Router
│   ├── (dashboard)/              # Routes protégées
│   │   ├── dashboard/            # Admin dashboard du starter
│   │   ├── editor/               # Éditeur de contenu
│   │   ├── radar/                # Découverte de contenu
│   │   ├── mixer/                # Mixer de contenu
│   │   ├── timeline/             # Calendrier
│   │   ├── library/              # Bibliothèque
│   │   ├── drafts/               # Brouillons
│   │   ├── templates/            # Modèles
│   │   ├── settings/             # Paramètres
│   │   ├── pricing/              # Tarification
│   │   └── layout.tsx            # Layout avec navigation
│   ├── (login)/                  # Routes d'authentification
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── api/                      # API Routes
│   │   ├── stripe/               # Webhooks et checkout Stripe
│   │   ├── user/                 # API utilisateur
│   │   └── team/                 # API équipes
│   ├── globals.css               # Styles globaux
│   └── layout.tsx                # Layout racine
├── components/
│   ├── ui/                       # Composants shadcn/ui
│   └── custom/                   # Vos composants personnalisés
│       ├── Dashboard/
│       ├── Editor/
│       ├── Radar/
│       ├── Mixer/
│       ├── Timeline/
│       ├── Pages/
│       ├── Admin/
│       └── BottomNavigation.tsx
├── lib/
│   ├── db/                       # Configuration DB et queries
│   └── payments/                 # Logique Stripe
├── middleware.ts                 # Middleware d'authentification
└── package.json
```

## 🔐 Authentification

L'authentification utilise JWT stockés dans des cookies HTTP-only:
- `/sign-up` - Inscription
- `/sign-in` - Connexion
- Toutes les routes sous `/(dashboard)` sont protégées

## 💳 Gestion des Abonnements

Le système d'abonnement Stripe inclut:
- Plans multiples configurables
- Checkout Session pour nouveaux abonnements
- Customer Portal pour gérer les abonnements
- Webhooks pour synchroniser les statuts

## 🚢 Déploiement

### Vercel (Recommandé)

1. Pusher votre code sur GitHub
2. Importer dans Vercel
3. Configurer les variables d'environnement
4. Configurer une base PostgreSQL (Vercel Postgres, Neon, Supabase, etc.)
5. Mettre à jour l'URL du webhook Stripe

### Autres plateformes
Compatible avec tout hébergeur supportant Next.js 15:
- Railway
- Render
- AWS (Amplify, ECS)
- Google Cloud
- Azure

## 🤝 Contribution

Ce projet intègre:
- **next-saas-starter** de Vercel pour la base SaaS (auth, Stripe, admin)
- **Vos composants Figma** pour l'UI de l'application

Les deux sont préservés et peuvent être utilisés côte à côte.

## 📚 Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Drizzle ORM](https://orm.drizzle.team/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📄 License

Voir LICENSE

---

**Note**: Ce projet est en développement. Les fonctionnalités d'IA et de génération de contenu nécessiteront des intégrations supplémentaires (OpenAI, etc.).
