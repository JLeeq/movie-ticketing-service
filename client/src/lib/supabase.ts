// Supabase 클라이언트 설정
//  Supabase 서버와 통신하기 위한 "연결 객체(supabase 클라이언트)"를 만드는 코드

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 환경 변수가 없으면 에러를 명확히 표시
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Supabase environment variables are not set!');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
  console.error('For Vercel: Go to Project Settings → Environment Variables');
}

// 환경 변수가 없어도 클라이언트는 생성하되, 실제 사용 시 에러가 발생할 수 있습니다
// 프로덕션 환경에서는 반드시 환경 변수가 설정되어야 합니다
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);