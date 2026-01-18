'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Zap, Target, History, Tag, Timer, Check, Copy,
  Lock, ArrowRight, Crown, ChevronRight, BarChart3, Wand2,
  Brain, Shield, Rocket, Star, Menu, X, LayoutDashboard, FolderOpen, Settings, Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ModeToggle } from '@/components/mode-toggle';
import { UserNav } from '@/components/user-nav';
import { useAuth } from '@/components/auth-provider';
import { useUsage } from '@/hooks/use-usage';
import { LoadingFacts } from '@/components/loading-facts';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const AI_MODELS = [
  { 
    name: 'GPT-4.5', 
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6" fill="currentColor">
        <path d="M22.28 9.82a5.98 5.98 0 0 0-.52-4.91 6.05 6.05 0 0 0-6.51-2.9A6.07 6.07 0 0 0 4.98 4.18a5.98 5.98 0 0 0-4 2.9 6.05 6.05 0 0 0 .74 7.1 5.98 5.98 0 0 0 .51 4.91 6.05 6.05 0 0 0 6.51 2.9A5.98 5.98 0 0 0 13.26 24a6.06 6.06 0 0 0 5.77-4.21 5.99 5.99 0 0 0 4-2.9 6.06 6.06 0 0 0-.75-7.07zM13.26 22.43a4.48 4.48 0 0 1-2.88-1.04l.14-.08 4.78-2.76a.79.79 0 0 0 .39-.68v-6.74l2.02 1.17a.07.07 0 0 1 .04.05v5.58a4.5 4.5 0 0 1-4.49 4.5zM3.6 18.3a4.47 4.47 0 0 1-.54-3.01l.14.09 4.78 2.76a.77.77 0 0 0 .78 0l5.84-3.37v2.33a.08.08 0 0 1-.03.06l-4.84 2.8a4.5 4.5 0 0 1-6.14-1.65zM2.34 7.9a4.49 4.49 0 0 1 2.37-1.97V11.6a.77.77 0 0 0 .39.68l5.81 3.35-2.02 1.17a.08.08 0 0 1-.07 0l-4.83-2.79A4.5 4.5 0 0 1 2.34 7.87zm16.6 3.86l-5.84-3.38 2.02-1.16a.08.08 0 0 1 .07 0l4.83 2.79a4.49 4.49 0 0 1-.68 8.1v-5.68a.79.79 0 0 0-.4-.67zm2.01-3.02l-.14-.09-4.77-2.78a.78.78 0 0 0-.79 0l-5.84 3.37V6.9a.07.07 0 0 1 .03-.06l4.83-2.79a4.5 4.5 0 0 1 6.68 4.66zM8.31 12.86l-2.02-1.16a.08.08 0 0 1-.04-.06V6.07a4.5 4.5 0 0 1 7.38-3.45l-.14.08-4.78 2.76a.79.79 0 0 0-.39.68zm1.1-2.37l2.6-1.5 2.6 1.5v3l-2.6 1.5-2.6-1.5z"/>
      </svg>
    )
  },
  { 
    name: 'Claude 3.7', 
    icon: (
      <svg viewBox="0 0 16 16" className="w-5 h-5 md:w-6 md:h-6" fill="currentColor">
        <path d="M9.218 2h2.402L16 12.987h-2.402zM4.379 2h2.512l4.38 10.987H8.82l-.895-2.308h-4.58l-.896 2.307H0L4.38 2.001zm2.755 6.64L5.635 4.777 4.137 8.64z" />
      </svg>
    )
  },
  { 
    name: 'Gemini 2.0', 
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6" fill="currentColor">
        <path d="M12 24c-.002-4.14-1.606-8.024-4.513-10.935C4.577 10.157.69 8.552 0 8.55v-.002-.002-.092C.69 8.452 4.577 6.848 7.487 3.938 10.394 1.027 11.998-.857 12 .003V0c.002 4.14 1.606 8.024 4.513 10.935C19.423 13.843 23.31 15.448 24 15.45v.002.002.092c-.69.002-4.577 1.606-7.487 4.516-2.907 2.911-4.511 6.795-4.513 10.935V24z"/>
      </svg>
    )
  },
  { 
    name: 'Llama 3.3', 
    icon: (
      <svg viewBox="0 0 22.72 15.68" className="w-5 h-5 md:w-6 md:h-6" fill="currentColor">
        <path d="M17.152 4.04C14.736 4.04 12.592 5.376 11.36 7.424 10.128 5.376 7.984 4.04 5.568 4.04 2.496 4.04 0 6.536 0 9.608c0 3.072 2.496 5.568 5.568 5.568 2.416 0 4.56-1.336 5.792-3.384 1.232 2.048 3.376 3.384 5.792 3.384 3.072 0 5.568-2.496 5.568-5.568C22.72 6.536 20.224 4.04 17.152 4.04zM5.568 13.04c-1.92 0-3.488-1.568-3.488-3.488 0-1.92 1.568-3.488 3.488-3.488.96 0 1.832.392 2.464 1.024.32.32.584.704.768 1.12.336.752.336 1.584 0 2.336-.184.416-.448.8-.768 1.12-.632.632-1.504 1.024-2.464 1.024zM17.152 13.04c-.96 0-1.832-.392-2.464-1.024-.32-.32-.584-.704-.768-1.12-.336-.752-.336-1.584 0-2.336.184-.416.448-.8.768-1.12.632-.632 1.504-1.024 2.464-1.024 1.92 0 3.488 1.568 3.488 3.488C20.64 11.472 19.072 13.04 17.152 13.04z" />
      </svg>
    )
  },
  { 
    name: 'Mistral Large 2', 
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6" fill="currentColor">
        <path d="M3.43 3.4h3.43v3.4H3.43zm13.71 0h3.43v3.4h-3.43zM0 3.4h3.43v3.4H0zm0 6.8h3.43v3.4H0zm0 6.8h3.43v3.4H0zM3.43 6.8h3.43v3.4H3.43zm0 6.8h3.43v3.4H3.43zM6.86 10.2h3.43v3.4H6.86zm6.86 0h3.43v3.4h-3.43zM6.86 17h3.43v3.4H6.86zm10.28-10.2h3.43v3.4h-3.43zm0 6.8h3.43v3.4h-3.43zm3.43-6.8H24v3.4h-3.43zm0 6.8H24v3.4h-3.43zm0 6.8H24v3.4h-3.43zM10.29 3.4h3.43v3.4h-3.43zm0 13.6h3.43v3.4h-3.43z"/>
      </svg>
    )
  },
  { 
    name: 'DeepSeek-V3', 
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6" fill="currentColor">
        <path d="M22.059 13.565c-.328-.152-.637-.34-.925-.56a5.147 5.147 0 0 1-1.464-1.996c-.318-.89-.344-1.85-.074-2.756.248-.834.706-1.587 1.334-2.193a6.83 6.83 0 0 0-3.328-3.033c-.76-.328-1.58-.493-2.408-.485a7.12 7.12 0 0 0-3.41 1.042c-.443.256-.848.57-1.206.936a6.113 6.113 0 0 1-.95 3.322c-.477.728-1.163 1.284-1.97 1.6a4.846 4.846 0 0 1-2.483.242 5.093 5.093 0 0 1-2.175-1.048c-.628-.535-1.085-1.256-1.31-2.067-.09-.32-.138-.646-.144-.973A6.84 6.84 0 0 0 .14 10.662a7.11 7.11 0 0 0 3.016 5.438c.415.297.87.533 1.35.7a5.578 5.578 0 0 1 1.83 1.234c.54.58.93 1.28 1.135 2.046.216.808.204 1.66-.035 2.46a5.55 5.55 0 0 1-2.193 3.056c.712.33 1.48.5 2.257.5a7.12 7.12 0 0 0 4.135-1.326c.453-.314.856-.7 1.196-1.146.402-.528.918-.956 1.51-1.25.68-.337 1.44-.486 2.19-.434.805.056 1.577.34 2.228.818a6.84 6.84 0 0 0 4.757-3.957c.228-.9.288-1.83.178-2.74a7.12 7.12 0 0 0-.646-2.5z"/>
      </svg>
    )
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: 'Multi-Model Optimization',
    description: 'Prompts optimized for GPT-4o, Claude, Gemini, Llama, and more',
  },
  {
    icon: Brain,
    title: 'Ultra Mode',
    description: 'Interactive Q&A-based prompt refinement for premium results',
  },
  {
    icon: Target,
    title: 'Benchmark Scoring',
    description: 'Real-time quality metrics for prompt effectiveness',
  },
  {
    icon: History,
    title: 'Version History',
    description: 'Track prompt evolution and restore previous iterations',
  },
  {
    icon: Tag,
    title: 'Smart Tagging',
    description: 'Auto-categorization and organization of prompts',
  },
  {
    icon: Timer,
    title: '30-Minute Pro Demo',
    description: 'Risk-free premium feature trial for new users',
  },
];

