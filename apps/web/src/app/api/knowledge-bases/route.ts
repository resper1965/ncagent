import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '../../../lib/supabase'
import { z } from 'zod'

const knowledgeBaseSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  category: z.string().default('general'),
  tags: z.array(z.string()).default([]),
  is_enabled: z.boolean().default(true),
})

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

    // Get knowledge bases for user with document count
    const { data: knowledgeBases, error } = await supabase
      .from('knowledge_bases')
      .select(`
        *,
        documents:documents(count)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Knowledge bases fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch knowledge bases' }, { status: 500 })
    }

    // Transform data to include document count
    const transformedKBs = knowledgeBases?.map(kb => ({
      ...kb,
      document_count: kb.documents?.[0]?.count || 0,
      documents: undefined // Remove the nested documents object
    })) || []

    return NextResponse.json({
      success: true,
      data: {
        knowledge_bases: transformedKBs
      }
    })

  } catch (error) {
    console.error('Knowledge bases fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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
    const validatedData = knowledgeBaseSchema.parse(body)

    // Create knowledge base
    const { data: knowledgeBase, error: createError } = await supabase
      .from('knowledge_bases')
      .insert({
        ...validatedData,
        user_id: user.id,
      })
      .select()
      .single()

    if (createError) {
      console.error('Knowledge base creation error:', createError)
      return NextResponse.json({ error: 'Failed to create knowledge base' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        knowledge_base: knowledgeBase
      }
    })

  } catch (error) {
    console.error('Knowledge base creation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid request data', 
        details: error.errors 
      }, { status: 400 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
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
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json({ error: 'Knowledge base ID is required' }, { status: 400 })
    }

    const validatedData = knowledgeBaseSchema.partial().parse(updateData)

    // Update knowledge base
    const { data: knowledgeBase, error: updateError } = await supabase
      .from('knowledge_bases')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user owns the KB
      .select()
      .single()

    if (updateError) {
      console.error('Knowledge base update error:', updateError)
      return NextResponse.json({ error: 'Failed to update knowledge base' }, { status: 500 })
    }

    if (!knowledgeBase) {
      return NextResponse.json({ error: 'Knowledge base not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        knowledge_base: knowledgeBase
      }
    })

  } catch (error) {
    console.error('Knowledge base update error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid request data', 
        details: error.errors 
      }, { status: 400 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Knowledge base ID is required' }, { status: 400 })
    }

    // Delete knowledge base (cascade will handle related documents)
    const { error: deleteError } = await supabase
      .from('knowledge_bases')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user owns the KB

    if (deleteError) {
      console.error('Knowledge base deletion error:', deleteError)
      return NextResponse.json({ error: 'Failed to delete knowledge base' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'Knowledge base deleted successfully'
      }
    })

  } catch (error) {
    console.error('Knowledge base deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
