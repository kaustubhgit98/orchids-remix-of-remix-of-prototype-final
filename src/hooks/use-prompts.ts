import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export interface Prompt {
  id: string
  user_id: string
  title: string | null
  description: string | null
  category: string | null
  is_template: boolean
  is_favorite: boolean
  tags: string[]
  created_at: string
  updated_at: string
}

export function usePrompts(userId: string | undefined) {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchPrompts = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('prompts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setPrompts(data || [])
    } catch (err) {
      const error = err as Error
      setError(error)
      toast.error(`Failed to load prompts: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchPrompts()
  }, [fetchPrompts])

  const deletePrompt = useCallback(async (promptId: string) => {
    try {
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', promptId)

      if (error) throw error

      setPrompts(prev => prev.filter(p => p.id !== promptId))
      toast.success('Prompt deleted successfully')
      
      return null
    } catch (err) {
      const error = err as Error
      toast.error(`Failed to delete: ${error.message}`)
      return error
    }
  }, [])

  const toggleFavorite = useCallback(async (promptId: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from('prompts')
        .update({ is_favorite: !currentState })
        .eq('id', promptId)

      if (error) throw error

      setPrompts(prev => prev.map(p =>
        p.id === promptId ? { ...p, is_favorite: !currentState } : p
      ))

      toast.success(
        !currentState ? 'Added to favorites' : 'Removed from favorites'
      )

      return null
    } catch (err) {
      const error = err as Error
      toast.error(`Failed to update: ${error.message}`)
      return error
    }
  }, [])

  const updatePrompt = useCallback(async (
    promptId: string,
    updates: Partial<Prompt>
  ) => {
    try {
      const { error } = await supabase
        .from('prompts')
        .update(updates)
        .eq('id', promptId)

      if (error) throw error

      setPrompts(prev => prev.map(p =>
        p.id === promptId ? { ...p, ...updates } : p
      ))

      toast.success('Prompt updated successfully')

      return null
    } catch (err) {
      const error = err as Error
      toast.error(`Failed to update: ${error.message}`)
      return error
    }
  }, [])

  return {
    prompts,
    loading,
    error,
    refetch: fetchPrompts,
    deletePrompt,
    toggleFavorite,
    updatePrompt
  }
}
