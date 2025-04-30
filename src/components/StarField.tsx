
import React, { useEffect, useState } from 'react';

interface Star {
  id: number;
  x: string;
  y: string;
  size: string;
  animationDuration: string;
  animationDelay: string;
}

const StarField: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);
  
  useEffect(() => {
    // Create stars on component mount
    const generatedStars: Star[] = [];
    const starCount = Math.floor(window.innerWidth * window.innerHeight / 4000);
    
    for (let i = 0; i < starCount; i++) {
      generatedStars.push({
        id: i,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        size: `${Math.random() * 2 + 1}px`,
        animationDuration: `${Math.random() * 3 + 2}s`,
        animationDelay: `${Math.random() * 2}s`,
      });
    }
    
    setStars(generatedStars);
  }, []);
  
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: star.x,
            top: star.y,
            width: star.size,
            height: star.size,
            '--twinkle-duration': star.animationDuration,
            '--twinkle-delay': star.animationDelay,
          } as React.CSSProperties}
        />
      ))}
      <div className="cosmic-glow top-1/4 left-1/4" />
      <div className="cosmic-glow bottom-1/4 right-1/4" />
      <div className="cosmic-glow top-2/3 right-1/3" style={{ 
        background: 'rgba(214, 188, 250, 0.1)', 
        width: '200px', 
        height: '200px' 
      }} />
    </div>
  );
};

export default StarField;
