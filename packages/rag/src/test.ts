import { RAGService } from './index';

// Função de teste simples
export async function testRAGService() {
  try {
    console.log('🧪 Testando RAG Service...');
    
    const ragService = new RAGService();
    
    // Teste 1: Obter estatísticas
    console.log('📊 Obtendo estatísticas...');
    const stats = await ragService.getStats();
    console.log('Estatísticas:', stats);
    
    // Teste 2: Obter versões ativas
    console.log('🏷️  Obtendo versões ativas...');
    const versions = await ragService.getActiveVersions();
    console.log('Versões ativas:', versions);
    
    // Teste 3: Pergunta simples (se houver dados)
    if (versions.length > 0) {
      console.log('❓ Testando pergunta...');
      const answer = await ragService.ask('O que é nCommand Lite?', {
        versionTag: versions[0],
        role: 'reader'
      });
      console.log('Resposta:', answer);
    }
    
    console.log('✅ Teste concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

// Executa o teste se chamado diretamente
if (require.main === module) {
  testRAGService();
}
