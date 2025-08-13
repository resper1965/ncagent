"use client"

import { 
  Bell, 
  Search, 
  User, 
  Settings,
  ChevronRight,
  Home,
  type LucideIcon
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Header() {
  const pathname = usePathname()
  
  // Gerar breadcrumbs baseado na rota
  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: Array<{ name: string; href: string; icon?: LucideIcon }> = [
      { name: 'Dashboard', href: '/', icon: Home }
    ]
    
    segments.forEach((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/')
      const name = segment.charAt(0).toUpperCase() + segment.slice(1)
      breadcrumbs.push({ name, href })
    })
    
    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
        {breadcrumbs.map((breadcrumb, index) => (
          <div key={breadcrumb.href} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
            <Link
              href={breadcrumb.href}
              className="flex items-center hover:text-foreground transition-colors"
            >
              {breadcrumb.icon && <breadcrumb.icon className="h-4 w-4 mr-1" />}
              {breadcrumb.name}
            </Link>
          </div>
        ))}
      </nav>

      <div className="ml-auto flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar..."
            className="h-9 w-64 rounded-md border border-input bg-background px-8 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-md">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
        </button>

        {/* User Menu */}
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-md">
            <User className="h-4 w-4" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-md">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
