'use client'

import { History, SearchX, Plus, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface EmptyHistoryProps {
  hasFilters: boolean
}

export function EmptyHistory({ hasFilters }: EmptyHistoryProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24 px-4 text-center rounded-[2rem] glass-card shadow-elevation-1">
      <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-6 shadow-inner-subtle">
        {hasFilters ? (
          <SearchX className="w-10 h-10 text-muted-foreground" />
        ) : (
          <History className="w-10 h-10 text-muted-foreground" />
        )}
      </div>
      
      <h2 className="text-2xl font-bold mb-2 tracking-tight">
        {hasFilters ? 'No prompts found' : 'Your history is empty'}
      </h2>
      
      <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
        {hasFilters 
          ? "We couldn't find any prompts matching your search criteria. Try a different search term or clear filters."
          : "You haven't enhanced any prompts yet. Start your journey by creating your first prompt on the dashboard."
        }
      </p>

      {!hasFilters && (
        <Button asChild className="gap-2 rounded-xl shadow-elevation-1 btn-ripple">
          <Link href="/dashboard">
            <Sparkles className="w-4 h-4" />
            Create First Prompt
          </Link>
        </Button>
      )}
    </div>
  )
}
