# Multi-stage build para otimização
FROM node:18-alpine AS base

# Instalar dependências necessárias
RUN apk add --no-cache libc6-compat

# Dependências de produção
FROM base AS deps
WORKDIR /app

# Copiar package.json dos workspaces
COPY package.json package-lock.json* ./
COPY apps/worker/package.json ./apps/worker/
COPY packages/rag/package.json ./packages/rag/

# Instalar dependências
RUN npm ci --only=production --workspaces

# Build da aplicação
FROM base AS builder
WORKDIR /app

# Copiar dependências
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/worker/node_modules ./apps/worker/node_modules
COPY --from=deps /app/packages/rag/node_modules ./packages/rag/node_modules

# Copiar código fonte
COPY . .

# Build do pacote RAG
WORKDIR /app/packages/rag
RUN npm run build

# Build do worker
WORKDIR /app/apps/worker
RUN npm run build

# Imagem de produção
FROM base AS runner
WORKDIR /app

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 worker

# Copiar arquivos necessários
COPY --from=builder /app/apps/worker/dist ./apps/worker/dist
COPY --from=builder /app/packages/rag/dist ./packages/rag/dist

# Copiar node_modules necessários
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/worker/node_modules ./apps/worker/node_modules
COPY --from=builder /app/packages/rag/node_modules ./packages/rag/node_modules

# Copiar package.json para scripts
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/apps/worker/package.json ./apps/worker/package.json
COPY --from=builder /app/packages/rag/package.json ./packages/rag/package.json

# Configurar permissões
RUN chown -R worker:nodejs /app

USER worker

# Comando para iniciar o worker
CMD ["node", "apps/worker/dist/index.js"]
