# Estrutura do Projeto n.agent

## Visão Geral
Projeto monorepo usando Turbo para gerenciar múltiplas aplicações Next.js.

## Estrutura de Diretórios

### Raiz do Projeto (`/home/ncAgent`)
```
ncAgent/
├── apps/                    # Aplicações do monorepo
│   ├── web/                # Aplicação Next.js principal
│   └── worker/             # Worker para processamento de documentos
├── packages/               # Pacotes compartilhados
├── scripts/                # Scripts de automação
├── db/                     # Configurações de banco de dados
├── Dockerfile              # Dockerfile principal para produção
├── docker-compose.yml      # Configuração Docker Compose
├── package.json            # Configuração root do monorepo
├── turbo.json              # Configuração Turbo
└── deploy.sh               # Script de deploy
```

### Aplicação Web (`apps/web/`)
```
apps/web/
├── src/                    # Código fonte
│   ├── app/               # App Router do Next.js 14
│   │   ├── page.tsx       # Página principal
│   │   ├── layout.tsx     # Layout raiz
│   │   ├── globals.css    # Estilos globais
│   │   ├── ask/           # Página de chat
│   │   ├── upload/        # Página de upload
│   │   ├── documents/     # Página de documentos
│   │   └── api/           # API routes
│   ├── components/        # Componentes React
│   │   └── ui/           # Componentes shadcn/ui
│   └── lib/              # Utilitários e serviços
├── .next/                 # Build do Next.js
├── next.config.js         # Configuração Next.js
├── tailwind.config.js     # Configuração Tailwind CSS
├── components.json        # Configuração shadcn/ui
└── package.json           # Dependências da aplicação web
```

### Aplicação Worker (`apps/worker/`)
```
apps/worker/
├── src/                   # Código fonte do worker
│   └── index.ts          # Entry point do worker
├── package.json          # Dependências do worker
└── Dockerfile            # Dockerfile do worker
```

## Configurações Importantes

### Next.js (`apps/web/next.config.js`)
- `output: 'standalone'` - Gera build standalone para Docker
- Headers CORS configurados para APIs
- Domínios de imagem configurados

### Docker
- **Dockerfile Principal**: `/Dockerfile` - Build da aplicação web
- **Docker Compose**: `/docker-compose.yml` - Orquestração completa
- **Container Web**: `nsecops_ncagent:3000` (configurado no Easypanel)

### Deploy
- **Plataforma**: Easypanel na VPS
- **URL**: https://ncagent.ness.tec.br/
- **Trigger**: Push para branch `main` no GitHub
- **Build**: Docker build automático via Easypanel

## Problemas Conhecidos

### 1. Build Standalone
- **Problema**: Diretório `apps/web/.next/standalone/` não está sendo gerado
- **Causa**: Possível problema na configuração do Next.js
- **Impacto**: Container não consegue iniciar (502 Bad Gateway)

### 2. Assets CSS/JS
- **Problema**: Arquivos CSS/JS retornando 404
- **Causa**: Build não está gerando assets corretamente
- **Impacto**: Página sem estilos

### 3. Deploy
- **Problema**: Aplicação retornando 502 após deploy
- **Causa**: Container não consegue iniciar devido ao problema do standalone
- **Impacto**: Aplicação completamente fora do ar

## Próximos Passos

1. **Corrigir Build Standalone**: Verificar por que o Next.js não está gerando o diretório standalone
2. **Testar Localmente**: Garantir que o build funciona localmente antes do deploy
3. **Documentar APIs**: Documentar todas as rotas da API
4. **Configurar Monitoramento**: Implementar logs e monitoramento
5. **Otimizar Performance**: Configurar cache e otimizações

## Comandos Úteis

```bash
# Build local da aplicação web
cd apps/web && npm run build

# Verificar se o standalone foi gerado
ls -la apps/web/.next/standalone/

# Deploy manual
./deploy.sh

# Verificar status da aplicação
curl -I https://ncagent.ness.tec.br/
```
