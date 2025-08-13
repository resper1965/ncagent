#!/bin/bash

echo "🚀 Configurando Supabase local..."

# Verificar se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Inicie o Docker primeiro."
    exit 1
fi

# Verificar se o Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo "📦 Instalando Supabase CLI..."
    npm install -g supabase
fi

# Inicializar Supabase (se não existir)
if [ ! -d "supabase" ]; then
    echo "🔧 Inicializando projeto Supabase..."
    supabase init
fi

# Iniciar Supabase local
echo "🔄 Iniciando Supabase local..."
supabase start

# Aguardar um pouco para o banco inicializar
echo "⏳ Aguardando inicialização do banco..."
sleep 10

# Configurar schema RAG
echo "🔧 Configurando schema RAG..."
curl -X POST http://localhost:3000/api/init-db

echo "✅ Supabase configurado com sucesso!"
echo "📊 Dashboard: http://localhost:54323"
echo "🔗 API URL: http://localhost:54321"
echo "🔑 Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE"
