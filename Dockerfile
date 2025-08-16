# Dockerfile Otimizado para Produção
FROM node:20-alpine AS base

# Instalar dependências do sistema
RUN apk add --no-cache libc6-compat

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração
COPY package*.json ./
COPY turbo.json ./
COPY tsconfig.json ./
COPY apps/web/package*.json ./apps/web/

# Limpar cache npm e instalar dependências com flags de resolução
RUN npm cache clean --force && \
    npm install --legacy-peer-deps --no-optional

# Copiar código fonte
COPY . .

# Definir variáveis de ambiente para build (sem chaves expostas)
ENV NODE_ENV=production
ENV NEXT_PUBLIC_APP_URL=https://ncagent.ness.tec.br

# Build da aplicação
RUN npm run build

# Stage de produção
FROM node:20-alpine AS runner

# Instalar dependências do sistema
RUN apk add --no-cache libc6-compat

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar build standalone
COPY --from=base /app/apps/web/.next/standalone ./
COPY --from=base /app/apps/web/.next/static ./apps/web/.next/static

# Definir diretório de trabalho
WORKDIR /app

# Mudar para usuário não-root
USER nextjs

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Comando de inicialização
CMD ["node", "apps/web/server.js"]
