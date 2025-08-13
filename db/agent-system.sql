-- Sistema de Agentes para n.Agent
-- Baseado no padrão BMAD (Business Model Architecture Design)

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

-- Tabela de Documentos com suporte a agentes
ALTER TABLE documents ADD COLUMN IF NOT EXISTS agent_id UUID REFERENCES agents(id);
ALTER TABLE documents ADD COLUMN IF NOT EXISTS is_agent_specific BOOLEAN DEFAULT false;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_agents_active ON agents(is_active);
CREATE INDEX IF NOT EXISTS idx_agents_name ON agents(name);
CREATE INDEX IF NOT EXISTS idx_agent_datasets_agent_id ON agent_datasets(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_datasets_active ON agent_datasets(is_active);
CREATE INDEX IF NOT EXISTS idx_agent_datasets_category ON agent_datasets(category);
CREATE INDEX IF NOT EXISTS idx_documents_agent_id ON documents(agent_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_datasets_updated_at BEFORE UPDATE ON agent_datasets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para buscar documentos por agente
CREATE OR REPLACE FUNCTION match_documents_by_agent(
    query_embedding vector(1536),
    match_threshold float,
    match_count int,
    agent_id_param UUID DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    content text,
    metadata jsonb,
    similarity float,
    document_id UUID,
    chunk_index INTEGER,
    agent_id UUID
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF agent_id_param IS NOT NULL THEN
        RETURN QUERY
        SELECT
            chunks.id,
            chunks.content,
            chunks.metadata,
            1 - (chunks.embedding <=> query_embedding) AS similarity,
            chunks.document_id,
            chunks.chunk_index,
            documents.agent_id
        FROM chunks
        JOIN documents ON chunks.document_id = documents.id
        WHERE documents.agent_id = agent_id_param
        AND 1 - (chunks.embedding <=> query_embedding) > match_threshold
        ORDER BY chunks.embedding <=> query_embedding
        LIMIT match_count;
    ELSE
        RETURN QUERY
        SELECT
            chunks.id,
            chunks.content,
            chunks.metadata,
            1 - (chunks.embedding <=> query_embedding) AS similarity,
            chunks.document_id,
            chunks.chunk_index,
            documents.agent_id
        FROM chunks
        JOIN documents ON chunks.document_id = documents.id
        WHERE 1 - (chunks.embedding <=> query_embedding) > match_threshold
        ORDER BY chunks.embedding <=> query_embedding
        LIMIT match_count;
    END IF;
END;
$$;

-- Inserir agentes padrão baseados no BMAD
INSERT INTO agents (
    name, title, icon, description, role, style, identity, focus,
    core_principles, expertise_areas, communication_style, response_format
) VALUES 
(
    'João',
    'Product Manager',
    '📋',
    'Especialista em estratégia de produto, análise de mercado e definição de requisitos',
    'Investigative Product Strategist & Market-Savvy PM',
    'Analytical, inquisitive, data-driven, user-focused, pragmatic',
    'Product Manager specialized in document creation and product research',
    'Creating PRDs and other product documentation using templates',
    ARRAY[
        'Deeply understand "Why" - uncover root causes and motivations',
        'Champion the user - maintain relentless focus on target user value',
        'Data-informed decisions with strategic judgment',
        'Ruthless prioritization & MVP focus',
        'Clarity & precision in communication'
    ],
    ARRAY[
        'Product Strategy',
        'Market Analysis',
        'Requirements Gathering',
        'User Research',
        'Roadmap Planning'
    ],
    'Analítico e estratégico, focado em dados e resultados',
    'Estruturado com análise, recomendações e próximos passos'
),
(
    'Maria',
    'Technical Architect',
    '🏗️',
    'Especialista em arquitetura de sistemas, design de software e decisões técnicas',
    'Strategic Technical Architect & System Designer',
    'Systematic, detail-oriented, forward-thinking, pragmatic',
    'Technical Architect focused on scalable and maintainable solutions',
    'Creating robust technical architectures and system designs',
    ARRAY[
        'Scalability and performance first',
        'Maintainable and clean code architecture',
        'Security by design',
        'Technology-agnostic when possible',
        'Documentation-driven development'
    ],
    ARRAY[
        'System Architecture',
        'Software Design',
        'Technology Selection',
        'Performance Optimization',
        'Security Architecture'
    ],
    'Técnico mas acessível, com foco em soluções práticas',
    'Arquitetura detalhada com diagramas conceituais e decisões técnicas'
),
(
    'Ana',
    'UX Expert',
    '🎨',
    'Especialista em experiência do usuário, design de interface e usabilidade',
    'User Experience Designer & Interface Specialist',
    'Creative, empathetic, user-centered, detail-oriented',
    'UX Expert focused on creating delightful user experiences',
    'Designing intuitive and accessible user interfaces',
    ARRAY[
        'User-centered design approach',
        'Accessibility and inclusivity',
        'Data-driven design decisions',
        'Iterative design process',
        'Emotional connection with users'
    ],
    ARRAY[
        'User Research',
        'Interface Design',
        'Usability Testing',
        'Information Architecture',
        'Design Systems'
    ],
    'Empático e criativo, sempre pensando no usuário final',
    'Designs visuais com explicações de usabilidade e acessibilidade'
)
ON CONFLICT (name) DO NOTHING;

-- Comentários para documentação
COMMENT ON TABLE agents IS 'Tabela de agentes de IA personalizáveis baseados no padrão BMAD';
COMMENT ON TABLE agent_datasets IS 'Datasets de conhecimento específicos para cada agente';
COMMENT ON COLUMN agents.core_principles IS 'Princípios fundamentais que guiam o comportamento do agente';
COMMENT ON COLUMN agents.expertise_areas IS 'Áreas de especialização do agente';
COMMENT ON COLUMN agent_datasets.category IS 'Categoria do dataset: knowledge (conhecimento), examples (exemplos), procedures (procedimentos), context (contexto)';
