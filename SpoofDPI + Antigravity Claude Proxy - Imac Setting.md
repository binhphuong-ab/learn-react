# System Setup Summary

**Date**: February 2, 2026  
**System**: macOS (iMac)

---

## 📦 Installed Software

### 1. SpoofDPI v1.0
- **Purpose**: Bypass DPI blocks to access Medium.com and other blocked sites
- **Installation**: Homebrew (`/opt/homebrew/opt/spoofdpi/bin/spoofdpi`)
- **Port**: 8080
- **Auto-start**: ✅ Yes (LaunchAgent)

### 2. Antigravity Claude Proxy v2.5.0
- **Purpose**: Use Claude Code CLI with Antigravity API via Google account
- **Installation**: npm global (`/opt/homebrew/bin/antigravity-claude-proxy`)
- **Port**: 8081
- **Auto-start**: ✅ Yes (LaunchAgent)

### 3. Claude Code CLI v2.1.29
- **Purpose**: AI coding assistant in terminal
- **Installation**: npm global (`/opt/homebrew/bin/claude`)
- **Updated from**: v1.0.63 → v2.1.29

---

## ⚙️ Configuration Files

### SpoofDPI LaunchAgent
**File**: `~/Library/LaunchAgents/com.user.spoofdpi.plist`
- Runs: `/opt/homebrew/bin/spoofdpi-optimized`
- Auto-start: Yes
- Auto-restart: Yes
- Logs: `/opt/homebrew/var/log/spoofdpi/`

### Antigravity Claude Proxy LaunchAgent
**File**: `~/Library/LaunchAgents/com.user.antigravity-claude-proxy.plist`
- Runs: `antigravity-claude-proxy start`
- Port: 8081
- Auto-start: Yes
- Auto-restart: Yes
- Logs: `/tmp/antigravity-proxy-*.log`

### Claude Code Settings
**File**: `~/.claude/settings.json`
```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "test",
    "ANTHROPIC_BASE_URL": "http://localhost:8081",
    "ANTHROPIC_MODEL": "claude-opus-4-5-thinking",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "claude-opus-4-5-thinking",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "claude-sonnet-4-5-thinking",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "claude-sonnet-4-5",
    "CLAUDE_CODE_SUBAGENT_MODEL": "claude-sonnet-4-5-thinking",
    "ENABLE_EXPERIMENTAL_MCP_CLI": "true"
  }
}
```

### Antigravity Proxy Config
**Directory**: `~/.antigravity-claude-proxy/`
- Google account: `binhphuongmece@gmail.com`

---

## 🔧 SpoofDPI Configuration

**Optimized settings for Medium.com access:**
```bash
--system-proxy
--dns-mode https
--https-split-mode chunk
--https-chunk-size 5
--https-disorder
--timeout 2000
```

---

## 🚀 Usage

### SpoofDPI
- **Check status**: `ps aux | grep spoofdpi`
- **View logs**: `tail -f /opt/homebrew/var/log/spoofdpi/output.log`
- **Stop**: `launchctl unload ~/Library/LaunchAgents/com.user.spoofdpi.plist`
- **Start**: `launchctl load ~/Library/LaunchAgents/com.user.spoofdpi.plist`

### Antigravity Claude Proxy
- **Check status**: `launchctl list | grep antigravity-claude-proxy`
- **View logs**: `tail -f /tmp/antigravity-proxy-output.log`
- **Health check**: `curl http://localhost:8081/health`
- **Manage accounts**: `antigravity-claude-proxy accounts`
- **Stop**: `launchctl unload ~/Library/LaunchAgents/com.user.antigravity-claude-proxy.plist`
- **Start**: `launchctl load ~/Library/LaunchAgents/com.user.antigravity-claude-proxy.plist`

### Claude Code CLI
- **Start**: `claude`
- **Update**: `claude update`
- **Version**: `claude --version`
- **Help**: `/help` (inside Claude Code)

---

## 🔌 Port Usage

| Port | Service | Purpose |
|------|---------|---------|
| 8080 | SpoofDPI | DPI bypass proxy |
| 8081 | Antigravity Claude Proxy | Claude API proxy |

---

## ✅ Auto-Start Services

Both services start automatically on login:
1. **SpoofDPI** - Enables access to blocked sites
2. **Antigravity Claude Proxy** - Enables Claude Code CLI

**Verify auto-start**:
```bash
launchctl list | grep -E "spoofdpi|antigravity"
```

---

## 📊 System Status Check

### Quick Health Check
```bash
# Check SpoofDPI
lsof -i :8080

# Check Antigravity Proxy
lsof -i :8081
curl http://localhost:8081/health

# Check Claude Code version
claude --version
```

---

## 🛠️ Troubleshooting

### SpoofDPI not working
```bash
# Restart service
launchctl unload ~/Library/LaunchAgents/com.user.spoofdpi.plist
launchctl load ~/Library/LaunchAgents/com.user.spoofdpi.plist

# Check logs
tail -f /opt/homebrew/var/log/spoofdpi/error.log
```

### Antigravity Proxy not working
```bash
# Restart service
launchctl unload ~/Library/LaunchAgents/com.user.antigravity-claude-proxy.plist
launchctl load ~/Library/LaunchAgents/com.user.antigravity-claude-proxy.plist

# Check logs
tail -f /tmp/antigravity-proxy-error.log

# Verify account
antigravity-claude-proxy accounts verify
```

### Claude Code issues
```bash
# Update to latest version
claude update

# Check configuration
cat ~/.claude/settings.json

# Verify proxy connection
curl http://localhost:8081/health
```

---

## 📁 Important Directories

| Path | Purpose |
|------|---------|
| `~/Library/LaunchAgents/` | Auto-start configuration files |
| `~/.claude/` | Claude Code settings |
| `~/.antigravity-claude-proxy/` | Proxy credentials and config |
| `~/.config/antigravity-proxy/` | Additional proxy config |
| `/opt/homebrew/bin/` | Installed binaries |
| `/opt/homebrew/var/log/spoofdpi/` | SpoofDPI logs |
| `/tmp/` | Antigravity proxy logs |

---

## 🔄 After System Restart

**Everything works automatically!**

1. ✅ SpoofDPI starts on port 8080
2. ✅ Antigravity Claude Proxy starts on port 8081
3. ✅ Just run `claude` to start coding

**No manual setup required.**

---

**Last Updated**: February 5, 2026, 4:59 PM
