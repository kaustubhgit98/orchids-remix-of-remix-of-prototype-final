'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { LayoutDashboard, History, BarChart3, Star } from 'lucide-react'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(true)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => { setOpen(false); router.push('/dashboard') }}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </CommandItem>
          <CommandItem onSelect={() => { setOpen(false); router.push('/dashboard/history') }}>
            <History className="mr-2 h-4 w-4" />
            History
          </CommandItem>
          <CommandItem onSelect={() => { setOpen(false); router.push('/dashboard/analytics') }}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
