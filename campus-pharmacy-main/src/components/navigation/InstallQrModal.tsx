import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

interface InstallQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  downloadUrl: string;
}

export const InstallQrModal: React.FC<InstallQrModalProps> = ({
  isOpen,
  onClose,
  downloadUrl
}) => {
  const qrRef = React.useRef<HTMLDivElement>(null);

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
            Scan to Install Campus Guide
          </h2>

          {/* QR Code */}
          <div 
            ref={qrRef}
            className="bg-white p-4 rounded-lg border-2 border-gray-200"
          >
            <QRCodeCanvas
              value={downloadUrl}
              size={256}
              level="H"
              includeMargin={true}
              fgColor="#000000"
              bgColor="#FFFFFF"
            />
          </div>

          {/* Instructions */}
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-xs">
            Use your phone camera or QR code scanner to download and install the Campus Guide app instantly.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full">
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-center"
            >
              Download
            </a>
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
