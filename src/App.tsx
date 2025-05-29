import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { AnalyzeSection } from './components/AnalyzeSection';
import { Auth } from './components/Auth';
import type { UploadState, AnalysisResult } from './types';
import { analyzeText } from './utils/gemini';
import { pdfjs } from 'react-pdf';
import { supabase } from './utils/supabase';
import { useAuthStore } from './store/authStore';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle',
    progress: 0,
  });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { user, setUser, loading } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  const handleFileSelect = async (file: File) => {
    if (!user) {
      return;
    }

    try {
      setUploadState({ status: 'uploading', progress: 0, file });
      
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
          file,
        });
      }

      setUploadState({ status: 'analyzing', progress: 50, file });
      const result = await analyzeText(fullText);
      
      setUploadState({ status: 'complete', progress: 100, file });
      setAnalysisResult(result);
    } catch (error) {
      setUploadState({
        status: 'error',
        progress: 0,
        error: error instanceof Error ? error.message : 'Failed to process the file',
        file,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      {!user ? (
        <Auth />
      ) : (
        activeTab === 'home' ? (
          <HomePage onAnalyzeClick={() => setActiveTab('analyze')} />
        ) : (
          <AnalyzeSection
            uploadState={uploadState}
            analysisResult={analysisResult}
            onFileSelect={handleFileSelect}
          />
        )
      )}
    </div>
  );
}

export default App;