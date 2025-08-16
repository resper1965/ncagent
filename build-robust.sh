#!/bin/bash

# Script de Build Robusto para ncAgent
# Força rebuild completo e resolve conflitos de dependências

set -e

echo "🏗️ BMad Orchestrator - Build Robusto Iniciado"
echo "================================================"

# 1. Limpar caches
echo "🧹 Limpando caches..."
rm -rf node_modules
rm -rf apps/web/node_modules
rm -rf .next
rm -rf apps/web/.next
npm cache clean --force

# 2. Verificar package.json
echo "📋 Verificando package.json..."
if grep -q '"eslint": "^9.0.0"' apps/web/package.json; then
    echo "❌ ERRO: package.json ainda contém eslint@9.0.0"
    echo "🔧 Corrigindo..."
    sed -i 's/"eslint": "\^9.0.0"/"eslint": "^8.57.0"/g' apps/web/package.json
    echo "✅ package.json corrigido"
fi

# 3. Instalar dependências com flags de resolução
echo "📦 Instalando dependências..."
npm install --legacy-peer-deps --no-optional

# 4. Build da aplicação
echo "🔨 Build da aplicação..."
npm run build

# 5. Verificar build
echo "✅ Verificando build..."
if [ -d "apps/web/.next" ]; then
    echo "🎉 Build concluído com sucesso!"
    echo "📁 Arquivos gerados em: apps/web/.next/"
else
    echo "❌ ERRO: Build falhou - pasta .next não encontrada"
    exit 1
fi

echo "================================================"
echo "🏗️ Build Robusto Concluído com Sucesso!"
echo "🚀 Pronto para deploy!"
