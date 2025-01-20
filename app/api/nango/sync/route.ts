import { Nango as NangoNode } from '@nangohq/node';

export async function POST(request: Request) {
  const nango = new NangoNode({
    secretKey: process.env.NANGO_SECRET_KEY!
  });

  try {
    const { provider_config_key, connection_id, syncs, full_resync } = await request.json();

    // Call triggerSync with the correct format
    await nango.triggerSync(
      provider_config_key, 
      connection_id, 
      syncs, 
      full_resync
    );

    return Response.json({ success: true });
  } catch (error) {
    console.error('Sync error:', error); // Add error logging
    return Response.json({ 
      error: 'Failed to trigger sync', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
} 