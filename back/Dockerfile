FROM node:20-alpine AS builder

WORKDIR /app

COPY shared/ ./shared/
WORKDIR /app/shared
RUN npm install && npm run build

COPY back/ /app/back/
WORKDIR /app/back
RUN npm install && npm run build

FROM node:20-alpine AS runner

WORKDIR /app

COPY shared/ ./shared/
WORKDIR /app/shared
RUN npm install --omit=dev

COPY back/package*.json /app/back/
COPY back/domain/package.json /app/back/domain/
COPY back/application/package.json /app/back/application/
COPY back/infrastructure/package.json /app/back/infrastructure/
COPY back/infrastructure/adapters/package.json /app/back/infrastructure/adapters/
WORKDIR /app/back
RUN npm install --omit=dev

COPY --from=builder /app/back/dist ./dist
COPY back/infrastructure/database/postgres/init.sql ./infrastructure/database/postgres/init.sql
COPY back/infrastructure/database/postgres/migrations/ ./infrastructure/database/postgres/migrations/
COPY back/infrastructure/database/postgres/fixtures/ ./infrastructure/database/postgres/fixtures/

ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "dist/infrastructure/adapters/fastify/server.js"]
