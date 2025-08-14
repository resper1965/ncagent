'use client'

import { useState, useEffect } from 'react'

interface Document {
  id: string
  title: string
  status: string
  created_at: string
  chunks_count: number
  scope: string
  classification: string
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents')
      const data = await response.json()
      if (data.success) {
        setDocuments(data.data.documents || [])
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-muted-foreground">Loading documents...</span>
        </div>
      ) : documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-32 text-center">
          <h3 className="text-lg font-medium mb-2">No documents found</h3>
          <p className="text-muted-foreground mb-4">
            Upload your first document to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">{documents.length}</div>
              <p className="text-xs text-muted-foreground">Total Documents</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">
                {documents.filter(d => d.status === 'processed').length}
              </div>
              <p className="text-xs text-muted-foreground">Processed</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">
                {documents.filter(d => d.status === 'processing').length}
              </div>
              <p className="text-xs text-muted-foreground">Processing</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">
                {documents.reduce((sum, d) => sum + d.chunks_count, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Total Chunks</p>
            </div>
          </div>

          <div className="border rounded-lg">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">Documents</h3>
              <p className="text-sm text-muted-foreground">
                Manage your uploaded documents
              </p>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">{doc.title}</div>
                      <div className="text-sm text-muted-foreground">
                        Status: {doc.status} | Scope: {doc.scope} | Chunks: {doc.chunks_count}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
