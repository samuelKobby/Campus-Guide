import React, { useEffect, useState, useRef } from 'react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
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
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-2 pr-24 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="absolute right-2 flex space-x-2">
        {isSupported && (
          <button
            onClick={() => setShowLangSelector(prev => !prev)}
            className={`p-2 transition-colors ${isListening 
              ? 'text-red-500 animate-pulse' 
              : 'text-blue-600 hover:text-blue-800'}`}
            aria-label={isListening ? 'Listening...' : 'Search with voice'}
            title={isSupported ? 'Search with voice' : 'Voice search not supported in this browser'}
          >
            <span className="text-xs font-medium">{currentLanguage.code.split('-')[0].toUpperCase()}</span>
          </button>
        )}
        <button
          onClick={startListening}
          disabled={isListening}
          className={`p-2 transition-colors ${isListening 
            ? 'text-red-500 animate-pulse' 
            : 'text-blue-600 hover:text-blue-800'}`}
          title={isListening ? 'Listening...' : 'Click to search by voice'}
        >
          {isListening ? <FaMicrophone className="w-5 h-5" /> : <FaMicrophoneSlash className="w-5 h-5" />}
        </button>

        {/* Language selector dropdown */}
        {showLangSelector && (
          <div 
            ref={dropdownRef}
            className={`absolute right-0 top-full mt-2 w-48 rounded-2xl shadow-lg py-2 px-2 ${
              theme === 'dark' ? 'bg-[#151030] border border-white/10' : 'bg-white'
            }`}
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
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'bg-purple-50 text-purple-600'
                    : theme === 'dark'
                      ? 'text-gray-300 hover:bg-white/10'
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{lang.name}</span>
                <span className={`ml-2 text-sm ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>({lang.code})</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-red-100 text-red-600 rounded-2xl text-sm transition-opacity">
          {error}
        </div>
      )}
    </div>
  );
};
