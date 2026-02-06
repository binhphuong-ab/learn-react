#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EXTENSION_DIR="$ROOT_DIR/extension"
OUTPUT_DIR="$ROOT_DIR/safari"

if ! command -v xcrun >/dev/null 2>&1; then
  echo "xcrun not found. Install full Xcode first."
  exit 1
fi

if ! xcrun --find safari-web-extension-converter >/dev/null 2>&1; then
  cat <<'EOF'
safari-web-extension-converter is unavailable.

Install full Xcode, then run:
  sudo xcode-select -s /Applications/Xcode.app/Contents/Developer

After that, rerun:
  npm run safari:convert
EOF
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

xcrun safari-web-extension-converter "$EXTENSION_DIR" \
  --project-location "$OUTPUT_DIR" \
  --app-name "Learn English Safari" \
  --bundle-identifier "com.goodmotorvn.learnenglish.safari" \
  --no-prompt \
  --force \
  --no-open

cat <<EOF
Safari project generated under:
  $OUTPUT_DIR

Next:
1) Open generated Xcode project.
2) Select a Team for signing.
3) Run the host app once.
4) Enable the extension in Safari settings.
EOF
