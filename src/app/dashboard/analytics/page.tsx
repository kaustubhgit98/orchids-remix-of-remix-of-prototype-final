'use client'

import { OverviewCards } from '@/components/analytics/OverviewCards'
import { ScoreChart } from '@/components/analytics/ScoreChart'
import { ModelUsageChart } from '@/components/analytics/ModelUsageChart'
import { ModeUsageChart } from '@/components/analytics/ModeUsageChart'
import { TagCloud } from '@/components/analytics/TagCloud'
import { ActivityHeatmap } from '@/components/analytics/ActivityHeatmap'
import { UsageChart } from '@/components/analytics/UsageChart'
import { ImprovementChart } from '@/components/analytics/ImprovementChart'
import { useAnalytics } from '@/hooks/use-analytics'
import { useAuth } from '@/components/auth-provider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { BarChart3, TrendingUp, Activity } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AnalyticsPage() {
  const { user } = useAuth()
  const { analytics, loading } = useAnalytics(user?.id)

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-8 page-transition">
        <div className="h-12 w-64 bg-muted rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 glass-card rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-96 glass-card rounded-2xl animate-pulse" />
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-10 pb-20 page-transition">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center shadow-elevation-1">
            <BarChart3 className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              Deep insights into your prompt engineering patterns
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-4">
          <Badge variant="secondary" className="rounded-lg">
            <TrendingUp className="w-3 h-3 mr-1" />
            {analytics.totalPrompts} total analyses
          </Badge>
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20 rounded-lg">
            <Activity className="w-3 h-3 mr-1" />
            {analytics.avgScore}% avg score
          </Badge>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <OverviewCards analytics={analytics} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="overview" className="mt-8">
          <TabsList className="bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg">Performance</TabsTrigger>
            <TabsTrigger value="usage" className="rounded-lg">Usage</TabsTrigger>
            <TabsTrigger value="insights" className="rounded-lg">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ScoreChart data={analytics.scoreOverTime} />
              <ImprovementChart data={analytics.improvements} />
              <ModelUsageChart data={analytics.modelUsage} />
              <ModeUsageChart data={analytics.modeUsage} />
            </div>
          </TabsContent>

          <TabsContent value="usage" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 gap-6">
              <UsageChart data={analytics.dailyUsage} />
              <ActivityHeatmap data={analytics.activityData} />
            </div>
          </TabsContent>

          <TabsContent value="insights" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TagCloud data={analytics.tagFrequency} />
              </div>
              <div className="space-y-6">
                <div className="p-6 rounded-2xl glass-card shadow-elevation-1">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[var(--accent-blue)]/10 flex items-center justify-center text-xs">💡</span>
                    AI Insights
                  </h3>
                  <ul className="space-y-4">
                    {analytics.insights.map((insight, i) => (
                      <li key={i} className="text-sm flex gap-3 text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)] mt-1.5 shrink-0" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
