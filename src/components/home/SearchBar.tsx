import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { useLocationSearch, SearchResult } from '../../hooks/useLocationSearch';

export const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [aiResults, setAiResults] = useState<any[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { searchLocations, loading } = useLocationSearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setAiResults([]);
      return;
    }

    const results = searchLocations(searchQuery);
    setSearchResults(results);
    
    // Also perform AI search
    performAiSearch(searchQuery);
  };

  const performAiSearch = async (query: string) => {
    try {
      setAiLoading(true);
      setAiError(null);
      
      // Get the Supabase URL from environment variables
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl) {
        throw new Error("Supabase URL not configured");
      }
      
      // Call the AI search edge function
      const response = await fetch(`${supabaseUrl}/functions/v1/ai-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify({ query })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setAiResults(data.results || []);
    } catch (error) {
      console.error("AI search error:", error);
      setAiError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setAiLoading(false);
    }
  };

  const handleLocationClick = (location: SearchResult, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (location.getDirections) {
      location.getDirections();
    }
  };
  
  const handleAiLocationClick = (location: any) => {
    if (location.coordinates?.latitude && location.coordinates?.longitude) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates.latitude},${location.coordinates.longitude}`,
        '_blank'
      );
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="mx-auto min-w-[280px] max-w-[720px]">
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              // Update search results in real-time as user types
              if (!e.target.value.trim()) {
                setSearchResults([]);
                return;
              }
              const results = searchLocations(e.target.value);
              setSearchResults(results);
            }}
            placeholder="Search for a location..."
            className="w-full h-14 px-6 text-base text-gray-900 bg-white bg-opacity-95 backdrop-blur-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-xl border border-white/20"
          />
          <button
            type="submit"
            className="absolute right-4 min-h-[48px] min-w-[48px] flex items-center justify-center text-blue-600 hover:text-blue-800 transition-colors"
            aria-label="Search"
          >
            <FaSearch size={20} />
          </button>
        </div>
      </form>
      
      {/* Show instant search results only when there's a query */}
      {searchQuery.trim() && (
        <div className="mx-auto min-w-[280px] max-w-[720px] mt-2">
          {loading ? (
            <div className="bg-white rounded-lg shadow-lg p-4 text-center text-gray-600">
              Loading...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Quick Results:</h3>
              {searchResults.map((location: SearchResult) => (
                <div 
                  key={location.id}
                  onClick={(e) => handleLocationClick(location, e)}
                  className="p-3 hover:bg-gray-100 rounded cursor-pointer flex items-center justify-between"
                >
                  <span className="font-medium">{location.name}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    {location.category}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-4 text-center text-gray-600">
              No locations found
            </div>
          )}
        </div>
      )}
      
      {/* AI Search Results */}
      {searchQuery.trim() && aiResults.length > 0 && (
        <div className="mx-auto min-w-[280px] max-w-[720px] mt-2">
          <div className="bg-white rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">AI-Powered Results:</h3>
            {aiResults.map((location) => (
              <div 
                key={location.id}
                onClick={() => handleAiLocationClick(location)}
                className="p-3 hover:bg-gray-100 rounded cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{location.name}</span>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                    {location.category}
                  </span>
                </div>
                {location.description && (
                  <p className="text-sm text-gray-600 mt-1">{location.description}</p>
                )}
                <div className="flex justify-end mt-2">
                  <button 
                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAiLocationClick(location);
                    }}
                  >
                    Get Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* AI Search Loading State */}
      {searchQuery.trim() && aiLoading && (
        <div className="mx-auto min-w-[280px] max-w-[720px] mt-2">
          <div className="bg-white rounded-lg shadow-lg p-4 text-center text-gray-600">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2"></div>
              Searching with AI...
            </div>
          </div>
        </div>
      )}
      
      {/* AI Search Error State */}
      {searchQuery.trim() && aiError && (
        <div className="mx-auto min-w-[280px] max-w-[720px] mt-2">
          <div className="bg-white rounded-lg shadow-lg p-4 text-center text-red-600">
            Error: {aiError}
          </div>
        </div>
      )}
      
      {/* No Results State */}
      {searchQuery.trim() && !loading && searchResults.length === 0 && !aiLoading && aiResults.length === 0 && !aiError && (
        <div className="mx-auto min-w-[280px] max-w-[720px] mt-2">
          <div className="bg-white rounded-lg shadow-lg p-4 text-center text-gray-600">
            No locations found matching your search
          </div>
        </div>
      )}
    </div>
  );
};