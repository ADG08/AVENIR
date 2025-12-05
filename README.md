# AVENIR - Application Bancaire Moderne

Application bancaire full-stack construite avec Next.js, TypeScript, tRPC et Fastify.

## 📁 Structure du Projet

```
AVENIR/
├── back/           # Backend API (Fastify + Clean Architecture)
│   ├── application/      # Use Cases et Ports
│   ├── domain/          # Entités métier et Enums
│   └── infrastructure/  # Frameworks et Repositories
│
└── front/          # Frontend (Next.js 16 + TypeScript)
    ├── app/             # Pages et layouts Next.js
    ├── components/      # Composants React réutilisables
    ├── hooks/           # Custom hooks
    ├── i18n/            # Internationalisation (FR/EN)
    └── lib/             # Utilitaires et configuration
```

## 🚀 Démarrage Rapide

### Backend

```bash
cd back
npm install
npm run dev    # Démarre sur http://localhost:3001
```

### Frontend

```bash
cd front
npm install
npm run dev    # Démarre sur http://localhost:3000
```

## 🛠️ Technologies

### Backend
- **Fastify** - Framework web rapide
- **TypeScript** - Typage statique
- **Clean Architecture** - Architecture hexagonale

### Frontend
- **Next.js 16** - Framework React avec App Router
- **TypeScript** - Typage statique
- **tRPC** - API type-safe end-to-end
- **TailwindCSS 4** - Framework CSS utilitaire
- **Radix UI** - Primitives d'interface accessibles
- **Zod** - Validation de schéma
- **React Hook Form** - Gestion de formulaires
- **Framer Motion** - Animations
- **i18next** - Internationalisation (FR/EN)

## 🌍 Internationalisation

L'application supporte le français (langue par défaut) et l'anglais.

## 📝 License

MIT


