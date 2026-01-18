'use client'

import { PromptCard } from './PromptCard'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'

interface Prompt {
  id: string
  title: string | null
  description: string | null
  tags: string[]
  is_favorite: boolean
  created_at: string
}

interface PromptListProps {
  prompts: Prompt[]
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
}

export function PromptList({
  prompts,
  selectedIds,
  onSelectionChange
}: PromptListProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: prompts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    overscan: 5
  })

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(sid => sid !== id))
    } else {
      onSelectionChange([...selectedIds, id])
    }
  }

  return (
    <div
      ref={parentRef}
      className="h-[600px] overflow-auto rounded-lg border bg-card/50"
      role="list"
      aria-label="Prompt history list"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative'
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const prompt = prompts[virtualRow.index]
          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`
              }}
              className="px-2 pt-2"
            >
              <PromptCard
                prompt={prompt}
                isSelected={selectedIds.includes(prompt.id)}
                onToggleSelection={() => toggleSelection(prompt.id)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
