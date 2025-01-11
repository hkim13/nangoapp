'use client';

import { useEffect, useState } from 'react';
import Nango from '@nangohq/frontend';
import { Button } from '@/components/ui/button';

interface NangoConnectProps {
  sessionToken: string;
  userId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

type NangoAuthResult = {
  connectionId: string;
  providerConfigKey: string;
};

export function NangoConnect({ sessionToken, userId, onSuccess, onError }: NangoConnectProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const AIRTABLE_INTEGRATION_ID = 'airtable-gcm8';

  const handleConnect = async () => {
    if (!sessionToken || !userId) {
      console.error('Session token and user ID are required');
      return;
    }

    setIsLoading(true);
    try {
      const nango = new Nango({ 
        publicKey: process.env.NEXT_PUBLIC_NANGO_PUBLIC_KEY ?? '' 
      });
      
      const result = await nango.auth(AIRTABLE_INTEGRATION_ID, userId);
      console.log('Airtable connection successful:', result);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to initialize Nango:', error);
      onError?.(error instanceof Error ? error : new Error('Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleConnect} 
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? 'Connecting...' : 'Connect Airtable'}
    </Button>
  );
}
