import { Nango as NangoNode } from '@nangohq/node';

export async function POST(request: Request) {
  try {
    const { provider_config_key, connection_id, syncs, full_resync } = await request.json();

    const response = await fetch('https://api.nango.dev/sync/trigger', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NANGO_SECRET_KEY}`
      },
      body: JSON.stringify({
        provider_config_key,
        connection_id,
        syncs,
        full_resync
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to trigger sync: ${response.statusText}`);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Sync error:', error);
    return Response.json({ 
      error: 'Failed to trigger sync', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
} 