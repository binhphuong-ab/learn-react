# Short Plan: Dual Dictionary APIs + Switch in Dashboard

## Goal
Support two dictionary providers (WordsAPI via RapidAPI and Merriam-Webster) and allow selecting the active provider from the dashboard UI (http://localhost:8082). The selection should affect lookup behavior used by the extension and dashboard.

## Proposed Approach
1. **Add provider abstraction in API layer**
   - Create a small provider interface and adapters for WordsAPI and Merriam-Webster.
   - Normalize responses into the existing lookup payload shape used by the extension (`phonetic`, `audioUrl`, `meanings`, `example`, `shortDefinition`, etc.).

2. **Store active provider in settings**
   - Extend settings (`settings` collection) with `dictionaryProvider` (values: `wordsapi`, `merriam`), defaulting to `wordsapi`.
   - Add API endpoints or extend existing settings endpoints to read/update this value.

3. **Wire lookup to selected provider**
   - `GET /api/lookup` chooses provider based on settings (or optional query override for testing).
   - Keep existing cache structure; consider namespacing cache by provider to avoid collisions.

4. **Dashboard UI switch**
   - Add a small toggle/switch in the dashboard settings area to select the provider.
   - On change, call `PUT /api/settings` and reflect active provider in the UI.

5. **Extension behavior**
   - No UI change required in extension; it already calls `/api/lookup` and should benefit automatically from provider selection.
   - Optional: show provider name in tooltip for debugging (feature flag or dev only).

6. **Validation**
   - Basic manual tests for both providers: lookup, save, cache hit, and audio fallback.
   - Ensure existing WordsAPI flow still matches current UX.

## Files Likely Involved
- API: `api/src/services/*`, `api/src/routes/lookup.js`, `api/src/models/Setting.js`
- Dashboard: `dashboard/src/components/*`, `dashboard/src/lib/api.js`, `dashboard/src/App.jsx`

## Risks / Notes
- Merriam-Webster response format is significantly different (checked `api 2 Merriam-Webster Dictionary.md`):
  - Top-level response is an array of entries; primary data is nested under `meta`, `hwi`, and `def` with deep `sseq` → `sense` → `dt` arrays.
  - Definitions and examples are embedded in `dt` items with Merriam markup tokens (e.g., `{bc}`, `{it}`, `{sx}`), which require cleaning for display.
  - Pronunciation text is in `hwi.prs[].mw`; audio is provided via `hwi.prs[].sound.audio` but requires URL construction per Merriam docs.
  - `shortdef` is a simple array and will likely be the most reliable field for a compact definition.
  - Normalization may be lossy; we should decide a consistent mapping strategy for meanings/examples/audio.
- Cache should be provider-aware to avoid mixed results.
- API keys should be moved to `.env` and removed from docs if this repo is shared.
