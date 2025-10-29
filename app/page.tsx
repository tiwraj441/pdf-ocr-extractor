'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to extract text');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">📄 PDF Text Extractor</h1>
        <p className="text-gray-600 mb-8">Upload a PDF to extract text instantly</p>
        
        <div className="mb-6">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600 
              file:mr-4 file:py-2 file:px-4 
              file:rounded-full file:border-0 
              file:text-sm file:font-semibold 
              file:bg-blue-50 file:text-blue-700 
              hover:file:bg-blue-100"
          />
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg 
            font-semibold hover:bg-blue-700 
            disabled:bg-gray-400 disabled:cursor-not-allowed 
            transition-all"
        >
          {loading ? '⏳ Processing...' : ' Extract Text'}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-semibold"> Error</p>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">✅</span>
                <p className="text-green-800 font-bold text-xl">Success!</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-gray-600 font-medium">File Name</p>
                  <p className="text-lg font-bold text-gray-800 truncate">
                    {result.metadata.fileName}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-gray-600 font-medium">Pages</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {result.metadata.totalPages}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-xl text-gray-800">Extracted Text</h3>
                <button
                  onClick={() => navigator.clipboard.writeText(result.text)}
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg 
                    hover:bg-indigo-200 font-semibold text-sm transition-all"
                >
                  📋 Copy
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono 
                  max-h-96 overflow-y-auto leading-relaxed">
                  {result.text}
                </pre>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                {result.text.length} characters • {result.text.split(/\s+/).filter((w: string) => w.length > 0).length} words
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
