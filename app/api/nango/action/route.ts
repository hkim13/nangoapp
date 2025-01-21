export async function POST(request: Request) {
  try {
    const { provider_config_key, connection_id, fileId } = await request.json();

    const response = await fetch('https://api.nango.dev/action/trigger', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NANGO_SECRET_KEY}`,
        'Connection-Id': connection_id,
        'Provider-Config-Key': provider_config_key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action_name: 'fetch-document',
        input: {
          id: fileId
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to trigger action: ${response.statusText}`);
    }

    const result = await response.json();
    return Response.json({ success: true, result });
  } catch (error) {
    console.error('Action error:', error);
    return Response.json({ 
      error: 'Failed to trigger action', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
