import { createClient } from '@supabase/supabase-js'

// Função para validar variáveis de ambiente
const validateEnvVars = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are not configured')
  }
  
  return { supabaseUrl, supabaseAnonKey }
}

// Cliente Supabase com validação
export const createSupabaseClient = () => {
  try {
    const { supabaseUrl, supabaseAnonKey } = validateEnvVars()
    
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
  } catch (error) {
    // Retorna cliente mock durante build
    console.warn('Supabase client not available during build:', error)
    return null
  }
}

// Cliente para operações server-side (VPS)
export const createServerSupabaseClient = () => {
  try {
    // Usar variáveis da VPS conforme configurado no deploy
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nsecops-ness-supabase.pzgnh1.easypanel.host/'
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UtZGVtbyIsImlhdCI6MTY0MTc2OTIwMCwiZXhwIjoxNzk5NTM1NjAwfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q'
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase server environment variables are not configured')
    }
    
    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  } catch (error) {
    console.warn('Server Supabase client not available:', error)
    return null
  }
}

// Cliente padrão (para compatibilidade)
export const supabase = createSupabaseClient()

// Tipos para o banco de dados
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          title: string
          content: string
          file_path: string | null
          file_type: string
          file_size: number
          user_id: string
          knowledge_base_id: string | null
          metadata: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          file_path?: string | null
          file_type: string
          file_size: number
          user_id: string
          knowledge_base_id?: string | null
          metadata?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          file_path?: string | null
          file_type?: string
          file_size?: number
          user_id?: string
          knowledge_base_id?: string | null
          metadata?: any
          created_at?: string
          updated_at?: string
        }
      }
      knowledge_bases: {
        Row: {
          id: string
          name: string
          description: string | null
          user_id: string
          is_enabled: boolean
          category: string
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          user_id: string
          is_enabled?: boolean
          category?: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          user_id?: string
          is_enabled?: boolean
          category?: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      agents: {
        Row: {
          id: string
          name: string
          title: string
          description: string
          icon: string
          persona: string
          core_principles: string[]
          expertise: string[]
          communication_style: string
          user_id: string
          is_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          title: string
          description: string
          icon: string
          persona: string
          core_principles: string[]
          expertise: string[]
          communication_style: string
          user_id: string
          is_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          title?: string
          description?: string
          icon?: string
          persona?: string
          core_principles?: string[]
          expertise?: string[]
          communication_style?: string
          user_id?: string
          is_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      agent_teams: {
        Row: {
          id: string
          name: string
          description: string | null
          user_id: string
          agent_ids: string[]
          is_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          user_id: string
          agent_ids: string[]
          is_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          user_id?: string
          agent_ids?: string[]
          is_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      chat_sessions: {
        Row: {
          id: string
          user_id: string
          title: string | null
          agent_ids: string[]
          knowledge_base_ids: string[]
          message_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          agent_ids?: string[]
          knowledge_base_ids?: string[]
          message_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          agent_ids?: string[]
          knowledge_base_ids?: string[]
          message_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          session_id: string
          content: string
          role: 'user' | 'assistant'
          agent_used: string | null
          sources: any[] | null
          confidence: number | null
          metadata: any
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          content: string
          role: 'user' | 'assistant'
          agent_used?: string | null
          sources?: any[] | null
          confidence?: number | null
          metadata?: any
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          content?: string
          role?: 'user' | 'assistant'
          agent_used?: string | null
          sources?: any[] | null
          confidence?: number | null
          metadata?: any
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
