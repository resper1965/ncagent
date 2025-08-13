#!/bin/bash

# Script de Deploy para EasyPanel
# nCommand Lite Agent

set -e

echo "🚀 Iniciando deploy do nCommand Lite Agent..."

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto"
    exit 1
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm ci

# Build dos pacotes
echo "🔨 Build dos pacotes..."
npm run build

# Build do Docker (opcional, para teste local)
if [ "$1" = "--docker" ]; then
    echo "🐳 Build da imagem Docker..."
    docker build -t ncommand-lite-agent .
    echo "✅ Imagem Docker criada: ncommand-lite-agent"
fi

echo "✅ Deploy preparado com sucesso!"
echo ""
echo "📋 Próximos passos no EasyPanel:"
echo "1. Fazer upload do código"
echo "2. Configurar variáveis de ambiente"
echo "3. Definir porta: 3000"
echo "4. Configurar domínio"
echo "5. Deploy!"
echo ""
echo "🔧 Variáveis de ambiente necessárias:"
echo "SUPABASE_URL=https://seu-projeto.supabase.co"
echo "SUPABASE_ANON_KEY=sua_chave_anon"
echo "SUPABASE_SERVICE_ROLE_KEY=sua_chave_service"
echo "OPENAI_API_KEY=sk-..."
echo "REDIS_URL=redis://localhost:6379"
echo "NODE_ENV=production"
