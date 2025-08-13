# Sistema de Agentes n.Agent - Arquitetura BMAD

## Visão Geral

O n.Agent agora implementa um sistema de agentes customizáveis baseado no padrão **BMAD (Business Model Architecture Design)**, permitindo múltiplos agentes especializados com personalidades, conhecimentos e comportamentos únicos.

## 🎯 Objetivos do Sistema

1. **Múltiplos Agentes**: Diferentes personalidades e especializações
2. **Datasets Customizáveis**: Conhecimento específico para cada agente
3. **Personalização**: Comportamento e comunicação únicos
4. **Escalabilidade**: Fácil adição de novos agentes
5. **Integração**: Compatível com o sistema RAG existente

## 🏗️ Arquitetura

### Componentes Principais

#### 1. **AgentSystem** (`apps/web/src/lib/agent-system.ts`)
- **Responsabilidade**: Gerenciamento central de agentes
- **Funcionalidades**:
  - CRUD de agentes
  - Gerenciamento de datasets
  - Processamento de perguntas com agentes
  - Geração de respostas personalizadas

#### 2. **APIs RESTful**
- `/api/agents` - CRUD de agentes
- `/api/agents/[id]` - Operações específicas por agente
- `/api/agents/[id]/datasets` - Gerenciamento de datasets
- `/api/chat` - Chat com suporte a agentes

#### 3. **Interface de Usuário**
- `/agents` - Gerenciamento de agentes
- `/ask` - Chat com seleção de agentes
- Componentes reutilizáveis

#### 4. **Banco de Dados**
- `agents` - Tabela de agentes
- `agent_datasets` - Datasets de conhecimento
- `documents` - Extensão para suporte a agentes

## 📊 Estrutura de Dados

### AgentPersona
```typescript
interface AgentPersona {
  id: string
  name: string                    // Nome do agente
  title: string                   // Título/cargo
  icon: string                    // Emoji/ícone
  description: string             // Descrição geral
  role: string                    // Papel no sistema
  style: string                   // Estilo de comunicação
  identity: string                // Identidade profissional
  focus: string                   // Área de foco
  core_principles: string[]       // Princípios fundamentais
  expertise_areas: string[]       // Áreas de expertise
  communication_style: string     // Estilo de comunicação
  response_format: string         // Formato de resposta
  is_active: boolean              // Status ativo
  created_at: string
  updated_at: string
}
```

### AgentDataset
```typescript
interface AgentDataset {
  id: string
  agent_id: string               // Referência ao agente
  name: string                   // Nome do dataset
  description: string            // Descrição
  content: string                // Conteúdo do conhecimento
  category: 'knowledge' | 'examples' | 'procedures' | 'context'
  priority: number               // Prioridade de uso
  is_active: boolean
  created_at: string
  updated_at: string
}
```

## 🤖 Agentes Padrão (Baseados no BMAD)

### 1. **João - Product Manager** 📋
- **Especialização**: Estratégia de produto e análise de mercado
- **Estilo**: Analítico e estratégico
- **Foco**: PRDs, roadmap, análise de usuários
- **Princípios**: Foco no usuário, dados, priorização

### 2. **Maria - Technical Architect** 🏗️
- **Especialização**: Arquitetura de sistemas e design técnico
- **Estilo**: Sistemático e detalhista
- **Foco**: Arquiteturas, decisões técnicas, escalabilidade
- **Princípios**: Performance, manutenibilidade, segurança

### 3. **Ana - UX Expert** 🎨
- **Especialização**: Experiência do usuário e design
- **Estilo**: Criativo e empático
- **Foco**: Interfaces, usabilidade, acessibilidade
- **Princípios**: Design centrado no usuário, inclusividade

## 🔄 Fluxo de Processamento

### 1. **Seleção de Agente**
```
Usuário seleciona agente → Interface atualiza → Contexto do agente carregado
```

### 2. **Processamento de Pergunta**
```
Pergunta → Busca conhecimento específico → Gera prompt personalizado → Resposta do agente
```

### 3. **Geração de Resposta**
```
Contexto do agente + Conhecimento + Pergunta → Prompt personalizado → OpenAI → Resposta formatada
```

## 🎨 Interface do Usuário

### Página de Gerenciamento (`/agents`)
- **Lista de Agentes**: Visualização e seleção
- **Detalhes do Agente**: Informações completas
- **Datasets**: Gerenciamento de conhecimento
- **Criação/Edição**: Formulários para customização

