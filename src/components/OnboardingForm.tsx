
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface OnboardingFormProps {
  onComplete: (dateOfBirth: string, location: string, birthTime: string, gender: string) => void;
}

interface FormValues {
  dateOfBirth: string;
  location: string;
  birthTime: string;
  gender: string;
}

const OnboardingForm: React.FC<OnboardingFormProps> = ({ onComplete }) => {
  const [error, setError] = useState('');
  
  const form = useForm<FormValues>({
    defaultValues: {
      dateOfBirth: '',
      location: '',
      birthTime: '',
      gender: 'neutral'
    }
  });

  const handleSubmit = (values: FormValues) => {
    if (!values.dateOfBirth || !values.location) {
      setError('Please provide both your date of birth and location.');
      return;
    }
    
    // Save to localStorage
    localStorage.setItem('userDateOfBirth', values.dateOfBirth);
    localStorage.setItem('userLocation', values.location);
    localStorage.setItem('userBirthTime', values.birthTime || 'Not provided');
    localStorage.setItem('userGender', values.gender);
    
    onComplete(
      values.dateOfBirth, 
      values.location, 
      values.birthTime || 'Not provided',
      values.gender
    );
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-cosmic-bg/80 border border-cosmic-accent/20 rounded-lg backdrop-blur-sm">
      <h2 className="text-cosmic-accent text-xl mb-4 text-center">Before we consult the stars...</h2>
      <p className="mb-6 text-cosmic-text/80 text-sm text-center">
        To provide you with accurate cosmic insights, please share your birth details.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-cosmic-text mb-2 text-sm">Date of Birth</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    className="bg-cosmic-bg border-cosmic-accent/30 text-cosmic-text"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="birthTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-cosmic-text mb-2 text-sm">Birth Time (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    {...field}
                    className="bg-cosmic-bg border-cosmic-accent/30 text-cosmic-text"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-cosmic-text mb-2 text-sm">Birth Location (City, Country)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="e.g., New York, USA"
                    {...field}
                    className="bg-cosmic-bg border-cosmic-accent/30 text-cosmic-text"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="block text-cosmic-text mb-2 text-sm">Gender</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="text-cosmic-text">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="text-cosmic-text">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="neutral" id="neutral" />
                      <Label htmlFor="neutral" className="text-cosmic-text">Neutral</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
          
          {error && <p className="text-red-400 text-sm">{error}</p>}
          
          <Button 
            type="submit" 
            className="w-full bg-cosmic-accent hover:bg-cosmic-accent/80 text-white"
          >
            Begin Cosmic Journey
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default OnboardingForm;
