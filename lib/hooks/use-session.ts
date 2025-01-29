'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  email: string;
  role: string;
}

interface Session {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const { data: { session: supaSession } } = await supabase.auth.getSession();
        
        if (!supaSession) {
          setSession(null);
          setUser(null);
          return;
        }

        // Set session data
        setSession({
          token: supaSession.access_token,
          user: {
            id: supaSession.user.id,
            email: supaSession.user.email || '',
          }
        });

        // Get user's role and additional data from your database
        const { data: userData, error: userError } = await supabase
          .from('external_users')
          .select('*')
          .eq('auth_id', supaSession.user.id)
          .single();

        if (userError) throw userError;

        setUser({
          id: userData.id,
          email: supaSession.user.email || '',
          role: userData.role
        });

      } catch (error) {
        console.error('Error loading session:', error);
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    // Initial load
    loadSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, supaSession) => {
      loadSession();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    user,
    loading,
  };
}
