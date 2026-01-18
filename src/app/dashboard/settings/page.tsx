'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/components/auth-provider'
import { supabase } from '@/lib/supabase'
import { User, Shield, Sparkles, Key, Save, CheckCircle2, Building2, MapPin, Globe, FileText, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface UserProfile {
  display_name: string
  bio: string
  company: string
  website: string
  location: string
}

type SettingsTab = 'profile' | 'studio' | 'security'

const TABS = [
  { id: 'profile' as const, label: 'Profile', icon: User, description: 'Personal information' },
  { id: 'studio' as const, label: 'Studio Preferences', icon: Sparkles, description: 'Workspace settings' },
  { id: 'security' as const, label: 'Security & API', icon: Shield, description: 'Keys and security' },
]

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile>({
    display_name: '',
    bio: '',
    company: '',
    website: '',
    location: ''
  })

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return
      
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()
        
        if (data && !error) {
          setProfile({
            display_name: data.display_name || '',
            bio: data.bio || '',
            company: data.company || '',
            website: data.website || '',
            location: data.location || ''
          })
        }
      } catch (err) {
        // Profile doesn't exist yet
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [user?.id])

  const handleSave = async () => {
    if (!user?.id) return
    
    setSaving(true)
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          display_name: profile.display_name,
          bio: profile.bio,
          company: profile.company,
          website: profile.website,
          location: profile.location,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })

      if (error) throw error
      toast.success('Profile saved successfully')
    } catch (err) {
      toast.error('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const updateProfile = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-10 pb-20 page-transition">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your account and preferences
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-64 flex-shrink-0"
        >
          <nav className="space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-left group',
                  activeTab === tab.id
                    ? 'bg-foreground text-background shadow-elevation-2'
                    : 'hover:bg-muted/50'
                )}
              >
                <div className="flex items-center gap-3">
                  <tab.icon className={cn(
                    'w-4 h-4',
                    activeTab === tab.id ? 'text-background' : 'text-muted-foreground'
                  )} />
                  <div>
                    <div className={cn(
                      'text-sm font-medium',
                      activeTab === tab.id ? 'text-background' : 'text-foreground'
                    )}>
                      {tab.label}
                    </div>
                    <div className={cn(
                      'text-[10px]',
                      activeTab === tab.id ? 'text-background/70' : 'text-muted-foreground'
                    )}>
                      {tab.description}
                    </div>
                  </div>
                </div>
                <ChevronRight className={cn(
                  'w-4 h-4 transition-transform',
                  activeTab === tab.id ? 'text-background' : 'text-muted-foreground opacity-0 group-hover:opacity-100'
                )} />
              </button>
            ))}
          </nav>
        </motion.div>

        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="rounded-2xl glass-card shadow-elevation-1">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Profile Information</CardTitle>
                        <CardDescription className="text-xs">Update your personal details</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                        <Input 
                          id="email" 
                          value={user?.email || ''} 
                          disabled 
                          className="rounded-xl bg-muted/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">Display Name</Label>
                        <Input 
                          id="name" 
                          placeholder="John Doe" 
                          value={profile.display_name}
                          onChange={(e) => updateProfile('display_name', e.target.value)}
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-sm font-medium flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                        Bio
                      </Label>
                      <Textarea 
                        id="bio" 
                        placeholder="Tell us a little about yourself..."
                        value={profile.bio}
                        onChange={(e) => updateProfile('bio', e.target.value)}
                        className="rounded-xl min-h-[80px] resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-sm font-medium flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                          Company
                        </Label>
                        <Input 
                          id="company" 
                          placeholder="Acme Inc."
                          value={profile.company}
                          onChange={(e) => updateProfile('company', e.target.value)}
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                          Location
                        </Label>
                        <Input 
                          id="location" 
                          placeholder="San Francisco, CA"
                          value={profile.location}
                          onChange={(e) => updateProfile('location', e.target.value)}
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-sm font-medium flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                        Website
                      </Label>
                      <Input 
                        id="website" 
                        placeholder="https://yourwebsite.com"
                        value={profile.website}
                        onChange={(e) => updateProfile('website', e.target.value)}
                        className="rounded-xl"
                      />
                    </div>

                    <Button 
                      onClick={handleSave}
                      disabled={saving || loading}
                      className="rounded-xl gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'studio' && (
              <motion.div
                key="studio"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="rounded-2xl glass-card shadow-elevation-1">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Studio Preferences</CardTitle>
                        <CardDescription className="text-xs">Configure your prompt engineering workspace</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                      <div className="space-y-0.5">
                        <Label className="font-medium">Auto-Save History</Label>
                        <p className="text-xs text-muted-foreground">Automatically save all analyzed prompts</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                      <div className="space-y-0.5">
                        <Label className="font-medium">Ultra Mode Default</Label>
                        <p className="text-xs text-muted-foreground">Always start in Ultra Mode</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                      <div className="space-y-0.5">
                        <Label className="font-medium">Public Sharing</Label>
                        <p className="text-xs text-muted-foreground">Enable public URLs for shared prompts</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                      <div className="space-y-0.5">
                        <Label className="font-medium">Keyboard Shortcuts</Label>
                        <p className="text-xs text-muted-foreground">Enable Cmd+K command palette</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                      <div className="space-y-0.5">
                        <Label className="font-medium">Analytics Tracking</Label>
                        <p className="text-xs text-muted-foreground">Track prompt performance metrics</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="rounded-2xl glass-card shadow-elevation-1">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Security & API</CardTitle>
                        <CardDescription className="text-xs">Manage your API keys and security settings</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">API Key (Optional)</Label>
                      <div className="flex gap-2">
                        <Input 
                          type="password" 
                          placeholder="sk-..." 
                          className="font-mono rounded-xl"
                        />
                        <Button variant="outline" className="rounded-xl gap-2 flex-shrink-0">
                          <Key className="w-4 h-4" />
                          Connect
                        </Button>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Use your own API key to bypass rate limits</p>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Database Connected</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Your data is securely stored</p>
                    </div>

                      <div className="border-t border-border/50 pt-5 mt-5">
                        <h4 className="text-sm font-medium mb-3">Sessions</h4>
                        <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">Current Session</p>
                              <p className="text-xs text-muted-foreground">Logged in via {user?.app_metadata?.provider || 'Email'}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="rounded-lg text-xs"
                              onClick={async () => {
                                await supabase.auth.signOut()
                                window.location.href = '/'
                              }}
                            >
                              Sign Out
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-border/50 pt-5">
                        <h4 className="text-sm font-medium mb-3 text-destructive">Danger Zone</h4>
                        <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">Delete Account</p>
                              <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
                            </div>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="rounded-lg text-xs"
                              onClick={() => {
                                toast.error('Please contact support to delete your account')
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
