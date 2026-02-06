# PRD: Learn English Chrome Extension (Personal, Synced)

## 1. Overview
A personal-use Chrome extension that helps me learn English while browsing. It captures words/phrases I select, lets me store notes and translations, schedules reviews (spaced repetition), and provides lightweight practice inside the browser. The extension runs locally, while data is stored in MongoDB Atlas for cross-device sync.

## 2. Goals
- Capture selected words/phrases quickly from any webpage.
- **Highlight any word/phrase** → click small icon → see instant definitions, pronunciation, and examples.
- Build a personal vocabulary list with definitions, examples, and tags.
- Review vocabulary using a simple spaced-repetition flow.
- **View learning progress** and timeline in a web dashboard (localhost:8082).
- Sync vocabulary data across multiple devices via MongoDB Atlas.
- Simple, fast UX suitable for daily use.

## 3. Non-Goals
- No multi-user support.
- No team/shared workspace features (single account usage only).
- No advanced AI tutoring or speech recognition in v1.

## 4. Target User
- Single user (me) learning English while browsing.

## 5. User Stories
- As a learner, I want to **highlight any word/phrase** and see a small icon appear.
- As a learner, I want to **click the icon** to see meaning, pronunciation, and examples in a tooltip.
- As a learner, I want to **hear pronunciation** with one click on the inline tooltip.
- As a learner, I want to highlight a word/phrase and save it with one click.
- As a learner, I want to add a translation, meaning, and example sentence.
- As a learner, I want to review due items in a short daily session.
- As a learner, I want to search and filter my vocabulary list.
- As a learner, I want to **see my learning progress** in a dashboard with charts and statistics.
- As a learner, I want to **see when I added each word** in a timeline view.
- As a learner, I want to export my data for backup.

## 6. Feature Set (v1)
### 6.1 Capture
- Context menu item: "Save to Learn English" when text is selected.
- Popup quick-add form (word/phrase, meaning, translation, tags).
- Auto-capture source URL, page title, and snippet context.

### 6.2 Click-to-Define (Inline Dictionary)
- **Highlight/select** any word or phrase on a webpage → **small icon appears** near the selection.
- **Click the icon** → inline tooltip appears with definition.
- Tooltip displays:
  - **Phonetic pronunciation** (IPA format).
  - **Audio pronunciation** button (plays audio).
  - **Meaning/definition** (fetched from dictionary API).
  - **Example sentence** from dictionary.
  - **"Save to Library"** button for quick-add.
- **Dictionary API integration**: WordsAPI via RapidAPI (`wordsapiv1.p.rapidapi.com`).
- **Fallback**: If API fails or offline, show "Add manually" option.
- **Auto-cache**: Store fetched definitions in MongoDB to reduce API calls.
- Icon and tooltip disappear on click-away or ESC key.

### 6.3 Vocabulary Library
- List view with search and filters (tags, difficulty, due status).
- Item details view: meaning, translation, examples, source.
- Edit and delete entries.

### 6.4 Review (Spaced Repetition Lite)
- Daily review queue based on due date.
- Simple rating (Again / Good / Easy) to update next review date.
- Session progress indicator.
- Show **original context** (sentence where word was found) during review.

### 6.5 Dashboard (Web App on localhost:8082)
- **Separate web application** (React/Next.js) running on port 8082.
- **Timeline View**: All words learned with timestamps (today, this week, this month, all time).
- **Statistics Dashboard**:
  - Total words learned.
  - Words mastered vs. in-progress.
  - Review streak counter.
  - Average learning rate (words/day, words/week).
- **Charts & Visualizations**:
  - Learning progress over time (line chart).
  - Words by tag (pie chart).
  - Review accuracy trends.
- **Advanced Search & Filter**:
  - Filter by date range, tags, mastery level, difficulty.
  - Full-text search across all fields.
- **Full CRUD Interface**: Edit, delete, bulk operations.
- **Auto-refresh**: Updates in real-time when new words are added via extension.

### 6.6 Export/Import
- Export to JSON/CSV.
- Import JSON (same schema).

### 6.7 Settings
- Review settings (daily limit, default intervals).
- Dictionary API connection settings (RapidAPI host/key via env).
- Keyboard shortcuts configuration.

