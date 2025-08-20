/**
 * Extract the public ID from a Cloudinary URL
 * @param url - Cloudinary URL (e.g., https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/image.jpg)
 * @returns The public ID (e.g., folder/image)
 */
export function extractPublicIdFromUrl(url: string): string | null {
  try {
    // Handle different Cloudinary URL formats
    const cloudinaryRegex = /cloudinary\.com\/[^\/]+\/image\/upload(?:\/v\d+)?\/(.+?)(?:\.[a-zA-Z]+)?$/;
    const match = url.match(cloudinaryRegex);
    
    if (match && match[1]) {
      // Remove file extension if present
      const publicId = match[1].replace(/\.[a-zA-Z]+$/, '');
      return publicId;
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
}

/**
 * Check if a URL is a Cloudinary URL
 * @param url - URL to check
 * @returns boolean indicating if it's a Cloudinary URL
 */
export function isCloudinaryUrl(url: string): boolean {
  return url.includes('cloudinary.com') && url.includes('/image/upload/');
}

/**
 * Get optimized Cloudinary URL with transformations
 * @param url - Original Cloudinary URL
 * @param transformations - Transformations to apply
 * @returns Optimized URL
 */
export function getOptimizedCloudinaryUrl(
  url: string, 
  transformations: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    crop?: 'fill' | 'scale' | 'fit' | 'thumb';
  } = {}
): string {
  if (!isCloudinaryUrl(url)) return url;
  
  try {
    // Find the position to insert transformations
    const uploadIndex = url.indexOf('/image/upload/');
    if (uploadIndex === -1) return url;
    
    const baseUrl = url.substring(0, uploadIndex + '/image/upload/'.length);
    const restOfUrl = url.substring(uploadIndex + '/image/upload/'.length);
    
    // Build transformation string
    const transformParams = [];
    if (transformations.crop) transformParams.push(`c_${transformations.crop}`);
    if (transformations.width) transformParams.push(`w_${transformations.width}`);
    if (transformations.height) transformParams.push(`h_${transformations.height}`);
    if (transformations.quality) transformParams.push(`q_${transformations.quality}`);
    if (transformations.format) transformParams.push(`f_${transformations.format}`);
    
    if (transformParams.length > 0) {
      return `${baseUrl}${transformParams.join(',')}/${restOfUrl}`;
    }
    
    return url;
  } catch (error) {
    console.error('Error optimizing Cloudinary URL:', error);
    return url;
  }
}

/**
 * Get thumbnail URL for Cloudinary image
 * @param url - Original Cloudinary URL
 * @param size - Thumbnail size (width x height)
 * @returns Thumbnail URL
 */
export function getCloudinaryThumbnail(url: string, size: { width: number; height: number }): string {
  return getOptimizedCloudinaryUrl(url, {
    width: size.width,
    height: size.height,
    crop: 'fill',
    quality: 80,
    format: 'auto'
  });
}
