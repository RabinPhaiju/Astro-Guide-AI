
import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import StarField from '../components/StarField';
import AstrologyHeader from '../components/AstrologyHeader';
import ApiKeyForm from '../components/ApiKeyForm';
import { getGeminiAstrologyResponse } from '../utils/gemini';
import { generateAstrologyResponse } from '../utils/astrology';
import { useToast } from '@/components/ui/use-toast';
import OnboardingForm from '../components/OnboardingForm';
import UserProfile from '../components/UserProfile';
import ChatHistory from '../components/ChatHistory';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

const Index: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Welcome to your astrologer. I am your cosmic guide. Before we begin, please share your date of birth and location.",
      isUser: false
    }
  ]);
  
  const [isThinking, setIsThinking] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [location, setLocation] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [gender, setGender] = useState('');
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load user data and chat history from localStorage on initial render
  useEffect(() => {
    const storedDateOfBirth = localStorage.getItem('userDateOfBirth');
    const storedLocation = localStorage.getItem('userLocation');
    const storedBirthTime = localStorage.getItem('userBirthTime');
    const storedGender = localStorage.getItem('userGender');
    const storedMessages = localStorage.getItem('chatMessages');
    const storedTheme = localStorage.getItem('theme');
    
    if (storedDateOfBirth && storedLocation) {
      setDateOfBirth(storedDateOfBirth);
      setLocation(storedLocation);
      setBirthTime(storedBirthTime || '');
      setGender(storedGender || '');
      setIsOnboardingComplete(true);
    }
    
    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages);
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setMessages(parsedMessages);
        }
      } catch (e) {
        console.error("Error parsing stored messages:", e);
      }
    }
    
    if (storedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

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

  const handleOnboardingComplete = (dob: string, loc: string, time: string, gender: string) => {
    setDateOfBirth(dob);
    setLocation(loc);
    setBirthTime(time);
    setGender(gender);
    setIsOnboardingComplete(true);
    
    // Add a confirmation message
    const newMessage: Message = {
      id: `ai-${Date.now()}`,
      text: `Thank you. I now have your birth details (${dob}, ${time}, ${loc}, ${gender}). How may I assist you with your cosmic inquiries today?`,
      isUser: false
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  // Handle new user message
  const handleSendMessage = async (messageText: string) => {
    // Don't process messages if onboarding isn't complete
    if (!isOnboardingComplete) {
      toast({
        title: "Please complete onboarding",
        description: "We need your date of birth and location before consulting the stars.",
        variant: "destructive"
      });
      return;
    }
    
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
        response = await getGeminiAstrologyResponse(
          messageText, 
          apiKey,
          {
            dateOfBirth, 
            location,
            birthTime,
            gender
          }
        );
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
    <div className={`min-h-screen flex flex-col bg-cosmic-bg overflow-hidden relative ${isDarkMode ? 'dark' : ''}`}>
      <StarField />
      <ApiKeyForm onApiKeySave={handleApiKeySave} />
      <ChatHistory 
        isOpen={isChatHistoryOpen} 
        onClose={() => setIsChatHistoryOpen(false)} 
        messages={messages}
      />
      
      <div className="relative z-10 flex flex-col h-screen">
        <AstrologyHeader openChatHistory={() => setIsChatHistoryOpen(true)} />
        
        <div className="absolute top-2 right-16 z-20">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full w-8 h-8 bg-cosmic-bg/80 backdrop-blur-sm border border-cosmic-accent/20"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-cosmic-accent" />
            ) : (
              <Moon className="h-4 w-4 text-cosmic-accent" />
            )}
          </Button>
        </div>
        
        {isOnboardingComplete && (
          <UserProfile 
            dateOfBirth={dateOfBirth} 
            location={location} 
            birthTime={birthTime}
            gender={gender}
          />
        )}
        
        <main className="flex-1 overflow-y-auto px-4 pb-6 pt-2">
          <div className="max-w-3xl mx-auto space-y-4">
            {!isOnboardingComplete ? (
              <OnboardingForm onComplete={handleOnboardingComplete} />
            ) : (
              <>
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
              </>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </main>
        
        <footer className="sticky bottom-0 w-full px-4 py-4 bg-gradient-to-t from-cosmic-bg to-transparent">
          <ChatInput onSubmit={handleSendMessage} disabled={!isOnboardingComplete} />
        </footer>
      </div>
    </div>
  );
};

export default Index;
