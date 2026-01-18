'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Sparkles, X, Zap, Target, Wand2, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

const MODELS = [
  { value: 'openai/gpt-4o', label: 'GPT-4o', provider: 'OpenAI' },
  { value: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
  { value: 'google/gemini-pro', label: 'Gemini Pro', provider: 'Google' },
  { value: 'meta-llama/llama-3-70b', label: 'Llama 3 70B', provider: 'Meta' },
  { value: 'mistralai/mistral-large', label: 'Mistral Large', provider: 'Mistral' },
  { value: 'deepseek/deepseek-coder', label: 'DeepSeek Coder', provider: 'DeepSeek' }
]

const ENHANCEMENT_MODES = [
  { id: 'standard', label: 'Standard', icon: Zap, description: 'Balanced optimization' },
  { id: 'precision', label: 'Precision', icon: Target, description: 'Maximum accuracy' },
  { id: 'creative', label: 'Creative', icon: Wand2, description: 'Artistic flair' },
  { id: 'safe', label: 'Safe', icon: Shield, description: 'Family friendly' },
]

interface PromptInputSectionProps {
  onAnalyze: (prompt: string, mode: string, model: string, ultraMode: boolean) => void
  loading: boolean
}

export function PromptInputSection({ onAnalyze, loading }: PromptInputSectionProps) {
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState('openai/gpt-4o')
  const [mode, setMode] = useState('standard')
  const [ultraMode, setUltraMode] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  const handleSubmit = () => {
    if (!prompt.trim() || prompt.trim().length < 10) return
    onAnalyze(prompt, mode, model, ultraMode)
  }

  const addTag = (tag: string) => {
    const trimmed = tag.trim()
    if (trimmed && !tags.includes(trimmed) && tags.length < 5) {
      setTags([...tags, trimmed])
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(tagInput)
    }
  }

  const charCount = prompt.length
  const wordCount = prompt.trim().split(/\s+/).filter(Boolean).length
  const isValidPrompt = prompt.trim().length >= 10

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <Badge className="mb-3 px-3 py-1 text-[10px] font-bold tracking-widest bg-foreground/5 text-foreground border-border/50">
          ANALYZE & ENHANCE
        </Badge>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tighter">
          Supercharge Your Prompts
        </h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Transform basic prompts into high-performance AI instructions
        </p>
      </div>

      <div className="rounded-2xl glass-card p-5 md:p-6 shadow-elevation-1">
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                AI Model
              </Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger id="model" className="h-10 rounded-xl glass-card border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODELS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      <span className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{m.provider}</span>
                        <span>{m.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Enhancement Mode
              </Label>
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger className="h-10 rounded-xl glass-card border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ENHANCEMENT_MODES.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      <span className="flex items-center gap-2">
                        <m.icon className="w-3.5 h-3.5" />
                        <span>{m.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-[var(--accent-blue)]/20 bg-[var(--accent-blue)]/5">
            <div className="flex items-center gap-3">
              <Switch
                id="ultra-mode"
                checked={ultraMode}
                onCheckedChange={setUltraMode}
              />
              <div className="flex-1">
                <Label htmlFor="ultra-mode" className="text-sm font-semibold cursor-pointer">
                  Ultra Enhancement
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  Maximum optimization with advanced techniques
                </p>
              </div>
              <Sparkles className="w-4 h-4 text-[var(--accent-blue)]" />
            </div>
          </div>

          <div className="relative">
            <textarea
              id="prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here... (e.g., 'Write a blog post about AI ethics')"
              className="w-full min-h-[140px] h-[140px] text-sm p-4 pb-10 rounded-xl glass-card border border-border/50 focus:border-[var(--accent-blue)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]/20 resize-none overflow-y-auto bg-background/50 transition-all"
              disabled={loading}
              style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
            />
            
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] text-muted-foreground">
              <span>{charCount} chars · {wordCount} words</span>
              {prompt.length > 0 && prompt.length < 10 && (
                <span className="text-amber-500">Min 10 chars</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Tags (Optional)
            </Label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add tags..."
                className="flex-1 px-3 py-2 text-sm rounded-xl border border-border/50 bg-background/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]/20"
                disabled={loading || tags.length >= 5}
                maxLength={20}
              />
              <Button
                type="button"
                onClick={() => addTag(tagInput)}
                variant="outline"
                size="sm"
                disabled={!tagInput.trim() || loading || tags.length >= 5}
                className="rounded-xl px-4"
              >
                Add
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1 px-2 py-1 rounded-md">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-destructive"
                      disabled={loading}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!isValidPrompt || loading}
            className="w-full h-11 text-sm font-semibold rounded-xl shadow-elevation-1"
            size="lg"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Enhance Prompt
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
