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
        <div className="flex min-h-screen bg-slate-900">
          {/* Sidebar */}
          <SidebarCollapsible />
          
          {/* Main content */}
          <div className="flex flex-1 flex-col">
            <header className="bg-slate-800 border-b border-slate-700">
              <div className="flex h-16 items-center px-4 shadow-sm sm:px-6 lg:px-8">
              </div>
            </header>
            <main className="flex-1 bg-slate-900">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
