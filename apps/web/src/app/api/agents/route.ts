import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

// Função para criar cliente Supabase
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase configuration is missing')
  }
  
  return createClient(supabaseUrl, supabaseServiceKey)
}

// Schema para criar/atualizar agente
const agentSchema = z.object({
  name: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  persona: z.string().min(1).max(2000),
  expertise: z.array(z.string()).min(1),
  communication_style: z.enum(['formal', 'casual', 'technical', 'friendly']),
  knowledge_base_ids: z.array(z.string()).optional(),
  is_active: z.boolean().default(true)
})

// GET - Listar agentes
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()
    
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    let query = supabase
      .from('ncmd.agents')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (active === 'true') {
      query = query.eq('is_active', true)
    }
    
    const { data: agents, error } = await query
    
    if (error) {
      throw new Error(`Erro ao buscar agentes: ${error.message}`)
    }
    
    return NextResponse.json({
      success: true,
      data: {
        agents: agents || [],
        pagination: {
          limit,
          offset,
          hasMore: (agents?.length || 0) === limit
        }
      }
    })
    
  } catch (error) {
    console.error('❌ Erro ao listar agentes:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

// POST - Criar novo agente
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()
    
    const body = await request.json()
    const validatedData = agentSchema.parse(body)
    
    console.log(`🤖 Criando agente: "${validatedData.name}"`)
    
    const { data: agent, error } = await supabase
      .from('ncmd.agents')
      .insert(validatedData)
      .select()
      .single()
    
    if (error) {
      throw new Error(`Erro ao criar agente: ${error.message}`)
    }
    
    console.log(`✅ Agente criado: ${agent.name}`)
    
    return NextResponse.json({
      success: true,
      data: {
        agent: agent
      }
    })
    
  } catch (error) {
    console.error('❌ Erro ao criar agente:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Dados inválidos',
        details: error.errors
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
