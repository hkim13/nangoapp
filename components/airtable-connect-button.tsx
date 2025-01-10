import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Nango } from '@nangohq/frontend';

interface AirtableConnectButtonProps {
  sessionToken: string;
}

export function AirtableConnectButton({ sessionToken }: AirtableConnectButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const nango = new Nango({ publicKey: process.env.NEXT_PUBLIC_NANGO_PUBLIC_KEY! });
      
      await nango.auth('airtable-qjri', {
        sessionToken,
        onSuccess: () => {
          console.log('Successfully connected to Airtable');
          // TODO: Add success notification
        },
        onError: (error) => {
          console.error('Error connecting to Airtable:', error);
          // TODO: Add error notification
        },
      });
    } catch (error) {
      console.error('Error initializing Nango:', error);
      // TODO: Add error notification
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      variant="outline"
    >
      {isConnecting ? 'Connecting...' : 'Connect Airtable'}
    </Button>
  );
}
