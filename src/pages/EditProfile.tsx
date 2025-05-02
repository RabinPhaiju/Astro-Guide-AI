
import React from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingForm from '../components/OnboardingForm';
import StarField from '../components/StarField';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  
  const handleComplete = (dateOfBirth: string, location: string, birthTime: string, gender: string) => {
    // Save to localStorage just like in the onboarding
    localStorage.setItem('userDateOfBirth', dateOfBirth);
    localStorage.setItem('userLocation', location);
    localStorage.setItem('userBirthTime', birthTime || 'Not provided');
    localStorage.setItem('userGender', gender);
    
    // Navigate back to chat with updated profile
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-cosmic-bg overflow-hidden relative">
      <StarField />
      
      <div className="relative z-10 p-4">
        <Button 
          variant="ghost" 
          className="mb-4 text-cosmic-accent"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Chat
        </Button>
        
        <h1 className="text-2xl text-center font-bold gradient-text mb-6">Edit Your Cosmic Profile</h1>
        
        <div className="max-w-md mx-auto">
          <OnboardingForm 
            onComplete={handleComplete}
            initialValues={{
              dateOfBirth: localStorage.getItem('userDateOfBirth') || '',
              location: localStorage.getItem('userLocation') || '',
              birthTime: localStorage.getItem('userBirthTime') || '',
              gender: localStorage.getItem('userGender') || 'neutral'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
