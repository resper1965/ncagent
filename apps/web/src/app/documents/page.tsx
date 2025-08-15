'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Download, Eye, Trash2, FileText, Calendar, User, MoreVertical, Plus, FolderOpen, Clock, CheckCircle, AlertCircle } from 'lucide-react'

interface Document {
  id: string
  title: string
  type: string
  size: string
  uploadedBy: string
  uploadedAt: string
  status: 'processed' | 'processing' | 'error'
  tags: string[]
  description?: string
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents')
      const data = await response.json()
      
      if (data.success) {
        setDocuments(data.data || [])
      } else {
        // Simulated data for demo
        setDocuments([
          {
            id: '1',
            title: 'Company Policy Handbook',
            type: 'PDF',
            size: '2.4 MB',
            uploadedBy: 'John Doe',
            uploadedAt: '2024-01-15',
            status: 'processed',
            tags: ['policy', 'handbook', 'company'],
            description: 'Complete company policy and procedures handbook'
          },
          {
            id: '2',
            title: 'Q4 Financial Report',
            type: 'Excel',
            size: '1.8 MB',
            uploadedBy: 'Jane Smith',
            uploadedAt: '2024-01-14',
            status: 'processed',
            tags: ['finance', 'report', 'q4'],
            description: 'Quarterly financial performance report'
          },
          {
            id: '3',
            title: 'Product Requirements Document',
            type: 'Word',
            size: '3.2 MB',
            uploadedBy: 'Mike Johnson',
            uploadedAt: '2024-01-13',
            status: 'processing',
            tags: ['product', 'requirements', 'spec'],
            description: 'Detailed product requirements and specifications'
          },
          {
            id: '4',
            title: 'Marketing Strategy 2024',
            type: 'PDF',
            size: '4.1 MB',
            uploadedBy: 'Sarah Wilson',
            uploadedAt: '2024-01-12',
            status: 'processed',
            tags: ['marketing', 'strategy', '2024'],
            description: 'Comprehensive marketing strategy for 2024'
          },
          {
            id: '5',
            title: 'Technical Architecture',
            type: 'PDF',
            size: '5.6 MB',
            uploadedBy: 'Alex Brown',
            uploadedAt: '2024-01-11',
            status: 'error',
            tags: ['technical', 'architecture', 'design'],
            description: 'System architecture and technical design documents'
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = selectedType === 'all' || doc.type.toLowerCase() === selectedType.toLowerCase()
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'processed':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-400" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />
      default:
        return null
    }
  }

  const getStatusText = (status: Document['status']) => {
    switch (status) {
      case 'processed':
        return 'Processed'
      case 'processing':
        return 'Processing'
      case 'error':
        return 'Error'
      default:
        return ''
    }
  }

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return '📄'
      case 'word':
      case 'doc':
      case 'docx':
        return '📝'
      case 'excel':
      case 'xls':
      case 'xlsx':
        return '📊'
      case 'image':
      case 'png':
      case 'jpg':
      case 'jpeg':
        return '🖼️'
      default:
        return '📁'
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      try {
        const response = await fetch(`/api/documents/${id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setDocuments(prev => prev.filter(doc => doc.id !== id))
        }
      } catch (error) {
        console.error('Error deleting document:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Clock className="h-6 w-6 text-purple-400 animate-spin" />
            <span className="text-white">Loading documents...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Documents</h2>
          <p className="text-gray-400 mt-1">Manage and search your uploaded documents</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Upload New</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="bg-gradient-to-r from-[#ffffff05] to-[#121212] backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <FileText className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Documents</p>
              <p className="text-2xl font-bold text-white">{documents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#ffffff05] to-[#121212] backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Processed</p>
              <p className="text-2xl font-bold text-white">
                {documents.filter(d => d.status === 'processed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#ffffff05] to-[#121212] backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Processing</p>
              <p className="text-2xl font-bold text-white">
                {documents.filter(d => d.status === 'processing').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#ffffff05] to-[#121212] backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Errors</p>
              <p className="text-2xl font-bold text-white">
                {documents.filter(d => d.status === 'error').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gradient-to-r from-[#ffffff05] to-[#121212] backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="pdf">PDF</option>
            <option value="word">Word</option>
            <option value="excel">Excel</option>
            <option value="image">Image</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="processed">Processed</option>
            <option value="processing">Processing</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-gradient-to-r from-[#ffffff05] to-[#121212] backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">
            Documents ({filteredDocuments.length})
          </h3>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="p-12 text-center">
            <FolderOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No documents found</h3>
            <p className="text-gray-400">
              {searchTerm || selectedType !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Upload your first document to get started'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredDocuments.map((document) => (
              <div key={document.id} className="p-6 hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="text-3xl">{getFileIcon(document.type)}</div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-white font-medium truncate">{document.title}</h4>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(document.status)}
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            document.status === 'processed' ? 'bg-green-500/20 text-green-400' :
                            document.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {getStatusText(document.status)}
                          </span>
                        </div>
                      </div>
                      
                      {document.description && (
                        <p className="text-sm text-gray-400 mb-2">{document.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{document.uploadedBy}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{document.uploadedAt}</span>
                        </div>
                        <span>{document.size}</span>
                        <span className="uppercase">{document.type}</span>
                      </div>
                      
                      {document.tags.length > 0 && (
                        <div className="flex items-center space-x-2 mt-2">
                          {document.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="text-xs px-2 py-1 bg-white/10 rounded-full text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                          {document.tags.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{document.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(document.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="More options"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
