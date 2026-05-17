# ═══════════════════════════════════════════════════
# PEDIZI — Script de Setup (Windows PowerShell)
# Execute: .\scripts\setup.ps1
# ═══════════════════════════════════════════════════

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "  ⚡ PEDIZI — Setup de Desenvolvimento" -ForegroundColor Cyan
Write-Host "  O delivery da sua cidade." -ForegroundColor Cyan
Write-Host ""

# Verificações
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js não encontrado. Instale em nodejs.org" -ForegroundColor Red
    exit 1
}

if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "Instalando pnpm..." -ForegroundColor Yellow
    npm install -g pnpm
}

Write-Host "✅ Dependências verificadas" -ForegroundColor Green

# Env
if (-not (Test-Path "apps/api/.env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" "apps/api/.env"
    } elseif (Test-Path "apps/api/.env.production.example") {
        Copy-Item "apps/api/.env.production.example" "apps/api/.env"
    }
    Write-Host "📝 Arquivo .env criado em apps/api/.env — configure suas credenciais!" -ForegroundColor Yellow
}

# pnpm install
Write-Host ""
Write-Host "📦 Instalando dependências..."
pnpm install
Write-Host "✅ Dependências instaladas" -ForegroundColor Green

# Docker
if (Get-Command docker -ErrorAction SilentlyContinue) {
    Write-Host ""
    Write-Host "🐳 Subindo banco de dados e Redis..."
    docker compose -f docker-compose.dev.yml up -d
    Start-Sleep -Seconds 5
    Write-Host "✅ PostgreSQL e Redis rodando" -ForegroundColor Green
} else {
    Write-Host "⚠️  Docker não encontrado — configure DATABASE_URL manualmente" -ForegroundColor Yellow
}

# Prisma
Write-Host ""
Write-Host "🗄️  Configurando banco de dados..."
Set-Location "apps/api"
npx prisma generate
try { npx prisma migrate dev --name init } catch { npx prisma migrate deploy }
Write-Host "✅ Banco de dados configurado" -ForegroundColor Green

# Seed
Write-Host ""
Write-Host "🌱 Populando dados de exemplo..."
npx ts-node prisma/seed.ts
Write-Host "✅ Dados de exemplo criados" -ForegroundColor Green

Set-Location "../.."

Write-Host ""
Write-Host "══════════════════════════════════════" -ForegroundColor Green
Write-Host "  🎉 PEDIZI pronto para desenvolvimento!" -ForegroundColor Green
Write-Host "══════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "  Execute: pnpm dev"
Write-Host ""
Write-Host "  📱 App Cliente:  http://localhost:3000"
Write-Host "  🖥️  Admin:        http://localhost:3001"
Write-Host "  🍔 Restaurante:  http://localhost:3002"
Write-Host "  🔧 API:           http://localhost:3333"
Write-Host "  📚 Swagger:      http://localhost:3333/api/docs"
Write-Host ""
Write-Host "  Credenciais:"
Write-Host "  👤 Admin:       admin@pedizi.com.br / Admin@123"
Write-Host "  🧑 Cliente:     joao@teste.com / Cliente@123"
Write-Host "  🍔 Restaurante: dono@burguerhouse.com / Owner@123"
Write-Host "  🎫 Cupom:       PEDIZI10 (10% off)"
Write-Host ""
