# factory-gateway — production image for Port remount / Funnel / PaaS (FE-114)
# Node 20+, multi-stage, listens GATEWAY_PORT (default 8787), GET /health
# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json tsconfig.json ./
COPY src ./src
RUN npm run build \
  && npm prune --omit=dev

FROM node:20-alpine AS runtime
RUN apk add --no-cache curl \
  && addgroup -S factory \
  && adduser -S -G factory factory
WORKDIR /app

ENV NODE_ENV=production \
    GATEWAY_HOST=0.0.0.0 \
    GATEWAY_PORT=8787

# No runtime npm deps today (stdlib-only); keep package.json for identity / future deps.
COPY --from=build --chown=factory:factory /app/package.json ./
COPY --from=build --chown=factory:factory /app/dist ./dist

USER factory
EXPOSE 8787

HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=6 \
  CMD curl -fsS "http://127.0.0.1:${GATEWAY_PORT:-8787}/health" || wget -qO- "http://127.0.0.1:${GATEWAY_PORT:-8787}/health" >/dev/null || exit 1

CMD ["node", "dist/index.js"]
