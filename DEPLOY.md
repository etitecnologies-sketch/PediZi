# ⚡ PEDIZI — Guia Completo de Deploy em Produção

> Esse guia explica **passo a passo** como colocar o PEDIZI no ar usando serviços gratuitos ou de baixo custo.

---

## 🗺️ Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────┐
│              Cloudflare DNS                  │
│  pedizi.com.br → Vercel (web)               │
│  admin.pedizi.com.br → Vercel (admin)       │
│  restaurante.pedizi.com.br → Vercel (rest.) │
│  api.pedizi.com.br → Railway (API)          │
└─────────────────────────────────────────────┘
           │                    │
    ┌──────▼──────┐    ┌────────▼────────┐
    │   Vercel    │    │    Railway      │
    │  (3 apps)   │    │  NestJS + API   │
    └─────────────┘    └────────┬────────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
       ┌──────▼──────┐  ┌───────▼──────┐  ┌──────▼──────┐
       │  Supabase   │  │   Upstash    │  │ Cloudinary  │
       │ PostgreSQL  │  │    Redis     │  │   Imagens   │
       └─────────────┘  └─────────────┘  └─────────────┘
```

---

## 📋 Checklist de Deploy

- [ ] 1. Supabase (banco de dados)
- [ ] 2. Upstash (Redis)
- [ ] 3. Cloudinary (imagens)
- [ ] 4. Mercado Pago (pagamentos PIX)
- [ ] 5. Railway (API backend)
- [ ] 6. Vercel (frontends)
- [ ] 7. Cloudflare DNS (domínio)
- [ ] 8. GitHub Secrets (CI/CD)

---

## 1️⃣ Supabase — Banco de Dados PostgreSQL

**O que é:** Banco de dados gratuito com 500MB e 2 projetos grátis.

### Passos:
1. Acesse [supabase.com](https://supabase.com) → **New project**
2. Anote: **Project URL**, **API Key**, e **Connection String**
3. Vá em: **Settings → Database → Connection Pooling**
4. Copie a connection string do **Transaction mode** (porta 6543)

```
postgresql://postgres:[SENHA]@db.[SEU-PROJETO].supabase.co:6543/postgres?pgbouncer=true
```

### Rodar migrations no Supabase:
```bash
# No seu computador, com a DATABASE_URL do Supabase
cd apps/api
DATABASE_URL="sua_url_supabase" npx prisma migrate deploy
DATABASE_URL="sua_url_supabase" npx ts-node prisma/seed.ts
```

---

## 2️⃣ Upstash — Redis

**O que é:** Redis gratuito com 10.000 requisições/dia grátis.

### Passos:
1. Acesse [upstash.com](https://upstash.com) → **Create database**
2. Região: **São Paulo (sa-east-1)**
3. Copie: `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`
4. Ou use a URL `rediss://default:[TOKEN]@[HOST].upstash.io:6380`

---

## 3️⃣ Cloudinary — Armazenamento de Imagens

**O que é:** CDN de imagens com 25GB grátis.

