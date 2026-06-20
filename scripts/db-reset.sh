#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

log() { echo "[db-reset] $*"; }

if [[ "${1:-}" != "--yes" ]]; then
  read -rp "This will wipe all data in the local postgres container. Continue? [y/N] " confirm
  [[ "$confirm" =~ ^[Yy]$ ]] || { log "Aborted."; exit 0; }
fi

log "Stopping containers and removing postgres volume..."
cd "$ROOT" && docker compose -f compose-files/docker-compose.yml down -v --remove-orphans

log "Starting postgres, redis, minio..."
docker compose -f compose-files/docker-compose.yml up -d postgres redis minio

log "Waiting for postgres to be ready..."
until docker compose -f compose-files/docker-compose.yml exec -T postgres pg_isready -U postgres -q; do
  sleep 1
done

log "Running migrations..."
cd "$ROOT/apps/api" && bun run db:migrate

log "Database reset complete."
