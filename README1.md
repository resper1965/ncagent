# n.CISO - Plataforma de Gestão de Segurança da Informação

Plataforma completa para gestão de segurança da informação, políticas, controles e auditorias com sistema RAG (Retrieval Augmented Generation) integrado.

## 🚀 Tecnologias

- **Frontend**: Next.js 14, shadcn/ui, Tailwind CSS
- **Backend**: Supabase (Auth, Storage, Postgres + pgvector)
- **RAG**: LangChain, OpenAI Embeddings
- **Cache/Queues**: Redis, BullMQ
- **Monorepo**: Turbo (Turborepo)
- **Containerização**: Docker, Docker Compose
- **MCP**: Model Context Protocol para componentes dinâmicos

## 📋 Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- Supabase CLI (opcional)
- OpenAI API Key

## 🛠️ Instalação

### 1. Clone o repositório
```bash
git clone <repository-url>
cd nciso-platform
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
# Copie o arquivo de exemplo
cp apps/web/env.local.example apps/web/env.local

# Edite com suas configurações
nano apps/web/env.local
```

### 4. Configure o Supabase
```bash
# Opção 1: Usar Docker Compose (recomendado)
docker-compose up -d supabase redis

# Opção 2: Usar Supabase CLI local
chmod +x scripts/setup-supabase.sh
./scripts/setup-supabase.sh
```

## 🚀 Execução

### Desenvolvimento
```bash
# Desenvolvimento completo
npm run dev

# Apenas frontend
npm run dev --filter=web

# Apenas worker
npm run dev --filter=worker
```

### Produção com Docker
```bash
# Build e execução completa
docker-compose up --build

# Apenas aplicação
docker build -t nciso-platform .
docker run -p 3000:3000 nciso-platform
```

## 📊 Estrutura do Projeto

```
📁 n.CISO Platform
├── 📱 apps/
│   ├── web/          # Next.js Frontend
│   └── worker/       # BullMQ Worker
├── 📦 packages/
│   ├── rag/          # RAG Service
│   └── ui/           # shadcn/ui Components
├── 🗄️ db/           # Migrations e Schema
├── 📜 scripts/      # Scripts de automação
└── 🐳 Docker/       # Configurações Docker
```

## 🔧 APIs Disponíveis

### RAG System
- `POST /api/ask` - Fazer perguntas ao sistema RAG
- `GET /api/ask` - Status da API RAG

### Database
- `POST /api/init-db` - Inicializar banco de dados
- `GET /api/init-db` - Status da inicialização

### Health Check
- `GET /api/health` - Status da aplicação

### Document Management
- `POST /api/upload` - Upload de documentos
- `GET /api/documents` - Listar documentos
- `GET /api/versions` - Versões de documentos

## 🎯 Funcionalidades

### Sistema RAG
- ✅ Processamento de documentos (PDF, DOCX)
- ✅ Geração de embeddings com OpenAI
- ✅ Busca semântica com pgvector
- ✅ Respostas contextuais baseadas em documentos

### Gestão de Documentos
- ✅ Upload e processamento automático
- ✅ Versionamento de documentos
- ✅ Metadados e classificação
- ✅ Busca e filtros avançados

### Interface Moderna
- ✅ Design responsivo com Tailwind CSS
- ✅ Componentes shadcn/ui
- ✅ MCP para componentes dinâmicos
- ✅ Tema claro/escuro

## 🔐 Configuração de Segurança

### Variáveis de Ambiente Obrigatórias
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Redis
REDIS_URL=redis://localhost:6379
```

### Políticas de Segurança
- RLS (Row Level Security) habilitado
- Autenticação JWT
- Rate limiting nas APIs
- Validação de entrada com Zod

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes de integração
npm run test:integration

# Testes E2E
npm run test:e2e
```

## 📈 Monitoramento

### Health Checks
- `/api/health` - Status da aplicação
- Health checks automáticos no Docker
- Logs estruturados

### Métricas
- Latência de resposta RAG
- Taxa de sucesso de uploads
- Uso de recursos

## 🚀 Deploy

### Docker
```bash
# Build da imagem
docker build -t nciso-platform .

# Execução
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL \
  -e SUPABASE_SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY \
  nciso-platform
```

### Docker Compose
```bash
# Execução completa
docker-compose up --build

# Apenas serviços específicos
docker-compose up app worker
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

- **Documentação**: [Wiki do Projeto](wiki-url)
- **Issues**: [GitHub Issues](issues-url)
- **Discord**: [Canal de Suporte](discord-url)

## 🏆 Status do Projeto

- ✅ **Build**: Funcionando
- ✅ **Docker**: Configurado
- ✅ **Supabase**: Integrado
- ✅ **RAG**: Implementado
- ✅ **APIs**: Funcionais
- 🔄 **Testes**: Em desenvolvimento
- 🔄 **CI/CD**: Em desenvolvimento

---

**Desenvolvido com ❤️ pela equipe n.CISO**
