// // import { NextRequest, NextResponse } from 'next/server';
// // import pdfParse from 'pdf-parse';

// // const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// // export async function POST(request: NextRequest) {
// //   try {
// //     console.log('📥 API called');
    
// //     const formData = await request.formData();
// //     const file = formData.get('file') as File;
    
// //     if (!file) {
// //       return NextResponse.json(
// //         { success: false, error: 'No file provided' },
// //         { status: 400 }
// //       );
// //     }

// //     if (file.type !== 'application/pdf') {
// //       return NextResponse.json(
// //         { success: false, error: 'File must be PDF' },
// //         { status: 400 }
// //       );
// //     }

// //     if (file.size > MAX_FILE_SIZE) {
// //       return NextResponse.json(
// //         { success: false, error: 'File too large (max 10MB)' },
// //         { status: 400 }
// //       );
// //     }

// //     console.log(`📄 File: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`);

// //     const arrayBuffer = await file.arrayBuffer();
// //     const buffer = Buffer.from(arrayBuffer);

// //     console.log('📄 Extracting text...');
// //     const data = await pdfParse(buffer);
    
// //     console.log(`✅ Success! Extracted ${data.numpages} pages`);

// //     return NextResponse.json({
// //       success: true,
// //       text: data.text,
// //       metadata: {
// //         fileName: file.name,
// //         totalPages: data.numpages,
// //         fileSize: file.size,
// //       },
// //     });

// //   } catch (error: any) {
// //     console.error('❌ Error:', error);
// //     return NextResponse.json(
// //       { success: false, error: error.message },
// //       { status: 500 }
// //     );
// //   }
// // }


// import { NextRequest, NextResponse } from 'next/server';
// import pdfParse from 'pdf-parse';

// const MAX_FILE_SIZE = 10 * 1024 * 1024;

// // Try pdf-parse first, then suggest cloud OCR if it fails
// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData();
//     const file = formData.get('file') as File;
    
//     if (!file || file.type !== 'application/pdf') {
//       return NextResponse.json(
//         { success: false, error: 'Invalid file' },
//         { status: 400 }
//       );
//     }

//     console.log(`📄 Processing: ${file.name}`);

//     const arrayBuffer = await file.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     // Try pdf-parse first
//     console.log('📄 Attempting text extraction...');
//     const data = await pdfParse(buffer);
    
//     // Check if we got meaningful text
//     const extractedText = data.text.trim();
    
//     if (extractedText.length < 10) {
//       // Likely a scanned PDF - needs OCR
//       return NextResponse.json({
//         success: false,
//         error: 'This appears to be a scanned PDF (image-based). OCR is required.',
//         isScanned: true,
//         suggestion: 'Use Google Vision API, AWS Textract, or Azure Computer Vision for scanned documents.',
//         metadata: {
//           fileName: file.name,
//           totalPages: data.numpages,
//           fileSize: file.size,
//         },
//       }, { status: 422 });
//     }

//     console.log(`✅ Extracted text from ${data.numpages} pages`);

//     return NextResponse.json({
//       success: true,
//       text: extractedText,
//       metadata: {
//         fileName: file.name,
//         totalPages: data.numpages,
//         fileSize: file.size,
//       },
//     });

//   } catch (error: any) {
//     console.error('❌ Error:', error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }



import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file || file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: 'Invalid file' },
        { status: 400 }
      );
    }

    console.log(`📄 Processing: ${file.name}`);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Try pdf-parse first (for digital PDFs)
    console.log('📄 Attempting text extraction...');
    const data = await pdfParse(buffer);
    const extractedText = data.text.trim();
    
    // Check if we got meaningful text
    if (extractedText.length > 50) {
      // Digital PDF with embedded text
      console.log(`✅ Extracted text from ${data.numpages} pages`);
      return NextResponse.json({
        success: true,
        text: extractedText,
        method: 'Direct extraction',
        metadata: {
          fileName: file.name,
          totalPages: data.numpages,
          fileSize: file.size,
        },
      });
    }

    // Scanned PDF - Use OCR.space API (free tier)
    console.log('📸 Scanned PDF detected, using OCR...');
    
    const ocrFormData = new FormData();
    ocrFormData.append('file', file);
    ocrFormData.append('language', 'eng');
    ocrFormData.append('isOverlayRequired', 'false');
    ocrFormData.append('detectOrientation', 'true');
    ocrFormData.append('scale', 'true');
    ocrFormData.append('OCREngine', '2');

    const ocrResponse = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: {
        'apikey': 'K87899142388957', // Free public API key
      },
      body: ocrFormData,
    });

    const ocrResult = await ocrResponse.json();

    if (ocrResult.IsErroredOnProcessing) {
      throw new Error(ocrResult.ErrorMessage?.[0] || 'OCR processing failed');
    }

    const ocrText = ocrResult.ParsedResults?.[0]?.ParsedText || '';

    if (!ocrText || ocrText.trim().length < 10) {
      throw new Error('No text could be extracted from the scanned document');
    }

    console.log(`✅ OCR completed successfully`);

    return NextResponse.json({
      success: true,
      text: ocrText.trim(),
      method: 'OCR (scanned document)',
      metadata: {
        fileName: file.name,
        totalPages: data.numpages,
        fileSize: file.size,
      },
    });

  } catch (error: any) {
    console.error('❌ Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
