import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function setupRAGSchema() {
  try {
    console.log('🔧 Configurando schema RAG no Supabase...')

    // 1. Criar tabela documents
    const { error: documentsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS documents (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          file_path TEXT,
          file_type TEXT,
          metadata JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (documentsError) {
      console.error('❌ Erro ao criar tabela documents:', documentsError)
      return false
    }

    // 2. Criar tabela chunks
    const { error: chunksError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS chunks (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
          content TEXT NOT NULL,
          metadata JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (chunksError) {
      console.error('❌ Erro ao criar tabela chunks:', chunksError)
      return false
    }

    // 3. Criar tabela embeddings
    const { error: embeddingsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS embeddings (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          chunk_id UUID REFERENCES chunks(id) ON DELETE CASCADE,
          embedding VECTOR(1536),
          model TEXT DEFAULT 'text-embedding-3-small',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (embeddingsError) {
      console.error('❌ Erro ao criar tabela embeddings:', embeddingsError)
      return false
    }

    // 4. Criar função match_chunks
    const { error: functionError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION match_chunks(
          query_embedding VECTOR(1536),
          match_threshold FLOAT DEFAULT 0.7,
          match_count INT DEFAULT 10
        )
        RETURNS TABLE (
          id UUID,
          content TEXT,
          metadata JSONB,
          similarity FLOAT
        )
        LANGUAGE plpgsql
        AS $$
        BEGIN
          RETURN QUERY
          SELECT 
            c.id,
            c.content,
            c.metadata,
            1 - (e.embedding <=> query_embedding) AS similarity
          FROM chunks c
          JOIN embeddings e ON c.id = e.chunk_id
          WHERE 1 - (e.embedding <=> query_embedding) > match_threshold
          ORDER BY e.embedding <=> query_embedding
          LIMIT match_count;
        END;
        $$;
      `
    })

    if (functionError) {
      console.error('❌ Erro ao criar função match_chunks:', functionError)
      return false
    }

    // 5. Criar índices para performance
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_embeddings_vector ON embeddings USING ivfflat (embedding vector_cosine_ops);
        CREATE INDEX IF NOT EXISTS idx_chunks_document_id ON chunks(document_id);
        CREATE INDEX IF NOT EXISTS idx_embeddings_chunk_id ON embeddings(chunk_id);
      `
    })

    if (indexError) {
      console.error('❌ Erro ao criar índices:', indexError)
      return false
    }

    console.log('✅ Schema RAG configurado com sucesso!')
    return true

  } catch (error) {
    console.error('❌ Erro ao configurar schema RAG:', error)
    return false
  }
}

export async function setupRLSPolicies() {
  try {
    console.log('🔒 Configurando políticas RLS...')

    // Habilitar RLS nas tabelas
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
        ALTER TABLE chunks ENABLE ROW LEVEL SECURITY;
        ALTER TABLE embeddings ENABLE ROW LEVEL SECURITY;
      `
    })

    if (rlsError) {
      console.error('❌ Erro ao habilitar RLS:', rlsError)
      return false
    }

    // Política para permitir leitura anônima (para RAG)
    const { error: policyError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Allow anonymous read access" ON documents
        FOR SELECT USING (true);

        CREATE POLICY "Allow anonymous read access" ON chunks
        FOR SELECT USING (true);

        CREATE POLICY "Allow anonymous read access" ON embeddings
        FOR SELECT USING (true);
      `
    })

    if (policyError) {
      console.error('❌ Erro ao criar políticas:', policyError)
      return false
    }

    console.log('✅ Políticas RLS configuradas com sucesso!')
    return true

  } catch (error) {
    console.error('❌ Erro ao configurar políticas RLS:', error)
    return false
  }
}

export async function initializeDatabase() {
  const schemaSuccess = await setupRAGSchema()
  const rlsSuccess = await setupRLSPolicies()
  
  return schemaSuccess && rlsSuccess
}
