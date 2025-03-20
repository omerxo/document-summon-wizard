
import { generateSummary } from './openaiService';
import { toast } from 'sonner';

// Function to extract text from different document types
export const extractTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        if (!event.target?.result) {
          throw new Error("Failed to read file");
        }
        
        // For this MVP version, we'll just handle text files directly
        // In a production app, we would use proper libraries to extract text from PDFs and DOCXs
        
        if (file.type === 'text/plain') {
          resolve(event.target.result as string);
        } else if (file.type === 'application/pdf' || 
                  file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          // For demo purposes, we'll simulate extracting text
          // In a real app, you would use a PDF parsing library like pdf.js or docx library
          toast.info("In a production environment, we would extract text from this document type properly.");
          
          // Simulate text extraction with a delay
          setTimeout(() => {
            resolve(`This is simulated extracted text from the ${file.type === 'application/pdf' ? 'PDF' : 'DOCX'} file "${file.name}".
            
In a production environment, we would properly parse the document and extract its full text content.

For this demonstration, we're generating a summary based on this placeholder text.`);
          }, 1000);
        } else {
          reject(new Error("Unsupported file type"));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    
    if (file.type === 'text/plain') {
      reader.readAsText(file);
    } else {
      // For other file types, just trigger the onload with any data
      // In a real app, you would use the appropriate reader method for different file types
      reader.readAsText(file);
    }
  });
};

export const summarizeDocument = async (file: File): Promise<string> => {
  try {
    // Extract text from the document
    const extractedText = await extractTextFromFile(file);
    
    // Generate summary from the extracted text
    const summary = await generateSummary(extractedText);
    
    return summary;
  } catch (error) {
    console.error('Error in summarizeDocument:', error);
    throw error;
  }
};
