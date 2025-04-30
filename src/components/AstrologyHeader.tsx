
import React from 'react';
import { Star } from 'lucide-react';

const AstrologyHeader: React.FC = () => {
  return (
    <header className="relative z-10 w-full py-6 px-4 flex flex-col items-center justify-center">
      <div className="flex items-center gap-2 mb-2">
        <Star className="w-5 h-5 text-cosmic-accent animate-twinkle" />
        <h1 className="text-2xl md:text-3xl font-bold gradient-text">yourastrology</h1>
        <Star className="w-5 h-5 text-cosmic-accent animate-twinkle" />
      </div>
      <p className="text-cosmic-text/80 text-sm md:text-base max-w-md text-center">
        Ask the stars about your fate, relationships, career, or any guidance you seek
      </p>
      <div className="mt-1 text-cosmic-accent/60 text-xs flex items-center gap-1">
        <span>✨</span>
        <span>Powered by cosmic AI</span>
        <span>✨</span>
      </div>
    </header>
  );
};

export default AstrologyHeader;
