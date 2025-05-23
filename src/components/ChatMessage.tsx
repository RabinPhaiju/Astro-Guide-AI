
import React, { useState, useEffect, useRef } from 'react';
import { Star, PlayCircle, StopCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  imageUrl?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser, imageUrl }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(!isUser);
  const [isSpeaking, setIsSpeaking] = useState(false); // TTS state
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only apply typing effect to assistant messages
    if (isUser) {
      setDisplayedText(message);
      return;
    }

    setIsTyping(true);
    setDisplayedText('');
    
    let index = 0;
    const typingSpeed = 20 * 0.555; // 1.8x faster (was 20ms per character)
    
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
    <div 
      className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}
      ref={messageRef}
    >
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
        
        <div className="text-sm md:text-base whitespace-pre-wrap">
          {isUser ? (
            <span>{message}</span>
          ) : (
            <ReactMarkdown>{displayedText}</ReactMarkdown>
          )}
        </div>
        {!isUser && (
          <button
            onClick={handleListen}
            className="mt-2 flex items-center text-sm text-cosmic-accent hover:text-cosmic-highlight focus:outline-none"
            aria-label={isSpeaking ? "Stop listening to message" : "Listen to message"}
          >
            {isSpeaking ? (
              <>
                <StopCircle className="w-5 h-5 mr-1" />
                Stop
              </>
            ) : (
              <>
                <PlayCircle className="w-5 h-5 mr-1" />
                Listen
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );

  function handleListen() {
    if (!('speechSynthesis' in window)) {
      console.error('Text-to-speech not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      speechSynthesis.cancel(); // Stop any other message that might be playing
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
      };
      speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  }
};

export default ChatMessage;
