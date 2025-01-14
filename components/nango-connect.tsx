'use client';

import { useEffect, useState } from 'react';
import Nango from '@nangohq/frontend';
import { Button } from '@/components/ui/button';

export type IntegrationType = 'airtable' | 'quickbooks';

interface IntegrationConfig {
  id: string;
  name: string;
  buttonText: string;
}

const INTEGRATION_CONFIGS: Record<IntegrationType, IntegrationConfig> = {
  airtable: {
    id: 'airtable-gcm8',
    name: 'Airtable',
    buttonText: 'Connect Airtable'
  },
  quickbooks: {
    id: 'quickbooks',
    name: 'QuickBooks',
    buttonText: 'Connect QuickBooks'
  }
};

interface NangoConnectProps {
  integrationType: IntegrationType;
  sessionToken: string;
  userId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

type NangoAuthResult = {
  connectionId: string;
  providerConfigKey: string;
};

export function NangoConnect({ integrationType, sessionToken, userId, onSuccess, onError }: NangoConnectProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const integrationConfig = INTEGRATION_CONFIGS[integrationType];

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
      
      const result = await nango.auth(integrationConfig.id, userId);
      console.log(`${integrationConfig.name} connection successful:`, result);
      onSuccess?.();
    } catch (error) {
      console.error(`Failed to initialize ${integrationConfig.name}:`, error);
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
      {isLoading ? 'Connecting...' : integrationConfig.buttonText}
    </Button>
  );
}
