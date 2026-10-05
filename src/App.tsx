import React, { useState, useEffect } from 'react';
import { REALMS, BADGES } from './data/curriculumData';
import { Realm, Level, UserProgress } from './types/game';
import { Navbar } from './components/Navbar';
import { QuestMap } from './components/QuestMap';
import { ChallengeView } from './components/ChallengeView';
import { ArcadeMode } from './components/ArcadeMode';
import { KnowledgeDex } from './components/KnowledgeDex';
import { TrophyRoom } from './components/TrophyRoom';
import { playSuccessSound } from './utils/sound';

const STORAGE_KEY = 'grade2_super_quest_progress_v1';

const defaultProgress: UserProgress = {
  starsByLevel: {},
  highScoresByLevel: {},
  unlockedLevelIds: ['math-1', 'lang-1', 'sci-1', 'soc-1'],
  totalStars: 0,
  totalCoins: 0,
  studentName: 'Second Grader',
  arcadeHighScores: {
    mathSprint: 0,
    wordSorter: 0,
    clockFrenzy: 0,
  },
  badgesEarned: [],
  soundEnabled: true,
};

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultProgress, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.debug('Failed to read from localStorage:', e);
    }
    return defaultProgress;
  });

  const [currentTab, setCurrentTab] = useState<'quest' | 'arcade' | 'dex' | 'trophies'>('quest');
  const [activeLevelState, setActiveLevelState] = useState<{ realm: Realm; level: Level } | null>(null);

  // Save progress changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.debug('Failed to save to localStorage:', e);
    }
  }, [progress]);

  // Sound toggle
  const handleToggleSound = () => {
    setProgress((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  // Level selection from Quest Map
  const handleSelectLevel = (realm: Realm, level: Level) => {
    setActiveLevelState({ realm, level });
  };

  // Level completed in ChallengeView
  const handleFinishLevel = (levelId: string, earnedStars: number, earnedCoins: number) => {
    setProgress((prev) => {
      const prevStars = prev.starsByLevel[levelId] || 0;
      const bestStars = Math.max(prevStars, earnedStars);
      const starDifference = bestStars - prevStars;

      const newStarsByLevel = {
        ...prev.starsByLevel,
        [levelId]: bestStars,
      };

      const newTotalStars = prev.totalStars + Math.max(0, starDifference);
      const newTotalCoins = prev.totalCoins + earnedCoins;

      // Check badges that may now be unlocked
      const newBadges = [...prev.badgesEarned];
      BADGES.forEach((b) => {
        if (!newBadges.includes(b.id)) {
          if (b.requiredStars && newTotalStars >= b.requiredStars) {
            newBadges.push(b.id);
          }
        }
      });

      return {
        ...prev,
        starsByLevel: newStarsByLevel,
        totalStars: newTotalStars,
        totalCoins: newTotalCoins,
        badgesEarned: newBadges,
      };
    });
  };

  // Arcade high score update
  const handleUpdateHighScore = (
    gameKey: 'mathSprint' | 'wordSorter' | 'clockFrenzy',
    score: number
  ) => {
    setProgress((prev) => {
      const currentHigh = prev.arcadeHighScores[gameKey] || 0;
      if (score > currentHigh) {
        return {
          ...prev,
          arcadeHighScores: {
            ...prev.arcadeHighScores,
            [gameKey]: score,
          },
        };
      }
      return prev;
    });
  };

  // Student name update
  const handleUpdateName = (name: string) => {
    setProgress((prev) => ({ ...prev, studentName: name }));
  };

  // Reset progress
  const handleResetProgress = () => {
    setProgress(defaultProgress);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.debug(e);
    }
    setActiveLevelState(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Universal Top Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setActiveLevelState(null);
          setCurrentTab(tab);
        }}
        totalStars={progress.totalStars}
        soundEnabled={progress.soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {/* If user is inside an active level */}
        {activeLevelState ? (
          <ChallengeView
            realm={activeLevelState.realm}
            level={activeLevelState.level}
            progress={progress}
            soundEnabled={progress.soundEnabled}
            onFinishLevel={handleFinishLevel}
            onBackToMap={() => setActiveLevelState(null)}
          />
        ) : (
          <>
            {currentTab === 'quest' && (
              <QuestMap
                progress={progress}
                onSelectLevel={handleSelectLevel}
                onStartArcade={() => setCurrentTab('arcade')}
                onOpenDex={() => setCurrentTab('dex')}
              />
            )}

            {currentTab === 'arcade' && (
              <ArcadeMode
                progress={progress}
                soundEnabled={progress.soundEnabled}
                onUpdateHighScore={handleUpdateHighScore}
              />
            )}

            {currentTab === 'dex' && <KnowledgeDex />}

            {currentTab === 'trophies' && (
              <TrophyRoom
                progress={progress}
                onUpdateName={handleUpdateName}
                onResetProgress={handleResetProgress}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Grade 2 Super Quest · Aligned with standard 2nd grade curriculum</span>
          <span>Math · Reading & Language Arts · Science · Social Studies</span>
        </div>
      </footer>
    </div>
  );
}
