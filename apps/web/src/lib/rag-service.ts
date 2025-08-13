import { createClient } from '@supabase/supabase-js'
import { OpenAIEmbeddings } from '@langchain/openai'
import { OpenAI } from '@langchain/openai'

// Configuração lazy para evitar erros durante build
let embeddings: any = null
let openai: any = null

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nsecops-ness-supabase.pzgnh1.easypanel.host'
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return createClient(supabaseUrl, supabaseServiceKey)
}

function getEmbeddings() {
  if (!embeddings) {
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is required')
    }
    embeddings = new OpenAIEmbeddings({
      openAIApiKey: openaiApiKey,
      modelName: 'text-embedding-3-small'
    })
  }
  return embeddings
}

function getOpenAI() {
  if (!openai) {
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is required')
    }
    openai = new OpenAI({
      openAIApiKey: openaiApiKey,
      modelName: 'gpt-4o-mini'
    })
  }
  return openai
}

export interface Chunk {
  id: string
  content: string
  similarity: number
  document_id: string
  chunk_index: number
  metadata?: any
}

export interface RAGResponse {
  answer: string
  sources: Chunk[]
  confidence: number
}

export class RAGService {
  async searchChunks(query: string, options: {
    limit?: number
    threshold?: number
    versionTag?: string
  } = {}): Promise<Chunk[]> {
    try {
      const { limit = 5, threshold = 0.7, versionTag } = options

      // Gerar embedding da query
      const queryEmbedding = await getEmbeddings().embedQuery(query)

      // Buscar chunks similares no Supabase
      let queryBuilder = getSupabase()
        .rpc('match_documents', {
          query_embedding: queryEmbedding,
          match_threshold: threshold,
          match_count: limit
        })

      // Filtrar por versão se especificado
      if (versionTag) {
        queryBuilder = queryBuilder.eq('version_tag', versionTag)
      }

      const { data: chunks, error } = await queryBuilder

      if (error) {
        console.error('Erro ao buscar chunks:', error)
        return []
      }

      return chunks?.map((chunk: any) => ({
        id: `${chunk.document_id}_${chunk.chunk_index}`,
        content: chunk.content,
        similarity: chunk.similarity,
        document_id: chunk.document_id,
        chunk_index: chunk.chunk_index,
        metadata: chunk.metadata
      })) || []

    } catch (error) {
      console.error('Erro no searchChunks:', error)
      return []
    }
  }

  async generateAnswer(question: string, chunks: Chunk[], options: {
    role?: string
    maxTokens?: number
  } = {}): Promise<{ content: string; confidence: number }> {
    try {
      const { role = 'user', maxTokens = 1000 } = options

      if (!chunks || chunks.length === 0) {
        return {
          content: "Desculpe, não encontrei informações relevantes para responder sua pergunta.",
          confidence: 0
        }
      }

      // Construir contexto dos chunks
      const context = chunks
        .map(chunk => chunk.content)
        .join('\n\n')

      // Prompt para o modelo
      const prompt = `Você é um assistente especializado em documentação corporativa. 
      
Contexto baseado na documentação:
${context}

Pergunta do usuário: ${question}

Instruções:
1. Responda baseado APENAS no contexto fornecido
2. Se a informação não estiver no contexto, diga que não tem essa informação
3. Seja preciso e conciso
4. Use linguagem profissional mas acessível
5. Cite as fontes quando relevante

Resposta:`

      // Gerar resposta com OpenAI
      const response = await getOpenAI().invoke(prompt)

      // Calcular confiança baseada na similaridade dos chunks
      const avgSimilarity = chunks.reduce((sum, chunk) => sum + chunk.similarity, 0) / chunks.length
      const confidence = Math.min(avgSimilarity * 1.2, 1.0) // Ajustar para escala 0-1

      return {
        content: response,
        confidence
      }

    } catch (error) {
      console.error('Erro no generateAnswer:', error)
      return {
        content: "Desculpe, ocorreu um erro ao gerar a resposta. Tente novamente.",
        confidence: 0
      }
    }
  }

  async processQuestion(question: string, options: {
    role?: string
    limit?: number
    threshold?: number
    versionTag?: string
    maxTokens?: number
  } = {}): Promise<RAGResponse> {
    try {
      // Buscar chunks relevantes
      const chunks = await this.searchChunks(question, {
        limit: options.limit || 5,
        threshold: options.threshold || 0.7,
        versionTag: options.versionTag
      })

      if (!chunks || chunks.length === 0) {
        return {
          answer: "Desculpe, não encontrei informações relevantes para responder sua pergunta. Tente reformular ou fazer uma pergunta diferente.",
          sources: [],
          confidence: 0
        }
      }

      // Gerar resposta
      const answer = await this.generateAnswer(question, chunks, {
        role: options.role || 'user',
        maxTokens: options.maxTokens || 1000
      })

      return {
        answer: answer.content,
        sources: chunks,
        confidence: answer.confidence
      }

    } catch (error) {
      console.error('Erro no processQuestion:', error)
      return {
        answer: "Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.",
        sources: [],
        confidence: 0
      }
    }
  }
}

// Instância singleton
export const ragService = new RAGService()
