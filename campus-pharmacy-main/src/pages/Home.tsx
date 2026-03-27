import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SearchBar } from '../components/home/SearchBar';
import { CompassNavigation } from '../components/home/CompassNavigation';
import { CampusMarker } from '../components/home/CampusMarker';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
  MapPin, Navigation2,
  Wifi, Battery, Signal, Layers, Globe, Crosshair, LayoutGrid,
  Activity, Zap, Search, Antenna, ChevronRight, Menu, X, ChevronDown,
  Info, Phone, Map as MapIcon,
  Pill, Building2, BookOpen, UtensilsCrossed, Target, Users, Hospital,
  GraduationCap, Coffee, Dumbbell, Heart, Play,
} from 'lucide-react';

/* ── Background slide images ──────────────────────────────────────────── */
const bgSlides = [
  '/images/3d1.png',
  '/images/3d4.png',
  '/images/3d5.png',
  '/images/campus-illustration.png',
];

/* ── Data ─────────────────────────────────────────────────────────────────── */
const campusZones = [
  { name: 'Academic Buildings & Hostels', icon: BookOpen, path: '/category/academic', color: 'from-emerald-400 to-teal-600', angle: 300, distance: 1.12 },
  { name: 'Libraries', icon: BookOpen, path: '/category/libraries', color: 'from-amber-400 to-orange-500', angle: 0, distance: 1 },
  { name: 'Dining', icon: UtensilsCrossed, path: '/category/dining', color: 'from-pink-400 to-rose-500', angle: 60, distance: 1.12 },
  { name: 'Sports', icon: Target, path: '/category/sports', color: 'from-sky-400 to-blue-500', angle: 120, distance: 1.25 },
  { name: 'Student Hub', icon: Users, path: '/category/student-centers', color: 'from-violet-400 to-purple-500', angle: 180, distance: 1.25 },
  { name: 'Health', icon: Hospital, path: '/category/health', color: 'from-fuchsia-400 to-pink-500', angle: 240, distance: 1.25 },
];

const quickStats = [
  { label: 'Locations', countTo: 2400, prefix: '', suffix: '+', decimals: 0, icon: MapPin },
  { label: 'Accuracy', countTo: 95, prefix: '', suffix: '%', decimals: 0, icon: Crosshair },
  { label: 'Users', countTo: 30, prefix: '', suffix: 'K+', decimals: 0, icon: Activity },
  { label: 'Response', countTo: 0.2, prefix: '<', suffix: 's', decimals: 1, icon: Zap },
];