const FREE_FEATURES = [
  '10 daily analyses',
  'Standard optimization mode',
  'Basic benchmark scoring',
  'Copy enhanced prompts',
];

const PRO_FEATURES = [
  'Unlimited analyses',
  'All optimization modes',
  'Ultra Mode with Q&A refinement',
  'Prompt variants generation',
  'Advanced analytics dashboard',
  'Version history & restoration',
  'Priority support',
];

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      setProgress((scrollPosition / totalHeight) * 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <div className="scroll-progress" style={{ width: `${progress}%` }} />;
}

function CursorSpotlight() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="cursor-spotlight hidden md:block"
      style={{ left: position.x, top: position.y }}
    />
  );
}

function Navbar() {
  const { user } = useAuth();
  const { isPro, proDemoActive, timeLeftFormatted, remaining, limit } = useUsage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'History', href: '/dashboard/history', icon: History },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Favorites', href: '/dashboard/favorites', icon: Star },
    { name: 'Collections', href: '/dashboard/collections', icon: FolderOpen },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled ? 'glass border-b border-border/40 shadow-elevation-1' : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-foreground flex items-center justify-center shadow-elevation-1 group-hover:shadow-elevation-2 transition-all duration-300 group-hover:scale-105">
              <Sparkles className="w-4 h-4 text-background" />
            </div>
            <span className="font-bold text-lg tracking-tight">MetaPrompt</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('features')}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline-animation"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline-animation"
            >
              Pricing
            </button>
          </div>

          <div className="flex items-center gap-3">
            <AnimatePresence>
              {scrolled && !user && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
                  className="hidden sm:block"
                >
                  <Button asChild size="sm" className="rounded-full btn-ripple btn-hover-glow shadow-elevation-1">
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            
            <ModeToggle />
            
            {user ? (
              <UserNav />
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" asChild className="rounded-full hover:bg-muted/50">
                  <Link href="/login">Sign In</Link>
                </Button>
                {!scrolled && (
                  <Button asChild className="rounded-full btn-ripple btn-hover-glow shadow-elevation-1">
                    <Link href="/signup">Get Started</Link>
                  </Button>
                )}
              </div>
            )}

            <button
              className="md:hidden p-2.5 hover:bg-muted rounded-xl transition-all duration-200 active:scale-95"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-[280px] bg-card border-l border-border/50 z-50 md:hidden shadow-elevation-3 flex flex-col"
            >
              <div className="h-14 px-5 flex items-center justify-between border-b border-border/50">
                <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileMenuOpen(false)}>
                  <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center shadow-sm">
                    <Sparkles className="w-4 h-4 text-background" />
                  </div>
                  <span className="font-bold text-base tracking-tight">MetaPrompt</span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-muted rounded-xl transition-all duration-200 active:scale-95"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                {user ? (
                  navigation.map((item) => {
                    const isActive = item.href === '/' 
                      ? pathname === '/'
                      : pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href))
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm',
                          'hover:bg-muted/50',
                          isActive && 'bg-foreground/5 text-foreground font-medium border border-border/50'
                        )}
                      >
                        <item.icon className={cn('w-4 h-4', isActive ? 'text-[var(--accent-blue)]' : 'text-muted-foreground')} />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })
                ) : (
                  <>
                    <button
                      onClick={() => scrollToSection('features')}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm hover:bg-muted/50"
                    >
                      <Zap className="w-4 h-4 text-muted-foreground" />
                      <span>Features</span>
                    </button>
                    <button
                      onClick={() => scrollToSection('pricing')}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm hover:bg-muted/50"
                    >
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      <span>Pricing</span>
                    </button>
                  </>
                )}
              </nav>

              <div className="p-3 border-t border-border/50">
                {user ? (
                  (isPro || proDemoActive) ? (
                    <div className="p-2.5 rounded-lg bg-gradient-to-br from-[var(--accent-blue)]/10 to-blue-400/10 border border-[var(--accent-blue)]/20">
                      <div className="flex items-center gap-2 mb-0.5">
                        <Crown className="w-3.5 h-3.5 text-[var(--accent-blue)]" />
                        <span className="text-xs font-semibold">
                          {proDemoActive ? 'Pro Demo' : 'Pro Plan'}
                        </span>
                      </div>
                      {proDemoActive && timeLeftFormatted && (
                        <p className="text-[10px] text-muted-foreground">{timeLeftFormatted} remaining</p>
                      )}
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-lg bg-muted/50 border border-border/50">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-medium text-muted-foreground">Daily Usage</span>
                        <span className="text-[10px] font-bold">{limit - remaining}/{limit}</span>
                      </div>
                      <div className="h-1 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[var(--accent-blue)] transition-all duration-500"
                          style={{ width: `${((limit - remaining) / limit) * 100}%` }}
                        />
                      </div>
                    </div>
                  )
                ) : (
                  <div className="space-y-2">
                    <Button variant="outline" asChild className="w-full rounded-xl h-10">
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                    </Button>
                    <Button asChild className="w-full rounded-xl h-10 shadow-elevation-1">
                      <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>Get Started Free</Link>
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="orb orb-primary w-[500px] h-[500px] -top-[200px] -left-[200px] animate-float-slow opacity-50" />
      <div className="orb orb-primary w-[400px] h-[400px] top-[20%] right-[-100px] animate-float-slow opacity-30" style={{ animationDelay: '-3s' }} />
      <div className="orb orb-secondary w-[300px] h-[300px] bottom-[10%] left-[10%] animate-float-slow opacity-20" style={{ animationDelay: '-5s' }} />
    </div>
  );
}

function GeometricShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="geometric-shape w-32 h-32 border rounded-3xl rotate-12 top-[15%] left-[8%] animate-float" style={{ animationDelay: '-2s' }} />
      <div className="geometric-shape w-20 h-20 border rounded-full top-[25%] right-[12%] animate-float" style={{ animationDelay: '-4s' }} />
      <div className="geometric-shape w-24 h-24 border rounded-2xl -rotate-12 bottom-[20%] right-[8%] animate-float" style={{ animationDelay: '-1s' }} />
      <div className="geometric-shape w-16 h-16 border rounded-xl rotate-45 bottom-[30%] left-[15%] animate-float" style={{ animationDelay: '-3s' }} />
    </div>
  );
}

function TypewriterText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;
    let cursorTimer: NodeJS.Timeout;
    
    const timer = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
        cursorTimer = setTimeout(() => setShowCursor(false), 1000);
      }
    }, 80);

    return () => {
      clearInterval(timer);
      if (cursorTimer) clearTimeout(cursorTimer);
    };
  }, [text]);

  return (
    <span>
      {displayText}
      {showCursor && <span className="typing-cursor" />}
    </span>
  );
}

function HeroSection() {
  const router = useRouter();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
    },
  };

  return (
    <section className="relative min-h-[50vh] sm:min-h-[60vh] md:min-h-[80vh] flex items-center justify-center py-24 sm:py-28 md:py-32 px-4 mesh-gradient noise-bg overflow-hidden">
      <FloatingOrbs />
      <GeometricShapes />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center"
      >
        <motion.div variants={itemVariants}>
          <Badge className="mb-4 md:mb-8 px-3 md:px-4 py-1 md:py-1.5 text-[10px] md:text-xs font-bold tracking-widest bg-foreground/10 text-foreground border-border/50 shadow-elevation-1 backdrop-blur-md">
            <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1.5 md:mr-2 text-[var(--accent-blue)]" />
            PROMPT ENGINEERING STUDIO
          </Badge>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter mb-4 md:mb-8"
        >
          {mounted ? (
            <TypewriterText text="YOUR PROMPTS" />
          ) : (
            'YOUR PROMPTS'
          )}
          <br />
          <span className="animate-gradient-text">
            SUPERCHARGED
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-sm md:text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto mb-6 md:mb-12 leading-relaxed px-2"
        >
          {user ? (
            <>Welcome back! Transform your prompts into high-performance outputs optimized for leading AI models.</>
          ) : (
            <>Transform basic prompts into high-performance outputs optimized for GPT-4o, Claude, Gemini, and more.</>
          )}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4 sm:px-0"
        >
          <Button
            size="lg"
            className="h-12 md:h-14 px-8 md:px-10 rounded-full text-sm md:text-base font-bold shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] btn-ripple btn-hover-glow group"
            onClick={() => router.push(user ? '/dashboard' : '/signup')}
          >
            {user ? 'Go to Dashboard' : 'Get Started Free'}
            <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 md:h-14 px-8 md:px-10 rounded-full text-sm md:text-base font-medium glass-card hover:bg-muted/50 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
            onClick={() => {
              document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            View Pricing
          </Button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-8 md:mt-16 flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs md:text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>No credit card required</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span>Enterprise-grade security</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function ModelMarquee() {
  return (
    <section className="py-6 sm:py-8 md:py-14 border-y border-border/40 bg-muted/30 glass overflow-hidden">
      <div className="overflow-hidden">
        <motion.div
          className="flex gap-6 sm:gap-8 md:gap-16 lg:gap-20 whitespace-nowrap items-center"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          {[...AI_MODELS, ...AI_MODELS, ...AI_MODELS].map((model, i) => (
            <div key={i} className="flex items-center gap-2 md:gap-3 group shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-card border border-border/50 flex items-center justify-center shadow-elevation-1 group-hover:shadow-elevation-2 transition-all duration-300 group-hover:scale-105 text-foreground">
                {model.icon}
              </div>
              <span className="text-xs sm:text-sm md:text-lg font-semibold tracking-tight opacity-80 group-hover:opacity-100 transition-opacity">
                {model.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function DemoSection() {
  const { user } = useAuth();
  const { isPro, proDemoActive, proDemoUsed, timeLeftFormatted, startDemo } = useUsage();
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [demoUsed, setDemoUsed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const used = localStorage.getItem('metaprompt_demo_used');
    const cached = localStorage.getItem('metaprompt_demo_result');
    if (used === 'true') {
      setDemoUsed(true);
      if (cached) setResult(cached);
    }
  }, []);

  const handleAnalyze = async () => {
    if (!prompt.trim() || loading) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      
      if (!res.ok) throw new Error('Failed to analyze');
      
      const data = await res.json();
      const enhanced = data.enhanced_prompt || data.enhancedPrompt || prompt;
      
      setResult(enhanced);
      localStorage.setItem('metaprompt_demo_used', 'true');
      localStorage.setItem('metaprompt_demo_result', enhanced);
      setDemoUsed(true);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        toast.error('Failed to analyze prompt');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStartDemo = async () => {
    const success = await startDemo();
    if (success) {
      toast.success('Pro demo started! You have 30 minutes.');
      router.push('/dashboard');
    }
  };

  if (user) {
    return (
      <section className="py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
            className="rounded-[2rem] md:rounded-[3rem] glass-card p-8 md:p-12 text-center shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-500"
          >
            <div className="flex justify-center mb-6">
              {isPro || proDemoActive ? (
                <Badge className="bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] border-[var(--accent-blue)]/20 px-4 py-1.5 shadow-sm">
                  <Crown className="w-4 h-4 mr-2" />
                  {proDemoActive ? `Demo Active - ${timeLeftFormatted}` : 'Pro Member'}
                </Badge>
              ) : (
                <Badge variant="secondary" className="px-4 py-1.5 shadow-sm">
                  Free Tier
                </Badge>
              )}
            </div>

            <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
              {isPro || proDemoActive ? 'Unlimited Pro Access' : 'Ready to Supercharge?'}
            </h3>
            
            <p className="text-muted-foreground mb-8 md:mb-10 max-w-md mx-auto">
              {isPro || proDemoActive
                ? 'Access all premium features including Ultra Mode, variants, and analytics.'
                : 'Try Pro features free for 30 minutes or upgrade for unlimited access.'}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-10">
              {[
                { icon: Wand2, label: 'Ultra Mode' },
                { icon: BarChart3, label: 'Analytics' },
                { icon: History, label: 'History' },
                { icon: Zap, label: 'Unlimited' },
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 md:p-5 rounded-2xl glass flex flex-col items-center gap-2 hover-lift hover-glow cursor-default"
                >
                  <item.icon className="w-6 h-6 text-[var(--accent-blue)]" />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="rounded-full h-12 px-8 btn-ripple btn-hover-glow shadow-elevation-1 group"
                onClick={() => router.push('/dashboard')}
              >
                Go to Dashboard
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              {!isPro && !proDemoActive && !proDemoUsed && (
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full h-12 px-8 glass-card"
                  onClick={handleStartDemo}
                >
                  <Timer className="mr-2 h-4 w-4" />
                  Start 30min Demo
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Try It Free</h2>
          <p className="text-muted-foreground">
            Enter any prompt below and see how MetaPrompt enhances it
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative rounded-[2rem] md:rounded-[2.5rem] glass-card overflow-hidden shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-500"
        >
          {loading ? (
            <LoadingFacts />
          ) : result ? (
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="shadow-sm">Enhanced Prompt</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="rounded-full hover:bg-muted"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="p-4 md:p-5 rounded-2xl bg-muted/50 font-mono text-sm whitespace-pre-wrap shadow-inner-subtle">
                {result}
              </div>
              
              {demoUsed && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-5 rounded-2xl bg-[var(--accent-blue)]/5 border border-[var(--accent-blue)]/20 text-center"
                >
                  <Lock className="w-6 h-6 mx-auto mb-2 text-[var(--accent-blue)]" />
                  <p className="text-sm font-medium mb-3">
                    Sign up for free to get 10 daily analyses
                  </p>
                  <Button asChild className="rounded-full btn-ripple shadow-elevation-1">
                    <Link href="/signup">Get Started Free</Link>
                  </Button>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="p-6 md:p-8">
              <Textarea
                placeholder="Enter your prompt here... e.g., 'Write a blog post about AI'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[140px] p-5 md:p-6 text-base bg-transparent border-0 resize-none focus-visible:ring-0 placeholder:text-muted-foreground/60"
                disabled={demoUsed}
              />
              
              <div className="flex justify-end pt-4 border-t border-border/30">
                <Button
                  onClick={handleAnalyze}
                  disabled={!prompt.trim() || demoUsed}
                  className="rounded-full px-8 btn-ripple btn-hover-glow shadow-elevation-1 group"
                >
                  <Sparkles className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                  Analyze Free
                </Button>
              </div>
            </div>
          )}

          {demoUsed && !result && (
            <div className="absolute inset-0 glass flex items-center justify-center backdrop-blur-md">
              <div className="text-center p-8">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Demo Used</h3>
                <p className="text-muted-foreground mb-6">
                  Sign up to continue optimizing prompts
                </p>
                <Button asChild className="rounded-full btn-ripple shadow-elevation-1">
                  <Link href="/signup">Get Started Free</Link>
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create high-performing prompts
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group feature-card p-7 md:p-8 rounded-[2rem] glass-card hover:shadow-elevation-2 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="icon-wrapper w-14 h-14 rounded-2xl bg-[var(--accent-blue)]/10 flex items-center justify-center mb-6 shadow-sm">
                <feature.icon className="w-7 h-7 text-[var(--accent-blue)]" />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const router = useRouter();
  const { user } = useAuth();
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="py-16 md:py-24 px-4 sm:px-6 mesh-gradient noise-bg">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
            Simple Pricing
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start free, upgrade when you need more
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 shadow-inner-subtle ${
                isAnnual ? 'bg-[var(--accent-blue)]' : 'bg-muted'
              }`}
            >
              <motion.div
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-elevation-1"
                animate={{ left: isAnnual ? '32px' : '4px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Annual
            </span>
            {isAnnual && (
              <Badge className="bg-green-500/10 text-green-600 border-green-500/20 shadow-sm">
                Save 20%
              </Badge>
            )}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] glass-card shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-500"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2 tracking-tight">Free</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl md:text-5xl font-bold">$0</span>
                <span className="text-muted-foreground">/forever</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8">
              {FREE_FEATURES.map((feature, i) => (
                <motion.li 
                  key={i} 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center shadow-sm">
                    <Check className="w-3 h-3 text-foreground" />
                  </div>
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>

            <Button
              variant="outline"
              size="lg"
              className="w-full rounded-full h-12 glass-card hover:bg-muted/50"
              onClick={() => router.push(user ? '/dashboard' : '/signup')}
            >
              {user ? 'Go to Dashboard' : 'Get Started'}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative p-8 md:p-10 rounded-[2rem] bg-foreground text-background overflow-hidden shadow-elevation-3 pro-card"
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10">
              <Badge className="bg-background text-foreground px-4 py-1.5 font-bold shadow-elevation-2 border-0">
                <Star className="w-3 h-3 mr-1.5 fill-current text-yellow-500" />
                MOST POPULAR
              </Badge>
            </div>
            
            <div className="relative z-10 pt-4">
              <div className="flex items-center gap-2 mb-6">
                <Crown className="w-6 h-6 text-yellow-400" />
                <h3 className="text-2xl font-bold tracking-tight">Pro</h3>
              </div>
              
              <div className="flex items-baseline gap-1 mb-6">
                <motion.span 
                  key={isAnnual ? 'annual' : 'monthly'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-5xl font-bold"
                >
                  ${isAnnual ? '0.80' : '1'}
                </motion.span>
                <span className="opacity-70">/month</span>
                {isAnnual && (
                  <span className="text-sm opacity-60 ml-2">billed annually</span>
                )}
              </div>
              
              <ul className="space-y-4 mb-8">
                {PRO_FEATURES.map((feature, i) => (
                  <motion.li 
                    key={i} 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <div className="w-5 h-5 rounded-full bg-background/20 flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <Button
                variant="secondary"
                size="lg"
                className="w-full rounded-full h-12 bg-background text-foreground hover:bg-background/90 font-semibold shadow-elevation-1 group"
              >
                Upgrade to Pro
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center p-10 md:p-16 rounded-[2.5rem] md:rounded-[3.5rem] glass-card shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-500 relative overflow-hidden"
        >
          <div className="absolute inset-0 dot-pattern opacity-30" />
          
          <div className="relative z-10">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[var(--accent-blue)]/10 flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-elevation-1"
            >
              <Rocket className="w-8 h-8 md:w-10 md:h-10 text-[var(--accent-blue)]" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Ready to Supercharge Your Prompts?
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-8 md:mb-10 max-w-xl mx-auto">
              Join thousands of users creating high-performance prompts with MetaPrompt
            </p>
            <Button
              size="lg"
              className="h-14 px-10 rounded-full text-base md:text-lg font-bold shadow-elevation-2 hover:shadow-elevation-3 btn-ripple btn-hover-glow hover:-translate-y-1 transition-all duration-300 group"
              onClick={() => router.push(user ? '/dashboard' : '/signup')}
            >
              {user ? 'Go to Dashboard' : 'Get Started Free'}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-10 md:py-12 px-4 sm:px-6 border-t border-border/40 glass">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-foreground flex items-center justify-center shadow-sm group-hover:shadow-elevation-1 transition-all duration-300">
              <Sparkles className="w-4 h-4 text-background" />
            </div>
            <span className="font-bold tracking-tight">MetaPrompt</span>
          </Link>
          
          <div className="flex items-center gap-8 text-sm">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors underline-animation">
              Features
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors underline-animation">
              Pricing
            </Link>
          </div>
          
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MetaPrompt. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen relative page-transition">
      <ScrollProgress />
      <CursorSpotlight />
      <Navbar />
      <HeroSection />
      <ModelMarquee />
      <DemoSection />
      <FeaturesSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}
