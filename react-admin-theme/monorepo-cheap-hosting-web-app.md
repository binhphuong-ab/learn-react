# Monorepo Cheap Hosting Web App PRD

## Overview
A product website for vacuum pumps with a separate local Admin app for managing product data. The customer-facing site is a static export (SSG) hosted on low-cost hosting without Node.js. The Admin app runs locally and connects to a local MongoDB server to create and update product information.

## Goals
- Show vacuum pump products and product information to customers.
- Keep hosting costs low by deploying static files only.
- Provide a local Admin interface for managing product data.
- Deliver a visually impressive, animated user experience using CSS-only effects.

## Non-Goals
- No server-side rendering or serverless APIs on the hosting provider.
- No online Admin access on the public hosting.
- No real-time inventory or order processing.

## Users
- **Customer**: Views products and product information on the static website.
- **Admin (local)**: Manages product data via Refine admin panel.

## Project Structure

```
react-admin-theme/
├── apps/
│   ├── web/                    # Next.js SSG customer site
│   │   ├── src/
│   │   │   ├── app/            # App Router pages
│   │   │   ├── components/     # UI components (Shadcn/UI + custom)
│   │   │   └── lib/            # Utilities and data fetching
│   │   └── out/                # Static export output
│   │
│   └── admin/                  # Refine + Shadcn/UI admin app
│       └── src/
│           ├── components/     # Admin UI components
│           └── pages/          # CRUD pages (products, categories)
│
├── packages/
│   ├── api/                    # Express REST API
│   │   └── src/
│   │       ├── routes/         # API endpoints
│   │       └── models/         # Mongoose schemas
│   │
│   └── shared/                 # Shared TypeScript types
│       └── src/
│           └── types.ts        # Product, Category interfaces
│
├── data/                       # Exported JSON data for SSG
│   ├── products.json
│   └── categories.json
│
└── scripts/                    # Build and export scripts
```

## Key Features

### Customer Website (web)
- **Homepage** with animated hero section, featured products, stats, and CTA sections
- **Product listing page** with client-side category filtering
- **Product detail page** with specifications and image gallery
- **About page** with company story, mission, and values
- **Contact page** with contact form and information
- **Responsive design** using Tailwind CSS and Shadcn/UI
- **CSS animations** including gradients, floating elements, glassmorphism, 3D effects

### Admin App (admin)
- Product CRUD (Create, Read, Update, Delete)
- Category management
- Featured product toggle
- Image URL management
- Specifications key-value editor
- Data export functionality
- Built with Refine framework + Shadcn/UI

## Requirements

### Functional
- Customer site generated as static files via Next.js SSG export
- Admin app supports full CRUD for products and categories
- Product data stored in local MongoDB
- Admin changes update MongoDB; manual rebuild exports static site
- Client-side filtering works after hydration in static site

### Non-Functional
- Works without Node.js on hosting (static HTML/CSS/JS only)
- Fast load times with optimized static assets
- Clean, consistent UI using Shadcn/UI components
- 30+ CSS animations for engaging user experience

## Data Model

### Product
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectId | Yes | MongoDB ID |
| `name` | string | Yes | Product name |
| `slug` | string | Yes | URL-friendly identifier |
| `summary` | string | Yes | Short description |
| `description` | string | Yes | Full description (HTML supported) |
| `images` | string[] | No | Array of image URLs |
| `specs` | Record<string, string> | No | Key-value specifications |
| `price` | number | No | Price in VND |
| `category` | string | Yes | Category name |
| `featured` | boolean | No | Show on homepage |
| `createdAt` | Date | Yes | Creation timestamp |
| `updatedAt` | Date | Yes | Last update timestamp |

### Category
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectId | Yes | MongoDB ID |
| `name` | string | Yes | Category name |
| `slug` | string | Yes | URL-friendly identifier |
| `description` | string | No | Category description |

## User Flow

1. Admin edits products locally in the Refine admin app (http://localhost:5173)
2. Admin triggers data export (saves to JSON files)
3. Admin runs `pnpm build:web` to generate static site
4. Static files (apps/web/out/) are uploaded to hosting provider
5. Customers browse the static product site

## Tech Stack

| Component | Technology | Status |
|-----------|------------|--------|
| **Monorepo** | pnpm + Turborepo | Implemented |
| **Web Framework** | Next.js 14 (App Router, SSG) | Implemented |
| **UI Library** | Shadcn/UI + Tailwind CSS | Implemented |
| **Admin Framework** | Refine + Shadcn/UI | Implemented |
| **API Server** | Express.js + TypeScript | Implemented |
| **Database ODM** | Mongoose | Implemented |
| **Database** | MongoDB 7.0 (local via Homebrew) | Running |

## CSS Effects & Animations

The website showcases extensive CSS capabilities:

### Background Effects
- Animated gradient backgrounds with color shifting
- Morphing blob shapes with organic movement
- Grid pattern overlays

### Interactive Elements
- Shimmer effects on buttons
- Pulse glow animations
- 3D card transforms with perspective
- Hover scale and rotate effects
- Staggered fade-in animations

### Visual Effects
- Glassmorphism (glass effect with blur)
- Gradient text with neon glow
- Floating geometric shapes
- Wave SVG decorations

### Animation Utilities
- 30+ keyframe animations
- Delay utilities (100ms to 1000ms)
- CSS scroll-triggered animations

## Milestones

| Phase | Status |
|-------|--------|
| Set up monorepo structure | Completed |
| Build MongoDB schema and API | Completed |
| Implement admin CRUD screens | Completed |
| Build static web pages | Completed |
| Add CSS effects and animations | Completed |
| Implement client-side filtering | Completed |
| Static export pipeline | Completed |

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Static site needs manual rebuild | Clear workflow documentation |
| Local-only admin access | Designed for single admin use case |
| Hosting constraints (no server code) | Pure static HTML/CSS/JS output |
| Large images slow loading | Use external image hosting or optimize |

## Success Criteria

- [x] Admin can manage products locally via Refine
- [x] Static site builds successfully with all pages
- [x] Customers can browse products with no runtime errors
- [x] Category filter works on static site (client-side)
- [x] CSS animations render correctly in all modern browsers
- [x] Site loads fast with optimized assets
