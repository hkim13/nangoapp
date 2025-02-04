'use client';

import { useState } from 'react';
import Nango from '@nangohq/frontend';
import { Nango as NangoNode } from '@nangohq/node';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Check } from 'lucide-react';

// Add type definitions for Google Picker data
interface GooglePickerDocument {
  id: string;
  name: string;
  mimeType: string;
  [key: string]: any;
}

interface GooglePickerResponse {
  action: string;
  docs?: GooglePickerDocument[];
}

declare global {
  interface Window {
    openPicker: (config: {
      appId: string;
      clientId: string;
      developerKey: string;
      accessToken: string;
      callbackFunction: (data: GooglePickerResponse) => void;
    }) => void;
  }
}

export type IntegrationType = 'airtable' | 'quickbooks' | 'google-drive' | 'slack';

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
  },
  slack: {
    id: 'slack',
    name: 'Slack',
    buttonText: 'Connect Slack'
  }
};

interface NangoConnectProps {
  integrationType: IntegrationType;
  sessionToken: string;
  userId: string;
  onSuccess?: (result: { connectionId?: string; fileIds?: string[] }) => void;
  connectionId?: string;
  fileIds?: string[];
  onError?: (error: Error) => void;
  onCancel?: () => void;
  isConnected?: boolean;
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
// testing
export function NangoConnect({ 
  integrationType, 
  sessionToken, 
  userId, 
  onSuccess, 
  onError,
  onCancel,
  isConnected = false
}: NangoConnectProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const integrationConfig = INTEGRATION_CONFIGS[integrationType];

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

        // Use values from authResult instead of hardcoded test values
        console.log('[NangoConnect] Using connection details from auth result');
        try {
          const accessToken = await getNangoAccessToken(
            authResult.connectionId,
            authResult.providerConfigKey
          );

          console.log('[NangoConnect] Opening picker with access token');
          // Define the picker function here where it has access to authResult
          const openGooglePicker = async (accessToken: string): Promise<string[]> => {
            console.log('[NangoConnect] Opening Google Picker');
            return new Promise<string[]>((resolve, reject) => {
              window.openPicker({
                appId: process.env.NEXT_PUBLIC_GOOGLE_APP_ID!,
                clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
                developerKey: process.env.NEXT_PUBLIC_GOOGLE_PICKER_API_KEY!,
                accessToken,
                callbackFunction: async (data: GooglePickerResponse) => {
                  console.log('[NangoConnect] Picker callback received:', data);
                  if (data.action === 'cancel') {
                    console.log('[NangoConnect] Picker cancelled');
                    onCancel?.();
                    resolve([]);
                    return;
                  }
                  else if (data.action === 'picked' && data.docs) {
                    const fileIds = data.docs.map(doc => doc.id);
                    console.log('[NangoConnect] Files selected:', fileIds);
                    
                    // Get access token for the connection
                    const tokenResponse = await fetch(
                      `/api/nango/access-token?connectionId=${authResult.connectionId}&provider_config_key=${authResult.providerConfigKey}`
                    );
                    
                    if (!tokenResponse.ok) {
                      throw new Error('Failed to get access token');
                    }
                    
                    const { access_token } = await tokenResponse.json();
                    
                    try {
                      // Download all files in parallel
                      const processedFiles = await Promise.all(
                        fileIds.map(async fileId => {
                          try {
                            const response = await fetch('/api/google-drive/download', {
                              method: 'POST',
                              headers: { 
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                fileId,
                                access_token
                              })
                            });

                            if (!response.ok) {
                              console.error(`Failed to download file ${fileId}:`, await response.text());
                              return null;
                            }

                            const result = await response.json();
                            console.log(`Successfully downloaded file ${fileId}`);
                            return {
                              documentContent: result.documentContent,
                              fileId: fileId,
                              fileName: result.fileName,
                              mimeType: result.mimeType,
                              timestamp: new Date().toISOString(),
                              isBase64: true
                            };
                          } catch (error) {
                            console.error(`Error downloading file ${fileId}:`, error);
                            return null;
                          }
                        })
                      );

                      // Filter out any failed downloads
                      const successfulFiles = processedFiles.filter((file): file is NonNullable<typeof file> => file !== null);

                      if (successfulFiles.length > 0) {
                        // Send all files together to N8N in a single webhook
                        const n8nWebhookUrl = 'https://teezworkspace.app.n8n.cloud/webhook/f36e10c8-ffa4-4d66-b28a-c8a900236201';
                        const n8nResponse = await fetch(n8nWebhookUrl, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            files: successfulFiles,
                            batchTimestamp: new Date().toISOString(),
                            totalFiles: successfulFiles.length
                          })
                        });

                        if (!n8nResponse.ok) {
                          throw new Error('Failed to send files to N8N');
                        }

                        console.log('[NangoConnect] Successfully sent all files to N8N:', {
                          totalFiles: successfulFiles.length,
                          fileNames: successfulFiles.map(f => f.fileName)
                        });
                      }

                      console.log('[NangoConnect] All files processed');
                      onSuccess?.({ connectionId: authResult.connectionId, fileIds });
                    } catch (error) {
                      console.error('[NangoConnect] Error processing files:', error);
                      onError?.(error instanceof Error ? error : new Error('Failed to process files'));
                    }
                  }
                }
              });
            });
          };

          const fileIds = await openGooglePicker(accessToken);
          if (fileIds.length === 0) {
            console.log('[NangoConnect] No files selected');
            onCancel?.();
            return;
          }
          console.log('[NangoConnect] Connection complete with files:', fileIds);
          onSuccess?.({ connectionId: authResult.connectionId, fileIds });
        } catch (error) {
          console.log('[NangoConnect] Error getting webhook data, using auth result:', error);
          // Use the connection info from the auth result as fallback
          const connectionInfo = {
            connectionId: authResult.connectionId,
            providerConfigKey: integrationConfig.id
          };
        }
      } else {
        const result = await nango.auth(integrationConfig.id, userId);
        console.log(`[NangoConnect] ${integrationConfig.name} connection successful:`, result);
        onSuccess?.({ connectionId: result.connectionId });
      }
    } catch (error) {
      console.error('[NangoConnect] Error:', error);
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          className="flex-1 bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700"
          disabled
        >
          <Check className="w-4 h-4 mr-2" />
          Connected
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleConnect}>
              Reconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      className="w-full bg-black hover:bg-gray-900 text-white"
      disabled={isLoading}
    >
      {isLoading ? 'Connecting...' : integrationConfig.buttonText}
    </Button>
  );
}
