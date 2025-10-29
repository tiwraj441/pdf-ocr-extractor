# 📄 PDF OCR Text Extractor

Extract text from digital and scanned PDF documents automatically using Next.js 14 and TypeScript.

## 🌐 Live Demo

Try it now: https://ocr-pdf-bkuvnkvet-rajdeep-tiwaris-projects-4a1cab9a.vercel.app

## ✨ Features

-  Smart detection (digital vs scanned PDFs)
-  Fast extraction for digital PDFs (< 1 second)
-  OCR support for scanned documents
-  Modern, responsive UI
-  Copy text to clipboard
-  File validation (max 10MB)

## 🛠️ Tech Stack

Next.js 14 • TypeScript • Tailwind CSS • pdf-parse • OCR.space API

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn

## 🚀 Installation

**Step 1:** Clone the repository

git clone https://github.com/tiwraj441/pdf-ocr-extractor.git
cd pdf-ocr-extractor


**Step 2:** Install dependencies


npm install


**Step 3:** Start development server

npm run dev


**Step 4:** Open browser

http://localhost:3000/ paste this url


## 📖 Usage

### Web Interface

1. Open `http://localhost:3000`
2. Click "Choose File" and select a PDF (max 10MB)
3. Click "🚀 Extract Text"
4. View extracted text and copy if needed

### API Endpoint

**POST** `/api/extract-text`

**Example:**

curl -X POST http://localhost:3000/api/extract-text
-F "file=@document.pdf


**Response:**

{
"success": true,
"text": "Extracted text...",
"metadata": {
"fileName": "document.pdf",
"totalPages": 5
}
}


## 📁 Project Structure


pdf-ocr-extractor/
├── src/
│ ├── app/
│ │ ├── api/extract-text/route.ts # API endpoint
│ │ ├── page.tsx # Main UI
│ │ └── layout.tsx # Root layout
│ └── types/pdf-parse.d.ts # Type definitions
├── package.json
└── README.md


## 🔧 Commands


npm run dev # Start development server
npm run build # Build for production
npm start # Start production server
npm run lint # Run linting



## 🐛 Troubleshooting

**Port 3000 in use?**

npm run dev -- -p 3001


**Module errors?**


rm -rf node_modules .next package-lock.json
npm install


**TypeScript errors?**
- Restart VS Code TypeScript server: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

## 🚧 Limitations

- Max file size: 10MB
- OCR language: English only
- Processing time: 1-15 seconds
- OCR accuracy depends on document quality

## 📦 Deploy to Vercel


npm install -g vercel

vercel


Or push to GitHub and import at [vercel.com](https://vercel.com)

## 👨‍💻 Author

**Rajdeep Tiwari**

Internship project demonstrating Next.js, TypeScript, and API integration.

## 🙏 Credits

- [Next.js](https://nextjs.org/)
- [pdf-parse](https://npmjs.com/package/pdf-parse)
- [OCR.space](https://ocr.space/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📝 License

MIT License - Free for personal and commercial use

---

⭐ Star this repo if you find it helpful!

🔗 Repository: https://github.com/tiwraj441/pdf-ocr-extractor
