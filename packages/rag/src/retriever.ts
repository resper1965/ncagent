import { SupabaseRAGClient } from './client';
import { EmbeddingService } from './embeddings';
import { RetrieveOptions, ChunkResult, UserRole } from './types';

export class RAGRetriever {
  private client: SupabaseRAGClient;
  private embeddingService: EmbeddingService;

  constructor() {
    this.client = new SupabaseRAGClient();
    this.embeddingService = new EmbeddingService();
  }

  /**
   * Função principal de retrieve que combina embeddings e busca vetorial
   */
  async retrieve(options: RetrieveOptions): Promise<ChunkResult[]> {
    const {
      query,
      versionTag = 'ALL',
      role = 'reader',
      scopes = ['GENERAL'],
      classesAllowed = this.getDefaultClassesForRole(role as UserRole),
      topK = Number(process.env.RAG_TOPK) || 12
    } = options;

    try {
      // 1. Gerar embedding da query
      const { embedding } = await this.embeddingService.embedText(query);

      // 2. Buscar chunks similares
      const chunks = await this.client.matchChunks(embedding, {
        matchCount: topK,
        allowedVersions: [versionTag, 'ALL'],
        allowedScopes: scopes,
        allowedClasses: classesAllowed
      });

      // 3. Filtrar e ordenar por similaridade
      const filteredChunks = chunks
        .filter(chunk => chunk.similarity > 0.7) // Threshold mínimo
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topK);

      return filteredChunks;
    } catch (error) {
      throw new Error(`Erro no retrieve: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Obtém classes permitidas baseado no papel do usuário
   */
  private getDefaultClassesForRole(role: UserRole): string[] {
    switch (role) {
      case 'admin':
        return ['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'PII'];
      case 'infosec':
        return ['PUBLIC', 'INTERNAL', 'CONFIDENTIAL'];
      case 'dev':
      case 'infra':
        return ['PUBLIC', 'INTERNAL'];
      case 'reader':
      default:
        return ['PUBLIC', 'INTERNAL'];
    }
  }

  /**
   * Obtém escopos permitidos baseado no papel do usuário
   */
  private getDefaultScopesForRole(role: UserRole): string[] {
    switch (role) {
      case 'admin':
        return ['GENERAL', 'SECURITY', 'DEV', 'INFRA'];
      case 'infosec':
        return ['GENERAL', 'SECURITY'];
      case 'dev':
        return ['GENERAL', 'DEV'];
      case 'infra':
        return ['GENERAL', 'INFRA'];
      case 'reader':
      default:
        return ['GENERAL'];
    }
  }

  /**
   * Busca chunks com filtros específicos
   */
  async retrieveWithFilters(
    query: string,
    filters: {
      versionTag?: string;
      scope?: string;
      classification?: string;
      minSimilarity?: number;
    } = {}
  ): Promise<ChunkResult[]> {
    const { minSimilarity = 0.7, ...otherFilters } = filters;

    const chunks = await this.retrieve({
      query,
      ...otherFilters
    });

    return chunks.filter(chunk => chunk.similarity >= minSimilarity);
  }

  /**
   * Busca chunks por documento específico
   */
  async retrieveByDocument(
    query: string,
    documentId: string,
    topK: number = 5
  ): Promise<ChunkResult[]> {
    const chunks = await this.retrieve({ query, topK: topK * 2 });
    
    return chunks
      .filter(chunk => chunk.document_id === documentId)
      .slice(0, topK);
  }

  /**
   * Busca chunks por versão específica
   */
  async retrieveByVersion(
    query: string,
    versionTag: string,
    topK: number = 10
  ): Promise<ChunkResult[]> {
    return this.retrieve({
      query,
      versionTag,
      topK
    });
  }

  /**
   * Obtém estatísticas de busca
   */
  async getSearchStats() {
    try {
      const versions = await this.client.getActiveVersions();
      const usageStats = await this.client.getUsageStats();
      
      return {
        activeVersions: versions,
        usageStats,
        modelInfo: {
          model: process.env.RAG_EMBEDDING_MODEL || 'text-embedding-3-small',
          dimensions: 1536,
          maxTokens: 8191
        }
      };
    } catch (error) {
      throw new Error(`Erro ao obter estatísticas: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }
}
