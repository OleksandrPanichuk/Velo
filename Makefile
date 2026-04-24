DB_SERVICE ?= postgres
API_SERVICE ?= api
WEB_SERVICE ?= web
DB_USER ?= postgres
DB_NAME ?= postgres
MIGRATION ?= user-setup

.PHONY: help up down clear up-infra up-no-web db db\:migrate db\:migrate\:revert db\:migrate\:show db\:migration\:create db\:migration\:generate db\:schema\:log db\:schema\:sync

help:
	@echo "Available targets:"
	@echo "  make up                          - Start all services"
	@echo "  make down                        - Stop all services"
	@echo "  make clear                       - Stop all services and remove volumes"
	@echo "  make up-infra                    - Start only postgres + redis"
	@echo "  make up-no-web                   - Start all services except web"
	@echo "  make db                          - Open psql shell inside postgres container"
	@echo "  make db:migrate                  - Run pending TypeORM migrations"
	@echo "  make db:migrate:revert           - Revert last TypeORM migration"
	@echo "  make db:migrate:show             - Show migration status"
	@echo "  make db:migration:create MIGRATION=Name      - Create empty migration file"
	@echo "  make db:migration:generate MIGRATION=Name    - Generate migration from entity changes"
	@echo "  make db:schema:log               - Print SQL required to sync schema"
	@echo "  make db:schema:sync              - Apply schema sync (use carefully)"

up:
	docker compose up

down:
	docker compose down

clear:
	docker compose down -v --remove-orphans

up-infra:
	docker compose up postgres redis

up-no-web:
	docker compose up postgres redis $(API_SERVICE)

db:
	docker compose exec $(DB_SERVICE) psql -U $(DB_USER) -d $(DB_NAME)

db\:migrate:
	docker compose run --rm $(API_SERVICE) bun run db:migrate

db\:migrate\:revert:
	docker compose run --rm $(API_SERVICE) bun run db:migrate:revert

db\:migrate\:show:
	docker compose run --rm $(API_SERVICE) bun run db:migrate:show

db\:migration\:create:
	@test -n "$(MIGRATION)" || (echo "Usage: make db:migration:create MIGRATION=CreateUsers" && exit 1)
	docker compose run --rm $(API_SERVICE) bun run db:cli -- migration:create src/migrations/$(MIGRATION)

db\:migration\:generate:
	@test -n "$(MIGRATION)" || (echo "Usage: make db:migration:generate MIGRATION=InitSchema" && exit 1)
	docker compose run --rm $(API_SERVICE) bun run db:cli -- migration:generate src/migrations/$(MIGRATION)

db\:schema\:log:
	docker compose run --rm $(API_SERVICE) bun run db:schema:log

db\:schema\:sync:
	docker compose run --rm $(API_SERVICE) bun run db:schema:sync
