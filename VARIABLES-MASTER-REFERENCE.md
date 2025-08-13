# Variáveis de Ambiente - Referência Mestre
# n.Agent Platform - Padronização Completa

## 📋 Visão Geral

Este documento define todas as variáveis de ambiente necessárias para o projeto n.Agent, organizadas por ambiente e funcionalidade.

## 🏗️ Estrutura de Ambientes

### 1. **DESENVOLVIMENTO LOCAL** (`apps/web/env.local`)
### 2. **PRODUÇÃO EASYPANEL** (`nagent-app-env.txt`)
### 3. **SUPABASE LOCAL** (`docker-compose.yml`)
### 4. **SUPABASE PRODUÇÃO** (`supabase-env-completo.txt`)

---

## 🔧 VARIÁVEIS DA APLICAÇÃO (Next.js)

### **OBRIGATÓRIAS - Todas as aplicações**

```bash
# ========================================
# CONFIGURAÇÃO DO SUPABASE (OBRIGATÓRIO)
# ========================================

# URL do Supabase (diferente por ambiente)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:8000                    # LOCAL
NEXT_PUBLIC_SUPABASE_URL=https://nsecops-ness-supabase.pzgnh1.easypanel.host  # PRODUÇÃO

# Chave anônima do Supabase (mesma em todos os ambientes)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE

# Chave de serviço do Supabase (mesma em todos os ambientes)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q

# ========================================
# CONFIGURAÇÃO DO OPENAI (OBRIGATÓRIO)
# ========================================

# Chave da API do OpenAI (substituir pela chave real)
OPENAI_API_KEY=sk-proj-REPLACE_WITH_YOUR_ACTUAL_OPENAI_API_KEY

# ========================================
# CONFIGURAÇÃO DA APLICAÇÃO (OBRIGATÓRIO)
# ========================================

# Ambiente de execução
NODE_ENV=development    # LOCAL
NODE_ENV=production     # PRODUÇÃO

# Porta da aplicação
PORT=3000

# URL da aplicação (diferente por ambiente)
NEXT_PUBLIC_APP_URL=http://localhost:3000              # LOCAL
NEXT_PUBLIC_APP_URL=https://ncagent.ness.tec.br        # PRODUÇÃO

# Chave customizada
CUSTOM_KEY=nagent-development-key    # LOCAL
CUSTOM_KEY=nagent-production-key-2024 # PRODUÇÃO
```

### **OPCIONAIS - Configurações avançadas**

```bash
# ========================================
# CONFIGURAÇÃO DO RAG (OPCIONAL)
# ========================================

# Modelo de embedding
RAG_EMBEDDING_MODEL=text-embedding-3-small

# Tamanho do chunk
RAG_CHUNK_SIZE=1000

# Sobreposição do chunk
RAG_CHUNK_OVERLAP=200

# Top K para busca
RAG_TOPK=12

# ========================================
# CONFIGURAÇÃO DO REDIS (OPCIONAL)
# ========================================

# URL do Redis (diferente por ambiente)
REDIS_URL=redis://localhost:6379           # LOCAL
REDIS_URL=redis://redis:6379               # DOCKER
REDIS_URL=redis://192.168.185.55:6379      # REDE LOCAL
```

---

## 🗄️ VARIÁVEIS DO SUPABASE

### **CRÍTICAS - Secrets obrigatórios**

```bash
# ========================================
# SECRETS PRINCIPAIS (CRÍTICOS)
# ========================================

# Senha do PostgreSQL (MESMA em todos os ambientes)
POSTGRES_PASSWORD=nagent-supabase-pg-secure-2024-xyz789-abc123-def456

# JWT Secret (MESMO em todos os ambientes)
JWT_SECRET=nagent-jwt-secret-2024-xyz789-abc123-def456-ghi789

# Secret Key Base (MESMO em todos os ambientes)
SECRET_KEY_BASE=nagent-secret-key-base-2024-xyz789-abc123-def456-ghi789-jkl012-mno345-pqr678

# Vault Encryption Key (MESMO em todos os ambientes)
VAULT_ENC_KEY=nagent-vault-enc-key-32-chars

# ========================================
# CHAVES DE API (MESMAS em todos os ambientes)
# ========================================

# Chave Anônima
ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE

# Chave de Serviço
SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q
```

### **CONFIGURAÇÃO - Diferentes por ambiente**

