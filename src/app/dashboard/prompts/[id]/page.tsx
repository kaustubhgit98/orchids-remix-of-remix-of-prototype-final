'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { 
  ArrowLeft, Copy, Check, Star, Trash2, 
  History, BarChart3, Clock, Sparkles 
} from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface Prompt {
  id: string
  title: string | null
  description: string | null
  is_favorite: boolean
  tags: string[]
  created_at: string
}

interface Version {
  id: string
  version: number
  content: string
  enhanced_content: string | null
  analysis_result: any
  benchmark_score: number
  model_used: string
  mode: string
  created_at: string
}

export default function PromptDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [versions, setVersions] = useState<Version[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (id) fetchPromptDetails()
  }, [id])

  const fetchPromptDetails = async () => {
    try {
      setLoading(true)
      const { data: promptData, error: promptError } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', id)
        .single()

      if (promptError) throw promptError
      setPrompt(promptData)

      const { data: versionData, error: versionError } = await supabase
        .from('prompt_versions')
        .select('*')
        .eq('prompt_id', id)
        .order('version', { ascending: false })

      if (versionError) throw versionError
      setVersions(versionData || [])
    } catch (error) {
      toast.error('Failed to load prompt details')
      router.push('/dashboard/history')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleToggleFavorite = async () => {
    if (!prompt) return
    try {
      const { error } = await supabase
        .from('prompts')
        .update({ is_favorite: !prompt.is_favorite })
        .eq('id', prompt.id)

      if (error) throw error
      setPrompt({ ...prompt, is_favorite: !prompt.is_favorite })
      toast.success(prompt.is_favorite ? 'Removed from favorites' : 'Added to favorites')
    } catch (error) {
      toast.error('Failed to update favorite')
    }
  }

  const handleDelete = async () => {
    if (!prompt) return
    setDeleting(true)
    try {
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', prompt.id)

      if (error) throw error
      toast.success('Prompt deleted')
      router.push('/dashboard/history')
    } catch (error) {
      toast.error('Failed to delete prompt')
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  if (loading) {
    return <div className="max-w-5xl mx-auto px-6 py-8 animate-pulse space-y-8">
      <div className="h-10 w-32 bg-muted rounded" />
      <div className="h-40 bg-muted rounded-xl" />
      <div className="grid grid-cols-3 gap-6">
        <div className="h-60 bg-muted rounded-xl col-span-2" />
        <div className="h-60 bg-muted rounded-xl" />
      </div>
    </div>
  }

  if (!prompt || versions.length === 0) return null

  const latestVersion = versions[0]

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 pb-20 space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleToggleFavorite}>
            <Star className={`w-4 h-4 ${prompt.is_favorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
          </Button>
          <Button variant="outline" size="icon" className="text-destructive" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete Prompt</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this prompt? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting} className="rounded-xl">
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{prompt.title || 'Untitled Prompt'}</h1>
          <Badge variant="outline" className="h-6">v{latestVersion.version}</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {prompt.tags.map(tag => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
          <span className="text-sm text-muted-foreground flex items-center gap-1 ml-auto">
            <Clock className="w-3.5 h-3.5" />
            Created {format(new Date(prompt.created_at), 'PPP')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="enhanced">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="enhanced" className="gap-2">
                <Sparkles className="w-4 h-4" />
                Enhanced
              </TabsTrigger>
              <TabsTrigger value="original" className="gap-2">
                <History className="w-4 h-4" />
                Original
              </TabsTrigger>
            </TabsList>

            <TabsContent value="enhanced" className="mt-4">
              <Card className="border-primary/50 bg-primary/5">
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <CardTitle className="text-sm">Optimized for {latestVersion.model_used}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => handleCopy(latestVersion.enhanced_content || '')}>
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed">
                    {latestVersion.enhanced_content}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="original" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <CardTitle className="text-sm">Original Submission</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm whitespace-pre-wrap font-sans text-muted-foreground leading-relaxed">
                    {latestVersion.content}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Version Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Benchmark Score</span>
                <span className="text-2xl font-bold text-primary">{latestVersion.benchmark_score}%</span>
              </div>
              <div className="space-y-4">
                {Object.entries(latestVersion.analysis_result || {}).map(([key, value]: [string, any]) => (
                  <div key={key} className="space-y-1.5">
                    <div className="flex justify-between text-xs capitalize">
                      <span>{key}</span>
                      <span>{value}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-1000" 
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <History className="w-4 h-4" />
                Version History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {versions.map((v) => (
                  <div key={v.id} className="flex items-center justify-between text-sm group cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold">
                        v{v.version}
                      </div>
                      <div>
                        <div className="font-medium">{v.model_used.split('/').pop()}</div>
                        <div className="text-[10px] text-muted-foreground">{format(new Date(v.created_at), 'MMM d, h:mm a')}</div>
                      </div>
                    </div>
                    <div className="text-xs font-semibold">{v.benchmark_score}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
