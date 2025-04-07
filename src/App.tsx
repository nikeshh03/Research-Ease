import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { AnalysisResult } from './components/AnalysisResult';
import { Brain, BookOpen, Loader2, Sparkles, BookCheck, Lightbulb, FileText, ArrowRight, Zap, Target } from 'lucide-react';
import type { UploadState, AnalysisResult as AnalysisResultType } from './types';
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
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultType | null>(null);

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

  const renderContent = () => {
    switch (activeTab) {
      case 'analyze':
        return (
          <section className="py-20 bg-white">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Analyze Your Research Paper
                </h2>
                <p className="text-gray-600">
                  Upload your research paper and let our AI help you understand it better.
                </p>
              </div>
              
              <div className="card p-6">
                <FileUpload
                  onFileSelect={handleFileSelect}
                  disabled={uploadState.status === 'uploading' || uploadState.status === 'analyzing'}
                />
                
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

                {uploadState.status === 'error' && (
                  <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100">
                    <p className="text-sm text-red-600">{uploadState.error}</p>
                  </div>
                )}
              </div>

              {analysisResult && (
                <div className="mt-12">
                  <h2 className="section-title mb-6">
                    <Brain className="h-5 w-5 text-indigo-600" />
                    Analysis Results
                  </h2>
                  <AnalysisResult result={analysisResult} />
                </div>
              )}
            </div>
          </section>
        );
      default:
        return (
          <>
            <section className="relative min-h-[90vh] flex items-center bg-gradient-to-b from-gray-50 to-white overflow-hidden">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white opacity-70"></div>
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                  <div className="absolute top-40 right-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                  <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>
              </div>

              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8">
                    Unlock the Power of
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mt-2">
                      Research Analysis
                    </span>
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                    Transform complex research papers into clear, actionable insights with our AI-powered analysis tool.
                  </p>
                  <button
                    onClick={() => setActiveTab('analyze')}
                    className="hero-button"
                  >
                    Start Analyzing
                    <Sparkles className="ml-2 h-6 w-6" />
                  </button>
                </div>
              </div>
            </section>

            <section id="features" className="py-24 bg-white relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
                    Powerful Features
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Everything you need to understand and leverage research papers effectively
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="feature-card">
                    <Zap className="feature-icon" />
                    <h3 className="feature-title">Smart Analysis</h3>
                    <p className="feature-description">
                      Advanced AI algorithms break down complex research into clear, digestible insights
                    </p>
                  </div>
                  <div className="feature-card">
                    <Target className="feature-icon" />
                    <h3 className="feature-title">Key Findings</h3>
                    <p className="feature-description">
                      Extract and highlight crucial research findings and methodologies
                    </p>
                  </div>
                  <div className="feature-card">
                    <Lightbulb className="feature-icon" />
                    <h3 className="feature-title">Research Gaps</h3>
                    <p className="feature-description">
                      Identify potential research opportunities and unexplored areas
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="how-it-works" className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
                    How It Works
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Three simple steps to transform your research understanding
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                  <div className="process-step">
                    <div className="step-number">1</div>
                    <h3 className="step-title">Upload Paper</h3>
                    <p className="step-description">
                      Simply drag and drop your PDF research paper
                    </p>
                  </div>
                  <div className="process-step">
                    <div className="step-number">2</div>
                    <h3 className="step-title">AI Processing</h3>
                    <p className="step-description">
                      Our AI analyzes and extracts key information
                    </p>
                  </div>
                  <div className="process-step">
                    <div className="step-number">3</div>
                    <h3 className="step-title">Get Results</h3>
                    <p className="step-description">
                      Receive comprehensive insights and analysis
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                ResearchEase
              </h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <button
                onClick={() => setActiveTab('home')}
                className={`nav-button ${activeTab === 'home' ? 'active' : ''}`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveTab('analyze')}
                className={`nav-button ${activeTab === 'analyze' ? 'active' : ''}`}
              >
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Analyze Paper
                </span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {renderContent()}
    </div>
  );
}

export default App;