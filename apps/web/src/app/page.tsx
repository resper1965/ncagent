import Link from 'next/link'
import { Button } from '../components/ui/button-simple'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card-simple'

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">Welcome to Gabi</h2>
        <div className="flex items-center space-x-2">
          <Link href="/ask">
            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-medium rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Start Chat
            </button>
          </Link>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-r from-[#ffffff05] to-[#121212] backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Documents</CardTitle>
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1,234</div>
            <p className="text-xs text-gray-400">+20.1% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-[#ffffff05] to-[#121212] backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Active Agents</CardTitle>
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12</div>
            <p className="text-xs text-gray-400">+2 new this week</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-[#ffffff05] to-[#121212] backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Chat Sessions</CardTitle>
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">573</div>
            <p className="text-xs text-gray-400">+201 since last hour</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-[#ffffff05] to-[#121212] backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">System Uptime</CardTitle>
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">99.9%</div>
            <p className="text-xs text-gray-400">+0.1% from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-[#ffffff05] to-[#121212] backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription className="text-gray-400">Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/ask">
              <button className="w-full flex items-center justify-start px-4 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-medium rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all duration-200">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Start New Chat
              </button>
            </Link>
            
            <Link href="/upload">
              <button className="w-full flex items-center justify-start px-4 py-3 border border-white/10 bg-white/5 text-white font-medium rounded-xl hover:bg-white/10 transition-all duration-200">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Documents
              </button>
            </Link>
            
            <Link href="/documents">
              <button className="w-full flex items-center justify-start px-4 py-3 border border-white/10 bg-white/5 text-white font-medium rounded-xl hover:bg-white/10 transition-all duration-200">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Browse Documents
              </button>
            </Link>
            
            <Link href="/knowledge-bases">
              <button className="w-full flex items-center justify-start px-4 py-3 border border-white/10 bg-white/5 text-white font-medium rounded-xl hover:bg-white/10 transition-all duration-200">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
                Knowledge Bases
              </button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card className="bg-gradient-to-r from-[#ffffff05] to-[#121212] backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white">System Status</CardTitle>
          <CardDescription className="text-gray-400">Current system health and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">API Health</span>
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-white">Healthy</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Database</span>
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-white">Connected</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">AI Models</span>
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-white">Available</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
