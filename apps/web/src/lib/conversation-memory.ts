import { createClient } from '@supabase/supabase-js'
import { OpenAIEmbeddings } from '@langchain/openai'

// Configuração lazy para evitar erros durante build
let embeddings: any = null

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

export interface ConversationMessage {
  id: string
  session_id: string
  role: 'user' | 'assistant'
  content: string
  agent_used?: string
  agent_ids?: string[]
  type?: 'single_agent' | 'multi_agent' | 'default'
  metadata?: any
  created_at: string
}

export interface ConversationSession {
  id: string
  user_id?: string
  title: string
  agent_used?: string
  agent_ids?: string[]
  message_count: number
  last_activity: string
  created_at: string
  updated_at: string
}

export interface ConversationContext {
  session_id: string
  messages: ConversationMessage[]
  summary?: string
  key_topics?: string[]
  user_preferences?: any
  agent_context?: any
}

export class ConversationMemory {
  private supabase = getSupabase()
  private readonly MAX_MESSAGES_PER_SESSION = 50
  private readonly MAX_CONTEXT_LENGTH = 4000
  private readonly SUMMARY_THRESHOLD = 20

  // Gerenciamento de Sessões
  async createSession(sessionData: {
    title: string
    user_id?: string
    agent_used?: string
    agent_ids?: string[]
  }): Promise<ConversationSession> {
    try {
      const { data, error } = await this.supabase
        .from('conversation_sessions')
        .insert({
          ...sessionData,
          message_count: 0,
          last_activity: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating session:', error)
      throw error
    }
  }

  async getSession(sessionId: string): Promise<ConversationSession | null> {
    try {
      const { data, error } = await this.supabase
        .from('conversation_sessions')
        .select('*')
        .eq('id', sessionId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching session:', error)
      return null
    }
  }

  async updateSession(sessionId: string, updates: Partial<ConversationSession>): Promise<ConversationSession | null> {
    try {
      const { data, error } = await this.supabase
        .from('conversation_sessions')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating session:', error)
      return null
    }
  }

  // Gerenciamento de Mensagens
  async addMessage(messageData: {
    session_id: string
    role: 'user' | 'assistant'
    content: string
    agent_used?: string
    agent_ids?: string[]
    type?: 'single_agent' | 'multi_agent' | 'default'
    metadata?: any
  }): Promise<ConversationMessage> {
    try {
      const { data, error } = await this.supabase
        .from('conversation_messages')
        .insert({
          ...messageData,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      // Update message count in session
      const session = await this.getSession(messageData.session_id)
      await this.updateSession(messageData.session_id, {
        message_count: (session?.message_count || 0) + 1,
        last_activity: new Date().toISOString()
      })

      return data
    } catch (error) {
      console.error('Error adding message:', error)
      throw error
    }
  }

  async getMessages(sessionId: string, limit: number = 50): Promise<ConversationMessage[]> {
    try {
      const { data, error } = await this.supabase
        .from('conversation_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching messages:', error)
      return []
    }
  }

  // Contexto Inteligente
  async getConversationContext(sessionId: string): Promise<ConversationContext> {
    try {
      const messages = await this.getMessages(sessionId, this.MAX_MESSAGES_PER_SESSION)
      const session = await this.getSession(sessionId)

      if (!session) {
        throw new Error('Session not found')
      }

      // Generate summary if needed
      let summary: string | undefined
      let keyTopics: string[] | undefined

      if (messages.length >= this.SUMMARY_THRESHOLD) {
        const summaryData = await this.generateConversationSummary(messages)
        summary = summaryData.summary
        keyTopics = summaryData.keyTopics
      }

      return {
        session_id: sessionId,
        messages,
        summary,
        key_topics: keyTopics,
        user_preferences: await this.extractUserPreferences(messages),
        agent_context: {
          agent_used: session.agent_used,
          agent_ids: session.agent_ids
        }
      }
    } catch (error) {
      console.error('Error getting context:', error)
      return {
        session_id: sessionId,
        messages: [],
        summary: undefined,
        key_topics: undefined,
        user_preferences: {},
        agent_context: {}
      }
    }
  }

  // Otimização de Contexto
  async getOptimizedContext(sessionId: string, currentQuestion: string): Promise<{
    relevantMessages: ConversationMessage[]
    summary: string | undefined
    contextLength: number
  }> {
    try {
      const context = await this.getConversationContext(sessionId)
      const allMessages = context.messages

      if (allMessages.length === 0) {
        return {
          relevantMessages: [],
          summary: undefined,
          contextLength: 0
        }
      }

      // If we have summary, use it + recent messages
      if (context.summary) {
        const recentMessages = allMessages.slice(-10) // Last 10 messages
        const contextLength = this.calculateContextLength(context.summary, recentMessages)

        if (contextLength <= this.MAX_CONTEXT_LENGTH) {
          return {
            relevantMessages: recentMessages,
            summary: context.summary,
            contextLength
          }
        }
      }

      // Find relevant messages for current question
      const relevantMessages = await this.findRelevantMessages(currentQuestion, allMessages)
      const contextLength = this.calculateContextLength('', relevantMessages)

      return {
        relevantMessages,
        summary: context.summary,
        contextLength
      }
    } catch (error) {
      console.error('Error optimizing context:', error)
      return {
        relevantMessages: [],
        summary: undefined,
        contextLength: 0
      }
    }
  }

  // Busca Semântica de Mensagens Relevantes
  private async findRelevantMessages(question: string, messages: ConversationMessage[]): Promise<ConversationMessage[]> {
    try {
      if (messages.length <= 10) {
        return messages // If few messages, return all
      }

      // Generate embedding for current question
      const questionEmbedding = await getEmbeddings().embedQuery(question)

      // Calculate similarity with previous messages
      const messageSimilarities = await Promise.all(
        messages.map(async (message) => {
          const messageEmbedding = await getEmbeddings().embedQuery(message.content)
          const similarity = this.calculateCosineSimilarity(questionEmbedding, messageEmbedding)
          return { message, similarity }
        })
      )

      // Sort by similarity and get most relevant
      const relevantMessages = messageSimilarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 15) // Top 15 most relevant
        .map(item => item.message)

      // Add recent messages to maintain temporal context
      const recentMessages = messages.slice(-5)
      const combinedMessages = [...Array.from(new Set([...relevantMessages, ...recentMessages]))]

      // Sort by timestamp
      return combinedMessages.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
    } catch (error) {
      console.error('Error finding relevant messages:', error)
      return messages.slice(-10) // Fallback: last 10 messages
    }
  }

  // Geração de Resumo
  private async generateConversationSummary(messages: ConversationMessage[]): Promise<{
    summary: string
    keyTopics: string[]
  }> {
    try {
      const conversationText = messages
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n')

      // Use OpenAI to generate summary
      const { OpenAI } = await import('@langchain/openai')
      const openai = new OpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: 'gpt-4o-mini'
      })

      const summaryPrompt = `
Analyze this conversation and provide:

1. A concise summary of the main points discussed (maximum 200 words)
2. List of key topics mentioned

Conversation:
${conversationText}

Response format:
SUMMARY: [summary here]
TOPICS: [topic1, topic2, topic3]
`

      const response = await openai.invoke(summaryPrompt)
      const responseText = response as string

      // Extract summary and topics
      const summaryMatch = responseText.match(/SUMMARY:\s*(.+?)(?=\n|$)/i)
      const topicsMatch = responseText.match(/TOPICS:\s*(.+?)(?=\n|$)/i)

      const summary = summaryMatch ? summaryMatch[1].trim() : 'Conversation about various topics'
      const keyTopics = topicsMatch 
        ? topicsMatch[1].split(',').map(t => t.trim()).filter(t => t.length > 0)
        : []

      return { summary, keyTopics }
    } catch (error) {
      console.error('Error generating summary:', error)
      return {
        summary: 'Conversation about various topics',
        keyTopics: []
      }
    }
  }

  // Extração de Preferências do Usuário
  private async extractUserPreferences(messages: ConversationMessage[]): Promise<any> {
    try {
      const userMessages = messages.filter(msg => msg.role === 'user')
      if (userMessages.length === 0) return {}

      const userText = userMessages.map(msg => msg.content).join('\n')

      const { OpenAI } = await import('@langchain/openai')
      const openai = new OpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: 'gpt-4o-mini'
      })

      const preferencesPrompt = `
Analyze the user's messages and extract their preferences:

${userText}

Identify:
1. Technical expertise level (beginner, intermediate, advanced)
2. Areas of interest
3. Preferred communication style
4. Response format preferences

Respond in JSON:
{
  "expertise_level": "string",
  "interests": ["string"],
  "communication_style": "string",
  "response_format": "string"
}
`

      const response = await openai.invoke(preferencesPrompt)
      const responseText = response as string

      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0])
        }
      } catch (parseError) {
        console.error('Error parsing preferences:', parseError)
      }

      return {}
    } catch (error) {
      console.error('Error extracting preferences:', error)
      return {}
    }
  }

  // Utilitários
  private calculateContextLength(summary: string, messages: ConversationMessage[]): number {
    const messagesText = messages.map(msg => msg.content).join(' ')
    return (summary + messagesText).length
  }

  private calculateCosineSimilarity(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length) return 0

    let dotProduct = 0
    let norm1 = 0
    let norm2 = 0

    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i]
      norm1 += vec1[i] * vec1[i]
      norm2 += vec2[i] * vec2[i]
    }

    if (norm1 === 0 || norm2 === 0) return 0
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2))
  }

  // Limpeza e Manutenção
  async cleanupOldSessions(daysOld: number = 30): Promise<number> {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysOld)

      const { data, error } = await this.supabase
        .from('conversation_sessions')
        .delete()
        .lt('last_activity', cutoffDate.toISOString())

      if (error) throw error
      return data ? data.length : 0
    } catch (error) {
      console.error('Error cleaning old sessions:', error)
      return 0
    }
  }
}

// Instância singleton
export const conversationMemory = new ConversationMemory()
