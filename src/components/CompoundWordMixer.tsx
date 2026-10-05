import React, { useState } from 'react';
import { Plus, Sparkles, Check } from 'lucide-react';

interface CompoundWordMixerProps {
  word1: string;
  word2: string;
  compound: string;
  distractors: string[];
  meaning: string;
  onAnswerSubmit: (isCorrect: boolean) => void;
  isAnswered: boolean;
}

export const CompoundWordMixer: React.FC<CompoundWordMixerProps> = ({
  word1,
  word2,
  compound,
  distractors,
  meaning,
  onAnswerSubmit,
  isAnswered,
}) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const allChoices = React.useMemo(() => {
    return [compound, ...distractors].sort(() => Math.random() - 0.5);
  }, [compound, distractors]);

  const handleSelect = (choice: string) => {
    if (isAnswered) return;
    setSelectedWord(choice);
    const correct = choice.toLowerCase() === compound.toLowerCase();
    onAnswerSubmit(correct);
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* Visual Word Mixer Equation */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 p-5 bg-amber-50/70 border border-amber-200/80 rounded-2xl w-full max-w-lg">
        {/* Word 1 */}
        <div className="flex flex-col items-center">
          <div className="px-4 py-2.5 bg-white border border-amber-300 rounded-xl shadow-xs text-base sm:text-lg font-bold text-amber-950 font-display">
            {word1}
          </div>
        </div>

        {/* Plus Symbol */}
        <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center shadow-xs shrink-0">
          <Plus className="w-4 h-4 stroke-[3]" />
        </div>

        {/* Word 2 */}
        <div className="flex flex-col items-center">
          <div className="px-4 py-2.5 bg-white border border-amber-300 rounded-xl shadow-xs text-base sm:text-lg font-bold text-amber-950 font-display">
            {word2}
          </div>
        </div>

        {/* Equals Sign */}
        <div className="text-xl sm:text-2xl font-bold text-amber-900 shrink-0">=</div>

        {/* Result Oven Slot */}
        <div className="flex flex-col items-center">
          <div className={`px-4 py-2.5 border-2 rounded-xl text-base sm:text-lg font-bold font-display transition-all ${
            selectedWord
              ? selectedWord.toLowerCase() === compound.toLowerCase()
                ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                : 'bg-rose-100 border-rose-400 text-rose-900'
              : 'bg-white/80 border-dashed border-amber-300 text-amber-400'
          }`}>
            {selectedWord || '?'}
          </div>
        </div>
      </div>

      {/* Meaning Clue */}
      <div className="text-xs sm:text-sm text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-lg max-w-md text-center">
        <span className="font-semibold text-slate-800">Clue: </span>
        {meaning}
      </div>

      {/* Choice Options */}
      <div className="w-full max-w-md">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">
          Choose the combined compound word:
        </div>
        <div className="grid grid-cols-2 gap-3">
          {allChoices.map((choice) => {
            const isChosen = selectedWord === choice;
            const isTarget = choice.toLowerCase() === compound.toLowerCase();

            let btnStyle = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800';
            if (isAnswered) {
              if (isTarget) {
                btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-sm';
              } else if (isChosen && !isTarget) {
                btnStyle = 'bg-rose-500 text-white border-rose-600';
              } else {
                btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
              }
            } else if (isChosen) {
              btnStyle = 'bg-indigo-600 text-white border-indigo-700';
            }

            return (
              <button
                key={choice}
                type="button"
                onClick={() => handleSelect(choice)}
                disabled={isAnswered}
                className={`py-3 px-4 rounded-xl border text-sm sm:text-base font-bold shadow-xs transition-all flex items-center justify-center gap-2 ${btnStyle}`}
              >
                <span>{choice}</span>
                {isAnswered && isTarget && <Sparkles className="w-4 h-4 text-amber-200" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
