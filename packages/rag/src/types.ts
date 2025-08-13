export interface ChunkResult {
  chunk_id: string;
  document_id: string;
  content: string;
  similarity: number;
  version_tag: string;
  scope: string;
  classification: string;
  chunk_index: number;
  title: string;
}

export interface RetrieveOptions {
  query: string;
  versionTag?: string;
  role?: string;
  scopes?: string[];
  classesAllowed?: string[];
  topK?: number;
}

export interface AnswerResult {
  answer: string;
  citations: ChunkResult[];
  sources: string[];
}

export interface EmbeddingResult {
  embedding: number[];
  tokens: number;
  latency?: number;
}

export interface DocumentMetadata {
  id: string;
  title: string;
  version_tag: string;
  scope: string;
  classification: string;
  mime_type?: string;
  created_at: string;
}

export interface ChunkMetadata {
  id: string;
  document_id: string;
  chunk_index: number;
  content: string;
  tokens: number;
  version_tag: string;
  scope: string;
  classification: string;
}

export type UserRole = 'reader' | 'admin' | 'infosec' | 'dev' | 'infra';
export type DocumentScope = 'GENERAL' | 'SECURITY' | 'DEV' | 'INFRA';
export type DocumentClassification = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'PII';
