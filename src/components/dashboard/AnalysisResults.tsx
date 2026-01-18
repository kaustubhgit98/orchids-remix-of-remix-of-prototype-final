'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, Check, TrendingUp, FileText, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface AnalysisResultsProps {
  originalPrompt: string
  enhancedPrompt: string
  score: number
  category: string
  tags: string[]
}

export function AnalysisResults({
  originalPrompt,
  enhancedPrompt,
  score,
  category,
  tags
}: AnalysisResultsProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(enhancedPrompt)
      setCopied(true)
      toast.success('Copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy')
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500'
    if (score >= 75) return 'text-[var(--accent-blue)]'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent'
    if (score >= 75) return 'Good'
    if (score >= 60) return 'Fair'
    return 'Needs Work'
  }

  const improvement = Math.round((enhancedPrompt.length / (originalPrompt.length || 1) - 1) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl glass-card shadow-elevation-1">
        <div className="flex items-center gap-4">
          <div className={`text-4xl font-extrabold ${getScoreColor(score)}`}>
            {score}
          </div>
          <div>
            <div className="font-bold text-sm">Benchmark Score</div>
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              {getScoreLabel(score)}
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 capitalize">
                {category}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-start sm:items-end gap-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            {tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <span className="text-green-500 font-medium">+{improvement}%</span>
            <span>expansion</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="rounded-xl glass-card shadow-elevation-1">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" />
              Original Prompt
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="p-3 rounded-lg bg-muted/50 border border-border/50 max-h-[150px] overflow-y-auto">
              <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {originalPrompt}
              </p>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
              <span>{originalPrompt.length} chars</span>
              <span>·</span>
              <span>{originalPrompt.trim().split(/\s+/).filter(Boolean).length} words</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl glass-card border-[var(--accent-blue)]/30 bg-[var(--accent-blue)]/5 shadow-elevation-1">
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent-blue)]" />
                Enhanced Prompt
              </CardTitle>
              <Button
                size="icon"
                variant="ghost"
                onClick={copyToClipboard}
                className="h-7 w-7 rounded-lg"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="p-3 rounded-lg bg-background/50 border border-[var(--accent-blue)]/20 max-h-[150px] overflow-y-auto">
              <p className="text-xs whitespace-pre-wrap font-medium leading-relaxed">
                {enhancedPrompt}
              </p>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
              <span>{enhancedPrompt.length} chars</span>
              <span>·</span>
              <span>{enhancedPrompt.trim().split(/\s+/).filter(Boolean).length} words</span>
              <span>·</span>
              <span className="text-[var(--accent-blue)] font-semibold">+{improvement}%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
