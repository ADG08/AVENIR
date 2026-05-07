FROM node:22-alpine AS builder

WORKDIR /app

# Copy shared package first (build context = repo root)
COPY shared/ ./shared/
COPY back/package*.json ./back/
RUN cd back && npm ci

COPY back/ ./back/
RUN cd back && npm run build

FROM node:22-alpine AS runner

WORKDIR /app

COPY shared/ ./shared/
COPY back/package*.json ./back/
RUN cd back && npm ci --omit=dev

COPY --from=builder /app/back/dist ./back/dist
COPY back/infrastructure/database/postgres/init.sql ./back/infrastructure/database/postgres/init.sql
COPY back/infrastructure/database/postgres/migrations/ ./back/infrastructure/database/postgres/migrations/
COPY back/infrastructure/database/postgres/fixtures/ ./back/infrastructure/database/postgres/fixtures/

ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "back/dist/infrastructure/adapters/fastify/server.js"]
