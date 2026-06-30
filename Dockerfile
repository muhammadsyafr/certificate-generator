FROM node:20-alpine AS build

WORKDIR /app

# Build-time environment (inlined by Nuxt into SPA bundle)
ARG NUXT_PUBLIC_API_BASE_URL=http://localhost:4000
ARG NUXT_PUBLIC_APP_URL=http://localhost:3000
ENV NUXT_PUBLIC_API_BASE_URL=$NUXT_PUBLIC_API_BASE_URL \
    NUXT_PUBLIC_APP_URL=$NUXT_PUBLIC_APP_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache tini && \
    addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=build /app/.output ./.output
COPY --from=build /app/package.json ./

RUN mkdir -p /data/public/uploads && \
    ln -sfn /data/public/uploads /app/public/uploads && \
    chown -R appuser:appgroup /app /data

USER appuser

EXPOSE 3000

ENV DATA_DIR=/data \
    NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", ".output/server/index.mjs"]