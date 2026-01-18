'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Settings, Shield, Crown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/auth-provider'
import { useUsage } from '@/hooks/use-usage'

const AVATAR_COLORS = [
  { bg: '#000000', text: '#FFFFFF' },
  { bg: '#FFFFFF', text: '#000000' },
  { bg: '#09090b', text: '#fafafa' },
  { bg: '#fafafa', text: '#09090b' },
]

function getColorFromEmail(email: string) {
  let hash = 0
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

interface ProfessionalAvatarProps {
  initial: string
  avatarUrl?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
  colorEmail: string
}

function ProfessionalAvatar({ initial, avatarUrl, size = 'sm', className = '', colorEmail }: ProfessionalAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-9 w-9 text-base',
    lg: 'h-10 w-10 text-lg'
  }

  if (avatarUrl) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0 ring-1 ring-white/20 border border-white/10 ${className}`}>
        <img 
          src={avatarUrl} 
          alt="Profile" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    )
  }

  return (
    <div 
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center flex-shrink-0 font-semibold select-none border-2 border-white/20 bg-black text-white shadow-sm ${className}`}
      style={{ 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        fontWeight: 600,
        letterSpacing: '-0.01em'
      }}
    >
      {initial}
    </div>
  )
}

export function UserNav() {
  const router = useRouter()
  const { user } = useAuth()
  const { isPro, proDemoActive } = useUsage()
  const [isAdmin, setIsAdmin] = useState(false)
  const [displayName, setDisplayName] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    
    const checkAdminStatus = async () => {
      if (!user?.email) return
      
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('id')
          .eq('email', user.email)
          .single()
        
        if (isMounted) {
          setIsAdmin(!!data && !error)
        }
      } catch (err) {
        // Silently fail for admin check
      }
    }

    const loadProfile = async () => {
      if (!user?.id) return
      
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('display_name')
          .eq('user_id', user.id)
          .single()
        
        if (isMounted && data?.display_name) {
          setDisplayName(data.display_name)
        }
      } catch (err) {
        // Profile doesn't exist yet
      }
    }

    if (user) {
      checkAdminStatus()
      loadProfile()
    }

    return () => { isMounted = false }
  }, [user])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  if (!user) return null

  const avatarUrl = user.user_metadata?.avatar_url || null
  const initial = displayName 
    ? displayName.charAt(0).toUpperCase() 
    : user.email?.charAt(0).toUpperCase() || 'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none focus:outline-none">
        <div className="cursor-pointer transition-transform hover:scale-105 active:scale-95">
          <ProfessionalAvatar 
            initial={initial}
            colorEmail={user.email || ''} 
            avatarUrl={avatarUrl}
            size="sm"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5 shadow-lg border border-border/50">
        <div className="flex items-center gap-3 px-2 py-2.5">
          <ProfessionalAvatar 
            initial={initial}
            colorEmail={user.email || ''} 
            avatarUrl={avatarUrl}
            size="md"
          />
          <div className="flex flex-col min-w-0 flex-1">
            {displayName && (
              <span className="text-sm font-semibold truncate text-foreground">
                {displayName}
              </span>
            )}
            <span className={`${displayName ? 'text-xs text-muted-foreground' : 'text-sm font-medium text-foreground'} truncate`}>
              {user.email}
            </span>
            <Badge
              variant={isPro || proDemoActive ? 'default' : 'secondary'}
              className="w-fit mt-1 text-[10px] px-1.5 py-0 h-4"
            >
              {isPro ? (
                <>
                  <Crown className="h-2.5 w-2.5 mr-0.5" />
                  PRO
                </>
              ) : proDemoActive ? (
                'DEMO'
              ) : (
                'FREE'
              )}
            </Badge>
          </div>
        </div>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem
          onClick={() => router.push('/dashboard/settings')}
          className="cursor-pointer rounded-lg text-sm py-2"
        >
          <Settings className="mr-2.5 h-4 w-4 text-muted-foreground" />
          Settings
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => router.push('/admin')}
            className="cursor-pointer rounded-lg text-sm py-2 text-orange-600 focus:text-orange-600"
          >
            <Shield className="mr-2.5 h-4 w-4" />
            Admin Panel
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer rounded-lg text-sm py-2 text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2.5 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
