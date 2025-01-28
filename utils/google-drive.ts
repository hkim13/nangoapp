import { google } from 'googleapis';

// Map of Google Workspace MIME types to export formats
const GOOGLE_MIME_TYPE_MAPPINGS: Record<string, string> = {
  'application/vnd.google-apps.document': 'application/pdf',
  'application/vnd.google-apps.spreadsheet': 'application/pdf',
  'application/vnd.google-apps.presentation': 'application/pdf',
  'application/vnd.google-apps.drawing': 'application/pdf'
};

/**
 * Downloads a file from Google Drive using an access token and returns it as a base64 string
 * @param {string} fileId - The ID of the file to download
 * @param {string} accessToken - OAuth2 access token from Nango
 * @returns {Promise<{base64Content: string, mimeType: string, name: string}>} The file data as base64 and metadata
 */
export async function downloadFile(fileId: string, accessToken: string) {
  // Create an OAuth2 client with the access token
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  // Initialize the Drive API client
  const drive = google.drive({ version: 'v3', auth });

  try {
    // First get file metadata
    const metadata = await drive.files.get({
      fileId: fileId,
      fields: 'id, name, mimeType, size'
    });

    if (!metadata.data || !metadata.data.mimeType || !metadata.data.name) {
      throw new Error('Invalid file metadata received from Google Drive');
    }

    console.log('File metadata:', {
      name: metadata.data.name,
      mimeType: metadata.data.mimeType,
      size: metadata.data.size
    });

    let response;
    const isGoogleWorkspaceFile = metadata.data.mimeType.startsWith('application/vnd.google-apps.');
    const mimeType = metadata.data.mimeType as keyof typeof GOOGLE_MIME_TYPE_MAPPINGS;

    if (isGoogleWorkspaceFile) {
      // For Google Workspace files, we need to use the export API
      const exportMimeType = GOOGLE_MIME_TYPE_MAPPINGS[mimeType] || 'application/pdf';
      console.log('Exporting Google Workspace file as:', exportMimeType);
      
      response = await drive.files.export({
        fileId: fileId,
        mimeType: exportMimeType
      }, {
        responseType: 'arraybuffer'
      });
    } else {
      // For regular files, use direct download
      console.log('Downloading regular file...');
      response = await drive.files.get({
        fileId: fileId,
        alt: 'media',
      }, {
        responseType: 'arraybuffer'
      });
    }

    // Convert the array buffer to base64
    let base64Content: string;
    if (response.data) {
      console.log('Received file content, type:', typeof response.data);
      console.log('Content length:', (response.data as ArrayBuffer).byteLength);
      
      // Handle array buffer response
      base64Content = Buffer.from(response.data as ArrayBuffer).toString('base64');
      console.log('Successfully converted to base64, length:', base64Content.length);
    } else {
      console.error('No data in response:', response);
      throw new Error('No data received from Google Drive');
    }

    // For Google Workspace files, we'll return the export mime type
    const finalMimeType = isGoogleWorkspaceFile 
      ? GOOGLE_MIME_TYPE_MAPPINGS[mimeType]
      : metadata.data.mimeType;

    return {
      base64Content,
      mimeType: finalMimeType,
      name: metadata.data.name + (isGoogleWorkspaceFile ? '.pdf' : '')
    };
  } catch (error: unknown) {
    // Type guard for error object
    if (error && typeof error === 'object' && 'message' in error) {
      console.error('Error downloading file:', {
        message: (error as { message: string }).message,
        status: (error as any).response?.status,
        statusText: (error as any).response?.statusText,
        data: (error as any).response?.data
      });
    } else {
      console.error('Unknown error downloading file:', error);
    }
    throw error;
  }
}
