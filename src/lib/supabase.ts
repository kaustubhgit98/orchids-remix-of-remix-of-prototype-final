import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export interface Prompt {
  id: string;
  user_id: string;
  title: string | null;
  description: string | null;
  category: string | null;
  is_template: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface PromptVersion {
  id: string;
  prompt_id: string;
  version: number;
  content: string;
  enhanced_content: string | null;
  analysis_result: AnalysisResult | null;
  diff: string | null;
  created_at: string;
}

export interface PromptAnalytics {
  id: string;
  user_id: string;
  prompt_id: string | null;
  benchmark_score: number | null;
  mode: string | null;
  created_at: string;
}

export interface AnalysisResult {
  isMetaPrompt: boolean;
  confidence: number;
  reasons: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  enhancedPrompt?: string;
  benchmarkScore?: number;
  variants?: string[];
  breakdown?: {
    clarity: number;
    structure: number;
    ambiguity: number;
  };
  questions?: string[];
}

export interface UserMetadata {
  usage: { count: number; lastReset: string };
  isPro: boolean;
  proDemoUsed: boolean;
  proDemoActive: boolean;
  proDemoStartTime: number | null;
}
