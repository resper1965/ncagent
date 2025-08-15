'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Database, Search, Filter, MoreVertical, Eye, FileText, Calendar, Users, CheckCircle, AlertCircle } from 'lucide-react'

interface KnowledgeBase {
  id: string
  name: string
  description: string
  is_enabled: boolean
  created_at: string
  updated_at: string
  document_count: number
  user_count: number
  category: string
  tags: string[]
}

export default function KnowledgeBasesPage() {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedKB, setSelectedKB] = useState<KnowledgeBase | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  useEffect(() => {
    fetchKnowledgeBases()
  }, [])

  const fetchKnowledgeBases = async () => {
    try {
      const response = await fetch('/api/knowledge-bases')
      const data = await response.json()
      if (data.success) {
        setKnowledgeBases(data.data.knowledge_bases || [])
      } else {
        // Simulated data for demo
        setKnowledgeBases([
          {
            id: '1',
            name: 'Technical Documentation',
            description: 'Comprehensive technical documentation and API references',
            is_enabled: true,
            created_at: '2024-01-01',
            updated_at: '2024-01-15',
            document_count: 45,
            user_count: 12,
            category: 'technical',
            tags: ['API', 'Documentation', 'Technical']
          },
          {
            id: '2',
            name: 'Business Processes',
            description: 'Business process documentation and workflows',
            is_enabled: true,
            created_at: '2024-01-05',
            updated_at: '2024-01-14',
            document_count: 23,
            user_count: 8,
            category: 'business',
            tags: ['Process', 'Workflow', 'Business']
          },
          {
            id: '3',
            name: 'Legal Documents',
            description: 'Legal documentation and compliance materials',
            is_enabled: false,
            created_at: '2024-01-10',
            updated_at: '2024-01-13',
            document_count: 15,
            user_count: 3,
            category: 'legal',
            tags: ['Legal', 'Compliance', 'Regulatory']
          },
          {
            id: '4',
            name: 'Training Materials',
            description: 'Employee training and onboarding materials',
            is_enabled: true,
            created_at: '2024-01-12',
            updated_at: '2024-01-16',
            document_count: 32,
            user_count: 15,
            category: 'training',
            tags: ['Training', 'Onboarding', 'Education']
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching knowledge bases:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteKB = async (kbId: string) => {
    if (!confirm('Are you sure you want to delete this knowledge base?')) return

    try {
      const response = await fetch(`/api/knowledge-bases/${kbId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        fetchKnowledgeBases()
      }
    } catch (error) {
      console.error('Error deleting knowledge base:', error)
    }
  }

  const handleToggleKB = async (kbId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/knowledge-bases/${kbId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_enabled: !currentStatus
        })
      })
      const data = await response.json()
      if (data.success) {
        fetchKnowledgeBases()
      }
    } catch (error) {
      console.error('Error updating knowledge base:', error)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical':
        return 'bg-blue-500/20 text-blue-400'
      case 'business':
        return 'bg-green-500/20 text-green-400'
      case 'legal':
        return 'bg-purple-500/20 text-purple-400'
      case 'training':
        return 'bg-yellow-500/20 text-yellow-400'
      default:
        return 'bg-slate-500/20 text-slate-400'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical':
        return '⚙️'
      case 'business':
        return '📊'
      case 'legal':
        return '⚖️'
      case 'training':
        return '🎓'
      default:
        return '📁'
    }
  }

  const filteredKnowledgeBases = knowledgeBases.filter(kb => {
    const matchesSearch = kb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kb.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kb.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = filterCategory === 'all' || kb.category === filterCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Database className="h-6 w-6 text-blue-400 animate-spin" />
            <span className="text-white">Loading knowledge bases...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 mt-1">Manage your knowledge repositories and document collections</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-gradient-to-r bg-blue-400 text-white font-medium rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Knowledge Base</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-slate-800 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Database className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total KBs</p>
              <p className="text-xl font-bold text-white">{knowledgeBases.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Active</p>
              <p className="text-xl font-bold text-white">
                {knowledgeBases.filter(kb => kb.is_enabled).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <FileText className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Documents</p>
              <p className="text-xl font-bold text-white">
                {knowledgeBases.reduce((sum, kb) => sum + kb.document_count, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Users className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Active Users</p>
              <p className="text-xl font-bold text-white">
                {knowledgeBases.reduce((sum, kb) => sum + kb.user_count, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-800 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search knowledge bases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="technical">Technical</option>
              <option value="business">Business</option>
              <option value="legal">Legal</option>
              <option value="training">Training</option>
            </select>
          </div>
        </div>
      </div>

      {/* Knowledge Bases Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredKnowledgeBases.map((kb) => (
          <div key={kb.id} className="bg-slate-800 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getCategoryIcon(kb.category)}</div>
                <div>
                  <h3 className="font-semibold text-white">{kb.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(kb.category)}`}>
                    {kb.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleToggleKB(kb.id, kb.is_enabled)}
                  className={`p-1 rounded transition-colors ${
                    kb.is_enabled 
                      ? 'text-green-400 hover:bg-green-500/10' 
                      : 'text-slate-400 hover:bg-slate-700/50'
                  }`}
                  title={kb.is_enabled ? 'Disable' : 'Enable'}
                >
                  {kb.is_enabled ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => {
                    setSelectedKB(kb)
                    setShowEditModal(true)
                  }}
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded transition-colors"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteKB(kb.id)}
                  className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-slate-300 text-sm mb-4 line-clamp-2">{kb.description}</p>

            <div className="flex flex-wrap gap-1 mb-4">
              {kb.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
              {kb.tags.length > 3 && (
                <span className="px-2 py-1 bg-slate-700/50 text-slate-400 rounded text-xs">
                  +{kb.tags.length - 3}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <FileText className="h-3 w-3" />
                  <span>{kb.document_count} docs</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{kb.user_count} users</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(kb.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredKnowledgeBases.length === 0 && (
        <div className="text-center py-12">
          <Database className="mx-auto h-16 w-16 text-slate-400 mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No knowledge bases found</h3>
          <p className="text-slate-400 mb-6">
            {searchTerm || filterCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first knowledge base to get started'
            }
          </p>
          {!searchTerm && filterCategory === 'all' && (
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-gradient-to-r bg-blue-400 text-white font-medium rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Create Knowledge Base</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
