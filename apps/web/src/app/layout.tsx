import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SidebarCollapsible } from '../components/ui/sidebar-collapsible'
import { AuthProvider } from '../contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gabi - AI Document Management',
  description: 'Intelligent document management and AI chat system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex h-screen bg-slate-900">
            <SidebarCollapsible />
            <main className="flex-1 flex flex-col">
              {/* Header */}
              <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-center">
                {/* Header content removed as per user request */}
              </header>
              
              {/* Main Content */}
              <div className="flex-1 overflow-hidden">
                {children}
              </div>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
