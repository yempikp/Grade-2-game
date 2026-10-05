import React from 'react';
import { Volume2, VolumeX, Star, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentTab: 'quest' | 'arcade' | 'dex' | 'trophies';
  onSelectTab: (tab: 'quest' | 'arcade' | 'dex' | 'trophies') => void;
  totalStars: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  totalStars,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark in display face */}
        <button
          type="button"
          onClick={() => onSelectTab('quest')}
          className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 font-display flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="w-7 h-7 rounded-lg bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-sm shadow-xs">
            2
          </span>
          <span>Grade 2 Super Quest</span>
        </button>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => onSelectTab('quest')}
            className={`transition-colors relative py-1 ${
              currentTab === 'quest'
                ? 'text-indigo-600'
                : 'hover:text-slate-900'
            }`}
          >
            Quest Map
            {currentTab === 'quest' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
            )}
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('arcade')}
            className={`transition-colors relative py-1 ${
              currentTab === 'arcade'
                ? 'text-indigo-600'
                : 'hover:text-slate-900'
            }`}
          >
            Arcade Blitz
            {currentTab === 'arcade' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
            )}
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('dex')}
            className={`transition-colors relative py-1 ${
              currentTab === 'dex'
                ? 'text-indigo-600'
                : 'hover:text-slate-900'
            }`}
          >
            Learning Dex
            {currentTab === 'dex' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
            )}
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('trophies')}
            className={`transition-colors relative py-1 ${
              currentTab === 'trophies'
                ? 'text-indigo-600'
                : 'hover:text-slate-900'
            }`}
          >
            Trophy Room
            {currentTab === 'trophies' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions (Star score & Audio toggle) */}
        <div className="flex items-center gap-3">
          {/* Star Tally */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs font-bold font-mono">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>{totalStars}</span>
            <span className="hidden sm:inline text-amber-700/80 font-sans font-medium text-[11px]">Stars</span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-indigo-600" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100 bg-white text-xs font-semibold text-slate-600">
        <button
          type="button"
          onClick={() => onSelectTab('quest')}
          className={`py-1 px-2 ${currentTab === 'quest' ? 'text-indigo-600 font-bold' : ''}`}
        >
          Quest Map
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('arcade')}
          className={`py-1 px-2 ${currentTab === 'arcade' ? 'text-indigo-600 font-bold' : ''}`}
        >
          Arcade
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('dex')}
          className={`py-1 px-2 ${currentTab === 'dex' ? 'text-indigo-600 font-bold' : ''}`}
        >
          Learning Dex
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('trophies')}
          className={`py-1 px-2 ${currentTab === 'trophies' ? 'text-indigo-600 font-bold' : ''}`}
        >
          Trophies
        </button>
      </div>
    </header>
  );
};
