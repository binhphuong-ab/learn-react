# Safari Extension Readme

## 1. Scope
This directory contains the generated Safari host app and Safari extension project for this repository.

Current generated project:
- `Learn English Safari/Learn English Safari.xcodeproj`

## 2. Runtime Dependencies
Required services are the same as Chrome:
- API: `http://localhost:8083`
- Dashboard: `http://localhost:8082`
- Database: MongoDB Atlas via API `.env`
- Dictionary: RapidAPI WordsAPI via API service

## 3. Regenerate Safari Project
From repository root:

```bash
npm run safari:convert
```

Converter script:
- `scripts/create-safari-project.sh`

## 4. Run in Xcode
1. Open:
   - `safari/Learn English Safari/Learn English Safari.xcodeproj`
2. Select scheme:
   - `Learn English Safari (macOS)`
3. Set signing on both targets:
   - `Learn English Safari (macOS)`
   - `Learn English Safari Extension (macOS)`
4. Click Run.

## 5. Enable in Safari
1. Open Safari.
2. Go to `Safari > Settings > Extensions`.
3. Enable `Learn English Safari Extension`.
4. Allow website access (recommended: all websites for now).

## 6. Important Signing Note
If Safari keeps turning off `Allow unsigned extensions`, your build is still ad-hoc signed.

Persistent behavior requires real Apple Development signing (not temporary unsigned mode).

Quick check:

```bash
codesign -dv --verbose=4 "$HOME/Library/Developer/Xcode/DerivedData/Learn_English_Safari-*/Build/Products/Debug/Learn English Safari.app" 2>&1 | egrep "Signature=|TeamIdentifier=|Authority="
```

Expected for properly signed build:
- `Authority=Apple Development: ...`
- `TeamIdentifier=<your-team-id>`

Not acceptable for persistent signed behavior:
- `Signature=adhoc`
- `TeamIdentifier=not set`

## 7. Smoke Test
1. Start API and dashboard from project root:
   - `npm run dev:api`
   - `npm run dev:dashboard`
2. In Safari, select a word and open tooltip.
3. Click `Save to Library`.
4. Confirm save appears in dashboard and API does not return CORS error.

## 8. Troubleshooting
- `Not allowed by CORS`:
  - Ensure API includes Safari extension origin support in `api/src/app.js`.
- Save works only while `Allow unsigned extensions` is checked:
  - Build is unsigned/ad-hoc; configure Apple Development signing in Xcode targets.
- Converter fails:
  - Verify full Xcode is installed and selected via `xcode-select -p`.

