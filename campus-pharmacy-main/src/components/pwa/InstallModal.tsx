import React, { useEffect, useRef } from 'react';
import { X, Download, Laptop } from 'lucide-react';
import { PWAInstallState } from '../../hooks/usePWAInstall';
import { QRInstall } from './QRInstall';
import { IOSInstallGuide } from './IOSInstallGuide';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  pwaState: PWAInstallState;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose, pwaState }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const siteUrl = "https://camp-guide.netlify.app";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderContent = () => {
    if (pwaState.platform === 'ios') {
      return <IOSInstallGuide />;
    }

    if (pwaState.platform.startsWith('desktop')) {
      return (
        <div className="flex flex-col items-center w-full gap-6 animate-in fade-in zoom-in duration-300">
          <QRInstall url={siteUrl} />
          
          {pwaState.supportsNativeInstall && (
            <div className="w-full mt-2 pt-6 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => {
                  pwaState.install();
                  if (pwaState.isInstalled) onClose();
                }}
                disabled={pwaState.isInstalling}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
              >
                {pwaState.isInstalling ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Laptop className="w-5 h-5" />
                    Install on this computer
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      );
    }

    // Default Android or unrecognized where native prompt isn't immediately available
    return (
      <div className="flex flex-col items-center w-full gap-6 animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-2xl flex items-center justify-center mb-2">
          <Download className="w-8 h-8" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Install Campus Guide
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
            Install our app for a faster, better experience with offline support.
          </p>
        </div>

        {pwaState.supportsNativeInstall ? (
          <button
            onClick={() => {
              pwaState.install();
              if (pwaState.isInstalled) onClose();
            }}
            disabled={pwaState.isInstalling}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white rounded-xl font-bold transition-all transform active:scale-95"
          >
            {pwaState.isInstalling ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Install App'
            )}
          </button>
        ) : (
          <div className="w-full bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl text-center">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              To install, click your browser menu (⋮) and select <br />
              <span className="font-semibold">"Install App"</span> or <span className="font-semibold">"Add to Home Screen"</span>.
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 transition-opacity animate-in fade-in duration-200"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div 
        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4 sm:p-6"
      >
        {/* Modal Dialog */}
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-modal-title"
          tabIndex={-1}
          className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 shadow-2xl rounded-3xl w-full max-w-md p-6 relative pointer-events-auto flex flex-col items-center transition-all duration-300 animate-in zoom-in-95 fade-in"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div id="install-modal-title" className="w-full mt-2">
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
};
