import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MobileMenu } from './MobileMenu';
import { DesktopNav } from './DesktopNav';
import { Logo } from './Logo';
import { ThemeToggle } from '../ui/ThemeToggle';
import { MenuButton } from './MenuButton';
import { useNavbarStyle } from '../../hooks/useNavbarStyle';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { navbarClass } = useNavbarStyle(isMenuOpen);

  return (
    <>
      <nav className={navbarClass}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Logo />
            </div>
            <div className="flex items-center">
              <DesktopNav />
              <div className="ml-4">
                <ThemeToggle />
              </div>
              <MenuButton 
                isOpen={isMenuOpen} 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="ml-4 md:hidden"
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ${isMenuOpen ? 'block' : 'hidden'}`}>
          <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </div>
      </nav>
      {/* Spacer for fixed navbar */}
      <div className={`h-16 ${navbarClass.includes('bg-transparent') ? 'hidden' : ''}`} />
    </>
  );
};