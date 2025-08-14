'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  FileText, 
  Plus, 
  Settings, 
  ToggleLeft, 
  ToggleRight,
  Versions,
  Database,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Filter,
  Tag,
  Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { knowledgeBaseManager, KnowledgeBase } from '@/lib/knowledge-base-manager'

export default function KnowledgeBasesPage() {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [versionFilter, setVersionFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [availableVersions, setAvailableVersions] = useState<string[]>([])

  useEffect(() => {
    fetchKnowledgeBases()
    fetchVersions()
  }, [])

  const fetchKnowledgeBases = async () => {
    try {
      const kbs = await knowledgeBaseManager.getAllKnowledgeBases()
      setKnowledgeBases(kbs)
    } catch (error) {
      console.error('Error fetching knowledge bases:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchVersions = async () => {
    try {
      const versions = await knowledgeBaseManager.getAvailableVersions()
      setAvailableVersions(versions)
    } catch (error) {
      console.error('Error fetching versions:', error)
    }
  }

  const filteredKnowledgeBases = knowledgeBases.filter(kb => {
    const matchesSearch = kb.name.toLowerCase().includes(search.toLowerCase()) ||
                         kb.description.toLowerCase().includes(search.toLowerCase())
    const matchesVersion = versionFilter === 'all' || kb.version === versionFilter
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && kb.is_active) ||
                         (statusFilter === 'inactive' && !kb.is_active)
    return matchesSearch && matchesVersion && matchesStatus
  })

  const handleToggleChat = async (kbId: string, enabled: boolean) => {
    try {
      await knowledgeBaseManager.toggleKnowledgeBaseChat(kbId, enabled)
      await fetchKnowledgeBases() // Refresh data
    } catch (error) {
      console.error('Error toggling chat:', error)
    }
  }

  const handleToggleActive = async (kbId: string, active: boolean) => {
    try {
      await knowledgeBaseManager.updateKnowledgeBase(kbId, { is_active: active })
      await fetchKnowledgeBases() // Refresh data
    } catch (error) {
      console.error('Error toggling active:', error)
    }
  }

  const getStatusBadge = (kb: KnowledgeBase) => {
    if (!kb.is_active) {
      return <Badge variant="secondary">Inactive</Badge>
    }
    if (kb.is_enabled_for_chat) {
      return <Badge className="bg-green-500/10 text-green-500">Chat Enabled</Badge>
    }
    return <Badge className="bg-yellow-500/10 text-yellow-500">Chat Disabled</Badge>
  }

  const getVersionBadge = (version: string) => {
    return <Badge variant="outline">{version}</Badge>
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Knowledge Bases</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <a href="/knowledge-bases/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Knowledge Base
            </a>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Knowledge Bases</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{knowledgeBases.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all versions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active for Chat</CardTitle>
            <Badge className="bg-green-500/10 text-green-500">Enabled</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {knowledgeBases.filter(kb => kb.is_enabled_for_chat).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Available for queries
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {knowledgeBases.reduce((sum, kb) => sum + kb.document_count, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all knowledge bases
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Versions</CardTitle>
            <Versions className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableVersions.length}</div>
            <p className="text-xs text-muted-foreground">
              Application versions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Search and filter knowledge bases by version and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search knowledge bases..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Version</label>
              <Select value={versionFilter} onValueChange={setVersionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All versions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Versions</SelectItem>
                  {availableVersions.map(version => (
                    <SelectItem key={version} value={version}>{version}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Bases Table */}
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Bases</CardTitle>
          <CardDescription>
            Manage your segmented knowledge bases by application version
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-muted-foreground">Loading knowledge bases...</span>
            </div>
          ) : filteredKnowledgeBases.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <Database className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No knowledge bases found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first knowledge base to get started
              </p>
              <Button asChild>
                <a href="/knowledge-bases/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Knowledge Base
                </a>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Knowledge Base</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Chat Enabled</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKnowledgeBases.map((kb) => (
                  <TableRow key={kb.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Database className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <span className="font-medium">{kb.name}</span>
                          <p className="text-sm text-muted-foreground">{kb.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getVersionBadge(kb.version)}</TableCell>
                    <TableCell>{getStatusBadge(kb)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{kb.document_count}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={kb.is_enabled_for_chat}
                          onCheckedChange={(enabled) => handleToggleChat(kb.id, enabled)}
                          disabled={!kb.is_active}
                        />
                        <Label className="text-sm">
                          {kb.is_enabled_for_chat ? 'Enabled' : 'Disabled'}
                        </Label>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(kb.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            Configure
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
