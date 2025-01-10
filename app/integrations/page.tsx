'use client';

import { useEffect, useState } from 'react';
import { NangoConnect } from '@/components/nango-connect';
import { createClient } from '@/lib/supabase';
import { Database } from '@/lib/database.types';
import { User } from '@supabase/supabase-js';

export default function IntegrationsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error fetching session:', sessionError);
        setError('Failed to authenticate');
        return;
      }

      if (!session?.user) {
        setError('Please sign in to connect integrations');
        return;
      }

      setUser(session.user);
    };

    fetchUser();
  }, []);

  const handleSuccess = () => {
    console.log('Integration connected successfully');
    // Handle successful connection (e.g., show success message, redirect)
  };

  const handleError = (error: Error) => {
    console.error('Integration connection failed:', error);
    setError(error.message || 'Failed to connect integration');
  };

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Connect Your Airtable Integration</h1>
      <NangoConnect
        sessionToken={user.id}
        userId={user.id}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
}
