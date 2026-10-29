# Factory Developer OS — local sandbox container (FE-198 verification).
# Production target stays Vercel (vercel.json); this image exists so the ask→
# Rivet wiring can be smoke-run in Docker without any Vercel deploy or spend.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.ts ./next.config.ts
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/eslint.config.mjs ./eslint.config.mjs
EXPOSE 3000
CMD ["npx", "next", "start"]
