# Supabase 클라이언트 설정
# Supabase 서버와 통신하기 위한 “연결 객체(supabase 클라이언트)”를 만드는 코드

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// 환경 변수가 없어도 클라이언트는 생성하되, 실제 사용 시 에러가 발생할 수 있습니다
export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-key');

#  || '' 
# 왼쪽 값이 “없거나 거짓이면”, 오른쪽 값을 대신 써라
