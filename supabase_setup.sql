-- Supabase 데이터베이스 설정 SQL
-- Supabase 대시보드 > SQL Editor에서 이 스크립트를 실행하세요

-- bookings 테이블 생성
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  schedule_id INTEGER NOT NULL,
  movie_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  seats TEXT[] NOT NULL,
  user_id TEXT NOT NULL,
  movie_title TEXT,
  theater TEXT,
  time TEXT,
  total_price INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 추가 (조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_bookings_schedule_id ON bookings(schedule_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);

-- Row Level Security (RLS) 설정
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 예매 정보를 읽을 수 있도록 정책 설정
CREATE POLICY "Anyone can read bookings" ON bookings
  FOR SELECT USING (true);

-- 인증된 사용자만 예매를 생성할 수 있도록 정책 설정
CREATE POLICY "Authenticated users can insert bookings" ON bookings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 본인의 예매만 삭제할 수 있도록 정책 설정
CREATE POLICY "Users can delete own bookings" ON bookings
  FOR DELETE USING (auth.uid()::text = user_id);

