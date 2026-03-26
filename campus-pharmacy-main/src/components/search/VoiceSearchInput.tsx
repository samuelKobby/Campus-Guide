import React, { useEffect, useState, useRef } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaSearch } from 'react-icons/fa';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';
import { VoiceLanguage, useVoiceLanguages } from '../../hooks/useVoiceLanguages';

interface VoiceSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  className?: string;
  currentLanguage: VoiceLanguage;
  onLanguageChange?: (lang: VoiceLanguage) => void;
  theme?: string;
}

export const VoiceSearchInput: React.FC<VoiceSearchInputProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
  className = '',
  currentLanguage,
  onLanguageChange,
  theme = 'light'
}) => {
  const {
    isListening,
    isSupported,
    startListening,
    transcript,
    error,
    setLanguage
  } = useVoiceRecognition();

  // Update voice recognition language when currentLanguage changes
  useEffect(() => {
    setLanguage(currentLanguage);
  }, [currentLanguage, setLanguage]);

  // Update search input when transcript changes
  useEffect(() => {
    if (transcript) {
      onChange(transcript);
      if (onSearch) {
        onSearch();
      }
    }
  }, [transcript, onChange, onSearch]);

  const [showLangSelector, setShowLangSelector] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { languages } = useVoiceLanguages();

  // Handle clicks outside of language selector
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLangSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative flex items-center ${className}`}>
      {/* Search Icon - Left side */}
      <div className="absolute left-4 z-10 pointer-events-none">
        <FaSearch className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full pl-12 pr-20 py-2 text-base rounded-full transition-all duration-300 focus:outline-none focus:ring-2
          ${theme === 'dark'
            ? 'bg-black/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:ring-cyan-400 shadow-xl'
            : 'bg-white/30 backdrop-blur-sm border border-white/20 text-gray-900 placeholder-gray-500 focus:ring-blue-400 shadow-xl'
          }
        `}
      />

      {/* Microphone Button - Second from right */}
      <button
        onClick={startListening}
        disabled={isListening}
        className={`
          absolute right-8 p-1.5 rounded-full transition-all duration-300
          ${theme === 'dark'
            ? 'text-white hover:text-gray-300'
            : 'text-blue-600 hover:text-blue-800'
          }
          ${isListening ? 'animate-pulse text-red-400' : ''}
          border border-white/20
        `}
        title={isListening ? 'Listening...' : 'Click to search by voice'}
      >
        {isListening ? <FaMicrophone className="w-3.5 h-3.5" /> : <FaMicrophoneSlash className="w-3.5 h-3.5" />}
      </button>

      {/* Language Selector Button - Rightmost */}
      {isSupported && (
        <button
          onClick={() => setShowLangSelector(prev => !prev)}
          className={`
            absolute right-2 px-2 py-1.5 rounded-full transition-all duration-300
            ${theme === 'dark'
              ? 'text-white hover:text-gray-300'
              : 'text-blue-600 hover:text-blue-800'
            }
            ${isListening ? 'animate-pulse' : ''}
            border border-white/20
          `}
          aria-label="Select language"
          title="Select language for voice recognition"
        >
          <span className="text-xs font-medium">{currentLanguage.code.split('-')[0].toUpperCase()}</span>
        </button>
      )}

      {/* Language selector dropdown */}
      {showLangSelector && (
        <div
          ref={dropdownRef}
          className={`
            absolute right-2 top-full mt-2 w-48 rounded-2xl py-2 px-2
            ${theme === 'dark'
              ? 'bg-black/30 backdrop-blur-sm border border-white/20'
              : 'bg-white bg-opacity-95 backdrop-blur-sm border border-white/20'
            }
            shadow-xl
          `}
          style={{ zIndex: 9999 }}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                if (onLanguageChange) {
                  onLanguageChange(lang);
                }
                setShowLangSelector(false);
              }}
              className={`w-full px-4 py-2 text-left transition-colors rounded-xl mb-1 last:mb-0 ${
                currentLanguage.code === lang.code
                  ? theme === 'dark'
                    ? 'bg-cyan-500/20 text-cyan-400 backdrop-blur-sm'
                    : 'bg-purple-500/20 text-purple-600 backdrop-blur-sm'
                  : theme === 'dark'
                    ? 'text-gray-300 hover:bg-white/10 backdrop-blur-sm'
                    : 'text-gray-700 hover:bg-black/5 backdrop-blur-sm'
              }`}
            >
              <span>{lang.name}</span>
              <span className={`ml-2 text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>({lang.code})</span>
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className={`
          absolute top-full left-0 right-0 mt-2 p-3 rounded-full text-sm transition-opacity
          ${theme === 'dark'
            ? 'bg-red-500/30 backdrop-blur-sm border border-red-500/40 text-red-400'
            : 'bg-red-50 backdrop-blur-sm border border-red-500/30 text-red-600'
          }
          shadow-lg
        `}>
          {error}
        </div>
      )}
    </div>
  );
};
