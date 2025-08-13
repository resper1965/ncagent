#!/bin/bash

# Script para carregar variáveis de ambiente do config.env
# nCommand Lite Agent

echo "🔧 Carregando variáveis de ambiente..."

# Verificar se config.env existe
if [ ! -f "config.env" ]; then
    echo "❌ Erro: config.env não encontrado"
    echo "📝 Execute: cp env.example config.env"
    exit 1
fi

# Carregar variáveis
export $(cat config.env | grep -v '^#' | xargs)

echo "✅ Variáveis carregadas:"
echo "   SUPABASE_URL: $SUPABASE_URL"
echo "   REDIS_URL: $REDIS_URL"
echo "   NODE_ENV: $NODE_ENV"
echo "   NEXT_PUBLIC_APP_URL: $NEXT_PUBLIC_APP_URL"

echo ""
echo "🚀 Para usar: source load-env.sh"
echo "📝 Ou execute: export \$(cat config.env | grep -v '^#' | xargs)"
