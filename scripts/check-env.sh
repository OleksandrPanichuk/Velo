#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

ERRORS=0
check() {
  local file="$1"; shift
  local missing=()
  for var in "$@"; do
    grep -qE "^${var}=.+" "$file" 2>/dev/null || missing+=("$var")
  done
  if [[ ${#missing[@]} -gt 0 ]]; then
    echo "[FAIL] $file — missing or empty: ${missing[*]}"
    ERRORS=$((ERRORS + ${#missing[@]}))
  else
    echo "[OK]   $file"
  fi
}

check "$ROOT/apps/api/.env.development" \
  DB_HOST DB_PORT DB_USERNAME DB_PASSWORD DB_NAME \
  JWT_ACCESS_SECRET JWT_REFRESH_SECRET \
  REDIS_HOST REDIS_PORT \
  AWS_S3_ENDPOINT AWS_S3_ACCESS_KEY AWS_S3_SECRET_ACCESS_KEY AWS_S3_BUCKET_NAME \
  GOOGLE_CLIENT_ID GOOGLE_CLIENT_SECRET \
  GITHUB_CLIENT_ID GITHUB_CLIENT_SECRET

check "$ROOT/apps/web/.env.local" \
  NEXT_PUBLIC_API_URL NEXT_PUBLIC_APP_URL

if [[ $ERRORS -gt 0 ]]; then
  echo ""
  echo "$ERRORS missing value(s) found."
  exit 1
fi
