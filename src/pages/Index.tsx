
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UploadSection from '@/components/UploadSection';
import SummaryDisplay from '@/components/SummaryDisplay';

interface Summary {
  text: string;
  fileName: string;
  date: Date;
}

const Index = () => {
  const [currentSummary, setCurrentSummary] = useState<Summary | null>(null);
  
  const handleSummaryGenerated = (summaryText: string, fileName: string) => {
    const newSummary = {
      text: summaryText,
      fileName: fileName,
      date: new Date()
    };
    
    setCurrentSummary(newSummary);
    
    // Save to history in localStorage
    const history = JSON.parse(localStorage.getItem('summaryHistory') || '[]');
    localStorage.setItem('summaryHistory', JSON.stringify([newSummary, ...history].slice(0, 10)));
  };
  
  const handleReset = () => {
    setCurrentSummary(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container max-w-6xl mx-auto px-4 md:px-6">
          {!currentSummary ? (
            <UploadSection onSummaryGenerated={handleSummaryGenerated} />
          ) : (
            <SummaryDisplay 
              summary={currentSummary.text} 
              fileName={currentSummary.fileName} 
              onReset={handleReset}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
