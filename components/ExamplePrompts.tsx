import React, { useState } from 'react';
import { Music, Zap, Mountain } from 'lucide-react';

type ExampleType = 'acoustic' | 'electronic' | 'nature';

export const ExamplePrompts: React.FC = () => {
  const [active, setActive] = useState<ExampleType>('acoustic');

  const examples = {
    acoustic: {
      label: 'Acoustic',
      icon: Music,
      text: "Tempo: 95 BPM, Andante\nKey: G Major\nVibe: Warm, Folk, Intimate\nMood: Nostalgic\n\nPrompt:\nAn intimate acoustic guitar performance featuring fingerpicked patterns in G major. The timbre is warm and woody, capturing the sound of fingers sliding on strings. A subtle, soft shaker enters in the background, creating a gentle, rhythmic folk atmosphere evocative of a quiet Sunday morning."
    },
    electronic: {
      label: 'Electronic',
      icon: Zap,
      text: "Tempo: 128 BPM, Driving\nKey: F Minor\nVibe: Cyberpunk, Industrial\nMood: Intense\n\nPrompt:\nA high-energy electronic track anchored by a distorted, saw-tooth bassline and a punchy four-on-the-floor kick. Glitchy hi-hats skitter across the stereo field, while cold, digital synthesizer pads swell in the breakdown, building tension before a heavy, bass-heavy drop."
    },
    nature: {
      label: 'Nature',
      icon: Mountain,
      text: "Tempo: N/A\nKey: N/A\nVibe: Organic, Spacious\nMood: Peaceful\n\nPrompt:\nA 3D audio recording of a coastline. Rhythmic waves crash gently against rocky shores with varying intensity. Distant gulls cry out, their sound reverberating slightly. The wind howls softly through dune grass, providing a constant white-noise undercurrent to the sporadic water sounds."
    }
  };

  return (
    <div className="mt-6 border-t border-slate-700/50 pt-5">
       <div className="flex items-center justify-between mb-3">
         <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Example Outputs</p>
       </div>
       
       <div className="flex gap-2 mb-3">
         {(Object.keys(examples) as ExampleType[]).map((key) => {
            const isSelected = active === key;
            const Icon = examples[key].icon;
            return (
                <button
                    key={key}
                    onClick={() => setActive(key)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border
                        ${isSelected 
                          ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30 shadow-sm' 
                          : 'bg-slate-800/50 text-slate-500 border-slate-700/50 hover:bg-slate-800 hover:text-slate-300 hover:border-slate-600'}
                    `}
                >
                    <Icon className="w-3.5 h-3.5" />
                    {examples[key].label}
                </button>
            )
         })}
       </div>
       
       <div className="bg-slate-950/30 rounded-lg p-4 border border-slate-800/50 text-xs text-slate-400 font-mono leading-relaxed whitespace-pre-wrap h-48 overflow-y-auto custom-scrollbar shadow-inner">
            {examples[active].text}
       </div>
    </div>
  );
};