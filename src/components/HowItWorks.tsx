import React from 'react';
import { Upload, Brain, BookOpen } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: 'Upload Your Paper',
      description: 'Simply upload any academic PDF, and our AI will process the document, extracting text and recognizing its structure.'
    },
    {
      icon: Brain,
      title: 'AI Analysis',
      description: 'Our advanced AI analyzes the content, identifying key concepts, summarizing sections, and explaining complex terminology.'
    },
    {
      icon: BookOpen,
      title: 'Comprehend Easily',
      description: 'Access interactive summaries, explanations, and visualizations that make complex research accessible and easier to understand.'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-gray-100 text-sm text-gray-700 mb-6">
            How It Works
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Simplified Academic Reading
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ResearchEase breaks down complex research papers into digestible components, making them easier to understand and reference.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="p-8 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <step.icon className="h-6 w-6 text-gray-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Academic Reading?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are using ResearchEase to unlock deeper understanding of academic literature.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button className="px-6 py-3 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800">
              Get Started Free
            </button>
            <button className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}