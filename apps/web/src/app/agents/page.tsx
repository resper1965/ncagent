'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Brain, Database, Settings, Users, Zap, Clock, CheckCircle, AlertCircle, MoreVertical, Eye, FileText } from 'lucide-react'
import AgentCreateModal from '../../components/AgentCreateModal'
import AgentEditModal from '../../components/AgentEditModal'
import DatasetUploadModal from '../../components/DatasetUploadModal'

interface AgentPersona {
  id: string
  name: string
  title: string
  description: string
  focus: string
  icon: string
  core_principles: string[]
  expertise_areas: string[]
  status: 'active' | 'inactive' | 'training'
  created_at: string
  updated_at: string
  dataset_count: number
  conversation_count: number
}

interface AgentDataset {
  id: string
  name: string
  description: string
  category: string
  priority: number
  created_at: string
  file_type?: string
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentPersona[]>([])
  const [selectedAgent, setSelectedAgent] = useState<AgentPersona | null>(null)
  const [agentDatasets, setAgentDatasets] = useState<AgentDataset[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDatasetModal, setShowDatasetModal] = useState(false)

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents')
      const data = await response.json()
      if (data.success) {
        setAgents(data.data.agents || [])
      } else {
        // Simulated data for demo
        setAgents([
          {
            id: '1',
            name: 'Tech Expert',
            title: 'Technical Documentation Specialist',
            description: 'Specialized in technical documentation, API references, and system architecture',
            focus: 'Technical accuracy and comprehensive documentation coverage',
            icon: '🤖',
            core_principles: ['Accuracy first', 'Comprehensive coverage', 'Clear explanations'],
            expertise_areas: ['API Documentation', 'System Architecture', 'Technical Writing'],
            status: 'active',
            created_at: '2024-01-01',
            updated_at: '2024-01-15',
            dataset_count: 12,
            conversation_count: 156
          },
          {
            id: '2',
            name: 'Business Analyst',
            title: 'Business Process Expert',
            description: 'Focused on business processes, requirements analysis, and strategic planning',
            focus: 'Business value and process optimization',
            icon: '📊',
            core_principles: ['Business value', 'Process optimization', 'Strategic thinking'],
            expertise_areas: ['Requirements Analysis', 'Process Optimization', 'Strategic Planning'],
            status: 'active',
            created_at: '2024-01-05',
            updated_at: '2024-01-14',
            dataset_count: 8,
            conversation_count: 89
          },
          {
            id: '3',
            name: 'Legal Advisor',
            title: 'Legal Documentation Specialist',
            description: 'Expert in legal documents, compliance, and regulatory requirements',
            focus: 'Legal accuracy and compliance adherence',
            icon: '⚖️',
            core_principles: ['Legal accuracy', 'Compliance first', 'Risk assessment'],
            expertise_areas: ['Legal Documents', 'Compliance', 'Regulatory Requirements'],
            status: 'training',
            created_at: '2024-01-10',
            updated_at: '2024-01-13',
            dataset_count: 5,
            conversation_count: 23
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching agents:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAgentDatasets = async (agentId: string) => {
    try {
      const response = await fetch(`/api/agents/${agentId}/datasets`)
      const data = await response.json()
      if (data.success) {
        setAgentDatasets(data.data.datasets || [])
      }
    } catch (error) {
      console.error('Error fetching datasets:', error)
    }
  }

  const handleAgentSelect = (agent: AgentPersona) => {
    setSelectedAgent(agent)
    fetchAgentDatasets(agent.id)
  }

  const handleDeleteAgent = async (agentId: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) return

    try {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        fetchAgents()
        if (selectedAgent?.id === agentId) {
          setSelectedAgent(null)
          setAgentDatasets([])
        }
      }
    } catch (error) {
      console.error('Error deleting agent:', error)
    }
  }

  const getStatusIcon = (status: AgentPersona['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'training':
        return <Clock className="h-4 w-4 text-yellow-400" />
      case 'inactive':
        return <AlertCircle className="h-4 w-4 text-red-400" />
      default:
        return null
    }
  }

  const getStatusText = (status: AgentPersona['status']) => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'training':
        return 'Training'
      case 'inactive':
        return 'Inactive'
      default:
        return ''
    }
  }

  const getStatusColor = (status: AgentPersona['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400'
      case 'training':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'inactive':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-gray-500/20 text-slate-400'
    }
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Clock className="h-6 w-6 text-purple-400 animate-spin" />
            <span className="text-white">Loading agents...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      {/* Modals */}
      <AgentCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchAgents}
      />
      
      <AgentEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={fetchAgents}
        agent={selectedAgent}
      />
      
