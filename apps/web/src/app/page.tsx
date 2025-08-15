import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-white">Welcome to Gabi</h2>
      </div>

      {/* Bento Grid Layout - Regras de Espaçamento */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
        {/* Stats Cards - Design Elegante */}
        <div className="bg-gradient-to-r from-[#ffffff08] to-[#121212] backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-400 tracking-wide">Total Documents</p>
              <p className="text-3xl font-bold text-white">1,234</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-[#00ade8] to-[#0099cc] rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#ffffff08] to-[#121212] backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-400 tracking-wide">Active Agents</p>
              <p className="text-3xl font-bold text-white">12</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-[#00ade8] to-[#0099cc] rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#ffffff08] to-[#121212] backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-400 tracking-wide">Chat Sessions</p>
              <p className="text-3xl font-bold text-white">573</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-[#00ade8] to-[#0099cc] rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#ffffff08] to-[#121212] backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-400 tracking-wide">System Uptime</p>
              <p className="text-3xl font-bold text-white">99.9%</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-[#00ade8] to-[#0099cc] rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Action Cards - Design Elegante */}
        <div className="md:col-span-2 bg-gradient-to-r from-[#ffffff08] to-[#121212] backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 group">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#00ade8] to-[#0099cc] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-white">Start Chat</h3>
              <p className="text-gray-400 leading-relaxed">Begin a conversation with Gabi and explore your knowledge base</p>
            </div>
          </div>
          <Link href="/ask" className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#00ade8] to-[#0099cc] text-white rounded-xl hover:from-[#0099cc] hover:to-[#0088bb] transition-all duration-300 shadow-lg hover:shadow-xl">
            Start Chat
            <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="bg-gradient-to-r from-[#ffffff08] to-[#121212] backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 group">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#00ade8] to-[#0099cc] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-white">Upload Documents</h3>
              <p className="text-gray-400 leading-relaxed">Add new documents to your knowledge base</p>
            </div>
          </div>
          <Link href="/upload" className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#00ade8] to-[#0099cc] text-white rounded-xl hover:from-[#0099cc] hover:to-[#0088bb] transition-all duration-300 shadow-lg hover:shadow-xl">
            Upload Documents
            <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="bg-gradient-to-r from-[#ffffff08] to-[#121212] backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 group">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#00ade8] to-[#0099cc] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-white">Browse Documents</h3>
              <p className="text-gray-400 leading-relaxed">View and manage your document library</p>
            </div>
          </div>
          <Link href="/documents" className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#00ade8] to-[#0099cc] text-white rounded-xl hover:from-[#0099cc] hover:to-[#0088bb] transition-all duration-300 shadow-lg hover:shadow-xl">
            Browse Documents
            <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* System Status - Design Elegante */}
        <div className="lg:col-span-4 bg-gradient-to-r from-[#ffffff08] to-[#121212] backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-6">System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <span className="text-sm font-medium text-gray-300">API Health</span>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-green-500 shadow-lg"></div>
                <span className="text-sm font-medium text-white">Healthy</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <span className="text-sm font-medium text-gray-300">Database</span>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-green-500 shadow-lg"></div>
                <span className="text-sm font-medium text-white">Connected</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <span className="text-sm font-medium text-gray-300">AI Models</span>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-green-500 shadow-lg"></div>
                <span className="text-sm font-medium text-white">Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
