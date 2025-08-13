-- Sistema de Memória Conversacional para n.Agent
-- Garante fluidez e contexto persistente nas conversas

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

-- Índices para Performance
CREATE INDEX IF NOT EXISTS idx_conversation_sessions_user_id ON conversation_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_sessions_last_activity ON conversation_sessions(last_activity);
CREATE INDEX IF NOT EXISTS idx_conversation_sessions_agent_used ON conversation_sessions(agent_used);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_session_id ON conversation_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_created_at ON conversation_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_role ON conversation_messages(role);
CREATE INDEX IF NOT EXISTS idx_conversation_summaries_session_id ON conversation_summaries(session_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_session_id ON user_preferences(session_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_conversation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_conversation_sessions_updated_at 
    BEFORE UPDATE ON conversation_sessions
    FOR EACH ROW EXECUTE FUNCTION update_conversation_updated_at();

CREATE TRIGGER update_user_preferences_updated_at 
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_conversation_updated_at();

-- Função para limpar sessões antigas automaticamente
CREATE OR REPLACE FUNCTION cleanup_old_conversations(days_old INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM conversation_sessions 
    WHERE last_activity < NOW() - INTERVAL '1 day' * days_old;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Função para obter contexto otimizado de uma sessão
CREATE OR REPLACE FUNCTION get_conversation_context(
    session_id_param UUID,
    max_messages INTEGER DEFAULT 20
)
RETURNS TABLE (
    message_id UUID,
    role VARCHAR(20),
    content TEXT,
    agent_used VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cm.id,
        cm.role,
        cm.content,
        cm.agent_used,
        cm.created_at
    FROM conversation_messages cm
    WHERE cm.session_id = session_id_param
    ORDER BY cm.created_at DESC
    LIMIT max_messages;
END;
$$ LANGUAGE plpgsql;

-- Função para obter estatísticas de conversação
CREATE OR REPLACE FUNCTION get_conversation_stats(session_id_param UUID)
RETURNS TABLE (
    total_messages INTEGER,
    user_messages INTEGER,
    assistant_messages INTEGER,
    first_message_at TIMESTAMP WITH TIME ZONE,
    last_message_at TIMESTAMP WITH TIME ZONE,
    session_duration INTERVAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_messages,
        COUNT(*) FILTER (WHERE role = 'user')::INTEGER as user_messages,
        COUNT(*) FILTER (WHERE role = 'assistant')::INTEGER as assistant_messages,
        MIN(created_at) as first_message_at,
        MAX(created_at) as last_message_at,
        MAX(created_at) - MIN(created_at) as session_duration
    FROM conversation_messages
    WHERE session_id = session_id_param;
END;
$$ LANGUAGE plpgsql;

-- Função para buscar sessões por agente
CREATE OR REPLACE FUNCTION find_sessions_by_agent(agent_name VARCHAR(100))
RETURNS TABLE (
    session_id UUID,
    title VARCHAR(255),
    message_count INTEGER,
    last_activity TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cs.id,
        cs.title,
        cs.message_count,
        cs.last_activity,
        cs.created_at
    FROM conversation_sessions cs
    WHERE cs.agent_used = agent_name
    ORDER BY cs.last_activity DESC;
END;
$$ LANGUAGE plpgsql;

-- Política de retenção de dados (opcional)
-- Comentário: Esta função pode ser chamada por um cron job para limpeza automática
COMMENT ON FUNCTION cleanup_old_conversations(INTEGER) IS 
'Limpa sessões de conversação antigas. Use com cuidado em produção.';

-- Comentários para documentação
COMMENT ON TABLE conversation_sessions IS 'Sessões de conversação com agentes';
COMMENT ON TABLE conversation_messages IS 'Mensagens individuais de cada conversa';
COMMENT ON TABLE conversation_summaries IS 'Resumos de conversas para otimização de contexto';
COMMENT ON TABLE user_preferences IS 'Preferências extraídas das conversas do usuário';

COMMENT ON COLUMN conversation_sessions.agent_ids IS 'Array de IDs dos agentes usados na sessão';
COMMENT ON COLUMN conversation_messages.metadata IS 'Metadados como fontes, confiança, etc.';
COMMENT ON COLUMN conversation_summaries.key_topics IS 'Tópicos-chave identificados na conversa';
COMMENT ON COLUMN user_preferences.expertise_level IS 'Nível de expertise detectado (iniciante, intermediário, avançado)';

-- Índices adicionais para otimização de consultas específicas
CREATE INDEX IF NOT EXISTS idx_conversation_messages_session_role ON conversation_messages(session_id, role);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_agent_used ON conversation_messages(agent_used);
CREATE INDEX IF NOT EXISTS idx_conversation_sessions_created_at ON conversation_sessions(created_at);

-- Função para obter histórico de conversas de um usuário (futuro)
CREATE OR REPLACE FUNCTION get_user_conversation_history(user_id_param UUID, limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    session_id UUID,
    title VARCHAR(255),
    agent_used VARCHAR(100),
    message_count INTEGER,
    last_activity TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cs.id,
        cs.title,
        cs.agent_used,
        cs.message_count,
        cs.last_activity
    FROM conversation_sessions cs
    WHERE cs.user_id = user_id_param
    ORDER BY cs.last_activity DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
