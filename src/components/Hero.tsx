import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroProps {
  onAnalyzeClick: () => void;
}

export function Hero({ onAnalyzeClick }: HeroProps) {
  return (
    <section className="relative py-16 bg-gray-50">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-gray-100 text-sm text-gray-700">
              Making Research Accessible
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
          >
            Understand Complex Research Papers with AI
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            ResearchEase helps students decode academic papers through AI-powered summaries, explanations, and insights.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAnalyzeClick}
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800 transition-colors duration-200"
            >
              Try it now
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#how-it-works"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
            >
              Learn more
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Background decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[120%] h-full bg-gradient-to-b from-gray-100/50 to-transparent opacity-50"></div>
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute -left-1/4 top-1/4 w-1/2 h-1/2 bg-gradient-radial from-gray-100 to-transparent rounded-full opacity-30"
        ></motion.div>
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 4,
          }}
          className="absolute -right-1/4 top-1/2 w-1/2 h-1/2 bg-gradient-radial from-gray-100 to-transparent rounded-full opacity-30"
        ></motion.div>
      </motion.div>
    </section>
  );
}