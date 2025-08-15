'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, X, Database } from 'lucide-react'
import { useUpload } from '@/hooks/useApi'
import { useKnowledgeBases } from '@/hooks/useApi'
import { useAuth } from '@/contexts/AuthContext'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: 'uploading' | 'success' | 'error'
  progress: number
  error?: string
}

export default function UploadPage() {
  const { user } = useAuth()
  const { uploadDocument, uploading, progress } = useUpload()
  const { fetchKnowledgeBases, loading: kbLoading } = useKnowledgeBases()
  
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [knowledgeBases, setKnowledgeBases] = useState<any[]>([])
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user) {
      loadKnowledgeBases()
    }
  }, [user])

  const loadKnowledgeBases = async () => {
    try {
      const kbs = await fetchKnowledgeBases()
      setKnowledgeBases(kbs || [])
    } catch (error) {
      console.error('Failed to load knowledge bases:', error)
    }
  }

  const handleFileSelect = async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const newFiles: UploadedFile[] = Array.from(selectedFiles).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0
    }))

    setFiles(prev => [...prev, ...newFiles])

    // Upload each file
    for (const file of selectedFiles) {
      await uploadFile(file)
    }
  }

  const uploadFile = async (file: File) => {
    try {
      const fileId = Math.random().toString(36).substr(2, 9)
      
      // Update file status to uploading
      setFiles(prev => prev.map(f => 
        f.name === file.name 
          ? { ...f, status: 'uploading', progress: 0 }
          : f
      ))

      // Upload document
      const result = await uploadDocument(file, selectedKnowledgeBase || undefined)
      
      // Update file status to success
      setFiles(prev => prev.map(f => 
        f.name === file.name 
          ? { ...f, status: 'success', progress: 100 }
          : f
      ))

      console.log('Upload successful:', result)
      
    } catch (error) {
      console.error('Upload failed:', error)
      
      // Update file status to error
      setFiles(prev => prev.map(f => 
        f.name === file.name 
          ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'Upload failed' }
          : f
      ))
    }
  }

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄'
    if (type.includes('word') || type.includes('document')) return '📝'
    if (type.includes('image')) return '🖼️'
    if (type.includes('video')) return '🎥'
    if (type.includes('audio')) return '🎵'
    return '📁'
  }

  if (!user) {
    return (
      <div className="dashboard-container">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Database className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              Authentication Required
            </h3>
            <p className="text-slate-400">
              Please sign in to upload documents
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      {/* Knowledge Base Selection */}
      <div className="bg-slate-800 backdrop-blur-sm border border-slate-700 rounded-xl p-4 mb-6">
        <div className="flex items-center space-x-3">
          <Database className="h-5 w-5 text-[#00ade8]" />
          <div className="flex-1">
            <label className="text-sm font-medium text-slate-200 mb-1 block">
              Knowledge Base (Optional)
            </label>
            <select
              value={selectedKnowledgeBase}
              onChange={(e) => setSelectedKnowledgeBase(e.target.value)}
              className="w-full p-2 bg-slate-700/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              disabled={kbLoading}
            >
              <option value="">No Knowledge Base</option>
              {knowledgeBases.map((kb) => (
                <option key={kb.id} value={kb.id}>
                  {kb.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-slate-800 backdrop-blur-sm border border-slate-700 rounded-xl p-8 mb-6">
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            isDragging
              ? 'border-[#00ade8] bg-[#00ade8]/10'
              : 'border-slate-600 hover:border-slate-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r bg-blue-400 rounded-full flex items-center justify-center">
              <Upload className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Upload Documents
              </h3>
              <p className="text-slate-400 mb-4">
                Drag and drop files here, or click to browse
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-6 py-3 bg-gradient-to-r bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Choose Files'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="bg-slate-800 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Uploaded Files ({files.length})
          </h3>
          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-700"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getFileIcon(file.type)}</div>
                  <div>
                    <p className="font-medium text-white">{file.name}</p>
                    <p className="text-sm text-slate-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {/* Progress Bar */}
                  <div className="w-32">
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          file.status === 'success'
                            ? 'bg-green-400'
                            : file.status === 'error'
                            ? 'bg-red-400'
                            : 'bg-[#00ade8]'
                        }`}
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Status Icon */}
                  <div className="flex items-center space-x-2">
                    {file.status === 'uploading' && (
                      <Loader2 className="h-5 w-5 text-[#00ade8] animate-spin" />
                    )}
                    {file.status === 'success' && (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    )}
                    {file.status === 'error' && (
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    )}
                    
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.json,.csv,.xml,.xlsx"
      />
    </div>
  )
}
