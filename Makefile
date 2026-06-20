DB_SERVICE ?= postgres
API_SERVICE ?= api
WEB_SERVICE ?= web
NGINX_SERVICE ?= nginx
DB_USER ?= postgres
DB_NAME ?= postgres
MIGRATION ?= user-setup
APP_URL ?= http://velo.local

.PHONY: help up down clear up-infra up-no-web db db\:migrate db\:migrate\:revert db\:migrate\:show db\:migration\:create db\:migration\:generate db\:schema\:log db\:schema\:sync \
	k8s\:build k8s\:credentials k8s\:setup k8s\:deploy k8s\:down

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
	@echo ""
	@echo "  make k8s:build                   - Build production images inside minikube"
	@echo "  make k8s:credentials             - Create AWS credentials secret from env vars (never stored in files)"
	@echo "  make k8s:setup                   - Apply namespace, configmap, and External Secrets"
	@echo "  make k8s:deploy                  - Deploy api, web, and ingress"
	@echo "  make k8s:down                    - Tear down the entire velo namespace"

COMPOSE        = docker compose -f compose-files/docker-compose.yml
COMPOSE_TEST   = docker compose -f compose-files/docker-compose.test.yml
COMPOSE_E2E    = docker compose -f compose-files/docker-compose.e2e.yml

up:
	$(COMPOSE) up

down:
	$(COMPOSE) down

clear:
	$(COMPOSE) down -v --remove-orphans

up-infra:
	$(COMPOSE) up postgres redis minio

up-no-web:
	$(COMPOSE) up postgres redis minio $(API_SERVICE)

# Access services
nginx:
	$(COMPOSE) exec -it nginx sh

api:
	$(COMPOSE) exec $(API_SERVICE) sh


# Database commands
db:
	$(COMPOSE) exec $(DB_SERVICE) psql -U $(DB_USER) -d $(DB_NAME)

db\:migrate:
	$(COMPOSE) run --rm $(API_SERVICE) npm run db:migrate

db\:migrate\:revert:
	$(COMPOSE) run --rm $(API_SERVICE) npm run db:migrate:revert

db\:migrate\:show:
	$(COMPOSE) run --rm $(API_SERVICE) npm run db:migrate:show

db\:migration\:create:
	@test -n "$(MIGRATION)" || (echo "Usage: make db:migration:create MIGRATION=CreateUsers" && exit 1)
	$(COMPOSE) run --rm $(API_SERVICE) npm run db:cli -- migration:create migrations/$(MIGRATION)

db\:migration\:generate:
	@test -n "$(MIGRATION)" || (echo "Usage: make db:migration:generate MIGRATION=InitSchema" && exit 1)
	$(COMPOSE) run --rm $(API_SERVICE) npm run db:cli -- migration:generate migrations/$(MIGRATION)

db\:schema\:log:
	$(COMPOSE) run --rm $(API_SERVICE) npm run db:schema:log

db\:schema\:sync:
	$(COMPOSE) run --rm $(API_SERVICE) npm run db:schema:sync


# Logs
logs:
	$(COMPOSE) logs -f

logs-nginx:
	$(COMPOSE) logs -f $(NGINX_SERVICE)

logs-api:
	$(COMPOSE) logs -f $(API_SERVICE)

logs-web:
	$(COMPOSE) logs -f $(WEB_SERVICE)


# E2E infrastructure
e2e\:up:
	$(COMPOSE_E2E) up -d --wait

e2e\:down:
	$(COMPOSE_E2E) down -v

e2e\:ui:
	$(COMPOSE_E2E) up -d --wait
	cd apps/e2e && bunx playwright test --ui

e2e\:test:
	@test -n "$(file)" || (echo "Usage: make e2e:test file=auth.spec.ts" && exit 1)
	$(COMPOSE_E2E) up -d --wait
	cd apps/e2e && bunx playwright test tests/$(file)


# Kubernetes (minikube)
# ---------------------
# Prerequisites:
#   minikube start
#   minikube addons enable ingress
#   helm repo add external-secrets https://charts.external-secrets.io
#   helm install external-secrets external-secrets/external-secrets -n external-secrets --create-namespace

k8s\:build:
	@echo "Pointing docker to minikube daemon and building production images..."
	eval $$(minikube docker-env) && \
		docker build -f apps/api/Dockerfile.prod -t velo-api:latest . && \
		docker build -f apps/web/Dockerfile.prod \
			--build-arg NEXT_PUBLIC_API_URL=$(APP_URL) \
			--build-arg NEXT_PUBLIC_APP_URL=$(APP_URL) \
			-t velo-web:latest .

k8s\:credentials:
	@test -n "$$AWS_ACCESS_KEY_ID" || (echo "Error: AWS_ACCESS_KEY_ID is not set" && exit 1)
	@test -n "$$AWS_SECRET_ACCESS_KEY" || (echo "Error: AWS_SECRET_ACCESS_KEY is not set" && exit 1)
	kubectl create secret generic aws-credentials \
		--from-literal=access-key-id="$$AWS_ACCESS_KEY_ID" \
		--from-literal=secret-access-key="$$AWS_SECRET_ACCESS_KEY" \
		-n velo \
		--dry-run=client -o yaml | kubectl apply -f -
	@echo "AWS credentials secret created in cluster (not stored in any file)"

k8s\:setup:
	kubectl apply -f kubernetes/namespace.yaml
	kubectl apply -f kubernetes/configmap.yaml
	$(MAKE) k8s\:credentials
	kubectl apply -f kubernetes/external-secrets/secret-store.yaml
	kubectl apply -f kubernetes/external-secrets/external-secret.yaml
	@echo "Waiting for ESO to sync secrets..."
	kubectl wait externalsecret/velo-secret -n velo --for=condition=Ready --timeout=60s

k8s\:deploy:
	kubectl apply -f kubernetes/api/
	kubectl apply -f kubernetes/web/
	kubectl apply -f kubernetes/ingress.yaml
	@echo ""
	@echo "Add to /etc/hosts if not already present:"
	@echo "  $$(minikube ip)  velo.local"

k8s\:down:
	kubectl delete namespace velo