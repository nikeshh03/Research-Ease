export interface AnalysisResult {
  summary: {
    abstract: string;
    introduction: string;
    methodology: string;
    results: string;
    discussion: string;
    conclusion: string;
  };
  keyTerms: Array<{
    term: string;
    explanation: string;
  }>;
  insights: string[];
  recommendations: {
    furtherReading: Array<{
      title: string;
      authors: string;
      year: string;
      relevance: string;
      link?: string;
    }>;
    researchGaps: string[];
    methodologyTips: string[];
    futureDirections: string[];
  };
}

export interface UploadState {
  status: 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';
  progress: number;
  error?: string;
  file?: File;
}