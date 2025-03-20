import { downloadFile } from '@/utils/google-drive';

export async function POST(request: Request) {
  try {
    const { provider_config_key, connection_id, fileId } = await request.json();

    // Get access token from Nango
    const tokenResponse = await fetch('https://api.nango.dev/token', {
      headers: {
        'Authorization': `Bearer ${process.env.NANGO_SECRET_KEY}`,
        'Connection-Id': connection_id,
        'Provider-Config-Key': provider_config_key,
      },
    });

    if (!tokenResponse.ok) {
      throw new Error(`Failed to get access token: ${tokenResponse.statusText}`);
    }

    const { access_token } = await tokenResponse.json();
    
    // Download file directly from Google Drive
    const fileResult = await downloadFile(fileId, access_token);
    console.log('Received file from Google Drive:', {
      name: fileResult.name,
      mimeType: fileResult.mimeType,
      base64Length: fileResult.base64Content.length
    });
    
    // Send document content to N8N webhook if available
    if (fileResult.base64Content) {
        try {
            const n8nWebhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
            if (!n8nWebhookUrl) {
                console.error('N8N webhook URL is not defined in environment variables');
                throw new Error('Missing webhook configuration');
            }
            
            const n8nResponse = await fetch(n8nWebhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    documentContent: fileResult.base64Content,
                    fileId,
                    fileName: fileResult.name,
                    mimeType: fileResult.mimeType,
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
        console.warn('No file content found from Google Drive');
    }
    
    return Response.json({ 
      success: true,
      fileName: fileResult.name,
      mimeType: fileResult.mimeType
    });
  } catch (error) {
    console.error('Action error:', error);
    return Response.json({ 
      error: 'Failed to download file', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
