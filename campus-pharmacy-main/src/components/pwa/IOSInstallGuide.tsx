import React from 'react';
import { Share, PlusSquare } from 'lucide-react';

export const IOSInstallGuide: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in zoom-in duration-300">
      <div className="text-center">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          Install on iOS
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Follow these quick steps to install Campus Guide on your iPhone or iPad.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
            <Share className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              1. Tap the Share button
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              It's at the bottom or top of your screen
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
            <div className="w-5 h-5 border-2 border-indigo-600 dark:border-indigo-400 rounded-sm flex flex-col items-center justify-center">
              <span className="text-[10px] leading-none font-bold text-indigo-600 dark:text-indigo-400">+</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              2. Scroll down & Tap
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Select "Add to Home Screen"
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
            <PlusSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              3. Tap Add
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Confirm to install the app
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
