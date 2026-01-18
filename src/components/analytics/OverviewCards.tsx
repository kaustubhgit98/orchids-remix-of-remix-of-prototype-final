'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Target, Zap, TrendingUp } from 'lucide-react'

interface OverviewCardsProps {
  analytics: {
    totalPrompts: number
    avgScore: number
    insights: string[]
  }
}

export function OverviewCards({ analytics }: OverviewCardsProps) {
  const stats = [
    {
      title: 'Total Prompts',
      value: analytics.totalPrompts,
      icon: Sparkles,
      color: 'text-[var(--accent-blue)]',
      bgColor: 'bg-[var(--accent-blue)]/10',
      description: 'Optimized prompts'
    },
    {
      title: 'Average Score',
      value: `${analytics.avgScore}%`,
      icon: Target,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      description: 'Quality benchmark'
    },
    {
      title: 'Top Model',
      value: 'GPT-4o',
      icon: Zap,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      description: 'Most used AI'
    },
    {
      title: 'Performance',
      value: '+12%',
      icon: TrendingUp,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      description: 'VS last week'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, i) => (
        <Card key={i} className="rounded-2xl glass-card shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`w-8 h-8 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold tracking-tight">{stat.value}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
