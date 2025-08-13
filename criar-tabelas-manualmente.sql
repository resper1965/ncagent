-- ========================================
-- SCRIPT SQL PARA CRIAR TABELAS NO SUPABASE
-- ========================================
-- Execute este script no Dashboard do Supabase > SQL Editor

-- ========================================
-- 1. CRIAR SCHEMA NCMD
-- ========================================
CREATE SCHEMA IF NOT EXISTS ncmd;

-- ========================================
-- 2. TABELA PRODUCT_VERSIONS (necessária para health check)
-- ========================================
CREATE TABLE IF NOT EXISTS ncmd.product_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    version VARCHAR(50) NOT NULL,
    description TEXT,
    release_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir dados iniciais
INSERT INTO ncmd.product_versions (product_name, version, description)
VALUES 
    ('n.cagent', '1.0.0', 'Versão inicial do n.cagent'),
    ('n.secops', '1.0.0', 'Versão inicial do n.secops')
ON CONFLICT DO NOTHING;

-- ========================================
-- 3. TABELAS DE CONVERSAÇÃO (conversation-memory.sql)
-- ========================================

-- Tabela de Sessões de Conversação
CREATE TABLE IF NOT EXISTS conversation_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID, -- Opcional, para futuras implementações de autenticação
    title VARCHAR(255) NOT NULL,
    agent_used VARCHAR(100), -- Agente principal usado na sessão
    agent_ids TEXT[], -- Array de IDs dos agentes (para múltiplos agentes)
    message_count INTEGER DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Mensagens de Conversação
CREATE TABLE IF NOT EXISTS conversation_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES conversation_sessions(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    agent_used VARCHAR(100), -- Agente que respondeu (para mensagens do assistant)
    agent_ids TEXT[], -- Array de IDs dos agentes (para múltiplos agentes)
    type VARCHAR(20) CHECK (type IN ('single_agent', 'multi_agent', 'default')),
    metadata JSONB, -- Metadados adicionais (fontes, confiança, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Resumos de Conversação (cache para otimização)
CREATE TABLE IF NOT EXISTS conversation_summaries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES conversation_sessions(id) ON DELETE CASCADE,
    summary TEXT NOT NULL,
    key_topics TEXT[],
    message_count_at_summary INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Preferências do Usuário (cache)
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES conversation_sessions(id) ON DELETE CASCADE,
    expertise_level VARCHAR(50),
    interests TEXT[],
    communication_style VARCHAR(100),
    response_format VARCHAR(100),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 4. TABELAS DE AGENTES (agent-system.sql)
-- ========================================

-- Tabela de Agentes
CREATE TABLE IF NOT EXISTS agents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Tabela de Datasets dos Agentes
CREATE TABLE IF NOT EXISTS agent_datasets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('knowledge', 'examples', 'procedures', 'context')),
    priority INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 5. TABELAS DE DOCUMENTOS E CHUNKS
-- ========================================

-- Tabela de Documentos
CREATE TABLE IF NOT EXISTS documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB,
    agent_id UUID REFERENCES agents(id),
    is_agent_specific BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Chunks (para RAG)
CREATE TABLE IF NOT EXISTS chunks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    metadata JSONB,
    embedding vector(1536), -- Para embeddings da OpenAI
    chunk_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 6. ÍNDICES PARA PERFORMANCE
-- ========================================

-- Índices para conversation_sessions
CREATE INDEX IF NOT EXISTS idx_conversation_sessions_user_id ON conversation_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_sessions_last_activity ON conversation_sessions(last_activity);
CREATE INDEX IF NOT EXISTS idx_conversation_sessions_agent_used ON conversation_sessions(agent_used);

-- Índices para conversation_messages
CREATE INDEX IF NOT EXISTS idx_conversation_messages_session_id ON conversation_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_created_at ON conversation_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_role ON conversation_messages(role);

-- Índices para conversation_summaries
CREATE INDEX IF NOT EXISTS idx_conversation_summaries_session_id ON conversation_summaries(session_id);

-- Índices para user_preferences
CREATE INDEX IF NOT EXISTS idx_user_preferences_session_id ON user_preferences(session_id);

-- Índices para agents
CREATE INDEX IF NOT EXISTS idx_agents_active ON agents(is_active);
CREATE INDEX IF NOT EXISTS idx_agents_name ON agents(name);

-- Índices para agent_datasets
CREATE INDEX IF NOT EXISTS idx_agent_datasets_agent_id ON agent_datasets(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_datasets_active ON agent_datasets(is_active);
CREATE INDEX IF NOT EXISTS idx_agent_datasets_category ON agent_datasets(category);

-- Índices para documents
CREATE INDEX IF NOT EXISTS idx_documents_agent_id ON documents(agent_id);

-- Índices para chunks
CREATE INDEX IF NOT EXISTS idx_chunks_document_id ON chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_chunks_embedding ON chunks USING ivfflat (embedding vector_cosine_ops);

-- ========================================
-- 7. FUNÇÕES E TRIGGERS
-- ========================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_conversation_sessions_updated_at 
    BEFORE UPDATE ON conversation_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at 
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agents_updated_at 
    BEFORE UPDATE ON agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_datasets_updated_at 
    BEFORE UPDATE ON agent_datasets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at 
    BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 8. BUCKETS DE STORAGE
-- ========================================
-- Execute no Storage do Supabase:
-- 1. Vá em Storage > Create bucket
-- 2. Nome: "documents"
-- 3. Public: false
-- 4. File size limit: 50MB
-- 5. Allowed MIME types: application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document

-- ========================================
-- 9. POLÍTICAS RLS (Row Level Security)
-- ========================================
-- Execute estas políticas no Authentication > Policies:

-- Habilitar RLS nas tabelas
ALTER TABLE conversation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE chunks ENABLE ROW LEVEL SECURITY;

-- Política para permitir acesso anônimo (temporário)
CREATE POLICY "Allow anonymous access" ON conversation_sessions FOR ALL USING (true);
CREATE POLICY "Allow anonymous access" ON conversation_messages FOR ALL USING (true);
CREATE POLICY "Allow anonymous access" ON conversation_summaries FOR ALL USING (true);
CREATE POLICY "Allow anonymous access" ON user_preferences FOR ALL USING (true);
CREATE POLICY "Allow anonymous access" ON agents FOR ALL USING (true);
CREATE POLICY "Allow anonymous access" ON agent_datasets FOR ALL USING (true);
CREATE POLICY "Allow anonymous access" ON documents FOR ALL USING (true);
CREATE POLICY "Allow anonymous access" ON chunks FOR ALL USING (true);

-- ========================================
-- 10. VERIFICAÇÃO FINAL
-- ========================================
-- Execute para verificar se tudo foi criado:
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname IN ('public', 'ncmd')
ORDER BY schemaname, tablename;
