import React, { useState } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';

interface ResultCardProps {
  prompt: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ prompt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex-grow relative group">
        <textarea
          readOnly
          value={prompt}
          className="w-full h-full min-h-[300px] bg-slate-900/50 border border-slate-700/50 rounded-xl p-5 text-slate-200 leading-relaxed resize-none focus:outline-none focus:border-indigo-500/50 transition-colors font-light custom-scrollbar"
        />
        <div className="absolute bottom-4 right-4">
          <button
            onClick={handleCopy}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm shadow-lg transition-all
              ${copied 
                ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/25'
              }
            `}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Prompt
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="mt-4 flex items-start gap-3 p-3 bg-yellow-500/5 rounded-lg border border-yellow-500/10">
        <Sparkles className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
        <p className="text-xs text-yellow-200/70">
          This prompt is optimized for generative AI. You can use it in text-to-audio models like AudioLDM, MusicLM, or even image generators to visualize the sound.
        </p>
      </div>
    </div>
  );
};