FROM node:20-alpine AS base
RUN npm install -g pnpm

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY apps/restaurant/package.json ./apps/restaurant/
RUN pnpm install --frozen-lockfile --filter @pedizi/restaurant

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/restaurant/node_modules ./apps/restaurant/node_modules
COPY apps/restaurant ./apps/restaurant
WORKDIR /app/apps/restaurant
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/restaurant/.next/standalone ./
COPY --from=builder /app/apps/restaurant/.next/static ./.next/static
COPY --from=builder /app/apps/restaurant/public ./public
EXPOSE 3002
ENV PORT=3002
CMD ["node", "server.js"]
