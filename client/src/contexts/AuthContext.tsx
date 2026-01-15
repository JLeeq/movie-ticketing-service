/*
로그인 기능에서 인증 Context 생성

- 전역 인증 상태 관리 (user, session, loading)
- signIn, signUp, signOut 함수 제공
*/

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, supabaseConfigError } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isSupabaseReady: boolean;
  supabaseError: string | null;

  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function requireSupabase() {
  if (!supabase) {
    throw new Error(supabaseConfigError ?? 'Supabase is not configured');
  }
  return supabase;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const isSupabaseReady = !!supabase;
  const supabaseError = supabaseConfigError ?? null;

  useEffect(() => {
    // ✅ Supabase 설정이 없으면 앱을 죽이지 말고, 인증 기능만 비활성화
    if (!supabase) {
      setSession(null);
      setUser(null);
      setLoading(false);
      return;
    }

    let isMounted = true;

    // 현재 세션 가져오기
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 인증 상태 변화 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const sb = requireSupabase();
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const sb = requireSupabase();
    const { error } = await sb.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const sb = requireSupabase();
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const sb = requireSupabase();
    const { error } = await sb.auth.signOut();
    if (error) throw error;
  };

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      isSupabaseReady,
      supabaseError,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
    }),
    [user, session, loading, isSupabaseReady, supabaseError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}