'use client'

import { useState, useCallback } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle, X, Loader2 } from 'lucide-react'
import { Navbar } from '../../components/ui/navbar'

interface UploadStatus {
  status: 'idle' | 'uploading' | 'success' | 'error'
  message: string
  progress?: number
}

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([])
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    status: 'idle',
    message: ''
  })
  const [dragActive, setDragActive] = useState(false)

  const onDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    const validFiles = droppedFiles.filter(file => 
      file.type === 'application/pdf' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles])
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const validFiles = selectedFiles.filter(file => 
      file.type === 'application/pdf' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
    setFiles(prev => [...prev, ...validFiles])
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const uploadFiles = async () => {
    if (files.length === 0) return

    setUploadStatus({
      status: 'uploading',
      message: 'Enviando documentos...',
      progress: 0
    })

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Converter arquivo para base64
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })

        const fileContent = base64.split(',')[1] // Remove data:application/pdf;base64,

        // Enviar para API
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: file.name,
            fileContent,
            mimeType: file.type,
            scope: 'GENERAL',
            classification: 'INTERNAL'
          })
        })

        if (!response.ok) {
          throw new Error(`Erro ao enviar ${file.name}`)
        }

        // Atualizar progresso
        const progress = ((i + 1) / files.length) * 100
        setUploadStatus({
          status: 'uploading',
          message: `Enviando ${i + 1} de ${files.length} documentos...`,
          progress
        })
      }

      setUploadStatus({
        status: 'success',
        message: `${files.length} documento(s) enviado(s) com sucesso!`
      })
      setFiles([])

    } catch (error) {
      console.error('Erro no upload:', error)
      setUploadStatus({
        status: 'error',
        message: error instanceof Error ? error.message : 'Erro ao enviar documentos'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950">
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                <Upload className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Upload de Documentos</h1>
                <p className="text-gray-300">Envie documentos para o n.agent</p>
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-8 mb-8">
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                dragActive 
                  ? 'border-primary bg-primary/10' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onDragEnter={onDrag}
              onDragLeave={onDrag}
              onDragOver={onDrag}
              onDrop={onDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Arraste e solte seus documentos aqui
              </h3>
              <p className="text-gray-300 mb-4">
                Suporta arquivos PDF e DOCX até 10MB cada
              </p>
              <label className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                Selecionar Arquivos
              </label>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">
                Arquivos Selecionados ({files.length})
              </h3>
              <div className="space-y-3">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-white">{file.name}</p>
                        <p className="text-sm text-gray-300">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Status */}
          {uploadStatus.status !== 'idle' && (
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6 mb-8">
              <div className="flex items-center space-x-3 mb-4">
                {uploadStatus.status === 'uploading' && (
                  <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
                )}
                {uploadStatus.status === 'success' && (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                )}
                {uploadStatus.status === 'error' && (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                )}
                <p className={`font-medium ${
                  uploadStatus.status === 'success' ? 'text-green-300' :
                  uploadStatus.status === 'error' ? 'text-red-300' :
                  'text-blue-300'
                }`}>
                  {uploadStatus.message}
                </p>
              </div>
              {uploadStatus.progress !== undefined && (
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadStatus.progress}%` }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Upload Button */}
          {files.length > 0 && uploadStatus.status === 'idle' && (
            <div className="text-center">
              <button
                onClick={uploadFiles}
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Upload className="mr-2 h-5 w-5" />
                Enviar {files.length} Documento(s)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
