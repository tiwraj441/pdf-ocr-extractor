import { unlinkSync } from 'fs';

export interface PDFImage {
  pageNumber: number;
  imagePath: string;
  imageBuffer: Buffer;
}

/**
 * Clean up temporary image files
 * @param images - Array of PDF images to clean up
 */
export function cleanupTempFiles(images: PDFImage[]): void {
  for (const image of images) {
    try {
      unlinkSync(image.imagePath);
      console.log(`🗑️  Cleaned up ${image.imagePath}`);
    } catch (error) {
      console.error(`Failed to clean up ${image.imagePath}:`, error);
    }
  }
}

/**
 * Delete a single temporary file
 * @param filePath - Path to the file to delete
 */
export function deleteTempFile(filePath: string): void {
  try {
    unlinkSync(filePath);
    console.log(`🗑️  Cleaned up ${filePath}`);
  } catch (error) {
    console.error(`Failed to clean up ${filePath}:`, error);
  }
}
