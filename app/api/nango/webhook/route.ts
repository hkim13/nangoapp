import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import crypto from 'crypto';

// In-memory storage for the latest connection
let latestConnection: {
  connectionId: string;
  providerConfigKey: string;
  timestamp: number;
} | null = null;

function verifyNangoSignature(signature: string, body: string): boolean {
  const secret = process.env.NANGO_SECRET_KEY;
  if (!secret) {
    console.error('[NangoWebhook] NANGO_SECRET_KEY is not set in environment variables');
    return false;
  }

  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(computedSignature)
  );
}

export async function POST(request: NextRequest) {
  console.log('[NangoWebhook] Received webhook request');
  
  try {
    // Get the signature from headers
    const signature = request.headers.get('x-nango-signature');
    if (!signature) {
      console.error('[NangoWebhook] No signature found in request headers');
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 401 }
      );
    }

    // Get the raw body as text for signature verification
    const rawBody = await request.text();
    
    // Verify the signature
    if (!verifyNangoSignature(signature, rawBody)) {
      console.error('[NangoWebhook] Invalid signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse the body after verification
    const webhookData = JSON.parse(rawBody);
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
