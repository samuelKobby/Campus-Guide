import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaGraduationCap, FaBook, FaUtensils, FaDumbbell, FaCoffee, FaBriefcaseMedical, FaTimes } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const categories = [
  { name: 'Academic Buildings', icon: FaGraduationCap, path: '/category/academic' },
  { name: 'Libraries', icon: FaBook, path: '/category/libraries' },
  { name: 'Dining Halls', icon: FaUtensils, path: '/category/dining' },
  { name: 'Sports Facilities', icon: FaDumbbell, path: '/category/sports' },
  { name: 'Student Centers', icon: FaCoffee, path: '/category/student-centers' },
  { name: 'Health Services', icon: FaBriefcaseMedical, path: '/category/health' },
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
            className={`fixed top-0 left-0 bottom-0 z-50 w-80 max-w-[85vw] ${
              theme === 'dark'
                ? 'bg-gray-900/95 backdrop-blur-xl'
                : 'bg-white/95 backdrop-blur-xl'
            } shadow-2xl overflow-y-auto`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b ${
              theme === 'dark' ? 'border-white/10' : 'border-gray-200'
            }`}>
              <h2 className={`text-xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Menu</h2>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-all ${
                  theme === 'dark'
                    ? 'text-white/70 hover:text-white hover:bg-white/10'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-6 space-y-2">
              <Link
                to="/map"
                className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                  theme === 'dark'
                    ? 'text-white/90 hover:text-white hover:bg-white/10'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
                onClick={handleLinkClick}
              >
                Interactive Map
              </Link>

              {/* Categories Dropdown */}
              <div>
                <button
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                    theme === 'dark'
                      ? 'text-white/90 hover:text-white hover:bg-white/10'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
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
                            className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                              theme === 'dark'
                                ? 'text-white/80 hover:text-white hover:bg-white/10'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                            onClick={handleLinkClick}
                          >
                            <category.icon className="mr-3" />
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/about"
                className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                  theme === 'dark'
                    ? 'text-white/90 hover:text-white hover:bg-white/10'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
                onClick={handleLinkClick}
              >
                About
              </Link>

              <Link
                to="/contact"
                className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                  theme === 'dark'
                    ? 'text-white/90 hover:text-white hover:bg-white/10'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
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