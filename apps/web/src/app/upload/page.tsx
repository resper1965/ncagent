'use client'

import { useState, useRef } from 'react'
import { Upload, File, X, CheckCircle, AlertCircle, Loader2, Cloud, Database, Brain } from 'lucide-react'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: 'uploading' | 'processing' | 'completed' | 'error'
  progress: number
  error?: string
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    handleFiles(selectedFiles)
  }

  const handleFiles = async (fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0
    }))

    setFiles(prev => [...prev, ...newFiles])
    setUploading(true)

    for (const file of fileList) {
      await uploadFile(file)
    }

    setUploading(false)
  }

  const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        updateFileStatus(file.name, 'completed', 100)
      } else {
        updateFileStatus(file.name, 'error', 0, data.error)
      }
    } catch (error) {
      updateFileStatus(file.name, 'error', 0, 'Upload failed')
    }
  }

  const updateFileStatus = (fileName: string, status: UploadedFile['status'], progress: number, error?: string) => {
    setFiles(prev => prev.map(file => 
      file.name === fileName 
        ? { ...file, status, progress, error }
        : file
    ))
  }

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId))
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
    if (type.includes('excel') || type.includes('spreadsheet')) return '📊'
    if (type.includes('image')) return '🖼️'
    if (type.includes('text')) return '📄'
    return '📁'
  }

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />
      case 'processing':
        return <Loader2 className="h-4 w-4 text-yellow-400 animate-spin" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />
      default:
        return null
    }
  }

  const getStatusText = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return 'Uploading...'
      case 'processing':
        return 'Processing...'
      case 'completed':
        return 'Completed'
      case 'error':
        return 'Error'
      default:
        return ''
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Upload Documents</h2>
          <p className="text-gray-400 mt-1">Upload your documents to make them searchable and queryable</p>
        </div>
      </div>

      {/* Upload Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-gradient-to-r from-[#ffffff05] to-[#121212] backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Cloud className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Uploaded</p>
              <p className="text-2xl font-bold text-white">1,234</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#ffffff05] to-[#121212] backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Database className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Processed</p>
              <p className="text-2xl font-bold text-white">1,189</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#ffffff05] to-[#121212] backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Brain className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Vectorized</p>
              <p className="text-2xl font-bold text-white">1,156</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-gradient-to-r from-[#ffffff05] to-[#121212] backdrop-blur-sm border border-white/10 rounded-xl p-8">
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
            isDragging
              ? 'border-purple-400 bg-purple-500/10'
              : 'border-white/20 hover:border-white/40 hover:bg-white/5'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6">
            <Upload className="h-8 w-8 text-white" />
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">
            Drop your files here
          </h3>
          
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Upload PDFs, Word documents, Excel files, images, and text files. 
            We'll process and make them searchable.
          </p>
          
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Choose Files
            </button>
            <span className="text-gray-400">or drag and drop</span>
          </div>
          
          <div className="mt-6 text-xs text-gray-500">
            <p>Supported formats: PDF, DOC, DOCX, XLS, XLSX, TXT, PNG, JPG, GIF</p>
            <p>Maximum file size: 50MB per file</p>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg,.gif"
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="bg-gradient-to-r from-[#ffffff05] to-[#121212] backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Upload Queue</h3>
          
          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className="text-2xl">{getFileIcon(file.type)}</div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{file.name}</p>
                    <p className="text-sm text-gray-400">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {/* Progress Bar */}
                  {file.status === 'uploading' && (
                    <div className="w-24 bg-white/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                  
                  {/* Status */}
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(file.status)}
                    <span className={`text-sm ${
                      file.status === 'completed' ? 'text-green-400' :
                      file.status === 'error' ? 'text-red-400' :
                      file.status === 'processing' ? 'text-yellow-400' :
                      'text-blue-400'
                    }`}>
                      {getStatusText(file.status)}
                    </span>
                  </div>
                  
                  {/* Error Message */}
                  {file.error && (
                    <p className="text-sm text-red-400 max-w-xs truncate">{file.error}</p>
                  )}
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {uploading && (
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />
                <span className="text-blue-400">Processing uploads...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload Tips */}
      <div className="bg-gradient-to-r from-[#ffffff05] to-[#121212] backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Upload Tips</h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg mt-0.5">
              <CheckCircle className="h-4 w-4 text-green-400" />
            </div>
            <div>
              <p className="text-white font-medium">High Quality Results</p>
              <p className="text-sm text-gray-400">Use clear, well-formatted documents for better AI understanding</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg mt-0.5">
              <File className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-medium">Multiple Formats</p>
              <p className="text-sm text-gray-400">Upload various file types to build a comprehensive knowledge base</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-lg mt-0.5">
              <Brain className="h-4 w-4 text-purple-400" />
            </div>
            <div>
              <p className="text-white font-medium">AI Processing</p>
              <p className="text-sm text-gray-400">Documents are automatically processed and made searchable</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg mt-0.5">
              <AlertCircle className="h-4 w-4 text-yellow-400" />
            </div>
            <div>
              <p className="text-white font-medium">File Size Limits</p>
              <p className="text-sm text-gray-400">Keep files under 50MB for optimal processing speed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
