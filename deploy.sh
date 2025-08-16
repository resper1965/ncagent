#!/bin/bash

# Script de Deploy Automático para ncAgent
# Executa deploy via API da VPS após commits

set -e

echo "🚀 Iniciando Deploy Automático..."

# Configurações
DEPLOY_URL="http://62.72.8.164:3000/api/deploy/c5d2c1ef48a80ba404b96bb4f608c49aa410e697878a1966"
APP_URL="https://ncagent.ness.tec.br/"

# Função para verificar se a aplicação está online
check_app_status() {
    echo "🔍 Verificando status da aplicação..."
    if curl -s -f "$APP_URL" > /dev/null; then
        echo "✅ Aplicação online em: $APP_URL"
        return 0
    else
        echo "❌ Aplicação offline"
        return 1
    fi
}

# Função para aguardar deploy
wait_for_deploy() {
    echo "⏳ Aguardando deploy completar..."
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        echo "Tentativa $attempt/$max_attempts..."
        
        if check_app_status; then
            echo "🎉 Deploy concluído com sucesso!"
            return 0
        fi
        
        sleep 10
        attempt=$((attempt + 1))
    done
    
    echo "❌ Timeout: Deploy não completou em 5 minutos"
    return 1
}

# Executar deploy
echo "📡 Triggerando deploy via API..."
response=$(curl -s -X POST "$DEPLOY_URL")

if [ $? -eq 0 ]; then
    echo "✅ Deploy iniciado: $response"
    
    # Aguardar deploy completar
    if wait_for_deploy; then
        echo "🎯 Deploy finalizado com sucesso!"
        echo "🌐 Aplicação disponível em: $APP_URL"
        exit 0
    else
        echo "⚠️ Deploy pode ter falhado"
        exit 1
    fi
else
    echo "❌ Erro ao iniciar deploy"
    exit 1
fi
