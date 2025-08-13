#!/bin/sh

echo "Iniciando n.agent..."
echo "Diretório atual: $(pwd)"
echo "Conteúdo do diretório:"
ls -la

echo "Verificando se o build existe..."
if [ -d ".next" ]; then
    echo "Build encontrado!"
    ls -la .next/
else
    echo "ERRO: Build não encontrado!"
    exit 1
fi

echo "Iniciando Next.js..."
exec npx next start -p 3000 -H 0.0.0.0
