import { ExportSize } from "../App";

/**
 * Converts a File object to a base64 string.
 * @param file The file to convert.
 * @returns A promise that resolves with an object containing the base64 string and the file's MIME type.
 */
export const fileToBase64 = (file: File): Promise<{ base64: string, mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // The result from readAsDataURL is a data URL: `data:mime/type;base64,the_base_64_string`
      // We need to strip the prefix to get just the base64 part.
      const base64 = result.split(',')[1];
      if (base64) {
        resolve({ base64, mimeType: file.type });
      } else {
        reject(new Error("Failed to read base64 string from file."));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};


/**
 * Upscales an image data URL to a target size using a canvas for high-quality resizing.
 * @param dataUrl The data URL of the image to upscale.
 * @param targetSize The desired size for the longest side of the image.
 * @returns A promise that resolves with the new data URL of the upscaled image.
 */
export const upscaleImage = (dataUrl: string, targetSize: ExportSize): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const originalWidth = image.width;
      const originalHeight = image.height;
      let targetWidth: number;
      let targetHeight: number;

      const targetPixelsMap = {
        '1024': 1024,
        '2048': 2048,
        '4k': 3840,
      };

      const targetPixels = targetPixelsMap[targetSize];
      
      if (!targetPixels) {
        // If 'original' or an unknown value is passed, return the original image.
        resolve(dataUrl);
        return;
      }

      const aspectRatio = originalWidth / originalHeight;

      if (originalWidth >= originalHeight) {
        targetWidth = targetPixels;
        targetHeight = targetWidth / aspectRatio;
      } else {
        targetHeight = targetPixels;
        targetWidth = targetHeight * aspectRatio;
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return reject(new Error('Could not get canvas context for upscaling.'));
      }
      
      // Use high-quality drawing settings
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
      
      // Extract MIME type from original data URL
      const mimeType = dataUrl.substring(dataUrl.indexOf(":") + 1, dataUrl.indexOf(";"));
      resolve(canvas.toDataURL(mimeType, 0.95)); // Use high quality (0.95) for JPEG
    };
    image.onerror = (error) => reject(error);
    image.src = dataUrl;
  });
};
