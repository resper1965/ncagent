// Importa todas as classes e tipos principais
import { SupabaseRAGClient } from './client';
import { EmbeddingService } from './embeddings';
import { RAGRetriever } from './retriever';
import { AnswerService } from './answer';

// Importa tipos
import type {
  ChunkResult,
  RetrieveOptions,
  AnswerResult,
  EmbeddingResult,
  DocumentMetadata,
  ChunkMetadata,
  UserRole,
  DocumentScope,
  DocumentClassification
} from './types';

// Re-exporta para uso externo
export { SupabaseRAGClient, EmbeddingService, RAGRetriever, AnswerService };
export type {
  ChunkResult,
  RetrieveOptions,
  AnswerResult,
  EmbeddingResult,
  DocumentMetadata,
  ChunkMetadata,
  UserRole,
  DocumentScope,
  DocumentClassification
};

// Classe principal que combina todas as funcionalidades
export class RAGService {
  private retriever: RAGRetriever;
  private answerService: AnswerService;
  private client: SupabaseRAGClient;

  constructor() {
    this.retriever = new RAGRetriever();
    this.answerService = new AnswerService();
    this.client = new SupabaseRAGClient();
  }

  /**
   * Função principal: pergunta e resposta completa
   */
  async ask(
    question: string,
    options: {
      versionTag?: string;
      role?: string;
      scopes?: string[];
      topK?: number;
      maxAnswerLength?: number;
    } = {}
  ): Promise<AnswerResult> {
    const startTime = Date.now();

    try {
      // 1. Recuperar chunks relevantes
      const chunks = await this.retriever.retrieve({
        query: question,
        versionTag: options.versionTag,
        role: options.role as any,
        scopes: options.scopes,
        topK: options.topK
      });

      // 2. Gerar resposta
      const answer = await this.answerService.makeAnswer(question, chunks, {
        role: options.role,
        maxLength: options.maxAnswerLength
      });

      // 3. Log da pergunta/resposta
      const latency = Date.now() - startTime;
      await this.client.insertQALog({
        question,
        answer_summary: answer.answer.substring(0, 200),
        latency_ms: latency,
        sources: answer.sources,
        version_tag: options.versionTag
      });

      return answer;

    } catch (error) {
      // Log de erro
      await this.client.insertQALog({
        question,
        answer_summary: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        latency_ms: Date.now() - startTime,
        version_tag: options.versionTag
      });

      throw error;
    }
  }

  /**
   * Obtém estatísticas do sistema
   */
  async getStats() {
    return this.retriever.getSearchStats();
  }

  /**
   * Obtém versões ativas
   */
  async getActiveVersions() {
    return this.client.getActiveVersions();
  }

  /**
   * Obtém documentos por versão
   */
  async getDocumentsByVersion(versionTag: string) {
    return this.client.getDocumentsByVersion(versionTag);
  }

  /**
   * Busca chunks sem gerar resposta
   */
  async searchChunks(query: string, options: Omit<RetrieveOptions, 'query'> = {}) {
    return this.retriever.retrieve({ query, ...options });
  }

  /**
   * Gera embedding para um texto
   */
  async embedText(text: string) {
    const embeddingService = new EmbeddingService();
    return embeddingService.embedText(text);
  }
}

// Instância singleton para uso direto
export const ragService = new RAGService();
