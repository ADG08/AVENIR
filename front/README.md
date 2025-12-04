# AVENIR - Front-End

Application bancaire moderne construite avec Next.js 16, TypeScript, tRPC, et TailwindCSS.

## Technologies

- **Next.js 16** - Framework React avec App Router
- **TypeScript** - Typage statique
- **tRPC** - API type-safe end-to-end
- **React Query** - Gestion d'état asynchrone
- **TailwindCSS 4** - Framework CSS utilitaire
- **Radix UI** - Primitives d'interface accessibles
- **Zod** - Validation de schéma
- **React Hook Form** - Gestion de formulaires
- **Framer Motion** - Animations
- **i18next** - Internationalisation (FR/EN)

## Structure du projet

```
front/
├── app/                    # Pages Next.js (App Router)
│   ├── layout.tsx         # Layout racine avec providers
│   ├── page.tsx           # Page d'accueil
│   └── globals.css        # Styles globaux
├── components/            # Composants réutilisables
│   └── ui/               # Composants UI de base
│       ├── button.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── toast.tsx
│       └── toaster.tsx
├── hooks/                # Custom hooks React
│   └── use-toast.ts
├── i18n/                 # Configuration i18n
│   ├── config.ts
│   └── locales/
│       ├── en/
│       │   └── common.json
│       └── fr/
│           └── common.json
├── lib/                  # Utilitaires et configuration
│   ├── trpc/
│   │   ├── client.ts    # Client tRPC
│   │   └── Provider.tsx # Provider tRPC
│   └── utils.ts         # Fonctions utilitaires
└── public/              # Fichiers statiques
```

## Installation

1. Les dépendances sont déjà installées. Si nécessaire :
```bash
npm install
```

2. Créer un fichier `.env.local` basé sur `.env.example` :
```bash
cp .env.example .env.local
```

3. Configurer l'URL de l'API dans `.env.local` :
```
NEXT_PUBLIC_API_URL=http://localhost:3001/trpc
```

## Développement

Lancer le serveur de développement :

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Construit l'application pour la production
- `npm start` - Lance le serveur de production
- `npm run lint` - Vérifie le code avec ESLint

## Configuration tRPC

Le client tRPC est configuré pour se connecter au backend. Assurez-vous que :

1. Le backend est lancé sur `http://localhost:3001`
2. Les types sont partagés depuis `../back/infrastructure/framework/fastify/server`

## Internationalisation

L'application supporte le français (par défaut) et l'anglais.

- Les traductions sont dans `i18n/locales/`
- Utiliser le hook `useTranslation` pour accéder aux traductions
- Format : `t('namespace.key')`

Exemple :
```tsx
const { t } = useTranslation('common');
return <p>{t('common.welcome')}</p>;
```

## Composants UI

Les composants UI de base sont construits avec Radix UI et stylés avec TailwindCSS.

Composants disponibles :
- Button
- Input
- Label
- Toast/Toaster

Pour ajouter de nouveaux composants, créez-les dans `components/ui/`.

## Bonnes pratiques

- Utiliser des composants fonctionnels avec hooks
- Valider les formulaires avec Zod
- Utiliser tRPC pour les appels API
- Internationaliser tous les textes
- Utiliser TailwindCSS pour le styling
- Préférer les primitives Radix aux composants Shadcn
- Ajouter des états de chargement et d'erreur
- Assurer l'accessibilité (a11y)
- Tester la responsivité mobile

## Prochaines étapes

1. Connecter le client tRPC au backend
2. Créer les pages de l'application (dashboard, profil, etc.)
3. Implémenter l'authentification
4. Ajouter plus de composants UI
5. Implémenter les fonctionnalités métier

