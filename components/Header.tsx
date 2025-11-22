import React from 'react';
import { Mic2, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 rounded-full"></div>
            <div className="bg-indigo-600 p-2 rounded-xl relative z-10">
              <Mic2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              AudioToPrompt
            </h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide">AI AUDIO ANALYZER</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-400 bg-slate-900 py-1 px-3 rounded-full border border-slate-800">
          <Sparkles className="w-3 h-3 text-yellow-500" />
          <span>Powered by Gemini 2.5</span>
        </div>
      </div>
    </header>
  );
};