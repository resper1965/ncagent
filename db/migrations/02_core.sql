-- 02_core.sql
-- Cria o schema e tabelas principais do sistema

create schema if not exists ncmd;

-- Tabela de versões do produto
create table if not exists ncmd.product_versions (
  id uuid primary key default gen_random_uuid(),
  version_tag text not null unique,     -- '1.0', '1.1', 'ALL'
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Tabela de documentos
create table if not exists ncmd.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source text not null,                  -- 'upload' | 'sharepoint'
  version_tag text not null,             -- FK lógico p/ product_versions.version_tag
  scope text not null default 'GENERAL', -- 'GENERAL' | 'SECURITY' | 'DEV' | 'INFRA'
  classification text not null default 'INTERNAL', -- 'PUBLIC'|'INTERNAL'|'CONFIDENTIAL'|'PII'
  mime_type text,
  sha256 text unique,
  created_by uuid,                       -- supabase auth user id
  created_at timestamptz default now()
);

-- Tabela de chunks (pedaços dos documentos)
create table if not exists ncmd.chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references ncmd.documents(id) on delete cascade,
  chunk_index int not null,
  content text not null,
  tokens int not null,
  version_tag text not null,
  scope text not null,
  classification text not null,
  created_at timestamptz default now()
);

-- Tabela de embeddings dos chunks
create table if not exists ncmd.chunk_embeddings (
  id uuid primary key default gen_random_uuid(),
  chunk_id uuid references ncmd.chunks(id) on delete cascade,
  embedding vector(1536) -- ajuste p/ modelo text-embedding-3-small
);

-- Índices para performance
create index if not exists idx_chunks_doc on ncmd.chunks(document_id);
create index if not exists idx_chunks_version on ncmd.chunks(version_tag);
create index if not exists idx_chunks_scope on ncmd.chunks(scope);
create index if not exists idx_chunks_class on ncmd.chunks(classification);
create index if not exists idx_vec on ncmd.chunk_embeddings using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- Tabela de logs de perguntas e respostas (auditoria)
create table if not exists ncmd.qa_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  question text not null,
  answer_summary text,
  latency_ms int,
  sources jsonb, -- array de chunk_ids usados
  version_tag text,
  created_at timestamptz default now()
);

-- Índices para auditoria
create index if not exists idx_qa_logs_user on ncmd.qa_logs(user_id);
create index if not exists idx_qa_logs_created on ncmd.qa_logs(created_at);