### Chat com Agentes (`/ask`)
- **Seletor de Agente**: Dropdown com agentes disponíveis
- **Indicador Visual**: Ícone e nome do agente ativo
- **Respostas Personalizadas**: Estilo único por agente
- **Histórico**: Manutenção do contexto

## 🗄️ Banco de Dados

### Tabelas Principais

#### `agents`
```sql
CREATE TABLE agents (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    icon VARCHAR(10) NOT NULL,
    description TEXT NOT NULL,
    role TEXT NOT NULL,
    style TEXT NOT NULL,
    identity TEXT NOT NULL,
    focus TEXT NOT NULL,
    core_principles TEXT[] NOT NULL,
    expertise_areas TEXT[] NOT NULL,
    communication_style TEXT NOT NULL,
    response_format TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `agent_datasets`
```sql
CREATE TABLE agent_datasets (
    id UUID PRIMARY KEY,
    agent_id UUID REFERENCES agents(id),
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) CHECK (category IN ('knowledge', 'examples', 'procedures', 'context')),
    priority INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🚀 Como Usar

### 1. **Criar um Novo Agente**
```typescript
const newAgent = await agentSystem.createAgent({
  name: "Carlos",
  title: "Data Scientist",
  icon: "📊",
  description: "Especialista em análise de dados e machine learning",
  role: "Data Analysis Expert",
  style: "Analytical, data-driven, methodical",
  identity: "Data Scientist focused on insights and predictions",
  focus: "Data analysis, ML models, statistical insights",
  core_principles: [
    "Data-driven decisions",
    "Statistical rigor",
    "Clear visualization"
  ],
  expertise_areas: [
    "Machine Learning",
    "Statistical Analysis",
    "Data Visualization"
  ],
  communication_style: "Técnico com explicações claras",
  response_format: "Análise com gráficos e insights",
  is_active: true
});
```

### 2. **Adicionar Dataset**
```typescript
const dataset = await agentSystem.addDatasetToAgent(agentId, {
  name: "ML Best Practices",
  description: "Melhores práticas em machine learning",
  content: "Conteúdo sobre ML...",
  category: "knowledge",
  priority: 1,
  is_active: true
});
```

### 3. **Usar no Chat**
```typescript
const response = await agentSystem.processQuestionWithAgent(
  "Como implementar um modelo de ML?",
  agentId,
  {
    conversation_history: [],
    user_preferences: {},
    max_tokens: 1000
  }
);
```

## 🔧 Configuração e Deploy

### 1. **Executar Script SQL**
```bash
# No Supabase SQL Editor
\i db/agent-system.sql
```

### 2. **Verificar Tabelas**
```sql
SELECT * FROM agents;
SELECT * FROM agent_datasets;
```

### 3. **Testar APIs**
```bash
# Listar agentes
curl https://ncagent.ness.tec.br/api/agents

# Criar agente
curl -X POST https://ncagent.ness.tec.br/api/agents \
  -H "Content-Type: application/json" \
  -d '{"name": "Teste", ...}'
```

## 🎯 Benefícios

### Para Usuários
- **Especialização**: Respostas mais precisas por área
- **Personalização**: Experiência única por agente
- **Flexibilidade**: Escolha do agente adequado

### Para Desenvolvedores
- **Modularidade**: Fácil adição de novos agentes
- **Escalabilidade**: Sistema preparado para crescimento
- **Manutenibilidade**: Código organizado e documentado

### Para o Negócio
- **Diferenciação**: Funcionalidade única no mercado
- **Engajamento**: Experiência mais rica para usuários
- **Expansão**: Base para novos recursos

## 🔮 Próximos Passos

### Fase 1 - Implementação Básica ✅
- [x] Sistema de agentes
- [x] APIs RESTful
- [x] Interface de gerenciamento
- [x] Chat com seleção de agentes

### Fase 2 - Funcionalidades Avançadas
- [ ] Modais de criação/edição de agentes
- [ ] Upload de datasets via arquivo
- [ ] Templates de agentes
- [ ] Análise de performance por agente

### Fase 3 - Expansão
- [ ] Agentes especializados por domínio
- [ ] Integração com ferramentas externas
- [ ] Sistema de plugins
- [ ] Marketplace de agentes

## 📚 Referências

- **BMAD Method**: Framework para desenvolvimento com IA
- **LangChain**: Framework para aplicações de IA
- **Supabase**: Backend-as-a-Service
- **Next.js**: Framework React para produção

---

*Este sistema transforma o n.Agent de um assistente simples em uma plataforma de agentes especializados, seguindo as melhores práticas do padrão BMAD.*
