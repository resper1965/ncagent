const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://nsecops-ness-supabase.pzgnh1.easypanel.host';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('🚀 Iniciando configuração do banco de dados...');

    // 1. Testar conexão básica
    console.log('🔍 Testando conexão básica...');
    const { data: testData, error: testError } = await supabase
      .from('_dummy_table_that_does_not_exist')
      .select('*')
      .limit(1);

    if (testError && testError.code === 'PGRST116') {
      console.log('✅ Conexão com Supabase funcionando!');
    } else {
      console.log('⚠️ Status da conexão:', testError ? testError.message : 'OK');
    }

    // 2. Criar tabela product_versions diretamente
    console.log('📋 Criando tabela product_versions...');
    
    // Primeiro, vamos tentar inserir dados para ver se a tabela existe
    const { data: insertData, error: insertError } = await supabase
      .from('product_versions')
      .insert([
        {
          product_name: 'n.cagent',
          version: '1.0.0',
          description: 'Versão inicial do n.cagent'
        }
      ])
      .select();

    if (insertError) {
      console.log('❌ Erro ao inserir dados:', insertError.message);
      console.log('💡 A tabela product_versions não existe. Precisamos criá-la via SQL direto.');
      
      // Vamos tentar criar via SQL direto
      console.log('🔧 Tentando criar tabela via SQL...');
      
      // Como não temos acesso direto ao SQL, vamos criar uma tabela simples
      // usando a API REST do Supabase
      
      // Vamos tentar criar uma tabela de teste primeiro
      const { data: createTest, error: createError } = await supabase
        .from('test_table')
        .insert([{ name: 'test' }])
        .select();

      if (createError) {
        console.log('❌ Não é possível criar tabelas via REST API');
        console.log('💡 Solução: Use o dashboard do Supabase para criar as tabelas manualmente');
        console.log('📋 Tabelas necessárias:');
        console.log('   - ncmd.product_versions');
        console.log('   - conversation_sessions');
        console.log('   - conversation_messages');
        console.log('   - agents');
        console.log('   - agent_datasets');
        console.log('   - documents');
        console.log('   - chunks');
      }
    } else {
      console.log('✅ Tabela product_versions existe e dados inseridos com sucesso!');
      console.log('📊 Dados inseridos:', insertData);
    }

    // 3. Testar health check
    console.log('🔍 Testando health check...');
    const { data: healthData, error: healthError } = await supabase
      .from('product_versions')
      .select('count')
      .limit(1);

    if (healthError) {
      console.log('❌ Health check falhou:', healthError.message);
    } else {
      console.log('✅ Health check passou!');
      console.log('📊 Dados encontrados:', healthData);
    }

    console.log('🎉 Configuração do banco concluída!');

  } catch (error) {
    console.error('❌ Erro durante a configuração:', error);
  }
}

// Executar a configuração
setupDatabase();
