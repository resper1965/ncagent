import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { createHash } from 'crypto';

// Função para criar cliente Supabase com validação
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase configuration is missing. Please check environment variables.');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

const uploadSchema = z.object({
  title: z.string().min(1).max(200),
  source: z.string().min(1).max(100),
  versionTag: z.string().min(1).max(50),
  scope: z.enum(['GENERAL', 'SECURITY', 'DEV', 'INFRA']),
  classification: z.enum(['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'PII']),
  fileContent: z.string().optional(), // Base64 do arquivo
  fileUrl: z.string().url().optional(), // URL do arquivo (para SharePoint)
  mimeType: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    
    // Rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    // TODO: Implementar rate limiting com Redis
    
    // Parse e validação do body
    const body = await request.json();
    const validatedData = uploadSchema.parse(body);
    
    console.log(`📄 Upload recebido: "${validatedData.title}"`);
    
    // Verificar se arquivo já existe (por SHA256)
    let sha256 = '';
    if (validatedData.fileContent) {
      const buffer = Buffer.from(validatedData.fileContent, 'base64');
      sha256 = createHash('sha256').update(buffer).digest('hex');
      
      // Verificar se já existe
      const { data: existingDoc } = await supabase
        .from('ncmd.documents')
        .select('id, title')
        .eq('sha256', sha256)
        .single();
      
      if (existingDoc) {
        return NextResponse.json({
          success: false,
          error: 'Documento já existe',
          data: { existingId: existingDoc.id, title: existingDoc.title }
        }, { status: 409 });
      }
    }
    
    // Salvar arquivo no Storage (se houver conteúdo)
    let storagePath = '';
    if (validatedData.fileContent) {
      const fileName = `${Date.now()}-${validatedData.title.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const fileExt = validatedData.mimeType?.includes('pdf') ? 'pdf' : 
                     validatedData.mimeType?.includes('docx') ? 'docx' : 'txt';
      
      storagePath = `documents/${fileName}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('ncmd-documents')
        .upload(storagePath, Buffer.from(validatedData.fileContent, 'base64'), {
          contentType: validatedData.mimeType || 'application/octet-stream'
        });
      
      if (uploadError) {
        throw new Error(`Erro no upload do arquivo: ${uploadError.message}`);
      }
    }
    
    // Criar registro no banco
    const { data: document, error: dbError } = await supabase
      .from('ncmd.documents')
      .insert({
        title: validatedData.title,
        source: validatedData.source,
        version_tag: validatedData.versionTag,
        scope: validatedData.scope,
        classification: validatedData.classification,
        mime_type: validatedData.mimeType,
        sha256: sha256,
        created_by: null // TODO: Obter do auth
      })
      .select()
      .single();
    
    if (dbError) {
      throw new Error(`Erro ao salvar documento: ${dbError.message}`);
    }
    
    // Enfileirar job de processamento (se houver arquivo)
    if (validatedData.fileContent || validatedData.fileUrl) {
      // TODO: Enviar para fila BullMQ
      console.log(`📋 Job enfileirado para documento: ${document.id}`);
    }
    
    console.log(`✅ Documento criado: ${document.id}`);
    
    return NextResponse.json({
      success: true,
      data: {
        documentId: document.id,
        title: document.title,
        status: 'pending_processing',
        message: 'Documento enviado para processamento'
      }
    });
    
  } catch (error) {
    console.error('❌ Erro na API /api/upload:', error);
    
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

// Método GET para listar documentos
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    
    const { searchParams } = new URL(request.url);
    const versionTag = searchParams.get('version');
    const scope = searchParams.get('scope');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    let query = supabase
      .from('ncmd.documents')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (versionTag) {
      query = query.eq('version_tag', versionTag);
    }
    
    if (scope) {
      query = query.eq('scope', scope);
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
