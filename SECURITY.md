# 🔐 Segurança e Credenciais - n.Agent

## 📁 Estrutura de Segurança

### Diretório `.secrets/`
Este diretório contém todas as credenciais e chaves reais do projeto. **NUNCA** deve ser commitado no Git.

```
.secrets/
├── nagent-app-env.txt              # Variáveis da aplicação (produção)
├── nagent-app-env-essencial.txt    # Variáveis essenciais da aplicação
├── supabase-env-completo.txt       # Todas as variáveis do Supabase
├── config.env                      # Configurações gerais
└── [outros arquivos de credenciais]
```

### Arquivos de Exemplo
- `env.example` - Template para variáveis da aplicação
- `supabase.env.example` - Template para variáveis do Supabase

## 🚨 Regras de Segurança

### ✅ O QUE FAZER:
1. **Sempre use placeholders** nos arquivos de exemplo
2. **Mantenha credenciais reais** apenas no diretório `.secrets/`
3. **Use variáveis de ambiente** no Easypanel/Produção
4. **Documente mudanças** de credenciais

### ❌ O QUE NÃO FAZER:
1. **NUNCA commite** arquivos com credenciais reais
2. **NUNCA exponha** chaves de API no código
3. **NUNCA use** credenciais hardcoded
4. **NUNCA compartilhe** arquivos do `.secrets/`

## 🔧 Configuração de Ambientes

### Desenvolvimento Local
```bash
# Copie o arquivo de exemplo
cp env.example .env

# Preencha com suas credenciais locais
# (não commite o .env)
```

### Produção (Easypanel)
1. Acesse o painel do Easypanel
2. Configure as variáveis de ambiente
3. Use os valores do arquivo `.secrets/nagent-app-env.txt`

### Supabase
1. Configure as variáveis no container do Supabase
2. Use os valores do arquivo `.secrets/supabase-env-completo.txt`

## 🔄 Atualização de Credenciais

### Quando atualizar credenciais:
1. **Atualize** o arquivo correspondente em `.secrets/`
2. **Atualize** o arquivo de exemplo se necessário
3. **Aplique** as mudanças no ambiente de produção
4. **Documente** a mudança neste arquivo

### Exemplo de atualização:
```bash
# 1. Atualizar arquivo de credenciais
vim .secrets/nagent-app-env.txt

# 2. Aplicar no Easypanel
# (via interface web)

# 3. Reiniciar containers
# (se necessário)
```

## 📋 Checklist de Segurança

- [ ] Todas as credenciais estão em `.secrets/`
- [ ] Arquivos de exemplo usam placeholders
- [ ] `.gitignore` inclui `.secrets/` e arquivos sensíveis
- [ ] Variáveis de produção configuradas no Easypanel
- [ ] Nenhuma credencial exposta no código
- [ ] Documentação atualizada

## 🆘 Em caso de comprometimento

1. **Revogue imediatamente** todas as chaves expostas
2. **Gere novas credenciais** para todos os serviços
3. **Atualize** arquivos em `.secrets/`
4. **Aplique** mudanças em produção
5. **Monitore** logs por atividades suspeitas
6. **Documente** o incidente e ações tomadas

---

**Última atualização:** $(date)
**Responsável:** Equipe de Desenvolvimento
