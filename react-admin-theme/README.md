# Vacuum Pumps - Product Website

A monorepo containing a static product website and local admin panel for managing vacuum pump products.

## Architecture

```
├── apps/
│   ├── web/          # Next.js SSG customer website
│   └── admin/        # React-admin panel (local only)
├── packages/
│   ├── api/          # Express REST API + MongoDB
│   └── shared/       # Shared TypeScript types
├── scripts/          # Data export scripts
└── data/             # Exported JSON data for SSG
```

## Prerequisites

- Node.js >= 18
- pnpm >= 9
- MongoDB 7.0 (local)

### Start MongoDB (macOS)

```bash
brew services start mongodb-community@7.0
```

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Seed sample data (optional)

```bash
pnpm db:seed
```

### 3. Start development servers

```bash
# Terminal 1: API server (http://localhost:3001)
pnpm dev:api

# Terminal 2: Admin panel (http://localhost:5173)
pnpm dev:admin

# Terminal 3: Web app (http://localhost:3000)
pnpm dev:web
```

Or run all at once:

```bash
pnpm dev
```

## Workflow

1. **Manage products** in the admin panel at http://localhost:5173
2. **Export data** by clicking "Export Data" in admin dashboard (or run `pnpm export`)
3. **Build static site**:
   ```bash
   pnpm build:web
   ```
4. **Upload** the `apps/web/out/` folder to your static hosting

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start all apps in development |
| `pnpm dev:api` | Start API server only |
| `pnpm dev:admin` | Start admin panel only |
| `pnpm dev:web` | Start web app only |
| `pnpm build` | Build all apps |
| `pnpm build:web` | Build web app (static export) |
| `pnpm export` | Export MongoDB data to JSON and build web |
| `pnpm db:seed` | Seed sample product data |

## Tech Stack

- **Monorepo**: pnpm workspaces + Turborepo
- **Web**: Next.js 14, Tailwind CSS, Shadcn/UI
- **Admin**: React-admin 5, Vite
- **API**: Express.js, Mongoose
- **Database**: MongoDB 7.0

## Deployment

The web app exports to static HTML/CSS/JS files that can be hosted on any static hosting:

- Traditional shared hosting (FTP upload)
- Netlify, Vercel, GitHub Pages
- AWS S3, Google Cloud Storage

No server-side runtime required.
