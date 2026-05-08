FROM node:22-alpine AS builder

WORKDIR /app

# Copy shared package first (build context = repo root)
COPY shared/ ./shared/
WORKDIR /app/shared
RUN npm install --include=dev && npm run build

WORKDIR /app
COPY front/package*.json ./front/
RUN cd front && npm ci \
    && rm -rf node_modules/@avenir/shared \
    && mkdir -p node_modules/@avenir/shared \
    && cp /app/shared/package.json node_modules/@avenir/shared/ \
    && cp -r /app/shared/dist node_modules/@avenir/shared/

COPY front/ ./front/

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WS_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL

RUN cd front && npm run build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/front/public ./public
COPY --from=builder /app/front/.next/standalone ./
COPY --from=builder /app/front/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
