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

# Configurar ambiente de produção
echo "🔧 Configurando ambiente de produção..."
if [ -f "production.env" ]; then
    echo "📋 Usando configurações de produção..."
    export $(cat production.env | grep -v '^#' | xargs)
else
    echo "⚠️  Arquivo production.env não encontrado, usando configurações padrão"
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
echo "2. Configurar variáveis de ambiente (ver production.env)"
echo "3. Definir porta: 3000"
echo "4. Configurar domínio: https://ncagent.ness.tec.br"
echo "5. Deploy!"
echo ""
echo "🔧 Variáveis de ambiente necessárias:"
echo "NEXT_PUBLIC_SUPABASE_URL=https://nsecops-ness-supabase.pzgnh1.easypanel.host/"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
echo "SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
echo "OPENAI_API_KEY=sk-proj-..."
echo "NODE_ENV=production"
echo "NEXT_PUBLIC_APP_URL=https://ncagent.ness.tec.br"
