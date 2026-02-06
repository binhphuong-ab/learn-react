# Safari Technical Status

## 1. Objective
Run this extension on Safari with the same backend and data stack as Chrome:
- API: `http://localhost:8083`
- Dashboard: `http://localhost:8082`
- Database: MongoDB Atlas
- Dictionary: RapidAPI WordsAPI (through API server)

## 2. Implemented
Safari support has been implemented and validated on this machine.

Implemented artifacts:
- Safari conversion script:
  - `scripts/create-safari-project.sh`
- Generated Safari project:
  - `safari/Learn English Safari/Learn English Safari.xcodeproj`
- Cross-browser runtime shim:
  - `extension/runtime.js`
- Extension updates for Safari compatibility:
  - `extension/background.js`
  - `extension/content.js`
  - `extension/popup.html`
  - `extension/options.html`
  - `extension/manifest.json`
  - `extension/icons/*`

## 3. Key Technical Decisions

### 3.1 Shared codebase
One shared WebExtension source remains in `extension/` for Chrome and Safari.

### 3.2 API compatibility shim
`extension/runtime.js` bridges Safari/Chrome API behavior for:
- runtime messaging
- storage
- tabs
- context menus
- scripting fallback handling

### 3.3 Quick-save fallback path
In `background.js`, quick-save now supports fallback when `scripting.executeScript` is unavailable by requesting selected text from content script (`GET_SELECTION_TEXT`).

### 3.4 Manifest updates
- Removed unsupported background module type for Safari converter.
- Added icon set required by Safari converter and packaging.

### 3.5 CORS compatibility
API CORS logic now allows Safari extension origins:
- `safari-web-extension://...`

File:
- `api/src/app.js`

This resolved `Not allowed by CORS` on save requests from Safari extension.

## 4. Converter and Build Status
- `xcrun safari-web-extension-converter` is available.
- `npm run safari:convert` successfully generates project.
- `xcodebuild` for `Learn English Safari (macOS)` succeeds.

## 5. Current Known Limitation
If Safari resets `Allow unsigned extensions`, the build is still ad-hoc signed.

Root cause:
- app/appex signature is `adhoc` with no team identifier.

Impact:
- extension runs as temporary/unsigned mode and Safari resets override on restart.

Resolution path:
- sign both macOS app and macOS extension targets with Apple Development certificate and valid team identity in Xcode.

## 6. Runtime Consistency
No backend contract changes were required for Safari.

Both Chrome and Safari use:
- same API endpoints
- same Atlas database
- same dictionary provider via API

## 7. Validation Checklist
Use this checklist after each Safari change:
1. `npm run dev:api`
2. `npm run dev:dashboard`
3. Run Safari host app from Xcode.
4. Enable extension in Safari settings.
5. Lookup from selected text.
6. Save to library and confirm dashboard update.
7. Confirm no CORS error on save.

## 8. Reference
Operational runbook:
- `safari/safari-readme.md`
