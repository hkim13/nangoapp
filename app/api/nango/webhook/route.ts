import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory storage for the latest connection
let latestConnection: {
  connectionId: string;
  providerConfigKey: string;
  timestamp: number;
} | null = null;

export async function POST(request: NextRequest) {
  console.log('[NangoWebhook] Received webhook request');
  
  try {
    const webhookData = await request.json();
    console.log('[NangoWebhook] Webhook data:', webhookData);

    // Handle auth event
    if (webhookData.type === 'auth' && webhookData.success) {
      latestConnection = {
        connectionId: webhookData.connectionId,
        providerConfigKey: webhookData.providerConfigKey,
        timestamp: Date.now()
      };
      console.log('[NangoWebhook] Stored new connection:', latestConnection);
    }
    // Handle other webhook events
    else {
      switch (webhookData.type) {
        case 'CONNECTION_CREATED':
          console.log('[NangoWebhook] New connection created:', {
            connectionId: webhookData.connection_id,
            provider: webhookData.provider
          });
          break;
        case 'CONNECTION_DELETED':
          console.log('[NangoWebhook] Connection deleted:', {
            connectionId: webhookData.connection_id,
            provider: webhookData.provider
          });
          break;
        case 'CONNECTION_UPDATED':
          console.log('[NangoWebhook] Connection updated:', {
            connectionId: webhookData.connection_id,
            provider: webhookData.provider
          });
          break;
        default:
          console.log('[NangoWebhook] Unhandled webhook type:', webhookData.type);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[NangoWebhook] Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

export async function GET() {
  if (!latestConnection) {
    return NextResponse.json(
      { error: 'No connection information available' },
      { status: 404 }
    );
  }
  return NextResponse.json(latestConnection);
}
