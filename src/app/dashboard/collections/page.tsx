'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { FolderPlus, FolderOpen, MoreVertical, Trash2, Edit, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/auth-provider'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface Collection {
  id: string
  name: string
  description: string | null
  color: string
  icon: string
  created_at: string
}

const COLLECTION_COLORS = [
  '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'
]

const COLLECTION_ICONS = ['📁', '💼', '🎯', '📚', '💡', '🔥', '⭐', '🚀']

export default function CollectionsPage() {
  const { user } = useAuth()
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState('#3b82f6')
  const [newIcon, setNewIcon] = useState('📁')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (user) fetchCollections()
  }, [user])

  const fetchCollections = async () => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCollections(data || [])
    } catch (error) {
      toast.error('Failed to load collections')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!newName.trim()) return

    setCreating(true)
    try {
      const { error } = await supabase
        .from('collections')
        .insert({
          user_id: user?.id,
          name: newName,
          color: newColor,
          icon: newIcon
        })

      if (error) throw error
      toast.success('Collection created')
      setDialogOpen(false)
      setNewName('')
      fetchCollections()
    } catch (error) {
      toast.error('Failed to create collection')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Collection deleted')
      fetchCollections()
    } catch (error) {
      toast.error('Failed to delete collection')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10 page-transition">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--accent-blue)]/10 flex items-center justify-center shadow-elevation-1">
            <FolderOpen className="w-6 h-6 text-[var(--accent-blue)]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Collections</h1>
            <p className="text-muted-foreground text-sm">
              Organize your prompts into folders
            </p>
          </div>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2 rounded-xl shadow-elevation-1 btn-ripple">
          <FolderPlus className="w-4 h-4" />
          New Collection
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 rounded-2xl glass-card animate-pulse" />
            ))}
          </div>
        ) : collections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 md:py-24 px-4 text-center rounded-[2rem] glass-card shadow-elevation-1">
            <div className="w-20 h-20 rounded-2xl bg-[var(--accent-blue)]/10 flex items-center justify-center mb-6 shadow-inner-subtle">
              <FolderOpen className="w-10 h-10 text-[var(--accent-blue)]" />
            </div>
            <h2 className="text-2xl font-bold mb-2 tracking-tight">No collections yet</h2>
            <p className="text-muted-foreground max-w-xs mb-8">
              Create your first collection to start organizing your prompts.
            </p>
            <Button onClick={() => setDialogOpen(true)} className="rounded-xl gap-2 shadow-elevation-1">
              <FolderPlus className="w-4 h-4" />
              Create Collection
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection, i) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="group rounded-2xl glass-card hover:shadow-elevation-2 transition-all duration-300 cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm"
                      style={{ backgroundColor: `${collection.color}20`, color: collection.color }}
                    >
                      {collection.icon}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 rounded-lg">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem className="rounded-lg">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive rounded-lg" onClick={() => handleDelete(collection.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-lg mb-1 tracking-tight">{collection.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {new Date(collection.created_at).toLocaleDateString()} • 0 items
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Create Collection</DialogTitle>
            <DialogDescription>
              Create a new collection to organize your prompts.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="My Collection"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="flex flex-wrap gap-2">
                {COLLECTION_ICONS.map(icon => (
                  <button
                    key={icon}
                    onClick={() => setNewIcon(icon)}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                      newIcon === icon 
                        ? 'bg-[var(--accent-blue)]/20 ring-2 ring-[var(--accent-blue)]' 
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {COLLECTION_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setNewColor(color)}
                    className={`w-8 h-8 rounded-lg transition-all ${
                      newColor === color ? 'ring-2 ring-offset-2 ring-[var(--accent-blue)]' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!newName.trim() || creating} className="rounded-xl gap-2">
              {creating && <Loader2 className="w-4 h-4 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
