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
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#050816]' : 'bg-gray-50'}`}>
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
                  theme === 'dark' ? 'bg-[#151030] border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'
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
                      ? 'bg-[#151030] text-gray-200 hover:bg-[#1a1540]'
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="animate-pulse">
                <div className={`h-[240px] rounded-xl mb-3 ${theme === 'dark' ? 'bg-[#0a0820]' : 'bg-gray-200'}`} />
                <div className="space-y-2">
                  <div className={`h-4 rounded w-5/6 ${theme === 'dark' ? 'bg-[#0a0820]' : 'bg-gray-200'}`} />
                  <div className={`h-3 rounded w-4/6 ${theme === 'dark' ? 'bg-[#0a0820]' : 'bg-gray-200'}`} />
                  <div className={`h-3 rounded w-3/6 ${theme === 'dark' ? 'bg-[#0a0820]' : 'bg-gray-200'}`} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Locations Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredLocations.map((location) => (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="cursor-pointer group relative"
                >
                  {/* Image Container */}
                  <div className='relative w-full h-[240px] overflow-hidden rounded-xl mb-3'>
                    <img
                      className="w-full h-full object-stretch"
                      src={location.image}
                      alt={location.name}
                    />

                    {/* Circular Get Directions Button */}
                    {location.getDirections && (
                      <button
                        onClick={location.getDirections}
                        className="absolute bottom-2 right-2 w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center shadow-lg"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Content Container */}
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <h2 className={`text-sm font-semibold mb-1 line-clamp-2 leading-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {location.name}
                      </h2>

                      <div className={`text-xs space-y-0.5 ${theme === 'dark' ? 'text-[#a09cb9]' : 'text-gray-600'}`}>
                        <p className="line-clamp-1">{location.building}</p>
                        {location.openingHours && (
                          <p className="line-clamp-1">{location.openingHours}</p>
                        )}
                      </div>

                      {location.tags && location.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {location.tags.slice(0, 2).map((tag, index) => (
                            <span key={index} className={`px-2 py-0.5 text-xs rounded ${
                              theme === 'dark'
                                ? 'bg-[#0a0820] text-[#a09cb9]'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
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