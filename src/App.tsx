import React, { useState } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { AnalyzeSection } from './components/AnalyzeSection';
import type { UploadState, AnalysisResult } from './types';
import { analyzeText } from './utils/gemini';
import { pdfjs } from 'react-pdf';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle',
    progress: 0,
  });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleFileSelect = async (file: File) => {
    try {
      setUploadState({ status: 'uploading', progress: 0 });
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      
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
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'home' ? (
        <HomePage onAnalyzeClick={() => setActiveTab('analyze')} />
      ) : (
        <AnalyzeSection
          uploadState={uploadState}
          analysisResult={analysisResult}
          onFileSelect={handleFileSelect}
        />
      )}
    </div>
  );
}

export default App;