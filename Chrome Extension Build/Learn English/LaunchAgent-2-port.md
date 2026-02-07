# LaunchAgent 2-Port Setup (macOS)

This project uses 2 local services:

- Dashboard: `http://localhost:8082`
- API: `http://localhost:8083`

MongoDB Atlas is the database only. The API service on port `8083` is still required.

## LaunchAgents Configured

- `/Users/nguyenbinhphuong/Library/LaunchAgents/com.learnenglish.dashboard.plist`
- `/Users/nguyenbinhphuong/Library/LaunchAgents/com.learnenglish.api.plist`

Both LaunchAgents are configured with:

- `RunAtLoad = true` (auto-run at login)
- `KeepAlive` is not set (no auto-restart on crash)

## What Runs

- `com.learnenglish.dashboard` runs:
  - `npm run dev:dashboard`
  - Working directory: `/Users/nguyenbinhphuong/Documents/Code/Learn React/Chrome Extension Build/Learn English`

- `com.learnenglish.api` runs:
  - `npm run dev:api`
  - Working directory: `/Users/nguyenbinhphuong/Documents/Code/Learn React/Chrome Extension Build/Learn English`

## Logs

- API:
  - `/tmp/learn-english-api.launchd.log`
  - `/tmp/learn-english-api.launchd.err.log`

- Dashboard:
  - `/tmp/learn-english-dashboard.launchd.log`
  - `/tmp/learn-english-dashboard.launchd.err.log`

## Useful Commands

Bootstrap/load now:

```bash
launchctl bootstrap gui/501 /Users/nguyenbinhphuong/Library/LaunchAgents/com.learnenglish.api.plist
launchctl bootstrap gui/501 /Users/nguyenbinhphuong/Library/LaunchAgents/com.learnenglish.dashboard.plist
```

Unload/stop:

```bash
launchctl bootout gui/501 /Users/nguyenbinhphuong/Library/LaunchAgents/com.learnenglish.api.plist
launchctl bootout gui/501 /Users/nguyenbinhphuong/Library/LaunchAgents/com.learnenglish.dashboard.plist
```

Check status:

```bash
launchctl print gui/501/com.learnenglish.api
launchctl print gui/501/com.learnenglish.dashboard
```

Port checks:

```bash
lsof -nP -iTCP:8083 -sTCP:LISTEN
lsof -nP -iTCP:8082 -sTCP:LISTEN
```

