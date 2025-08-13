const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:8000';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedData() {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');
    
    // 1. Inserir versões do produto
    console.log('📦 Inserindo versões do produto...');
    const { error: versionsError } = await supabase
      .from('ncmd.product_versions')
      .insert([
        { version_tag: '1.0', is_active: true },
        { version_tag: '1.1', is_active: true },
        { version_tag: '2.0', is_active: true },
        { version_tag: 'ALL', is_active: true }
      ]);
    
    if (versionsError) {
      console.log('⚠️  Versões já existem ou erro:', versionsError.message);
    } else {
      console.log('✅ Versões inseridas com sucesso');
    }
    
    // 2. Inserir documentos de exemplo
    console.log('📄 Inserindo documentos de exemplo...');
    const { data: documents, error: docsError } = await supabase
      .from('ncmd.documents')
      .insert([
        {
          title: 'Manual do Usuário nCommand Lite v1.0',
          source: 'upload',
          version_tag: '1.0',
          scope: 'GENERAL',
          classification: 'PUBLIC',
          mime_type: 'application/pdf',
          sha256: 'abc123def456',
          created_by: null
        },
        {
          title: 'Guia de Segurança nCommand Lite',
          source: 'upload',
          version_tag: 'ALL',
          scope: 'SECURITY',
          classification: 'INTERNAL',
          mime_type: 'application/pdf',
          sha256: 'def456ghi789',
          created_by: null
        },
        {
          title: 'API Reference v2.0',
          source: 'upload',
          version_tag: '2.0',
          scope: 'DEV',
          classification: 'INTERNAL',
          mime_type: 'text/markdown',
          sha256: 'ghi789jkl012',
          created_by: null
        }
      ])
      .select();
    
    if (docsError) {
      console.log('⚠️  Documentos já existem ou erro:', docsError.message);
    } else {
      console.log('✅ Documentos inseridos com sucesso');
      
      // 3. Inserir chunks de exemplo (se documentos foram criados)
      if (documents && documents.length > 0) {
        console.log('🔍 Inserindo chunks de exemplo...');
        
        const chunks = [];
        documents.forEach((doc, docIndex) => {
          // Cria alguns chunks de exemplo para cada documento
          for (let i = 0; i < 3; i++) {
            chunks.push({
              document_id: doc.id,
              chunk_index: i,
              content: `Este é o chunk ${i + 1} do documento "${doc.title}". Contém informações importantes sobre o nCommand Lite.`,
              tokens: 50 + (i * 10),
              version_tag: doc.version_tag,
              scope: doc.scope,
              classification: doc.classification
            });
          }
        });
        
        const { error: chunksError } = await supabase
          .from('ncmd.chunks')
          .insert(chunks);
        
        if (chunksError) {
          console.log('⚠️  Chunks já existem ou erro:', chunksError.message);
        } else {
          console.log('✅ Chunks inseridos com sucesso');
        }
      }
    }
    
    console.log('🎉 Seed concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    process.exit(1);
  }
}

// Executa o seed se o script for chamado diretamente
if (require.main === module) {
  seedData();
}

module.exports = { seedData };
