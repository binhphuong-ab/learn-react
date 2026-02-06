# Learn English System Detail

## 1. Purpose
This document is the technical source of truth for development, maintenance, and debugging.

Scope:
- Architecture and runtime topology
- Data model and API contract
- Core flows (lookup, save, dedupe, review, dashboard updates)
- Extension internals
- Dashboard internals
- Operational and debugging playbook

## 2. Workspace Layout
Root: `Learn English`

- `api/`: Express API + MongoDB models + dictionary cache + review + stats + import/export + Socket.IO
- `dashboard/`: React dashboard for analytics and CRUD
- `extension/`: Chrome extension (MV3)
- `PRD.md`: product requirement source
- `README.md`: quickstart
- `system-detail.md`: this technical reference

## 3. Runtime Topology

```mermaid
flowchart LR
  A["Chrome Page"] --> B["Extension Content Script"]
  B --> C["Extension Background Service Worker"]
  C --> D["API Server :8083"]
  D --> E["MongoDB Atlas Cluster0"]
  D --> F["RapidAPI WordsAPI"]
  D --> G["Socket.IO"]
  H["Dashboard :8082"] --> D
  H --> G
```

Ports:
- API: `8083`
- Dashboard: `8082`
- MongoDB: Atlas over TLS (`mongodb+srv`, no local `27017` required)

## 4. Components

### 4.1 API
Key files:
- `api/src/server.js`
- `api/src/app.js`
- `api/src/routes/*.js`
- `api/src/models/*.js`
- `api/src/services/*.js`

Responsibilities:
- CRUD vocab data
- Deduplicate save by term
- Dictionary proxy/cache
- Spaced repetition updates
- Stats/timeline aggregation
- Import/export
- Real-time change events (`vocab:changed`)

### 4.2 Extension
Key files:
- `extension/manifest.json`
- `extension/runtime.js` (cross-browser shim for Chrome/Safari WebExtension APIs)
- `extension/background.js`
- `extension/content.js`
- `extension/popup.*`
- `extension/options.*`

Responsibilities:
- Capture selected text
- Inline lookup tooltip and pronunciation
- Save operations
- Settings and lightweight library management
- Bridge API calls through background script
- Maintain Chrome/Safari API compatibility through runtime shim

### 4.3 Dashboard
Key files:
- `dashboard/src/App.jsx`
- `dashboard/src/components/*.jsx`
- `dashboard/src/lib/api.js`

Responsibilities:
- Analytics (stats cards, charts)
- Timeline and library views
- Filtering and CRUD
- Review actions
- Import/export actions
- Live refresh via Socket.IO

## 5. Configuration
File: `api/.env`

Variables:
- `PORT` default `8083`
- `MONGODB_URI` default `mongodb+srv://goodmotorvn_db_user:MHlo3ODgZlT2Tnuu@cluster0.iepimik.mongodb.net/learn_english?appName=Cluster0`
- `DASHBOARD_ORIGIN` default `http://localhost:8082`
- `RAPIDAPI_HOST` default `wordsapiv1.p.rapidapi.com`
- `RAPIDAPI_KEY` required
- `WORDS_API_BASE_URL` default `https://wordsapiv1.p.rapidapi.com`
- `CACHE_TTL_DAYS` default `90`

Atlas credentials used in this project:
- User: `goodmotorvn_db_user`
- Password: `MHlo3ODgZlT2Tnuu`
- URI: `mongodb+srv://goodmotorvn_db_user:MHlo3ODgZlT2Tnuu@cluster0.iepimik.mongodb.net/learn_english?appName=Cluster0`

Extension API base:
- Default `http://localhost:8083`
- Override via extension options page (`apiBase`, saved in `chrome.storage.local`)

## 6. Data Model

### 6.1 Collection: `vocabitems`
Model: `api/src/models/VocabItem.js`

Fields:
- `term: string` required
- `addedAt: date` logical "added/last re-added" time
- `pronunciation: string`
- `audioUrl: string`
- `translation: string` legacy field in DB; not used by current UI flows
- `meaning: string`
- `examples: string[]`
- `tags: string[]`
- `difficulty: number | null`
- `masteryLevel: number (0..100)`
- `sourceUrl: string`
- `sourceTitle: string`
- `context: string`
- `review` object:
  - `dueDate`
  - `intervalDays`
  - `ease`
  - `lastReviewedAt`
  - `reviewCount`
  - `correctCount`
