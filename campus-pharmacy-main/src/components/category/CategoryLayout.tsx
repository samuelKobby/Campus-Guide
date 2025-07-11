import React, { useState } from 'react';
import { FaMapMarkerAlt, FaSearch, FaFilter } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryHero } from './CategoryHero';
import { IconType } from 'react-icons';
import { Location } from '../../context/LocationContext';
import { useTheme } from '../../context/ThemeContext';

interface CategoryLayoutProps {
  title: string;
  description: string;
  icon: IconType;
  locations: Location[];
  backgroundImage: string;
  stats?: Array<{
    label: string;
    value: string;
  }>;
  loading?: boolean;
}

export const CategoryLayout: React.FC<CategoryLayoutProps> = ({
  title,
  description,
  icon,
  locations,
  backgroundImage,
  stats,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { theme } = useTheme();

  // Get all unique tags
  const allTags = Array.from(
    new Set(
      locations.flatMap(location => location.tags || [])
    )
  );

  // Filter locations based on search term and selected tags
  const filteredLocations = locations.filter(location => {
    const matchesSearch = 
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.building.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTags = 
      selectedTags.length === 0 ||
      selectedTags.every(tag => location.tags?.includes(tag));

    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Hero Section */}
      <CategoryHero
        title={title}
        description={description}
        icon={icon}
        backgroundImage={backgroundImage}
        stats={stats}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 transition-colors duration-200">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search locations..."
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <FaFilter className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-600 text-white'
                    : theme === 'dark' 
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`rounded-lg shadow-md overflow-hidden animate-pulse ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className={`h-48 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <div className="p-4 space-y-4">
                  <div className={`h-6 rounded w-3/4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
                  <div className="space-y-2">
                    <div className={`h-4 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
                    <div className={`h-4 rounded w-5/6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Locations Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {filteredLocations.map((location) => (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-lg p-5 shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 ${
                    theme === 'dark' 
                      ? 'bg-gray-800 hover:bg-gray-750' 
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className='relative w-full h-[230px]'>
                    <img
                      className="w-full h-full object-cover rounded-2xl"
                      src={location.image}
                      alt={location.name}
                    />
                  </div>
                  <div className="p-4">
                    <h2 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {location.name}
                    </h2>
                    <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {location.description}
                    </p>
                    <div className={`space-y-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      <p className="flex items-center">
                        <FaMapMarkerAlt className="mr-2" />
                        {location.building}
                      </p>
                      {location.openingHours && (
                        <p className="flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {location.openingHours}
                        </p>
                      )}
                    </div>
                    {location.tags && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {location.tags.map((tag, index) => (
                          <span key={index} className={`px-2 py-1 text-sm rounded-full ${
                            theme === 'dark' 
                              ? 'bg-gray-700 text-gray-300' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {location.getDirections && (
                      <button
                        onClick={location.getDirections}
                        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        Get Directions
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* No Results */}
            {filteredLocations.length === 0 && (
              <div className="text-center py-12 col-span-full">
                <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  No locations found matching your search criteria.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};