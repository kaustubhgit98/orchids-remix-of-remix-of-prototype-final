'use client'

import { Input } from '@/components/ui/input'
import { Search, Filter, Calendar, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PromptSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function PromptSearch({ searchQuery, onSearchChange }: PromptSearchProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search prompts by title, content, or tags..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-11 h-11 rounded-xl glass-card border-border/50 focus:border-[var(--accent-blue)]/40 focus:shadow-[0_0_0_3px_rgba(0,112,243,0.1)]"
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl glass-card hover:bg-muted/50">
          <Filter className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl glass-card hover:bg-muted/50">
          <Calendar className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl glass-card hover:bg-muted/50">
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
