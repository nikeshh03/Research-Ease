import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { AnalysisResult } from './components/AnalysisResult';
import { Brain, BookOpen, Loader2 } from 'lucide-react';
import type { UploadState, AnalysisResult as AnalysisResultType } from './types';
import { analyzeText } from './utils/gemini';
import { pdfjs } from 'react-pdf';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function App() {
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle',
    progress: 0,
  });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultType | null>(null);

  const handleFileSelect = async (file: File) => {
    try {
      setUploadState({ status: 'uploading', progress: 0 });
      
      // Load the PDF file
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      
      // Extract text from all pages
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
        
        setUploadState({
          status: 'uploading',
          progress: (i / pdf.numPages) * 50,
        });
      }

      // Analyze the text
      setUploadState({ status: 'analyzing', progress: 50 });
      const result = await analyzeText(fullText);
      
      setUploadState({ status: 'complete', progress: 100 });
      setAnalysisResult(result);
    } catch (error) {
      setUploadState({
        status: 'error',
        progress: 0,
        error: error instanceof Error ? error.message : 'Failed to process the file',
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                ResearchEase
              </h1>
            </div>
            <p className="text-sm text-gray-500">AI-Powered Research Paper Analysis</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Upload Section */}
          <section className="card p-6">
            <h2 className="section-title">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              Upload Your Research Paper
            </h2>
            <FileUpload
              onFileSelect={handleFileSelect}
              disabled={uploadState.status === 'uploading' || uploadState.status === 'analyzing'}
            />
            
            {/* Progress Indicator */}
            {(uploadState.status === 'uploading' || uploadState.status === 'analyzing') && (
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-indigo-600">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {uploadState.status === 'uploading' ? 'Processing PDF...' : 'Analyzing content...'}
                  </div>
                  <span className="text-gray-500">{Math.round(uploadState.progress)}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${uploadState.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {uploadState.status === 'error' && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100">
                <p className="text-sm text-red-600">{uploadState.error}</p>
              </div>
            )}
          </section>

          {/* Analysis Results */}
          {analysisResult && (
            <section>
              <h2 className="section-title mb-6">
                <Brain className="h-5 w-5 text-indigo-600" />
                Analysis Results
              </h2>
              <AnalysisResult result={analysisResult} />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;