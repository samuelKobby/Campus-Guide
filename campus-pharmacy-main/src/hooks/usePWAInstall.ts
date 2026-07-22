import { useState, useEffect, useCallback } from 'react';
import { getPlatform, getBrowser, isStandalone } from '../utils/pwa';

export interface PWAInstallState {
  canInstall: boolean;
  isInstalled: boolean;
  platform: string;
  browser: string;
  showInstall: () => void;
  install: () => Promise<void>;
  deferredPrompt: any;
  supportsNativeInstall: boolean;
  isInstalling: boolean;
}

export const usePWAInstall = (): PWAInstallState => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isInstalling, setIsInstalling] = useState<boolean>(false);
  
  // Modal state - this will be managed by Context or components utilizing this hook
  
  useEffect(() => {
    // Initial check
    setIsInstalled(isStandalone());
    
    // Store global deferred prompt if it was already fired before react mounted
    if ((window as any).deferredInstallPrompt) {
      setDeferredPrompt((window as any).deferredInstallPrompt);
    }
    
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      (window as any).deferredInstallPrompt = e;
    };
    
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      (window as any).deferredInstallPrompt = null;
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    
    // MatchMedia listener for changes in display-mode (e.g. user installs and launches)
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      setIsInstalled(e.matches || (window.navigator as any).standalone === true);
    };
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaQueryChange);
    } else {
      // Fallback for older Safari
      mediaQuery.addListener(handleMediaQueryChange);
    }
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaQueryChange);
      } else {
        mediaQuery.removeListener(handleMediaQueryChange);
      }
    };
  }, []);
  
  const platform = getPlatform();
  const browser = getBrowser();
  
  const supportsNativeInstall = deferredPrompt !== null;
  const canInstall = !isInstalled && (supportsNativeInstall || platform === 'ios' || platform.startsWith('desktop'));
  
  const install = useCallback(async () => {
    if (!deferredPrompt) return;
    
    setIsInstalling(true);
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        (window as any).deferredInstallPrompt = null;
      }
    } catch (err) {
      console.error('Installation failed:', err);
    } finally {
      setIsInstalling(false);
    }
  }, [deferredPrompt]);
  
  // We'll return a placeholder `showInstall` that should be overridden by Context
  return {
    canInstall,
    isInstalled,
    platform,
    browser,
    showInstall: () => {}, // To be provided by context
    install,
    deferredPrompt,
    supportsNativeInstall,
    isInstalling
  };
};