      <DatasetUploadModal
        isOpen={showDatasetModal}
        onClose={() => setShowDatasetModal(false)}
        onSuccess={() => {
          if (selectedAgent) {
            fetchAgentDatasets(selectedAgent.id)
          }
        }}
        agentId={selectedAgent?.id || ''}
        agentName={selectedAgent?.name || ''}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 mt-1">Manage and configure your specialized AI agents</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-gradient-to-r bg-blue-400 text-white font-medium rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Agent</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-slate-800 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Brain className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Agents</p>
              <p className="text-xl font-bold text-white">{agents.length}</p>
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
                {agents.filter(a => a.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Database className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Datasets</p>
              <p className="text-xl font-bold text-white">
                {agents.reduce((sum, agent) => sum + agent.dataset_count, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Zap className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Conversations</p>
              <p className="text-xl font-bold text-white">
                {agents.reduce((sum, agent) => sum + agent.conversation_count, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Agents List */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-white">Available Agents</h3>
            </div>
            <div className="p-4">
              {agents.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No agents found</h3>
                  <p className="text-slate-400">Create your first agent to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedAgent?.id === agent.id
                          ? 'bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30'
                          : 'bg-slate-700/50 hover:bg-slate-700/50 border border-slate-700'
                      }`}
                      onClick={() => handleAgentSelect(agent)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-xl">{agent.icon}</div>
                          <div>
                            <h3 className="font-medium text-white text-sm">{agent.name}</h3>
                            <p className="text-xs text-slate-400">{agent.title}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(agent.status)}
                            <span className={`text-xs px-1 py-0.5 rounded-full ${getStatusColor(agent.status)}`}>
                              {getStatusText(agent.status)}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedAgent(agent)
                              setShowEditModal(true)
                            }}
                            className="p-1 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded transition-colors"
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteAgent(agent.id)
                            }}
                            className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
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

        {/* Agent Details */}
        <div className="lg:col-span-3">
          {selectedAgent ? (
            <div className="space-y-6">
              {/* Agent Information */}
              <div className="bg-slate-800 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                      <span className="text-2xl">{selectedAgent.icon}</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedAgent.name}</h2>
                      <p className="text-slate-400">{selectedAgent.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDatasetModal(true)}
                    className="px-4 py-2 bg-gradient-to-r bg-blue-400 text-white font-medium rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                  >
                    <Database className="h-4 w-4" />
                    <span>Add Dataset</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                    <p className="text-slate-200">{selectedAgent.description}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Focus</h3>
                    <p className="text-slate-200">{selectedAgent.focus}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Core Principles</h3>
                  <ul className="space-y-2">
                    {selectedAgent.core_principles.map((principle, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-cyan-400 mt-1">•</span>
                        <span className="text-slate-200">{principle}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Expertise Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAgent.expertise_areas.map((area, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full text-sm"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Agent Datasets */}
              <div className="bg-slate-800 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Knowledge Datasets</h3>
                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                      <FileText className="h-4 w-4" />
                      <span>Supported formats: JSON, CSV</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  {agentDatasets.length === 0 ? (
                    <div className="text-center py-8">
                      <Database className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                      <h4 className="text-lg font-medium text-white mb-2">No datasets found</h4>
                      <p className="text-slate-400 mb-4">Add datasets to customize the agent's knowledge</p>
                      <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                        <h5 className="text-sm font-medium text-white mb-2">Supported File Types:</h5>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                            <span className="text-slate-300">JSON (.json)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                            <span className="text-slate-300">CSV (.csv)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {agentDatasets.map((dataset) => (
                        <div key={dataset.id} className="p-4 bg-slate-700/50 rounded-xl border border-slate-700">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-white">{dataset.name}</h4>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                dataset.category === 'knowledge' ? 'bg-blue-500/20 text-blue-300' :
                                dataset.category === 'examples' ? 'bg-green-500/20 text-green-300' :
                                dataset.category === 'procedures' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-purple-500/20 text-purple-300'
                              }`}>
                                {dataset.category}
                              </span>
                              {dataset.file_type && (
                                <span className="px-2 py-1 bg-slate-600/50 text-slate-300 rounded-full text-xs">
                                  {dataset.file_type.toUpperCase()}
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-slate-200 mb-2">{dataset.description}</p>
                          <div className="text-xs text-slate-400">
                            Priority: {dataset.priority} • Created: {new Date(dataset.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800 backdrop-blur-sm border border-slate-700 rounded-xl p-12 text-center">
              <Brain className="mx-auto h-16 w-16 text-slate-400 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Select an Agent</h3>
              <p className="text-slate-400">Choose an agent from the list to view details and manage datasets</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
