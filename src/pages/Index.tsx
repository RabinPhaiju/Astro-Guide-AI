
import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import StarField from '../components/StarField';
import AstrologyHeader from '../components/AstrologyHeader';
import ApiKeyForm from '../components/ApiKeyForm';
import { getGeminiAstrologyResponse } from '../utils/gemini';
import { generateAstrologyResponse } from '../utils/astrology';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

const Index: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Welcome to yourastrology. I am your cosmic guide. Ask me about your destiny, relationships, career, or any personal questions. The stars are ready to guide you.",
      isUser: false
    }
  ]);
  
  const [isThinking, setIsThinking] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle API key update
  const handleApiKeySave = (key: string) => {
    setApiKey(key);
  };

  // Handle new user message
  const handleSendMessage = async (messageText: string) => {
    // Add user message
    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      text: messageText,
      isUser: true
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsThinking(true);
    
    try {
      let response: string;
      
      // Use Gemini API if key is provided, otherwise use local generation
      if (apiKey) {
        response = await getGeminiAstrologyResponse(messageText, apiKey);
      } else {
        response = generateAstrologyResponse(messageText);
      }
      
      // Add AI response
      const newAiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: response,
        isUser: false
      };
      
      setMessages(prev => [...prev, newAiMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      // Fallback response
      const fallbackMessage: Message = {
        id: `ai-${Date.now()}`,
        text: "The cosmic energies are turbulent at the moment. Please try asking again later when the stars realign.",
        isUser: false
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cosmic-bg overflow-hidden relative">
      <StarField />
      <ApiKeyForm onApiKeySave={handleApiKeySave} />
      
      <div className="relative z-10 flex flex-col h-screen">
        <AstrologyHeader />
        
        <main className="flex-1 overflow-y-auto px-4 pb-6 pt-2">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message.text} 
                isUser={message.isUser} 
              />
            ))}
            
            {isThinking && (
              <div className="flex space-x-2 p-3 chat-bubble-assistant self-start inline-flex max-w-[80%]">
                <div className="bg-cosmic-accent/30 h-2 w-2 rounded-full animate-pulse delay-100"></div>
                <div className="bg-cosmic-accent/30 h-2 w-2 rounded-full animate-pulse delay-200"></div>
                <div className="bg-cosmic-accent/30 h-2 w-2 rounded-full animate-pulse delay-300"></div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </main>
        
        <footer className="sticky bottom-0 w-full px-4 py-4 bg-gradient-to-t from-cosmic-bg to-transparent">
          <ChatInput onSubmit={handleSendMessage} />
        </footer>
      </div>
    </div>
  );
};

export default Index;
