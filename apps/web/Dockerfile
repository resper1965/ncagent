# Multi-stage build para otimização
FROM node:18-alpine AS base

# Instalar dependências necessárias
RUN apk add --no-cache libc6-compat

# Dependências de produção
FROM base AS deps
WORKDIR /app

# Copiar package.json dos workspaces
COPY package.json package-lock.json* ./
COPY apps/web/package.json ./apps/web/
COPY packages/rag/package.json ./packages/rag/
COPY packages/ui/package.json ./packages/ui/

# Instalar dependências
RUN npm ci --only=production --workspaces

# Build da aplicação
FROM base AS builder
WORKDIR /app

# Copiar dependências
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /app/packages/rag/node_modules ./packages/rag/node_modules
COPY --from=deps /app/packages/ui/node_modules ./packages/ui/node_modules

# Copiar código fonte
COPY . .

# Build do pacote RAG
WORKDIR /app/packages/rag
RUN npm run build

# Build do pacote UI
WORKDIR /app/packages/ui
RUN npm run build

# Build do app web
WORKDIR /app/apps/web
RUN npm run build

# Imagem de produção
FROM base AS runner
WORKDIR /app

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos necessários
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next ./apps/web/.next

# Copiar node_modules necessários
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=builder /app/packages/rag/dist ./packages/rag/dist
COPY --from=builder /app/packages/ui/dist ./packages/ui/dist

# Configurar permissões
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Comando para iniciar a aplicação
CMD ["npm", "start"]
