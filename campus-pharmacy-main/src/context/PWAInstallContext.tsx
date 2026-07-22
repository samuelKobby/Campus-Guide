import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { usePWAInstall as usePWAInstallHook, PWAInstallState } from '../hooks/usePWAInstall';
import { InstallModal } from '../components/pwa/InstallModal';

interface PWAContextState extends PWAInstallState {
  isModalOpen: boolean;
  closeModal: () => void;
}

const PWAInstallContext = createContext<PWAContextState | undefined>(undefined);

export const PWAInstallProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const pwaState = usePWAInstallHook();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const showInstall = () => {
    // If Android with native prompt ready, prompt directly
    if (pwaState.platform === 'android' && pwaState.supportsNativeInstall) {
      pwaState.install();
    } else {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => setIsModalOpen(false);
  
  // Listen for installed state to show success toast and close modal
  useEffect(() => {
    if (pwaState.isInstalled && isModalOpen) {
      setIsModalOpen(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 5000);
    }
  }, [pwaState.isInstalled, isModalOpen]);

  const value = {
    ...pwaState,
    showInstall,
    isModalOpen,
    closeModal
  };

  return (
    <PWAInstallContext.Provider value={value}>
      {children}
      <InstallModal isOpen={isModalOpen} onClose={closeModal} pwaState={pwaState} />
      
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl z-[100] flex items-center gap-3 animate-[fade-in-up_0.3s_ease-out]">
          <span className="text-xl">🎉</span>
          <span className="font-medium">Campus Guide installed successfully.</span>
        </div>
      )}
    </PWAInstallContext.Provider>
  );
};

export const usePWAInstallContext = () => {
  const context = useContext(PWAInstallContext);
  if (context === undefined) {
    throw new Error('usePWAInstallContext must be used within a PWAInstallProvider');
  }
  return context;
};
