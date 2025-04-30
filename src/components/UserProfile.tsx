
import React from 'react';

interface UserProfileProps {
  dateOfBirth: string;
  location: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ dateOfBirth, location }) => {
  return (
    <div className="absolute top-2 right-4 bg-cosmic-bg/80 backdrop-blur-sm p-3 rounded-lg border border-cosmic-accent/20 text-xs md:text-sm">
      <div className="flex flex-col space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-cosmic-accent/80">🎂</span>
          <span className="text-cosmic-text">{dateOfBirth || 'Not provided'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-cosmic-accent/80">📍</span>
          <span className="text-cosmic-text">{location || 'Not provided'}</span>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
