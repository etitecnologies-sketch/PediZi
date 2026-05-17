#!/bin/bash
# ═══════════════════════════════════════════════════
# PEDIZI — Script de Setup Completo (Desenvolvimento)
# Execute: bash scripts/setup.sh
# ═══════════════════════════════════════════════════

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}  ⚡ PEDIZI — Setup de Desenvolvimento${NC}"
echo -e "${BLUE}  O delivery da sua cidade.${NC}"
echo ""

# Verificações
command -v node >/dev/null 2>&1 || { echo -e "${RED}❌ Node.js não encontrado. Instale em nodejs.org${NC}"; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "Instalando pnpm..."; npm install -g pnpm; }
command -v docker >/dev/null 2>&1 || { echo -e "${YELLOW}⚠️  Docker não encontrado. Instale em docker.com${NC}"; }

echo -e "${GREEN}✅ Dependências verificadas${NC}"

# Env
if [ ! -f "apps/api/.env" ]; then
  cp .env.example apps/api/.env 2>/dev/null || cp apps/api/.env.production.example apps/api/.env
  echo -e "${YELLOW}📝 Arquivo .env criado em apps/api/.env — configure suas credenciais!${NC}"
fi

# pnpm install
echo ""
echo "📦 Instalando dependências..."
pnpm install
echo -e "${GREEN}✅ Dependências instaladas${NC}"

# Docker (infra)
if command -v docker >/dev/null 2>&1; then
  echo ""
  echo "🐳 Subindo banco de dados e Redis..."
  docker compose -f docker-compose.dev.yml up -d
  sleep 5
  echo -e "${GREEN}✅ PostgreSQL e Redis rodando${NC}"
fi

# Prisma
echo ""
echo "🗄️  Configurando banco de dados..."
cd apps/api
npx prisma generate
npx prisma migrate dev --name init 2>/dev/null || npx prisma migrate deploy
echo -e "${GREEN}✅ Banco de dados configurado${NC}"

# Seed
echo ""
echo "🌱 Populando dados de exemplo..."
npx ts-node prisma/seed.ts
echo -e "${GREEN}✅ Dados de exemplo criados${NC}"

cd ../..

echo ""
echo -e "${GREEN}══════════════════════════════════════${NC}"
echo -e "${GREEN}  🎉 PEDIZI pronto para desenvolvimento!${NC}"
echo -e "${GREEN}══════════════════════════════════════${NC}"
echo ""
echo "  Execute: pnpm dev"
echo ""
echo "  📱 App Cliente:   http://localhost:3000"
echo "  🖥️  Admin:         http://localhost:3001"
echo "  🍔 Restaurante:   http://localhost:3002"
echo "  🔧 API:            http://localhost:3333"
echo "  📚 Swagger:       http://localhost:3333/api/docs"
echo ""
echo "  Credenciais:"
echo "  👤 Admin:       admin@pedizi.com.br / Admin@123"
echo "  🧑 Cliente:     joao@teste.com / Cliente@123"
echo "  🍔 Restaurante: dono@burguerhouse.com / Owner@123"
echo "  🎫 Cupom:       PEDIZI10 (10% off)"
echo ""
