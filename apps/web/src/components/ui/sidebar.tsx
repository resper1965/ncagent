"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Brain, 
  MessageSquare, 
  FileText, 
  Upload, 
  Users, 
  Settings,
  BarChart3,
  Layers,
  Zap,
  Shield,
  Home,
  Database
} from 'lucide-react'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  const navigation = [
    {
      title: "Overview",
      href: "/",
      icon: Home,
      variant: "default" as const,
    },
    {
      title: "Chat",
      href: "/ask",
      icon: MessageSquare,
      variant: "default" as const,
    },
    {
      title: "Documents",
      href: "/documents",
      icon: FileText,
      variant: "default" as const,
    },
    {
      title: "Knowledge Bases",
      href: "/knowledge-bases",
      icon: Database,
      variant: "default" as const,
    },
    {
      title: "Agents",
      href: "/agents",
      icon: Users,
      variant: "default" as const,
    },
    {
      title: "Upload",
      href: "/upload",
      icon: Upload,
      variant: "default" as const,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      variant: "default" as const,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      variant: "default" as const,
    },
  ]

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center space-x-2 px-4 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
            <h2 className="text-lg font-semibold tracking-tight text-white">
              n.Agent
            </h2>
          </div>
          <div className="px-4 py-2">
            <p className="text-sm text-muted-foreground">
              AI-Powered Document Intelligence
            </p>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-white">
            Navigation
          </h2>
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-white">
            Features
          </h2>
          <div className="space-y-1">
            <div className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4" />
              <span>High Performance</span>
            </div>
            <div className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm text-muted-foreground">
              <Layers className="h-4 w-4" />
              <span>Multi-Agent System</span>
            </div>
            <div className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm text-muted-foreground">
              <Database className="h-4 w-4" />
              <span>Versioned Knowledge Bases</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
