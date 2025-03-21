import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    const { target, payload } = requestData;

    // Determine which webhook URL to use based on the target
    let webhookUrl;
    if (target === 'google-drive') {
      webhookUrl = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_WEBHOOK_URL;
    } else {
      webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
    }

    if (!webhookUrl) {
      console.error(`Webhook URL for target "${target}" is not defined in environment variables`);
      return NextResponse.json(
        { error: `Missing webhook configuration for ${target}` },
        { status: 500 }
      );
    }

    console.log(`Proxying request to ${target} webhook:`, webhookUrl);
    
    // Forward the request to n8n
    const n8nResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error(`Error from n8n: ${n8nResponse.status}`, errorText);
      throw new Error(`n8n responded with ${n8nResponse.status}: ${errorText}`);
    }
    
    // Try to parse the response as JSON, but don't fail if it's not JSON
    const responseData = await n8nResponse.json().catch(() => ({ message: 'Success (no JSON response)' }));
    
    return NextResponse.json({
      success: true,
      status: n8nResponse.status,
      data: responseData
    });
  } catch (error) {
    console.error('Error forwarding request to n8n:', error);
    return NextResponse.json(
      { 
        error: 'Failed to forward request to n8n',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 