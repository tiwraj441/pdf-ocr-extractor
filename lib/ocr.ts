import { createWorker, Worker } from 'tesseract.js';

export interface OCRResult {
  pageNumber: number;
  text: string;
  confidence: number;
}

interface PDFImage {
  pageNumber: number;
  imagePath: string;
  imageBuffer: Buffer;
}

export class OCRService {
  private worker: Worker | null = null;

  /**
   * Initialize Tesseract worker (let it use default paths)
   * @param languages - Language codes (e.g., 'eng', 'eng+hin')
   */
  async initialize(languages: string = 'eng'): Promise<void> {
    try {
      console.log(`🔧 Initializing OCR worker (${languages})...`);
      
      // Don't specify custom paths - let Tesseract use its defaults
      this.worker = await createWorker(languages, 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${(m.progress * 100).toFixed(0)}%`);
          }
        }
      });
      
      console.log('✅ OCR worker ready!');
    } catch (error: any) {
      console.error('❌ OCR initialization failed:', error);
      throw new Error(`Failed to initialize OCR: ${error.message}`);
    }
  }

  async extractText(images: PDFImage[]): Promise<OCRResult[]> {
    if (!this.worker) {
      throw new Error('OCR worker not initialized');
    }

    const results: OCRResult[] = [];

    for (const image of images) {
      try {
        console.log(`📝 Processing page ${image.pageNumber}...`);

        // Use image buffer
        const { data } = await this.worker.recognize(image.imageBuffer);

        results.push({
          pageNumber: image.pageNumber,
          text: data.text.trim(),
          confidence: data.confidence,
        });

        console.log(`✅ Page ${image.pageNumber} - Confidence: ${data.confidence.toFixed(1)}%`);
      } catch (error: any) {
        console.error(`❌ OCR failed on page ${image.pageNumber}:`, error);
        results.push({
          pageNumber: image.pageNumber,
          text: '',
          confidence: 0,
        });
      }
    }

    return results;
  }

  async terminate(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
      console.log('✅ OCR worker terminated');
    }
  }
}
