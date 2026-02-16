import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (event?: React.MouseEvent) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Check if user has a theme preference in localStorage or use system preference
  const getInitialTheme = (): Theme => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      
      if (savedTheme) {
        return savedTheme;
      }
      
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    
    return 'light'; // Default theme
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous theme class
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(theme);
    
    // Save theme to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = async (event?: React.MouseEvent) => {
    // Get the click position from the button
    const x = event?.clientX ?? window.innerWidth / 2;
    const y = event?.clientY ?? window.innerHeight / 2;

    console.log('Toggle theme clicked at:', x, y);

    // Calculate the maximum radius needed to cover the entire screen
    const endRadius = Math.sqrt(
      Math.pow(Math.max(x, window.innerWidth - x), 2) +
      Math.pow(Math.max(y, window.innerHeight - y), 2)
    ) * 1.5;

    console.log('End radius:', endRadius);

    // Determine if we're switching to dark mode
    const newTheme = theme === 'light' ? 'dark' : 'light';
    const isDarkMode = newTheme === 'dark';

    console.log('Switching to:', newTheme);

    // Check if View Transitions API is supported
    // @ts-ignore - startViewTransition may not be in TypeScript definitions yet
    if (!document.startViewTransition) {
      console.warn('⚠️ View Transitions API not supported in this browser!');
      console.log('Falling back to instant theme switch');
      setTheme(newTheme);
      return;
    }

    console.log('✅ View Transitions API is supported!');
    console.log('Starting transition animation...');

    // Set CSS custom properties for the animation origin point
    document.documentElement.style.setProperty('--x', `${x}px`);
    document.documentElement.style.setProperty('--y', `${y}px`);

    // Start the view transition
    // @ts-ignore
    const transition = document.startViewTransition(async () => {
      setTheme(newTheme);
    });

    try {
      await transition.ready;
      console.log('✅ Transition ready! CSS animation should be playing now...');
      console.log('Animation origin point:', `x: ${x}px, y: ${y}px`);
      console.log('Animation direction:', isDarkMode ? 'Expanding circle (spreading dark)' : 'Shrinking circle (retreating dark)');
      
      await transition.finished;
      console.log('✅ Animation complete!');
    } catch (error) {
      console.error('❌ Transition animation failed:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};