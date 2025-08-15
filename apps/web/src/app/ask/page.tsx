'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, ChevronDown, Brain, Users, MessageSquare, History, RefreshCw, Database } from 'lucide-react'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  sources?: any[]
  confidence?: number
  agent_used?: string
  type?: 'single_agent' | 'multi_agent' | 'default'
  multi_agent_responses?: any[]
  debate_summary?: string
  consensus?: string
  disagreements?: string[]
}

interface ConversationSession {
  id: string
  title: string
  agent_used?: string
  message_count: number
  last_activity: string
}

export default function AskPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [agents, setAgents] = useState<any[]>([])
  const [knowledgeBases, setKnowledgeBases] = useState<any[]>([])
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null)
  const [selectedAgents, setSelectedAgents] = useState<any[]>([])
  const [selectedKnowledgeBases, setSelectedKnowledgeBases] = useState<any[]>([])
  const [showAgentSelector, setShowAgentSelector] = useState(false)
  const [showKBSelector, setShowKBSelector] = useState(false)
  const [enableDebate, setEnableDebate] = useState(true)
  const [enableMemory, setEnableMemory] = useState(true)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [showSessionInfo, setShowSessionInfo] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    fetchAgents()
    fetchKnowledgeBases()
  }, [])

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents')
      const data = await response.json()
      if (data.success) {
        setAgents(data.data.agents || [])
      }
    } catch (error) {
      console.error('Error fetching agents:', error)
    }
  }

  const fetchKnowledgeBases = async () => {
    try {
      const response = await fetch('/api/knowledge-bases')
      const data = await response.json()
      if (data.success) {
        setKnowledgeBases(data.data.knowledge_bases || [])
      }
    } catch (error) {
      console.error('Error fetching knowledge bases:', error)
    }
  }

  const startNewSession = () => {
    setCurrentSessionId(null)
    setMessages([])
    setShowSessionInfo(false)
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const requestBody: any = {
        question: input,
        sessionId: currentSessionId,
        enable_memory: enableMemory,
        knowledge_base_ids: selectedKnowledgeBases.map(kb => kb.id)
      }

      if (selectedAgents.length > 1) {
        requestBody.agentIds = selectedAgents.map(agent => agent.id)
        requestBody.enable_debate = enableDebate
      } else if (selectedAgent) {
        requestBody.agentId = selectedAgent.id
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (data.data.session_id && !currentSessionId) {
        setCurrentSessionId(data.data.session_id)
      }

      let assistantMessage: Message

      if (data.data.type === 'multi_agent') {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          content: data.data.debate_summary || 'Debate between agents completed.',
          role: 'assistant',
          timestamp: new Date(),
          type: 'multi_agent',
          multi_agent_responses: data.data.responses,
          debate_summary: data.data.debate_summary,
          consensus: data.data.consensus,
          disagreements: data.data.disagreements
        }
      } else {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          content: data.data.answer || data.data.content,
          role: 'assistant',
          timestamp: new Date(),
          sources: data.data.sources,
          confidence: data.data.confidence,
          agent_used: data.data.agent_used,
          type: data.data.type
        }
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, an error occurred while processing your question. Please try again.',
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleAgentSelect = (agent: any) => {
    if (selectedAgents.find(a => a.id === agent.id)) {
      setSelectedAgents(prev => prev.filter(a => a.id !== agent.id))
      setSelectedAgent(null)
    } else {
      setSelectedAgents(prev => [...prev, agent])
      setSelectedAgent(null)
    }
  }

  const handleSingleAgentSelect = (agent: any | null) => {
    setSelectedAgent(agent)
    setSelectedAgents([])
  }

  const handleKnowledgeBaseSelect = (kb: any) => {
    if (selectedKnowledgeBases.find(k => k.id === kb.id)) {
      setSelectedKnowledgeBases(prev => prev.filter(k => k.id !== kb.id))
    } else {
      setSelectedKnowledgeBases(prev => [...prev, kb])
    }
  }

  const getSelectedAgentsText = () => {
    if (selectedAgents.length > 0) {
      return `${selectedAgents.length} Agent${selectedAgents.length > 1 ? 's' : ''} Selected`
    }
    if (selectedAgent) {
      return `${selectedAgent.name} - ${selectedAgent.title}`
    }
    return 'Gabi Default'
  }

  const getSelectedKBText = () => {
    if (selectedKnowledgeBases.length === 0) {
      return 'All Knowledge Bases'
    }
    if (selectedKnowledgeBases.length === 1) {
      return selectedKnowledgeBases[0].name
    }
    return `${selectedKnowledgeBases.length} Knowledge Bases Selected`
  }

  return (
    <div className="dashboard-container">
      {/* Agent and Knowledge Base Selectors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Agent Selector */}
        <div className="bg-slate-800 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
          <div className="flex-1 relative">
            <button
              onClick={() => setShowAgentSelector(!showAgentSelector)}
              className="w-full bg-slate-700/50 border border-slate-700 rounded-lg p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {selectedAgents.length > 1 ? (
                  <Users className="h-5 w-5 text-[#00ade8]" />
                ) : (
                  <Brain className="h-5 w-5 text-[#00ade8]" />
                )}
                <div className="text-left">
                  <p className="text-sm text-slate-200">Selected Agent(s)</p>
                  <p className="font-medium text-white">
                    {getSelectedAgentsText()}
                  </p>
                </div>
              </div>
              <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${showAgentSelector ? 'rotate-180' : ''}`} />
            </button>

            {showAgentSelector && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                <div className="p-4">
                  {/* Memory Toggle */}
                  <div className="p-3 border-b border-slate-700">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={enableMemory}
                        onChange={(e) => setEnableMemory(e.target.checked)}
                        className="rounded border-slate-600 bg-slate-700/50 text-[#00ade8] focus:ring-blue-400"
                      />
                      <span className="text-sm text-slate-200">Enable conversational memory</span>
                    </label>
                  </div>

                  {/* Debate Toggle */}
                  {selectedAgents.length > 1 && (
                    <div className="p-3 border-b border-slate-700">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={enableDebate}
                          onChange={(e) => setEnableDebate(e.target.checked)}
                          className="rounded border-slate-600 bg-slate-700/50 text-[#00ade8] focus:ring-blue-400"
                        />
                        <span className="text-sm text-slate-200">Enable debate between agents</span>
                      </label>
                    </div>
                  )}

                  {/* Single Agent Option */}
                  <button
                    onClick={() => {
                      handleSingleAgentSelect(null)
                      setShowAgentSelector(false)
                    }}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      !selectedAgent && selectedAgents.length === 0
                        ? 'bg-[#00ade8]/20 border border-[#00ade8]'
                        : 'hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Bot className="h-5 w-5 text-[#00ade8]" />
                      <div>
                        <p className="font-medium text-white">Gabi Default</p>
                        <p className="text-sm text-slate-200">General assistant for documents</p>
                      </div>
                    </div>
                  </button>

                  {/* Single Agent Selection */}
                  <div className="mt-2">
                    <p className="text-xs text-slate-400 px-3 py-1">Single Agent:</p>
                    {agents.map((agent) => (
                      <button
                        key={agent.id}
                        onClick={() => {
                          handleSingleAgentSelect(agent)
                          setShowAgentSelector(false)
                        }}
                        className={`w-full p-3 rounded-lg text-left transition-colors ${
                          selectedAgent?.id === agent.id
                            ? 'bg-[#00ade8]/20 border border-[#00ade8]'
                            : 'hover:bg-slate-700/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-xl">{agent.icon}</div>
                          <div>
                            <p className="font-medium text-white">{agent.name}</p>
                            <p className="text-sm text-slate-200">{agent.title}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Multiple Agents Selection */}
                  <div className="mt-2">
                    <p className="text-xs text-slate-400 px-3 py-1">Multiple Agents (Debate):</p>
                    {agents.map((agent) => (
                      <button
                        key={`multi-${agent.id}`}
                        onClick={() => handleAgentSelect(agent)}
                        className={`w-full p-3 rounded-lg text-left transition-colors ${
                          selectedAgents.find(a => a.id === agent.id)
                            ? 'bg-[#00ade8]/20 border border-[#00ade8]'
                            : 'hover:bg-slate-700/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedAgents.find(a => a.id === agent.id) !== undefined}
                            readOnly
                            className="rounded border-slate-600 bg-slate-700/50 text-[#00ade8] focus:ring-blue-400"
                          />
                          <div className="text-xl">{agent.icon}</div>
                          <div>
                            <p className="font-medium text-white">{agent.name}</p>
                            <p className="text-sm text-slate-200">{agent.title}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Knowledge Base Selector */}
        <div className="bg-slate-800 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
          <div className="flex-1 relative">
            <button
              onClick={() => setShowKBSelector(!showKBSelector)}
              className="w-full bg-slate-700/50 border border-slate-700 rounded-lg p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Database className="h-5 w-5 text-[#00ade8]" />
                <div className="text-left">
                  <p className="text-sm text-slate-200">Knowledge Bases</p>
                  <p className="font-medium text-white">
                    {getSelectedKBText()}
                  </p>
                </div>
              </div>
              <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${showKBSelector ? 'rotate-180' : ''}`} />
            </button>

            {showKBSelector && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                <div className="p-4">
                  {/* Select All Option */}
                  <button
                    onClick={() => {
                      setSelectedKnowledgeBases([])
                      setShowKBSelector(false)
                    }}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      selectedKnowledgeBases.length === 0
                        ? 'bg-[#00ade8]/20 border border-[#00ade8]'
                        : 'hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Database className="h-5 w-5 text-[#00ade8]" />
                      <div>
                        <p className="font-medium text-white">All Knowledge Bases</p>
                        <p className="text-sm text-slate-200">Search across all available knowledge</p>
                      </div>
                    </div>
                  </button>

                  {/* Individual Knowledge Base Selection */}
                  <div className="mt-2">
                    <p className="text-xs text-slate-400 px-3 py-1">Specific Knowledge Bases:</p>
                    {knowledgeBases.map((kb) => (
                      <button
                        key={kb.id}
                        onClick={() => handleKnowledgeBaseSelect(kb)}
                        className={`w-full p-3 rounded-lg text-left transition-colors ${
                          selectedKnowledgeBases.find(k => k.id === kb.id)
                            ? 'bg-[#00ade8]/20 border border-[#00ade8]'
                            : 'hover:bg-slate-700/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedKnowledgeBases.find(k => k.id === kb.id) !== undefined}
                            readOnly
                            className="rounded border-slate-600 bg-slate-700/50 text-[#00ade8] focus:ring-blue-400"
                          />
                          <div>
                            <p className="font-medium text-white">{kb.name}</p>
                            <p className="text-sm text-slate-200">{kb.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Session Info */}
      {showSessionInfo && currentSessionId && (
        <div className="bg-slate-800 backdrop-blur-sm border border-slate-700 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-200">Active Session</p>
              <p className="text-xs text-slate-400 font-mono">{currentSessionId}</p>
              <p className="text-xs text-slate-400">{messages.length} messages</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">
                Memory: {enableMemory ? 'Enabled' : 'Disabled'}
              </p>
              {selectedAgents.length > 1 && (
                <p className="text-xs text-slate-400">
                  Debate: {enableDebate ? 'Enabled' : 'Disabled'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 bg-slate-800 backdrop-blur-sm border border-slate-700 rounded-xl shadow-sm overflow-hidden">
        <div className="h-[600px] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <Bot className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  Welcome to Gabi!
                </h3>
                <p className="text-slate-200">
                  {selectedAgents.length > 1 
                    ? `Chat with ${selectedAgents.length} specialized agents`
                    : selectedAgent 
                      ? `Chat with ${selectedAgent.name}, ${selectedAgent.title.toLowerCase()}`
                      : 'Ask questions about your documents and get precise answers.'
                  }
                </p>
                {selectedAgent && (
                  <p className="text-sm text-slate-400 mt-2">
                    {selectedAgent.description}
                  </p>
                )}
                {selectedAgents.length > 1 && (
                  <p className="text-sm text-slate-400 mt-2">
                    Agents will debate and provide different perspectives on your questions.
                  </p>
                )}
                {enableMemory && (
                  <p className="text-sm text-[#00ade8] mt-2">
                    💾 Conversational memory enabled - your conversations will be remembered
                  </p>
                )}
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl p-4 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r bg-blue-400 text-white'
                        : 'bg-slate-700/50 text-white border border-slate-700'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.role === 'assistant' && (
                        <div className="flex items-center space-x-2">
                          {message.type === 'multi_agent' ? (
                            <Users className="h-5 w-5 text-[#00ade8] mt-0.5 flex-shrink-0" />
                          ) : message.agent_used && message.agent_used !== 'Gabi Default' ? (
                            <Brain className="h-5 w-5 text-[#00ade8] mt-0.5 flex-shrink-0" />
                          ) : (
                            <Bot className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                          )}
                          {message.agent_used && (
                            <span className="text-xs text-slate-400">
                              {message.agent_used}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        
                        {/* Multi-agent responses */}
                        {message.type === 'multi_agent' && message.multi_agent_responses && (
                          <div className="mt-4 space-y-3">
                            <div className="border-t border-slate-700 pt-3">
                              <h4 className="text-sm font-medium text-slate-200 mb-2">Individual Responses:</h4>
                              {message.multi_agent_responses.map((response, index) => (
                                <div key={index} className="mb-3 p-3 bg-slate-700/50 rounded-lg border border-slate-700">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Brain className="h-4 w-4 text-[#00ade8]" />
                                    <span className="text-sm font-medium text-white">{response.agent_used}</span>
                                  </div>
                                  <p className="text-sm text-gray-200">{response.content}</p>
                                </div>
                              ))}
                            </div>
                            
                            {message.consensus && (
                              <div className="border-t border-slate-700 pt-3">
                                <h4 className="text-sm font-medium text-green-400 mb-1">Consensus:</h4>
                                <p className="text-sm text-slate-200">{message.consensus}</p>
                              </div>
                            )}
                            
                            {message.disagreements && message.disagreements.length > 0 && (
                              <div className="border-t border-slate-700 pt-3">
                                <h4 className="text-sm font-medium text-yellow-400 mb-1">Disagreements:</h4>
                                <ul className="text-sm text-slate-200 space-y-1">
                                  {message.disagreements.map((disagreement, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                      <span className="text-yellow-400 mt-1">•</span>
                                      <span>{disagreement}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {message.sources && message.sources.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-700">
                            <p className="text-xs text-slate-400 mb-2">
                              Sources ({message.sources.length}):
                            </p>
                            <div className="space-y-1">
                              {message.sources.slice(0, 3).map((source, index) => (
                                <div key={index} className="text-xs text-slate-200 bg-slate-700/50 p-2 rounded border border-slate-700">
                                  {source.content}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {message.confidence && (
                          <p className="text-xs text-slate-400 mt-2">
                            Confidence: {Math.round(message.confidence * 100)}%
                          </p>
                        )}
                      </div>
                      {message.role === 'user' && (
                        <User className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-5 w-5 text-slate-400 animate-spin" />
                    <span className="text-slate-200">
                      {selectedAgents.length > 1 
                        ? 'Agents are debating...'
                        : selectedAgent 
                          ? `${selectedAgent.name} is thinking...`
                          : 'Processing...'
                      }
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-700 p-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    selectedAgents.length > 1
                      ? `Ask something to ${selectedAgents.length} agents...`
                      : selectedAgent 
                        ? `Ask something to ${selectedAgent.name}...`
                        : "Type your question..."
                  }
                  className="w-full p-3 bg-slate-700/50 border border-slate-700 rounded-lg resize-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-gray-400"
                  rows={2}
                  disabled={loading}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="px-6 py-3 bg-gradient-to-r bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
