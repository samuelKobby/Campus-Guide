import React from 'react';
import { QrCode, Check } from 'lucide-react';
import { usePWAInstallContext } from '../../context/PWAInstallContext';

interface InstallButtonProps {
  className?: string;
  showIcon?: boolean;
  text?: string;
  installedText?: string;
  onClick?: () => void;
}

export const InstallButton: React.FC<InstallButtonProps> = ({ 
  className = "", 
  showIcon = true,
  text = "Install App",
  installedText = "Installed",
  onClick
}) => {
  const { isInstalled, showInstall } = usePWAInstallContext();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    } else {
      showInstall();
    }
  };

  if (isInstalled) {
    return (
      <button
        disabled
        className={`flex items-center gap-2 opacity-70 cursor-not-allowed ${className}`}
        aria-label="App is installed"
      >
        {showIcon && <Check className="w-4 h-4" />}
        <span>{installedText}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 ${className}`}
      aria-label="Install App"
    >
      {showIcon && <QrCode className="w-4 h-4 transition-transform group-hover:scale-110" />}
      <span>{text}</span>
    </button>
  );
};
