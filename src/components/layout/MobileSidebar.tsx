'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUsage } from '@/hooks/use-usage'
import {
  LayoutDashboard,
  History,
  BarChart3,
  Star,
  FolderOpen,
  Settings,
  Sparkles,
  Crown,
  Home
} from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'History', href: '/dashboard/history', icon: History },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Favorites', href: '/dashboard/favorites', icon: Star },
  { name: 'Collections', href: '/dashboard/collections', icon: FolderOpen },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings }
]

interface MobileSidebarProps {
  onClose: () => void
}

export function MobileSidebar({ onClose }: MobileSidebarProps) {
  const pathname = usePathname()
  const { isPro, proDemoActive, timeLeftFormatted, remaining, limit } = useUsage()

  return (
    <div className="flex flex-col h-full">
      <div className="h-14 px-5 flex items-center border-b border-border/50">
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
          <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-background" />
          </div>
          <span className="font-bold text-base tracking-tight">MetaPrompt</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = item.href === '/' 
            ? pathname === '/'
            : pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
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

      <div className="p-3 border-t border-border/50">
        {(isPro || proDemoActive) ? (
          <div className="p-2.5 rounded-lg bg-gradient-to-br from-[var(--accent-blue)]/10 to-purple-500/10 border border-[var(--accent-blue)]/20">
            <div className="flex items-center gap-2 mb-0.5">
              <Crown className="w-3.5 h-3.5 text-[var(--accent-blue)]" />
              <span className="text-xs font-semibold">
                {proDemoActive ? 'Pro Demo' : 'Pro Plan'}
              </span>
            </div>
            {proDemoActive && timeLeftFormatted && (
              <p className="text-[10px] text-muted-foreground">{timeLeftFormatted} remaining</p>
            )}
          </div>
        ) : (
          <div className="p-2.5 rounded-lg bg-muted/50 border border-border/50">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-medium text-muted-foreground">Daily Usage</span>
              <span className="text-[10px] font-bold">{limit - remaining}/{limit}</span>
            </div>
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-[var(--accent-blue)] transition-all duration-500"
                style={{ width: `${((limit - remaining) / limit) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
