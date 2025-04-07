import React from 'react';
import { BookOpen, Key, Lightbulb } from 'lucide-react';
import type { AnalysisResult } from '../types';

interface AnalysisResultProps {
  result: AnalysisResult;
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  return (
    <div className="space-y-6">
      {/* Summary Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(result.summary).map(([section, content]) => (
          <div key={section} className="card p-6">
            <h3 className="text-lg font-semibold capitalize mb-3 text-gray-900 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-indigo-600" />
              {section}
            </h3>
            <p className="text-gray-600 leading-relaxed">{content}</p>
          </div>
        ))}
      </div>

      {/* Key Terms */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
          <Key className="h-4 w-4 text-indigo-600" />
          Key Terms
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.keyTerms.map(({ term, explanation }, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-gray-50 border border-gray-100"
            >
              <h4 className="font-medium text-gray-900">{term}</h4>
              <p className="mt-1 text-sm text-gray-600">{explanation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Insights */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-indigo-600" />
          Key Insights
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {result.insights.map((insight, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 border border-gray-100"
            >
              <span className="mt-1.5 h-2 w-2 rounded-full bg-indigo-600 shrink-0" />
              <p className="text-gray-600">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}