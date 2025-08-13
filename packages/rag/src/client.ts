import { createClient } from '@supabase/supabase-js';
import type { ChunkResult, DocumentMetadata } from './types';

export class SupabaseRAGClient {
  private supabase;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:8000';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  /**
   * Busca chunks similares usando pgvector
   */
  async matchChunks(
    embedding: number[],
    options: {
      matchCount: number;
      allowedVersions: string[];
      allowedScopes: string[];
      allowedClasses: string[];
    }
  ): Promise<ChunkResult[]> {
    const { matchCount, allowedVersions, allowedScopes, allowedClasses } = options;

    const { data, error } = await this.supabase.rpc('match_chunks', {
      query_embedding: embedding,
      match_count: matchCount,
      allowed_versions: allowedVersions,
      allowed_scopes: allowedScopes,
      allowed_classes: allowedClasses
    });

    if (error) {
      throw new Error(`Erro na busca de chunks: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Obtém versões ativas
   */
  async getActiveVersions(): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('ncmd.product_versions')
      .select('version_tag')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar versões: ${error.message}`);
    }

    return data?.map(v => v.version_tag) || [];
  }

  /**
   * Obtém documentos por versão
   */
  async getDocumentsByVersion(versionTag: string): Promise<DocumentMetadata[]> {
    const { data, error } = await this.supabase
      .from('ncmd.documents')
      .select('*')
      .eq('version_tag', versionTag)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar documentos: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Insere log de pergunta/resposta
   */
  async insertQALog(log: {
    question: string;
    answer_summary: string;
    latency_ms: number;
    sources?: string[];
    version_tag?: string;
  }): Promise<void> {
    const { error } = await this.supabase
      .from('ncmd.qa_logs')
      .insert({
        question: log.question,
        answer_summary: log.answer_summary,
        latency_ms: log.latency_ms,
        sources: log.sources || [],
        version_tag: log.version_tag || 'ALL',
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Erro ao inserir log:', error);
    }
  }

  /**
   * Obtém estatísticas de uso
   */
  async getUsageStats(): Promise<{
    totalQuestions: number;
    avgLatency: number;
    topVersions: Array<{ version: string; count: number }>;
  }> {
    const { data, error } = await this.supabase
      .from('ncmd.qa_logs')
      .select('latency_ms, version_tag, created_at');

    if (error) {
      throw new Error(`Erro ao buscar estatísticas: ${error.message}`);
    }

    const logs = data || [];
    const totalQuestions = logs.length;
    const avgLatency = totalQuestions > 0 
      ? logs.reduce((sum, log) => sum + (log.latency_ms || 0), 0) / totalQuestions 
      : 0;

    // Contar por versão
    const versionCounts = logs.reduce((acc, log) => {
      const version = log.version_tag || 'ALL';
      acc[version] = (acc[version] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topVersions = Object.entries(versionCounts)
      .map(([version, count]) => ({ version, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalQuestions,
      avgLatency,
      topVersions
    };
  }
}
