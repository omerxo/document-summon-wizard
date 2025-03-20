
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Trash2, Calendar, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Summary {
  text: string;
  fileName: string;
  date: string;
}

const History = () => {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch summaries from localStorage
    const storedSummaries = JSON.parse(localStorage.getItem('summaryHistory') || '[]');
    setSummaries(storedSummaries);
    setIsLoading(false);
  }, []);

  const handleClearHistory = () => {
    localStorage.removeItem('summaryHistory');
    setSummaries([]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container max-w-6xl mx-auto px-4 md:px-6">
          <div className="mb-8">
            <div className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary inline-block mb-2">
              Document History
            </div>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Your Summary History</h1>
              {summaries.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClearHistory}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear History
                </Button>
              )}
            </div>
          </div>
          
          {isLoading ? (
            <div className="w-full py-20 flex items-center justify-center">
              <div className="animate-pulse-subtle text-primary">Loading history...</div>
            </div>
          ) : (
            <>
              {summaries.length === 0 ? (
                <div className="text-center py-20 animate-fade-in">
                  <div className="rounded-full bg-secondary p-4 inline-flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h2 className="text-xl font-medium mb-2">No summary history yet</h2>
                  <p className="text-muted-foreground mb-6">
                    Upload a document to generate your first summary
                  </p>
                  <Link to="/">
                    <Button>Generate a Summary</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 animate-fade-in">
                  {summaries.map((summary, index) => (
                    <Card 
                      key={index} 
                      className="p-4 border hover:shadow-md transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center">
                        <div className="bg-primary/10 p-3 rounded-lg mr-4">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{summary.fileName}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            <span className="mr-3">{formatDate(summary.date)}</span>
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            <span>
                              {new Date(summary.date).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link to="/" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="text-primary">
                          <span className="mr-1">View</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default History;