## 7. Suggested Solution
### 7.1 Architecture
- **Chrome Extension (Manifest V3)**
  - Background service worker handles storage and DB API calls.
  - **Content script** to capture selected text, inject small icon on selection, and handle icon clicks.
  - Popup UI (React) for quick add and review summary.
  - Options page (React) for library management and settings.
- **Local Node.js API server (Express) - localhost:8083**
  - Runs on `localhost:8083` and connects to MongoDB.
  - REST endpoints for vocab CRUD, review updates, and export/import.
  - **Dictionary API proxy**: Calls WordsAPI via RapidAPI and caches results.
  - Returns definition, examples, synonyms, and pronunciation text.
- **Web Dashboard (React/Next.js) - localhost:8082**
  - Separate web app for analytics and advanced management.
  - Connects to same local API server.
  - Real-time updates via WebSocket or polling.
- **MongoDB Atlas cluster**
  - Store vocab items, review schedule, and cached dictionary definitions in cloud database.
- **External APIs**
  - WordsAPI via RapidAPI for definitions and pronunciation metadata.

### 7.4 Current MongoDB Atlas Configuration
- User: `goodmotorvn_db_user`
- Password: `MHlo3ODgZlT2Tnuu`
- URI: `mongodb+srv://goodmotorvn_db_user:MHlo3ODgZlT2Tnuu@cluster0.iepimik.mongodb.net/learn_english?appName=Cluster0`

### 7.2 Data Flow

**Flow A: Click-to-Define**
1. User **highlights/selects a word or phrase** on any webpage.
2. Content script detects selection and displays **small icon** near the selected text.
3. User **clicks the icon**.
4. Content script captures text and shows inline tooltip (loading state).
5. Background script calls local API (localhost:8083) → API checks MongoDB cache.
6. If cached: return definition immediately.
7. If not cached: API calls Dictionary API → saves to MongoDB → returns to extension.
8. Tooltip displays definition, pronunciation, and "Save" button.
9. User clicks "Save" → saved to MongoDB via local API.

**Flow B: Manual Capture**
1. User selects text and uses context menu "Save to Learn English".
2. Content script sends selection to background.
3. Background calls local API to save entry.
4. Popup/Options UI fetches items from local API.

**Flow C: Review**
1. Review updates write back to MongoDB via local API.

**Flow D: Dashboard**
1. Dashboard (localhost:8082) fetches data from local API.
2. Real-time updates via WebSocket when extension saves new words.

### 7.3 Rationale
- **MongoDB** is easy for flexible vocab entries (variable fields, tags) and caching.
- **Local API** isolates DB access from the extension, keeping the extension lightweight.
- **React UI** allows richer library and review experiences.
- **Separate Dashboard** provides better analytics without bloating extension size.
- **Caching dictionary API** reduces network calls and enables offline lookup for previously searched words.
- **WordsAPI via RapidAPI** provides broad lexical data (definitions, examples, synonyms, pronunciation text).

## 8. Data Model (MongoDB)
### 8.1 `vocab_items`
- `_id`: ObjectId
- `term`: string
- `pronunciation`: string (IPA phonetic, from dictionary API)
- `audioUrl`: string (optional, URL to pronunciation audio)
- `translation`: string (optional, user-added)
- `meaning`: string (from dictionary API or user-added)
- `examples`: array of strings
- `tags`: array of strings
- `difficulty`: number (1-5, optional, auto-detected or manual)
- `masteryLevel`: number (0-100, calculated from review performance)
- `sourceUrl`: string
- `sourceTitle`: string
- `context`: string (original sentence snippet from webpage)
- `createdAt`: date
- `updatedAt`: date
- `review`: {
  - `dueDate`: date
  - `intervalDays`: number
  - `ease`: number
  - `lastReviewedAt`: date
  - `reviewCount`: number
  - `correctCount`: number
}

### 8.2 `dictionary_cache`
- `_id`: ObjectId
- `term`: string (indexed, unique)
- `definition`: object (full API response)
- `phonetic`: string
- `audioUrl`: string
- `cachedAt`: date
- `expiresAt`: date (optional, for cache invalidation)

### 8.3 `settings`
- `dailyReviewLimit`: number
- `defaultIntervals`: array of numbers
- `enableAudio`: boolean
- `keyboardShortcuts`: object

