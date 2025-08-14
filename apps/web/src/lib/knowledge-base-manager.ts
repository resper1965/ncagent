import { createClient } from '@supabase/supabase-js'

// Função para criar cliente Supabase com validação
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase configuration is missing. Please check environment variables.');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

export interface KnowledgeBase {
  id: string
  name: string
  version: string
  description: string
  is_active: boolean
  is_enabled_for_chat: boolean
  document_count: number
  chunk_count: number
  created_at: string
  updated_at: string
  metadata?: {
    tags?: string[]
    categories?: string[]
    priority?: number
    owner?: string
  }
}

export interface KnowledgeBaseQuery {
  query: string
  enabled_kbs: string[] // IDs das knowledge bases ativas
  version_filter?: string
  category_filter?: string[]
  max_results?: number
  similarity_threshold?: number
}

export interface KnowledgeBaseResult {
  content: string
  source_document: string
  knowledge_base: string
  version: string
  similarity: number
  metadata?: any
}

export class KnowledgeBaseManager {
  private supabase = createSupabaseClient()

  // Gerenciamento de Knowledge Bases
  async createKnowledgeBase(kbData: Omit<KnowledgeBase, 'id' | 'created_at' | 'updated_at'>): Promise<KnowledgeBase> {
    try {
      const { data, error } = await this.supabase
        .from('knowledge_bases')
        .insert({
          ...kbData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating knowledge base:', error)
      throw error
    }
  }

  async getKnowledgeBase(kbId: string): Promise<KnowledgeBase | null> {
    try {
      const { data, error } = await this.supabase
        .from('knowledge_bases')
        .select('*')
        .eq('id', kbId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching knowledge base:', error)
      return null
    }
  }

  async getAllKnowledgeBases(): Promise<KnowledgeBase[]> {
    try {
      const { data, error } = await this.supabase
        .from('knowledge_bases')
        .select('*')
        .order('version', { ascending: false })
        .order('name')

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching knowledge bases:', error)
      return []
    }
  }

  async getActiveKnowledgeBases(): Promise<KnowledgeBase[]> {
    try {
      const { data, error } = await this.supabase
        .from('knowledge_bases')
        .select('*')
        .eq('is_active', true)
        .eq('is_enabled_for_chat', true)
        .order('version', { ascending: false })
        .order('name')

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching active knowledge bases:', error)
      return []
    }
  }

  async updateKnowledgeBase(kbId: string, updates: Partial<KnowledgeBase>): Promise<KnowledgeBase | null> {
    try {
      const { data, error } = await this.supabase
        .from('knowledge_bases')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', kbId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating knowledge base:', error)
      return null
    }
  }

  async toggleKnowledgeBaseChat(kbId: string, enabled: boolean): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('knowledge_bases')
        .update({
          is_enabled_for_chat: enabled,
          updated_at: new Date().toISOString()
        })
        .eq('id', kbId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error toggling knowledge base chat:', error)
      return false
    }
  }

  async deleteKnowledgeBase(kbId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('knowledge_bases')
        .delete()
        .eq('id', kbId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting knowledge base:', error)
      return false
    }
  }

  // Busca Inteligente em Múltiplas Knowledge Bases
  async searchAcrossKnowledgeBases(query: KnowledgeBaseQuery): Promise<KnowledgeBaseResult[]> {
    try {
      const { query: searchQuery, enabled_kbs, max_results = 10, similarity_threshold = 0.7 } = query

      // Buscar em todas as knowledge bases habilitadas
      const results: KnowledgeBaseResult[] = []

      for (const kbId of enabled_kbs) {
        const kb = await this.getKnowledgeBase(kbId)
        if (!kb || !kb.is_enabled_for_chat) continue

        // Buscar chunks na knowledge base específica
        const { data: chunks, error } = await this.supabase
          .rpc('search_knowledge_base', {
            query_embedding: await this.generateEmbedding(searchQuery),
            knowledge_base_id: kbId,
            match_threshold: similarity_threshold,
            match_count: max_results
          })

        if (error) {
          console.error(`Error searching KB ${kbId}:`, error)
          continue
        }

        // Adicionar resultados com metadados da knowledge base
        const kbResults = (chunks || []).map((chunk: any) => ({
          content: chunk.content,
          source_document: chunk.document_title,
          knowledge_base: kb.name,
          version: kb.version,
          similarity: chunk.similarity,
          metadata: {
            kb_id: kbId,
            chunk_id: chunk.id,
            document_id: chunk.document_id,
            tags: kb.metadata?.tags || [],
            categories: kb.metadata?.categories || []
          }
        }))

        results.push(...kbResults)
      }

      // Ordenar por similaridade e limitar resultados
      return results
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, max_results)

    } catch (error) {
      console.error('Error searching across knowledge bases:', error)
      return []
    }
  }

  // Gerenciamento de Versões
  async getKnowledgeBasesByVersion(version: string): Promise<KnowledgeBase[]> {
    try {
      const { data, error } = await this.supabase
        .from('knowledge_bases')
        .select('*')
        .eq('version', version)
        .order('name')

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching knowledge bases by version:', error)
      return []
    }
  }

  async getAvailableVersions(): Promise<string[]> {
    try {
      const { data, error } = await this.supabase
        .from('knowledge_bases')
        .select('version')
        .order('version', { ascending: false })

      if (error) throw error
      
      // Remover duplicatas e retornar versões únicas
      const versions = [...new Set((data || []).map(kb => kb.version))]
      return versions
    } catch (error) {
      console.error('Error fetching available versions:', error)
      return []
    }
  }

  // Estatísticas e Analytics
  async getKnowledgeBaseStats(kbId: string): Promise<{
    document_count: number
    chunk_count: number
    total_size: number
    last_updated: string
    query_count: number
  }> {
    try {
      // Buscar estatísticas da knowledge base
      const { data, error } = await this.supabase
        .rpc('get_knowledge_base_stats', { kb_id: kbId })

      if (error) throw error
      return data || {
        document_count: 0,
        chunk_count: 0,
        total_size: 0,
        last_updated: new Date().toISOString(),
        query_count: 0
      }
    } catch (error) {
      console.error('Error fetching knowledge base stats:', error)
      return {
        document_count: 0,
        chunk_count: 0,
        total_size: 0,
        last_updated: new Date().toISOString(),
        query_count: 0
      }
    }
  }

  // Utilitários
  private async generateEmbedding(text: string): Promise<number[]> {
    // Implementar geração de embedding usando OpenAI
    // Esta é uma implementação simplificada
    const { OpenAIEmbeddings } = await import('@langchain/openai')
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'text-embedding-3-small'
    })
    
    return await embeddings.embedQuery(text)
  }

  // Configurações de Contexto
  async getContextConfiguration(): Promise<{
    default_kbs: string[]
    version_strategy: 'latest' | 'specific' | 'all'
    fallback_kbs: string[]
    max_context_length: number
  }> {
    try {
      const { data, error } = await this.supabase
        .from('context_configurations')
        .select('*')
        .single()

      if (error) throw error
      return data || {
        default_kbs: [],
        version_strategy: 'latest',
        fallback_kbs: [],
        max_context_length: 4000
      }
    } catch (error) {
      console.error('Error fetching context configuration:', error)
      return {
        default_kbs: [],
        version_strategy: 'latest',
        fallback_kbs: [],
        max_context_length: 4000
      }
    }
  }

  async updateContextConfiguration(config: any): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('context_configurations')
        .upsert(config)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating context configuration:', error)
      return false
    }
  }
}

// Instância singleton
export const knowledgeBaseManager = new KnowledgeBaseManager()
