import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/ui/sidebar'
import { Header } from '@/components/ui/header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'n.Agent - AI-Powered Document Intelligence',
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
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <div className="hidden lg:flex lg:w-64 lg:flex-col">
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
              <Sidebar />
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex flex-1 flex-col">
            <Header />
            <main className="flex-1 bg-gray-950">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
