import { NextRequest, NextResponse } from 'next/server'
import { ragService } from '../../../lib/rag-service'

export async function POST(request: NextRequest) {
  try {
    const { question, role = 'user', versionTag } = await request.json()

    if (!question) {
      return NextResponse.json({ 
        error: 'Pergunta é obrigatória' 
      }, { status: 400 })
    }

    console.log(`🤖 Processando pergunta: "${question}" para role: ${role}`)

    // Processar pergunta com RAG real
    const result = await ragService.processQuestion(question, {
      role,
      limit: 5,
      threshold: 0.7,
      versionTag,
      maxTokens: 1000
    })

    return NextResponse.json({
      answer: result.answer,
      sources: result.sources.map(chunk => ({
        id: chunk.id,
        content: chunk.content.substring(0, 200) + '...',
        similarity: chunk.similarity,
        document_id: chunk.document_id,
        chunk_index: chunk.chunk_index
      })),
      confidence: result.confidence
    })

  } catch (error) {
    console.error('❌ Erro ao processar pergunta:', error)
    
    // Se for erro de configuração, retornar erro específico
    if (error instanceof Error && error.message.includes('OPENAI_API_KEY')) {
      return NextResponse.json({ 
        error: 'Configuração OpenAI não encontrada',
        details: 'Verifique as variáveis de ambiente'
      }, { status: 500 })
    }

    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'API RAG ativa',
    endpoints: {
      ask: 'POST /api/ask',
      status: 'GET /api/ask'
    },
    config: {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configurado' : 'Não configurado',
      openaiKey: process.env.OPENAI_API_KEY ? 'Configurado' : 'Não configurado',
      embeddings: process.env.OPENAI_API_KEY ? 'Disponível' : 'Não configurado'
    },
    features: {
      semanticSearch: true,
      documentRetrieval: true,
      aiGeneration: true,
      versionControl: true
    }
  })
}
