# Dockerfile Simples para n.agent
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/

# Instalar dependências
RUN npm ci
RUN cd apps/web && npm ci

# Copiar código
COPY . .

# Build da aplicação
WORKDIR /app/apps/web
RUN npm run build

# Expor porta
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "start"]
