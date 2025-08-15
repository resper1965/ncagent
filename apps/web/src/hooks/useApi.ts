import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

interface ApiResponse<T> {
  data: T | null
  error: string | null
  loading: boolean
}

interface ApiState<T> extends ApiResponse<T> {
  execute: (...args: any[]) => Promise<void>
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  dependencies: any[] = []
): ApiState<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const execute = useCallback(async (...args: any[]) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await apiFunction(...args)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, dependencies)

  return { data, error, loading, execute }
}

// Hook para upload de documentos
export function useUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const uploadDocument = useCallback(async (
    file: File,
    knowledgeBaseId?: string
  ) => {
    setUploading(true)
    setProgress(0)

    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
      }

      // Read file content
      const content = await file.text()
      
      // Prepare upload data
      const uploadData = {
        title: file.name,
        content,
        fileType: file.type,
        fileSize: file.size,
        knowledgeBaseId,
        metadata: {
          originalName: file.name,
          lastModified: file.lastModified,
        }
      }

      // Upload to API
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(uploadData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const result = await response.json()
      setProgress(100)
      return result.data

    } catch (error) {
      throw error
    } finally {
      setUploading(false)
    }
  }, [])

  return { uploadDocument, uploading, progress }
}

// Hook para chat
export function useChat() {
  const [sending, setSending] = useState(false)

  const sendMessage = useCallback(async (
    question: string,
    options: {
      sessionId?: string
      agentId?: string
      agentIds?: string[]
      knowledgeBaseIds?: string[]
      enableMemory?: boolean
      enableDebate?: boolean
    } = {}
  ) => {
    setSending(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          question,
          ...options,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Chat failed')
      }

      const result = await response.json()
      return result.data

    } catch (error) {
      throw error
    } finally {
      setSending(false)
    }
  }, [])

  return { sendMessage, sending }
}

// Hook para agentes
export function useAgents() {
  const [loading, setLoading] = useState(false)

  const fetchAgents = useCallback(async () => {
    setLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
      }

      const response = await fetch('/api/agents', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch agents')
      }

      const result = await response.json()
      return result.data.agents

    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const createAgent = useCallback(async (agentData: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
      }

      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(agentData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create agent')
      }

      const result = await response.json()
      return result.data.agent

    } catch (error) {
      throw error
    }
  }, [])

  return { fetchAgents, createAgent, loading }
}

// Hook para knowledge bases
export function useKnowledgeBases() {
  const [loading, setLoading] = useState(false)

  const fetchKnowledgeBases = useCallback(async () => {
    setLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
      }

      const response = await fetch('/api/knowledge-bases', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch knowledge bases')
      }

      const result = await response.json()
      return result.data.knowledge_bases

    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const createKnowledgeBase = useCallback(async (kbData: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
      }

      const response = await fetch('/api/knowledge-bases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(kbData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create knowledge base')
      }

      const result = await response.json()
      return result.data.knowledge_base

    } catch (error) {
      throw error
    }
  }, [])

  const updateKnowledgeBase = useCallback(async (id: string, kbData: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
      }

      const response = await fetch('/api/knowledge-bases', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ id, ...kbData }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update knowledge base')
      }

      const result = await response.json()
      return result.data.knowledge_base

    } catch (error) {
      throw error
    }
  }, [])

  const deleteKnowledgeBase = useCallback(async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
      }

      const response = await fetch(`/api/knowledge-bases?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete knowledge base')
      }

      return true

    } catch (error) {
      throw error
    }
  }, [])

  return {
    fetchKnowledgeBases,
    createKnowledgeBase,
    updateKnowledgeBase,
    deleteKnowledgeBase,
    loading,
  }
}
