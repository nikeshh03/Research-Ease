import React from 'react';
import { Hero } from './Hero';
import { Features } from './Features';
import { HowItWorks } from './HowItWorks';
import { Footer } from './Footer';

interface HomePageProps {
  onAnalyzeClick: () => void;
}

export function HomePage({ onAnalyzeClick }: HomePageProps) {
  return (
    <>
      <Hero onAnalyzeClick={onAnalyzeClick} />
      <Features />
      <HowItWorks />
      <Footer />
    </>
  );
}