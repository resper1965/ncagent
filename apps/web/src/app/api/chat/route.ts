import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '../../../lib/supabase'
import { z } from 'zod'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const chatSchema = z.object({
  question: z.string().min(1),
  sessionId: z.string().uuid().optional(),
  agentId: z.string().uuid().optional(),
  agentIds: z.array(z.string().uuid()).optional(),
  knowledgeBaseIds: z.array(z.string().uuid()).optional(),
  enableMemory: z.boolean().default(true),
  enableDebate: z.boolean().default(true),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()
    
    // Get user from auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = chatSchema.parse(body)

    // Create or get session
    let sessionId = validatedData.sessionId
    if (!sessionId) {
      const { data: session, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title: validatedData.question.substring(0, 100),
          agent_ids: validatedData.agentIds || [],
          knowledge_base_ids: validatedData.knowledgeBaseIds || [],
          message_count: 0,
        })
        .select()
        .single()

      if (sessionError) {
        console.error('Session creation error:', sessionError)
        return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
      }

      sessionId = session.id
    }

    // Save user message
    await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        content: validatedData.question,
        role: 'user',
      })

    // Update session message count
    await supabase
      .from('chat_sessions')
      .update({ 
        message_count: supabase.sql`message_count + 1`,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)

    let response: any

    // Handle different chat modes
    if (validatedData.agentIds && validatedData.agentIds.length > 1) {
      // Multi-agent debate mode
      response = await handleMultiAgentDebate(
        supabase,
        validatedData.question,
        validatedData.agentIds,
        validatedData.knowledgeBaseIds,
        validatedData.enableDebate
      )
    } else if (validatedData.agentId) {
      // Single agent mode
      response = await handleSingleAgent(
        supabase,
        validatedData.question,
        validatedData.agentId,
        validatedData.knowledgeBaseIds
      )
    } else {
      // Default RAG mode
      response = await handleDefaultRAG(
        supabase,
        validatedData.question,
        validatedData.knowledgeBaseIds
      )
    }

    // Save assistant message
    await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        content: response.content,
        role: 'assistant',
        agent_used: response.agent_used,
        sources: response.sources,
        confidence: response.confidence,
        metadata: response.metadata,
      })

    return NextResponse.json({
      success: true,
      data: {
        session_id: sessionId,
        answer: response.content,
        agent_used: response.agent_used,
        sources: response.sources,
        confidence: response.confidence,
        type: response.type,
        ...response.metadata,
      }
    })

  } catch (error) {
    console.error('Chat error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid request data', 
        details: error.errors 
      }, { status: 400 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handleDefaultRAG(
  supabase: any,
  question: string,
  knowledgeBaseIds?: string[]
) {
  // Get relevant documents from knowledge bases
  let relevantDocs: any[] = []
  
  if (knowledgeBaseIds && knowledgeBaseIds.length > 0) {
    const { data: embeddings } = await supabase
      .from('document_embeddings')
      .select(`
        content,
        metadata,
        documents!inner (
          knowledge_base_id
        )
      `)
      .in('documents.knowledge_base_id', knowledgeBaseIds)

    if (embeddings && embeddings.length > 0) {
      // Simple similarity search (in production, use proper vector search)
      relevantDocs = embeddings.slice(0, 5)
    }
  }

  // Create context from relevant documents
  const context = relevantDocs.length > 0 
    ? `\n\nRelevant information:\n${relevantDocs.map(doc => doc.content).join('\n\n')}`
    : ''

  // Generate response with OpenAI
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are Gabi, an AI assistant. Answer questions based on the provided context. If no context is provided, answer based on your general knowledge. Be helpful, accurate, and concise.${context}`
      },
      {
        role: 'user',
        content: question
      }
    ],
    max_tokens: 1000,
    temperature: 0.7,
  })

  return {
    content: completion.choices[0].message.content,
    agent_used: 'Gabi Default',
    sources: relevantDocs.map(doc => ({
      content: doc.content.substring(0, 200) + '...',
      title: doc.metadata?.title || 'Document',
    })),
    confidence: 0.8,
    type: 'default_rag',
    metadata: {},
  }
}

async function handleSingleAgent(
  supabase: any,
  question: string,
  agentId: string,
  knowledgeBaseIds?: string[]
) {
  // Get agent details
  const { data: agent, error: agentError } = await supabase
    .from('agents')
    .select('*')
    .eq('id', agentId)
    .single()

  if (agentError || !agent) {
    throw new Error('Agent not found')
  }

  // Get relevant documents
  let relevantDocs: any[] = []
  if (knowledgeBaseIds && knowledgeBaseIds.length > 0) {
    const { data: embeddings } = await supabase
      .from('document_embeddings')
      .select(`
        content,
        metadata,
        documents!inner (
          knowledge_base_id
        )
      `)
      .in('documents.knowledge_base_id', knowledgeBaseIds)

    if (embeddings && embeddings.length > 0) {
      relevantDocs = embeddings.slice(0, 5)
    }
  }

  const context = relevantDocs.length > 0 
    ? `\n\nRelevant information:\n${relevantDocs.map(doc => doc.content).join('\n\n')}`
    : ''

  // Apply agent personality
  const systemPrompt = applyAgentPersonality(agent, context)

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: question
      }
    ],
    max_tokens: 1000,
    temperature: 0.7,
  })

  return {
    content: completion.choices[0].message.content,
    agent_used: agent.name,
    sources: relevantDocs.map(doc => ({
      content: doc.content.substring(0, 200) + '...',
      title: doc.metadata?.title || 'Document',
    })),
    confidence: 0.85,
    type: 'single_agent',
    metadata: {
      agent: {
        name: agent.name,
        title: agent.title,
        expertise: agent.expertise,
      }
    },
  }
}

async function handleMultiAgentDebate(
  supabase: any,
  question: string,
  agentIds: string[],
  knowledgeBaseIds?: string[],
  enableDebate: boolean = true
) {
  // Get all agents
  const { data: agents, error: agentsError } = await supabase
    .from('agents')
    .select('*')
    .in('id', agentIds)

  if (agentsError || !agents || agents.length === 0) {
    throw new Error('Agents not found')
  }

  // Get relevant documents
  let relevantDocs: any[] = []
  if (knowledgeBaseIds && knowledgeBaseIds.length > 0) {
    const { data: embeddings } = await supabase
      .from('document_embeddings')
      .select(`
        content,
        metadata,
        documents!inner (
          knowledge_base_id
        )
      `)
      .in('documents.knowledge_base_id', knowledgeBaseIds)

    if (embeddings && embeddings.length > 0) {
      relevantDocs = embeddings.slice(0, 5)
    }
  }

  const context = relevantDocs.length > 0 
    ? `\n\nRelevant information:\n${relevantDocs.map(doc => doc.content).join('\n\n')}`
    : ''

  if (enableDebate) {
    // Generate individual responses
    const responses = await Promise.all(
      agents.map(async (agent) => {
        const systemPrompt = applyAgentPersonality(agent, context)
        
        const completion = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: question
            }
          ],
          max_tokens: 800,
          temperature: 0.7,
        })

        return {
          agent_used: agent.name,
          content: completion.choices[0].message.content,
          agent: {
            name: agent.name,
            title: agent.title,
            expertise: agent.expertise,
          }
        }
      })
    )

    // Generate debate summary
    const debateSummary = await generateDebateSummary(question, responses)
    const consensus = extractConsensus(responses)
    const disagreements = extractDisagreements(responses)

    return {
      content: debateSummary,
      agent_used: `${agents.length} Agents`,
      sources: relevantDocs.map(doc => ({
        content: doc.content.substring(0, 200) + '...',
        title: doc.metadata?.title || 'Document',
      })),
      confidence: 0.9,
      type: 'multi_agent',
      metadata: {
        responses,
        consensus,
        disagreements,
        agent_count: agents.length,
      },
    }
  } else {
    // Simple aggregation without debate
    const responses = await Promise.all(
      agents.map(async (agent) => {
        const systemPrompt = applyAgentPersonality(agent, context)
        
        const completion = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: question
            }
          ],
          max_tokens: 600,
          temperature: 0.7,
        })

        return {
          agent_used: agent.name,
          content: completion.choices[0].message.content,
          agent: {
            name: agent.name,
            title: agent.title,
            expertise: agent.expertise,
          }
        }
      })
    )

    const aggregatedResponse = responses.map(r => 
      `**${r.agent_used} (${r.agent.title}):** ${r.content}`
    ).join('\n\n')

    return {
      content: aggregatedResponse,
      agent_used: `${agents.length} Agents`,
      sources: relevantDocs.map(doc => ({
        content: doc.content.substring(0, 200) + '...',
        title: doc.metadata?.title || 'Document',
      })),
      confidence: 0.85,
      type: 'multi_agent',
      metadata: {
        responses,
        agent_count: agents.length,
      },
    }
  }
}

function applyAgentPersonality(agent: any, context: string) {
  return `You are ${agent.name}, ${agent.title}.

${agent.description}

Core Principles:
${agent.core_principles.map((principle: string) => `- ${principle}`).join('\n')}

Areas of Expertise:
${agent.expertise.map((exp: string) => `- ${exp}`).join('\n')}

Communication Style: ${agent.communication_style}

Persona: ${agent.persona}

${context}

Respond to the user's question in your unique style and perspective, drawing from your expertise and principles.`
}

async function generateDebateSummary(question: string, responses: any[]) {
  const debateContent = responses.map(r => 
    `**${r.agent_used}:** ${r.content}`
  ).join('\n\n')

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are a debate moderator. Analyze the responses from multiple agents and provide a comprehensive summary that highlights key points, areas of agreement, and important differences. Be objective and balanced.'
      },
      {
        role: 'user',
        content: `Question: ${question}\n\nAgent Responses:\n${debateContent}\n\nPlease provide a comprehensive summary of this debate.`
      }
    ],
    max_tokens: 1000,
    temperature: 0.5,
  })

  return completion.choices[0].message.content
}

function extractConsensus(responses: any[]) {
  // Simple consensus extraction - in production, use more sophisticated analysis
  const commonThemes = ['agreement', 'consensus', 'similar', 'aligned']
  return responses.filter(r => 
    commonThemes.some(theme => 
      r.content.toLowerCase().includes(theme)
    )
  ).map(r => r.agent_used)
}

function extractDisagreements(responses: any[]) {
  // Simple disagreement extraction
  const disagreementThemes = ['disagree', 'different', 'contrary', 'oppose']
  return responses.filter(r => 
    disagreementThemes.some(theme => 
      r.content.toLowerCase().includes(theme)
    )
  ).map(r => r.agent_used)
}

export async function GET() {
  return NextResponse.json({
    message: 'Chat API está funcionando',
    endpoints: {
      POST: 'Enviar mensagem para chat'
    }
  })
}
