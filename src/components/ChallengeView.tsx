import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Realm, Level, Challenge, UserProgress } from '../types/game';
import { InteractiveClock } from './InteractiveClock';
import { PlaceValueBuilder } from './PlaceValueBuilder';
import { SortingChallenge } from './SortingChallenge';
import { CompoundWordMixer } from './CompoundWordMixer';
import {
  playSuccessSound,
  playErrorSound,
  playClickSound,
  playCoinSound,
  playLevelVictorySound,
  speakText,
  stopSpeaking,
} from '../utils/sound';
import {
  Volume2,
  VolumeX,
  ArrowLeft,
  Star,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Award,
} from 'lucide-react';

interface ChallengeViewProps {
  realm: Realm;
  level: Level;
  progress: UserProgress;
  onFinishLevel: (levelId: string, stars: number, coins: number) => void;
  onBackToMap: () => void;
  soundEnabled: boolean;
}

export const ChallengeView: React.FC<ChallengeViewProps> = ({
  realm,
  level,
  progress,
  onFinishLevel,
  onBackToMap,
  soundEnabled,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isLevelComplete, setIsLevelComplete] = useState(false);

  const challenges = level.challenges;
  const currentChallenge: Challenge = challenges[currentIdx] || challenges[0];

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  // Handle multiple-choice option click
  const handleSelectOption = (optionId: string, correct: boolean) => {
    if (isAnswered) return;
    playClickSound(soundEnabled);
    setSelectedOptionId(optionId);
    setIsAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      playSuccessSound(soundEnabled);
      setCorrectCount((prev) => prev + 1);
    } else {
      playErrorSound(soundEnabled);
    }
  };

  // Handle generic completion from custom components (clock, sorting, compound words)
  const handleGenericComplete = (correct: boolean) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      playSuccessSound(soundEnabled);
      setCorrectCount((prev) => prev + 1);
    } else {
      playErrorSound(soundEnabled);
    }
  };

  // Next Challenge or Finish Level
  const handleNext = () => {
    stopSpeaking();
    playClickSound(soundEnabled);

    if (currentIdx + 1 < challenges.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      // Complete level
      const total = challenges.length;
      let earnedStars = 1;
      const ratio = (correctCount + (isCorrect ? 1 : 0)) / total;
      if (ratio >= 0.9) earnedStars = 3;
      else if (ratio >= 0.6) earnedStars = 2;

      const earnedCoins = earnedStars * 15;

      setIsLevelComplete(true);
      playLevelVictorySound(soundEnabled);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        console.debug('Confetti error:', err);
      }

      onFinishLevel(level.id, earnedStars, earnedCoins);
    }
  };

  // Restart level
  const handleRestart = () => {
    stopSpeaking();
    setCurrentIdx(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setCorrectCount(0);
    setIsLevelComplete(false);
  };

  // Voice reading
  const handleSpeak = () => {
    const textToSpeak = `${currentChallenge.prompt}. ${
      currentChallenge.subPrompt ? currentChallenge.subPrompt : ''
    }`;
    speakText(textToSpeak);
  };

  if (isLevelComplete) {
    const total = challenges.length;
    const finalScore = correctCount;
    let stars = 1;
    if (finalScore === total) stars = 3;
    else if (finalScore >= total * 0.6) stars = 2;

    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-6">
        <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-6">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl mx-auto flex items-center justify-center shadow-xs">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900 font-display">
              Level Complete!
            </h2>
            <p className="text-slate-600 text-sm">
              You finished <span className="font-semibold text-slate-800">{level.title}</span> in{' '}
              {realm.name}!
            </p>
          </div>

          {/* Star Display */}
          <div className="flex items-center justify-center gap-3 py-2">
            {[1, 2, 3].map((starIdx) => (
              <Star
                key={starIdx}
                className={`w-10 h-10 transition-all ${
                  stars >= starIdx
                    ? 'fill-amber-400 text-amber-500 scale-110 drop-shadow-sm'
                    : 'fill-slate-100 text-slate-300'
                }`}
              />
            ))}
          </div>

          <div className="text-xs text-slate-500 font-mono">
            Score: {finalScore} of {total} correct · +{stars * 15} Quest Coins
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleRestart}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Replay Level
            </button>
            <button
              type="button"
              onClick={onBackToMap}
              className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Back to Quest Map</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            stopSpeaking();
            onBackToMap();
          }}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Map</span>
        </button>

        <div className="flex items-center gap-4 text-xs">
          <span className="font-bold text-slate-700 font-display">
            {realm.name} · {level.title}
          </span>
          <span className="font-mono text-slate-400">
            {currentIdx + 1} / {challenges.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
        <div
          className="bg-indigo-600 h-full transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / challenges.length) * 100}%` }}
        />
      </div>

      {/* Main Challenge Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Question Header & Speak Button */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display leading-snug">
              {currentChallenge.prompt}
            </h2>

            <button
              type="button"
              onClick={handleSpeak}
              className="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition-colors shrink-0 flex items-center gap-1.5 text-xs font-bold"
              title="Read question aloud"
            >
              <Volume2 className="w-5 h-5" />
              <span className="hidden sm:inline">Read Aloud</span>
            </button>
          </div>

          {currentChallenge.subPrompt && (
            <p className="text-sm text-slate-500 leading-relaxed">
              {currentChallenge.subPrompt}
            </p>
          )}
        </div>

        {/* Dynamic Interactive Body based on Challenge Type */}
        <div className="py-2">
          {/* 1. CLOCK CHALLENGE */}
          {currentChallenge.type === 'clock' && (
            <div className="flex flex-col items-center gap-6">
              <InteractiveClock
                hours={currentChallenge.targetHours}
                minutes={currentChallenge.targetMinutes}
                size={230}
              />

              {currentChallenge.mode === 'read' && currentChallenge.options && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-md">
                  {currentChallenge.options.map((opt) => {
                    const isSelected = selectedOptionId === opt;
                    const isTarget =
                      opt ===
                      `${currentChallenge.targetHours}:${String(
                        currentChallenge.targetMinutes
                      ).padStart(2, '0')}`;

                    let btnClass = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800';
                    if (isAnswered) {
                      if (isTarget) btnClass = 'bg-emerald-500 text-white border-emerald-600';
                      else if (isSelected && !isTarget) btnClass = 'bg-rose-500 text-white border-rose-600';
                      else btnClass = 'bg-slate-100 text-slate-400 opacity-60';
                    }

                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setSelectedOptionId(opt);
                          handleGenericComplete(isTarget);
                        }}
                        disabled={isAnswered}
                        className={`py-3 px-4 rounded-xl border-2 text-base font-bold font-mono transition-all ${btnClass}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 2. PLACE VALUE CHALLENGE */}
          {currentChallenge.type === 'place-value' && (
            <div className="flex flex-col items-center gap-6">
              <PlaceValueBuilder
                mode={currentChallenge.mode}
                targetNumber={currentChallenge.targetNumber}
                initialHundreds={currentChallenge.hundreds}
                initialTens={currentChallenge.tens}
                initialOnes={currentChallenge.ones}
                isAnswered={isAnswered}
                onAnswerSubmit={(builtNum) => {
                  const correct = builtNum === currentChallenge.targetNumber;
                  handleGenericComplete(correct);
                }}
              />

              {currentChallenge.mode === 'identify' && currentChallenge.options && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-md mt-2">
                  {currentChallenge.options.map((opt) => {
                    const isSelected = selectedOptionId === String(opt);
                    const isTarget = opt === currentChallenge.targetNumber;

                    let btnClass = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800';
                    if (isAnswered) {
                      if (isTarget) btnClass = 'bg-emerald-500 text-white border-emerald-600';
                      else if (isSelected && !isTarget) btnClass = 'bg-rose-500 text-white border-rose-600';
                      else btnClass = 'bg-slate-100 text-slate-400 opacity-60';
                    }

                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setSelectedOptionId(String(opt));
                          handleGenericComplete(isTarget);
                        }}
                        disabled={isAnswered}
                        className={`py-3 px-4 rounded-xl border-2 text-lg font-bold font-mono transition-all ${btnClass}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 3. SORTING CHALLENGE */}
          {currentChallenge.type === 'sorting' && (
            <SortingChallenge
              categories={currentChallenge.categories}
              items={currentChallenge.items}
              isAnswered={isAnswered}
              onComplete={(correct) => handleGenericComplete(correct)}
            />
          )}

          {/* 4. COMPOUND WORD CHALLENGE */}
          {currentChallenge.type === 'compound-word' && (
            <CompoundWordMixer
              word1={currentChallenge.word1}
              word2={currentChallenge.word2}
              compound={currentChallenge.compound}
              distractors={currentChallenge.distractors}
              meaning={currentChallenge.meaning}
              isAnswered={isAnswered}
              onAnswerSubmit={(correct) => handleGenericComplete(correct)}
            />
          )}

          {/* 5. MULTIPLE CHOICE CHALLENGE */}
          {currentChallenge.type === 'multiple-choice' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentChallenge.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                let btnStyle = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800';

                if (isAnswered) {
                  if (option.isCorrect) {
                    btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-sm';
                  } else if (isSelected && !option.isCorrect) {
                    btnStyle = 'bg-rose-500 text-white border-rose-600';
                  } else {
                    btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
                  }
                }

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelectOption(option.id, option.isCorrect)}
                    disabled={isAnswered}
                    className={`p-4 rounded-xl border-2 text-left text-sm sm:text-base font-semibold shadow-xs transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                  >
                    <span>{option.text}</span>
                    {isAnswered && option.isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                    )}
                    {isAnswered && isSelected && !option.isCorrect && (
                      <XCircle className="w-5 h-5 text-white shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Immediate Educational Explanation Callout */}
        {isAnswered && (
          <div
            className={`p-4 sm:p-5 rounded-2xl border text-sm space-y-2 animate-fadeIn ${
              isCorrect
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : 'bg-amber-50/80 border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-base font-display">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Spot on! Great thinking!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <span>Good try! Here is how it works:</span>
                </>
              )}
            </div>
            <p className="text-slate-700 leading-relaxed text-sm">
              {currentChallenge.explanation}
            </p>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <span>{currentIdx + 1 < challenges.length ? 'Next Question' : 'Complete Level'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
