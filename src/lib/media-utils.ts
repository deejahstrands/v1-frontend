/**
 * Utility functions for handling media (images and videos) in the product carousel
 */

export interface MediaItem {
  url: string;
  type: 'image' | 'video';
}

/**
 * Check if a URL is a video based on file extension
 */
export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
  const lowerUrl = url.toLowerCase();
  
  return videoExtensions.some(ext => lowerUrl.includes(ext));
}

/**
 * Check if a URL is an image based on file extension
 */
export function isImageUrl(url: string): boolean {
  if (!url) return false;
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  const lowerUrl = url.toLowerCase();
  
  return imageExtensions.some(ext => lowerUrl.includes(ext));
}

/**
 * Determine media type from URL
 */
export function getMediaType(url: string): 'image' | 'video' {
  if (isVideoUrl(url)) return 'video';
  if (isImageUrl(url)) return 'image';
  
  // Default to image if we can't determine
  return 'image';
}

/**
 * Transform gallery items to include type information
 */
export function transformGalleryItems(gallery: Array<{ url: string; type: 'image' | 'video' }>): MediaItem[] {
  return gallery.map(item => ({
    url: item.url,
    type: item.type
  }));
}

/**
 * Create media items from thumbnail and gallery
 */
export function createMediaItems(thumbnail: string, gallery: Array<{ url: string; type: 'image' | 'video' }>): MediaItem[] {
  const items: MediaItem[] = [];
  
  // Add thumbnail as image
  if (thumbnail && thumbnail.trim() !== '') {
    items.push({
      url: thumbnail,
      type: 'image'
    });
  }
  
  // Add gallery items
  if (gallery && gallery.length > 0) {
    items.push(...transformGalleryItems(gallery));
  }
  
  return items.filter(item => item.url && item.url.trim() !== '');
}
