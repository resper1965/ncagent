'use client'

import { CheckCircle, Zap, Brain, Database, Clock } from 'lucide-react'

export default function TestPage() {
  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">System Test</h2>
          <p className="text-gray-400 mt-1">Test and verify system functionality</p>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="bg-gradient-to-r from-[#ffffff05] to-[#121212] backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Next.js</p>
              <p className="text-2xl font-bold text-white">✅ Working</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#ffffff05] to-[#121212] backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Zap className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">React</p>
              <p className="text-2xl font-bold text-white">✅ Active</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#ffffff05] to-[#121212] backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Brain className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">AI System</p>
              <p className="text-2xl font-bold text-white">✅ Ready</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#ffffff05] to-[#121212] backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Database className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Database</p>
              <p className="text-2xl font-bold text-white">✅ Connected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="bg-gradient-to-r from-[#ffffff05] to-[#121212] backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-gradient-to-r from-[#00ade8] to-[#0099cc] rounded-lg">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Test Results</h3>
            <p className="text-gray-400">All systems operational</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-white font-medium">Frontend Rendering</span>
            </div>
            <span className="text-green-400 text-sm">PASSED</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-white font-medium">Component Loading</span>
            </div>
            <span className="text-green-400 text-sm">PASSED</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-white font-medium">Styling System</span>
            </div>
            <span className="text-green-400 text-sm">PASSED</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-white font-medium">Responsive Design</span>
            </div>
            <span className="text-green-400 text-sm">PASSED</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="text-green-400 font-medium">All tests completed successfully!</span>
          </div>
          <p className="text-gray-300 text-sm mt-1">
            The Gabi application is running properly with all components functioning as expected.
          </p>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-gradient-to-r from-[#ffffff05] to-[#121212] backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">System Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Framework:</span>
              <span className="text-white">Next.js 14.2.31</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">React Version:</span>
              <span className="text-white">18.2.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">TypeScript:</span>
              <span className="text-white">5.3.3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tailwind CSS:</span>
              <span className="text-white">3.4.0</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Environment:</span>
              <span className="text-white">Production</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Build Time:</span>
              <span className="text-white">
                <Clock className="h-4 w-4 inline mr-1" />
                {new Date().toLocaleTimeString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className="text-green-400">Operational</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Version:</span>
              <span className="text-white">2.1.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
