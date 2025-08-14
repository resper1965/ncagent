'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card-simple'
import { Badge } from '../../components/ui/badge-simple'
import { Button } from '../../components/ui/button-simple'

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
        },
        {
          id: '3',
          name: 'Security Guidelines v2.0',
          description: 'Security best practices and compliance',
          version: '2.0.0',
          is_active: false,
          is_enabled_for_chat: false,
          document_count: 12,
          created_at: '2024-02-01'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusBadge = (kb: KnowledgeBase) => {
    if (!kb.is_active) {
      return <Badge variant="secondary">Inactive</Badge>
    }
    if (kb.is_enabled_for_chat) {
      return <Badge className="bg-green-500/10 text-green-500 border-green-500">Chat Enabled</Badge>
    }
    return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500">Chat Disabled</Badge>
  }

  const getVersionBadge = (version: string) => {
    return <Badge variant="outline">{version}</Badge>
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">Knowledge Bases</h2>
        <Button asChild>
          <a href="/knowledge-bases/new">
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Knowledge Base
          </a>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Knowledge Bases</CardTitle>
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{knowledgeBases.length}</div>
            <p className="text-xs text-gray-400">Across all versions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active for Chat</CardTitle>
            <Badge className="bg-green-500/10 text-green-500 border-green-500">Enabled</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {knowledgeBases.filter(kb => kb.is_enabled_for_chat).length}
            </div>
            <p className="text-xs text-gray-400">Available for queries</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {knowledgeBases.reduce((sum, kb) => sum + kb.document_count, 0)}
            </div>
            <p className="text-xs text-gray-400">Across all knowledge bases</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Versions</CardTitle>
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {new Set(knowledgeBases.map(kb => kb.version)).size}
            </div>
            <p className="text-xs text-gray-400">Application versions</p>
          </CardContent>
        </Card>
      </div>

      {/* Knowledge Bases List */}
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Bases</CardTitle>
          <CardDescription>Manage your segmented knowledge bases by application version</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-500">Loading knowledge bases...</span>
            </div>
          ) : knowledgeBases.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
              <h3 className="text-lg font-medium mb-2 text-white">No knowledge bases found</h3>
              <p className="text-gray-500 mb-4">
                Create your first knowledge base to get started
              </p>
              <Button asChild>
                <a href="/knowledge-bases/new">
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Knowledge Base
                </a>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {knowledgeBases.map((kb) => (
                <div key={kb.id} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">{kb.name}</h3>
                      <p className="text-sm text-gray-400">{kb.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {getVersionBadge(kb.version)}
                        {getStatusBadge(kb)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Documents</div>
                      <div className="text-lg font-medium text-white">{kb.document_count}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Created</div>
                      <div className="text-sm text-white">{new Date(kb.created_at).toLocaleDateString()}</div>
                    </div>
                    <Button variant="outline" size="sm">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
