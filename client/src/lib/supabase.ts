// Supabase 클라이언트 설정
// Supabase 서버와 통신하기 위한 연결 객체를 안전하게 생성합니다.

import { createClient } from '@supabase/supabase-js';

// Vite 환경변수 (빌드 타임 주입)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// ❗ placeholder 사용 금지
// ❗ env가 없을 때 조용히 잘못된 URL로 가지 않도록 "조건부 생성"
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// 앱에서 표시할 수 있는 설정 에러 메시지
export const supabaseConfigError =
  !supabaseUrl || !supabaseAnonKey
    ? 'Missing Supabase env vars: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel (Project Settings → Environment Variables), then redeploy.'
    : null;