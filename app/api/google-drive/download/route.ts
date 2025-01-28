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
    
    // Return the file data
    return Response.json({ 
      success: true,
      documentContent: fileResult.base64Content,
      fileName: fileResult.name,
      mimeType: fileResult.mimeType
    });
  } catch (error) {
    console.error('Download error:', error);
    return Response.json({ 
      error: 'Failed to download file', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
