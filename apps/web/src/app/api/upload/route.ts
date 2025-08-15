import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '../../../lib/supabase'
import { z } from 'zod'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const uploadSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  fileType: z.string(),
  fileSize: z.number().positive(),
  knowledgeBaseId: z.string().uuid().optional(),
  metadata: z.record(z.any()).optional(),
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
    const validatedData = uploadSchema.parse(body)

    // Create document
    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert({
        title: validatedData.title,
        content: validatedData.content,
        file_type: validatedData.fileType,
        file_size: validatedData.fileSize,
        user_id: user.id,
        knowledge_base_id: validatedData.knowledgeBaseId,
        metadata: validatedData.metadata || {},
      })
      .select()
      .single()

    if (docError) {
      console.error('Document creation error:', docError)
      return NextResponse.json({ error: 'Failed to create document' }, { status: 500 })
    }

    // Generate embeddings for vector search
    try {
      const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: validatedData.content,
        encoding_format: 'float',
      })

      const embedding = embeddingResponse.data[0].embedding

      // Store embedding
      await supabase
        .from('document_embeddings')
        .insert({
          document_id: document.id,
          content: validatedData.content,
          embedding,
          metadata: {
            title: validatedData.title,
            file_type: validatedData.fileType,
            ...validatedData.metadata,
          },
        })

    } catch (embeddingError) {
      console.error('Embedding generation error:', embeddingError)
      // Continue without embedding - document is still created
    }

    return NextResponse.json({
      success: true,
      data: {
        document: {
          id: document.id,
          title: document.title,
          file_type: document.file_type,
          created_at: document.created_at,
        }
      }
    })

  } catch (error) {
    console.error('Upload error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid request data', 
        details: error.errors 
      }, { status: 400 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
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

    // Get documents for user
    const { data: documents, error } = await supabase
      .from('documents')
      .select(`
        id,
        title,
        file_type,
        file_size,
        created_at,
        updated_at,
        knowledge_bases (
          id,
          name
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Documents fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        documents: documents || []
      }
    })

  } catch (error) {
    console.error('Documents fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
