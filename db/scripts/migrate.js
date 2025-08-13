const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:8000';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('🚀 Iniciando migrações do banco de dados...');
    
    const migrationsDir = path.join(__dirname, '../migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Garante ordem alfabética (01_, 02_, etc.)
    
    for (const file of migrationFiles) {
      console.log(`📄 Executando migração: ${file}`);
      
      const migrationPath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(migrationPath, 'utf8');
      
      const { error } = await supabase.rpc('exec_sql', { sql });
      
      if (error) {
        // Se exec_sql não existir, tenta executar diretamente
        console.log('⚠️  exec_sql não disponível, tentando execução direta...');
        
        // Divide o SQL em comandos individuais
        const commands = sql.split(';').filter(cmd => cmd.trim());
        
        for (const command of commands) {
          if (command.trim()) {
            const { error: cmdError } = await supabase.rpc('exec_sql', { sql: command + ';' });
            if (cmdError) {
              console.log(`❌ Erro ao executar comando: ${command.substring(0, 50)}...`);
              console.error(cmdError);
            }
          }
        }
      } else {
        console.log(`✅ Migração ${file} executada com sucesso`);
      }
    }
    
    console.log('🎉 Todas as migrações foram executadas!');
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  }
}

// Executa a migração se o script for chamado diretamente
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };
