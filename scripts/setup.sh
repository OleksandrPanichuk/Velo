#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

log() { echo "[setup] $*"; }

log "Installing dependencies..."
cd "$ROOT" && bun install

log "Checking env files..."
if [[ ! -f "$ROOT/apps/api/.env.development" ]]; then
  if [[ -f "$ROOT/apps/api/.env.example" ]]; then
    cp "$ROOT/apps/api/.env.example" "$ROOT/apps/api/.env.development"
    log "Created apps/api/.env.development from .env.example — fill in secrets before running"
  else
    log "WARNING: apps/api/.env.development not found — create it before starting the API"
  fi
fi

if [[ ! -f "$ROOT/apps/web/.env.local" ]]; then
  if [[ -f "$ROOT/apps/web/.env.example" ]]; then
    cp "$ROOT/apps/web/.env.example" "$ROOT/apps/web/.env.local"
    log "Created apps/web/.env.local from .env.example"
  else
    log "WARNING: apps/web/.env.local not found — create it before starting the web app"
  fi
fi

log "Starting infrastructure (postgres, redis, minio)..."
cd "$ROOT" && docker compose up -d postgres redis minio

log "Waiting for postgres to be ready..."
until docker compose exec -T postgres pg_isready -U postgres -q; do
  sleep 1
done

log "Running database migrations..."
cd "$ROOT/apps/api" && bun run db:migrate

log "Done. Run 'bun dev' to start the full stack."
