const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuração do Supabase
const supabaseUrl = 'https://nsecops-ness-supabase.pzgnh1.easypanel.host';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('🚀 Iniciando configuração do banco de dados...');

    // 1. Criar schema ncmd
    console.log('📋 Criando schema ncmd...');
    const { error: schemaError } = await supabase.rpc('exec_sql', {
      sql: 'CREATE SCHEMA IF NOT EXISTS ncmd;'
    });
    
    if (schemaError) {
      console.log('⚠️ Erro ao criar schema (pode já existir):', schemaError.message);
    } else {
      console.log('✅ Schema ncmd criado com sucesso!');
    }

    // 2. Criar tabela product_versions (necessária para o health check)
    console.log('📋 Criando tabela product_versions...');
    const createProductVersionsSQL = `
      CREATE TABLE IF NOT EXISTS ncmd.product_versions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        product_name VARCHAR(100) NOT NULL,
        version VARCHAR(50) NOT NULL,
        description TEXT,
        release_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    const { error: productVersionsError } = await supabase.rpc('exec_sql', {
      sql: createProductVersionsSQL
    });

    if (productVersionsError) {
      console.log('⚠️ Erro ao criar tabela product_versions:', productVersionsError.message);
    } else {
      console.log('✅ Tabela product_versions criada com sucesso!');
    }

    // 3. Inserir dados de teste na tabela product_versions
    console.log('📋 Inserindo dados de teste...');
    const insertDataSQL = `
      INSERT INTO ncmd.product_versions (product_name, version, description)
      VALUES 
        ('n.cagent', '1.0.0', 'Versão inicial do n.cagent'),
        ('n.secops', '1.0.0', 'Versão inicial do n.secops')
      ON CONFLICT DO NOTHING;
    `;

    const { error: insertError } = await supabase.rpc('exec_sql', {
      sql: insertDataSQL
    });

    if (insertError) {
      console.log('⚠️ Erro ao inserir dados:', insertError.message);
    } else {
      console.log('✅ Dados de teste inseridos com sucesso!');
    }

    // 4. Testar a conexão
    console.log('🔍 Testando conexão...');
    const { data, error: testError } = await supabase
      .from('ncmd.product_versions')
      .select('count')
      .limit(1);

    if (testError) {
      console.log('❌ Erro no teste de conexão:', testError.message);
    } else {
      console.log('✅ Conexão testada com sucesso!');
      console.log('📊 Dados encontrados:', data);
    }

    console.log('🎉 Configuração do banco concluída!');

  } catch (error) {
    console.error('❌ Erro durante a configuração:', error);
  }
}

// Executar a configuração
setupDatabase();
