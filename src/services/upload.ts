import cloudinaryService  from './cloudinary';

class UploadService {
  /**
   * Upload multiple files and return their URLs
   */
  async uploadFiles(files: File[]): Promise<string[]> {
    const uploadPromises = files.map(file => cloudinaryService.uploadImage(file));
    const results = await Promise.all(uploadPromises);
    return results.map(result => result.secure_url);
  }

  /**
   * Upload a single file and return its URL
   */
  async uploadFile(file: File): Promise<string> {
    const result = await cloudinaryService.uploadImage(file);
    return result.secure_url;
  }
}

export const uploadService = new UploadService();
export default uploadService;
