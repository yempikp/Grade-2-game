import React, { useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';

interface Category {
  id: string;
  label: string;
  color: string;
}

interface Item {
  id: string;
  text: string;
  categoryId: string;
}

interface SortingChallengeProps {
  categories: Category[];
  items: Item[];
  onComplete: (isCorrect: boolean) => void;
  isAnswered: boolean;
}

export const SortingChallenge: React.FC<SortingChallengeProps> = ({
  categories,
  items,
  onComplete,
  isAnswered,
}) => {
  // Map of itemId -> categoryId | null
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<boolean | null>(null);

  // Items still in the waiting dock
  const unplacedItems = items.filter((item) => !placements[item.id]);

  const handleSelectItem = (id: string) => {
    if (isAnswered) return;
    setSelectedItemId(selectedItemId === id ? null : id);
  };

  const handlePlaceInCategory = (catId: string) => {
    if (isAnswered) return;
    if (selectedItemId) {
      setPlacements((prev) => ({ ...prev, [selectedItemId]: catId }));
      setSelectedItemId(null);
    }
  };

  const handleRemoveFromCategory = (itemId: string) => {
    if (isAnswered) return;
    setPlacements((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  const handleReset = () => {
    if (isAnswered) return;
    setPlacements({});
    setSelectedItemId(null);
    setValidationResult(null);
  };

  const handleCheck = () => {
    // Check if every item is placed and in correct category
    const allPlaced = items.every((item) => placements[item.id]);
    if (!allPlaced) return;

    const allCorrect = items.every((item) => placements[item.id] === item.categoryId);
    setValidationResult(allCorrect);
    onComplete(allCorrect);
  };

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Category Drop Targets */}
      <div className={`grid grid-cols-1 ${categories.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
        {categories.map((cat) => {
          const catItems = items.filter((it) => placements[it.id] === cat.id);
          const isTargetActive = selectedItemId !== null && !isAnswered;

          return (
            <div
              key={cat.id}
              onClick={() => handlePlaceInCategory(cat.id)}
              className={`flex flex-col min-h-[170px] p-3 rounded-xl border-2 transition-all ${
                isTargetActive
                  ? 'border-indigo-400 bg-indigo-50/40 cursor-pointer shadow-xs scale-[1.01]'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">
                  {cat.label}
                </span>
                <span className="text-xs font-mono font-medium text-slate-400">
                  {catItems.length} items
                </span>
              </div>

              {/* Items in this category */}
              <div className="flex-1 flex flex-wrap gap-2 content-start">
                {catItems.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 italic">
                    {isTargetActive ? 'Click to drop selected word here' : 'Drop matching words here'}
                  </div>
                ) : (
                  catItems.map((item) => {
                    const isItemCorrect = validationResult !== null && item.categoryId === cat.id;
                    const isItemWrong = validationResult !== null && item.categoryId !== cat.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromCategory(item.id);
                        }}
                        disabled={isAnswered}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all ${
                          validationResult === null
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                            : isItemCorrect
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-rose-100 text-rose-900 border border-rose-300'
                        }`}
                        title={!isAnswered ? 'Click to put back' : undefined}
                      >
                        <span>{item.text}</span>
                        {!isAnswered && (
                          <span className="text-slate-400 hover:text-slate-600 text-[10px] ml-0.5">✕</span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dock of Words to be sorted */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-600">
            {unplacedItems.length > 0
              ? 'Select a word, then click a box above to place it:'
              : 'All words placed! Check your answers below:'}
          </span>
          {Object.keys(placements).length > 0 && !isAnswered && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2.5 min-h-[46px] items-center">
          {unplacedItems.length === 0 ? (
            <span className="text-xs font-medium text-emerald-700">
              Ready to verify! Click "Check Answers" below.
            </span>
          ) : (
            unplacedItems.map((item) => {
              const isSelected = selectedItemId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectItem(item.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-300 ring-offset-1 scale-105'
                      : 'bg-white text-slate-800 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {item.text}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Submit Button */}
      {!isAnswered && (
        <div className="flex justify-end mt-2">
          <button
            type="button"
            onClick={handleCheck}
            disabled={unplacedItems.length > 0}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Check className="w-4 h-4" />
            Check Answers
          </button>
        </div>
      )}
    </div>
  );
};
