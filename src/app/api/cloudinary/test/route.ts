import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get Cloudinary credentials from environment variables
    let cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    let apiKey = process.env.CLOUDINARY_API_KEY;
    let apiSecret = process.env.CLOUDINARY_API_SECRET;

    // Alternative: Parse from CLOUDINARY_URL if available
    if (process.env.CLOUDINARY_URL) {
      try {
        const url = new URL(process.env.CLOUDINARY_URL);
        cloudName = url.hostname;
        const auth = url.username.split(':');
        if (auth.length === 2) {
          apiKey = auth[0];
          apiSecret = auth[1];
        }
      } catch (error) {
        console.warn('Failed to parse CLOUDINARY_URL:', error);
      }
    }

    // Check frontend variables
    const frontendCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    return NextResponse.json({
      status: 'Cloudinary Configuration Check',
      frontend: {
        cloudName: frontendCloudName,
        uploadPreset: uploadPreset,
        configured: !!(frontendCloudName && uploadPreset)
      },
      backend: {
        cloudName: cloudName,
        apiKeyConfigured: !!apiKey,
        apiSecretConfigured: !!apiSecret,
        configured: !!(cloudName && apiKey && apiSecret)
      },
      cloudinaryUrl: process.env.CLOUDINARY_URL ? 'Configured' : 'Not configured',
      ready: !!(frontendCloudName && uploadPreset && cloudName && apiKey && apiSecret)
    });
  } catch (error) {
    console.error('Cloudinary test error:', error);
    return NextResponse.json(
      { error: 'Configuration check failed' }, 
      { status: 500 }
    );
  }
}
