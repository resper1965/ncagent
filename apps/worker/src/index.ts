import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { createClient } from '@supabase/supabase-js';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from '@langchain/openai';
import * as fs from 'fs';
import * as path from 'path';

// Configuração Redis
const redis = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

// Configuração Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:8000';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Configuração OpenAI
const openaiApiKey = process.env.OPENAI_API_KEY;
if (!openaiApiKey) {
  throw new Error('OPENAI_API_KEY is required');
}

// Filas
const documentQueue = new Queue('document-processing', { connection: redis });
const embeddingQueue = new Queue('embedding-generation', { connection: redis });

// Worker para processamento de documentos
const documentWorker = new Worker('document-processing', async (job) => {
  const { filePath, documentId, versionTag, scope, classification } = job.data;
  
  console.log(`Processing document: ${filePath}`);
  
  try {
    // Carregar documento baseado na extensão
    let loader;
    const ext = path.extname(filePath).toLowerCase();
    
    switch (ext) {
      case '.pdf':
        loader = new PDFLoader(filePath);
        break;
      case '.docx':
        loader = new DocxLoader(filePath);
        break;
      default:
        throw new Error(`Unsupported file type: ${ext}`);
    }
    
    const docs = await loader.load();
    
    // Dividir em chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    
    const chunks = await splitter.splitDocuments(docs);
    
    // Salvar chunks no banco
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      
      const { error } = await supabase
        .from('ncmd.document_chunks')
        .insert({
          document_id: documentId,
          chunk_index: i,
          content: chunk.pageContent,
          version_tag: versionTag,
          scope: scope,
          classification: classification,
          metadata: chunk.metadata
        });
      
      if (error) {
        console.error('Error saving chunk:', error);
        throw error;
      }
      
      // Adicionar job para gerar embedding
      await embeddingQueue.add('generate-embedding', {
        chunkId: `${documentId}_${i}`,
        content: chunk.pageContent,
        documentId,
        chunkIndex: i
      });
    }
    
    // Atualizar status do documento
    await supabase
      .from('ncmd.documents')
      .update({ 
        status: 'processed',
        chunks_count: chunks.length,
        processed_at: new Date().toISOString()
      })
      .eq('id', documentId);
    
    console.log(`Document processed successfully: ${chunks.length} chunks created`);
    
  } catch (error) {
    console.error('Error processing document:', error);
    
    // Atualizar status para erro
    await supabase
      .from('ncmd.documents')
      .update({ 
        status: 'error',
        error_message: error instanceof Error ? error.message : 'Unknown error'
      })
      .eq('id', documentId);
    
    throw error;
  }
}, { connection: redis });

// Worker para geração de embeddings
const embeddingWorker = new Worker('embedding-generation', async (job) => {
  const { chunkId, content, documentId, chunkIndex } = job.data;
  
  console.log(`Generating embedding for chunk: ${chunkId}`);
  
  try {
    // Gerar embedding
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: openaiApiKey,
      modelName: process.env.RAG_EMBEDDING_MODEL || 'text-embedding-3-small'
    });
    
    const embedding = await embeddings.embedQuery(content);
    
    // Salvar embedding no banco
    const { error } = await supabase
      .from('ncmd.document_chunks')
      .update({
        embedding: embedding,
        embedding_generated_at: new Date().toISOString()
      })
      .eq('document_id', documentId)
      .eq('chunk_index', chunkIndex);
    
    if (error) {
      console.error('Error saving embedding:', error);
      throw error;
    }
    
    console.log(`Embedding generated successfully for chunk: ${chunkId}`);
    
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}, { connection: redis });

// Event listeners
documentWorker.on('completed', (job) => {
  console.log(`Document job completed: ${job.id}`);
});

documentWorker.on('failed', (job, err) => {
  console.error(`Document job failed: ${job?.id || 'unknown'}`, err);
});

embeddingWorker.on('completed', (job) => {
  console.log(`Embedding job completed: ${job.id}`);
});

embeddingWorker.on('failed', (job, err) => {
  console.error(`Embedding job failed: ${job?.id || 'unknown'}`, err);
});

console.log('🚀 nCommand Lite Agent Worker started');
console.log('📋 Document processing worker: active');
console.log('🧠 Embedding generation worker: active');

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down workers...');
  await documentWorker.close();
  await embeddingWorker.close();
  await redis.quit();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Shutting down workers...');
  await documentWorker.close();
  await embeddingWorker.close();
  await redis.quit();
  process.exit(0);
});