function CountUpValue({ countTo, prefix = '', suffix = '', decimals = 0, duration = 1800, delay = 1200 }: {
  countTo: number; prefix?: string; suffix?: string; decimals?: number; duration?: number; delay?: number;
}) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    let raf: number;
    const timeout = setTimeout(() => {
      let startTime: number | null = null;
      const step = (ts: number) => {
        if (!startTime) startTime = ts;
        const progress = Math.min((ts - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCurrent(eased * countTo);
        if (progress < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(timeout); cancelAnimationFrame(raf); };
  }, [countTo, duration, delay]);
  const display = decimals > 0 ? current.toFixed(decimals) : Math.round(current).toLocaleString();
  return <>{prefix}{display}{suffix}</>;
}

const navCategories = [
  { name: 'Academic Buildings & Hostels', icon: GraduationCap, path: '/category/academic' },
  { name: 'Libraries', icon: BookOpen, path: '/category/libraries' },
  { name: 'Dining', icon: UtensilsCrossed, path: '/category/dining' },
  { name: 'Sports', icon: Dumbbell, path: '/category/sports' },
  { name: 'Student Centers', icon: Coffee, path: '/category/student-centers' },
  { name: 'Health', icon: Heart, path: '/category/health' },
];

/* ── Component ─────────────────────────────────────────────────────────────── */
export const Home: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);
  const [vpSize, setVpSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [compassOpen, setCompassOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [prevSlideIndex, setPrevSlideIndex] = useState<number | null>(null);
  const [slideAnimating, setSlideAnimating] = useState(false);

  // Rotate slides every 5 seconds — right-to-left slide
  useEffect(() => {
    const interval = setInterval(() => {
      setPrevSlideIndex(si => si === null ? slideIndex : si);
      setSlideIndex(i => (i + 1) % bgSlides.length);
      setSlideAnimating(true);
      setTimeout(() => {
        setPrevSlideIndex(null);
        setSlideAnimating(false);
      }, 900);
    }, 5000);
    return () => clearInterval(interval);
  }, [slideIndex]);
  const [compassOrigin, setCompassOrigin] = useState('50% 50%');
  const [demoOrigin, setDemoOrigin] = useState('50% 50%');
  const categoriesBtnRef = useRef<HTMLDivElement>(null);
  const demoBtnRef = useRef<HTMLButtonElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const openCompass = () => {
    if (categoriesBtnRef.current && containerRef.current) {
      const btnRect = categoriesBtnRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const ox = btnRect.left + btnRect.width / 2 - containerRect.left;
      const oy = btnRect.top + btnRect.height / 2 - containerRect.top;
      setCompassOrigin(`${ox}px ${oy}px`);
    }
    setCompassOpen(v => !v);
  };

  const openDemo = () => {
    if (demoBtnRef.current && containerRef.current) {
      const btnRect = demoBtnRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const ox = btnRect.left + btnRect.width / 2 - containerRect.left;
      const oy = btnRect.top + btnRect.height / 2 - containerRect.top;
      setDemoOrigin(`${ox}px ${oy}px`);
    }
    setDemoOpen(v => !v);
    if (compassOpen) setCompassOpen(false);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onResize = () => setVpSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const getMarkerRadius = useCallback(() => {
    const base = Math.min(vpSize.w, vpSize.h);
    if (vpSize.w < 640) return base * 0.28;
    if (vpSize.w < 1024) return base * 0.26;
    return base * 0.24;
  }, [vpSize]);

  const markerRadius = getMarkerRadius();

  const formattedTime = time.toLocaleString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit', hour12: true }).replace(',', '').replace(' AM', ' am').replace(' PM', ' pm');
  const formattedDate = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  // SVG connector lines from center to each marker
  const connectorLines = campusZones.map((zone) => {
    const rad = (zone.angle - 90) * (Math.PI / 180);
    const ex = Math.cos(rad) * markerRadius;
    const ey = Math.sin(rad) * markerRadius;
    return { ex, ey, color: zone.color };
  });

  return (
  <LayoutGroup id="home-layout">
    <div ref={containerRef} className="home-dashboard">
      {/* ── Background layers ──────────────────────────────────────────── */}
      {/* Base colour */}
      <div className={`absolute inset-0 ${isDark ? 'bg-[#030810]' : 'bg-[#eef2fd]'}`} />

      {/* Slide images — right-to-left slide */}
      {prevSlideIndex !== null && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${bgSlides[prevSlideIndex]})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            animation: slideAnimating ? 'bg-slide-out 0.9s cubic-bezier(0.76,0,0.24,1) forwards' : 'none',
          }}
        />
      )}
      <div
        key={slideIndex}
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${bgSlides[slideIndex]})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          animation: slideAnimating ? 'bg-slide-in 0.9s cubic-bezier(0.76,0,0.24,1) forwards' : 'none',
        }}
      />

      {/* Dark overlay behind search bar only — dark mode */}

      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`, backgroundSize: '200px 200px' }} />

      {/* Grid overlay — finer, more technical */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: isDark
            ? `linear-gradient(rgba(6,182,212,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.4) 1px, transparent 1px)`
            : `linear-gradient(rgba(37,99,235,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.35) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Radial vignette */}
      <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(3,8,16,0.85)_100%)]' : 'bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(220,230,255,0.55)_100%)]'}`} />

      {/* Ambient orbs with mouse parallax */}
      <div className="absolute w-[800px] h-[800px] rounded-full blur-[220px] pointer-events-none opacity-60"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 65%)'
            : 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 65%)',
          top: '15%',
          left: `${38 + (mousePos.x / vpSize.w) * 12}%`,
          transform: 'translate(-50%, -50%)',
          transition: 'left 1.2s cubic-bezier(0.22,1,0.36,1)',
        }}
      />
      <div className="absolute w-[600px] h-[600px] rounded-full blur-[200px] pointer-events-none opacity-40"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 65%)'
            : 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 65%)',
          bottom: '5%',
          right: `${15 + (mousePos.y / vpSize.h) * 8}%`,
          transition: 'right 1.2s cubic-bezier(0.22,1,0.36,1)',
        }}
      />

      {/* ── Integrated HUD Navbar ─────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-0 left-0 right-0 z-50 hud-navbar"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-8 h-16">
          {/* ── Logo with rings ── */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center">
              {/* Concentric rings around logo */}
              <svg className="absolute w-14 h-14 animate-[spin_25s_linear_infinite] opacity-30" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="26" fill="none" stroke={isDark ? 'rgba(6,182,212,0.35)' : 'rgba(37,99,235,0.3)'} strokeWidth="0.5" strokeDasharray="3 5" />
              </svg>
              <svg className="absolute w-[4.5rem] h-[4.5rem] animate-[spin_40s_linear_infinite_reverse] opacity-20" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="34" fill="none" stroke={isDark ? 'rgba(6,182,212,0.25)' : 'rgba(37,99,235,0.2)'} strokeWidth="0.5" strokeDasharray="1.5 6" />
              </svg>
              <img src="/images/1.png" alt="Campus Guide" className="h-9 w-9 relative z-10 drop-shadow-[0_0_6px_rgba(6,182,212,0.25)]" />
            </div>
            <span className={`font-bold text-lg tracking-tight ${isDark ? 'text-white drop-shadow-[0_0_8px_rgba(6,182,212,0.15)]' : ''}`}
              style={{ fontFamily: "'Roboto','Inter',system-ui,sans-serif", ...(!isDark ? { color: '#2d3340' } : {}) }}>
              CampusGuide
            </span>
          </Link>

          {/* ── Search bar in navbar ── */}
          <div className="hidden md:flex items-center flex-1 max-w-sm mx-8">
            <AnimatePresence>
              {compassOpen && (
                <motion.div
                  key="navbar-search"
                  className="search-hud-wrapper search-hud-navbar w-full"
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                >
                  <SearchBar />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Right: bare status items + theme toggle + mobile toggle ── */}
          <div className="flex items-center gap-3">
            {/* Demo button */}
            <button ref={demoBtnRef} onClick={openDemo} className="hud-bare hidden sm:flex items-baseline gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
              <Play className={`w-3 h-3 ${isDark ? 'text-cyan-300/90' : 'text-blue-600/80'} translate-y-[2px]`} />
              <span className={`text-[10px] font-medium tracking-widest ${isDark ? 'text-cyan-300/90' : 'text-blue-700/90'}`}>Demo</span>
            </button>
            {/* Time */}
            <span className={`hud-bare hidden sm:block font-semibold tabular-nums text-[11px] ${isDark ? 'text-cyan-100/95' : 'text-slate-800'}`}>{formattedTime}</span>
            {/* Theme toggle */}
            <ThemeToggle className="hud-theme-toggle" />
            {/* Mobile menu button */}
            <button
              className={`md:hidden p-2 rounded-lg transition-colors ${isDark ? 'text-cyan-400/60 hover:text-cyan-300 hover:bg-white/5' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop with blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                onClick={() => setMobileMenuOpen(false)}
              />

              {/* Drawer */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 z-50 w-80 max-w-[85vw] overflow-y-auto"
                style={{
                  background: 'rgba(12, 17, 30, 0.72)',
                  backdropFilter: 'blur(20px) saturate(1.6)',
                  WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
                  borderRight: '1px solid rgba(255,255,255,0.06)',
                  boxShadow: '4px 0 30px rgba(0,0,0,0.35), inset -1px 0 0 rgba(255,255,255,0.04)',
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                    <img src="/images/1.png" alt="Campus Guide" className="h-8 w-8" />
                    <span className="font-bold text-lg text-white">CampusGuide</span>
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg transition-all text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Menu Items */}
                <div className="p-6 space-y-1">
                  {navCategories.map((cat) => (
                    <Link
                      key={cat.name}
                      to={cat.path}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-white/80 hover:text-white hover:bg-white/10"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <cat.icon className="w-4 h-4 text-cyan-400/60" />
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                  <div className="my-2 border-t border-white/10" />
                  <Link
                    to="/medicines"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-white/80 hover:text-white hover:bg-white/10"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Pill className="w-4 h-4 text-cyan-400/60" />
                    <span>Medicines</span>
                  </Link>
                  <Link
                    to="/pharmacies"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-white/80 hover:text-white hover:bg-white/10"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Building2 className="w-4 h-4 text-cyan-400/60" />
                    <span>Pharmacies</span>
                  </Link>
                  <div className="my-2 border-t border-white/10" />
                  <Link
                    to="/about"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-white/80 hover:text-white hover:bg-white/10"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Info className="w-4 h-4 text-cyan-400/60" />
                    <span>About</span>
                  </Link>
                  <Link
                    to="/contact"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-white/80 hover:text-white hover:bg-white/10"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Phone className="w-4 h-4 text-cyan-400/60" />
                    <span>Contact</span>
                  </Link>
                  <a
                    href="https://earth.google.com/web/@5.65162219,-0.18694534,95.85505974a,152.56713881d,57.25032726y,91.66577259h,60t,0r/data=CgRCAggBMikKJwolCiExZUxIajdmX3V5QWZHQUYxbnZuRkhMWmFPMnhoa25JS0sgAToDCgEwQgIIAEoICIWEhuwEEAE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-white/80 hover:text-white hover:bg-white/10"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <MapIcon className="w-4 h-4 text-cyan-400/60" />
                    <span>3D Map</span>
                  </a>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ── Compass + markers area ─────────────────────────────────────── */}
      <AnimatePresence>
      {compassOpen && (
      <motion.div
        key="compass-area"
        className="absolute inset-0 flex items-center justify-center z-10"
        style={{ marginTop: '12px', transformOrigin: compassOrigin }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      >
        <div className="relative" style={{ width: markerRadius * 2.6, height: markerRadius * 2.6 }}>

          {/* SVG connector lines from center to markers */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-[1]" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(6,182,212,0.25)" />
                <stop offset="100%" stopColor="rgba(6,182,212,0.03)" />
              </linearGradient>
            </defs>
            {connectorLines.map((line, i) => (
              <line
                key={i}
                x1="50%"
                y1="50%"
                x2={`calc(50% + ${line.ex}px)`}
                y2={`calc(50% + ${line.ey}px)`}
                stroke={isDark ? 'rgba(6,182,212,0.07)' : 'rgba(37,99,235,0.12)'}
                strokeWidth="1"
                strokeDasharray="4 6"
                className="connector-line"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
            {/* Radar sweep rings */}
            <circle cx="50%" cy="50%" r="28%" fill="none" stroke={isDark ? 'rgba(6,182,212,0.04)' : 'rgba(37,99,235,0.1)'} strokeWidth="0.5" strokeDasharray="2 4" />
            <circle cx="50%" cy="50%" r="44%" fill="none" stroke={isDark ? 'rgba(6,182,212,0.03)' : 'rgba(37,99,235,0.08)'} strokeWidth="0.5" strokeDasharray="1.5 5" />
          </svg>

          {/* Radar sweep */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2]">
            <div className="radar-sweep" style={{ width: markerRadius * 2, height: markerRadius * 2 }} />
          </div>

          {/* Compass center */}
          <div className="absolute inset-0 flex items-center justify-center z-[5]">
            <CompassNavigation mouseX={mousePos.x} mouseY={mousePos.y} isDark={isDark} />
          </div>

          {/* Campus zone markers */}
          {campusZones.map((zone, i) => (
            <CampusMarker
              key={zone.name}
              name={zone.name}
              icon={zone.icon}
              path={zone.path}
              angle={zone.angle}
              distance={markerRadius * zone.distance}
              color={zone.color}
              delay={i}
              mouseX={mousePos.x}
              mouseY={mousePos.y}
            />
          ))}
        </div>
      </motion.div>
      )}
      </AnimatePresence>

      {/* ── Centered search — shown when compass is hidden ─────────── */}
      <AnimatePresence>
        {!compassOpen && !demoOpen && (
          <motion.div
            key="center-search"
            className="absolute inset-0 z-40 hidden md:flex flex-col items-center justify-center pointer-events-none" style={{ paddingTop: '0px' }}
            initial={{ y: -240, opacity: 0, scale: 0.92 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -240, opacity: 0, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          >
            {/* Hero text */}
            <motion.div
              className="text-center mb-6 pointer-events-none"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}
                style={{ fontFamily: "'Playfair Display','Georgia',serif" }}>
                Find Your Way Around Campus
              </h1>
              <p className={`mt-3 text-base sm:text-lg lg:text-xl ${isDark ? 'text-cyan-100/80' : 'text-slate-500'}`}>
                Search locations, pharmacies, services & more
              </p>
            </motion.div>
            <div className="search-hud-wrapper search-hud-centered pointer-events-auto" style={{ width: 'min(860px, 92vw)', position: 'relative' }}>
              <div className="absolute inset-0 rounded-full pointer-events-none" style={{ background: isDark ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.55)', filter: 'blur(32px)', transform: 'scale(1.15)', zIndex: -1 }} />
              <SearchBar />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Demo video — compass-style center animation ──────────────── */}
      <AnimatePresence>
        {demoOpen && (
          <motion.div
            key="demo-area"
            className="absolute inset-0 flex items-center justify-center z-10"
            style={{ marginTop: '12px', transformOrigin: demoOrigin }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          >
            <div className="relative w-full max-w-4xl px-5">
              {/* Decorative glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl opacity-60 -z-10" />
              {/* macOS Window Frame */}
              <div className={`relative overflow-hidden rounded-2xl shadow-2xl ${
                isDark ? 'bg-[#1e1e2e] border border-white/10' : 'bg-white border border-gray-200'
              }`}>
                {/* macOS Title Bar */}
                <div className={`flex items-center justify-between px-3 py-1.5 border-b ${
                  isDark
                    ? 'bg-gradient-to-b from-[#2a2a3e] to-[#25253a] border-white/10'
                    : 'bg-gradient-to-b from-gray-100 to-gray-200 border-gray-300'
                }`}>
                  <div className="flex items-center space-x-1.5">
                    <button onClick={openDemo} className="w-2.5 h-2.5 rounded-full bg-red-500 hover:bg-red-600 transition-colors" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  </div>
                  <span className={`text-[10px] font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Campus Guide Tutorial</span>
                  <div className="w-10" />
                </div>
                {/* Video Container */}
                <div className="relative bg-black overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&rel=0"
                    title="Campus Guide Demo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile search bar (below navbar on small screens) ──────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="absolute inset-0 z-40 flex flex-col justify-center gap-32 px-6 md:hidden pointer-events-none"
      >
        <h2 className={`font-bold tracking-tight text-left ${isDark ? 'text-white' : 'text-slate-900'}`}
          style={{ fontFamily: "'Playfair Display','Georgia',serif", fontSize: 'clamp(2.8rem, 12vw, 4.5rem)', lineHeight: 1.05 }}>
          Find Your<br/>Way
        </h2>
        <div className="search-hud-wrapper search-hud-navbar w-full max-w-md mx-auto pointer-events-auto">
          <SearchBar />
        </div>
        <h2 className={`font-bold tracking-tight text-right ${isDark ? 'text-white' : 'text-slate-900'}`}
          style={{ fontFamily: "'Playfair Display','Georgia',serif", fontSize: 'clamp(2.8rem, 12vw, 4.5rem)', lineHeight: 1.05 }}>
          Around<br/>Campus.
        </h2>
      </motion.div>

      {/* ── Bottom stats bar ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="absolute bottom-0 left-0 right-0 z-30 flex justify-center"
      >
        {/* Left outward corner notch */}
        <div className="flex-shrink-0 self-end" style={{
          width: 40,
          height: 40,
          marginRight: -1,
          background: isDark ? '#060c18' : '#ffffff',
          WebkitMaskImage: 'radial-gradient(circle 40px at 0% 0%, transparent 39.5px, black 40px)',
          maskImage: 'radial-gradient(circle 40px at 0% 0%, transparent 39.5px, black 40px)',
        }} />
        <div
          className="inline-flex items-center gap-5 sm:gap-10 px-10 py-4"
          style={{
            background: isDark
              ? '#060c18'
              : '#ffffff',
            border: 'none',
            borderRadius: '24px 24px 0 0',
          }}
        >
          {quickStats.map((stat) => (
            <div key={stat.label} className="stat-chip">
              <stat.icon className={`w-3 h-3 ${isDark ? 'text-cyan-400/90' : 'text-blue-600'}`} />
              <span className={`font-bold tabular-nums ${isDark ? 'text-white/90' : 'text-slate-900'}`}>
                <CountUpValue countTo={stat.countTo} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals} />
              </span>
              <span className={`uppercase tracking-[0.15em] hidden sm:inline ${isDark ? 'text-cyan-300/70' : 'text-slate-600/90'}`}>{stat.label}</span>
            </div>
          ))}
        </div>
        {/* Right outward corner notch */}
        <div className="flex-shrink-0 self-end" style={{
          width: 40,
          height: 40,
          marginLeft: -1,
          background: isDark ? '#060c18' : '#ffffff',
          WebkitMaskImage: 'radial-gradient(circle 40px at 100% 0%, transparent 39.5px, black 40px)',
          maskImage: 'radial-gradient(circle 40px at 100% 0%, transparent 39.5px, black 40px)',
        }} />
      </motion.div>

      {/* ── Left side items ───────────────────────────────────────────── */}
      <div className="absolute left-5 sm:left-8 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, duration: 0.5 }}>
          <div className="hud-side-label"><Layers className="w-3 h-3" /><span>EXPLORE</span></div>
        </motion.div>

        {/* Categories — compass toggle */}
        <motion.div ref={categoriesBtnRef} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, duration: 0.5 }}>
          <button onClick={openCompass} className="w-full text-left">
            <motion.div
              whileHover={{ scale: 1.05, x: 4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`hud-side-item group${compassOpen ? ' hud-side-item-active' : ''}`}
            >
              <div className="hud-side-icon"><LayoutGrid className="w-3.5 h-3.5" /></div>
              <span>Categories</span>
              <ChevronRight className={`w-3 h-3 ml-auto transition-all duration-300 ${compassOpen ? 'opacity-60 rotate-90' : 'opacity-0 group-hover:opacity-60'}`} />
            </motion.div>
          </button>
        </motion.div>

        {[
          { icon: MapPin, label: 'Pharmacies', to: '/pharmacies', delay: 1.0 },
          { icon: Search, label: 'Medicines', to: '/medicines', delay: 1.1 },
        ].map((item) => (
          <motion.div key={item.label} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: item.delay, duration: 0.5 }}>
            <Link to={item.to}>
              <motion.div whileHover={{ scale: 1.05, x: 4 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="hud-side-item group">
                <div className="hud-side-icon"><item.icon className="w-3.5 h-3.5" /></div>
                <span>{item.label}</span>
                <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-60 transition-opacity" />
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* ── Right side items ──────────────────────────────────────────── */}
      <div className="absolute right-5 sm:right-8 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-end gap-2">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, duration: 0.5 }}>
          <div className="hud-side-label"><Navigation2 className="w-3 h-3" /><span>NAVIGATE</span></div>
        </motion.div>
        {[
          { icon: Globe, label: '3D Map', href: 'https://earth.google.com/web/@5.65162219,-0.18694534,95.85505974a,152.56713881d,57.25032726y,91.66577259h,60t,0r/data=CgRCAggBMikKJwolCiExZUxIajdmX3V5QWZHQUYxbnZuRkhMWmFPMnhoa25JS0sgAToDCgEwQgIIAEoICIWEhuwEEAE', delay: 0.9 },
          { icon: Crosshair, label: 'About', to: '/about', delay: 1.0 },
          { icon: Activity, label: 'Contact', to: '/contact', delay: 1.1 },
        ].map((item) => {
          const inner = (
            <motion.div whileHover={{ scale: 1.05, x: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="hud-side-item group">
              <div className="hud-side-icon"><item.icon className="w-3.5 h-3.5" /></div>
              <span>{item.label}</span>
              <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-60 transition-opacity" />
            </motion.div>
          );
          return (
            <motion.div key={item.label} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: item.delay, duration: 0.5 }}>
              {item.href ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer">{inner}</a>
              ) : (
                <Link to={item.to!}>{inner}</Link>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ── Scanline overlay ───────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-50 scanline-overlay" />

      {/* ── ElevenLabs Voice Agent ─────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <elevenlabs-convai
          agent-id="agent_01jx5fv1kbech895mwad5nx8wb"
          avatar-orb-style="icon"
        ></elevenlabs-convai>
      </div>
    </div>
  </LayoutGroup>
  );
};
