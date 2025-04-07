import React from 'react';
import { Brain } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Header({ activeTab, setActiveTab }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6" />
              <span className="text-lg font-semibold">ResearchEase</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Home</a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">About</a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Features</a>
            <button
              onClick={() => setActiveTab('analyze')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('analyze')}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
            >
              Get Started
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}