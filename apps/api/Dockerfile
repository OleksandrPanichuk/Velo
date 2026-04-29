FROM node:22-alpine

RUN npm install -g bun

WORKDIR /app

COPY package.json bun.lock ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/ui/package.json ./packages/ui/
COPY packages/primitives/package.json ./packages/primitives/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/

RUN bun install --frozen-lockfile

COPY apps/api/ ./apps/api/
COPY packages/ ./packages/

WORKDIR /app/apps/api

EXPOSE 8080

CMD ["node_modules/.bin/nest", "start", "--watch"]
