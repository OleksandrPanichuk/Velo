#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

log() { echo "[clean] $*"; }

DEEP=false
[[ "${1:-}" == "--deep" ]] && DEEP=true

log "Removing build artifacts..."
find "$ROOT" \
  -not -path "*/node_modules/*" \
  \( -name "dist" -o -name ".turbo" -o -name "*.tsbuildinfo" \) \
  -exec rm -rf {} + 2>/dev/null || true

if $DEEP; then
  log "Removing node_modules (deep clean)..."
  find "$ROOT" -name "node_modules" -type d -prune -exec rm -rf {} +
  log "Deep clean done. Run 'bun install' before developing."
else
  log "Done. Use --deep to also remove node_modules."
fi
