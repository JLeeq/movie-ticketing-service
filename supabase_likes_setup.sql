-- 좋아요 기능을 위한 Supabase 테이블 설정
-- Supabase 대시보드 > SQL Editor에서 이 스크립트를 실행하세요

-- likes 테이블 생성
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  movie_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(movie_id, user_id) -- 한 사용자가 같은 영화를 중복 좋아요할 수 없도록
);

-- 인덱스 추가 (조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_likes_movie_id ON likes(movie_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);

-- Row Level Security (RLS) 설정
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 좋아요 수를 읽을 수 있도록 정책 설정
CREATE POLICY "Anyone can read likes" ON likes
  FOR SELECT USING (true);

-- 인증된 사용자만 좋아요를 생성할 수 있도록 정책 설정
CREATE POLICY "Authenticated users can insert likes" ON likes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 본인의 좋아요만 삭제할 수 있도록 정책 설정
CREATE POLICY "Users can delete own likes" ON likes
  FOR DELETE USING (auth.uid()::text = user_id);

