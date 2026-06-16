# Velo — Project Guide for Claude Code

## Project Overview

Velo is a project management SaaS (think Linear/Jira) built as a **Bun monorepo** using Turborepo. It has two apps (`api`, `web`) and three shared packages (`ui`, `primitives`, `typescript-config`, `eslint-config`).

- **Backend**: NestJS 11 + Apollo GraphQL 5 + TypeORM 0.3 + PostgreSQL 17
- **Frontend**: Next.js 16 (App Router) + React 19 + Apollo Client 4 + Tailwind CSS 4
- **Infra**: Docker Compose (dev + test), Kubernetes (prod), Nginx reverse proxy
- **Package manager**: Bun 1.3 (use `bun` not `npm`)

---

## Monorepo Structure

```
velo/
├── apps/
│   ├── api/          # NestJS GraphQL backend (port 8080)
│   └── web/          # Next.js frontend (port 3000 / 4000 via nginx)
├── packages/
│   ├── ui/           # @repo/ui — Radix UI + Tailwind component library
│   ├── primitives/   # @repo/primitives — shared TypeScript utilities
│   ├── typescript-config/  # shared tsconfigs (base, nestjs, nextjs, react-library)
│   └── eslint-config/      # shared ESLint configs per framework
├── docker-compose.yml       # dev stack (postgres, redis, minio, api, web, nginx)
├── docker-compose.test.yml  # isolated test stack (different ports, tmpfs)
├── kubernetes/              # k8s manifests (namespace, ingress, api, web, configmap)
├── nginx/                   # nginx reverse proxy config
├── scripts/                 # setup.sh, db-reset.sh, clean.sh, check-env.sh
├── Makefile                 # 40+ convenience targets (see below)
└── turbo.json               # Turborepo pipeline (build, lint, check-types, codegen, dev)
```

---

## Common Commands

Run from the **monorepo root** unless noted otherwise.

```bash
# Development
bun run dev              # start all apps in watch mode (turbo)
bun run build            # build all apps
bun run lint             # lint all apps
bun run check-types      # type-check all apps
bun run codegen          # run GraphQL codegen (requires API running)

# From apps/api
bun run test             # unit tests
bun run test:watch       # unit tests in watch mode
bun run test:integration # integration tests (mocked infra)
bun run test:db          # DB integration tests (requires test infra)
bun run test:db:watch    # DB tests in watch mode
bun run test:e2e         # GraphQL E2E tests (requires test infra)
bun run test:infra:up    # start test Docker containers
bun run test:infra:down  # tear down test containers (wipes data)
bun run test:cov         # unit test coverage

# Database (from apps/api or via Makefile)
bun run db:migrate       # run pending migrations
bun run db:migrate:revert # revert last migration
bun run db:migrate:show  # list migration status
bun run db:generate      # generate migration from entity changes
bun run db:schema:sync   # sync schema without migrations (dev only)
```

### Makefile shortcuts (from repo root)

```bash
make up              # docker compose up (all services)
make down            # docker compose down
make up-infra        # start only postgres/redis/minio
make db              # open psql shell
make db:migrate      # run migrations
make db:migration:generate name=MigrationName
make k8s:deploy      # deploy to Kubernetes
```

---

## API (`apps/api`)

### Architecture

NestJS modules wired through `AppModule`. Key layers:

```
src/
├── config/          # env validation (Zod), TypeORM, GraphQL, helmet, CORS, throttler, cache
├── constants/       # file limits, roles, cache keys, rate limits, cookies, error codes
├── enums/           # OAuth providers, workspace roles, notification types, job roles
├── infrastructure/  # 9 cross-cutting modules:
│   ├── cache/       # L1 LRU (in-process) + L2 Redis
│   ├── cls/         # @nestjs-cls AsyncLocalStorage for request context
│   ├── dataloader/  # DataLoader for batched DB queries
│   ├── health/      # Kubernetes liveness/readiness probes
│   ├── logger/      # Winston logging
│   ├── mailer/      # NodeMailer + BullMQ queue
│   ├── pubsub/      # Redis-backed GraphQL subscriptions
│   ├── queue/       # BullMQ job processing
│   └── s3/          # AWS S3 / MinIO file storage
├── models/          # 20+ TypeORM entities (User, Workspace, Issue, Comment, …)
├── modules/         # 6 feature modules: auth, users, workspaces, workspace-members, permissions, notifications
├── queues/          # BullMQ job handlers
├── shared/          # Guards, interceptors, filters, pipes, decorators, pagination helpers
├── types/           # Express/GraphQL augmentations
└── utils/           # Redis helpers, GraphQL context extractor, XSS sanitization
```

### Key patterns

- **Entities** extend `BaseEntity` which provides soft-delete, timestamps, and `@ObjectType()` decoration
- **Repositories** extend `BaseRepository<T>` — integrates CLS transactions and soft-delete
- **Auth**: Passport JWT (access + refresh), Google OAuth, GitHub OAuth
- **Permissions**: ABAC via `PermissionsGuard` and `@Policies()` decorator
- **GraphQL**: Code-first with `@nestjs/graphql`. Schema auto-generated. Subscriptions via Redis PubSub
- **Validation**: `class-validator` + `class-transformer` on all DTOs; Zod for env config
- **Security**: `helmet`, `ncsrf` CSRF protection, `xss` sanitization, rate limiting via `@nestjs/throttler`
- **Email**: `NodeMailer` → BullMQ queue → processor (async delivery)
- **Caching**: two-tier — L1 LRU in-memory, L2 Redis via `cache-manager`

### Environment (`.env.development`)

Required variables: `WEB_URL`, `BASE_URL`, `DB_HOST/PORT/USER/PASS/NAME`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `REDIS_HOST/PORT`, `AWS_S3_*`, `SMTP_*`, `GOOGLE_CLIENT_ID/SECRET`, `GITHUB_CLIENT_ID/SECRET`, `CLIENT_EMAIL_VERIFICATION_URL`, `CLIENT_RESET_PASSWORD_URL`.

Test overrides live in `.env.test` (ports 5433/6380/9010, fake OAuth credentials, short-lived JWTs).

---

## Web (`apps/web`)

### Architecture

Next.js App Router, feature-based structure.

```
src/
├── app/
│   ├── (auth)/           # login, register, reset-password, verify-email, oauth, invite
│   ├── (marketing)/      # public landing pages
│   ├── [workspaceSlug]/  # protected workspace routes (board, projects, inbox, settings)
│   └── onboarding/
├── components/icons/     # VeloMark, GoogleIcon, GitHubIcon, WorkspaceIcon
├── constants/            # routes, oauth, regex, form-error messages
├── features/             # 16 feature domains (auth, board, issue, notifications, …)
├── graphql/
│   ├── types.ts          # generated (graphql-codegen)
│   └── hooks.ts          # generated Apollo hooks
├── hooks/                # custom React hooks
├── lib/
│   ├── apollo/           # Apollo Client + auth links
│   ├── env.ts            # env validation
│   └── utils.ts
├── providers/            # ApolloProvider
├── stores/               # client state
└── types/                # icon types, misc
```

### Key patterns

- **Apollo Client 4** with auth links for JWT access/refresh token flow
- **GraphQL CodeGen**: run `bun run codegen` from `apps/web` (or root) to regenerate `types.ts` and `hooks.ts` after schema changes
- **Forms**: `@tanstack/react-form` with Zod schemas
- **Tables**: `@tanstack/react-table`
- **Styling**: Tailwind CSS 4 (no v3 syntax — use v4 CSS-first config)
- **Components**: import from `@repo/ui` (Radix primitives + CVA variants); local icons in `components/icons/`
- **React Compiler** enabled in `next.config.ts` — avoid manual `useMemo`/`useCallback` where the compiler handles it

