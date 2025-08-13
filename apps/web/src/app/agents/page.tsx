'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Brain, Database, Settings } from 'lucide-react'
import { Navbar } from '../../components/ui/navbar'
import { AgentPersona, AgentDataset } from '../../lib/agent-system'

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
      }
    } catch (error) {
      console.error('Erro ao buscar agentes:', error)
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
      console.error('Erro ao buscar datasets:', error)
    }
  }

  const handleAgentSelect = (agent: AgentPersona) => {
    setSelectedAgent(agent)
    fetchAgentDatasets(agent.id)
  }

  const handleDeleteAgent = async (agentId: string) => {
    if (!confirm('Tem certeza que deseja deletar este agente?')) return

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
      console.error('Erro ao deletar agente:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950">
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                  <Brain className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Gerenciamento de Agentes</h1>
                  <p className="text-gray-300">Configure e personalize seus agentes de IA</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Agente
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de Agentes */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
                <div className="p-6 border-b border-gray-700">
                  <h2 className="text-lg font-semibold text-white">Agentes Disponíveis</h2>
                </div>
                <div className="p-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-gray-300">Carregando agentes...</p>
                    </div>
                  ) : agents.length === 0 ? (
                    <div className="text-center py-8">
                      <Brain className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">Nenhum agente encontrado</h3>
                      <p className="text-gray-300">Crie seu primeiro agente para começar</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {agents.map((agent) => (
                        <div
                          key={agent.id}
                          className={`p-4 rounded-lg cursor-pointer transition-colors ${
                            selectedAgent?.id === agent.id
                              ? 'bg-primary/20 border border-primary'
                              : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                          onClick={() => handleAgentSelect(agent)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="text-2xl">{agent.icon}</div>
                              <div>
                                <h3 className="font-medium text-white">{agent.name}</h3>
                                <p className="text-sm text-gray-300">{agent.title}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedAgent(agent)
                                  setShowEditModal(true)
                                }}
                                className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteAgent(agent.id)
                                }}
                                className="p-1 text-red-400 hover:text-red-300 transition-colors"
                              >
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

            {/* Detalhes do Agente Selecionado */}
            <div className="lg:col-span-2">
              {selectedAgent ? (
                <div className="space-y-6">
                  {/* Informações do Agente */}
                  <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{selectedAgent.icon}</div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">{selectedAgent.name}</h2>
                          <p className="text-gray-300">{selectedAgent.title}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowDatasetModal(true)}
                        className="inline-flex items-center px-3 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <Database className="h-4 w-4 mr-2" />
                        Adicionar Dataset
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Descrição</h3>
                        <p className="text-gray-300">{selectedAgent.description}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Foco</h3>
                        <p className="text-gray-300">{selectedAgent.focus}</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-white mb-3">Princípios Fundamentais</h3>
                      <ul className="space-y-2">
                        {selectedAgent.core_principles.map((principle, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-primary mt-1">•</span>
                            <span className="text-gray-300">{principle}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-white mb-3">Áreas de Expertise</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedAgent.expertise_areas.map((area, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Datasets do Agente */}
                  <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
                    <div className="p-6 border-b border-gray-700">
                      <h3 className="text-lg font-semibold text-white">Datasets de Conhecimento</h3>
                    </div>
                    <div className="p-6">
                      {agentDatasets.length === 0 ? (
                        <div className="text-center py-8">
                          <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <h4 className="text-lg font-medium text-white mb-2">Nenhum dataset encontrado</h4>
                          <p className="text-gray-300">Adicione datasets para personalizar o conhecimento do agente</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {agentDatasets.map((dataset) => (
                            <div key={dataset.id} className="p-4 bg-gray-700 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-white">{dataset.name}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  dataset.category === 'knowledge' ? 'bg-blue-500/20 text-blue-300' :
                                  dataset.category === 'examples' ? 'bg-green-500/20 text-green-300' :
                                  dataset.category === 'procedures' ? 'bg-yellow-500/20 text-yellow-300' :
                                  'bg-purple-500/20 text-purple-300'
                                }`}>
                                  {dataset.category}
                                </span>
                              </div>
                              <p className="text-sm text-gray-300 mb-2">{dataset.description}</p>
                              <div className="text-xs text-gray-400">
                                Prioridade: {dataset.priority} • Criado: {new Date(dataset.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-12 text-center">
                  <Brain className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">Selecione um Agente</h3>
                  <p className="text-gray-300">Escolha um agente da lista para ver seus detalhes e gerenciar seus datasets</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modais serão implementados em componentes separados */}
    </div>
  )
}
