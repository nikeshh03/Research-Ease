import React from 'react';
import { Brain, Target, BarChart, Search, Clock, BookOpen } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Brain,
      title: 'Smart Analysis',
      description: 'Advanced AI algorithms break down complex research into digestible insights'
    },
    {
      icon: Target,
      title: 'Key Findings',
      description: 'Automatically extract and highlight crucial research findings'
    },
    {
      icon: BarChart,
      title: 'Data Visualization',
      description: 'Transform complex data into clear, understandable visualizations'
    },
    {
      icon: Search,
      title: 'Research Gaps',
      description: 'Identify potential research opportunities and unexplored areas'
    },
    {
      icon: Clock,
      title: 'Time Saving',
      description: 'Reduce research analysis time from hours to minutes'
    },
    {
      icon: BookOpen,
      title: 'Citation Analysis',
      description: 'Track and analyze paper references and citations'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to understand and leverage research papers effectively
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300"
            >
              <feature.icon className="h-10 w-10 text-gray-700 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}