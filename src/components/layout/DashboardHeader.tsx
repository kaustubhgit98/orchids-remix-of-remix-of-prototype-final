'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { UserNav } from '@/components/user-nav'
import { ModeToggle } from '@/components/mode-toggle'
import { MobileSidebar } from './MobileSidebar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, ArrowLeft, Sparkles } from 'lucide-react'
import { useUsage } from '@/hooks/use-usage'

export function DashboardHeader() {
  const pathname = usePathname()
  const { isPro, proDemoActive, timeLeftFormatted } = useUsage()
  const isRootDashboard = pathname === '/dashboard'
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="h-14 border-b border-border/50 glass sticky top-0 z-40 px-4 flex items-center justify-between lg:px-6">
      <div className="flex items-center gap-3">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-lg h-8 w-8"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <MobileSidebar onClose={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="lg:hidden flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-background" />
            </div>
            <span className="font-bold text-sm">MetaPrompt</span>
          </Link>
        </div>

        {!isRootDashboard && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="hidden lg:flex rounded-lg gap-2 h-8 px-3 text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Button>
        )}

        {(isPro || proDemoActive) && (
          <Badge className="hidden sm:flex bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] border-[var(--accent-blue)]/20 px-2 py-0.5 text-[10px]">
            {proDemoActive ? `Demo ${timeLeftFormatted}` : 'Pro'}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2">
        <ModeToggle />
        <UserNav />
      </div>
    </header>
  )
}
