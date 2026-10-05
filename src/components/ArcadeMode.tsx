import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  playSuccessSound,
  playErrorSound,
  playClickSound,
  playCoinSound,
  playLevelVictorySound,
} from '../utils/sound';
import { UserProgress } from '../types/game';
import {
  Flame,
  Trophy,
  RotateCcw,
  Sparkles,
  Zap,
  Timer,
  Check,
  X,
  Play,
  Volume2,
} from 'lucide-react';

interface ArcadeModeProps {
  progress: UserProgress;
  onUpdateHighScore: (gameKey: 'mathSprint' | 'wordSorter' | 'clockFrenzy', score: number) => void;
  soundEnabled: boolean;
}

type ArcadeGameType = 'menu' | 'math' | 'grammar';

export const ArcadeMode: React.FC<ArcadeModeProps> = ({
  progress,
  onUpdateHighScore,
  soundEnabled,
}) => {
  const [activeGame, setActiveGame] = useState<ArcadeGameType>('menu');
  const [timeLeft, setTimeLeft] = useState(45);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Math Sprint state
  const [mathProblem, setMathProblem] = useState<{ num1: number; num2: number; op: string; answer: number; options: number[] }>({
    num1: 12,
    num2: 8,
    op: '+',
    answer: 20,
    options: [20, 18, 22, 21],
  });

  // Grammar Pop state
  const grammarWords = [
    { word: 'Puppy', type: 'Noun' },
    { word: 'Jump', type: 'Verb' },
    { word: 'Sparkly', type: 'Adjective' },
    { word: 'Castle', type: 'Noun' },
    { word: 'Sing', type: 'Verb' },
    { word: 'Tiny', type: 'Adjective' },
    { word: 'Dragon', type: 'Noun' },
    { word: 'Sprint', type: 'Verb' },
    { word: 'Delicious', type: 'Adjective' },
    { word: 'Cloud', type: 'Noun' },
    { word: 'Whisper', type: 'Verb' },
    { word: 'Giant', type: 'Adjective' },
    { word: 'River', type: 'Noun' },
    { word: 'Climb', type: 'Verb' },
    { word: 'Brave', type: 'Adjective' },
  ];
  const [currentWordIdx, setCurrentWordIdx] = useState(0);

  // Timer Ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start Math Sprint
  const startMathSprint = () => {
    setActiveGame('math');
    setTimeLeft(45);
    setScore(0);
    setStreak(0);
    setIsGameOver(false);
    generateMathProblem();
  };

  // Start Grammar Pop
  const startGrammarPop = () => {
    setActiveGame('grammar');
    setTimeLeft(45);
    setScore(0);
    setStreak(0);
    setIsGameOver(false);
    setCurrentWordIdx(Math.floor(Math.random() * grammarWords.length));
  };

  // Generate Grade 2 appropriate math question
  const generateMathProblem = () => {
    const isAdd = Math.random() > 0.4;
    let n1: number;
    let n2: number;
    let ans: number;
    let op = '+';

    if (isAdd) {
      n1 = Math.floor(Math.random() * 40) + 10;
      n2 = Math.floor(Math.random() * 30) + 5;
      ans = n1 + n2;
    } else {
      n1 = Math.floor(Math.random() * 50) + 20;
      n2 = Math.floor(Math.random() * (n1 - 10)) + 5;
      ans = n1 - n2;
      op = '-';
    }

    // Generate 3 unique distractors
    const opts = new Set<number>([ans]);
    while (opts.size < 4) {
      const delta = (Math.floor(Math.random() * 7) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const fake = Math.max(1, ans + delta);
      if (fake !== ans) opts.add(fake);
    }

    setMathProblem({
      num1: n1,
      num2: n2,
      op,
      answer: ans,
      options: Array.from(opts).sort(() => Math.random() - 0.5),
    });
  };

  // Timer loop
  useEffect(() => {
    if (activeGame !== 'menu' && !isGameOver) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleGameOver();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeGame, isGameOver, score]);

  const handleGameOver = () => {
    setIsGameOver(true);
    playLevelVictorySound(soundEnabled);
    if (activeGame === 'math') {
      onUpdateHighScore('mathSprint', score);
    } else if (activeGame === 'grammar') {
      onUpdateHighScore('wordSorter', score);
    }

    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch (e) {
      console.debug(e);
    }
  };

  // Math answer check
  const handleMathChoice = (selected: number) => {
    if (isGameOver) return;
    if (selected === mathProblem.answer) {
      playSuccessSound(soundEnabled);
      const points = 10 + streak * 2;
      setScore((s) => s + points);
      setStreak((st) => st + 1);
    } else {
      playErrorSound(soundEnabled);
      setStreak(0);
    }
    generateMathProblem();
  };

  // Grammar choice check
  const handleGrammarChoice = (typeChosen: string) => {
    if (isGameOver) return;
    const currentWord = grammarWords[currentWordIdx];
    if (currentWord.type === typeChosen) {
      playSuccessSound(soundEnabled);
      const points = 10 + streak * 2;
      setScore((s) => s + points);
      setStreak((st) => st + 1);
    } else {
      playErrorSound(soundEnabled);
      setStreak(0);
    }
    setCurrentWordIdx((idx) => (idx + 1) % grammarWords.length);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display flex items-center gap-2">
            <Zap className="w-7 h-7 text-amber-500 fill-amber-400" />
            Arcade Blitz
          </h2>
          <p className="text-sm text-slate-500">
            Speed challenges to sharpen mental math and grammar fluency!
          </p>
        </div>

        {activeGame !== 'menu' && (
          <button
            type="button"
            onClick={() => setActiveGame('menu')}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 self-start sm:self-auto"
          >
            ← Exit to Arcade Menu
          </button>
        )}
      </div>

      {/* Arcade Menu */}
      {activeGame === 'menu' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Math Sprint */}
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold text-xl font-mono">
                + -
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display">
                Math Sprint 45s
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Race the 45-second clock! Solve Grade 2 double-digit additions and subtractions to build super combos!
              </p>
              <div className="text-xs text-slate-400 font-mono pt-2">
                High Score: <span className="font-bold text-slate-700">{progress.arcadeHighScores.mathSprint || 0} pts</span>
              </div>
            </div>

            <button
              type="button"
              onClick={startMathSprint}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              Play Math Sprint
            </button>
          </div>

          {/* Card 2: Grammar Pop */}
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center font-bold text-xl font-mono">
                Aa
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display">
                Grammar Pop
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Words pop on the board! Quickly classify each as a Noun, Verb, or Adjective before time runs out.
              </p>
              <div className="text-xs text-slate-400 font-mono pt-2">
                High Score: <span className="font-bold text-slate-700">{progress.arcadeHighScores.wordSorter || 0} pts</span>
              </div>
            </div>

            <button
              type="button"
              onClick={startGrammarPop}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              Play Grammar Pop
            </button>
          </div>
        </div>
      )}

      {/* Active Game HUD */}
      {activeGame !== 'menu' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl shadow-sm">
            {/* Timer */}
            <div className="flex items-center gap-2 font-mono text-lg font-bold">
              <Timer className="w-5 h-5 text-amber-400" />
              <span>{timeLeft}s</span>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
              <span>Streak: {streak}x</span>
            </div>

            {/* Score */}
            <div className="font-mono text-lg font-bold text-emerald-400">
              {score} pts
            </div>
          </div>

          {/* GAME OVER CARD */}
          {isGameOver ? (
            <div className="p-8 bg-white border border-slate-200 rounded-3xl text-center space-y-4 shadow-sm">
              <Trophy className="w-14 h-14 text-amber-500 mx-auto" />
              <h3 className="text-2xl font-extrabold text-slate-900 font-display">
                Time's Up!
              </h3>
              <p className="text-sm text-slate-600">
                You scored <span className="text-lg font-bold text-slate-900 font-mono">{score}</span> points!
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={activeGame === 'math' ? startMathSprint : startGrammarPop}
                  className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 shadow-xs transition-colors"
                >
                  Play Again
                </button>
                <button
                  type="button"
                  onClick={() => setActiveGame('menu')}
                  className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Arcade Menu
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* MATH SPRINT ACTIVE VIEW */}
              {activeGame === 'math' && (
                <div className="p-8 bg-white border border-slate-200 rounded-3xl text-center space-y-8 shadow-xs">
                  <div className="text-5xl sm:text-6xl font-extrabold font-mono text-slate-900">
                    {mathProblem.num1} {mathProblem.op} {mathProblem.num2} = ?
                  </div>

                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    {mathProblem.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleMathChoice(opt)}
                        className="py-5 bg-slate-50 hover:bg-emerald-50 border-2 border-slate-200 hover:border-emerald-500 text-slate-900 text-2xl font-bold font-mono rounded-2xl shadow-xs transition-all active:scale-95"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* GRAMMAR POP ACTIVE VIEW */}
              {activeGame === 'grammar' && (
                <div className="p-8 bg-white border border-slate-200 rounded-3xl text-center space-y-8 shadow-xs">
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                      What part of speech is:
                    </span>
                    <div className="text-4xl sm:text-5xl font-extrabold font-display text-indigo-700">
                      "{grammarWords[currentWordIdx].word}"
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
                    {['Noun', 'Verb', 'Adjective'].map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => handleGrammarChoice(pos)}
                        className="py-4 px-3 bg-slate-50 hover:bg-indigo-50 border-2 border-slate-200 hover:border-indigo-500 text-slate-900 text-base font-bold rounded-2xl shadow-xs transition-all active:scale-95"
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
