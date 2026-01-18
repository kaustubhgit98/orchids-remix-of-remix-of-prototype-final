'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth-provider';
import { supabase, UserMetadata } from '@/lib/supabase';

const DAILY_LIMIT = 10;
const DEMO_DURATION_MS = 30 * 60 * 1000;

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

function getDefaultMetadata(): UserMetadata {
  return {
    usage: { count: 0, lastReset: getTodayDateString() },
    isPro: false,
    proDemoUsed: false,
    proDemoActive: false,
    proDemoStartTime: null,
  };
}

export function useUsage() {
  const { user } = useAuth();
  const [metadata, setMetadata] = useState<UserMetadata>(getDefaultMetadata());
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMetadata = useCallback(async () => {
    let isMounted = true;
    
    if (!user) {
      setMetadata(getDefaultMetadata());
      setLoading(false);
      return () => { isMounted = false; };
    }

    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !isMounted) return;

      const rawMeta = data.user?.user_metadata || {};
      const today = getTodayDateString();
      const usage = rawMeta.usage || { count: 0, lastReset: today };
      
      if (usage.lastReset !== today) {
        usage.count = 0;
        usage.lastReset = today;
      }

      const newMeta: UserMetadata = {
        usage,
        isPro: rawMeta.isPro || false,
        proDemoUsed: rawMeta.proDemoUsed || false,
        proDemoActive: rawMeta.proDemoActive || false,
        proDemoStartTime: rawMeta.proDemoStartTime || null,
      };

      if (newMeta.proDemoActive && newMeta.proDemoStartTime) {
        const elapsed = Date.now() - newMeta.proDemoStartTime;
        if (elapsed >= DEMO_DURATION_MS) {
          newMeta.proDemoActive = false;
          newMeta.proDemoUsed = true;
          await supabase.auth.updateUser({ data: newMeta });
        }
      }

      if (isMounted) {
        setMetadata(newMeta);
        setLoading(false);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error loading metadata:', err);
      }
    }

    return () => { isMounted = false; };
  }, [user]);

  useEffect(() => {
    const cleanup = loadMetadata();
    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
  }, [loadMetadata]);

  useEffect(() => {
    if (!metadata.proDemoActive || !metadata.proDemoStartTime) {
      setTimeLeft(null);
      return;
    }

    const updateTimeLeft = () => {
      const elapsed = Date.now() - metadata.proDemoStartTime!;
      const remaining = DEMO_DURATION_MS - elapsed;
      
      if (remaining <= 0) {
        setTimeLeft(0);
        loadMetadata();
      } else {
        setTimeLeft(remaining);
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [metadata.proDemoActive, metadata.proDemoStartTime, loadMetadata]);

  const incrementUsage = useCallback(async () => {
    if (!user) return;
    
    const newCount = metadata.usage.count + 1;
    const newMeta = {
      ...metadata,
      usage: { ...metadata.usage, count: newCount },
    };
    
    await supabase.auth.updateUser({ data: newMeta });
    setMetadata(newMeta);
  }, [user, metadata]);

  const startDemo = useCallback(async () => {
    if (!user || metadata.proDemoUsed || metadata.isPro) return false;
    
    const newMeta: UserMetadata = {
      ...metadata,
      proDemoActive: true,
      proDemoStartTime: Date.now(),
    };
    
    await supabase.auth.updateUser({ data: newMeta });
    setMetadata(newMeta);
    return true;
  }, [user, metadata]);

  const togglePro = useCallback(async () => {
    if (!user) return;
    
    const newMeta = { ...metadata, isPro: !metadata.isPro };
    await supabase.auth.updateUser({ data: newMeta });
    setMetadata(newMeta);
  }, [user, metadata]);

  const formatTimeLeft = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const isPro = metadata.isPro || metadata.proDemoActive;
  const remaining = isPro ? Infinity : DAILY_LIMIT - metadata.usage.count;
  const isLimitReached = !isPro && metadata.usage.count >= DAILY_LIMIT;

  return {
    usage: metadata.usage,
    isPro: metadata.isPro,
    proDemoUsed: metadata.proDemoUsed,
    proDemoActive: metadata.proDemoActive,
    timeLeft,
    timeLeftFormatted: timeLeft !== null ? formatTimeLeft(timeLeft) : null,
    limit: DAILY_LIMIT,
    remaining: Math.max(0, remaining),
    isLimitReached,
    loading,
    incrementUsage,
    startDemo,
    togglePro,
    refresh: loadMetadata,
  };
}