```bash
# ========================================
# CONFIGURAÇÃO DO BANCO DE DADOS
# ========================================

# Host do PostgreSQL (diferente por ambiente)
POSTGRES_HOST=localhost          # LOCAL
POSTGRES_HOST=db                 # DOCKER
POSTGRES_HOST=192.168.185.55     # REDE LOCAL

# Nome do banco
POSTGRES_DB=postgres

# Porta do PostgreSQL
POSTGRES_PORT=5432

# ========================================
# CONFIGURAÇÃO DO DASHBOARD
# ========================================

# Usuário do Dashboard
DASHBOARD_USERNAME=supabase

# Senha do Dashboard (MESMA em todos os ambientes)
DASHBOARD_PASSWORD=nagent-dashboard-secure-2024-xyz789

# ========================================
# CONFIGURAÇÃO DE AUTENTICAÇÃO
# ========================================

# URL do site (diferente por ambiente)
SITE_URL=http://localhost:3000                    # LOCAL
SITE_URL=https://ncagent.ness.tec.br              # PRODUÇÃO

# URLs adicionais de redirecionamento
ADDITIONAL_REDIRECT_URLS=

# Tempo de expiração do JWT (em segundos)
JWT_EXPIRY=3600

# Desabilitar cadastro
DISABLE_SIGNUP=false

# URL externa da API (diferente por ambiente)
API_EXTERNAL_URL=http://localhost:8000            # LOCAL
API_EXTERNAL_URL=https://ncagent.ness.tec.br/api  # PRODUÇÃO

# ========================================
# CONFIGURAÇÃO DE EMAIL
# ========================================

# Habilitar cadastro por email
ENABLE_EMAIL_SIGNUP=true

# Auto-confirmação de email
ENABLE_EMAIL_AUTOCONFIRM=true

# Email do administrador
SMTP_ADMIN_EMAIL=resper@ness.com.br

# Host SMTP
SMTP_HOST=localhost

# Porta SMTP
SMTP_PORT=587

# Usuário SMTP
SMTP_USER=resper@ness.com.br

# Senha SMTP (MESMA em todos os ambientes)
SMTP_PASS=nagent-smtp-password-2024

# Nome do remetente
SMTP_SENDER_NAME=n.Agent Platform

# Desabilitar usuários anônimos
ENABLE_ANONYMOUS_USERS=false

# ========================================
# CONFIGURAÇÃO DO STUDIO
# ========================================

# Organização padrão
STUDIO_DEFAULT_ORGANIZATION=Default Organization

# Projeto padrão
STUDIO_DEFAULT_PROJECT=Default Project

# Porta do Studio
STUDIO_PORT=3000

# URL pública do Supabase (diferente por ambiente)
SUPABASE_PUBLIC_URL=http://localhost:8000         # LOCAL
SUPABASE_PUBLIC_URL=https://ncagent.ness.tec.br   # PRODUÇÃO
```

---

## 🔄 MIGRAÇÃO ENTRE AMBIENTES

### **De LOCAL para PRODUÇÃO**

1. **Aplicação Next.js:**
   ```bash
   # LOCAL → PRODUÇÃO
   NEXT_PUBLIC_SUPABASE_URL=http://localhost:8000 → https://nsecops-ness-supabase.pzgnh1.easypanel.host
   NEXT_PUBLIC_APP_URL=http://localhost:3000 → https://ncagent.ness.tec.br
   NODE_ENV=development → production
   CUSTOM_KEY=nagent-development-key → nagent-production-key-2024
   ```

2. **Supabase:**
   ```bash
   # LOCAL → PRODUÇÃO
   SITE_URL=http://localhost:3000 → https://ncagent.ness.tec.br
   API_EXTERNAL_URL=http://localhost:8000 → https://ncagent.ness.tec.br/api
   SUPABASE_PUBLIC_URL=http://localhost:8000 → https://ncagent.ness.tec.br
   ```

### **SECRETS que NÃO mudam:**
- `POSTGRES_PASSWORD`
- `JWT_SECRET`
- `SECRET_KEY_BASE`
- `VAULT_ENC_KEY`
- `ANON_KEY`
- `SERVICE_ROLE_KEY`
- `DASHBOARD_PASSWORD`
- `SMTP_PASS`

---

## 📁 ARQUIVOS DE CONFIGURAÇÃO

### **Desenvolvimento Local:**
- `apps/web/env.local` - Variáveis da aplicação Next.js
- `config.env` - Variáveis gerais do projeto
- `docker-compose.yml` - Variáveis do Supabase local

### **Produção Easypanel:**
- `nagent-app-env.txt` - Variáveis da aplicação
- `supabase-env-completo.txt` - Variáveis do Supabase

### **Templates:**
- `env.example` - Template básico
- `nagent-app-env-essencial.txt` - Variáveis essenciais

---

## ✅ CHECKLIST DE VALIDAÇÃO

### **Antes do Deploy:**
- [ ] Todas as variáveis obrigatórias estão definidas
- [ ] Secrets são consistentes entre ambientes
- [ ] URLs estão corretas para cada ambiente
- [ ] Chaves de API estão configuradas
- [ ] Senhas são fortes e não são genéricas

### **Após o Deploy:**
- [ ] Aplicação acessível na URL correta
- [ ] Supabase funcionando sem erros de senha
- [ ] Chat funcionando
- [ ] Upload de documentos funcionando
- [ ] Logs sem erros de autenticação

---

## 🚨 IMPORTANTE

1. **NUNCA** commite chaves reais no Git
2. **SEMPRE** use placeholders em arquivos de exemplo
3. **MANTENHA** consistência entre ambientes
4. **DOCUMENTE** mudanças nas variáveis
5. **TESTE** em ambiente local antes da produção
