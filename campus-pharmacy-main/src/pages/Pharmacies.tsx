import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaMapMarkerAlt, FaClock, FaPhone } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import placeholderImage from '../assets/placeholder.svg';
import { VoiceSearchInput } from '../components/search/VoiceSearchInput';
import { useVoiceLanguages } from '../hooks/useVoiceLanguages';

interface Pharmacy {
  id: string;
  name: string;
  location: string;
  hours: string;
  phone: string;
  latitude: number;
  longitude: number;
  available: boolean;
  image: string;
}

/* ── Tilt card (mirrors LocationCard from CategoryLayout) ── */
const PharmacyCard: React.FC<{ pharmacy: Pharmacy; theme: string }> = ({ pharmacy, theme }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const getCardTransform = () => {
    if (!isHovered || !cardRef.current) return '';
    const rect = cardRef.current.getBoundingClientRect();
    const rotateX = ((mousePosition.y - rect.height / 2) / (rect.height / 2)) * -5;
    const rotateY = ((mousePosition.x - rect.width / 2) / (rect.width / 2)) * 5;
    return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const getShinePosition = () => {
    if (!isHovered) return { opacity: 0 };
    return {
      opacity: 0.15,
      background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.3), transparent 50%)`,
    };
  };

  const directionsUrl = pharmacy.latitude && pharmacy.longitude
    ? `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}&travelmode=walking`
    : `https://www.google.com/maps/search/${encodeURIComponent(pharmacy.name + ' ' + pharmacy.location)}`;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setMousePosition({ x: 0, y: 0 }); }}
      style={{ transform: getCardTransform(), transition: 'transform 0.1s ease-out' }}
      className="cursor-pointer group relative"
    >
      {/* Shine overlay */}
      <div className="absolute inset-0 rounded-xl pointer-events-none z-10 transition-opacity duration-300" style={getShinePosition()} />

      {/* Image */}
      <div className="relative w-full h-[240px] overflow-hidden rounded-xl mb-3">
        <motion.img
          src={pharmacy.image || placeholderImage}
          className="w-full h-full object-cover"
          alt={pharmacy.name}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        {/* Availability badge */}
        <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
          pharmacy.available ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'
        }`}>
          {pharmacy.available ? 'Open' : 'Closed'}
        </div>
        {/* Directions button */}
        <motion.a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="absolute bottom-2 right-2 w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaMapMarkerAlt size={14} />
        </motion.a>
      </div>

      {/* Text content */}
      <motion.div
        className="space-y-2"
        animate={{ y: isHovered ? -2 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* First row - Name and Hours */}
        <div className="flex justify-between items-center">
          <h2 className={`text-sm font-semibold line-clamp-1 leading-tight transition-colors duration-200 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          } ${isHovered ? 'text-cyan-600 dark:text-cyan-400' : ''}`}>
            {pharmacy.name}
          </h2>
          <p className={`text-xs flex items-center gap-1.5 ${theme === 'dark' ? 'text-[#a09cb9]' : 'text-gray-600'}`}>
            <FaClock className="flex-shrink-0 opacity-60" size={11} />
            {pharmacy.hours}
          </p>
        </div>

        {/* Second row - Location and Phone */}
        <div className="flex justify-between items-start">
          <p className={`text-xs flex items-center gap-1.5 line-clamp-1 ${theme === 'dark' ? 'text-[#a09cb9]' : 'text-gray-600'}`}>
            <FaMapMarkerAlt className="flex-shrink-0 opacity-60" size={11} />
            {pharmacy.location}
          </p>
          <p className={`text-xs flex items-center gap-1.5 ${theme === 'dark' ? 'text-[#a09cb9]' : 'text-gray-600'}`}>
            <FaPhone className="flex-shrink-0 opacity-60" size={11} />
            {pharmacy.phone}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── Page ── */
export const Pharmacies: React.FC = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const { theme } = useTheme();

  // Voice language support
  const { languages } = useVoiceLanguages();
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('pharmacies').select('*').order('name');
        if (error) throw error;
        setPharmacies(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = pharmacies.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && (!availableOnly || p.available);
  });

  if (error) return (
    <div className="container mx-auto px-4 py-8 mt-16 text-center text-red-500">{error}</div>
  );

  return (
    <div className={`min-h-screen pt-24 pb-12 ${theme === 'dark' ? 'bg-[#050816]' : 'bg-gradient-to-b from-[#F2ECFD] to-white'}`}>
      <div className="container mx-auto px-4">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <VoiceSearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search pharmacies by name or location..."
              currentLanguage={currentLanguage}
              onLanguageChange={setCurrentLanguage}
              className="w-full"
              theme={theme}
            />
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
            <button
              onClick={() => setAvailableOnly(v => !v)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                availableOnly
                  ? 'bg-blue-600 text-white'
                  : theme === 'dark'
                    ? 'bg-[#151030] text-gray-200 hover:bg-[#1a1540]'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Open Now
            </button>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1,2,3,4,5,6].map(i => (
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
            <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map(pharmacy => (
                <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} theme={theme} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  No pharmacies found matching your search.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};


