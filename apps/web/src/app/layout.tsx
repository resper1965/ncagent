import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

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
        <div className="flex min-h-screen bg-gray-950">
          {/* Sidebar */}
          <div className="hidden lg:flex lg:w-64 lg:flex-col">
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
              <div className="flex h-16 shrink-0 items-center">
                <h1 className="text-xl font-bold text-white">n.Agent</h1>
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      <li>
                        <a href="/" className="text-gray-400 hover:text-white hover:bg-gray-800 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold">
                          Dashboard
                        </a>
                      </li>
                      <li>
                        <a href="/ask" className="text-gray-400 hover:text-white hover:bg-gray-800 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold">
                          Chat
                        </a>
                      </li>
                      <li>
                        <a href="/documents" className="text-gray-400 hover:text-white hover:bg-gray-800 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold">
                          Documents
                        </a>
                      </li>
                      <li>
                        <a href="/knowledge-bases" className="text-gray-400 hover:text-white hover:bg-gray-800 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold">
                          Knowledge Bases
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex flex-1 flex-col">
            <header className="bg-gray-900 border-b border-gray-800">
              <div className="flex h-16 items-center gap-x-4 border-b border-gray-800 bg-gray-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                  <div className="flex flex-1"></div>
                  <div className="flex items-center gap-x-4 lg:gap-x-6">
                    <span className="text-sm text-gray-400">n.Agent Platform</span>
                  </div>
                </div>
              </div>
            </header>
            <main className="flex-1 bg-gray-950">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
