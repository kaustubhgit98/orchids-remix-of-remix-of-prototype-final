'use client'

import { useState } from 'react'
import { PromptList } from '@/components/history/PromptList'
import { PromptSearch } from '@/components/history/PromptSearch'
import { BulkActions } from '@/components/history/BulkActions'
import { useAuth } from '@/components/auth-provider'
import { usePrompts } from '@/hooks/use-prompts'
import { Badge } from '@/components/ui/badge'
import { Star, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function FavoritesPage() {
  const { user } = useAuth()
  const { prompts, loading, refetch } = usePrompts(user?.id)
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const favoritePrompts = prompts.filter(p => p.is_favorite)
  
  const filteredPrompts = favoritePrompts.filter(p =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10 page-transition">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center shadow-elevation-1">
            <Star className="w-6 h-6 text-yellow-500 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Favorite Prompts</h1>
            <p className="text-muted-foreground text-sm">
              Your curated collection of high-performance prompts
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-4">
          <Badge variant="secondary" className="rounded-lg">
            <Heart className="w-3 h-3 mr-1 fill-current" />
            {favoritePrompts.length} favorites
          </Badge>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <PromptSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </motion.div>

      {selectedPrompts.length > 0 && (
        <BulkActions
          selectedIds={selectedPrompts}
          onClearSelection={() => setSelectedPrompts([])}
          onComplete={refetch}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 rounded-2xl glass-card animate-pulse" />
            ))}
          </div>
        ) : filteredPrompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 md:py-24 px-4 text-center rounded-[2rem] glass-card shadow-elevation-1">
            <div className="w-20 h-20 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-6 shadow-inner-subtle">
              <Star className="w-10 h-10 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2 tracking-tight">No favorites yet</h2>
            <p className="text-muted-foreground max-w-xs mb-8">
              Star your best prompts in history or dashboard to see them here.
            </p>
            <Button asChild className="rounded-xl gap-2 shadow-elevation-1">
              <Link href="/dashboard/history">
                Browse History
              </Link>
            </Button>
          </div>
        ) : (
          <PromptList
            prompts={filteredPrompts}
            selectedIds={selectedPrompts}
            onSelectionChange={setSelectedPrompts}
          />
        )}
      </motion.div>
    </div>
  )
}
