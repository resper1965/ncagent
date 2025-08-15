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
              <div className="flex h-16 items-center px-4 shadow-sm sm:px-6 lg:px-8">
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
