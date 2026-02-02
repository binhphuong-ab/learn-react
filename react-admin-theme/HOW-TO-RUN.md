# How to Run the Vacuum Pumps Monorepo

This guide explains how to run all components of the Vacuum Pumps website system.

## Prerequisites

- **Node.js** v18 or higher
- **pnpm** (package manager) - Install with `npm install -g pnpm`
- **MongoDB** v7.0 (via Homebrew on macOS)

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Start MongoDB
brew services start mongodb-community@7.0

# 3. Start all services (in separate terminals)
pnpm --filter api dev      # Terminal 1: API Server
pnpm --filter admin dev    # Terminal 2: Admin Panel
pnpm --filter web dev      # Terminal 3: Website (dev mode)
```

## Services Overview

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| API Server | 3001 | http://localhost:3001 | REST API for MongoDB |
| Admin Panel | 5173 | http://localhost:5173 | Refine admin interface |
| Website (Dev) | 3000 | http://localhost:3000 | Next.js development server |
| Static Site | 3002 | http://localhost:3002 | Built static site preview |
| MongoDB | 27017 | mongodb://localhost:27017 | Database |

---

## Detailed Setup

### 1. Start MongoDB

```bash
# Start MongoDB service (macOS with Homebrew)
brew services start mongodb-community@7.0

# Verify MongoDB is running
brew services list | grep mongodb

# Connect to MongoDB shell (optional)
mongosh "mongodb://localhost:27017"
```

### 2. Start API Server

```bash
pnpm --filter api dev
```

**API Endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | List all products |
| GET | /api/products/:id | Get single product |
| POST | /api/products | Create product |
| PUT | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |
| GET | /api/categories | List all categories |
| POST | /api/categories | Create category |
| PUT | /api/categories/:id | Update category |
| DELETE | /api/categories/:id | Delete category |
| POST | /api/export | Export data to JSON files |

### 3. Start Admin Panel

```bash
pnpm --filter admin dev
```

Open http://localhost:5173 to access the Refine admin interface.

**Admin Features:**
- Product list with search and pagination
- Create/Edit/Delete products
- Category management
- Toggle featured products
- Manage product images and specifications

### 4. Start Customer Website (Development)

```bash
pnpm --filter web dev
```

Open http://localhost:3000 to view the website in development mode.

---

## Building & Serving Static Site

### Build Static Site

```bash
# Build the static site
pnpm build:web

# Output location: apps/web/out/
```

### Serve Static Site Locally

```bash
# Option 1: Using npx serve
cd apps/web/out && npx serve -p 3002

# Option 2: Using Python
cd apps/web/out && python3 -m http.server 3002
```

Open http://localhost:3002 to preview the static site.

### Deploy Static Site

Upload the contents of `apps/web/out/` to any static hosting:
- Shared hosting (FTP upload)
- Netlify
- Vercel (static mode)
- GitHub Pages
- AWS S3 + CloudFront

---

## Data Management

### Seed Sample Data

```bash
pnpm db:seed
```

### Export Data for Static Site

```bash
# Option 1: Via API endpoint
curl -X POST http://localhost:3001/api/export

# Option 2: Via script
pnpm export
```

This exports data to:
- `data/products.json`
- `data/categories.json`

---

## Complete Workflow

### Development Workflow

1. **Start MongoDB**: `brew services start mongodb-community@7.0`
2. **Start API**: `pnpm --filter api dev`
3. **Start Admin**: `pnpm --filter admin dev`
4. **Start Web**: `pnpm --filter web dev`
5. **Develop** with hot reload on all services

### Production Workflow

1. **Manage products** via Admin at http://localhost:5173
2. **Export data**: `curl -X POST http://localhost:3001/api/export`
3. **Build static site**: `pnpm build:web`
4. **Preview locally**: `cd apps/web/out && npx serve -p 3002`
5. **Deploy**: Upload `apps/web/out/` folder to hosting

---

## Running All Services in One Command

You can use multiple terminal panes or a process manager:

```bash
# Using tmux (example)
tmux new-session -d -s vacuum 'pnpm --filter api dev'
tmux split-window -h 'pnpm --filter admin dev'
tmux split-window -v 'pnpm --filter web dev'
tmux attach-session -t vacuum
```

---

## Troubleshooting

### MongoDB not starting

```bash
# Check MongoDB status
brew services list

# Restart MongoDB
brew services restart mongodb-community@7.0

# Check MongoDB logs
cat /opt/homebrew/var/log/mongodb/mongo.log
```

### Port already in use

```bash
# Find process using port (e.g., 3001)
lsof -i :3001

# Kill process by PID
kill -9 <PID>

# Or kill all processes on port
lsof -ti:3001 | xargs kill -9
```

### Build errors

```bash
# Clear Next.js cache
rm -rf apps/web/.next

# Rebuild
pnpm build:web
```

### Dependencies issues

```bash
# Clean and reinstall
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
pnpm install
```

### Static site not updating

Make sure to:
1. Export data first: `curl -X POST http://localhost:3001/api/export`
2. Rebuild: `pnpm build:web`
3. Restart the serve command if already running

---

## Project Scripts

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies |
| `pnpm --filter api dev` | Start API server |
| `pnpm --filter admin dev` | Start admin panel |
| `pnpm --filter web dev` | Start website (dev mode) |
| `pnpm build:web` | Build static site |
| `pnpm export` | Export MongoDB data to JSON |
| `pnpm db:seed` | Seed sample data |
