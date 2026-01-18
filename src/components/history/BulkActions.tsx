'use client'

import { Button } from '@/components/ui/button'
import { Trash2, Star, FolderOpen, X } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

interface BulkActionsProps {
  selectedIds: string[]
  onClearSelection: () => void
  onComplete: () => void
}

export function BulkActions({ selectedIds, onClearSelection, onComplete }: BulkActionsProps) {
  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('prompts')
        .delete()
        .in('id', selectedIds)

      if (error) throw error
      toast.success(`${selectedIds.length} prompts deleted`)
      onComplete()
      onClearSelection()
    } catch (error) {
      toast.error('Failed to delete prompts')
    }
  }

  const handleFavorite = async () => {
    try {
      const { error } = await supabase
        .from('prompts')
        .update({ is_favorite: true })
        .in('id', selectedIds)

      if (error) throw error
      toast.success(`${selectedIds.length} prompts added to favorites`)
      onComplete()
      onClearSelection()
    } catch (error) {
      toast.error('Failed to update prompts')
    }
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full bg-foreground text-background shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <span className="text-sm font-medium mr-2">
        {selectedIds.length} selected
      </span>
      
      <div className="h-4 w-px bg-background/20" />
      
      <Button variant="ghost" size="sm" onClick={handleFavorite} className="text-background hover:bg-background/10 gap-2 h-8">
        <Star className="w-4 h-4" />
        Favorite
      </Button>
      
        <Button variant="ghost" size="sm" className="text-background hover:bg-background/10 gap-2 h-8" onClick={() => toast.info('Move to collection coming soon')}>
          <FolderOpen className="w-4 h-4" />
          Move
        </Button>
      
      <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-400 hover:bg-red-400/10 gap-2 h-8">
        <Trash2 className="w-4 h-4" />
        Delete
      </Button>
      
      <div className="h-4 w-px bg-background/20" />
      
      <Button variant="ghost" size="icon" onClick={onClearSelection} className="text-background hover:bg-background/10 h-8 w-8">
        <X className="w-4 h-4" />
      </Button>
    </div>
  )
}
