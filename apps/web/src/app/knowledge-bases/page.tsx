'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Settings, Database, Users, Clock, CheckCircle, AlertCircle, ToggleLeft, ToggleRight, MoreVertical, Eye, Edit, Trash2, FolderOpen, Brain, Zap } from 'lucide-react'

interface KnowledgeBase {
  id: string
  name: string
  description: string
  documentCount: number
  chunkCount: number
  createdAt: string
  updatedAt: string
  status: 'active' | 'inactive' | 'processing'
  chatEnabled: boolean
  tags: string[]
  owner: string
  version: string
}

export default function KnowledgeBasesPage() {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  useEffect(() => {
    fetchKnowledgeBases()
  }, [])

  const fetchKnowledgeBases = async () => {
    try {
      const response = await fetch('/api/knowledge-bases')
      const data = await response.json()
      
      if (data.success) {
        setKnowledgeBases(data.data || [])
      } else {
        // Simulated data for demo
        setKnowledgeBases([
          {
            id: '1',
            name: 'Company Policies',
            description: 'All company policies, procedures, and guidelines',
            documentCount: 45,
            chunkCount: 1234,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-15',
            status: 'active',
            chatEnabled: true,
            tags: ['policies', 'procedures', 'guidelines'],
            owner: 'HR Department',
            version: '2.1.0'
          },
          {
            id: '2',
            name: 'Technical Documentation',
            description: 'API documentation, system architecture, and technical specs',
            documentCount: 78,
            chunkCount: 2156,
            createdAt: '2024-01-05',
            updatedAt: '2024-01-14',
            status: 'active',
            chatEnabled: true,
            tags: ['api', 'architecture', 'technical'],
            owner: 'Engineering Team',
            version: '1.8.2'
          },
          {
            id: '3',
            name: 'Product Knowledge',
            description: 'Product features, user guides, and FAQs',
            documentCount: 32,
            chunkCount: 892,
            createdAt: '2024-01-10',
            updatedAt: '2024-01-13',
            status: 'processing',
            chatEnabled: false,
            tags: ['product', 'features', 'guides'],
            owner: 'Product Team',
            version: '1.2.0'
          },
          {
            id: '4',
            name: 'Sales Materials',
            description: 'Sales presentations, case studies, and proposals',
            documentCount: 23,
            chunkCount: 567,
            createdAt: '2024-01-08',
            updatedAt: '2024-01-12',
            status: 'inactive',
            chatEnabled: false,
            tags: ['sales', 'presentations', 'case-studies'],
            owner: 'Sales Team',
            version: '1.0.1'
          },
          {
            id: '5',
            name: 'Legal Documents',
            description: 'Contracts, agreements, and legal documentation',
            documentCount: 15,
            chunkCount: 345,
            createdAt: '2024-01-03',
            updatedAt: '2024-01-11',
            status: 'active',
            chatEnabled: true,
            tags: ['legal', 'contracts', 'agreements'],
            owner: 'Legal Department',
            version: '1.5.3'
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching knowledge bases:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredKnowledgeBases = knowledgeBases.filter(kb => {
    const matchesSearch = kb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kb.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kb.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = selectedStatus === 'all' || kb.status === selectedStatus
    
    return matchesSearch && matchesStatus
  })

  const toggleChatEnabled = async (id: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/knowledge-bases/${id}/toggle-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled })
      })

      if (response.ok) {
        setKnowledgeBases(prev => prev.map(kb => 
          kb.id === id ? { ...kb, chatEnabled: enabled } : kb
        ))
      }
    } catch (error) {
      console.error('Error toggling chat:', error)
    }
  }

  const getStatusIcon = (status: KnowledgeBase['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-400" />
      case 'inactive':
        return <AlertCircle className="h-4 w-4 text-red-400" />
      default:
        return null
    }
  }

  const getStatusText = (status: KnowledgeBase['status']) => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'processing':
        return 'Processing'
      case 'inactive':
        return 'Inactive'
      default:
        return ''
    }
  }

  const getStatusColor = (status: KnowledgeBase['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400'
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'inactive':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Clock className="h-6 w-6 text-purple-400 animate-spin" />
            <span className="text-white">Loading knowledge bases...</span>
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
          <h2 className="text-3xl font-bold tracking-tight text-white">Knowledge Bases</h2>
          <p className="text-gray-400 mt-1">Manage segmented knowledge repositories with version control</p>
        </div>
                    <button className="px-4 py-2 bg-gradient-to-r from-[#00ade8] to-[#0099cc] text-white font-medium rounded-xl hover:from-[#0099cc] hover:to-[#0088bb] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create Knowledge Base</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="bg-gradient-to-r from-[#ffffff05] to-[#121212] backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Database className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Knowledge Bases</p>
              <p className="text-2xl font-bold text-white">{knowledgeBases.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#ffffff05] to-[#121212] backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Active</p>
              <p className="text-2xl font-bold text-white">
                {knowledgeBases.filter(kb => kb.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#ffffff05] to-[#121212] backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Zap className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Chat Enabled</p>
              <p className="text-2xl font-bold text-white">
                {knowledgeBases.filter(kb => kb.chatEnabled).length}
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
                {knowledgeBases.filter(kb => kb.status === 'processing').length}
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
              placeholder="Search knowledge bases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="processing">Processing</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Knowledge Bases List */}
      <div className="bg-gradient-to-r from-[#ffffff05] to-[#121212] backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">
            Knowledge Bases ({filteredKnowledgeBases.length})
          </h3>
        </div>

        {filteredKnowledgeBases.length === 0 ? (
          <div className="p-12 text-center">
            <FolderOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No knowledge bases found</h3>
            <p className="text-gray-400">
              {searchTerm || selectedStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first knowledge base to get started'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredKnowledgeBases.map((kb) => (
              <div key={kb.id} className="p-6 hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="p-3 bg-gradient-to-r from-[#00ade8] to-[#0099cc] rounded-xl">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-white font-medium truncate">{kb.name}</h4>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(kb.status)}
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(kb.status)}`}>
                            {getStatusText(kb.status)}
                          </span>
                          <span className="text-xs text-gray-500">v{kb.version}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-400 mb-2">{kb.description}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{kb.owner}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Database className="h-3 w-3" />
                          <span>{kb.documentCount} documents</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Brain className="h-3 w-3" />
                          <span>{kb.chunkCount} chunks</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Updated {kb.updatedAt}</span>
                        </div>
                      </div>
                      
                      {kb.tags.length > 0 && (
                        <div className="flex items-center space-x-2">
                          {kb.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="text-xs px-2 py-1 bg-white/10 rounded-full text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                          {kb.tags.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{kb.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Chat Toggle */}
                    <button
                      onClick={() => toggleChatEnabled(kb.id, !kb.chatEnabled)}
                      className={`p-2 rounded-lg transition-colors ${
                        kb.chatEnabled
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                      }`}
                      title={kb.chatEnabled ? 'Disable chat' : 'Enable chat'}
                    >
                      {kb.chatEnabled ? (
                        <ToggleRight className="h-4 w-4" />
                      ) : (
                        <ToggleLeft className="h-4 w-4" />
                      )}
                    </button>
                    
                    {/* Action Buttons */}
                    <button
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="Settings"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                    <button
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
