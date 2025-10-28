import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PDF OCR Text Extractor",
  description: "Extract text from PDF files using advanced OCR technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
