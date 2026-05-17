#!/bin/sh
set -e

echo "🚀 Iniciando PEDIZI API..."
echo "   Ambiente: $NODE_ENV"
echo "   Porta: $PORT"

# Aguarda o banco de dados ficar disponível
if [ -n "$DATABASE_URL" ]; then
  echo "⏳ Aguardando banco de dados..."

  # Extrai host e porta da DATABASE_URL
  DB_HOST=$(echo $DATABASE_URL | sed 's/.*@\([^:]*\).*/\1/')
  DB_PORT=$(echo $DATABASE_URL | sed 's/.*:\([0-9]*\)\/.*/\1/')

  MAX_RETRIES=30
  RETRY=0
  until nc -z "$DB_HOST" "${DB_PORT:-5432}" 2>/dev/null || [ $RETRY -eq $MAX_RETRIES ]; do
    echo "   Tentativa $((RETRY+1))/$MAX_RETRIES..."
    sleep 2
    RETRY=$((RETRY+1))
  done

  if [ $RETRY -eq $MAX_RETRIES ]; then
    echo "❌ Banco de dados não disponível após $MAX_RETRIES tentativas"
    exit 1
  fi

  echo "✅ Banco de dados disponível!"
fi

# Executa migrations em produção
if [ "$NODE_ENV" = "production" ] && [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "🔄 Executando migrations..."
  node_modules/.bin/prisma migrate deploy
  echo "✅ Migrations concluídas!"
fi

echo "🎯 Iniciando servidor..."
exec "$@"
