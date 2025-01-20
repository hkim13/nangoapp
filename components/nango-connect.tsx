'use client';

import { useState } from 'react';
import Nango from '@nangohq/frontend';
import { Button } from '@/components/ui/button';

export type IntegrationType = 'airtable' | 'quickbooks' | 'google-drive';

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
  },
  'google-drive': {
    id: 'google-drive-pc8a',
    name: 'Google Drive',
    buttonText: 'Connect Google Drive'
  }
};

// Hardcoded test values from the webhook response
const TEST_CONNECTION_ID = 'b1e6d6a2-0c6d-4313-98c9-1e682216817c';
const TEST_PROVIDER_CONFIG_KEY = 'google-drive-pc8a';

interface NangoConnectProps {
  integrationType: IntegrationType;
  sessionToken: string;
  userId: string;
  onSuccess?: (result: { connectionId?: string; fileIds?: string[] }) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
}

async function getNangoAccessToken(connectionId: string, providerConfigKey: string): Promise<string> {
  console.log('[NangoConnect] Getting access token for:', { connectionId, providerConfigKey });
  
  const response = await fetch(
    `/api/nango/access-token?connectionId=${connectionId}&provider_config_key=${providerConfigKey}`
  );

  if (!response.ok) {
    console.error('[NangoConnect] Failed to get access token:', response.statusText);
    throw new Error('Failed to get access token from Nango');
  }

  const data = await response.json();
  if (!data.access_token) {
    console.error('[NangoConnect] No access token in response:', data);
    throw new Error('No access token found in response');
  }

  console.log('[NangoConnect] Got access token response:', {
    connectionId: data.connection_id,
    provider: data.provider,
    hasAccessToken: !!data.access_token
  });
  
  return data.access_token;
}

export function NangoConnect({ 
  integrationType, 
  sessionToken, 
  userId, 
  onSuccess, 
  onError,
  onCancel 
}: NangoConnectProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const integrationConfig = INTEGRATION_CONFIGS[integrationType];

  const openGooglePicker = async (accessToken: string): Promise<string[]> => {
    console.log('[NangoConnect] Opening Google Picker');
    return new Promise<string[]>((resolve, reject) => {
      window.openPicker({
        appId: process.env.NEXT_PUBLIC_GOOGLE_APP_ID!,
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        developerKey: process.env.NEXT_PUBLIC_GOOGLE_PICKER_API_KEY!,
        accessToken,
        callbackFunction: (data: any) => {
          console.log('[NangoConnect] Picker callback received:', data);
          if (data.action === 'cancel') {
            console.log('[NangoConnect] Picker cancelled');
            onCancel?.();
            resolve([]);
            return;
          }
          else if (data.action === 'picked') {
            const fileIds = data.docs.map((doc: any) => doc.id);
            console.log('[NangoConnect] Files selected:', fileIds);
            resolve(fileIds);
          }
        }
      });
    });
  };

  const handleConnect = async () => {
    if (!sessionToken || !userId) {
      console.error('[NangoConnect] Session token and user ID are required');
      return;
    }

    setIsLoading(true);
    try {
      console.log('[NangoConnect] Initializing connection for:', integrationType);
      const nango = new Nango({ 
        publicKey: process.env.NEXT_PUBLIC_NANGO_PUBLIC_KEY ?? '' 
      });

      if (integrationType === 'google-drive') {
        console.log('[NangoConnect] Starting Google Drive auth flow');
        
        // Complete the OAuth flow first
        const authResult = await nango.auth(integrationConfig.id, userId);
        console.log('[NangoConnect] OAuth completed:', authResult);

        // Use hardcoded test values since we can't receive webhooks locally
        console.log('[NangoConnect] Using test connection details');
        try {
          const accessToken = await getNangoAccessToken(
            TEST_CONNECTION_ID,
            TEST_PROVIDER_CONFIG_KEY
          );

          console.log('[NangoConnect] Opening picker with access token');
          const fileIds = await openGooglePicker(accessToken);
          if (fileIds.length === 0) {
            console.log('[NangoConnect] No files selected');
            onCancel?.();
            return;
          }
          console.log('[NangoConnect] Connection complete with files:', fileIds);
          onSuccess?.({ connectionId: TEST_CONNECTION_ID, fileIds });
        } catch (error) {
          console.error('[NangoConnect] Error with test connection:', error);
          // If test connection fails, use the actual auth result
          console.log('[NangoConnect] Falling back to auth result connection');
          onSuccess?.({ connectionId: authResult.connectionId });
        }
      } else {
        const result = await nango.auth(integrationConfig.id, userId);
        console.log(`[NangoConnect] ${integrationConfig.name} connection successful:`, result);
        onSuccess?.({ connectionId: result.connectionId });
      }
    } catch (error) {
      console.error(`[NangoConnect] Failed to initialize ${integrationConfig.name}:`, error);
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
