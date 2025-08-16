import { OpenAIEmbeddings } from '@langchain/openai';
import type { EmbeddingResult } from './types';

export class EmbeddingService {
  private embeddings: OpenAIEmbeddings;

  constructor() {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is required');
    }

    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: openaiApiKey,
      modelName: process.env.RAG_EMBEDDING_MODEL || 'text-embedding-3-small',
      maxConcurrency: 5,
      batchSize: 512
    });
  }

  /**
   * Gera embedding para um texto
   */
  async embedText(text: string): Promise<EmbeddingResult> {
    try {
      const startTime = Date.now();
      
      const embedding = await this.embeddings.embedQuery(text);
      
      const latency = Date.now() - startTime;
      
      return {
        embedding,
        tokens: this.estimateTokens(text),
        latency
      };
    } catch (error) {
      throw new Error(`Erro ao gerar embedding: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Gera embeddings para múltiplos textos
   */
  async embedTexts(texts: string[]): Promise<EmbeddingResult[]> {
    try {
      const startTime = Date.now();
      
      const embeddings = await this.embeddings.embedDocuments(texts);
      
      const latency = Date.now() - startTime;
      
      return embeddings.map((embedding, index) => ({
        embedding,
        tokens: this.estimateTokens(texts[index]),
        latency: latency / texts.length
      }));
    } catch (error) {
      throw new Error(`Erro ao gerar embeddings: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Calcula similaridade entre dois embeddings
   */
  calculateSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) {
      throw new Error('Embeddings devem ter o mesmo tamanho');
    }

    const dotProduct = embedding1.reduce((sum, val, i) => sum + val * embedding2[i], 0);
    const magnitude1 = Math.sqrt(embedding1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(embedding2.reduce((sum, val) => sum + val * val, 0));

    return dotProduct / (magnitude1 * magnitude2);
  }

  /**
   * Estima o número de tokens em um texto
   */
  private estimateTokens(text: string): number {
    // Estimativa simples: ~4 caracteres por token
    return Math.ceil(text.length / 4);
  }

  /**
   * Verifica se o serviço está funcionando
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.embedText('test');
      return true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}
