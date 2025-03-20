
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { FileText, History } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="fixed top-0 left-0 right-0 py-4 z-10 glass-panel animate-slide-down">
      <div className="container max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="bg-primary rounded-lg p-1">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </span>
            <span className="font-medium text-xl transition-all hover:opacity-90">DocSummon</span>
          </Link>
          
          <nav className="flex items-center">
            <Link 
              to="/" 
              className={cn(
                "px-3 py-2 mx-1 rounded-md transition-all-300 hover:bg-secondary flex items-center gap-1",
                location.pathname === "/" ? "text-primary font-medium" : "text-muted-foreground"
              )}
            >
              <FileText className="h-4 w-4" />
              <span>Summarize</span>
            </Link>
            <Link 
              to="/history" 
              className={cn(
                "px-3 py-2 mx-1 rounded-md transition-all-300 hover:bg-secondary flex items-center gap-1",
                location.pathname === "/history" ? "text-primary font-medium" : "text-muted-foreground"
              )}
            >
              <History className="h-4 w-4" />
              <span>History</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
