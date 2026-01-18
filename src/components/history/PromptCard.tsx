'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Star, Eye, Trash2, MoreHorizontal, Copy } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

interface Prompt {
  id: string
  title: string | null
  description: string | null
  tags: string[]
  is_favorite: boolean
  created_at: string
}

interface PromptCardProps {
  prompt: Prompt
  isSelected: boolean
  onToggleSelection: () => void
}

export function PromptCard({
  prompt,
  isSelected,
  onToggleSelection
}: PromptCardProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.description || '')
    toast.success('Prompt copied!')
  }

  return (
    <Card className={`p-4 rounded-2xl glass-card hover:shadow-elevation-2 transition-all duration-300 group ${isSelected ? 'ring-2 ring-[var(--accent-blue)] border-[var(--accent-blue)] bg-[var(--accent-blue)]/5' : ''}`}>
      <div className="flex items-start gap-4">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggleSelection}
          aria-label={`Select ${prompt.title || 'prompt'}`}
          className="mt-1 rounded-md"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <Link href={`/dashboard/prompts/${prompt.id}`} className="hover:underline">
                <h3 className="font-bold truncate text-base tracking-tight">
                  {prompt.title || 'Untitled Prompt'}
                </h3>
              </Link>
              {prompt.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                  {prompt.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-muted/50"
                onClick={handleCopy}
                aria-label="Copy prompt"
              >
                <Copy className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-muted/50"
                aria-label={prompt.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star 
                  className={`w-4 h-4 ${prompt.is_favorite ? 'fill-yellow-500 text-yellow-500' : ''}`}
                />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted/50">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem asChild className="rounded-lg">
                    <Link href={`/dashboard/prompts/${prompt.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive rounded-lg">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap mt-3">
            {prompt.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5 rounded-lg uppercase tracking-wider font-semibold">
                {tag}
              </Badge>
            ))}
            {prompt.tags.length > 3 && (
              <Badge variant="outline" className="text-[10px] px-2 py-0.5 rounded-lg">
                +{prompt.tags.length - 3}
              </Badge>
            )}
            <span className="text-[10px] text-muted-foreground ml-auto">
              {formatDistanceToNow(new Date(prompt.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
