'use client'

import { useState, useEffect } from 'react'

interface KnowledgeBase {
  id: string
  name: string
  description: string
  version: string
  is_active: boolean
  is_enabled_for_chat: boolean
  document_count: number
  created_at: string
}

export default function KnowledgeBasesPage() {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setKnowledgeBases([
        {
          id: '1',
          name: 'Documentation v1.0',
          description: 'Core application documentation',
          version: '1.0.0',
          is_active: true,
          is_enabled_for_chat: true,
          document_count: 15,
          created_at: '2024-01-15'
        },
        {
          id: '2',
          name: 'API Reference v1.0',
          description: 'API documentation and examples',
          version: '1.0.0',
          is_active: true,
          is_enabled_for_chat: false,
          document_count: 8,
          created_at: '2024-01-20'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Knowledge Bases</h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-500">Loading knowledge bases...</span>
        </div>
      ) : knowledgeBases.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-32 text-center">
          <h3 className="text-lg font-medium mb-2">No knowledge bases found</h3>
          <p className="text-gray-500 mb-4">
            Create your first knowledge base to get started
          </p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium">Knowledge Bases</h3>
            <p className="text-sm text-gray-500">Manage your segmented knowledge bases by application version</p>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              {knowledgeBases.map((kb) => (
                <div key={kb.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">{kb.name}</div>
                    <div className="text-sm text-gray-500">
                      {kb.description} | Version: {kb.version} | Documents: {kb.document_count}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Status: {kb.is_active ? 'Active' : 'Inactive'} | 
                    Chat: {kb.is_enabled_for_chat ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
