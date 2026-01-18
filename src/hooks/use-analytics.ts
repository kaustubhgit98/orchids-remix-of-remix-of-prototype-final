import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'

interface AnalyticsData {
  totalPrompts: number
  avgScore: number
  scoreOverTime: Array<{ date: string; score: number }>
  modelUsage: Array<{ name: string; value: number }>
  modeUsage: Array<{ name: string; value: number }>
  tagFrequency: Array<{ name: string; value: number }>
  dailyUsage: Array<{ date: string; count: number }>
  activityData: Record<string, number>
  improvements: Array<{ iteration: number; score: number; date: string }>
  insights: string[]
}

export function useAnalytics(userId: string | undefined) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchAnalytics = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('prompt_analytics')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })

      if (error) throw error

      if (!data || data.length === 0) {
        setAnalytics({
          totalPrompts: 0,
          avgScore: 0,
          scoreOverTime: [],
          modelUsage: [],
          modeUsage: [],
          tagFrequency: [],
          dailyUsage: [],
          activityData: {},
          improvements: [],
          insights: ['Start creating prompts to see analytics!']
        })
        setLoading(false)
        return
      }

      setAnalytics({
        totalPrompts: data.length,
        avgScore: calculateAvgScore(data),
        scoreOverTime: processScoreOverTime(data),
        modelUsage: processModelUsage(data),
        modeUsage: processModeUsage(data),
        tagFrequency: processTagFrequency(data),
        dailyUsage: processDailyUsage(data),
        activityData: processActivityData(data),
        improvements: processImprovements(data),
        insights: generateInsights(data)
      })
    } catch (error) {
      console.error('Analytics error:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return { analytics, loading, refetch: fetchAnalytics }
}

function processScoreOverTime(data: any[]) {
  const grouped = data.reduce((acc, item) => {
    const date = format(new Date(item.created_at), 'MMM dd')
    if (!acc[date]) {
      acc[date] = { date, scores: [] }
    }
    acc[date].scores.push(item.benchmark_score || 0)
    return acc
  }, {} as Record<string, { date: string; scores: number[] }>)

  return Object.values(grouped).map(group => ({
    date: group.date,
    score: Math.round(
      group.scores.reduce((a, b) => a + b, 0) / group.scores.length
    )
  }))
}

function processModelUsage(data: any[]) {
  const models = data.reduce((acc, item) => {
    const model = item.model_used || 'Unknown'
    acc[model] = (acc[model] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(models)
    .map(([name, value]) => ({
      name: name.split('/').pop() || name,
      value
    }))
    .sort((a, b) => b.value - a.value)
}

function processModeUsage(data: any[]) {
  const modes = data.reduce((acc, item) => {
    const mode = item.mode || 'standard'
    acc[mode] = (acc[mode] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(modes).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }))
}

function processTagFrequency(data: any[]) {
  const tags = data.flatMap(item => item.tags || [])
  const frequency = tags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(frequency)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 20)
}

function processDailyUsage(data: any[]) {
  const daily = data.reduce((acc, item) => {
    const date = format(new Date(item.created_at), 'MMM dd')
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(daily)
    .map(([date, count]) => ({ date, count }))
    .slice(-30)
}

function processActivityData(data: any[]) {
  return data.reduce((acc, item) => {
    const date = format(new Date(item.created_at), 'yyyy-MM-dd')
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {} as Record<string, number>)
}

function processImprovements(data: any[]) {
  return data.map((item, i) => ({
    iteration: i + 1,
    score: item.benchmark_score || 0,
    date: format(new Date(item.created_at), 'MMM dd')
  }))
}

function calculateAvgScore(data: any[]) {
  if (data.length === 0) return 0
  const sum = data.reduce((acc, item) => acc + (item.benchmark_score || 0), 0)
  return Math.round(sum / data.length)
}

function generateInsights(data: any[]) {
  const insights: string[] = []
  const avgScore = calculateAvgScore(data)

  if (avgScore >= 85) {
    insights.push('🎉 Excellent! Your prompts consistently achieve high scores.')
  } else if (avgScore >= 70) {
    insights.push('📈 Good progress! Try Ultra Mode for even better results.')
  } else {
    insights.push('💡 Tip: Be more specific and provide context in your prompts.')
  }

  const modelUsage = processModelUsage(data)
  if (modelUsage.length > 0) {
    insights.push(`🤖 Your most-used model is ${modelUsage[0].name}`)
  }

  return insights
}
