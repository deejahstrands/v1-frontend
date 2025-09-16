interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  bytes: number;
}

interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

class CloudinaryService {
  private config: CloudinaryConfig;

  constructor(config: CloudinaryConfig) {
    this.config = config;
  }

  /**
   * Upload image to Cloudinary
   * @param file - The image file to upload
   * @param folder - Optional folder path in Cloudinary
   * @returns Promise with upload response
   */
  async uploadImage(file: File, folder?: string): Promise<CloudinaryUploadResponse> {
    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.config.uploadPreset);
      
      if (folder) {
        formData.append('folder', folder);
      }

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.config.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  }

  /**
   * Upload video to Cloudinary
   * @param file - The video file to upload
   * @param folder - Optional folder path in Cloudinary
   * @returns Promise with upload response
   */
  async uploadVideo(file: File, folder?: string): Promise<CloudinaryUploadResponse> {
    try {
      // Validate file
      if (!file.type.startsWith('video/')) {
        throw new Error('File must be a video');
      }

      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        throw new Error('File size must be less than 50MB');
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.config.uploadPreset);
      formData.append('resource_type', 'video');
      
      if (folder) {
        formData.append('folder', folder);
      }

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.config.cloudName}/video/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Cloudinary video upload error:', error);
      throw error;
    }
  }

  /**
   * Get optimized image URL with transformations
   * @param publicId - The public ID of the image
   * @param transformations - Optional transformations object
   * @returns Optimized image URL
   */
  getOptimizedUrl(publicId: string, transformations?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    crop?: 'fill' | 'scale' | 'fit' | 'thumb';
  }): string {
    let url = `https://res.cloudinary.com/${this.config.cloudName}/image/upload`;

    if (transformations) {
      const params = [];
      
      if (transformations.crop) params.push(`c_${transformations.crop}`);
      if (transformations.width) params.push(`w_${transformations.width}`);
      if (transformations.height) params.push(`h_${transformations.height}`);
      if (transformations.quality) params.push(`q_${transformations.quality}`);
      if (transformations.format) params.push(`f_${transformations.format}`);

      if (params.length > 0) {
        url += `/${params.join(',')}`;
      }
    }

    url += `/${publicId}`;
    return url;
  }
}

// Create and export default instance
const cloudinaryService = new CloudinaryService({
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
});

export default cloudinaryService;
export { CloudinaryService };
export type { CloudinaryUploadResponse, CloudinaryConfig };
