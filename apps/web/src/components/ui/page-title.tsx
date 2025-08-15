'use client'

import { usePathname } from 'next/navigation'

export function PageTitle() {
  const pathname = usePathname()

  const getPageTitle = () => {
    switch (pathname) {
      case '/':
        return 'Dashboard'
      case '/ask':
        return 'Chat'
      case '/documents':
        return 'Documents'
      case '/upload':
        return 'Upload Documents'
      case '/knowledge-bases':
        return 'Knowledge Bases'
      case '/agents':
        return 'AI Agents'
      case '/versions':
        return 'Versions'
      case '/test':
        return 'System Test'
      case '/login':
        return 'Sign In'
      default:
        return 'Dashboard'
    }
  }

  return (
    <div className="flex items-center">
      <h1 className="text-xl font-semibold text-white">{getPageTitle()}</h1>
    </div>
  )
}
