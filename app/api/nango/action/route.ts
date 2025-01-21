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
    console.log('Received Nango response, attempting to send to N8N...');
    
    // Send document content to N8N webhook if available
    if (result) {
        try {
            const n8nWebhookUrl = 'https://teezworkspace.app.n8n.cloud/webhook/f36e10c8-ffa4-4d66-b28a-c8a900236201';
            const n8nResponse = await fetch(n8nWebhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    documentContent: result,  // The result itself is the base64 content
                    fileId,
                    timestamp: new Date().toISOString(),
                    isBase64: true
                })
            });
            
            if (!n8nResponse.ok) {
                console.error('N8N webhook error:', await n8nResponse.text());
            } else {
                const n8nResult = await n8nResponse.text();
                console.log('N8N webhook response:', n8nResult);
            }
            console.log('Document content sent to N8N successfully');
        } catch (webhookError) {
            console.error('Error sending to N8N:', webhookError);
        }
    } else {
        console.warn('No response content found from Nango');
    }
    
    // Log truncated version of the response
    const truncatedResult = typeof result === 'string' ? `${result.slice(0, 10)}...` : result;
    console.log('Nango Action Response:', truncatedResult);
    
    return Response.json({ success: true, result });
  } catch (error) {
    console.error('Action error:', error);
    return Response.json({ 
      error: 'Failed to trigger action', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
