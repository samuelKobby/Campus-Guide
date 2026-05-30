import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MobileMenu } from './MobileMenu';
import { DesktopNav } from './DesktopNav';
import { ThemeToggle } from '../ui/ThemeToggle';
import { MenuButton } from './MenuButton';
import { InstallQrModal } from './InstallQrModal';
import { useNavbarStyle } from '../../hooks/useNavbarStyle';
import { useTheme } from '../../context/ThemeContext';
import { Menu, X, QrCode } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const { navbarClass } = useNavbarStyle(isMenuOpen);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isAboutPage = location.pathname === '/about';
  const isCategoryPage = location.pathname.startsWith('/category');
  const hasDarkHero = isCategoryPage;

  const downloadUrl = 'https://drive.google.com/file/d/1hqAPZ52JeJkFaZW_ehkQi7OFw4KnutFN/view?usp=drive_link';

  return (
    <>
      <nav className={navbarClass} data-page={isAboutPage ? 'about' : hasDarkHero ? 'dark-hero' : undefined}>
        <div className="relative flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-8 h-16">
          {/* ── Logo with rings ── */}
          <Link to="/" className="flex items-center gap-0 group z-10">
            <div className="relative flex items-center justify-center">
              <svg className="absolute w-14 h-14 animate-[spin_25s_linear_infinite] opacity-30" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="26" fill="none" stroke={isDark ? 'rgba(6,182,212,0.35)' : 'rgba(37,99,235,0.3)'} strokeWidth="0.5" strokeDasharray="3 5" />
              </svg>
              <svg className="absolute w-[4.5rem] h-[4.5rem] animate-[spin_40s_linear_infinite_reverse] opacity-20" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="34" fill="none" stroke={isDark ? 'rgba(6,182,212,0.25)' : 'rgba(37,99,235,0.2)'} strokeWidth="0.5" strokeDasharray="1.5 6" />
              </svg>
              <img
                src="/images/Untitled_design-removebg-preview.png"
                alt="Campus Guide logo"
                className="relative z-10"
                style={{ width: 64, height: 96, objectFit: 'cover', marginLeft: -26, marginTop: -8 }}
              />
            </div>
            <span
              className={`font-bold text-lg tracking-tight ${(isDark || hasDarkHero) && !isAboutPage ? 'text-white drop-shadow-[0_0_8px_rgba(6,182,212,0.15)]' : ''}`}
              style={{ fontFamily: "'Playfair Display','Georgia',serif", marginLeft: -10, ...((isAboutPage || (!isDark && !hasDarkHero)) ? { color: '#2d3340' } : {}) }}
            >
              CampusGuide
            </span>
          </Link>

          {/* ── Center: Desktop Nav Links ── */}
          <div className={`hidden md:flex items-center justify-center ${isHomePage ? 'flex-1' : 'absolute left-1/2 -translate-x-1/2'}`}>
            <DesktopNav />
          </div>

              {/* ── Right: Install App link + Theme toggle + mobile menu ── */}
          <div className="flex items-center gap-3 z-10">
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="flex items-center gap-2 text-xs font-normal text-gray-400 hover:text-gray-300 transition-colors group"
              title="Show QR code to install app"
            >
              <QrCode className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Install App</span>
            </button>
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
      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        onInstallClick={() => {
          setIsQrModalOpen(true);
          setIsMenuOpen(false);
        }}
      />

      {/* QR Code Modal */}
      <InstallQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        downloadUrl={downloadUrl}
      />
    </>
  );
};