### Passos:
1. Acesse [cloudinary.com](https://cloudinary.com) → conta grátis
2. Dashboard → copie: **Cloud Name**, **API Key**, **API Secret**
3. Vá em **Settings → Upload → Upload presets** → crie preset `pedizi`

---

## 4️⃣ Mercado Pago — PIX

### Passos:
1. Acesse [mercadopago.com.br/developers](https://mercadopago.com.br/developers)
2. **Minhas aplicações → Criar aplicação**
3. Copie **Access Token** (produção)
4. Configure **Webhooks**: `https://api.pedizi.com.br/api/v1/payments/webhooks/mercadopago`

> **Teste primeiro em sandbox!** Use o Access Token de teste (`APP_USR-TEST-...`) antes de usar produção.

---

## 5️⃣ Railway — Backend API

**O que é:** Plataforma cloud para hospedar o servidor. Tem plano gratuito com $5 de crédito/mês.

### Passos:
```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Criar projeto
railway new

# 4. Linkar ao repositório GitHub
railway link

# 5. Configurar variáveis de ambiente (via painel ou CLI)
railway variables set NODE_ENV=production
railway variables set DATABASE_URL="sua_url_supabase"
railway variables set REDIS_URL="sua_url_upstash"
railway variables set JWT_SECRET="$(openssl rand -base64 64)"
railway variables set JWT_REFRESH_SECRET="$(openssl rand -base64 64)"
railway variables set CLOUDINARY_CLOUD_NAME="seu_cloud_name"
railway variables set CLOUDINARY_API_KEY="sua_api_key"
railway variables set CLOUDINARY_API_SECRET="seu_api_secret"
railway variables set MERCADOPAGO_ACCESS_TOKEN="seu_token"
railway variables set FRONTEND_URL="https://pedizi.com.br"
railway variables set ADMIN_URL="https://admin.pedizi.com.br"
railway variables set RESTAURANT_URL="https://restaurante.pedizi.com.br"

# 6. Deploy
railway up
```

### URL da API:
```
https://api-pedizi.up.railway.app
```
(Configure um domínio personalizado: `api.pedizi.com.br`)

---

## 6️⃣ Vercel — Frontends

**O que é:** Hospedagem para Next.js. Grátis com 100GB de bandwidth/mês.

### Deploy do App Web (pedizi.com.br):
```bash
npm install -g vercel

# Login
vercel login

# Deploy
cd apps/web
vercel --prod

# Configurar variáveis:
vercel env add NEXT_PUBLIC_API_URL production
# Digite: https://api.pedizi.com.br/api/v1

vercel env add NEXT_PUBLIC_WS_URL production
# Digite: https://api.pedizi.com.br
```

### Deploy do Admin (admin.pedizi.com.br):
```bash
cd apps/admin
vercel --prod
# Mesmas variáveis de ambiente
```

### Deploy do Restaurante (restaurante.pedizi.com.br):
```bash
cd apps/restaurant
vercel --prod
# Mesmas variáveis de ambiente
```

---

## 7️⃣ Cloudflare DNS

**O que é:** Serviço de DNS gratuito que também protege o site de ataques.

### Configuração de registros:
| Tipo | Nome | Valor | Proxy |
|------|------|-------|-------|
| CNAME | `@` (pedizi.com.br) | `cname.vercel-dns.com` | ✅ |
| CNAME | `www` | `cname.vercel-dns.com` | ✅ |
| CNAME | `admin` | `cname.vercel-dns.com` | ✅ |
| CNAME | `restaurante` | `cname.vercel-dns.com` | ✅ |
| CNAME | `api` | `seu-app.up.railway.app` | 🔴 (desligado) |

> **Importante:** Deixe o proxy do `api` **desligado** para WebSocket funcionar!

---

## 8️⃣ GitHub Secrets (CI/CD automático)

Configure no seu repositório: **Settings → Secrets → Actions**

```
RAILWAY_TOKEN          # railway whoami --token
VERCEL_TOKEN           # vercel tokens create
VERCEL_ORG_ID          # vercel teams ls
VERCEL_WEB_PROJECT_ID  # vercel project ls
VERCEL_ADMIN_PROJECT_ID
VERCEL_RESTAURANT_PROJECT_ID
NEXT_PUBLIC_API_URL    # https://api.pedizi.com.br/api/v1
NEXT_PUBLIC_WS_URL     # https://api.pedizi.com.br
```

---

## 🔒 Segurança — Checklist Final

- [ ] JWT_SECRET com pelo menos 64 caracteres aleatórios
- [ ] JWT_REFRESH_SECRET diferente do JWT_SECRET
- [ ] HTTPS em todos os domínios
- [ ] Webhook Mercado Pago com assinatura validada
- [ ] Rate limiting ativo na API
- [ ] CORS configurado apenas para seus domínios
- [ ] Variáveis sensíveis NUNCA no código (só em `.env`)
- [ ] `.env` no `.gitignore`

---

## 🚀 Comandos Úteis

```bash
# Verificar saúde da API
curl https://api.pedizi.com.br/api/v1/health

# Rodar migrations em produção (pelo Railway)
railway run --service api npx prisma migrate deploy

# Ver logs da API
railway logs --service api

# Rodar seed em produção (uma vez só!)
railway run --service api npx ts-node prisma/seed.ts

# Rollback de deploy Vercel
vercel rollback

# Rollback Railway
railway rollback
```

---

## 💰 Custo Estimado (Plano Inicial Gratuito)

| Serviço | Plano | Custo |
|---------|-------|-------|
| Vercel | Hobby | **Grátis** |
| Railway | Developer | **$5 crédito/mês** |
| Supabase | Free | **Grátis** (500MB) |
| Upstash | Free | **Grátis** (10k req/dia) |
| Cloudinary | Free | **Grátis** (25GB) |
| Cloudflare DNS | Free | **Grátis** |
| **Total** | | **~$0 — $5/mês** |

> Para crescimento, migre para: Railway Pro ($20/mês) + Supabase Pro ($25/mês)

---

## 📞 Suporte

Em caso de problemas:
- **Railway**: [docs.railway.app](https://docs.railway.app)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Mercado Pago**: [mercadopago.com.br/developers/docs](https://mercadopago.com.br/developers/docs)