## 9. Requirements
### 9.1 Functional
- **Inline word lookup**: Highlight text → click icon → see definition, pronunciation, and examples.
- **Audio pronunciation**: Play audio for supported words.
- **Dictionary API integration**: Auto-fetch definitions with caching.
- Create, read, update, delete vocab items.
- Review queue sorted by due date with original context display.
- Search/filter by term, tags, date range, or mastery level.
- **Dashboard analytics**: View timeline, statistics, and charts on localhost:8082.
- Export/import data.

### 9.2 Non-Functional
- All data stored in MongoDB Atlas.
- Extension runs offline (if local API is running) with cached definitions.
- **Fast inline lookup**: <200ms for cached words, <1s for new API calls.
- **Fast response**: <300ms for list queries under 5k items.
- **Dashboard performance**: Real-time updates within 500ms of new word addition.
- Minimal permissions (activeTab, contextMenus, storage).
- **Graceful degradation**: If API/MongoDB down, show clear error messages and fallback options.

## 10. UX Notes
- **Small icon** should appear instantly (<100ms) when text is selected, positioned near the end of selection.
- **Icon design**: Simple, unobtrusive (e.g., small dictionary/book icon or "A" symbol).
- **Inline tooltip** should appear quickly (<200ms) after clicking the icon.
- **Audio button** should be prominent with speaker icon.
- Popup quick add should be a single-screen flow.
- Library page should support keyboard navigation.
- Review session should be distraction-free with **original context** displayed.
- **Dashboard** should have intuitive navigation between timeline, stats, and search views.
- **Keyboard shortcuts**: Ctrl+Shift+S for quick-save selected text (configurable).

## 11. Risks & Mitigations
- **Risk**: Local API not running.
  - **Mitigation**: Show status indicator in extension popup and quick start instructions.
- **Risk**: MongoDB Atlas unreachable (network, IP allowlist, credentials).
  - **Mitigation**: Validate Atlas connection string, allowlist client IP, and rely on cached definitions/manual fallback.
- **Risk**: Dictionary API rate limits or downtime.
  - **Mitigation**: Aggressive caching in MongoDB, graceful fallback to manual entry.
- **Risk**: Port 8082 already in use.
  - **Mitigation**: Make dashboard port configurable in settings.
- **Risk**: Large vocabulary (10k+ words) slowing down dashboard.
  - **Mitigation**: Implement pagination, lazy loading, and database indexing.

## 12. Milestones

### Phase 1: MVP (Core Lookup & Capture)
1. **Local API + MongoDB Atlas setup**: Basic REST endpoints for vocab CRUD on localhost:8083 with Atlas connection.
2. **Click-to-Define**: Highlight text → icon appears → click icon → tooltip with dictionary API integration.
3. **Audio pronunciation**: Play audio from dictionary API.
4. **Manual capture**: Context menu + popup quick-add.
5. **Basic library**: Extension popup list view with search.

### Phase 2: Analytics & Review
1. **Dashboard (localhost:8082)**: Timeline view, statistics, and charts.
2. **Review flow**: Spaced repetition with original context display.
3. **Advanced search**: Filter by date, tags, mastery level in dashboard.
4. **Real-time sync**: WebSocket updates between extension and dashboard.

### Phase 3: Polish & Advanced Features
1. **Export/Import**: JSON/CSV with full schema support.
2. **Settings UI**: Keyboard shortcuts, API preferences, review intervals.
3. **Performance optimization**: Caching, indexing, lazy loading.
4. **Keyboard shortcuts**: Quick-save, quick-lookup without mouse.

## 13. Open Questions
- **Dictionary API**: Use Free Dictionary API or consider paid alternatives (Merriam-Webster, Oxford)?
- **Review algorithm**: Simple intervals vs. SM-2 (SuperMemo) for better retention?
- **Dashboard auto-refresh**: Should it auto-refresh when new words are added via extension?
- **Page screenshots**: Should we capture and show screenshots in the dashboard for better context recall?
- **Keyboard shortcuts**: Which default shortcuts? (Suggestion: Ctrl+Shift+S for quick-save)
- **Cache expiration**: Should dictionary cache expire after 30/60/90 days?
- **Fallback storage**: Should we use IndexedDB in extension if MongoDB is down?
- **Mobile sync**: Future consideration for syncing to mobile device?
