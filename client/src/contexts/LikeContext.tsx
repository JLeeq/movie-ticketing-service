import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { requireSupabase } from '../lib/requireSupabase';

export interface Like {
  id: string;
  movieId: number;
  userId: string;
}

interface LikeContextType {
  likes: Like[];
  loading: boolean;
  toggleLike: (movieId: number, userId: string) => Promise<void>;
  getLikeCount: (movieId: number) => number;
  isLiked: (movieId: number, userId: string) => boolean;
  getUserLikes: (userId: string) => Like[];
}

const LikeContext = createContext<LikeContextType | undefined>(undefined);

export function LikeProvider({ children }: { children: ReactNode }) {
  const [likes, setLikes] = useState<Like[]>([]);
  const [loading, setLoading] = useState(true);

  // Supabase에서 모든 좋아요 정보 불러오기
  useEffect(() => {
    // Supabase가 설정되지 않았으면 early return
    if (!supabase) {
      setLoading(false);
      return;
    }

    const fetchLikes = async () => {
      try {
        const { data, error } = await supabase
          .from('likes')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching likes:', error);
          return;
        }

        if (data) {
          const formattedLikes: Like[] = data.map((item) => ({
            id: item.id,
            movieId: item.movie_id,
            userId: item.user_id,
          }));
          setLikes(formattedLikes);
        }
      } catch (error) {
        console.error('Error fetching likes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();

    // 실시간 구독 (다른 유저의 좋아요를 실시간으로 반영)
    const subscription = supabase
      .channel('likes_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'likes' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newLike: Like = {
              id: payload.new.id,
              movieId: payload.new.movie_id,
              userId: payload.new.user_id,
            };
            setLikes((prev) => [...prev, newLike]);
          } else if (payload.eventType === 'DELETE') {
            setLikes((prev) => prev.filter((l) => l.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const toggleLike = useCallback(async (movieId: number, userId: string) => {
    try {
      const sb = requireSupabase();
      // 이미 좋아요했는지 확인
      const existingLike = likes.find(
        (like) => like.movieId === movieId && like.userId === userId
      );

      if (existingLike) {
        // 좋아요 취소
        const { error } = await sb
          .from('likes')
          .delete()
          .eq('id', existingLike.id);

        if (error) {
          console.error('Error deleting like:', error);
          throw error;
        }

        setLikes((prev) => prev.filter((l) => l.id !== existingLike.id));
      } else {
        // 좋아요 추가
        const { data, error } = await sb
          .from('likes')
          .insert({
            movie_id: movieId,
            user_id: userId,
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating like:', error);
          throw error;
        }

        if (data) {
          const newLike: Like = {
            id: data.id,
            movieId: data.movie_id,
            userId: data.user_id,
          };
          setLikes((prev) => [...prev, newLike]);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  }, [likes]);

  const getLikeCount = useCallback((movieId: number) => {
    return likes.filter((like) => like.movieId === movieId).length;
  }, [likes]);

  const isLiked = useCallback((movieId: number, userId: string) => {
    return likes.some((like) => like.movieId === movieId && like.userId === userId);
  }, [likes]);

  const getUserLikes = useCallback((userId: string) => {
    return likes.filter((like) => like.userId === userId);
  }, [likes]);

  return (
    <LikeContext.Provider value={{ likes, loading, toggleLike, getLikeCount, isLiked, getUserLikes }}>
      {children}
    </LikeContext.Provider>
  );
}

export function useLike() {
  const context = useContext(LikeContext);
  if (context === undefined) {
    throw new Error('useLike must be used within a LikeProvider');
  }
  return context;
}


