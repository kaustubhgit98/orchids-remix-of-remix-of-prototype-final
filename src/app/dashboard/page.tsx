'use client'

import { useState, useEffect } from 'react'
import { PromptInputSection } from '@/components/dashboard/PromptInputSection'
import { AnalysisResults } from '@/components/dashboard/AnalysisResults'
import { QuickGraphs } from '@/components/dashboard/QuickGraphs'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { useAuth } from '@/components/auth-provider'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { LoadingFacts } from '@/components/loading-facts'

interface AnalysisData {
  enhanced_prompt: string
  benchmark_score: number
  intent_category: string
  tags: string[]
  analysis_result: {
    score: number
    clarity: number
    specificity: number
    context: number
    structure: number
  }
}

export default function DashboardPage() {
  const { user, authReady } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)
  const [originalPrompt, setOriginalPrompt] = useState('')
  const [promptId, setPromptId] = useState<string | null>(null)
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking')

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('prompts').select('id').limit(1)
        if (error && error.code !== 'PGRST116') {
          setDbStatus('error')
        } else {
          setDbStatus('connected')
        }
      } catch {
        setDbStatus('error')
      }
    }
    
    if (authReady) {
      checkConnection()
    }
  }, [authReady])

  const handleAnalyze = async (
    prompt: string,
    mode: string,
    model: string,
    ultraMode: boolean
  ) => {
    if (!user) {
      toast.error('Please sign in to analyze prompts')
      router.push('/login')
      return
    }

    setLoading(true)
    setOriginalPrompt(prompt)
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, mode, model, ultraMode })
      })

      if (!response.ok) throw new Error('Failed to analyze')

      const data: AnalysisData = await response.json()
      setAnalysis(data)

      const { data: promptData, error: promptError } = await supabase
        .from('prompts')
        .insert({
          user_id: user.id,
          title: prompt.slice(0, 50) + (prompt.length > 50 ? '...' : ''),
          description: prompt,
          category: data.intent_category,
          tags: data.tags,
        })
        .select()
        .single()

      if (promptError) throw promptError
      setPromptId(promptData.id)

      await supabase.from('prompt_versions').insert({
        prompt_id: promptData.id,
        version: 1,
        content: prompt,
        enhanced_content: data.enhanced_prompt,
        analysis_result: data.analysis_result,
        benchmark_score: data.benchmark_score,
        model_used: model,
        mode,
      })

      await supabase.from('prompt_analytics').insert({
        user_id: user.id,
        prompt_id: promptData.id,
        benchmark_score: data.benchmark_score,
        mode,
        model_used: model,
        tags: data.tags
      })

      toast.success('Prompt analyzed and saved!')
    } catch (error) {
      console.error(error)
      toast.error('Failed to analyze prompt')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6 pb-16">
      <div className="flex justify-end">
<Badge 
              variant="outline" 
              className={`text-[10px] px-2.5 py-1 rounded-lg font-medium ${
                dbStatus === 'connected' 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                  : dbStatus === 'error'
                  ? 'bg-red-500/10 text-red-500 border-red-500/20'
                  : 'bg-muted'
              }`}
            >
              {dbStatus === 'checking' && <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />}
              {dbStatus === 'connected' && <CheckCircle2 className="w-3 h-3 mr-1.5" />}
              {dbStatus === 'error' && <XCircle className="w-3 h-3 mr-1.5" />}
              {dbStatus === 'checking' ? 'Initializing AI' : dbStatus === 'connected' ? 'AI Active' : 'AI Offline'}
            </Badge>
        </div>

      {loading ? (
        <LoadingFacts />
      ) : (
        <PromptInputSection onAnalyze={handleAnalyze} loading={loading} />
      )}

      {analysis && !loading && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AnalysisResults
            originalPrompt={originalPrompt}
            enhancedPrompt={analysis.enhanced_prompt}
            score={analysis.benchmark_score}
            category={analysis.intent_category}
            tags={analysis.tags}
          />

          <QuickGraphs analysis={analysis.analysis_result} />

          <QuickActions
            promptId={promptId}
            enhancedPrompt={analysis.enhanced_prompt}
            onViewDetails={() => promptId && router.push(`/dashboard/prompts/${promptId}`)}
          />
        </div>
      )}
    </div>
  )
}
