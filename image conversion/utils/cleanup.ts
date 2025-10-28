import { unlinkSync, existsSync } from 'fs';

/**
 * Delete a temporary file
 * @param filePath - Path to the file to delete
 */
export function deleteTempFile(filePath: string): void {
  if (!filePath) return;

  try {
    if (existsSync(filePath)) {
      unlinkSync(filePath);
      console.log(`🗑️  Deleted: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Failed to delete ${filePath}:`, error);
  }
}
