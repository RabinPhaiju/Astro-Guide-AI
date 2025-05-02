
import React from 'react';
import { Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserProfileProps {
  dateOfBirth: string;
  location: string;
  birthTime?: string;
  gender?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ dateOfBirth, location, birthTime, gender }) => {
  const navigate = useNavigate();

  return (
    <div className="absolute top-16 right-4 bg-cosmic-bg/80 backdrop-blur-sm p-3 rounded-lg border border-cosmic-accent/20 text-xs md:text-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-cosmic-accent text-sm">Your Profile</span>
        <button 
          onClick={() => navigate('/edit-profile')} 
          className="text-cosmic-accent hover:text-cosmic-accent/80"
          aria-label="Edit profile"
        >
          <Edit className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-col space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-cosmic-accent/80">🎂</span>
          <span className="text-cosmic-text">{dateOfBirth || 'Not provided'}</span>
        </div>
        {birthTime && (
          <div className="flex items-center gap-2">
            <span className="text-cosmic-accent/80">🕒</span>
            <span className="text-cosmic-text">{birthTime}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-cosmic-accent/80">📍</span>
          <span className="text-cosmic-text">{location || 'Not provided'}</span>
        </div>
        {gender && (
          <div className="flex items-center gap-2">
            <span className="text-cosmic-accent/80">👤</span>
            <span className="text-cosmic-text">{gender}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
