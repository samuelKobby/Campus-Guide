import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaGraduationCap, FaBook, FaUtensils, FaDumbbell, FaCoffee, FaBriefcaseMedical, FaTimes, FaPills, FaBuilding } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const categories = [
  { name: 'Academic Buildings', icon: FaGraduationCap, path: '/category/academic',      gradient: 'from-emerald-400 to-teal-500' },
  { name: 'Libraries',          icon: FaBook,           path: '/category/libraries',      gradient: 'from-amber-400 to-orange-500' },
  { name: 'Dining Halls',       icon: FaUtensils,       path: '/category/dining',         gradient: 'from-pink-400 to-rose-500' },
  { name: 'Sports Facilities',  icon: FaDumbbell,       path: '/category/sports',         gradient: 'from-sky-400 to-blue-500' },
  { name: 'Student Centers',    icon: FaCoffee,         path: '/category/student-centers',gradient: 'from-violet-400 to-purple-500' },
  { name: 'Health Services',    icon: FaBriefcaseMedical, path: '/category/health',       gradient: 'from-fuchsia-400 to-pink-500' },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const { theme } = useTheme();

  const handleLinkClick = () => {
    onClose();
    setIsCategoriesOpen(false);
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-80 max-w-[85vw] overflow-y-auto"
            style={{
              background: theme === 'dark'
                ? 'rgba(12, 17, 30, 0.72)'
                : 'rgba(255, 255, 255, 0.25)',
              backdropFilter: theme === 'dark' ? 'blur(20px) saturate(1.6)' : 'blur(20px) saturate(1.8)',
              WebkitBackdropFilter: theme === 'dark' ? 'blur(20px) saturate(1.6)' : 'blur(20px) saturate(1.8)',
              borderRight: theme === 'dark'
                ? '1px solid rgba(255,255,255,0.06)'
                : 'none',
              boxShadow: theme === 'dark'
                ? '4px 0 30px rgba(0,0,0,0.35), inset -1px 0 0 rgba(255,255,255,0.04)'
                : '4px 0 30px rgba(0,0,0,0.08)',
            }}
          >
            {/* Header */}
            <div className={`relative flex items-center justify-between p-6 ${
              theme === 'dark' ? 'border-b border-white/10' : ''
            }`}>
              {/* gradient accent bar */}
              <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent" />
              <h2 className={`text-xl font-bold ${
                theme === 'dark'
                  ? 'bg-gradient-to-r bg-clip-text text-transparent from-cyan-300 to-indigo-300'
                  : 'text-gray-900'
              }`}>Menu</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg transition-all text-white/60 hover:text-white hover:bg-white/10"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-6 space-y-2">
              <Link
                to="/map"
                className="block px-4 py-3 rounded-lg font-medium transition-all duration-200 text-white/80 hover:text-white hover:bg-white/10"
                onClick={handleLinkClick}
              >
                Interactive Map
              </Link>

              {/* Categories Dropdown */}
              <div>
                <button
                  className="flex items-center justify-between w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 text-white/80 hover:text-white hover:bg-white/10"
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                >
                  <span>Categories</span>
                  <FaChevronDown
                    className={`transition-transform duration-200 ${
                      isCategoriesOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Categories List */}
                <AnimatePresence>
                  {isCategoriesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 space-y-1 pl-4">
                        {categories.map((category) => (
                          <Link
                            key={category.name}
                            to={category.path}
                            className="flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-white/75 hover:text-white hover:bg-white/10"
                            onClick={handleLinkClick}
                          >
                            <span className={`mr-3 flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center bg-gradient-to-br ${category.gradient} text-white shadow-sm`}>
                              <category.icon size={13} />
                            </span>
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="my-1 border-t border-white/10" />

              <Link
                to="/medicines"
                className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-white/80 hover:text-white hover:bg-white/10"
                onClick={handleLinkClick}
              >
                <FaPills size={14} className="text-cyan-400/60" />
                Medicines
              </Link>

              <Link
                to="/pharmacies"
                className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-white/80 hover:text-white hover:bg-white/10"
                onClick={handleLinkClick}
              >
                <FaBuilding size={14} className="text-cyan-400/60" />
                Pharmacies
              </Link>

              <div className="my-1 border-t border-white/10" />

              <Link
                to="/about"
                className="block px-4 py-3 rounded-lg font-medium transition-all duration-200 text-white/80 hover:text-white hover:bg-white/10"
                onClick={handleLinkClick}
              >
                About
              </Link>

              <Link
                to="/contact"
                className="block px-4 py-3 rounded-lg font-medium transition-all duration-200 text-white/80 hover:text-white hover:bg-white/10"
                onClick={handleLinkClick}
              >
                Contact
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};