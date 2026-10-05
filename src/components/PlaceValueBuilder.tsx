import React, { useState } from 'react';
import { Plus, Minus, Check } from 'lucide-react';

interface PlaceValueBuilderProps {
  targetNumber?: number;
  mode: 'build' | 'identify';
  initialHundreds?: number;
  initialTens?: number;
  initialOnes?: number;
  onAnswerSubmit?: (answer: number) => void;
  isAnswered?: boolean;
}

export const PlaceValueBuilder: React.FC<PlaceValueBuilderProps> = ({
  targetNumber,
  mode,
  initialHundreds = 0,
  initialTens = 0,
  initialOnes = 0,
  onAnswerSubmit,
  isAnswered = false,
}) => {
  const [hundreds, setHundreds] = useState(mode === 'identify' ? initialHundreds : 0);
  const [tens, setTens] = useState(mode === 'identify' ? initialTens : 0);
  const [ones, setOnes] = useState(mode === 'identify' ? initialOnes : 0);

  const currentTotal = hundreds * 100 + tens * 10 + ones;

  const handleAdjust = (type: 'h' | 't' | 'o', delta: number) => {
    if (isAnswered || mode === 'identify') return;
    if (type === 'h') setHundreds((h) => Math.max(0, Math.min(9, h + delta)));
    if (type === 't') setTens((t) => Math.max(0, Math.min(9, t + delta)));
    if (type === 'o') setOnes((o) => Math.max(0, Math.min(9, o + delta)));
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Visual Blocks Display */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl mb-4">
        {/* Hundreds (Flats: 10x10) */}
        <div className="flex flex-col items-center bg-white p-3 rounded-lg border border-slate-100 shadow-xs">
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-2">
            Hundreds ({hundreds}) · Value: {hundreds * 100}
          </div>
          <div className="min-h-[90px] flex flex-wrap gap-1.5 items-center justify-center p-2">
            {hundreds === 0 ? (
              <span className="text-xs text-slate-400 italic">No hundreds</span>
            ) : (
              Array.from({ length: hundreds }).map((_, idx) => (
                <div
                  key={`h-${idx}`}
                  title="1 Hundred Flat (100)"
                  className="w-12 h-12 bg-emerald-100 border border-emerald-400 rounded-xs grid grid-cols-5 grid-rows-5 gap-[1px] p-[1px] shadow-xs"
                >
                  {Array.from({ length: 25 }).map((_, cIdx) => (
                    <div key={cIdx} className="bg-emerald-300 rounded-[0.5px]" />
                  ))}
                </div>
              ))
            )}
          </div>
          {mode === 'build' && !isAnswered && (
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => handleAdjust('h', -1)}
                disabled={hundreds <= 0}
                className="w-8 h-8 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-30 flex items-center justify-center transition-colors"
                aria-label="Decrease hundreds"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-bold text-slate-800">{hundreds}</span>
              <button
                type="button"
                onClick={() => handleAdjust('h', 1)}
                disabled={hundreds >= 9}
                className="w-8 h-8 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-30 flex items-center justify-center transition-colors"
                aria-label="Increase hundreds"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Tens (Rods: 1x10) */}
        <div className="flex flex-col items-center bg-white p-3 rounded-lg border border-slate-100 shadow-xs">
          <div className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-2">
            Tens ({tens}) · Value: {tens * 10}
          </div>
          <div className="min-h-[90px] flex flex-wrap gap-1.5 items-center justify-center p-2">
            {tens === 0 ? (
              <span className="text-xs text-slate-400 italic">No tens</span>
            ) : (
              Array.from({ length: tens }).map((_, idx) => (
                <div
                  key={`t-${idx}`}
                  title="1 Ten Rod (10)"
                  className="w-3.5 h-16 bg-amber-100 border border-amber-400 rounded-xs flex flex-col justify-between p-[1px] shadow-xs"
                >
                  {Array.from({ length: 8 }).map((_, rIdx) => (
                    <div key={rIdx} className="h-1 bg-amber-300 rounded-[0.5px]" />
                  ))}
                </div>
              ))
            )}
          </div>
          {mode === 'build' && !isAnswered && (
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => handleAdjust('t', -1)}
                disabled={tens <= 0}
                className="w-8 h-8 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-30 flex items-center justify-center transition-colors"
                aria-label="Decrease tens"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-bold text-slate-800">{tens}</span>
              <button
                type="button"
                onClick={() => handleAdjust('t', 1)}
                disabled={tens >= 9}
                className="w-8 h-8 rounded-md bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-30 flex items-center justify-center transition-colors"
                aria-label="Increase tens"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Ones (Single cubes) */}
        <div className="flex flex-col items-center bg-white p-3 rounded-lg border border-slate-100 shadow-xs">
          <div className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-2">
            Ones ({ones}) · Value: {ones}
          </div>
          <div className="min-h-[90px] flex flex-wrap gap-1.5 items-center justify-center p-2 max-w-[140px]">
            {ones === 0 ? (
              <span className="text-xs text-slate-400 italic">No ones</span>
            ) : (
              Array.from({ length: ones }).map((_, idx) => (
                <div
                  key={`o-${idx}`}
                  title="1 Unit Cube (1)"
                  className="w-3.5 h-3.5 bg-blue-400 border border-blue-600 rounded-[1px] shadow-xs"
                />
              ))
            )}
          </div>
          {mode === 'build' && !isAnswered && (
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => handleAdjust('o', -1)}
                disabled={ones <= 0}
                className="w-8 h-8 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-30 flex items-center justify-center transition-colors"
                aria-label="Decrease ones"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-bold text-slate-800">{ones}</span>
              <button
                type="button"
                onClick={() => handleAdjust('o', 1)}
                disabled={ones >= 9}
                className="w-8 h-8 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-30 flex items-center justify-center transition-colors"
                aria-label="Increase ones"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tally / Build submit */}
      {mode === 'build' && !isAnswered && (
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="text-sm font-semibold text-slate-700">
            Current Built Total:{' '}
            <span className="text-lg font-bold font-mono text-emerald-700">
              {currentTotal}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onAnswerSubmit?.(currentTotal)}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition-colors text-sm"
          >
            <Check className="w-4 h-4" />
            Check My Blocks
          </button>
        </div>
      )}
    </div>
  );
};
