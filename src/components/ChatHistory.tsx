
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

interface ChatHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ isOpen, onClose, messages }) => {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="left" className="bg-cosmic-bg border-cosmic-accent/20 w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-cosmic-accent">Conversation History</SheetTitle>
        </SheetHeader>
        <div className="mt-6 overflow-y-auto max-h-[80vh]">
          {messages.length > 1 ? (
            messages.slice(1).map((msg) => (
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
      </SheetContent>
    </Sheet>
  );
};

export default ChatHistory;
