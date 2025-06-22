import React from 'react';
import { Link } from 'react-router-dom';

export const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center space-x-3">
      <div>
        <img 
          src="/images/1.png" 
          alt="Campus Guide Logo" 
          className="h-10 w-10 "
        />
      </div>
      <span className="text-xl font-bold text-white">
        CampusGuide
      </span>
    </Link>
  );
};