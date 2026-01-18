'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Brain, Lightbulb, Rocket, Target } from 'lucide-react';

const ICONS = [Sparkles, Zap, Brain, Lightbulb, Rocket, Target];

const FACTS = [
  "The average prompt is improved by 47% after optimization",
  "Pro users generate 3x more effective prompts",
  "Ultra Mode produces 89% more accurate results",
  "Context-rich prompts yield 2.5x better responses",
  "Structured prompts reduce AI hallucinations by 60%",
  "Role-defining prompts improve task completion by 75%",
];

export function LoadingFacts() {
  const [factIndex, setFactIndex] = useState(0);
  const [iconIndex, setIconIndex] = useState(0);

  useEffect(() => {
    const factInterval = setInterval(() => {
      setFactIndex((i) => (i + 1) % FACTS.length);
    }, 6000);

    const iconInterval = setInterval(() => {
      setIconIndex((i) => (i + 1) % ICONS.length);
    }, 1000);

    return () => {
      clearInterval(factInterval);
      clearInterval(iconInterval);
    };
  }, []);

  const Icon = ICONS[iconIndex];

  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-8">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 rounded-full border-4 border-primary/10 border-t-primary"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={iconIndex}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Icon className="w-8 h-8 text-primary" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="text-center space-y-2 max-w-sm">
        <p className="text-sm font-medium text-muted-foreground">
          Optimizing your prompt...
        </p>
        <AnimatePresence mode="wait">
          <motion.p
            key={factIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-xs text-muted-foreground/70"
          >
            {FACTS[factIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="flex gap-1.5">
        {FACTS.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i === factIndex ? 'bg-primary scale-125' : 'bg-muted-foreground/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function LoadingDots() {
  return (
    <div className="flex items-center gap-1">
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
        className="w-1.5 h-1.5 rounded-full bg-primary"
      />
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
        className="w-1.5 h-1.5 rounded-full bg-primary"
      />
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
        className="w-1.5 h-1.5 rounded-full bg-primary"
      />
    </div>
  );
}
