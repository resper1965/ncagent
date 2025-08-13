'use client'

import { useState, useEffect } from 'react'
import { Search, FileText, Calendar, User, Download, Trash2, Filter, Eye } from 'lucide-react'
import { Navbar } from '../../components/ui/navbar'

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
  const [search, setSearch] = useState('')

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
      console.error('Erro ao buscar documentos:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950">
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                <FileText className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Gestão de Documentos</h1>
                <p className="text-gray-300">Visualize e gerencie seus documentos</p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar documentos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-400"
                />
              </div>
              <button className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors text-gray-300">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </button>
            </div>
          </div>

          {/* Documents List */}
          <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">
                Documentos ({filteredDocuments.length})
              </h2>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-300">Carregando documentos...</p>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Nenhum documento encontrado</h3>
                <p className="text-gray-300">Faça upload de documentos para começar</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} className="p-6 hover:bg-gray-700 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <FileText className="h-8 w-8 text-gray-400" />
                        <div>
                          <h3 className="text-lg font-medium text-white">{doc.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-300 mt-1">
                            <span>Status: {doc.status}</span>
                            <span>Chunks: {doc.chunks_count}</span>
                            <span>Escopo: {doc.scope}</span>
                            <span>Classificação: {doc.classification}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-200 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-200 transition-colors">
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-red-400 hover:text-red-300 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
