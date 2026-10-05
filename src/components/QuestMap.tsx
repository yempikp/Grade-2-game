import React from 'react';
import { REALMS, HERO_IMAGE_PATH } from '../data/curriculumData';
import { Realm, Level, UserProgress } from '../types/game';
import { Star, Lock, Play, CheckCircle2, Sparkles, BookOpen, Calculator, FlaskConical, Compass, Award } from 'lucide-react';

interface QuestMapProps {
  progress: UserProgress;
  onSelectLevel: (realm: Realm, level: Level) => void;
  onStartArcade: () => void;
  onOpenDex: () => void;
}

export const QuestMap: React.FC<QuestMapProps> = ({
  progress,
  onSelectLevel,
  onStartArcade,
  onOpenDex,
}) => {
  const [selectedRealmId, setSelectedRealmId] = React.useState<string>('math');

  const selectedRealm = REALMS.find((r) => r.id === selectedRealmId) || REALMS[0];

  // Calculate completed count
  const completedLevelCount = Object.keys(progress.starsByLevel).length;
  const totalLevels = REALMS.reduce((acc, r) => acc + r.levels.length, 0);

  const getRealmIcon = (id: string) => {
    switch (id) {
      case 'math':
        return <Calculator className="w-5 h-5 text-emerald-600" />;
      case 'language':
        return <BookOpen className="w-5 h-5 text-amber-600" />;
      case 'science':
        return <FlaskConical className="w-5 h-5 text-sky-600" />;
      case 'social':
        return <Compass className="w-5 h-5 text-indigo-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-700 text-white shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="p-6 sm:p-10 lg:col-span-7 space-y-4">
            <div className="text-xs font-bold tracking-wider uppercase text-amber-200">
              Grade 2 Elementary Curriculum Adventure
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display text-white">
              Welcome to the Super Quest!
            </h1>
            <p className="text-sm sm:text-base text-amber-50 max-w-xl leading-relaxed">
              Explore 4 wonder realms designed specifically for second graders: solve hands-on math puzzles, bake compound words, explore states of matter, and navigate world maps!
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const firstLevel = selectedRealm.levels[0];
                  if (firstLevel) onSelectLevel(selectedRealm, firstLevel);
                }}
                className="px-5 py-2.5 bg-white text-slate-900 hover:bg-amber-50 font-bold text-sm rounded-lg shadow-xs transition-colors flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-slate-900" />
                Play Next Level
              </button>
              <button
                type="button"
                onClick={onStartArcade}
                className="px-5 py-2.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold text-sm rounded-lg transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Try Arcade Mini-Games
              </button>
            </div>

            <div className="pt-4 border-t border-white/20 flex items-center gap-6 text-xs text-amber-100 font-medium">
              <span>{completedLevelCount} of {totalLevels} Levels Completed</span>
              <span>·</span>
              <span>{progress.totalStars} Stars Collected</span>
              <span>·</span>
              <span>{progress.badgesEarned.length} Badges Won</span>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-5 h-full relative min-h-[300px]">
            <img
              src={HERO_IMAGE_PATH}
              alt="Grade 2 Super Quest Adventure illustration"
              className="absolute inset-0 w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/90 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Realm Selection Cards */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              Choose a Quest Realm
            </h2>
            <p className="text-sm text-slate-500">
              Each realm explores an essential Grade 2 subject with interactive games and voice reading.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {REALMS.map((realm) => {
            const isSelected = selectedRealmId === realm.id;
            const completedInRealm = realm.levels.filter(
              (l) => progress.starsByLevel[l.id] !== undefined
            ).length;

            return (
              <div
                key={realm.id}
                onClick={() => setSelectedRealmId(realm.id)}
                className={`relative rounded-xl border-2 overflow-hidden cursor-pointer transition-all bg-white text-left ${
                  isSelected
                    ? 'border-indigo-600 shadow-md ring-2 ring-indigo-200 ring-offset-1'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                {/* Realm Thumbnail */}
                <div className="h-32 w-full overflow-hidden relative bg-slate-100">
                  <img
                    src={realm.imagePath}
                    alt={realm.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[11px] font-bold text-slate-700 font-mono shadow-xs">
                    {completedInRealm} / {realm.levels.length} done
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-1.5">
                  <div className="flex items-center gap-2">
                    {getRealmIcon(realm.id)}
                    <h3 className="font-bold text-slate-900 text-base font-display">
                      {realm.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {realm.tagline}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Selected Realm Level Track */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              {selectedRealm.subtitle}
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 font-display">
              {selectedRealm.name} Levels
            </h3>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {selectedRealm.description}
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenDex}
            className="self-start md:self-auto px-4 py-2 border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            Study in Learning Dex
          </button>
        </div>

        {/* Level Path Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedRealm.levels.map((level, idx) => {
            const stars = progress.starsByLevel[level.id] || 0;
            const isCompleted = stars > 0;
            // Level 1 is always unlocked; subsequent unlocked if previous level attempted or completed
            const prevLevel = idx > 0 ? selectedRealm.levels[idx - 1] : null;
            const isUnlocked = idx === 0 || (prevLevel && progress.starsByLevel[prevLevel.id] !== undefined);

            return (
              <div
                key={level.id}
                className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                  isCompleted
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : isUnlocked
                    ? 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs'
                    : 'border-slate-100 bg-slate-50/60 opacity-65'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-slate-600">
                      Level {idx + 1}
                    </span>

                    {/* Star Rating for this level */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((starIdx) => (
                        <Star
                          key={starIdx}
                          className={`w-4 h-4 ${
                            stars >= starIdx
                              ? 'fill-amber-400 text-amber-500'
                              : 'fill-slate-100 text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base font-display mb-1.5">
                    {level.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {level.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-600">
                    Badge: {level.badgeName}
                  </span>

                  {isUnlocked ? (
                    <button
                      type="button"
                      onClick={() => onSelectLevel(selectedRealm, level)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                        isCompleted
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      {isCompleted ? 'Replay' : 'Start'}
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Lock className="w-3.5 h-3.5" />
                      Locked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
