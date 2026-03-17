import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChevronDown, FaGraduationCap, FaBook, FaUtensils, FaDumbbell, FaCoffee, FaBriefcaseMedical } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const categories = [
  { name: 'Academic Buildings', icon: FaGraduationCap, path: '/category/academic' },
  { name: 'Libraries', icon: FaBook, path: '/category/libraries' },
  { name: 'Dining Halls', icon: FaUtensils, path: '/category/dining' },
  { name: 'Sports Facilities', icon: FaDumbbell, path: '/category/sports' },
  { name: 'Student Centers', icon: FaCoffee, path: '/category/student-centers' },
  { name: 'Health Services', icon: FaBriefcaseMedical, path: '/category/health' },
];

export const DesktopNav: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const location = useLocation();

  const getLinkClass = (path: string) => {
    const isActive = path === '/category'
      ? location.pathname.startsWith('/category')
      : location.pathname === path;
    return `hud-nav-link ${isDark ? '' : 'light'} ${isActive ? 'active' : ''}`;
  };

  return (
    <nav className="flex items-center gap-6">
      <div className="relative group">
        <button className={getLinkClass('/category')}>
          <span>Categories</span>
          <FaChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
        </button>
        <div className={`absolute left-1/2 -translate-x-1/2 mt-2 w-64 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out ${
          isDark
            ? 'bg-gray-900/80 backdrop-blur-xl border border-white/10'
            : 'bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-lg'
        }`}>
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.path}
              className={`flex items-center px-4 py-2.5 mx-2 rounded-lg transition-all duration-200 ${
                isDark
                  ? 'text-slate-300 hover:text-white hover:bg-white/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-blue-50'
              }`}
            >
              <category.icon className={`mr-3 ${isDark ? 'text-cyan-400/60' : 'text-blue-500/60'}`} />
              {category.name}
            </Link>
          ))}
        </div>
      </div>
      <Link to="/about" className={getLinkClass('/about')}>
        About
      </Link>
      <Link to="/contact" className={getLinkClass('/contact')}>
        Contact
      </Link>
      <a
        href="https://earth.google.com/web/@5.65162219,-0.18694534,95.85505974a,152.56713881d,57.25032726y,91.66577259h,60t,0r/data=CgRCAggBMikKJwolCiExZUxIajdmX3V5QWZHQUYxbnZuRkhMWmFPMnhoa25JS0sgAToDCgEwQgIIAEoICIWEhuwEEAE"
        className={`hud-nav-link ${isDark ? '' : 'light'}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Interactive Map
      </a>
    </nav>
  );
};