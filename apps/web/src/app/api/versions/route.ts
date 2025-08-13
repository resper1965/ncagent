import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nsecops-ness-supabase.pzgnh1.easypanel.host';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Schema para criar versão
const createVersionSchema = z.object({
  versionTag: z.string().min(1, 'Tag da versão é obrigatória').max(50, 'Tag muito longa'),
  isActive: z.boolean().default(true)
});

// Schema para atualizar versão
const updateVersionSchema = z.object({
  isActive: z.boolean()
});

// GET - Listar versões
export async function GET() {
  try {
    const { data: versions, error } = await supabase
      .from('ncmd.product_versions')
      .select('*')
      .order('version_tag');
    
    if (error) {
      throw new Error(`Erro ao buscar versões: ${error.message}`);
    }
    
    return NextResponse.json({
      success: true,
      data: {
        versions: versions || []
      }
    });
    
  } catch (error) {
    console.error('❌ Erro ao listar versões:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

// POST - Criar nova versão
export async function POST(request: NextRequest) {
  try {
    // TODO: Verificar permissões de admin
    
    const body = await request.json();
    const validatedData = createVersionSchema.parse(body);
    
    console.log(`🏷️  Criando versão: ${validatedData.versionTag}`);
    
    // Verificar se versão já existe
    const { data: existingVersion } = await supabase
      .from('ncmd.product_versions')
      .select('id')
      .eq('version_tag', validatedData.versionTag)
      .single();
    
    if (existingVersion) {
      return NextResponse.json({
        success: false,
        error: 'Versão já existe',
        data: { versionTag: validatedData.versionTag }
      }, { status: 409 });
    }
    
    // Criar versão
    const { data: version, error } = await supabase
      .from('ncmd.product_versions')
      .insert({
        version_tag: validatedData.versionTag,
        is_active: validatedData.isActive
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Erro ao criar versão: ${error.message}`);
    }
    
    console.log(`✅ Versão criada: ${version.id}`);
    
    return NextResponse.json({
      success: true,
      data: {
        version: version
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('❌ Erro ao criar versão:', error);
    
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

// PUT - Atualizar versão
export async function PUT(request: NextRequest) {
  try {
    // TODO: Verificar permissões de admin
    
    const { searchParams } = new URL(request.url);
    const versionId = searchParams.get('id');
    
    if (!versionId) {
      return NextResponse.json({
        success: false,
        error: 'ID da versão é obrigatório'
      }, { status: 400 });
    }
    
    const body = await request.json();
    const validatedData = updateVersionSchema.parse(body);
    
    console.log(`🔄 Atualizando versão: ${versionId}`);
    
    const { data: version, error } = await supabase
      .from('ncmd.product_versions')
      .update({
        is_active: validatedData.isActive
      })
      .eq('id', versionId)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Erro ao atualizar versão: ${error.message}`);
    }
    
    if (!version) {
      return NextResponse.json({
        success: false,
        error: 'Versão não encontrada'
      }, { status: 404 });
    }
    
    console.log(`✅ Versão atualizada: ${version.version_tag}`);
    
    return NextResponse.json({
      success: true,
      data: {
        version: version
      }
    });
    
  } catch (error) {
    console.error('❌ Erro ao atualizar versão:', error);
    
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

// DELETE - Deletar versão
export async function DELETE(request: NextRequest) {
  try {
    // TODO: Verificar permissões de admin
    
    const { searchParams } = new URL(request.url);
    const versionId = searchParams.get('id');
    
    if (!versionId) {
      return NextResponse.json({
        success: false,
        error: 'ID da versão é obrigatório'
      }, { status: 400 });
    }
    
    console.log(`🗑️  Deletando versão: ${versionId}`);
    
    // Verificar se há documentos associados
    const { data: documents, error: docsError } = await supabase
      .from('ncmd.documents')
      .select('id, title')
      .eq('version_tag', versionId)
      .limit(1);
    
    if (docsError) {
      throw new Error(`Erro ao verificar documentos: ${docsError.message}`);
    }
    
    if (documents && documents.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Não é possível deletar versão com documentos associados',
        data: { documentCount: documents.length }
      }, { status: 409 });
    }
    
    // Deletar versão
    const { error } = await supabase
      .from('ncmd.product_versions')
      .delete()
      .eq('id', versionId);
    
    if (error) {
      throw new Error(`Erro ao deletar versão: ${error.message}`);
    }
    
    console.log(`✅ Versão deletada: ${versionId}`);
    
    return NextResponse.json({
      success: true,
      data: {
        message: 'Versão deletada com sucesso'
      }
    });
    
  } catch (error) {
    console.error('❌ Erro ao deletar versão:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}
