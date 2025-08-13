import { createClient } from '@supabase/supabase-js'
import { OpenAIEmbeddings } from '@langchain/openai'
import { OpenAI } from '@langchain/openai'
import { conversationMemory, ConversationContext } from './conversation-memory'

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

// Interfaces para o sistema de agentes
export interface AgentPersona {
  id: string
  name: string
  title: string
  icon: string
  description: string
  role: string
  style: string
  identity: string
  focus: string
  core_principles: string[]
  expertise_areas: string[]
  communication_style: string
  response_format: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AgentDataset {
  id: string
  agent_id: string
  name: string
  description: string
  content: string
  category: 'knowledge' | 'examples' | 'procedures' | 'context'
  priority: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AgentResponse {
  content: string
  confidence: number
  sources: any[]
  agent_used: string
  reasoning?: string
  session_id?: string
  message_id?: string
}

export interface AgentContext {
  agent: AgentPersona
  datasets: AgentDataset[]
  conversation_history: any[]
  user_preferences: any
  conversation_context?: ConversationContext
}

export interface MultiAgentResponse {
  responses: AgentResponse[]
  debate_summary?: string
  consensus?: string
  disagreements?: string[]
  session_id?: string
}

export class AgentSystem {
  private supabase = getSupabase()

  // Gerenciamento de Agentes
  async createAgent(agentData: Omit<AgentPersona, 'id' | 'created_at' | 'updated_at'>): Promise<AgentPersona> {
    try {
      const { data, error } = await this.supabase
        .from('agents')
        .insert({
          ...agentData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao criar agente:', error)
      throw error
    }
  }

  async getAgent(agentId: string): Promise<AgentPersona | null> {
    try {
      const { data, error } = await this.supabase
        .from('agents')
        .select('*')
        .eq('id', agentId)
        .eq('is_active', true)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao buscar agente:', error)
      return null
    }
  }

  async getAllAgents(): Promise<AgentPersona[]> {
    try {
      const { data, error } = await this.supabase
        .from('agents')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar agentes:', error)
      return []
    }
  }

  async updateAgent(agentId: string, updates: Partial<AgentPersona>): Promise<AgentPersona | null> {
    try {
      const { data, error } = await this.supabase
        .from('agents')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', agentId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao atualizar agente:', error)
      return null
    }
  }

  async deleteAgent(agentId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('agents')
        .update({ is_active: false })
        .eq('id', agentId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Erro ao deletar agente:', error)
      return false
    }
  }

  // Gerenciamento de Datasets
  async addDatasetToAgent(agentId: string, datasetData: Omit<AgentDataset, 'id' | 'agent_id' | 'created_at' | 'updated_at'>): Promise<AgentDataset> {
    try {
      const { data, error } = await this.supabase
        .from('agent_datasets')
        .insert({
          ...datasetData,
          agent_id: agentId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao adicionar dataset:', error)
      throw error
    }
  }

  async getAgentDatasets(agentId: string): Promise<AgentDataset[]> {
    try {
      const { data, error } = await this.supabase
        .from('agent_datasets')
        .select('*')
        .eq('agent_id', agentId)
        .eq('is_active', true)
        .order('priority', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar datasets do agente:', error)
      return []
    }
  }

  async updateDataset(datasetId: string, updates: Partial<AgentDataset>): Promise<AgentDataset | null> {
    try {
      const { data, error } = await this.supabase
        .from('agent_datasets')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', datasetId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao atualizar dataset:', error)
      return null
    }
  }

  async deleteDataset(datasetId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('agent_datasets')
        .update({ is_active: false })
        .eq('id', datasetId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Erro ao deletar dataset:', error)
      return false
    }
  }

  // Processamento de Perguntas com Agentes
  async processQuestionWithAgent(
    question: string, 
    agentId: string, 
    options: {
      conversation_history?: any[]
      user_preferences?: any
      max_tokens?: number
    } = {}
  ): Promise<AgentResponse> {
    try {
      // Buscar agente e seus datasets
      const agent = await this.getAgent(agentId)
      if (!agent) {
        throw new Error('Agente não encontrado')
      }

      const datasets = await this.getAgentDatasets(agentId)
      
      // Construir contexto do agente
      const agentContext = this.buildAgentContext(agent, datasets, options)

      // Buscar chunks relevantes dos datasets
      const relevantChunks = await this.searchAgentKnowledge(question, agentId, datasets)

      // Gerar resposta personalizada do agente
      const response = await this.generateAgentResponse(question, agentContext, relevantChunks, options)

      return response
    } catch (error) {
      console.error('Erro ao processar pergunta com agente:', error)
      return {
        content: "Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.",
        confidence: 0,
        sources: [],
        agent_used: agentId,
        reasoning: "Erro no processamento"
      }
    }
  }

  // Processamento com memória conversacional
  async processQuestionWithAgentAndMemory(
    question: string, 
    agentId: string, 
    sessionId: string,
    options: {
      max_tokens?: number
      enable_memory?: boolean
    } = {}
  ): Promise<AgentResponse> {
    try {
      const { enable_memory = true, max_tokens = 1000 } = options

      // Get agent and its datasets
      const agent = await this.getAgent(agentId)
      if (!agent) {
        throw new Error('Agent not found')
      }

      const datasets = await this.getAgentDatasets(agentId)
      
      // Get conversation context if enabled
      let conversationContext: ConversationContext | undefined
      if (enable_memory) {
        conversationContext = await conversationMemory.getConversationContext(sessionId)
      }

      // Search relevant chunks from datasets
      const relevantChunks = await this.searchAgentKnowledge(question, agentId, datasets)

      // Generate personalized agent response with context
      const response = await this.generateAgentResponseWithMemory(
        question, 
        agent, 
        datasets, 
        relevantChunks, 
        conversationContext,
        { max_tokens }
      )

      // Save message in memory
      if (enable_memory) {
        await conversationMemory.addMessage({
          session_id: sessionId,
          role: 'user',
          content: question
        })

        await conversationMemory.addMessage({
          session_id: sessionId,
          role: 'assistant',
          content: response.content,
          agent_used: agent.name,
          type: 'single_agent',
          metadata: {
            confidence: response.confidence,
            sources: response.sources,
            reasoning: response.reasoning
          }
        })
      }

      return {
        ...response,
        session_id: sessionId
      }

    } catch (error) {
      console.error('Error processing question with memory:', error)
      return {
        content: "Sorry, an error occurred while processing your question. Please try again.",
        confidence: 0,
        sources: [],
        agent_used: agentId,
        reasoning: "Processing error",
        session_id: sessionId
      }
    }
  }

  // Processamento com múltiplos agentes
  async processQuestionWithMultipleAgents(
    question: string, 
    agentIds: string[], 
    options: {
      conversation_history?: any[]
      user_preferences?: any
      max_tokens?: number
      enable_debate?: boolean
    } = {}
  ): Promise<MultiAgentResponse> {
    try {
      const { enable_debate = true } = options
      
      // Buscar todos os agentes
      const agents = await Promise.all(
        agentIds.map(id => this.getAgent(id))
      )
      
      const validAgents = agents.filter(agent => agent !== null) as AgentPersona[]
      
      if (validAgents.length === 0) {
        throw new Error('Nenhum agente válido encontrado')
      }

      // Processar pergunta com cada agente
      const responses = await Promise.all(
        validAgents.map(agent => 
          this.processQuestionWithAgent(question, agent.id, options)
        )
      )

      // Se apenas um agente, retornar resposta simples
      if (validAgents.length === 1) {
        return {
          responses: [responses[0]]
        }
      }

      // Se múltiplos agentes e debate habilitado, gerar debate
      if (enable_debate && validAgents.length > 1) {
        const debate = await this.generateAgentDebate(question, validAgents, responses, options)
        return {
          responses,
          ...debate
        }
      }

      return { responses }

    } catch (error) {
      console.error('Erro ao processar pergunta com múltiplos agentes:', error)
      return {
        responses: [{
          content: "Desculpe, ocorreu um erro ao processar sua pergunta com múltiplos agentes.",
          confidence: 0,
          sources: [],
          agent_used: 'Sistema',
          reasoning: "Erro no processamento"
        }]
      }
    }
  }

  // Processamento com múltiplos agentes e memória
  async processQuestionWithMultipleAgentsAndMemory(
    question: string, 
    agentIds: string[], 
    sessionId: string,
    options: {
      max_tokens?: number
      enable_debate?: boolean
      enable_memory?: boolean
    } = {}
  ): Promise<MultiAgentResponse> {
    try {
      const { enable_debate = true, enable_memory = true, max_tokens = 1000 } = options
      
      // Get all agents
      const agents = await Promise.all(
        agentIds.map(id => this.getAgent(id))
      )
      
      const validAgents = agents.filter(agent => agent !== null) as AgentPersona[]
      
      if (validAgents.length === 0) {
        throw new Error('No valid agents found')
      }

      // Get conversation context if enabled
      let conversationContext: ConversationContext | undefined
      if (enable_memory) {
        conversationContext = await conversationMemory.getConversationContext(sessionId)
      }

      // Process question with each agent
      const responses = await Promise.all(
        validAgents.map(agent => 
          this.processQuestionWithAgent(question, agent.id, {
            conversation_history: conversationContext?.messages || [],
            user_preferences: conversationContext?.user_preferences || {},
            max_tokens
          })
        )
      )

      // If only one agent, return simple response
      if (validAgents.length === 1) {
        const response = responses[0]
        
        // Save in memory
        if (enable_memory) {
          await conversationMemory.addMessage({
            session_id: sessionId,
            role: 'user',
            content: question
          })

          await conversationMemory.addMessage({
            session_id: sessionId,
            role: 'assistant',
            content: response.content,
            agent_used: validAgents[0].name,
            agent_ids: agentIds,
            type: 'single_agent',
            metadata: {
              confidence: response.confidence,
              sources: response.sources,
              reasoning: response.reasoning
            }
          })
        }

        return {
          responses: [response],
          session_id: sessionId
        }
      }

      // If multiple agents and debate enabled, generate debate
      if (enable_debate && validAgents.length > 1) {
        const debate = await this.generateAgentDebate(question, validAgents, responses, {
          conversation_context: conversationContext,
          max_tokens
        })

        // Save debate in memory
        if (enable_memory) {
          await conversationMemory.addMessage({
            session_id: sessionId,
            role: 'user',
            content: question
          })

          await conversationMemory.addMessage({
            session_id: sessionId,
            role: 'assistant',
            content: debate.debate_summary || 'Debate between agents completed.',
            agent_used: `${validAgents.length} Agents`,
            agent_ids: agentIds,
            type: 'multi_agent',
            metadata: {
              responses: responses.map(r => ({
                agent: r.agent_used,
                content: r.content,
                confidence: r.confidence
              })),
              consensus: debate.consensus,
              disagreements: debate.disagreements
            }
          })
        }

        return {
          responses,
          ...debate,
          session_id: sessionId
        }
      }

      return { 
        responses,
        session_id: sessionId
      }

    } catch (error) {
      console.error('Error processing question with multiple agents and memory:', error)
      return {
        responses: [{
          content: "Sorry, an error occurred while processing your question with multiple agents.",
          confidence: 0,
          sources: [],
          agent_used: 'System',
          reasoning: "Processing error",
          session_id: sessionId
        }],
        session_id: sessionId
      }
    }
  }

  private buildAgentContext(agent: AgentPersona, datasets: AgentDataset[], options: any): AgentContext {
    return {
      agent,
      datasets,
      conversation_history: options.conversation_history || [],
      user_preferences: options.user_preferences || {}
    }
  }

  private async searchAgentKnowledge(question: string, agentId: string, datasets: AgentDataset[]): Promise<any[]> {
    try {
      // Gerar embedding da pergunta
      const queryEmbedding = await getEmbeddings().embedQuery(question)

      // Buscar chunks relevantes no Supabase
      const { data: chunks, error } = await this.supabase
        .rpc('match_documents', {
          query_embedding: queryEmbedding,
          match_threshold: 0.7,
          match_count: 10
        })
        .eq('agent_id', agentId)

      if (error) throw error
      return chunks || []
    } catch (error) {
      console.error('Erro ao buscar conhecimento do agente:', error)
      return []
    }
  }

  private async generateAgentResponse(
    question: string, 
    context: AgentContext, 
    chunks: any[], 
    options: any
  ): Promise<AgentResponse> {
    try {
      const { agent, datasets } = context
      
      // Construir prompt personalizado do agente
      const prompt = this.buildAgentPrompt(question, agent, datasets, chunks, options)

      // Gerar resposta com OpenAI
      const response = await getOpenAI().invoke(prompt, {
        maxTokens: options.max_tokens || 1000,
        temperature: 0.7
      })

      // Calcular confiança
      const confidence = this.calculateConfidence(chunks)

      return {
        content: response,
        confidence,
        sources: chunks,
        agent_used: agent.name,
        reasoning: `Response generated by agent ${agent.name} (${agent.title})`
      }
    } catch (error) {
      console.error('Erro ao gerar resposta do agente:', error)
      throw error
    }
  }

  private async generateAgentResponseWithMemory(
    question: string, 
    agent: AgentPersona, 
    datasets: AgentDataset[], 
    chunks: any[], 
    conversationContext: ConversationContext | undefined,
    options: any
  ): Promise<AgentResponse> {
    try {
      // Build personalized agent prompt with memory context
      const prompt = this.buildAgentPromptWithMemory(question, agent, datasets, chunks, conversationContext, options)

      // Generate response with OpenAI
      const response = await getOpenAI().invoke(prompt, {
        maxTokens: options.max_tokens || 1000,
        temperature: 0.7
      })

      // Calculate confidence
      const confidence = this.calculateConfidence(chunks)

      return {
        content: response,
        confidence,
        sources: chunks,
        agent_used: agent.name,
        reasoning: `Response generated by agent ${agent.name} (${agent.title}) with memory context`
      }
    } catch (error) {
      console.error('Error generating agent response with memory:', error)
      throw error
    }
  }

  private async generateAgentDebate(
    question: string,
    agents: AgentPersona[],
    responses: AgentResponse[],
    options: any
  ): Promise<{
    debate_summary: string
    consensus: string
    disagreements: string[]
  }> {
    try {
      const debatePrompt = this.buildDebatePromptWithMemory(question, agents, responses, options)
      
      const debateResponse = await getOpenAI().invoke(debatePrompt, {
        maxTokens: options.max_tokens || 1500,
        temperature: 0.7
      })

      // Extract debate information
      const debateText = debateResponse as string
      
      // Simple debate analysis (can be improved with structured parsing)
      const consensus = this.extractConsensus(debateText)
      const disagreements = this.extractDisagreements(debateText)

      return {
        debate_summary: debateText,
        consensus,
        disagreements
      }

    } catch (error) {
      console.error('Error generating debate:', error)
      return {
        debate_summary: "Unable to generate debate between agents.",
        consensus: "Agents agree to continue analysis.",
        disagreements: []
      }
    }
  }

  private buildAgentPrompt(
    question: string, 
    agent: AgentPersona, 
    datasets: AgentDataset[], 
    chunks: any[], 
    options: any
  ): string {
    const context = chunks.map(chunk => chunk.content).join('\n\n')
    const datasetContext = datasets
      .filter(d => d.category === 'knowledge')
      .map(d => d.content)
      .join('\n\n')

    return `You are ${agent.name}, ${agent.title}.

${agent.description}

**Your role:** ${agent.role}
**Your style:** ${agent.style}
**Your identity:** ${agent.identity}
**Your focus:** ${agent.focus}

**Core principles:**
${agent.core_principles.map(p => `- ${p}`).join('\n')}

**Areas of expertise:**
${agent.expertise_areas.map(e => `- ${e}`).join('\n')}

**Communication style:** ${agent.communication_style}

**Specialized knowledge:**
${datasetContext}

**Conversation context:**
${context}

**User question:** ${question}

**Instructions:**
1. Respond as ${agent.name}, maintaining your personality and expertise
2. Use your specialized knowledge to provide accurate responses
3. Follow your communication style: ${agent.communication_style}
4. If information is not available, be honest about limitations
5. Keep focus on: ${agent.focus}

**Response from ${agent.name}:**`
  }

  private buildAgentPromptWithMemory(
    question: string, 
    agent: AgentPersona, 
    datasets: AgentDataset[], 
    chunks: any[], 
    conversationContext: ConversationContext | undefined,
    options: any
  ): string {
    const context = chunks.map(chunk => chunk.content).join('\n\n')
    const datasetContext = datasets
      .filter(d => d.category === 'knowledge')
      .map(d => d.content)
      .join('\n\n')

    // Build conversation context
    let conversationHistory = ''
    let userPreferences = ''
    let conversationSummary = ''

    if (conversationContext) {
      // Use summary if available
      if (conversationContext.summary) {
        conversationSummary = `\n\n**Previous Conversation Summary:**
${conversationContext.summary}`
      }

      // Use recent messages if no summary
      if (!conversationContext.summary && conversationContext.messages.length > 0) {
        const recentMessages = conversationContext.messages.slice(-10)
        conversationHistory = `\n\n**Recent Conversation History:**
${recentMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n')}`
      }

      // Use user preferences
      if (conversationContext.user_preferences && Object.keys(conversationContext.user_preferences).length > 0) {
        userPreferences = `\n\n**User Preferences:**
- Expertise level: ${conversationContext.user_preferences.expertise_level || 'Not detected'}
- Interests: ${conversationContext.user_preferences.interests?.join(', ') || 'Not detected'}
- Communication style: ${conversationContext.user_preferences.communication_style || 'Not detected'}`
      }
    }

    return `You are ${agent.name}, ${agent.title}.

${agent.description}

**Your role:** ${agent.role}
**Your style:** ${agent.style}
**Your identity:** ${agent.identity}
**Your focus:** ${agent.focus}

**Core principles:**
${agent.core_principles.map(p => `- ${p}`).join('\n')}

**Areas of expertise:**
${agent.expertise_areas.map(e => `- ${e}`).join('\n')}

**Communication style:** ${agent.communication_style}

**Specialized knowledge:**
${datasetContext}

**Conversation context:**
${context}${conversationSummary}${conversationHistory}${userPreferences}

**Current user question:** ${question}

**Instructions:**
1. Respond as ${agent.name}, maintaining your personality and expertise
2. Use your specialized knowledge to provide accurate responses
3. Follow your communication style: ${agent.communication_style}
4. Consider the previous conversation context to maintain fluency
5. If information is not available, be honest about limitations
6. Keep focus on: ${agent.focus}
7. Adapt your response to user preferences when relevant

**Response from ${agent.name}:**`
  }

  private buildDebatePrompt(
    question: string,
    agents: AgentPersona[],
    responses: AgentResponse[]
  ): string {
    const agentResponses = agents.map((agent, index) => {
      const response = responses[index]
      return `
**${agent.name} (${agent.title}):**
${response.content}

*Style: ${agent.communication_style}*
*Focus: ${agent.focus}*
      `.trim()
    }).join('\n\n')

    return `You are a debate moderator specialized in AI analysis.

**Original Question:** ${question}

**Agent Responses:**

${agentResponses}

**Moderator Task:**
1. Analyze each agent's response considering their specializations
2. Identify points of consensus between agents
3. Identify disagreements or different perspectives
4. Provide a debate summary
5. Suggest a conclusion or final recommendation

**Response Format:**
- Debate summary
- Points of consensus
- Identified disagreements
- Final recommendation

**Moderator Response:**`
  }

  private buildDebatePromptWithMemory(
    question: string,
    agents: AgentPersona[],
    responses: AgentResponse[],
    options: any
  ): string {
    const agentResponses = agents.map((agent, index) => {
      const response = responses[index]
      return `
**${agent.name} (${agent.title}):**
${response.content}

*Style: ${agent.communication_style}*
*Focus: ${agent.focus}*
      `.trim()
    }).join('\n\n')

    const conversationContext = options.conversation_context
    let contextInfo = ''

    if (conversationContext) {
      if (conversationContext.summary) {
        contextInfo = `\n\n**Conversation Context:**
${conversationContext.summary}`
      }

      if (conversationContext.user_preferences) {
        contextInfo += `\n\n**User Preferences:**
- Level: ${conversationContext.user_preferences.expertise_level || 'Not detected'}
- Interests: ${conversationContext.user_preferences.interests?.join(', ') || 'Not detected'}`
      }
    }

    return `You are a debate moderator specialized in AI analysis.

**Original Question:** ${question}${contextInfo}

**Agent Responses:**

${agentResponses}

**Moderator Task:**
1. Analyze each agent's response considering their specializations
2. Identify points of consensus between agents
3. Identify disagreements or different perspectives
4. Consider conversation context to maintain fluency
5. Provide a debate summary
6. Suggest a conclusion or final recommendation

**Response Format:**
- Debate summary
- Points of consensus
- Identified disagreements
- Final recommendation

**Moderator Response:**`
  }

  private extractConsensus(debateText: string): string {
    // Simple implementation - can be improved with more sophisticated parsing
    const consensusMatch = debateText.match(/consensus[:\s]+(.+?)(?=\n|$)/i)
    return consensusMatch ? consensusMatch[1].trim() : "Agents agree to continue analysis."
  }

  private extractDisagreements(debateText: string): string[] {
    // Simple implementation - can be improved
    const disagreementMatches = debateText.match(/disagreement[:\s]+(.+?)(?=\n|$)/gi)
    return disagreementMatches ? disagreementMatches.map(d => d.replace(/disagreement[:\s]+/i, '').trim()) : []
  }

  private calculateConfidence(chunks: any[]): number {
    if (!chunks || chunks.length === 0) return 0
    
    const avgSimilarity = chunks.reduce((sum, chunk) => sum + (chunk.similarity || 0), 0) / chunks.length
    return Math.min(avgSimilarity * 1.2, 1.0)
  }

  // Agentes pré-configurados baseados no BMAD
  async initializeDefaultAgents(): Promise<void> {
    const defaultAgents = [
      {
        name: "João",
        title: "Product Manager",
        icon: "📋",
        description: "Especialista em estratégia de produto, análise de mercado e definição de requisitos",
        role: "Investigative Product Strategist & Market-Savvy PM",
        style: "Analytical, inquisitive, data-driven, user-focused, pragmatic",
        identity: "Product Manager specialized in document creation and product research",
        focus: "Creating PRDs and other product documentation using templates",
        core_principles: [
          "Deeply understand 'Why' - uncover root causes and motivations",
          "Champion the user - maintain relentless focus on target user value",
          "Data-informed decisions with strategic judgment",
          "Ruthless prioritization & MVP focus",
          "Clarity & precision in communication"
        ],
        expertise_areas: [
          "Product Strategy",
          "Market Analysis",
          "Requirements Gathering",
          "User Research",
          "Roadmap Planning"
        ],
        communication_style: "Analítico e estratégico, focado em dados e resultados",
        response_format: "Estruturado com análise, recomendações e próximos passos",
        is_active: true
      },
      {
        name: "Maria",
        title: "Technical Architect",
        icon: "🏗️",
        description: "Especialista em arquitetura de sistemas, design de software e decisões técnicas",
        role: "Strategic Technical Architect & System Designer",
        style: "Systematic, detail-oriented, forward-thinking, pragmatic",
        identity: "Technical Architect focused on scalable and maintainable solutions",
        focus: "Creating robust technical architectures and system designs",
        core_principles: [
          "Scalability and performance first",
          "Maintainable and clean code architecture",
          "Security by design",
          "Technology-agnostic when possible",
          "Documentation-driven development"
        ],
        expertise_areas: [
          "System Architecture",
          "Software Design",
          "Technology Selection",
          "Performance Optimization",
          "Security Architecture"
        ],
        communication_style: "Técnico mas acessível, com foco em soluções práticas",
        response_format: "Arquitetura detalhada com diagramas conceituais e decisões técnicas",
        is_active: true
      },
      {
        name: "Ana",
        title: "UX Expert",
        icon: "🎨",
        description: "Especialista em experiência do usuário, design de interface e usabilidade",
        role: "User Experience Designer & Interface Specialist",
        style: "Creative, empathetic, user-centered, detail-oriented",
        identity: "UX Expert focused on creating delightful user experiences",
        focus: "Designing intuitive and accessible user interfaces",
        core_principles: [
          "User-centered design approach",
          "Accessibility and inclusivity",
          "Data-driven design decisions",
          "Iterative design process",
          "Emotional connection with users"
        ],
        expertise_areas: [
          "User Research",
          "Interface Design",
          "Usability Testing",
          "Information Architecture",
          "Design Systems"
        ],
        communication_style: "Empático e criativo, sempre pensando no usuário final",
        response_format: "Designs visuais com explicações de usabilidade e acessibilidade",
        is_active: true
      }
    ]

    for (const agentData of defaultAgents) {
      try {
        await this.createAgent(agentData)
      } catch (error) {
        console.error(`Erro ao criar agente ${agentData.name}:`, error)
      }
    }
  }
}

// Instância singleton
export const agentSystem = new AgentSystem()
