# ═══════════════════════════════════════════════════
# PEDIZI API — Dockerfile Production-Ready
# Multi-stage build: deps → builder → runner
# Imagem final mínima (~180MB)
# ═══════════════════════════════════════════════════

# ── Estágio base com pnpm ────────────────────────────
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apk add --no-cache libc6-compat openssl

# ── Dependências ────────────────────────────────────
FROM base AS deps
WORKDIR /app

# Copia arquivos de configuração do monorepo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/
COPY packages/config/package.json ./packages/config/

# Instala apenas dependências de produção da API
RUN pnpm install --frozen-lockfile --filter @pedizi/api --prod

# ── Build ────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/
COPY packages/config/package.json ./packages/config/

# Instala todas as dependências (incluindo devDeps para build)
RUN pnpm install --frozen-lockfile --filter @pedizi/api

# Copia código fonte
COPY apps/api ./apps/api
COPY packages ./packages

WORKDIR /app/apps/api

# Gera cliente Prisma
RUN pnpm exec prisma generate

# Compila TypeScript → JavaScript
RUN pnpm build

# Remove devDependencies
RUN pnpm prune --prod

# ── Runner (imagem final mínima) ─────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

# Configurações de segurança
RUN apk add --no-cache openssl curl && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

ENV NODE_ENV=production
ENV PORT=3333

# Copia apenas o necessário do builder
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/node_modules/.pnpm/@prisma+client@*/node_modules/@prisma/client ./node_modules/@prisma/client 2>/dev/null || true

# Copia script de inicialização
COPY --chown=nestjs:nodejs apps/api/docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

USER nestjs

EXPOSE 3333

# Health check para Railway/Docker
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3333/api/v1/health || exit 1

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/main"]
