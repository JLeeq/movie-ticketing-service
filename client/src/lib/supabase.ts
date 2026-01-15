import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// ✅ supabase는 있을 수도/없을 수도 있게
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// ✅ UI에서 보여줄 수 있는 메시지
export const supabaseConfigError =
  !supabaseUrl || !supabaseAnonKey
    ? 'Supabase 환경변수가 없습니다. Vercel(Project Settings → Environment Variables)에 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY를 설정하고 재배포하세요.'
    : null;