### Environment (`.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_APP_URL=http://localhost:3000
API_URL=http://localhost:8080
```

---

## Shared Packages

| Package | Purpose |
|---|---|
| `@repo/ui` | React component library — Radix UI + Tailwind + CVA. Storybook at `localhost:6006` |
| `@repo/primitives` | Shared TypeScript utilities and types |
| `@repo/typescript-config` | Base tsconfigs extended by all apps/packages |
| `@repo/eslint-config` | ESLint configs for NestJS, Next.js, React library, base |

---

## Testing Strategy

Four test tiers, all using **Vitest**. Run commands from `apps/api`.

| Tier | Command | Infra needed | What it covers |
|---|---|---|---|
| Unit | `bun run test` | None | Services, resolvers, guards, filters, queues — all mocked |
| Integration | `bun run test:integration` | None | Module wiring, JWT round-trips — NestJS test modules with mocks |
| DB | `bun run test:db` | Test Docker stack | Repository layer against real PostgreSQL |
| E2E | `bun run test:e2e` | Test Docker stack | GraphQL HTTP requests against full NestJS app |

**Test infra**: `bun run test:infra:up` starts postgres-test (5433), redis-test (6380), minio-test (9010) using `docker-compose.test.yml` with **tmpfs** storage (ephemeral — wiped on container restart).

### Test helpers

- `test/factories/` — Faker.js factories for User, Workspace, WorkspaceMember, Notification
- `test/helpers/module.builder.ts` — NestJS test module builder
- `test/helpers/mocks.ts` — shared mock objects
- `test/helpers/auth.helper.ts` — JWT generation helpers
- `test/database/` — DataSource factory, schema helpers, table truncation
- `test/graphql/` — GraphQL query library (`.gql` files loaded via custom Vitest plugin)

### Rules

- DB integration tests run **serially** (`fileParallelism: false`) to prevent schema deadlocks
- Unit/integration tests must not depend on real DB or Redis — mock at the repository level
- Factories produce deterministic fixtures when given fixed seeds/UUIDs

---

## Docker Services

### Dev (`docker-compose.yml`)

| Service | Port | Purpose |
|---|---|---|
| postgres | 5432 | Primary database |
| redis | 6379 | Cache + BullMQ queues + PubSub |
| minio | 9000/9001 | S3-compatible object storage |
| api | 8080 | NestJS backend |
| web | 3000 (internal) | Next.js frontend |
| nginx | 4000 | Reverse proxy (public entry) |

### Test (`docker-compose.test.yml`)

| Service | Port | Storage |
|---|---|---|
| postgres-test | 5433 | tmpfs (ephemeral) |
| redis-test | 6380 | tmpfs |
| minio-test | 9010/9011 | tmpfs |

---

## Database Migrations

Migrations live in `apps/api/migrations/`. Always use the TypeORM CLI to generate; never hand-write SQL unless absolutely necessary.

```bash
# Generate from entity changes
make db:migration:generate name=AddIssueLabels

# Or from apps/api:
bun run db:generate -- -n AddIssueLabels

# Apply
bun run db:migrate

# Rollback
bun run db:migrate:revert
```

---

## GraphQL Code Generation

After any schema change (adding resolver fields, new types):

1. Ensure the API is running: `bun run dev` from root
2. From `apps/web`: `bun run codegen`
3. Commit updated `src/graphql/types.ts` and `src/graphql/hooks.ts`

---

## Code Exploration

Prefer `grep` and `find` over reading whole files when locating symbols, patterns, or file paths.

```bash
# Find a symbol
grep -rn "symbolName" apps/api/src --include="*.ts"

# Find files by pattern
find apps/api/src -name "*.module.ts"

# Find decorator usages
grep -rn "@BeforeUpdate\|@BeforeInsert" apps/api/src --include="*.ts"

# Find GraphQL resolver
grep -rn "@Mutation\|@Query\|@Subscription" apps/api/src --include="*.ts"

# Find TypeORM entity
find apps/api/src/models -name "*.entity.ts"
```

Only `Read` a file once you know it contains what you need.
