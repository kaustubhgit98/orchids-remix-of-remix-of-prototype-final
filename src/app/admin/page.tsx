'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '@/components/auth-provider'
import { ModeToggle } from '@/components/mode-toggle'
import { UserNav } from '@/components/user-nav'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Users, FileText, Activity, ShieldCheck, Mail, Calendar, Clock, User,
  Menu, X, Sparkles, Home, LayoutDashboard, History, BarChart3, Star, FolderOpen, Settings
} from 'lucide-react'

interface AdminUser {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string | null
  email_confirmed_at: string | null
  phone: string | null
  user_metadata: Record<string, any>
  app_metadata: Record<string, any>
}

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Admin', href: '/admin', icon: ShieldCheck },
  { name: 'History', href: '/dashboard/history', icon: History },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Favorites', href: '/dashboard/favorites', icon: Star },
  { name: 'Collections', href: '/dashboard/collections', icon: FolderOpen },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings }
]

export default function AdminPanel() {
  const { user } = useAuth()
  const pathname = usePathname()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [stats, setStats] = useState({ totalUsers: 0, totalPrompts: 0, avgScore: 0 })
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      
      const [usersResponse, promptsResponse] = await Promise.all([
        fetch('/api/admin/users'),
        supabase.from('prompt_analytics').select('*')
      ])

      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData.users || [])
        setStats(prev => ({ ...prev, totalUsers: usersData.users?.length || 0 }))
      }

      const { data: prompts } = promptsResponse
      const totalPrompts = prompts?.length || 0
      const avgScore = totalPrompts > 0 
        ? Math.round(prompts!.reduce((acc, p) => acc + (p.benchmark_score || 0), 0) / totalPrompts) 
        : 0

      setStats(prev => ({
        ...prev,
        totalPrompts,
        avgScore
      }))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (user: AdminUser) => {
    setSelectedUser(user)
    setDialogOpen(true)
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Never'
    return new Date(dateStr).toLocaleString()
  }

  const getUserStatus = (user: AdminUser) => {
    if (user.email_confirmed_at) return 'active'
    return 'pending'
  }

  return (
    <div className="min-h-screen mesh-gradient noise-bg">
      <header className="h-14 border-b border-border/50 glass sticky top-0 z-40 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <div className="flex flex-col h-full">
                <div className="h-14 px-5 flex items-center border-b border-border/50">
                  <Link href="/dashboard" className="flex items-center gap-2.5" onClick={() => setMobileMenuOpen(false)}>
                    <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center shadow-sm">
                      <Sparkles className="w-4 h-4 text-background" />
                    </div>
                    <span className="font-bold text-base tracking-tight">MetaPrompt</span>
                  </Link>
                </div>
                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm',
                          'hover:bg-muted/50',
                          isActive && 'bg-foreground/5 text-foreground font-medium border border-border/50'
                        )}
                      >
                        <item.icon className={cn('w-4 h-4', isActive ? 'text-[var(--accent-blue)]' : 'text-muted-foreground')} />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-background" />
            </div>
            <span className="font-bold text-sm">MetaPrompt</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserNav />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20 space-y-8">
      <div className="flex items-center gap-3">
        <ShieldCheck className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform-wide overview and user management.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <Users className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardHeader className="pb-2">
            <FileText className="w-4 h-4 text-blue-500" />
            <CardTitle className="text-sm font-medium">Total Prompts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPrompts}</div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/5 border-green-500/20">
          <CardHeader className="pb-2">
            <Activity className="w-4 h-4 text-green-500" />
            <CardTitle className="text-sm font-medium">Avg Platform Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgScore}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((u, index) => (
                <TableRow key={u.id || index}>
                  <TableCell className="font-medium">{u.email}</TableCell>
                  <TableCell>{new Date(u.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={getUserStatus(u) === 'active' 
                        ? "bg-green-500/10 text-green-600 border-green-500/20"
                        : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                      }
                    >
                      {getUserStatus(u)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(u)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              User Details
            </DialogTitle>
            <DialogDescription>
              Detailed information about this user account.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Mail className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Account Created</p>
                  <p className="font-medium">{formatDate(selectedUser.created_at)}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Clock className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Last Sign In</p>
                  <p className="font-medium">{formatDate(selectedUser.last_sign_in_at)}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <ShieldCheck className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email Verified</p>
                  <p className="font-medium">
                    {selectedUser.email_confirmed_at ? formatDate(selectedUser.email_confirmed_at) : 'Not verified'}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-2">User ID</p>
                <code className="text-xs bg-background px-2 py-1 rounded border break-all">
                  {selectedUser.id}
                </code>
              </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
