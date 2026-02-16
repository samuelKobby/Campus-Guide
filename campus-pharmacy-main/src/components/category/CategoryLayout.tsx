import React, { useState, useRef } from 'react';
import { FaMapMarkerAlt, FaSearch, FaFilter } from 'react-icons/fa';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
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
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#050816]' : 'bg-gradient-to-b from-[#F2ECFD] to-white'}`}>
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
                <LocationCard key={location.id} location={location} theme={theme} />
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

// Interactive Location Card Component
const LocationCard: React.FC<{ location: Location; theme: string }> = ({ location, theme }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  // Calculate tilt based on mouse position
  const getCardTransform = () => {
    if (!isHovered || !cardRef.current) return '';
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((mousePosition.y - centerY) / centerY) * -5; // Reduced from -10
    const rotateY = ((mousePosition.x - centerX) / centerX) * 5; // Reduced from 10
    
    return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  // Calculate shine position
  const getShinePosition = () => {
    if (!isHovered) return { opacity: 0 };
    
    return {
      opacity: 0.15,
      background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.3), transparent 50%)`,
    };
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: getCardTransform(),
        transition: 'transform 0.1s ease-out',
      }}
      className="cursor-pointer group relative"
    >
      {/* Shine Effect Overlay */}
      <div 
        className="absolute inset-0 rounded-xl pointer-events-none z-10 transition-opacity duration-300"
        style={getShinePosition()}
      />

      {/* Image Container */}
      <div className='relative w-full h-[240px] overflow-hidden rounded-xl mb-3'>
        <motion.img
          className="w-full h-full object-stretch"
          src={location.image}
          alt={location.name}
          animate={{
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Gradient Overlay on Hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Circular Get Directions Button */}
        {location.getDirections && (
          <motion.button
            onClick={location.getDirections}
            className="absolute bottom-2 right-2 w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </motion.button>
        )}
      </div>

      {/* Content Container */}
      <motion.div 
        className="space-y-2"
        animate={{
          y: isHovered ? -2 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-start justify-between gap-2">
          <h2 className={`text-sm font-semibold line-clamp-1 leading-tight flex-1 transition-colors duration-200 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${isHovered ? 'text-cyan-600 dark:text-cyan-400' : ''}`}>
            {location.name}
          </h2>
          {location.openingHours && (
            <motion.span 
              className={`text-xs whitespace-nowrap flex-shrink-0 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'} font-medium`}
              animate={{
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              {location.openingHours}
            </motion.span>
          )}
        </div>

        <div className={`text-xs ${theme === 'dark' ? 'text-[#a09cb9]' : 'text-gray-600'}`}>
          <p className="line-clamp-1">{location.description}</p>
        </div>

        {location.tags && location.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {location.tags.slice(0, 2).map((tag, index) => (
              <motion.span 
                key={index} 
                className={`px-2 py-0.5 text-xs rounded transition-colors duration-200 ${
                  theme === 'dark'
                    ? 'bg-[#0a0820] text-[#a09cb9]'
                    : 'bg-gray-100 text-gray-600'
                } ${isHovered ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400' : ''}`}
                whileHover={{ scale: 1.05 }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};