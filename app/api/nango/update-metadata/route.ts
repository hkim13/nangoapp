import { Nango as NangoNode } from '@nangohq/node';

export async function POST(request: Request) {
  const { connectionId, fileIds } = await request.json();

  const nango = new NangoNode({
    secretKey: process.env.NANGO_SECRET_KEY!
  });

  try {
    
    await nango.setMetadata('google-drive-pc8a', connectionId, {
      files: fileIds
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Failed to update metadata' }, { status: 500 });
  }
} 