- Timestamps: `createdAt`, `updatedAt`

Indexes:
- text index on `term`, `meaning`, `translation`, `context`
- `tags`
- `createdAt`
- `addedAt`
- `review.dueDate`

### 6.2 Collection: `dictionarycaches`
Model: `api/src/models/DictionaryCache.js`

Fields:
- `term` unique lowercase key
- `definition` raw dictionary payload
- `phonetic`
- `audioUrl`
- `cachedAt`
- `expiresAt`
- Timestamps

### 6.3 Collection: `settings`
Model: `api/src/models/Setting.js`

Single logical row with `key = "default"`:
- `dailyReviewLimit`
- `defaultIntervals`
- `enableAudio`
- `keyboardShortcuts.quickSave`

## 7. API Contract

All API routes are in `api/src/routes` and mounted under `/api` except `/health`.

### 7.1 Health
- `GET /health`
- Response: `{ ok, service, dbReady, now }`

### 7.2 Dictionary Lookup
- `GET /api/lookup?term=WORD`
- Response includes:
  - `cached`
  - `term`
  - `matchedTerm` (when API resolves via base form fallback, e.g. `contributed -> contribute`)
  - `raw`
  - `phonetic`
  - `audioUrl`
  - `meanings[]`
  - `shortDefinition`
  - `example`
  - `examples[]`
  - `synonyms[]`

Behavior:
- read cache first
- if cache expired/missing, call external API and upsert cache
- if external fails but cache exists, return stale cache

### 7.3 Vocab List
- `GET /api/vocab`
- Query params:
  - `page`, `limit`
  - `q` full-text-like regex search
  - `tag`
  - `due=true`
  - `dateFrom`, `dateTo`
  - `masteryMin`, `masteryMax`
- Sorted by `addedAt desc`, fallback `createdAt desc`

### 7.4 Vocab Create with Dedupe
- `POST /api/vocab`
- Dedupe rule:
  - case-insensitive exact term match (`^term$`, regex escaped)
- If term exists:
  - update `addedAt = now`
  - refresh source fields when provided
  - fill missing meaning/pronunciation/audio
  - merge tags/examples uniquely
  - return updated record (`200`)
- If term does not exist:
  - create new record with `addedAt = now`
  - return `201`

### 7.5 Vocab Update/Delete
- `PUT /api/vocab/:id`
- `DELETE /api/vocab/:id`

### 7.6 Review
- `GET /api/review/due?limit=N`
- `POST /api/review/:id` body `{ "rating": "again|good|easy" }`

Algorithm (`api/src/services/reviewService.js`):
- Adjust `ease` and interval by rating policy
- Compute next `dueDate`
- Increment review counters
- Recompute `masteryLevel`

### 7.7 Timeline & Stats
- `GET /api/timeline`
  - filters by `addedAt` date range
  - fallback for legacy rows where `addedAt` absent uses `createdAt`
- `GET /api/stats`
  - summary + chart datasets
  - progress bins by `addedAt || createdAt`

### 7.8 Import/Export
- `GET /api/export?format=json|csv`
- `POST /api/import` with `{ items: [...] }`

Import notes:
- uses incoming `addedAt`, else `createdAt`, else now

### 7.9 Settings
- `GET /api/settings`
- `PUT /api/settings`

## 8. Real-Time Events
Socket.IO server runs in API process.

Event emitted: `vocab:changed`
- payload `type` values:
  - `created`
  - `updated`
  - `deleted`
  - `reviewed`
  - `imported`

Dashboard subscribes and triggers full reload.

## 9. Extension Internal Design

### 9.1 Background Script (`extension/background.js`)
Main roles:
- Central API client for extension pages/content script
- Context menu registration: `Save to Learn English`
- Shortcut command: `quick-save-selection`
- Message router for all extension actions

Message types:
- `LOOKUP_TERM`
- `SAVE_VOCAB`
- `UPDATE_VOCAB`
- `DELETE_VOCAB`
- `LIST_VOCAB`
- `GET_DUE`
- `REVIEW_ITEM`
- `HEALTH_CHECK`
- `GET_SETTINGS`
- `UPDATE_SETTINGS`

### 9.2 Content Script (`extension/content.js`)
Flow:
1. Detect selection (`mouseup` / keyboard selection)
2. Render floating icon near selection
3. On icon click, show tooltip and lookup term via background
4. Save term with source/context metadata
5. Audio playback strategy:
   - try dictionary `audioUrl`
   - fallback to Web Speech API voice synthesis
