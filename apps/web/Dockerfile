FROM node:22-alpine AS base

RUN npm install -g bun && corepack disable

WORKDIR /app

COPY package.json bun.lock ./
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/
COPY packages/ui/package.json ./packages/ui/
COPY packages/primitives/package.json ./packages/primitives/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/

RUN bun install --frozen-lockfile

COPY apps/web ./apps/web
COPY packages ./packages

WORKDIR /app/apps/web

EXPOSE 3000

CMD ["bun", "run", "dev"]
