# 🎭 Regras de Deploy Automático - ncAgent

## 📋 Visão Geral

O sistema de deploy automático foi configurado para executar automaticamente após cada commit na branch `main`, garantindo que a aplicação seja sempre atualizada na VPS.

## 🚀 Scripts de Deploy

### 1. **deploy.sh** - Deploy Automático Completo
- **Uso:** Executado automaticamente pelo git hook
- **Funcionalidades:**
  - Trigger deploy via API da VPS
  - Verificação de status da aplicação
  - Aguarda deploy completar (timeout: 5 minutos)
  - Feedback completo do processo

### 2. **deploy-manual.sh** - Deploy Manual
- **Uso:** Para deploy manual quando necessário
- **Funcionalidades:**
  - Trigger deploy via API da VPS
  - Feedback básico do processo

### 3. **.git/hooks/post-commit** - Git Hook Automático
- **Uso:** Executado automaticamente após cada commit
- **Funcionalidades:**
  - Verifica se está na branch `main`
  - Executa `deploy.sh` automaticamente
  - Feedback do processo

## 🔧 Configurações

### URLs de Deploy
```bash
DEPLOY_URL="http://62.72.8.164:3000/api/deploy/c5d2c1ef48a80ba404b96bb4f608c49aa410e697878a1966"
APP_URL="https://ncagent.ness.tec.br/"
```

### Comportamento por Branch
- **main:** Deploy automático ativado
- **outras branches:** Deploy automático desabilitado

## 📝 Como Usar

### Deploy Automático (Padrão)
```bash
# Apenas fazer commit na branch main
git add .
git commit -m "Sua mensagem"
git push origin main
# Deploy executado automaticamente!
```

### Deploy Manual
```bash
# Executar deploy manual
./deploy-manual.sh
```

### Deploy Completo com Verificação
```bash
# Executar deploy com verificação de status
./deploy.sh
```

## ⚠️ Considerações

1. **Apenas branch main:** Deploy automático só funciona na branch principal
2. **Timeout:** Deploy automático aguarda até 5 minutos
3. **API da VPS:** Deploy depende da API estar online
4. **Permissões:** Scripts devem ter permissão de execução (`chmod +x`)

## 🔍 Troubleshooting

### Deploy não executa automaticamente
```bash
# Verificar se o hook está executável
ls -la .git/hooks/post-commit

# Verificar se está na branch main
git branch

# Executar deploy manual
./deploy-manual.sh
```

### Deploy falha
```bash
# Verificar status da API
curl -I http://62.72.8.164:3000/api/deploy/c5d2c1ef48a80ba404b96bb4f608c49aa410e697878a1966

# Verificar status da aplicação
curl -I https://ncagent.ness.tec.br/
```

## 🎯 Benefícios

1. **Automatização:** Deploy sem intervenção manual
2. **Consistência:** Sempre a versão mais recente em produção
3. **Feedback:** Status completo do processo
4. **Flexibilidade:** Deploy manual quando necessário
5. **Segurança:** Apenas branch main faz deploy automático
