'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'

interface TestResult {
  id: string
  name: string
  status: 'pending' | 'running' | 'passed' | 'failed'
  message?: string
  duration?: number
}

export default function TestPage() {
  const [tests, setTests] = useState<TestResult[]>([
    { id: '1', name: 'Database Connection', status: 'pending' },
    { id: '2', name: 'API Endpoints', status: 'pending' },
    { id: '3', name: 'Authentication', status: 'pending' },
    { id: '4', name: 'File Upload', status: 'pending' },
    { id: '5', name: 'AI Models', status: 'pending' },
    { id: '6', name: 'Vector Database', status: 'pending' }
  ])
  const [running, setRunning] = useState(false)

  const runTests = async () => {
    setRunning(true)
    
    for (let i = 0; i < tests.length; i++) {
      // Simulate test running
      setTests(prev => prev.map((test, index) => 
        index === i ? { ...test, status: 'running' } : test
      ))
      
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
      
      // Simulate test result
      const passed = Math.random() > 0.3
      setTests(prev => prev.map((test, index) => 
        index === i ? { 
          ...test, 
          status: passed ? 'passed' : 'failed',
          message: passed ? 'Test completed successfully' : 'Test failed',
          duration: Math.floor(Math.random() * 3000) + 500
        } : test
      ))
    }
    
    setRunning(false)
  }

  const resetTests = () => {
    setTests(prev => prev.map(test => ({ ...test, status: 'pending', message: undefined, duration: undefined })))
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <div className="w-4 h-4 bg-slate-600 rounded-full" />
      case 'running':
        return <Loader2 className="w-4 h-4 text-[#00ade8] animate-spin" />
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />
    }
  }

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return 'text-slate-400'
      case 'running':
        return 'text-[#00ade8]'
      case 'passed':
        return 'text-green-400'
      case 'failed':
        return 'text-red-400'
    }
  }

  const passedTests = tests.filter(t => t.status === 'passed').length
  const failedTests = tests.filter(t => t.status === 'failed').length
  const totalTests = tests.length

  return (
    <div className="dashboard-container">
      {/* Test Controls */}
      <div className="bg-slate-800 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">System Test Suite</h3>
          <div className="flex space-x-3">
            <button
              onClick={runTests}
              disabled={running}
              className="px-4 py-2 bg-gradient-to-r bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {running ? 'Running Tests...' : 'Run All Tests'}
            </button>
            <button
              onClick={resetTests}
              disabled={running}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all duration-200 disabled:opacity-50"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Test Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-white">{totalTests}</p>
            <p className="text-sm text-slate-400">Total Tests</p>
          </div>
          <div className="bg-green-500/20 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-400">{passedTests}</p>
            <p className="text-sm text-slate-400">Passed</p>
          </div>
          <div className="bg-red-500/20 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-red-400">{failedTests}</p>
            <p className="text-sm text-slate-400">Failed</p>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="bg-slate-800 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Test Results</h3>
        <div className="space-y-3">
          {tests.map((test) => (
            <div
              key={test.id}
              className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-700"
            >
              <div className="flex items-center space-x-3">
                {getStatusIcon(test.status)}
                <div>
                  <p className="font-medium text-white">{test.name}</p>
                  {test.message && (
                    <p className={`text-sm ${getStatusColor(test.status)}`}>
                      {test.message}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {test.duration && (
                  <span className="text-sm text-slate-400">
                    {test.duration}ms
                  </span>
                )}
                <span className={`text-sm font-medium ${getStatusColor(test.status)}`}>
                  {test.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-slate-800 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mt-6">
        <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-white">Database</p>
              <p className="text-xs text-green-400">Connected</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-white">API</p>
              <p className="text-xs text-green-400">Healthy</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-white">Storage</p>
              <p className="text-xs text-green-400">Available</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-white">AI Models</p>
              <p className="text-xs text-green-400">Ready</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
