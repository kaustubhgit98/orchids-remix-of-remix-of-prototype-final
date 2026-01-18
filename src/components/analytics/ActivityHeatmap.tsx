'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format, subDays, eachDayOfInterval, isSameDay } from 'date-fns'

interface ActivityHeatmapProps {
  data: Record<string, number>
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const today = new Date()
  const days = eachDayOfInterval({
    start: subDays(today, 83), // 12 weeks
    end: today
  })

  const getColor = (count: number) => {
    if (!count) return 'bg-muted'
    if (count < 3) return 'bg-blue-200 dark:bg-blue-900'
    if (count < 6) return 'bg-blue-400 dark:bg-blue-700'
    if (count < 10) return 'bg-blue-600 dark:bg-blue-500'
    return 'bg-blue-800 dark:bg-blue-300'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Activity Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1">
          {days.map((day, i) => {
            const dateStr = format(day, 'yyyy-MM-dd')
            const count = data[dateStr] || 0
            return (
              <div
                key={i}
                className={`w-3 h-3 rounded-sm ${getColor(count)} transition-colors hover:ring-2 ring-primary ring-offset-2`}
                title={`${dateStr}: ${count} prompts`}
              />
            )
          })}
        </div>
        <div className="flex items-center gap-2 mt-4 text-[10px] text-muted-foreground">
          <span>Less</span>
          <div className="w-2 h-2 bg-muted rounded-sm" />
          <div className="w-2 h-2 bg-blue-200 dark:bg-blue-900 rounded-sm" />
          <div className="w-2 h-2 bg-blue-400 dark:bg-blue-700 rounded-sm" />
          <div className="w-2 h-2 bg-blue-600 dark:bg-blue-500 rounded-sm" />
          <div className="w-2 h-2 bg-blue-800 dark:bg-blue-300 rounded-sm" />
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  )
}
