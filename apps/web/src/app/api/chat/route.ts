import { NextRequest, NextResponse } from 'next/server'
import { ragService } from '../../../lib/rag-service'
import { createClient } from '@supabase/supabase-js'

// Função para criar cliente Supabase
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase configuration is missing')
  }
  
  return createClient(supabaseUrl, supabaseServiceKey)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      question, 
      agentId, 
      agentIds, 
      enable_debate = false,
      enable_memory = true,
      sessionId 
    } = body

    if (!question) {
      return NextResponse.json({ 
        error: 'Pergunta é obrigatória' 
      }, { status: 400 })
    }

    console.log(`🤖 Chat: "${question}" - Agentes: ${agentId || agentIds?.length || 'default'}`)

    // Se múltiplos agentes selecionados e debate habilitado
    if (agentIds && agentIds.length > 1 && enable_debate) {
      return await handleMultiAgentDebate(question, agentIds, sessionId)
    }

    // Se agente específico selecionado
    if (agentId) {
      return await handleSingleAgent(question, agentId, sessionId)
    }

    // Resposta padrão com RAG
    return await handleDefaultRAG(question, sessionId)

  } catch (error) {
    console.error('❌ Erro no chat:', error)
    
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function handleDefaultRAG(question: string, sessionId?: string) {
  try {
    const result = await ragService.processQuestion(question, {
      limit: 5,
      threshold: 0.7,
      maxTokens: 1000
    })

    // Salvar na sessão se habilitado
    if (sessionId) {
      await saveToSession(sessionId, question, result.answer)
    }

    return NextResponse.json({
      success: true,
      data: {
        answer: result.answer,
        sources: result.sources.map(chunk => ({
          id: chunk.id,
          content: chunk.content.substring(0, 200) + '...',
          similarity: chunk.similarity,
          document_id: chunk.document_id
        })),
        confidence: result.confidence,
        type: 'default',
        session_id: sessionId
      }
    })

  } catch (error) {
    console.error('Erro no RAG padrão:', error)
    throw error
  }
}

async function handleSingleAgent(question: string, agentId: string, sessionId?: string) {
  try {
    // Buscar dados do agente
    const supabase = createSupabaseClient()
    const { data: agent, error } = await supabase
      .from('ncmd.agents')
      .select('*')
      .eq('id', agentId)
      .single()

    if (error || !agent) {
      return NextResponse.json({
        error: 'Agente não encontrado'
      }, { status: 404 })
    }

    // Processar com contexto do agente
    const result = await ragService.processQuestion(question, {
      limit: 5,
      threshold: 0.7,
      maxTokens: 1000
    })

    // Aplicar personalidade do agente
    const agentResponse = await applyAgentPersonality(result.answer, agent)

    // Salvar na sessão se habilitado
    if (sessionId) {
      await saveToSession(sessionId, question, agentResponse)
    }

    return NextResponse.json({
      success: true,
      data: {
        answer: agentResponse,
        sources: result.sources,
        confidence: result.confidence,
        agent_used: agent.name,
        type: 'single_agent',
        session_id: sessionId
      }
    })

  } catch (error) {
    console.error('Erro no agente único:', error)
    throw error
  }
}

async function handleMultiAgentDebate(question: string, agentIds: string[], sessionId?: string) {
  try {
    const supabase = createSupabaseClient()
    
    // Buscar todos os agentes
    const { data: agents, error } = await supabase
      .from('ncmd.agents')
      .select('*')
      .in('id', agentIds)

    if (error || !agents) {
      return NextResponse.json({
        error: 'Erro ao buscar agentes'
      }, { status: 500 })
    }

    // Processar resposta de cada agente
    const responses = await Promise.all(
      agents.map(async (agent) => {
        const result = await ragService.processQuestion(question, {
          limit: 3,
          threshold: 0.7,
          maxTokens: 800
        })
        
        const agentResponse = await applyAgentPersonality(result.answer, agent)
        
        return {
          agent: agent.name,
          response: agentResponse,
          confidence: result.confidence,
          sources: result.sources
        }
      })
    )

    // Gerar resumo do debate
    const debateSummary = await generateDebateSummary(question, responses)

    // Salvar na sessão se habilitado
    if (sessionId) {
      await saveToSession(sessionId, question, debateSummary)
    }

    return NextResponse.json({
      success: true,
      data: {
        debate_summary: debateSummary,
        responses: responses,
        consensus: extractConsensus(responses),
        disagreements: extractDisagreements(responses),
        type: 'multi_agent',
        session_id: sessionId
      }
    })

  } catch (error) {
    console.error('Erro no debate multi-agente:', error)
    throw error
  }
}

async function applyAgentPersonality(answer: string, agent: any): Promise<string> {
  // Simular aplicação da personalidade do agente
  // TODO: Implementar com OpenAI para personalizar resposta
  return `${answer}\n\n[Respondido por ${agent.name} - ${agent.title}]`
}

async function generateDebateSummary(question: string, responses: any[]): Promise<string> {
  // Simular geração de resumo do debate
  // TODO: Implementar com OpenAI para gerar resumo
  const agentNames = responses.map(r => r.agent).join(', ')
  return `Debate entre ${agentNames} sobre: "${question}"\n\nRespostas foram analisadas e consenso foi alcançado.`
}

function extractConsensus(responses: any[]): string {
  // Simular extração de consenso
  return "Os agentes concordam sobre os pontos principais da questão."
}

function extractDisagreements(responses: any[]): string[] {
  // Simular extração de discordâncias
  return ["Pequenas diferenças de abordagem foram identificadas."]
}

async function saveToSession(sessionId: string, question: string, answer: string) {
  try {
    const supabase = createSupabaseClient()
    
    await supabase
      .from('ncmd.chat_sessions')
      .upsert({
        id: sessionId,
        question,
        answer,
        created_at: new Date().toISOString()
      })
  } catch (error) {
    console.error('Erro ao salvar sessão:', error)
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Chat API está funcionando',
    endpoints: {
      POST: 'Enviar mensagem para chat'
    }
  })
}
