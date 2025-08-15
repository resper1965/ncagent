import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SidebarCollapsible } from '../components/ui/sidebar-collapsible'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gabi - AI-Powered Document Intelligence',
  description: 'Transform your documents into accessible knowledge with advanced AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="flex min-h-screen bg-[#121212]">
          {/* Sidebar */}
          <SidebarCollapsible />
          
          {/* Main content */}
          <div className="flex flex-1 flex-col">
            <header className="bg-gradient-to-r from-[#ffffff05] to-[#121212] backdrop-blur-sm border-b border-white/10">
              <div className="flex h-16 items-center gap-x-4 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                  {/* Company Logo - Always in same place */}
                  <div className="flex items-center">
                    <div className="flex items-center space-x-3">
                      <img 
                        src="/ionic-health-logo.svg" 
                        alt="Ionic Health Logo" 
                        className="h-8 w-auto"
                      />
                      <span className="text-lg font-semibold text-white">Gabi</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-1"></div>
                  <div className="flex items-center gap-x-4 lg:gap-x-6">
                    {/* Search */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Search..."
                        className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-lg leading-5 bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      />
                    </div>
                    
                    {/* Notifications */}
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4H20a2 2 0 012 2v10a2 2 0 01-2 2H4.19A2 2 0 012 16V6a2 2 0 012-2z" />
                      </svg>
                    </button>
                    
                    {/* Avatar da Gabi */}
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">G</span>
                      </div>
                      <div className="hidden md:block">
                        <p className="text-sm font-medium text-white">Gabi</p>
                        <p className="text-xs text-gray-400">AI Assistant</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </header>
            <main className="flex-1 bg-[#121212]">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
