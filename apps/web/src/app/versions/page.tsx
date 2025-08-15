'use client'

import { useState } from 'react'
import { GitBranch, Calendar, User, Tag, Download, Eye, Settings, Clock, CheckCircle, AlertCircle } from 'lucide-react'

interface Version {
  id: string
  version: string
  name: string
  description: string
  releaseDate: string
  author: string
  status: 'stable' | 'beta' | 'alpha' | 'deprecated'
  downloadCount: number
  changes: string[]
  tags: string[]
}

export default function VersionsPage() {
  const [versions] = useState<Version[]>([
    {
      id: '1',
      version: '2.1.0',
      name: 'Enhanced AI Capabilities',
      description: 'Major update with improved AI processing, new knowledge base features, and enhanced chat interface',
      releaseDate: '2024-01-15',
      author: 'Development Team',
      status: 'stable',
      downloadCount: 1234,
      changes: [
        'Enhanced AI processing algorithms',
        'New knowledge base segmentation',
        'Improved chat interface with multi-agent support',
        'Advanced document processing capabilities',
        'Performance optimizations'
      ],
      tags: ['major', 'ai-enhancement', 'performance']
    },
    {
      id: '2',
      version: '2.0.5',
      name: 'Bug Fixes & Improvements',
      description: 'Critical bug fixes and minor improvements for better stability',
      releaseDate: '2024-01-10',
      author: 'Development Team',
      status: 'stable',
      downloadCount: 856,
      changes: [
        'Fixed document upload issues',
        'Improved error handling',
        'Enhanced security measures',
        'Minor UI improvements'
      ],
      tags: ['patch', 'bug-fixes', 'security']
    },
    {
      id: '3',
      version: '2.1.0-beta',
      name: 'Beta Release - AI Enhancements',
      description: 'Beta version with experimental AI features and new capabilities',
      releaseDate: '2024-01-08',
      author: 'Development Team',
      status: 'beta',
      downloadCount: 234,
      changes: [
        'Experimental AI processing features',
        'New agent management system',
        'Advanced analytics dashboard',
        'Beta testing features'
      ],
      tags: ['beta', 'experimental', 'ai-features']
    },
    {
      id: '4',
      version: '1.9.2',
      name: 'Legacy Version',
      description: 'Previous stable version with basic features',
      releaseDate: '2023-12-20',
      author: 'Development Team',
      status: 'deprecated',
      downloadCount: 567,
      changes: [
        'Basic document processing',
        'Simple chat interface',
        'Core functionality'
      ],
      tags: ['legacy', 'deprecated']
    }
  ])

  const getStatusIcon = (status: Version['status']) => {
    switch (status) {
      case 'stable':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'beta':
        return <Clock className="h-4 w-4 text-yellow-400" />
      case 'alpha':
        return <AlertCircle className="h-4 w-4 text-orange-400" />
      case 'deprecated':
        return <AlertCircle className="h-4 w-4 text-red-400" />
      default:
        return null
    }
  }

  const getStatusText = (status: Version['status']) => {
    switch (status) {
      case 'stable':
        return 'Stable'
      case 'beta':
        return 'Beta'
      case 'alpha':
        return 'Alpha'
      case 'deprecated':
        return 'Deprecated'
      default:
        return ''
    }
  }

  const getStatusColor = (status: Version['status']) => {
    switch (status) {
      case 'stable':
        return 'bg-green-500/20 text-green-400'
      case 'beta':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'alpha':
        return 'bg-orange-500/20 text-orange-400'
      case 'deprecated':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-gray-500/20 text-slate-400'
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Version Control</h2>
          <p className="text-slate-400 mt-1">Manage and track application versions and releases</p>
        </div>
                    <button className="px-4 py-2 bg-gradient-to-r bg-blue-400 text-white font-medium rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2">
          <GitBranch className="h-4 w-4" />
          <span>Create Release</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="bg-slate-800 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <GitBranch className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Versions</p>
              <p className="text-2xl font-bold text-white">{versions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Stable</p>
              <p className="text-2xl font-bold text-white">
                {versions.filter(v => v.status === 'stable').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Beta/Alpha</p>
              <p className="text-2xl font-bold text-white">
                {versions.filter(v => v.status === 'beta' || v.status === 'alpha').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Download className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Downloads</p>
              <p className="text-2xl font-bold text-white">
                {versions.reduce((sum, v) => sum + v.downloadCount, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Version Highlight */}
      <div className="bg-slate-800 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r bg-blue-400 rounded-lg">
              <Tag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Current Stable Version</h3>
              <p className="text-slate-400">Latest production release</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon('stable')}
            <span className="text-sm text-green-400 font-medium">v2.1.0</span>
          </div>
        </div>
        <p className="text-slate-200 mb-4">
          Enhanced AI Capabilities - Major update with improved AI processing, new knowledge base features, and enhanced chat interface
        </p>
        <div className="flex items-center space-x-4 text-sm text-slate-400">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Released: Jan 15, 2024</span>
          </div>
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>Development Team</span>
          </div>
          <div className="flex items-center space-x-1">
            <Download className="h-4 w-4" />
            <span>1,234 downloads</span>
          </div>
        </div>
      </div>

      {/* Versions List */}
      <div className="bg-slate-800 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">All Versions</h3>
        </div>
        <div className="divide-y divide-white/10">
          {versions.map((version) => (
            <div key={version.id} className="p-6 hover:bg-slate-700/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-white">v{version.version}</h4>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(version.status)}
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(version.status)}`}>
                        {getStatusText(version.status)}
                      </span>
                    </div>
                  </div>
                  
                  <h5 className="text-white font-medium mb-1">{version.name}</h5>
                  <p className="text-slate-400 mb-3">{version.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{version.releaseDate}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{version.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="h-3 w-3" />
                      <span>{version.downloadCount} downloads</span>
                    </div>
                  </div>
                  
                  {version.changes.length > 0 && (
                    <div className="mb-3">
                      <h6 className="text-sm font-medium text-white mb-2">Key Changes:</h6>
                      <ul className="space-y-1">
                        {version.changes.slice(0, 3).map((change, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm text-slate-200">
                            <span className="text-purple-400 mt-1">•</span>
                            <span>{change}</span>
                          </li>
                        ))}
                        {version.changes.length > 3 && (
                          <li className="text-xs text-gray-500">
                            +{version.changes.length - 3} more changes
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  {version.tags.length > 0 && (
                    <div className="flex items-center space-x-2">
                      {version.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-slate-700/50 rounded-full text-slate-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                    title="Settings"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
