import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const connectionId = searchParams.get('connectionId');
  const providerConfigKey = searchParams.get('provider_config_key');

  if (!connectionId || !providerConfigKey) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    console.log('[API] Fetching access token for:', { connectionId, providerConfigKey });
    
    const response = await fetch(
      `https://api.nango.dev/connection/${connectionId}?provider_config_key=${providerConfigKey}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.NANGO_SECRET_KEY}`,
        },
      }
    );

    if (!response.ok) {
      console.error('[API] Nango responded with status:', response.status);
      const errorText = await response.text();
      console.error('[API] Error details:', errorText);
      throw new Error(`Nango API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('[API] Nango response:', JSON.stringify(data, null, 2));
    
    // Return just the necessary data
    return NextResponse.json({
      access_token: data.credentials?.access_token,
      connection_id: data.connection_id,
      provider: data.provider
    });
  } catch (error) {
    console.error('[API] Error fetching access token:', error);
    return NextResponse.json(
      { error: 'Failed to fetch access token' },
      { status: 500 }
    );
  }
}
