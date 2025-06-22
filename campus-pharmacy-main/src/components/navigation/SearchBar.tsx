import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaDirections, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { useLocationSearch, SearchResult } from '../../hooks/useLocationSearch';
import { supabase } from '../../lib/supabaseClient';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceLanguages, VoiceLanguage } from '../../hooks/useVoiceLanguages';

interface AISearchResult extends SearchResult {
  latitude: number;
  longitude: number;
  building_type: string;
  description: string;
  address: string;
  image_url: string;
  rank: number;
}

export const SearchBar: React.FC = () => {
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AISearchResult[]>([]);
  const [searchMessage, setSearchMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showVoiceUnsupported, setShowVoiceUnsupported] = useState(false);
  const [showLangSelector, setShowLangSelector] = useState(false);

  const navigate = useNavigate();
  const { languages } = useVoiceLanguages();
  const { searchLocations } = useLocationSearch();

  const {
    isListening,
    isSupported,
    startListening,
    transcript,
    error,
    setLanguage,
    currentLang
  } = useVoiceRecognition();

  useEffect(() => {
    if (transcript) {
      setSearchQuery(transcript);
      const event = { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>;
      handleSearch(event).catch(console.error);
    }
  }, [transcript]);

  useEffect(() => {
    setIsSearching(false);
  }, [searchResults]);

  useEffect(() => {
    if (!isSupported) {
      setShowVoiceUnsupported(true);
      const timer = setTimeout(() => setShowVoiceUnsupported(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSupported]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase.rpc('search_locations', {
        search_query: searchQuery
      });

      if (error) throw error;

      if (data && data.length > 0) {
        setSearchResults(data);
        setSearchMessage('Locations found');
      } else {
        setSearchResults([]);
        setSearchMessage('No locations found matching your search.');
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setSearchMessage('Error performing search. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationClick = (location: AISearchResult) => {
    if (location.latitude && location.longitude) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`, '_blank');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchResults([]);
        setShowLangSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchContainerRef} className="relative" style={{ zIndex: 9999 }}>
      <div className="h-[60px] mb-4">
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <div className="relative flex items-center w-full">
              <div className="absolute left-4 text-blue-600 z-10">
                <FaSearch size={20} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (!e.target.value.trim()) {
                    setSearchResults([]);
                    setSearchMessage('');
                    return;
                  }
                  handleSearch(e as any);
                }}
                placeholder="Search for a location..."
                className="w-full pl-12 pr-24 py-4 text-lg text-gray-900 bg-white bg-opacity-95 backdrop-blur-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-xl border border-white/20"
              />
              <div className="absolute right-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={startListening}
                  disabled={!isSupported || isListening}
                  className={`p-2 rounded-full transition-colors flex items-center gap-1 ${isListening
                    ? 'text-red-500 animate-pulse'
                    : 'text-blue-600 hover:text-blue-800'}`}
                  aria-label={isListening ? 'Listening...' : 'Search with voice'}
                  title={isSupported ? 'Search with voice' : 'Voice search not supported'}
                >
                  {isListening ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => isSupported ? setShowLangSelector(prev => !prev) : setShowVoiceUnsupported(true)}
                    className={`p-2 transition-colors ${isListening
                      ? 'text-red-500 animate-pulse'
                      : 'text-blue-600 hover:text-blue-800'}`}
                  >
                    <span className="text-xs font-medium">{currentLang.code.split('-')[0].toUpperCase()}</span>
                  </button>

                  {showLangSelector && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1"
                      style={{ zIndex: 9999 }}
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang);
                            setShowLangSelector(false);
                          }}
                          className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${currentLang.code === lang.code
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700'}`}
                        >
                          <span>{lang.name}</span>
                          <span className="ml-2 text-sm text-gray-500">({lang.code})</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="absolute left-0 right-0" style={{ zIndex: 9999 }}>
        {searchQuery.trim() && (
          <div className="max-w-2xl mx-auto mt-2">
            {isSearching ? (
              <div className="bg-white rounded-lg shadow-lg p-4 text-center text-gray-600">Searching...</div>
            ) : searchResults.length > 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto space-y-2">
                {searchResults.map((location: AISearchResult) => (
                  <div
                    key={location.id}
                    onClick={() => handleLocationClick(location)}
                    className="p-4 hover:bg-gray-100 rounded cursor-pointer transition-colors text-left"
                  >
                    <h3 className="font-medium text-gray-900">{location.name}</h3>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-4 text-center text-gray-600">
                {searchMessage || 'No locations found'}
              </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showVoiceUnsupported && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl mx-auto mt-2 bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg text-center"
          >
            Voice search is not supported in this browser. Please type your search instead.
          </motion.div>
        )}
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl mx-auto mt-2 bg-blue-50 text-blue-800 px-4 py-2 rounded-lg text-center"
          >
            Listening... Speak your search query
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl mx-auto mt-2 bg-red-50 text-red-800 px-4 py-2 rounded-lg text-center"
          >
            {error === 'no-speech' ? 'No speech was detected. Please try again.' : 'Error occurred during voice recognition.'}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
