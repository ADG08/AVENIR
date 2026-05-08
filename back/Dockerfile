FROM node:20-alpine AS builder
WORKDIR /app

COPY shared/ ./shared/
WORKDIR /app/shared
RUN npm install && npm run build

COPY back/ /app/back/
WORKDIR /app/back
RUN npm install && npm run build

FROM node:20-alpine AS runner
WORKDIR /app/back

# Install only third-party prod deps — no workspaces, no local @avenir packages
COPY back/package.json ./
RUN node -e "const p=require('./package.json');delete p.workspaces;delete p.dependencies['@avenir/shared'];require('fs').writeFileSync('package.json',JSON.stringify(p))" \
    && npm install --omit=dev --no-package-lock

# Compiled back output
COPY --from=builder /app/back/dist ./dist

# Compiled shared output (needed by @avenir/shared resolution)
COPY shared/package.json /app/shared/
COPY --from=builder /app/shared/dist /app/shared/dist

# Wire @avenir/* to compiled output — symlinks never point to TS source
RUN mkdir -p node_modules/@avenir \
    && ln -sf /app/shared              node_modules/@avenir/shared \
    && ln -sf /app/back/dist/domain    node_modules/@avenir/domain \
    && ln -sf /app/back/dist/application node_modules/@avenir/application \
    && ln -sf /app/back/dist/infrastructure node_modules/@avenir/infrastructure

# SQL files — migrate.ts resolves these relative to __dirname at runtime
COPY back/infrastructure/database/postgres/ ./infrastructure/database/postgres/

ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "dist/infrastructure/adapters/fastify/server.js"]
