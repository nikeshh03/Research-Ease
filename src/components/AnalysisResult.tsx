import React, { useState } from 'react';
import { BookOpen, Key, Lightbulb, BookMarked, ArrowRight, Compass, PenTool as Tool, Sparkles } from 'lucide-react';
import type { AnalysisResult } from '../types';

interface AnalysisResultProps {
  result: AnalysisResult;
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  const [activeTab, setActiveTab] = useState('summary');

  const tabs = [
    { id: 'summary', label: 'Summary', icon: BookOpen },
    { id: 'terms', label: 'Key Terms', icon: Key },
    { id: 'insights', label: 'Insights', icon: Lightbulb },
    { id: 'recommendations', label: 'Research Tips', icon: Compass },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Tabs */}
      <div className="border-b border-gray-100">
        <div className="flex overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`
                flex items-center px-6 py-4 text-sm font-medium transition-colors
                ${activeTab === id
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
                }
              `}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div className="space-y-8">
            {Object.entries(result.summary).map(([section, content]) => (
              <div key={section} className="space-y-3">
                <h3 className="text-lg font-semibold capitalize text-gray-900 flex items-center gap-2">
                  <BookMarked className="h-5 w-5 text-indigo-600" />
                  {section}
                </h3>
                <p className="text-gray-600 leading-relaxed">{content}</p>
              </div>
            ))}
          </div>
        )}

        {/* Key Terms Tab */}
        {activeTab === 'terms' && (
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
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="grid gap-4 sm:grid-cols-2">
            {result.insights.map((insight, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 border border-gray-100"
              >
                <ArrowRight className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-gray-600">{insight}</p>
              </div>
            ))}
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="space-y-8">
            {/* Further Reading */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookMarked className="h-5 w-5 text-indigo-600" />
                Related Papers
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {result.recommendations.furtherReading.map((paper, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-gray-50 border border-gray-100"
                  >
                    <h4 className="font-medium text-gray-900">{paper.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {paper.authors} ({paper.year})
                    </p>
                    <p className="text-sm text-gray-600 mt-2">{paper.relevance}</p>
                    {paper.link && (
                      <a
                        href={paper.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700 mt-2"
                      >
                        View Paper
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Research Gaps */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Compass className="h-5 w-5 text-indigo-600" />
                Research Gaps & Opportunities
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {result.recommendations.researchGaps.map((gap, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 border border-gray-100"
                  >
                    <Sparkles className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                    <p className="text-gray-600">{gap}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Methodology Tips */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Tool className="h-5 w-5 text-indigo-600" />
                Methodology Recommendations
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {result.recommendations.methodologyTips.map((tip, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 border border-gray-100"
                  >
                    <ArrowRight className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                    <p className="text-gray-600">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Future Directions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Compass className="h-5 w-5 text-indigo-600" />
                Future Research Directions
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {result.recommendations.futureDirections.map((direction, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 border border-gray-100"
                  >
                    <ArrowRight className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                    <p className="text-gray-600">{direction}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}