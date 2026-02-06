# Learn English

Local-first English learning suite with:
- Chrome Extension (Manifest V3)
- Local API server (Node.js + Express + MongoDB)
- Local dashboard (React + Vite)

## What It Does
- Highlight a word/phrase on any page, click floating icon, view inline definition.
- Play pronunciation with fallback logic:
  - dictionary audio URL first
  - Web Speech API fallback if dictionary audio fails
- Save words quickly from inline tooltip, popup, context menu, or shortcut.
- Auto-capture source context: `sourceTitle` and `sourceUrl`.
- Review due words with spaced repetition.
- Track progress in dashboard with timeline, stats, and charts.
- Export/import JSON or CSV.

## Important Current Behavior
- No `translation` field in UI flows.
- Duplicate save handling:
  - Saving the same term again (case-insensitive) does not create a new row.
  - Existing row is updated and `addedAt` is refreshed.
  - Dashboard `Added` column shows date + time.

## Stack
- API: Express, Mongoose, Socket.IO
- Dashboard: React, Vite, Recharts, Socket.IO client
- Extension: MV3 background service worker + content script + popup + options
- DB: MongoDB local

## Prerequisites
- Node.js 18+
- MongoDB running at `mongodb://127.0.0.1:27017`
- Google Chrome

## Setup
```bash
npm install
cp api/.env.example api/.env
```

## Run
1. API server (`http://localhost:8083`):
```bash
npm run dev:api
```
2. Dashboard (`http://localhost:8082`):
```bash
npm run dev:dashboard
```

## Load Extension
1. Open `chrome://extensions`
2. Enable `Developer mode`
3. Click `Load unpacked`
4. Select folder: `.../Learn English/extension`

## Root Scripts
- `npm run dev:api`
- `npm run dev:dashboard`
- `npm run start:api`
- `npm run build`

## API Endpoints
- `GET /health`
- `GET /api/lookup?term=...`
- `GET /api/vocab`
- `GET /api/vocab/:id`
- `POST /api/vocab`
- `PUT /api/vocab/:id`
- `DELETE /api/vocab/:id`
- `GET /api/review/due`
- `POST /api/review/:id`
- `GET /api/stats`
- `GET /api/timeline`
- `GET /api/export?format=json|csv`
- `POST /api/import`
- `GET /api/settings`
- `PUT /api/settings`

## Configuration
See `api/.env.example`:
- `PORT`
- `MONGODB_URI`
- `DASHBOARD_ORIGIN`
- `DICTIONARY_API_URL`
- `CACHE_TTL_DAYS`

## Technical Handbook
Full technical documentation for future development/debugging:
- `system-detail.md`

