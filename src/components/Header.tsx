import React from 'react';
import { Brain } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Header({ activeTab, setActiveTab }: HeaderProps) {
  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="bg-white border-b border-gray-100 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => handleNavClick('home')}
          >
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6" />
              <span className="text-lg font-semibold">ResearchEase</span>
            </div>
          </motion.div>
          
          <nav className="hidden md:flex items-center gap-8">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#"
              onClick={() => handleNavClick('home')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Home
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#features"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Features
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#how-it-works"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              How It Works
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('analyze')}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
            >
              Get Started
            </motion.button>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}