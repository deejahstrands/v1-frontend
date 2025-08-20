import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { publicId } = await request.json();
    
    if (!publicId) {
      return NextResponse.json({ error: 'Public ID is required' }, { status: 400 });
    }

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

    // Validate required credentials
    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Missing Cloudinary credentials:', { cloudName, apiKey: !!apiKey, apiSecret: !!apiSecret });
      return NextResponse.json(
        { error: 'Cloudinary configuration incomplete. Please check environment variables.' }, 
        { status: 500 }
      );
    }

    // Generate timestamp for signature
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // Create signature string (parameters must be sorted alphabetically)
    const params = {
      api_key: apiKey,
      public_id: publicId,
      timestamp: timestamp,
    };
    
    // Sort parameters alphabetically and create signature string
    const signatureString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key as keyof typeof params]}`)
      .join('&') + apiSecret;
    
    // Generate SHA1 hash
    const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

    console.log('Attempting to delete Cloudinary image:', {
      cloudName,
      publicId,
      timestamp,
      hasSignature: !!signature
    });

    // Delete from Cloudinary using server-side API key with signature
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          public_id: publicId,
          api_key: apiKey,
          timestamp: timestamp,
          signature: signature,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary API error response:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(errorData.error?.message || `Delete failed with status ${response.status}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' }, 
      { status: 500 }
    );
  }
}
