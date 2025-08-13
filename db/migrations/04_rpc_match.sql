-- 04_rpc_match.sql
-- Função RPC para busca vetorial filtrada (performance via SQL)

create or replace function ncmd.match_chunks(
  query_embedding vector(1536),
  match_count int default 12,
  allowed_versions text[] default array['ALL'],     -- ex: ['1.2','ALL']
  allowed_scopes text[] default array['GENERAL'],   -- ex: ['GENERAL','DEV']
  allowed_classes text[] default array['PUBLIC','INTERNAL'] -- ex: ['PUBLIC','INTERNAL'] (conforme RBAC)
)
returns table(
  chunk_id uuid,
  document_id uuid,
  content text,
  similarity float4,
  version_tag text,
  scope text,
  classification text,
  chunk_index int,
  title text
) language sql stable as $$
  select
    e.chunk_id,
    c.document_id,
    c.content,
    1 - (e.embedding <=> query_embedding) as similarity,
    c.version_tag,
    c.scope,
    c.classification,
    c.chunk_index,
    d.title
  from ncmd.chunk_embeddings e
  join ncmd.chunks c on c.id = e.chunk_id
  join ncmd.documents d on d.id = c.document_id
  where (c.version_tag = any(allowed_versions) or 'ALL' = any(allowed_versions))
    and c.scope = any(allowed_scopes)
    and c.classification = any(allowed_classes)
  order by e.embedding <=> query_embedding
  limit match_count;
$$;

-- Função para obter estatísticas de documentos por versão
create or replace function ncmd.get_document_stats()
returns table(
  version_tag text,
  document_count bigint,
  chunk_count bigint,
  total_tokens bigint
) language sql stable as $$
  select
    d.version_tag,
    count(distinct d.id) as document_count,
    count(c.id) as chunk_count,
    sum(c.tokens) as total_tokens
  from ncmd.documents d
  left join ncmd.chunks c on c.document_id = d.id
  group by d.version_tag
  order by d.version_tag;
$$;

-- Função para limpar documentos antigos (manutenção)
create or replace function ncmd.cleanup_old_documents(
  days_old int default 90
)
returns int language plpgsql as $$
declare
  deleted_count int;
begin
  delete from ncmd.documents 
  where created_at < now() - interval '1 day' * days_old
    and not exists (
      select 1 from ncmd.qa_logs q 
      where q.sources::text like '%' || id::text || '%'
    );
  
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;
