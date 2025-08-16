'use client'

import { useState } from 'react'
import { X, Save, Plus, Trash2 } from 'lucide-react'

interface AgentCreateModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface AgentFormData {
  name: string
  title: string
  description: string
  focus: string
  icon: string
  core_principles: string[]
  expertise_areas: string[]
  communication_style: string
  response_format: string
}

const defaultFormData: AgentFormData = {
  name: '',
  title: '',
  description: '',
  focus: '',
  icon: '🤖',
  core_principles: [''],
  expertise_areas: [''],
  communication_style: 'Professional and clear',
  response_format: 'Structured with examples'
}

const iconOptions = [
  '🤖', '🧠', '📊', '⚖️', '🔬', '💼', '🎨', '📚', '💻', '🔧', '🏥', '🎓', '💰', '🌍', '🚀', '🎯'
]

export default function AgentCreateModal({ isOpen, onClose, onSuccess }: AgentCreateModalProps) {
  const [formData, setFormData] = useState<AgentFormData>(defaultFormData)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field: keyof AgentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field: 'core_principles' | 'expertise_areas', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayItem = (field: 'core_principles' | 'expertise_areas') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayItem = (field: 'core_principles' | 'expertise_areas', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          core_principles: formData.core_principles.filter(p => p.trim()),
          expertise_areas: formData.expertise_areas.filter(a => a.trim())
        })
      })

      const data = await response.json()
      
      if (data.success) {
        onSuccess()
        onClose()
        setFormData(defaultFormData)
      } else {
        alert('Error creating agent: ' + data.message)
      }
    } catch (error) {
      console.error('Error creating agent:', error)
      alert('Error creating agent')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Create New Agent</h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Agent Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Technical Expert"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Technical Documentation Specialist"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Icon
              </label>
              <div className="flex flex-wrap gap-2">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => handleInputChange('icon', icon)}
                    className={`p-2 text-xl rounded-lg border transition-colors ${
                      formData.icon === icon
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Describe the agent's purpose and specialization..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Focus Area *
              </label>
              <input
                type="text"
                value={formData.focus}
                onChange={(e) => handleInputChange('focus', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Technical accuracy and comprehensive documentation"
                required
              />
            </div>
          </div>

          {/* Core Principles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Core Principles</h3>
            {formData.core_principles.map((principle, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={principle}
                  onChange={(e) => handleArrayChange('core_principles', index, e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Accuracy first"
                />
                {formData.core_principles.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('core_principles', index)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('core_principles')}
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
            >
              <Plus className="h-4 w-4" />
              <span>Add Principle</span>
            </button>
          </div>

          {/* Expertise Areas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Expertise Areas</h3>
            {formData.expertise_areas.map((area, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={area}
                  onChange={(e) => handleArrayChange('expertise_areas', index, e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., API Documentation"
                />
                {formData.expertise_areas.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('expertise_areas', index)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('expertise_areas')}
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
            >
              <Plus className="h-4 w-4" />
              <span>Add Expertise Area</span>
            </button>
          </div>

          {/* Communication Style */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Communication Style</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Communication Style
                </label>
                <input
                  type="text"
                  value={formData.communication_style}
                  onChange={(e) => handleInputChange('communication_style', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Professional and clear"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Response Format
                </label>
                <input
                  type="text"
                  value={formData.response_format}
                  onChange={(e) => handleInputChange('response_format', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Structured with examples"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Create Agent</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
