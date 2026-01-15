import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase, supabaseConfigError } from './supabase';

export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(supabaseConfigError ?? 'Supabase is not configured');
  }
  return supabase;
}