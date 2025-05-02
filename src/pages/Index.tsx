
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
  imageUrl?: string;
}

const Index: React.FC = () => {
  // Initial welcome message
  const welcomeMessage = "Welcome to AstroGuide AI. I'm here to provide cosmic insights about your relationships, career path, personal growth, and life's journey. What would you like to explore today? Feel free to ask about love, career opportunities, spiritual guidance, or any other aspect of your life that needs clarity.";

  const [messages, setMessages] = useState<Message[]>([]);
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

  // Load user data from localStorage on initial render
  useEffect(() => {
    const storedDateOfBirth = localStorage.getItem('userDateOfBirth');
    const storedLocation = localStorage.getItem('userLocation');
    const storedBirthTime = localStorage.getItem('userBirthTime');
    const storedGender = localStorage.getItem('userGender');
    const storedTheme = localStorage.getItem('theme');
    
    if (storedDateOfBirth && storedLocation) {
      setDateOfBirth(storedDateOfBirth);
      setLocation(storedLocation);
      setBirthTime(storedBirthTime || '');
      setGender(storedGender || '');
      setIsOnboardingComplete(true);
      
      // Initialize welcome message if this is the first time
      setMessages([{
        id: 'initial',
        text: welcomeMessage,
        isUser: false
      }]);
    }
    
    // Initialize dark mode based on stored preference
    if (storedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Auto-scroll whenever messages change or when typing
  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
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
    
    // Save to localStorage
    localStorage.setItem('userDateOfBirth', dob);
    localStorage.setItem('userLocation', loc);
    localStorage.setItem('userBirthTime', time || 'Not provided');
    localStorage.setItem('userGender', gender);
    
    // Set initial welcome message
    setMessages([{
      id: 'initial',
      text: welcomeMessage,
      isUser: false
    }]);
  };

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    if (!isOnboardingComplete) {
      toast({
        title: "Please complete onboarding",
        description: "We need your birth details before consulting the stars.",
        variant: "destructive"
      });
      return;
    }
    
    // Show loading state
    setIsThinking(true);
    
    try {
      // Create a message with the image
      const imageUrl = URL.createObjectURL(file);
      const newImageMessage: Message = {
        id: `user-image-${Date.now()}`,
        text: "Image analysis request",
        isUser: true,
        imageUrl
      };
      
      setMessages(prev => [...prev, newImageMessage]);
      
      // Process the image with Gemini API
      let response = "I'm analyzing this image for astrological significance...";
      
      if (apiKey) {
        // In a real implementation, we would send the image to Gemini Vision API
        // For now, we'll just provide a placeholder response
        response = "The cosmic patterns in this image suggest a period of transformation and growth. The visual elements align with Jupiter's current transit, indicating expansion in areas related to your creative pursuits. Consider how these symbols might reflect your current life path.";
      } else {
        response = "I notice interesting patterns in this image that may have astrological significance. Without my full cosmic powers activated (API key), I can only provide a limited interpretation. The shapes and colors suggest connections to your current celestial alignments.";
      }
      
      // Add AI response
      const newAiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: response,
        isUser: false
      };
      
      setMessages(prev => [...prev, newAiMessage]);
      
      // Save messages to localStorage
      const updatedMessages = [...messages, newImageMessage, newAiMessage];
      localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
    } catch (error) {
      console.error("Error processing image:", error);
      toast({
        title: "Error Processing Image",
        description: "The cosmic energies couldn't process this image. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsThinking(false);
    }
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
      
      // Save messages to localStorage
      const updatedMessages = [...messages, newUserMessage, newAiMessage];
      localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
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
      <ChatHistory 
        isOpen={isChatHistoryOpen} 
        onClose={() => setIsChatHistoryOpen(false)} 
        messages={messages}
      />
      
      <div className="relative z-10 flex flex-col h-screen">
        <AstrologyHeader openChatHistory={() => setIsChatHistoryOpen(true)} />
        
        <div className="absolute top-2 right-4 z-20 flex items-center space-x-2">
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
          <ApiKeyForm onApiKeySave={handleApiKeySave} />
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
                    imageUrl={message.imageUrl}
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
          <ChatInput 
            onSubmit={handleSendMessage} 
            onImageUpload={handleImageUpload} 
            disabled={!isOnboardingComplete} 
          />
        </footer>
      </div>
    </div>
  );
};

export default Index;
