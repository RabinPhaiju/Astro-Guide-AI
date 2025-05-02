
import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  imageUrl?: string;
}

interface ChatHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ isOpen, onClose, messages }) => {
  const [savedMessages, setSavedMessages] = useState<Message[]>([]);
  
  useEffect(() => {
    // Load saved messages from localStorage when the component mounts or the drawer opens
    if (isOpen) {
      const storedMessages = localStorage.getItem('chatMessages');
      if (storedMessages) {
        try {
          const parsedMessages = JSON.parse(storedMessages);
          setSavedMessages(parsedMessages);
        } catch (error) {
          console.error('Error parsing stored messages:', error);
          setSavedMessages([]);
        }
      }
    }
  }, [isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="left" className="bg-cosmic-bg border-cosmic-accent/20 w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-cosmic-accent">Conversation History</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] pr-4">
          <div className="mt-6">
            {savedMessages.length > 1 ? (
              savedMessages.map((msg) => (
                <div key={msg.id} className="mb-4 border-b border-cosmic-accent/10 pb-2">
                  <div className="text-xs text-cosmic-accent/60 mb-1">
                    {msg.isUser ? 'You' : 'Cosmic Guide'}
                  </div>
                  <div className="text-sm text-cosmic-text line-clamp-2">
                    {msg.text}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-cosmic-text/60">No messages yet</p>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ChatHistory;
