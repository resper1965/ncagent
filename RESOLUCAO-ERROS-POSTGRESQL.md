# Resolução dos Erros de Senha do PostgreSQL

## 🔍 Problema Identificado

Os logs mostram erros de autenticação do PostgreSQL:
```
FATAL 28P01 (invalid_password) password authentication failed for user "supabase_admin"
```

## 🎯 Causa Raiz

As variáveis de ambiente do Supabase não estão configuradas corretamente no Easypanel, especificamente:
- `POSTGRES_PASSWORD`
- `JWT_SECRET`
- `SECRET_KEY_BASE`
- `VAULT_ENC_KEY`

## ✅ Solução

### 1. Aplicar Variáveis no Container do Supabase

Copie todas as variáveis do arquivo `supabase-env-completo.txt` para o container do Supabase no Easypanel.

**Variáveis CRÍTICAS:**
```
POSTGRES_PASSWORD=nagent-supabase-pg-secure-2024-xyz789-abc123-def456
JWT_SECRET=nagent-jwt-secret-2024-xyz789-abc123-def456-ghi789
SECRET_KEY_BASE=nagent-secret-key-base-2024-xyz789-abc123-def456-ghi789-jkl012-mno345-pqr678
VAULT_ENC_KEY=nagent-vault-enc-key-32-chars
```

### 2. Aplicar Variáveis na Aplicação

Copie todas as variáveis do arquivo `nagent-app-env.txt` para o container da aplicação no Easypanel.

**Variáveis OBRIGATÓRIAS:**
```
NEXT_PUBLIC_SUPABASE_URL=https://nsecops-ness-supabase.pzgnh1.easypanel.host
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENAI_API_KEY=sk-proj-REPLACE_WITH_YOUR_ACTUAL_OPENAI_API_KEY
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=https://ncagent.ness.tec.br
```

### 3. Reiniciar Containers

Após aplicar as variáveis:
1. Reinicie o container do Supabase
2. Reinicie o container da aplicação
3. Aguarde alguns minutos para inicialização completa

### 4. Verificar Logs

Após a reinicialização, verifique se os logs mostram:
- ✅ "Database is ready"
- ✅ "Supabase is ready"
- ❌ Sem erros de "invalid_password"
- ❌ Sem erros de "authentication failed"

## 🔧 Passos no Easypanel

### Para o Container do Supabase:
1. Acesse o projeto no Easypanel
2. Vá para o container do Supabase
3. Clique em "Environment Variables"
4. Adicione todas as variáveis do `supabase-env-completo.txt`
5. Salve e reinicie o container

### Para o Container da Aplicação:
1. Acesse o projeto no Easypanel
2. Vá para o container da aplicação n.Agent
3. Clique em "Environment Variables"
4. Adicione todas as variáveis do `nagent-app-env.txt`
5. Salve e reinicie o container

## 🚨 Importante

- **NÃO** use as senhas genéricas como "your-super-secret..."
- **USE** as senhas fortes geradas nos arquivos
- **MANTENHA** as mesmas senhas entre local e produção
- **VERIFIQUE** se não há espaços extras nas variáveis

## 📋 Checklist de Verificação

- [ ] Variáveis do Supabase aplicadas
- [ ] Variáveis da aplicação aplicadas
- [ ] Containers reiniciados
- [ ] Logs sem erros de senha
- [ ] Aplicação acessível em https://ncagent.ness.tec.br
- [ ] Chat funcionando
- [ ] Upload de documentos funcionando

## 🔍 Troubleshooting

Se ainda houver problemas:

1. **Verifique se todas as variáveis foram aplicadas corretamente**
2. **Confirme se não há conflitos com variáveis antigas**
3. **Verifique se o container foi reiniciado completamente**
4. **Teste a conexão com o Supabase manualmente**
5. **Verifique se as URLs estão corretas**

## 📞 Suporte

Se o problema persistir após seguir todos os passos, verifique:
- Logs completos do Supabase
- Logs completos da aplicação
- Configuração de rede entre containers
- Permissões de acesso ao banco de dados
