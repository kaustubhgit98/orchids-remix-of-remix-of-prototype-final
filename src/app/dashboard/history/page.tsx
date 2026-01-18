'use client'

import { useState } from 'react'
import { PromptList } from '@/components/history/PromptList'
import { PromptSearch } from '@/components/history/PromptSearch'
import { BulkActions } from '@/components/history/BulkActions'
import { EmptyHistory } from '@/components/history/EmptyHistory'
import { useAuth } from '@/components/auth-provider'
import { usePrompts } from '@/hooks/use-prompts'
import { Badge } from '@/components/ui/badge'
import { History, FileText } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HistoryPage() {
  const { user } = useAuth()
  const { prompts, loading, refetch } = usePrompts(user?.id)
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPrompts = prompts.filter(p =>
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
          <div className="w-12 h-12 rounded-2xl bg-[var(--accent-blue)]/10 flex items-center justify-center shadow-elevation-1">
            <History className="w-6 h-6 text-[var(--accent-blue)]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Prompt History</h1>
            <p className="text-muted-foreground text-sm">
              View, organize, and manage your optimized prompts
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-4">
          <Badge variant="secondary" className="rounded-lg">
            <FileText className="w-3 h-3 mr-1" />
            {prompts.length} prompts
          </Badge>
          {selectedPrompts.length > 0 && (
            <Badge className="bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] border-[var(--accent-blue)]/20 rounded-lg">
              {selectedPrompts.length} selected
            </Badge>
          )}
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
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-24 rounded-2xl glass-card animate-pulse" />
            ))}
          </div>
        ) : filteredPrompts.length === 0 ? (
          <EmptyHistory hasFilters={!!searchQuery} />
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
