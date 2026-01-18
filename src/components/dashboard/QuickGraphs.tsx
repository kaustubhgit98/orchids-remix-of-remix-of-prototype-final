'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Target, BarChart2, PieChart as PieChartIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  RadialBarChart,
  RadialBar
} from 'recharts'

interface QuickGraphsProps {
  analysis: {
    score: number
    clarity: number
    specificity: number
    context: number
    structure: number
  }
}

export function QuickGraphs({ analysis }: QuickGraphsProps) {
  const router = useRouter()

  const scoreData = [
    { name: 'Score', value: analysis.score, fill: 'var(--accent-blue)' },
    { name: 'Remaining', value: 100 - analysis.score, fill: 'var(--muted)' }
  ]

  const metricsData = [
    { name: 'Clarity', value: analysis.clarity, fill: '#3b82f6' },
    { name: 'Specificity', value: analysis.specificity, fill: '#8b5cf6' },
    { name: 'Context', value: analysis.context, fill: '#10b981' },
    { name: 'Structure', value: analysis.structure, fill: '#f59e0b' }
  ]

  const radialData = [
    {
      name: 'Score',
      value: analysis.score,
      fill: analysis.score >= 80 ? '#10b981' : analysis.score >= 60 ? '#3b82f6' : '#f59e0b'
    }
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold tracking-tight">Quick Analysis</h3>
          <p className="text-xs text-muted-foreground">
            Visual breakdown of performance
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard/analytics')}
          className="gap-2 rounded-xl text-xs h-8"
        >
          Full Analytics
          <ArrowRight className="w-3 h-3" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-xl glass-card shadow-elevation-1">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-[var(--accent-blue)]" />
              Benchmark Score
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <ResponsiveContainer width="100%" height={120}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="85%"
                data={radialData}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar
                  minAngle={15}
                  background={{ fill: 'var(--muted)' }}
                  clockWise
                  dataKey="value"
                  cornerRadius={8}
                />
                <text
                  x="50%"
                  y="45%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-current text-2xl font-bold"
                >
                  {analysis.score}
                </text>
                <text
                  x="50%"
                  y="62%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-muted-foreground text-[10px]"
                >
                  out of 100
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-xl glass-card shadow-elevation-1">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
              <BarChart2 className="w-3.5 h-3.5 text-purple-500" />
              Metrics Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={metricsData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={60} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }} 
                  contentStyle={{ 
                    background: 'var(--card)', 
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '11px'
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {metricsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-xl glass-card shadow-elevation-1">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
              <PieChartIcon className="w-3.5 h-3.5 text-green-500" />
              Score Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie
                  data={scoreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {scoreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--card)', 
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '11px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-[10px] text-muted-foreground text-center -mt-2">
              Performance vs Maximum
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
