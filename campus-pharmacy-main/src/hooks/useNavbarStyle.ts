import { useLocation } from 'react-router-dom';
import { useScrollPosition } from './useScrollPosition';

export const useNavbarStyle = (isMenuOpen: boolean) => {
  const location = useLocation();
  const scrollPosition = useScrollPosition();

  const baseClasses = 'fixed top-0 left-0 right-0 z-50 transition-all duration-300 hud-navbar';

  const scrolled   = scrollPosition >= 50;
  const heroHeight = typeof window !== 'undefined' ? window.innerHeight * 0.85 : 600;
  const pastHero   = scrollPosition > heroHeight;

  return {
    navbarClass: `${baseClasses}${scrolled ? ' hud-navbar-scrolled' : ''}${pastHero ? ' -translate-y-full pointer-events-none' : ''}`,
    isTransparent: !scrolled,
  };
};