'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp } from 'lucide-react'

interface ScoreChartProps {
  data: Array<{ date: string; score: number }>
}

export function ScoreChart({ data }: ScoreChartProps) {
  return (
    <Card className="rounded-2xl glass-card shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-[var(--accent-blue)]/10 flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5 text-[var(--accent-blue)]" />
          </span>
          Score Over Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ 
                  background: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="var(--accent-blue)" 
                strokeWidth={2.5} 
                dot={{ r: 4, fill: 'var(--accent-blue)' }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
