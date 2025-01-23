import { downloadFile } from '@/utils/google-drive';

export async function POST(request: Request) {
  try {
    const { fileId, access_token } = await request.json();

    if (!fileId || !access_token) {
      return Response.json({ 
        error: 'Missing required parameters' 
      }, { status: 400 });
    }

    // Download file directly from Google Drive
    const fileResult = await downloadFile(fileId, access_token);
    console.log('Downloaded file:', {
      name: fileResult.name,
      mimeType: fileResult.mimeType,
      base64Length: fileResult.base64Content.length
    });
    
    // Send to N8N webhook
    try {
      const n8nWebhookUrl = 'https://teezworkspace.app.n8n.cloud/webhook/f36e10c8-ffa4-4d66-b28a-c8a900236201';
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
        throw new Error('Failed to send to N8N');
      }

      console.log('Successfully sent to N8N');
      
      return Response.json({ 
        success: true,
        fileName: fileResult.name,
        mimeType: fileResult.mimeType
      });
    } catch (error) {
      console.error('Error sending to N8N:', error);
      throw error;
    }
  } catch (error) {
    console.error('Download error:', error);
    return Response.json({ 
      error: 'Failed to process file', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
