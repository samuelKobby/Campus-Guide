import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import placeholderImage from '../assets/placeholder.svg';
import { VoiceSearchInput } from '../components/search/VoiceSearchInput';
import { useVoiceLanguages } from '../hooks/useVoiceLanguages';
import { useMedicineTranslations } from '../hooks/useMedicineTranslations';
import { useTheme } from '../context/ThemeContext';

interface Medicine {
  id: string;
  name: string;
  description: string;
  category: string;
  unit: string;
  price: number;
  available: boolean;
  image: string;
}

export const Medicines: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Voice language support
  const { languages } = useVoiceLanguages();
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);
  const { findMatchingMedicine } = useMedicineTranslations(currentLanguage);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('medicines')
        .select('*');

      if (error) throw error;

      setMedicines(data);

      // Extract unique categories
      const uniqueCategories = Array.from(new Set(data.map(medicine => medicine.category)));
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Error fetching medicines:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching medicines');
    } finally {
      setLoading(false);
    }
  };

  const filteredMedicines = medicines.filter(medicine => {
    // Try to find a matching medicine name in the current language
    const spokenMedicineName = findMatchingMedicine(searchTerm);
    
    const matchesSearch = 
      // Check if the spoken medicine name matches
      (spokenMedicineName && medicine.name.toLowerCase() === spokenMedicineName.toLowerCase()) ||
      // Fallback to regular text search
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !selectedCategory || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div className={`container mx-auto py-8 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Loading...</div>;
  if (error) return <div className="container mx-auto py-8 text-center text-red-500">{error}</div>;

  return (
    <div className={`min-h-screen pt-24 pb-12 ${theme === 'dark' ? 'bg-[#050816]' : 'bg-gradient-to-b from-[#F2ECFD] to-white'}`}>
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Available Medicines</h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <VoiceSearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search medicines by name or description..."
                currentLanguage={currentLanguage}
                onLanguageChange={setCurrentLanguage}
                className="w-full"
              />
            </div>
            <div className="flex gap-4">
              <select
                className={`p-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${
                  theme === 'dark' ? 'bg-[#151030] border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMedicines.map((medicine) => (
            <MedicineCard 
              key={medicine.id} 
              medicine={medicine} 
              theme={theme}
              onClick={() => navigate(`/medicine/${medicine.id}`)}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredMedicines.length === 0 && (
          <div className="text-center py-12">
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              No medicines found matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
// Interactive Medicine Card Component
const MedicineCard: React.FC<{ 
  medicine: Medicine; 
  theme: string;
  onClick: () => void;
}> = ({ medicine, theme, onClick }) => {
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
    
    const rotateX = ((mousePosition.y - centerY) / centerY) * -5;
    const rotateY = ((mousePosition.x - centerX) / centerX) * 5;
    
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
      onClick={onClick}
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
          className="w-full h-full object-cover"
          src={medicine.image || placeholderImage}
          alt={medicine.name}
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
        
        {/* Availability Badge */}
        <motion.div 
          className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium ${
            medicine.available
              ? 'bg-green-500/90 text-white'
              : 'bg-red-500/90 text-white'
          }`}
          whileHover={{ scale: 1.1 }}
        >
          {medicine.available ? 'Available' : 'Out of Stock'}
        </motion.div>
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
          <h2 className={`text-sm font-semibold line-clamp-1 leading-tight flex-1 transition-colors duration-200 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${isHovered ? 'text-purple-600 dark:text-purple-400' : ''}`}>
            {medicine.name}
          </h2>
          <motion.span 
            className={`text-xs whitespace-nowrap flex-shrink-0 font-semibold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}
            animate={{
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            GH₵{medicine.price.toFixed(2)}/{medicine.unit}
          </motion.span>
        </div>

        <div className={`text-xs ${theme === 'dark' ? 'text-[#a09cb9]' : 'text-gray-600'}`}>
          <p className="line-clamp-2">{medicine.description}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          <motion.span 
            className={`px-2 py-0.5 text-xs rounded transition-colors duration-200 ${
              theme === 'dark'
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'bg-cyan-100 text-cyan-800'
            } ${isHovered ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400' : ''}`}
            whileHover={{ scale: 1.05 }}
          >
            {medicine.category}
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
};