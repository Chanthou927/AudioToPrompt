import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 z-10 bg-slate-900/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-center p-6">
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
        <Loader2 className="w-12 h-12 text-emerald-400 animate-spin relative z-10" />
      </div>
      <h3 className="text-xl font-semibold text-white mt-6">Analyzing Audio...</h3>
      <p className="text-slate-400 mt-2 max-w-xs">
        Gemini is listening to your track and identifying instruments, mood, and style.
      </p>
    </div>
  );
};