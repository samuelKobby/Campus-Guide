import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Clock, Phone, Package, Navigation, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { locationImages } from '../utils/imageUrls';
import { toast } from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

interface Medicine {
  id: string;
  name: string;
  description: string;
  category: string;
  unit: string;
  price: number;
  image: string;
}

interface Pharmacy {
  id: string;
  name: string;
  location: string;
  phone: string;
  hours: string;
  image: string;
}

// Raw shape of data from Supabase join query
type SupabaseJoinRow = {
  quantity: any;
  price: any;
  pharmacies: {
    id: any;
    name: any;
    location: any;
    hours: any;
    phone: any;
    image: any;
  }[];
}

interface PharmacyDetails {
  id: string;
  name: string;
  address: string;
  phone: string;
  operating_hours: string;
  image_url: string;
  quantity: number;
  price: number;
}

export const MedicineDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [pharmacies, setPharmacies] = useState<PharmacyDetails[]>([]);
  const [loading, setLoading] = useState(true);

  // 3D interactive card state
  const medicineCardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isCardHovered, setIsCardHovered] = useState(false);

  const getDirectionsUrl = (address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  // 3D Card Interaction Functions
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!medicineCardRef.current) return;

    const rect = medicineCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => setIsCardHovered(true);
  const handleMouseLeave = () => {
    setIsCardHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  // Calculate tilt based on mouse position
  const getCardTransform = () => {
    if (!isCardHovered || !medicineCardRef.current) return '';

    const rect = medicineCardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((mousePosition.y - centerY) / centerY) * -3;
    const rotateY = ((mousePosition.x - centerX) / centerX) * 3;

    return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  // Calculate shine position
  const getShinePosition = () => {
    if (!isCardHovered) return { opacity: 0 };

    return {
      opacity: 0.15,
      background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.3), transparent 50%)`,
    };
  };

  useEffect(() => {
    const fetchMedicine = async () => {
      if (!id) return;

      try {
        // First get the medicine details
        const { data: medicineData, error: medicineError } = await supabase
          .from('medicines')
          .select('*')
          .eq('id', id)
          .single();

        if (medicineError) throw medicineError;
        console.log('Medicine:', medicineData);
        setMedicine(medicineData);

        // Then get the pharmacies that have this medicine in stock
        const { data: pharmacyData, error } = await supabase
          .from('medicine_pharmacies')
          .select(`
            quantity,
            pharmacies (
              id,
              name,
              location,
              hours,
              phone,
              image
            )
          `)
          .eq('medicine_id', id)
          .gt('quantity', 0);

        if (error) throw error;
        console.log('Raw pharmacy data:', pharmacyData);

        // Format pharmacy data
        const pharmacyItems = (pharmacyData || []).map((item: any) => ({
          id: item.pharmacies.id,
          name: item.pharmacies.name,
          address: item.pharmacies.location,
          phone: item.pharmacies.phone,
          operating_hours: item.pharmacies.hours,
          image_url: item.pharmacies.image,
          quantity: Number(item.quantity) || 0,
          price: medicineData.price // Use price from medicine data
        }));

        console.log('Available pharmacies:', pharmacyItems);
        setPharmacies(pharmacyItems);
      } catch (error: any) {
        console.log('Error fetching data:', error);
        toast.error('Error loading medicine details');
      } finally {
        setLoading(false);
      }
    };

    fetchMedicine();
  }, [id]);

  if (loading) {
    return (
      <div className={`min-h-screen pt-24 pb-12 ${theme === 'dark' ? 'bg-[#050816]' : 'bg-gradient-to-b from-[#F2ECFD] to-white'}`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`
              ${theme === 'dark'
                ? 'bg-black/20 backdrop-blur-md border border-white/10'
                : 'bg-white/60 backdrop-blur-md border border-black/5'
              }
              rounded-2xl p-8 mb-8 shadow-xl
            `}
          >
            {/* Loading Skeleton */}
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-2/5">
                <div className={`w-full h-80 rounded-xl animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`} />
              </div>
              <div className="w-full lg:w-3/5 space-y-6">
                <div className={`h-8 rounded-lg animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} w-3/4`} />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className={`h-4 rounded animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} w-20`} />
                    <div className={`h-6 rounded animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} w-32`} />
                  </div>
                  <div className="space-y-2">
                    <div className={`h-4 rounded animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} w-24`} />
                    <div className={`h-6 rounded animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} w-20`} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className={`h-4 rounded animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} w-24`} />
                  <div className={`h-20 rounded animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} w-full`} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pharmacy Loading Skeleton */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`
              ${theme === 'dark'
                ? 'bg-black/20 backdrop-blur-md border border-white/10'
                : 'bg-white/60 backdrop-blur-md border border-black/5'
              }
              rounded-2xl p-8 shadow-xl
            `}
          >
            <div className={`h-8 rounded-lg animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} w-1/2 mb-6`} />
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className={`
                    ${theme === 'dark'
                      ? 'bg-gray-800/50 border border-gray-700'
                      : 'bg-gray-100/50 border border-gray-200'
                    }
                    rounded-xl p-4
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 rounded-full animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`} />
                      <div className="space-y-2">
                        <div className={`h-5 rounded animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} w-32`} />
                        <div className={`h-4 rounded animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} w-48`} />
                        <div className={`h-4 rounded animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} w-36`} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className={`h-6 rounded animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} w-20`} />
                      <div className={`h-8 rounded-lg animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} w-32`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className={`min-h-screen pt-24 pb-12 ${theme === 'dark' ? 'bg-[#050816]' : 'bg-gradient-to-b from-[#F2ECFD] to-white'}`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              ${theme === 'dark'
                ? 'bg-black/20 backdrop-blur-md border border-white/10'
                : 'bg-white/60 backdrop-blur-md border border-black/5'
              }
              rounded-2xl p-12 text-center shadow-xl
            `}
          >
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Playfair Display','Georgia',serif" }}>
              Medicine not found
            </h2>
            <p className={`mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              The medicine you're looking for doesn't exist or has been removed.
            </p>
            <motion.button
              onClick={() => navigate('/medicines')}
              className={`
                mt-6 px-6 py-3 rounded-xl transition-all duration-300
                ${theme === 'dark'
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Browse All Medicines
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col overflow-hidden ${theme === 'dark' ? 'bg-[#050816]' : 'bg-gradient-to-b from-[#F2ECFD] to-white'}`}>
      <div className="container mx-auto px-4 max-w-7xl flex-1 flex flex-col pt-20 pb-4 overflow-hidden">
        {/* Navigation Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 flex-shrink-0"
        >
          <motion.button
            onClick={() => navigate('/medicines')}
            className={`
              w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
              ${theme === 'dark'
                ? 'bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-black/30'
                : 'bg-white/60 backdrop-blur-md border border-black/5 text-gray-900 hover:bg-white/80'
              }
              shadow-lg hover:shadow-xl
            `}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
        </motion.div>

        {/* Main Content - Desktop 2-Column Grid */}
        <div className="hidden lg:grid lg:grid-cols-5 lg:gap-8 flex-1 min-h-0">
          {/* Left Column - Medicine Details (Fixed) - Increased */}
          <div className="lg:col-span-3 overflow-hidden">
            <motion.div
              ref={medicineCardRef}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: getCardTransform(),
                transition: 'transform 0.1s ease-out',
              }}
              className={`
                h-fit max-h-full overflow-hidden
                ${theme === 'dark'
                  ? 'bg-black/20 backdrop-blur-md border border-white/10'
                  : 'bg-white/60 backdrop-blur-md border border-black/5'
                }
                rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 relative
              `}
            >
              {/* Shine Effect Overlay */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none z-10 transition-opacity duration-300"
                style={getShinePosition()}
              />

              {/* Full Coverage Medicine Image with All Overlay Content */}
              <motion.div
                className="relative h-full"
                animate={{
                  y: isCardHovered ? -4 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="relative overflow-hidden rounded-2xl group h-full"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    className="w-full h-full object-contain rounded-2xl bg-gray-100 dark:bg-gray-800"
                    src={medicine.image || locationImages.pharmacy}
                    alt={medicine.name}
                  />

                  {/* Medicine Name & Category - Bottom Left */}
                  <div className="absolute bottom-6 left-6">
                    {/* Medicine Name */}
                    <h1
                      className="text-2xl font-bold text-white leading-tight mb-2"
                      style={{ fontFamily: "'Playfair Display','Georgia',serif" }}
                    >
                      {medicine.name}
                    </h1>

                    {/* Category - Plain Text */}
                    <p className="text-lg text-white/90 font-medium">
                      {medicine.category}
                    </p>
                  </div>

                  {/* Description - Bottom Right */}
                  <div className="absolute bottom-6 right-6 max-w-xs">
                    <p className="text-sm text-white/90 leading-relaxed">
                      {medicine.description}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column - Pharmacies (Scrollable) - Reduced */}
          <div className="lg:col-span-2 flex flex-col min-h-0">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col h-full"
            >
              <h2
                className={`text-2xl lg:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-8 flex-shrink-0`}
                style={{ fontFamily: "'Playfair Display','Georgia',serif" }}
              >
                Available at These Pharmacies
              </h2>

              {pharmacies.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className={`
                    ${theme === 'dark'
                      ? 'bg-black/20 backdrop-blur-md border border-white/10'
                      : 'bg-white/60 backdrop-blur-md border border-black/5'
                    }
                    rounded-2xl p-12 text-center shadow-xl
                  `}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <Package className={`w-8 h-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                  </div>
                  <p className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    No pharmacies currently have this medicine in stock
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
                    Check back later or contact pharmacies directly for availability.
                  </p>
                </motion.div>
              ) : (
                <div className="flex-1 relative">
                  <div
                    className="absolute top-0 left-0 right-0 bottom-0 overflow-y-scroll scrollbar-hide"
                  >
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pr-2 pb-4">
                      {pharmacies.map((pharmacy, index) => (
                        <MedicineStylePharmacyCard
                          key={pharmacy.id}
                          pharmacy={pharmacy}
                          theme={theme}
                          onGetDirections={() => window.open(getDirectionsUrl(pharmacy.address), '_blank')}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Mobile Layout (below lg) */}
        <div className="lg:hidden space-y-8 flex-1 overflow-y-auto">
          {/* Mobile Medicine Details */}
          <motion.div
            ref={medicineCardRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: getCardTransform(),
              transition: 'transform 0.1s ease-out',
            }}
            className={`
              ${theme === 'dark'
                ? 'bg-black/20 backdrop-blur-md border border-white/10'
                : 'bg-white/60 backdrop-blur-md border border-black/5'
              }
              rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden
            `}
          >
            {/* Shine Effect Overlay */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none z-10 transition-opacity duration-300"
              style={getShinePosition()}
            />

            <div className="p-6 space-y-6">
              {/* Mobile Medicine Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-xl"
              >
                <img
                  className="w-full h-64 object-cover rounded-xl"
                  src={medicine.image || locationImages.pharmacy}
                  alt={medicine.name}
                />
              </motion.div>

              {/* Mobile Medicine Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="space-y-4"
              >
                <h1
                  className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} leading-tight`}
                  style={{ fontFamily: "'Playfair Display','Georgia',serif" }}
                >
                  {medicine.name}
                </h1>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div
                    className={`
                      flex-1 ${theme === 'dark'
                        ? 'bg-cyan-500/10 border border-cyan-500/20'
                        : 'bg-purple-500/10 border border-purple-500/20'
                      }
                      rounded-xl p-4
                    `}
                  >
                    <p className={`text-xs font-medium ${theme === 'dark' ? 'text-cyan-400' : 'text-purple-600'} mb-1`}>
                      Category
                    </p>
                    <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {medicine.category}
                    </p>
                  </div>

                  <div
                    className={`
                      flex-1 ${theme === 'dark'
                        ? 'bg-emerald-500/10 border border-emerald-500/20'
                        : 'bg-emerald-500/10 border border-emerald-500/20'
                      }
                      rounded-xl p-4
                    `}
                  >
                    <p className={`text-xs font-medium ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'} mb-1`}>
                      Price per {medicine.unit}
                    </p>
                    <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      GH₵{medicine.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div
                  className={`
                    ${theme === 'dark'
                      ? 'bg-gray-800/30 border border-gray-700/50'
                      : 'bg-gray-50/60 border border-gray-200/50'
                    }
                    rounded-xl p-4
                  `}
                >
                  <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                    Description
                  </p>
                  <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    {medicine.description}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Mobile Pharmacies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2
              className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-6`}
              style={{ fontFamily: "'Playfair Display','Georgia',serif" }}
            >
              Available at These Pharmacies
            </h2>

            {pharmacies.length === 0 ? (
              <div className={`
                ${theme === 'dark'
                  ? 'bg-black/20 backdrop-blur-md border border-white/10'
                  : 'bg-white/60 backdrop-blur-md border border-black/5'
                }
                rounded-2xl p-8 text-center shadow-xl
              `}>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <Package className={`w-8 h-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <p className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  No pharmacies currently have this medicine in stock
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pharmacies.map((pharmacy, index) => (
                  <MedicineStylePharmacyCard
                    key={pharmacy.id}
                    pharmacy={pharmacy}
                    theme={theme}
                    onGetDirections={() => window.open(getDirectionsUrl(pharmacy.address), '_blank')}
                    index={index}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Pharmacy Card Component
const PharmacyCard: React.FC<{
  pharmacy: PharmacyDetails;
  theme: string;
  onGetDirections: () => void;
  index: number;
}> = ({ pharmacy, theme, onGetDirections, index }) => {
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

  // Calculate subtle tilt for pharmacy cards
  const getCardTransform = () => {
    if (!isHovered || !cardRef.current) return '';

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((mousePosition.y - centerY) / centerY) * -1;
    const rotateY = ((mousePosition.x - centerX) / centerX) * 1;

    return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
  };

  return (
    <motion.div
      ref={cardRef}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, delay: index * 0.1 }
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: getCardTransform(),
        transition: 'transform 0.1s ease-out',
      }}
      className={`
        group relative overflow-hidden rounded-xl transition-all duration-500
        ${theme === 'dark'
          ? 'bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800/70 hover:border-gray-600'
          : 'bg-gray-50/70 border border-gray-200/70 hover:bg-white/80 hover:border-gray-300'
        }
        hover:shadow-xl cursor-pointer
      `}
    >
      {/* Subtle shine effect */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.1 : 0,
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.3), transparent 50%)`,
        }}
      />

      <div className="p-6">
        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <img
                src={pharmacy.image_url || locationImages.pharmacy}
                alt={pharmacy.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-opacity-20 ring-purple-500"
              />
              {/* Status indicator */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </motion.div>

            <div className="space-y-1">
              <h3
                className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} group-hover:text-purple-600 dark:group-hover:text-cyan-400 transition-colors`}
                style={{ fontFamily: "'Roboto','Inter',system-ui,sans-serif" }}
              >
                {pharmacy.name}
              </h3>

              <motion.div
                className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm`}
                whileHover={{ x: 2 }}
              >
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                <p className="truncate">{pharmacy.address}</p>
              </motion.div>

              <div className={`flex items-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                <p>{pharmacy.operating_hours}</p>
              </div>

              <div className={`flex items-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                <Phone className="h-4 w-4 mr-1 flex-shrink-0" />
                <p>{pharmacy.phone}</p>
              </div>
            </div>
          </div>

          {/* Pharmacy Stats & Actions */}
          <div className="text-right space-y-2">
            <div className={`${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
              <p className="text-xs font-medium">In Stock</p>
              <p className="text-lg font-bold">{pharmacy.quantity} units</p>
            </div>

            <div className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
              <p className="text-xs font-medium">Price</p>
              <p className="text-lg font-bold">GH₵{pharmacy.price.toFixed(2)}</p>
            </div>

            <motion.button
              onClick={onGetDirections}
              className={`
                mt-3 px-4 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2 font-medium text-sm
                ${theme === 'dark'
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
                }
              `}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <Navigation className="h-4 w-4" />
              <span>Directions</span>
            </motion.button>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="sm:hidden space-y-4">
          <div className="flex items-start space-x-3">
            <img
              src={pharmacy.image_url || locationImages.pharmacy}
              alt={pharmacy.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-opacity-20 ring-purple-500 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3
                className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} truncate`}
                style={{ fontFamily: "'Roboto','Inter',system-ui,sans-serif" }}
              >
                {pharmacy.name}
              </h3>
              <div className={`flex items-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs mt-1`}>
                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                <p className="truncate">{pharmacy.address}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div>
              <div className={`flex items-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                <Clock className="h-3 w-3 mr-1" />
                <p className="text-xs">{pharmacy.operating_hours}</p>
              </div>
              <div className={`flex items-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <Phone className="h-3 w-3 mr-1" />
                <p className="text-xs">{pharmacy.phone}</p>
              </div>
            </div>

            <div className="text-right">
              <p className={`text-xs ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                {pharmacy.quantity} units • GH₵{pharmacy.price.toFixed(2)}
              </p>
            </div>
          </div>

          <motion.button
            onClick={onGetDirections}
            className={`
              w-full px-4 py-2 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 font-medium text-sm
              ${theme === 'dark'
                ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
              }
            `}
            whileTap={{ scale: 0.98 }}
          >
            <Navigation className="h-4 w-4" />
            <span>Get Directions</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Medicine-Style Pharmacy Card Component (like Medicines page cards)
const MedicineStylePharmacyCard: React.FC<{
  pharmacy: PharmacyDetails;
  theme: string;
  onGetDirections: () => void;
  index: number;
}> = ({ pharmacy, theme, onGetDirections, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Allow scroll events to pass through
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

  // Calculate tilt based on mouse position (same as medicines page)
  const getCardTransform = () => {
    if (!isHovered || !cardRef.current) return '';

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((mousePosition.y - centerY) / centerY) * -5;
    const rotateY = ((mousePosition.x - centerX) / centerX) * 5;

    return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  // Calculate shine position (same as medicines page)
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
      transition={{ duration: 0.3, delay: index * 0.1 }}
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

      {/* Image Container - Full height like medicines page */}
      <div className="relative w-full h-[240px] overflow-hidden rounded-xl mb-3">
        <motion.img
          src={pharmacy.image_url || locationImages.pharmacy}
          className="w-full h-full object-cover"
          alt={pharmacy.name}
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

        {/* Stock Badge */}
        <motion.div
          className="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium bg-green-500/90 text-white"
          whileHover={{ scale: 1.1 }}
        >
          {pharmacy.quantity} units
        </motion.div>

        {/* Price Badge */}
        <motion.div
          className="absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/90 text-white"
          whileHover={{ scale: 1.1 }}
        >
          GH₵{pharmacy.price.toFixed(2)}
        </motion.div>

        {/* Circular Get Directions Button - Bottom Right */}
        <motion.button
          onClick={onGetDirections}
          className={`
            absolute bottom-2 right-2 w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center
            ${theme === 'dark'
              ? 'bg-cyan-600/90 hover:bg-cyan-700 text-white'
              : 'bg-purple-600/90 hover:bg-purple-700 text-white'
            }
            backdrop-blur-sm shadow-lg
          `}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Navigation className="h-4 w-4" />
        </motion.button>

        {/* Pharmacy Name Overlay - Bottom Left */}
        <div className="absolute bottom-2 left-2">
          <h2 className="text-sm font-semibold text-white leading-tight">
            {pharmacy.name}
          </h2>
        </div>
      </div>

      {/* Content Container */}
      <motion.div
        className="space-y-2"
        animate={{
          y: isHovered ? -2 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Contact Info & Location Layout */}
        <div className="flex justify-between gap-4">
          {/* Left side - Contact Info */}
          <div className="flex flex-col space-y-1">
            <div className={`flex items-center ${theme === 'dark' ? 'text-[#a09cb9]' : 'text-gray-600'} text-xs`}>
              <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
              <p className="line-clamp-1">{pharmacy.operating_hours}</p>
            </div>

            <div className={`flex items-center ${theme === 'dark' ? 'text-[#a09cb9]' : 'text-gray-600'} text-xs`}>
              <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
              <p className="line-clamp-1">{pharmacy.phone}</p>
            </div>
          </div>

          {/* Right side - Location */}
          <div className="flex-1 text-right">
            <div className={`flex items-center justify-end ${theme === 'dark' ? 'text-[#a09cb9]' : 'text-gray-600'} text-xs`}>
              <p className="line-clamp-1">{pharmacy.address}</p>
              <MapPin className="h-3 w-3 ml-1 flex-shrink-0" />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
