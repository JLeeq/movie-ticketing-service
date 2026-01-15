import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Comment {
  id: string;
  movieId: number;
  userId: string;
  userName?: string;
  content: string;
  createdAt: string;
}

interface CommentContextType {
  comments: Comment[];
  loading: boolean;
  addComment: (movieId: number, userId: string, userName: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  getMovieComments: (movieId: number) => Comment[];
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export function CommentProvider({ children }: { children: ReactNode }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  // Supabase에서 모든 댓글 정보 불러오기
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data, error } = await supabase
          .from('comments')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching comments:', error);
          return;
        }

        if (data) {
          const formattedComments: Comment[] = data.map((item) => ({
            id: item.id,
            movieId: item.movie_id,
            userId: item.user_id,
            userName: item.user_name,
            content: item.content,
            createdAt: item.created_at,
          }));
          setComments(formattedComments);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();

    // 실시간 구독 (다른 유저의 댓글을 실시간으로 반영)
    const subscription = supabase
      .channel('comments_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'comments' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newComment: Comment = {
              id: payload.new.id,
              movieId: payload.new.movie_id,
              userId: payload.new.user_id,
              userName: payload.new.user_name,
              content: payload.new.content,
              createdAt: payload.new.created_at,
            };
            setComments((prev) => [newComment, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setComments((prev) => prev.filter((c) => c.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const addComment = useCallback(async (movieId: number, userId: string, userName: string, content: string) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          movie_id: movieId,
          user_id: userId,
          user_name: userName,
          content: content,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating comment:', error);
        throw error;
      }

      if (data) {
        const newComment: Comment = {
          id: data.id,
          movieId: data.movie_id,
          userId: data.user_id,
          userName: data.user_name,
          content: data.content,
          createdAt: data.created_at,
        };
        setComments((prev) => [newComment, ...prev]);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }, []);

  const deleteComment = useCallback(async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        console.error('Error deleting comment:', error);
        throw error;
      }

      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }, []);

  const getMovieComments = useCallback((movieId: number) => {
    return comments
      .filter((comment) => comment.movieId === movieId)
      .slice(0, 5); // 최근 5개만
  }, [comments]);

  return (
    <CommentContext.Provider value={{ comments, loading, addComment, deleteComment, getMovieComments }}>
      {children}
    </CommentContext.Provider>
  );
}

export function useComment() {
  const context = useContext(CommentContext);
  if (context === undefined) {
    throw new Error('useComment must be used within a CommentProvider');
  }
  return context;
}

