import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Copy, ExternalLink, Check } from 'lucide-react';

interface QRInstallProps {
  url: string;
}

export const QRInstall: React.FC<QRInstallProps> = ({ url }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <QRCodeCanvas
          value={url}
          size={200}
          level="H"
          includeMargin={true}
          fgColor="#0f172a"
          bgColor="#ffffff"
          style={{ width: '100%', height: 'auto', maxWidth: '200px' }}
        />
      </div>
      
      <p className="text-center text-gray-600 dark:text-gray-300 font-medium">
        Scan this QR Code with your phone to install Campus Guide.
      </p>

      <div className="flex w-full gap-3 mt-2">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied' : 'Copy Link'}
        </button>
        
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Open
        </a>
      </div>
    </div>
  );
};
