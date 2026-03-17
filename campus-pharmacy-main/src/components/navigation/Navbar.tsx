import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MobileMenu } from './MobileMenu';
import { DesktopNav } from './DesktopNav';
import { ThemeToggle } from '../ui/ThemeToggle';
import { MenuButton } from './MenuButton';
import { useNavbarStyle } from '../../hooks/useNavbarStyle';
import { useTheme } from '../../context/ThemeContext';
import { Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { navbarClass } = useNavbarStyle(isMenuOpen);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const location = useLocation();
  const isAboutPage = location.pathname === '/about';
  const isCategoryPage = location.pathname.startsWith('/category');
  const hasDarkHero = isCategoryPage;

  return (
    <>
      <nav className={navbarClass} data-page={isAboutPage ? 'about' : hasDarkHero ? 'dark-hero' : undefined}>
        <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-8 h-16">
          {/* ── Logo with rings ── */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center">
              <svg className="absolute w-14 h-14 animate-[spin_25s_linear_infinite] opacity-30" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="26" fill="none" stroke={isDark ? 'rgba(6,182,212,0.35)' : 'rgba(37,99,235,0.3)'} strokeWidth="0.5" strokeDasharray="3 5" />
              </svg>
              <svg className="absolute w-[4.5rem] h-[4.5rem] animate-[spin_40s_linear_infinite_reverse] opacity-20" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="34" fill="none" stroke={isDark ? 'rgba(6,182,212,0.25)' : 'rgba(37,99,235,0.2)'} strokeWidth="0.5" strokeDasharray="1.5 6" />
              </svg>
              <img src="/images/1.png" alt="Campus Guide" className="h-9 w-9 relative z-10 drop-shadow-[0_0_6px_rgba(6,182,212,0.25)]" />
            </div>
            <span className={`font-bold text-lg tracking-tight ${(isDark || hasDarkHero) && !isAboutPage ? 'text-white drop-shadow-[0_0_8px_rgba(6,182,212,0.15)]' : ''}`}
              style={{ fontFamily: "'Inter','SF Pro Display',system-ui,sans-serif", ...((isAboutPage || (!isDark && !hasDarkHero)) ? { color: '#2d3340' } : {}) }}>
              CampusGuide
            </span>
          </Link>

          {/* ── Center: Desktop Nav Links ── */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <DesktopNav />
          </div>

          {/* ── Right: Theme toggle + mobile menu ── */}
          <div className="flex items-center gap-3">
            <ThemeToggle className="hud-theme-toggle" />
            <button
              className={`md:hidden p-2 rounded-lg transition-colors ${isDark ? 'text-cyan-400/60 hover:text-cyan-300 hover:bg-white/5' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu Drawer */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};