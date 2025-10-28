import {pdf} from 'pdf-to-img';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';

export interface PDFImage {
  pageNumber: number;
  imagePath: string;
  imageBuffer: Buffer;
}

export class PDFProcessor {
  private tempDir: string;

  constructor() {
    this.tempDir = path.join(process.cwd(), 'temp');
    try {
      mkdirSync(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Error creating temp directory:', error);
    }
  }

  /**
   * Convert PDF to images using pdf-to-img
   * @param pdfBuffer - PDF file buffer
   * @returns Array of image buffers with metadata
   */
  async convertPDFToImages(pdfBuffer: Buffer): Promise<PDFImage[]> {
    try {
      console.log('🔄 Converting PDF to images...');
      
      // Convert PDF to images with high quality
      const document = await pdf(pdfBuffer, { 
        scale: 2.0  // Higher quality for better OCR
      });
      
      const images: PDFImage[] = [];
      let pageNumber = 1;

      // Process each page
      for await (const imageBuffer of document) {
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2, 11);
        const imagePath = path.join(
          this.tempDir,
          `page-${timestamp}-${randomId}-${pageNumber}.png`
        );

        // Save to disk
        writeFileSync(imagePath, imageBuffer);

        images.push({
          pageNumber,
          imagePath,
          imageBuffer,
        });

        console.log(`✅ Page ${pageNumber} converted`);
        pageNumber++;
      }

      console.log(`✅ Successfully converted ${images.length} pages`);
      return images;

    } catch (error: any) {
      console.error('❌ PDF conversion error:', error);
      throw new Error(`Failed to convert PDF: ${error.message}`);
    }
  }
}
