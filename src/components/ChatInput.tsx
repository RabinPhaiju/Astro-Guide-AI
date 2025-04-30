
import React, { useState } from 'react';
import { Stars } from 'lucide-react';

interface ChatInputProps {
  onSubmit: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSubmit }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto relative z-10">
      <div className="relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="cosmic-input w-full py-3 px-4 pr-12 rounded-full text-cosmic-text focus:outline-none focus:ring-2 focus:ring-cosmic-accent/50"
          placeholder="Ask the stars anything..."
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-cosmic-accent hover:bg-cosmic-secondary transition-colors"
          disabled={!message.trim()}
        >
          <Stars className="w-5 h-5 text-white" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
