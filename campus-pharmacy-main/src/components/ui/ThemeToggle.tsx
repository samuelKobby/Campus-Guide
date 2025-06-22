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
          ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' 
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
      } ${className}`}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
     
      <Lightbulb 
        className={`h-5 w-5 ${
          theme === 'dark' 
            ? 'text-yellow-300 fill-yellow-300' 
            : 'text-gray-600'
        }`} 
      />
    </button>
  );
};