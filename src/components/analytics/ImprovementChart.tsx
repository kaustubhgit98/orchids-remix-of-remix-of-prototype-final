'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ImprovementChartProps {
  data: Array<{ iteration: number; score: number; date: string }>
}

export function ImprovementChart({ data }: ImprovementChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Improvement Velocity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="iteration" label={{ value: 'Prompt Version', position: 'insideBottom', offset: -5 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line 
                type="stepAfter" 
                dataKey="score" 
                stroke="#8b5cf6" 
                strokeWidth={3} 
                dot={{ r: 4 }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
