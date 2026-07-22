import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

interface InstallQrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallQrModal: React.FC<InstallQrModalProps> = ({
  isOpen,
  onClose,
}) => {
  const qrRef = React.useRef<HTMLDivElement>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);

  const siteUrl = "https://camp-guide.netlify.app";

  useEffect(() => {
    // Check if prompt was already captured globally
    if ((window as any).deferredInstallPrompt) {
      setDeferredPrompt((window as any).deferredInstallPrompt);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      (window as any).deferredInstallPrompt = e;
      setDeferredPrompt(e);
    };

    const installedHandler = () => setInstalled(true);

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleInstallClick = async () => {
    const prompt = deferredPrompt || (window as any).deferredInstallPrompt;
    if (!prompt) {
      // Fallback: tell user to use Chrome menu
      alert('To install: click the Chrome menu (⋮) → Cast, save and share → Install page as app');
      return;
    }
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') {
      setInstalled(true);
    }
    (window as any).deferredInstallPrompt = null;
    setDeferredPrompt(null);
  };

  const downloadQrCode = () => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'app-install-qr.png';
        link.click();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 z-50 w-96 max-w-[90vw]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">
            Install Campus Guide
          </h2>

          {/* Installed confirmation */}
          {installed && (
            <div className="w-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                ✓ App installed successfully!
              </p>
            </div>
          )}

          {/* QR Code */}
          <div
            ref={qrRef}
            className="bg-white p-4 rounded-lg border-2 border-gray-200"
          >
            <QRCodeCanvas
              value={siteUrl}
              size={200}
              level="H"
              includeMargin={true}
              fgColor="#000000"
              bgColor="#FFFFFF"
            />
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-xs">
            Scan with your phone camera to install on mobile, or click Download below to install on this device.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full">
            <button
              onClick={handleInstallClick}
              disabled={installed}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              {installed ? 'Installed' : 'Download'}
            </button>

            <button
              onClick={downloadQrCode}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors"
            >
              Save QR
            </button>
          </div>
        </div>
      </div>
    </>
  );
};