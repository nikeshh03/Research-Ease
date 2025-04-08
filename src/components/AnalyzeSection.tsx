import React, { useState } from 'react';
import { Brain, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { FileUpload } from './FileUpload';
import { AnalysisResult } from './AnalysisResult';
import { PDFPreview } from './PDFPreview.tsx';
import type { UploadState, AnalysisResult as AnalysisResultType } from '../types';
import { motion } from 'framer-motion';

interface AnalyzeSectionProps {
  uploadState: UploadState;
  analysisResult: AnalysisResultType | null;
  onFileSelect: (file: File) => void;
}

export function AnalyzeSection({ uploadState, analysisResult, onFileSelect }: AnalyzeSectionProps) {
  const [showPreview, setShowPreview] = useState(true);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Analyze Your Research Paper
          </h2>
          <p className="text-gray-600">
            Upload your research paper and let our AI help you understand it better.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="card p-6">
              <FileUpload
                onFileSelect={onFileSelect}
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="card p-6 h-[600px] overflow-hidden">
              <PDFPreview file={uploadState.file} />
            </div>
          </motion.div>
        </div>

        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-12"
          >
            <h2 className="section-title mb-6">
              <Brain className="h-5 w-5 text-indigo-600" />
              Analysis Results
            </h2>
            <AnalysisResult result={analysisResult} />
          </motion.div>
        )}
      </div>
    </section>
  );
}