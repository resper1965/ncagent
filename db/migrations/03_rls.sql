-- 03_rls.sql
-- Habilita Row Level Security e cria políticas de acesso

-- Habilita RLS nas tabelas
alter table ncmd.documents enable row level security;
alter table ncmd.chunks enable row level security;
alter table ncmd.chunk_embeddings enable row level security;
alter table ncmd.qa_logs enable row level security;

-- Políticas para documentos
create policy "read_docs" on ncmd.documents
for select using ( 
  coalesce((auth.jwt() ->> 'role') in ('reader','admin','infosec','dev','infra'), false) 
);

create policy "insert_docs" on ncmd.documents
for insert with check ( 
  coalesce((auth.jwt() ->> 'role') in ('admin','infosec'), false) 
);

create policy "update_docs" on ncmd.documents
for update using ( 
  coalesce((auth.jwt() ->> 'role') in ('admin','infosec'), false) 
);

create policy "delete_docs" on ncmd.documents
for delete using ( 
  coalesce((auth.jwt() ->> 'role') = 'admin', false) 
);

-- Políticas para chunks
create policy "read_chunks" on ncmd.chunks
for select using ( 
  coalesce((auth.jwt() ->> 'role') in ('reader','admin','infosec','dev','infra'), false) 
);

create policy "insert_chunks" on ncmd.chunks
for insert with check ( 
  coalesce((auth.jwt() ->> 'role') in ('admin','infosec'), false) 
);

-- Políticas para embeddings (só por join de chunk autorizado)
create policy "read_embeddings" on ncmd.chunk_embeddings
for select using (
  exists (
    select 1 from ncmd.chunks c
    where c.id = chunk_id
      and coalesce((auth.jwt() ->> 'role') in ('reader','admin','infosec','dev','infra'), false)
  )
);

create policy "insert_embeddings" on ncmd.chunk_embeddings
for insert with check ( 
  coalesce((auth.jwt() ->> 'role') in ('admin','infosec'), false) 
);

-- Políticas para logs de QA
create policy "read_qa_logs" on ncmd.qa_logs
for select using ( 
  coalesce((auth.jwt() ->> 'role') in ('admin','infosec'), false) 
);

create policy "insert_qa_logs" on ncmd.qa_logs
for insert with check ( 
  coalesce((auth.jwt() ->> 'role') in ('reader','admin','infosec','dev','infra'), false) 
);

-- Política para usuários verem apenas seus próprios logs
create policy "read_own_qa_logs" on ncmd.qa_logs
for select using ( 
  user_id = auth.uid() 
);
