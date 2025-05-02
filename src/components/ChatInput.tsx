
import React, { useState } from 'react';
import { Stars, Image } from 'lucide-react';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  onImageUpload: (file: File) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, onImageUpload, disabled = false }) => {
  const [message, setMessage] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message);
      setMessage('');
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
      // Reset the input so the same file can be uploaded again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto relative z-10">
      <div className="relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="cosmic-input w-full py-3 pl-12 pr-12 rounded-full text-cosmic-text focus:outline-none focus:ring-2 focus:ring-cosmic-accent/50"
          placeholder="Ask the stars anything..."
          disabled={disabled}
        />
        
        <button
          type="button"
          onClick={handleImageClick}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full hover:bg-cosmic-accent/10 transition-colors"
          disabled={disabled}
        >
          <Image className="w-5 h-5 text-cosmic-accent" />
        </button>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*" 
        />
        
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-cosmic-accent hover:bg-cosmic-secondary transition-colors"
          disabled={!message.trim() || disabled}
        >
          <Stars className="w-5 h-5 text-white" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
