
import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download, Share2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface SummaryDisplayProps {
  summary: string;
  fileName: string;
  onReset: () => void;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary, fileName, onReset }) => {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [summary]);

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    toast.success('Summary copied to clipboard!');
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([summary], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    
    // Generate a summary file name based on the original file
    const nameParts = fileName.split('.');
    nameParts.pop(); // Remove extension
    const baseName = nameParts.join('.');
    element.download = `${baseName}-summary.txt`;
    
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast.success('Summary downloaded!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Summary of ${fileName}`,
          text: summary,
        });
        toast.success('Summary shared successfully!');
      } catch (error) {
        console.error('Error sharing:', error);
        toast.error('Failed to share the summary.');
      }
    } else {
      toast.error('Web Share API is not supported in your browser.');
    }
  };

  // Format current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary inline-block mb-2">
            Summary Generated
          </div>
          <h2 className="text-2xl font-semibold">Summary of {fileName}</h2>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{currentDate}</span>
          </div>
        </div>
        <Button variant="outline" onClick={onReset}>
          New Summary
        </Button>
      </div>
      
      <Card className="rounded-xl p-6 md:p-8 mb-6 border">
        <div className="prose prose-sm sm:prose max-w-none">
          {summary.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </Card>
      
      <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-12">
        <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={handleCopy} className="flex items-center">
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>
        <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={handleDownload} className="flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={handleShare} className="flex items-center">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
};

export default SummaryDisplay;
