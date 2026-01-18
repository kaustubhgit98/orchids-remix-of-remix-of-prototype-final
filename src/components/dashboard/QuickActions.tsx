'use client'

import { Button } from '@/components/ui/button'
import { Copy, Eye, Share2, FileDown, Star, Check } from 'lucide-react'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

interface QuickActionsProps {
  promptId: string | null
  enhancedPrompt: string
  onViewDetails: () => void
}

export function QuickActions({ promptId, enhancedPrompt, onViewDetails }: QuickActionsProps) {
  const [copied, setCopied] = useState(false)
  const [favorited, setFavorited] = useState(false)

  useEffect(() => {
    const checkFavorite = async () => {
      if (!promptId) return
      const { data } = await supabase
        .from('prompts')
        .select('is_favorite')
        .eq('id', promptId)
        .single()
      if (data) setFavorited(data.is_favorite)
    }
    checkFavorite()
  }, [promptId])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(enhancedPrompt)
      setCopied(true)
      toast.success('Enhanced prompt copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy')
    }
  }

  const handleExport = () => {
    const blob = new Blob([enhancedPrompt], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `enhanced-prompt-${new Date().getTime()}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Prompt exported as .txt')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Enhanced Prompt',
        text: enhancedPrompt,
      }).catch(() => {})
    } else {
      handleCopy()
    }
  }

  const handleFavorite = async () => {
    if (!promptId) {
      toast.error('Cannot favorite unsaved prompt')
      return
    }
    try {
      const newValue = !favorited
      const { error } = await supabase
        .from('prompts')
        .update({ is_favorite: newValue })
        .eq('id', promptId)
      
      if (error) throw error
      setFavorited(newValue)
      toast.success(newValue ? 'Added to favorites' : 'Removed from favorites')
    } catch (error) {
      toast.error('Failed to update favorite')
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-wrap items-center gap-3 p-4 rounded-2xl glass-card shadow-elevation-1"
    >
      <Button 
        onClick={handleCopy} 
        className="gap-2 rounded-xl btn-ripple shadow-elevation-1 hover:shadow-elevation-2 transition-all"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copied ? 'Copied!' : 'Copy Prompt'}
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onViewDetails} 
        className="gap-2 rounded-xl glass-card hover:bg-muted/50"
        disabled={!promptId}
      >
        <Eye className="w-4 h-4" />
        View Details
      </Button>
      
      <Button 
        variant="outline" 
        onClick={handleExport} 
        className="gap-2 rounded-xl glass-card hover:bg-muted/50"
      >
        <FileDown className="w-4 h-4" />
        Export
      </Button>
      
      <Button 
        variant="outline" 
        onClick={handleShare}
        className="gap-2 rounded-xl glass-card hover:bg-muted/50"
      >
        <Share2 className="w-4 h-4" />
        Share
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        className="ml-auto rounded-xl glass-card hover:bg-muted/50"
        onClick={handleFavorite}
      >
        <Star className={`w-4 h-4 transition-colors ${favorited ? 'fill-yellow-500 text-yellow-500' : ''}`} />
      </Button>
    </motion.div>
  )
}
