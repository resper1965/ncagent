import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

// Função para criar cliente Supabase com validação
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase configuration is missing. Please check environment variables.');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Schema para atualizar documento
const updateDocumentSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  scope: z.enum(['GENERAL', 'SECURITY', 'DEV', 'INFRA']).optional(),
  classification: z.enum(['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'PII']).optional()
});

// GET - Listar documentos com filtros
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    
    const { searchParams } = new URL(request.url);
    const versionTag = searchParams.get('version');
    const scope = searchParams.get('scope');
    const classification = searchParams.get('classification');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    let query = supabase
      .from('ncmd.documents')
      .select(`
        *,
        chunks:chunks(count)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Aplicar filtros
    if (versionTag) {
      query = query.eq('version_tag', versionTag);
    }
    
    if (scope) {
      query = query.eq('scope', scope);
    }
    
    if (classification) {
      query = query.eq('classification', classification);
    }
    
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }
    
    const { data: documents, error } = await query;
    
    if (error) {
      throw new Error(`Erro ao buscar documentos: ${error.message}`);
    }
    
    return NextResponse.json({
      success: true,
      data: {
        documents: documents || [],
        pagination: {
          limit,
          offset,
          hasMore: (documents?.length || 0) === limit
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Erro ao listar documentos:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

// PUT - Atualizar documento
export async function PUT(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    
    // TODO: Verificar permissões
    
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('id');
    
    if (!documentId) {
      return NextResponse.json({
        success: false,
        error: 'ID do documento é obrigatório'
      }, { status: 400 });
    }
    
    const body = await request.json();
    const validatedData = updateDocumentSchema.parse(body);
    
    console.log(`🔄 Atualizando documento: ${documentId}`);
    
    const { data: document, error } = await supabase
      .from('ncmd.documents')
      .update(validatedData)
      .eq('id', documentId)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Erro ao atualizar documento: ${error.message}`);
    }
    
    if (!document) {
      return NextResponse.json({
        success: false,
        error: 'Documento não encontrado'
      }, { status: 404 });
    }
    
    console.log(`✅ Documento atualizado: ${document.title}`);
    
    return NextResponse.json({
      success: true,
      data: {
        document: document
      }
    });
    
  } catch (error) {
    console.error('❌ Erro ao atualizar documento:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Dados inválidos',
        details: error.errors
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

// DELETE - Deletar documento
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    
    // TODO: Verificar permissões de admin
    
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('id');
    
    if (!documentId) {
      return NextResponse.json({
        success: false,
        error: 'ID do documento é obrigatório'
      }, { status: 400 });
    }
    
    console.log(`🗑️  Deletando documento: ${documentId}`);
    
    // Deletar documento (cascata para chunks e embeddings)
    const { error } = await supabase
      .from('ncmd.documents')
      .delete()
      .eq('id', documentId);
    
    if (error) {
      throw new Error(`Erro ao deletar documento: ${error.message}`);
    }
    
    console.log(`✅ Documento deletado: ${documentId}`);
    
    return NextResponse.json({
      success: true,
      data: {
        message: 'Documento deletado com sucesso'
      }
    });
    
  } catch (error) {
    console.error('❌ Erro ao deletar documento:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}
