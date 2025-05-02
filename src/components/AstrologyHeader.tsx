
import React from 'react';
import { Star, Menu } from 'lucide-react';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';

interface AstrologyHeaderProps {
  openChatHistory: () => void;
}

const AstrologyHeader: React.FC<AstrologyHeaderProps> = ({ openChatHistory }) => {
  return (
    <header className="relative z-10 w-full py-6 px-4 flex flex-col items-center justify-center">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <button 
          onClick={openChatHistory}
          className="p-2 rounded-full hover:bg-cosmic-accent/10"
          aria-label="Open chat history"
        >
          <Menu className="w-5 h-5 text-cosmic-accent" />
        </button>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <Star className="w-5 h-5 text-cosmic-accent animate-twinkle" />
        <h1 className="text-2xl md:text-3xl font-bold gradient-text">AstroGuide AI</h1>
        <Star className="w-5 h-5 text-cosmic-accent animate-twinkle" />
      </div>
      <p className="text-cosmic-text/80 text-sm md:text-base max-w-md text-center">
        Ask the stars about your fate, relationships, career, or any guidance you seek
      </p>
      <div className="mt-1 text-cosmic-accent/60 text-xs flex items-center gap-1">
        <span>✨</span>
        <span>powered by nasa ai</span>
        <span>✨</span>
      </div>
    </header>
  );
};

export default AstrologyHeader;
