
import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  imageUrl?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser, imageUrl }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(!isUser);

  useEffect(() => {
    // Only apply typing effect to assistant messages
    if (isUser) {
      setDisplayedText(message);
      return;
    }

    setIsTyping(true);
    setDisplayedText('');
    
    let index = 0;
    const typingSpeed = 20; // 1.5x faster (was 30ms per character)
    
    const typingInterval = setInterval(() => {
      if (index < message.length) {
        setDisplayedText(prev => prev + message.charAt(index));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, typingSpeed);
    
    return () => clearInterval(typingInterval);
  }, [message, isUser]);

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] py-3 px-4 ${
          isUser
            ? 'chat-bubble-user text-white'
            : 'chat-bubble-assistant text-cosmic-text'
        }`}
      >
        {!isUser && (
          <div className="flex items-center gap-1.5 mb-1">
            <Star className="w-4 h-4 text-cosmic-accent" />
            <span className="text-cosmic-accent text-sm">Cosmic Guide</span>
            {isTyping && <span className="animate-pulse">●</span>}
          </div>
        )}
        
        {imageUrl && (
          <div className="mb-3 max-w-xs mx-auto">
            <img 
              src={imageUrl} 
              alt="Uploaded content" 
              className="rounded-lg w-full max-h-64 object-contain"
            />
          </div>
        )}
        
        <p className="text-sm md:text-base whitespace-pre-wrap">{displayedText || message}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
