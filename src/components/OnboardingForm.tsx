
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface OnboardingFormProps {
  onComplete: (dateOfBirth: string, location: string) => void;
}

const OnboardingForm: React.FC<OnboardingFormProps> = ({ onComplete }) => {
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dateOfBirth || !location) {
      setError('Please provide both your date of birth and location.');
      return;
    }
    
    onComplete(dateOfBirth, location);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-cosmic-bg/80 border border-cosmic-accent/20 rounded-lg backdrop-blur-sm">
      <h2 className="text-cosmic-accent text-xl mb-4 text-center">Before we consult the stars...</h2>
      <p className="mb-6 text-cosmic-text/80 text-sm text-center">
        To provide you with accurate cosmic insights, please share your birth details.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="dob" className="block text-cosmic-text mb-2 text-sm">
            Date of Birth
          </label>
          <Input
            id="dob"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="bg-cosmic-bg border-cosmic-accent/30 text-cosmic-text"
          />
        </div>
        
        <div>
          <label htmlFor="location" className="block text-cosmic-text mb-2 text-sm">
            Birth Location (City, Country)
          </label>
          <Input
            id="location"
            type="text"
            placeholder="e.g., New York, USA"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-cosmic-bg border-cosmic-accent/30 text-cosmic-text"
          />
        </div>
        
        {error && <p className="text-red-400 text-sm">{error}</p>}
        
        <Button 
          type="submit" 
          className="w-full bg-cosmic-accent hover:bg-cosmic-accent/80 text-white"
        >
          Begin Cosmic Journey
        </Button>
      </form>
    </div>
  );
};

export default OnboardingForm;
