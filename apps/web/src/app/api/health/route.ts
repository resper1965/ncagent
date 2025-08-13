import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nsecops-ness-supabase.pzgnh1.easypanel.host';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  const startTime = Date.now();
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      database: 'unknown',
      storage: 'unknown',
      embeddings: 'unknown'
    },
    checks: {
      database: false,
      storage: false,
      embeddings: false
    },
    latency: 0
  };

  try {
    // Teste 1: Conexão com banco de dados
    const dbStart = Date.now();
    const { data: dbTest, error: dbError } = await supabase
      .from('ncmd.product_versions')
      .select('count')
      .limit(1);
    
    const dbLatency = Date.now() - dbStart;
    
    if (!dbError) {
      health.services.database = 'healthy';
      health.checks.database = true;
    } else {
      health.services.database = 'unhealthy';
      health.status = 'degraded';
    }

    // Teste 2: Storage (bucket)
    const storageStart = Date.now();
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
    const storageLatency = Date.now() - storageStart;
    
    if (!storageError && buckets) {
      health.services.storage = 'healthy';
      health.checks.storage = true;
    } else {
      health.services.storage = 'unhealthy';
      health.status = 'degraded';
    }

    // Teste 3: Embeddings (verificar variáveis de ambiente)
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey && openaiKey.length > 0) {
      health.services.embeddings = 'configured';
      health.checks.embeddings = true;
    } else {
      health.services.embeddings = 'not_configured';
      health.status = 'degraded';
    }

    health.latency = Date.now() - startTime;

    // Determinar status final
    const allChecks = Object.values(health.checks);
    if (allChecks.every(check => check)) {
      health.status = 'healthy';
    } else if (allChecks.some(check => check)) {
      health.status = 'degraded';
    } else {
      health.status = 'unhealthy';
    }

    const statusCode = health.status === 'healthy' ? 200 : 
                      health.status === 'degraded' ? 200 : 503;

    return NextResponse.json({
      success: true,
      data: health
    }, { status: statusCode });

  } catch (error) {
    health.status = 'unhealthy';
    health.latency = Date.now() - startTime;
    
    return NextResponse.json({
      success: false,
      error: 'Health check failed',
      data: health,
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 503 });
  }
}
