import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onClose: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onClose }) => {
  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 animate-in slide-in-from-top-2">
      <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
      <div className="flex-grow">
        <h4 className="font-medium text-red-400 text-sm">Error</h4>
        <p className="text-red-300/80 text-sm mt-1">{message}</p>
      </div>
      <button 
        onClick={onClose}
        className="text-red-400 hover:text-red-300 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};