import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun,Lightbulb } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full transition-colors ${
        theme === 'dark' 
          ?  ' text-gray-800 hover:bg-gray-300'
          : 'text-yellow-300 hover:bg-gray-700'
      } ${className}`}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
     
      <Lightbulb 
        className={`h-5 w-5 ${
          theme === 'dark' 
            ? 'text-gray-600 fill-gray-600'
            : 'text-yellow-300 fill-yellow-300' 
        }`} 
      />
    </button>
  );
};