6. Dismiss tooltip/icon on click-away or ESC

### 9.3 Popup (`extension/popup.js`)
- Quick add form
- Fetch active tab title/url and include as source on save
- Show due count and recent list

### 9.4 Options (`extension/options.js`)
- API base + settings save
- Basic library listing/edit/delete
- Preserves existing source/context/review fields when editing

## 10. Dashboard Internal Design

Entry:
- `dashboard/src/App.jsx`

Key components:
- `StatsCards.jsx`
- `ChartsPanel.jsx`
- `TimelineView.jsx`
- `LibraryTable.jsx`
- `ReviewPanel.jsx`

Data loading:
- REST via axios instance (`dashboard/src/lib/api.js`)
- WebSocket invalidation on `vocab:changed`

Library display behavior:
- shows source title/link
- shows `Added` using `addedAt || createdAt`

## 11. Core User Flows

### 11.1 Inline Lookup + Save
1. User selects word on page.
2. Content script shows floating icon.
3. User clicks icon.
4. Content script asks background for lookup.
5. Background requests API lookup.
6. API resolves from cache or external dictionary.
7. Tooltip shows result.
8. User clicks save.
9. API dedupes by term and either updates existing or creates new.
10. API emits `vocab:changed`.

### 11.2 Context Menu Save
1. User highlights text.
2. Context menu action sends selected text.
3. Background optionally enriches with lookup data.
4. Background posts to API.
5. API dedupe logic applied.

### 11.3 Review
1. UI fetches due words.
2. User rates `again|good|easy`.
3. API updates interval/ease/mastery and next due date.

## 12. Security and Access
- CORS allows:
  - dashboard origin from env
  - `chrome-extension://*`
- API is local by default; no auth layer implemented.
- Extension host permissions include `<all_urls>` to read selection and page metadata.

## 13. Operational Commands
From project root:

Install:
```bash
npm install
cp api/.env.example api/.env
```

Run API:
```bash
npm run dev:api
```

Run dashboard:
```bash
npm run dev:dashboard
```

Build dashboard:
```bash
npm run build -w dashboard
```

Generate Safari extension project (requires full Xcode):
```bash
npm run safari:convert
```

Health checks:
```bash
curl http://localhost:8083/health
curl "http://localhost:8083/api/lookup?term=example"
curl "http://localhost:8083/api/vocab?limit=5"
```

## 14. Debugging Playbook

### 14.1 API not reachable
Checks:
- `curl http://localhost:8083/health`
- verify Atlas URI/credentials are correct in `api/.env`
- verify current network/IP is allowed by Atlas
- inspect API console output

### 14.2 Dashboard not updating after save
Checks:
- API emits `vocab:changed`
- dashboard has Socket.IO connection to `http://localhost:8083`
- open browser devtools network/ws tabs

### 14.3 Audio button fails
Checks:
- dictionary response may contain invalid or blocked `audioUrl`
- fallback uses Web Speech API; verify browser allows speech synthesis
- some systems may not include Google voice names; fallback picks first English/system voice

### 14.4 Duplicate rows still appear
Checks:
- confirm API was restarted after dedupe changes
- verify calls use `POST /api/vocab` (dedupe is there)
- verify terms are semantically identical after trim/case
- inspect API result IDs; duplicate save should return existing `_id`

### 14.5 Source title missing
Checks:
- save path must include page metadata (`sourceTitle`/`sourceUrl`)
- popup save uses active tab metadata
- inline/content save uses `document.title`

## 15. Known Technical Debt and Future Improvements
- `translation` remains in DB schema for backward compatibility but is no longer surfaced in UI.
- No automated test suite yet.
- Import currently inserts rows directly; dedupe is not applied there.
- Large dashboard bundle warning from Vite can be improved with code splitting.
- No authentication because system is designed for local single-user usage.
- No API auth layer; DB access control relies on MongoDB Atlas credentials.

## 16. Suggested Engineering Conventions
When modifying behavior:
1. Keep dedupe logic centralized in API `POST /api/vocab`.
2. Keep extension thin; avoid direct DB logic in extension.
3. Emit `vocab:changed` for every write path.
4. Update both dashboard and extension views when schema fields change.
5. Update `README.md` and this file together for any architecture or API contract change.
