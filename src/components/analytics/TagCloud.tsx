'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface TagCloudProps {
  data: Array<{ name: string; value: number }>
}

export function TagCloud({ data }: TagCloudProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top Tags & Keywords</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 min-h-[200px] content-start">
          {data.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No tags analyzed yet</p>
          ) : (
            data.map((tag, i) => (
              <Badge 
                key={tag.name} 
                variant="secondary"
                style={{ 
                  fontSize: `${Math.max(0.7, Math.min(1.5, 0.7 + tag.value / 10))}rem`,
                  opacity: Math.max(0.6, Math.min(1, 0.4 + tag.value / 20))
                }}
                className="px-3 py-1"
              >
                {tag.name}
                <span className="ml-1 opacity-50 text-[10px]">{tag.value}</span>
              </Badge>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
