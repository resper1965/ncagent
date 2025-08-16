'use client'

import { useState } from 'react'
import { X, Upload, FileText, Database, AlertCircle, CheckCircle } from 'lucide-react'

interface DatasetUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  agentId: string
  agentName: string
}

interface UploadFormData {
  name: string
  description: string
  category: 'knowledge' | 'examples' | 'procedures' | 'context'
  priority: number
  file: File | null
}

const defaultFormData: UploadFormData = {
  name: '',
  description: '',
  category: 'knowledge',
  priority: 1,
  file: null
}

const categoryOptions = [
  { value: 'knowledge', label: 'Knowledge Base', description: 'General knowledge and facts' },
  { value: 'examples', label: 'Examples', description: 'Sample cases and scenarios' },
  { value: 'procedures', label: 'Procedures', description: 'Step-by-step instructions' },
  { value: 'context', label: 'Context', description: 'Background information and context' }
]

export default function DatasetUploadModal({ isOpen, onClose, onSuccess, agentId, agentName }: DatasetUploadModalProps) {
  const [formData, setFormData] = useState<UploadFormData>(defaultFormData)
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')

  const handleInputChange = (field: keyof UploadFormData, value: string | number | File) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['application/json', 'text/csv', 'text/plain']
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a JSON, CSV, or text file')
        return
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        return
      }

      setFormData(prev => ({ ...prev, file }))
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!formData.file) {
        setError('Please select a file to upload')
        setLoading(false)
        return
      }

      // Create FormData for file upload
      const uploadData = new FormData()
      uploadData.append('file', formData.file)
      uploadData.append('name', formData.name)
      uploadData.append('description', formData.description)
      uploadData.append('category', formData.category)
      uploadData.append('priority', formData.priority.toString())
      uploadData.append('agentId', agentId)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch(`/api/agents/${agentId}/datasets`, {
        method: 'POST',
        body: uploadData
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const data = await response.json()
      
      if (data.success) {
        onSuccess()
        onClose()
        setFormData(defaultFormData)
        setUploadProgress(0)
      } else {
        setError(data.message || 'Error uploading dataset')
      }
    } catch (error) {
      console.error('Error uploading dataset:', error)
      setError('Error uploading dataset')
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Upload Dataset</h2>
              <p className="text-slate-400 text-sm">Add knowledge to {agentName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Dataset Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Dataset Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Dataset Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., API Documentation"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
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
                placeholder="Describe the content and purpose of this dataset..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>Low Priority</option>
                <option value={2}>Medium Priority</option>
                <option value={3}>High Priority</option>
                <option value={4}>Critical Priority</option>
              </select>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">File Upload</h3>
            
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                <div className="space-y-2">
                  <p className="text-white font-medium">Upload Dataset File</p>
                  <p className="text-slate-400 text-sm">
                    Supported formats: JSON, CSV, TXT (max 10MB)
                  </p>
                </div>
                
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".json,.csv,.txt"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="mt-4 inline-flex items-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Choose File
                </label>
              </div>
              
              {formData.file && (
                <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-blue-400" />
                    <span className="text-white text-sm">{formData.file.name}</span>
                    <span className="text-slate-400 text-xs">
                      ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Category Description */}
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-white mb-2">Category Information</h4>
              <p className="text-slate-300 text-sm">
                {categoryOptions.find(opt => opt.value === formData.category)?.description}
              </p>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          {/* Upload Progress */}
          {loading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Uploading dataset...</span>
                <span className="text-slate-400">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

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
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Upload Dataset</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
