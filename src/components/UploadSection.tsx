
import React, { useState, useRef } from 'react';
import { Upload, File, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { summarizeDocument } from '@/services/documentService';

interface UploadSectionProps {
  onSummaryGenerated: (summary: string, fileName: string) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onSummaryGenerated }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    // Check file type
    const allowedTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Unsupported file format. Please upload a PDF, TXT, or DOCX file.');
      return;
    }
    
    // Check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File is too large. Maximum allowed size is 10MB.');
      return;
    }
    
    setFile(selectedFile);
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerateSummary = async () => {
    if (!file) {
      toast.error('Please upload a document first.');
      return;
    }

    setIsProcessing(true);
    try {
      const summary = await summarizeDocument(file);
      onSummaryGenerated(summary, file.name);
      toast.success('Summary generated successfully!');
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Failed to generate summary. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center animate-fade-in">
      <div className="mb-8 text-center">
        <div className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary inline-block mb-2">
          Document Summarizer
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Instant Document Summaries
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload your document and get an AI-powered summary in seconds. Supports PDF, DOCX, and TXT files.
        </p>
      </div>

      <Card 
        className={cn(
          "w-full max-w-2xl rounded-xl p-8 transition-all duration-300 border-2 border-dashed",
          isDragging ? "border-primary bg-primary/5" : "border-border bg-card",
          file ? "bg-card" : ""
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!file ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Upload your document</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              Drag and drop your document here, or click to browse files
            </p>
            <Button 
              onClick={handleFileClick} 
              variant="outline" 
              className="group relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              <span className="relative group-hover:text-white transition-colors duration-300">
                Browse files
              </span>
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.txt,.docx"
              className="hidden"
            />
            <p className="text-xs text-muted-foreground mt-4">
              Supported formats: PDF, DOCX, TXT (Max 10MB)
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-full p-4 rounded-lg border border-border bg-muted/30 flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="bg-primary/10 rounded-lg p-2 mr-3">
                  <File className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium truncate max-w-[250px] sm:max-w-sm">
                    {file.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </span>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="text-muted-foreground hover:text-destructive transition-colors p-1"
                aria-label="Remove file"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <Button
              onClick={handleGenerateSummary}
              disabled={isProcessing}
              className="w-full sm:w-auto text-base px-8 py-6 h-auto group relative overflow-hidden"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Generate Summary</>
              )}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default UploadSection;
