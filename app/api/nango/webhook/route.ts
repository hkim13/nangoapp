import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('[NangoWebhook] Received webhook request');
  
  try {
    const webhookData = await request.json();
    console.log('[NangoWebhook] Webhook data:', webhookData);

    // Handle different webhook events
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[NangoWebhook] Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
