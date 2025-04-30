
import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';

interface ApiKeyFormProps {
  onApiKeySave: (apiKey: string) => void;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onApiKeySave }) => {
  const [showForm, setShowForm] = useState(false);
  const [apiKey, setApiKey] = useState('');
  
  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      onApiKeySave(savedApiKey);
    }
  }, [onApiKeySave]);
  
  const handleSaveApiKey = () => {
    localStorage.setItem('gemini_api_key', apiKey);
    onApiKeySave(apiKey);
    setShowForm(false);
  };
  
  return (
    <div className="relative z-20">
      <button 
        onClick={() => setShowForm(!showForm)}
        className="fixed top-4 right-4 p-2 rounded-full bg-cosmic-secondary/40 hover:bg-cosmic-secondary/60 transition-colors"
        title="Configure API Key"
      >
        <Settings className="w-5 h-5 text-cosmic-accent" />
      </button>
      
      {showForm && (
        <div className="fixed top-16 right-4 bg-cosmic-bg border border-cosmic-accent/30 rounded-lg p-4 shadow-lg w-80">
          <h3 className="text-cosmic-accent text-lg mb-2">Gemini API Key</h3>
          <p className="text-sm text-cosmic-text/80 mb-4">
            Enter your Gemini API key to enhance your cosmic guidance.
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block mt-1 text-cosmic-accent hover:underline"
            >
              Get a key from Google AI Studio
            </a>
          </p>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="cosmic-input w-full mb-3 py-2 px-3"
            placeholder="Enter Gemini API key..."
          />
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => setShowForm(false)}
              className="px-3 py-1 rounded text-cosmic-text/70 hover:text-cosmic-text transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveApiKey}
              disabled={!apiKey.trim()}
              className="px-3 py-1 rounded bg-cosmic-accent hover:bg-cosmic-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiKeyForm;
