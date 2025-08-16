#!/bin/bash

# Script de Deploy Manual para ncAgent
# Para uso quando o deploy automático não é desejado

set -e

echo "🎭 BMad Orchestrator - Deploy Manual"

# Configurações
DEPLOY_URL="http://62.72.8.164:3000/api/deploy/c5d2c1ef48a80ba404b96bb4f608c49aa410e697878a1966"
APP_URL="https://ncagent.ness.tec.br/"

echo "📡 Triggerando deploy manual via API..."
echo "URL: $DEPLOY_URL"

response=$(curl -s -X POST "$DEPLOY_URL")

if [ $? -eq 0 ]; then
    echo "✅ Deploy manual iniciado: $response"
    echo "🌐 Aplicação será atualizada em: $APP_URL"
    echo "⏱️ Aguarde alguns minutos para o deploy completar..."
else
    echo "❌ Erro ao iniciar deploy manual"
    exit 1
fi
