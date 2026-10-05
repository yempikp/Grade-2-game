import React, { useState } from 'react';
import { BADGES } from '../data/curriculumData';
import { UserProgress } from '../types/game';
import {
  Award,
  Star,
  CheckCircle,
  Lock,
  Printer,
  Sparkles,
  RotateCcw,
  Zap,
} from 'lucide-react';

interface TrophyRoomProps {
  progress: UserProgress;
  onUpdateName: (name: string) => void;
  onResetProgress: () => void;
}

export const TrophyRoom: React.FC<TrophyRoomProps> = ({
  progress,
  onUpdateName,
  onResetProgress,
}) => {
  const [studentName, setStudentName] = useState(progress.studentName || 'Super Learner');
  const [showCertificate, setShowCertificate] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setStudentName(val);
    onUpdateName(val);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display flex items-center gap-2">
            <Award className="w-8 h-8 text-amber-500" />
            Trophy Room & Badges
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Track your accomplishments, earn badges, and print your Grade 2 Scholar Certificate!
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCertificate(!showCertificate)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>{showCertificate ? 'Hide Certificate' : 'View Scholar Certificate'}</span>
        </button>
      </div>

      {/* Printable Certificate Preview */}
      {showCertificate && (
        <section className="bg-amber-50/70 border-4 border-amber-300 p-8 sm:p-12 rounded-3xl shadow-sm text-center space-y-6 relative overflow-hidden">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-widest font-extrabold text-amber-800">
              Official Academic Award of Achievement
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-amber-950 font-display">
              Grade 2 Super Scholar
            </h3>
            <p className="text-xs sm:text-sm text-amber-900/80">
              This certificate is proudly awarded to:
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <input
              type="text"
              value={studentName}
              onChange={handleNameChange}
              placeholder="Enter Student Name"
              className="w-full text-center text-2xl sm:text-3xl font-extrabold font-display text-indigo-900 bg-white border-b-2 border-indigo-400 py-2 focus:outline-none focus:border-indigo-600 rounded-lg shadow-xs"
            />
          </div>

          <p className="text-xs sm:text-sm text-amber-950/80 max-w-xl mx-auto leading-relaxed">
            For outstanding curiosity, mathematical reasoning, reading mastery, and scientific discovery across Grade 2 elementary curriculum standards!
          </p>

          <div className="pt-4 flex flex-wrap justify-center items-center gap-8 text-xs font-bold text-amber-900 font-mono">
            <div>★ {progress.totalStars} Total Stars Earned</div>
            <div>🏆 {progress.badgesEarned.length} Badges Mastered</div>
            <div>📅 {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</div>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </section>
      )}

      {/* Badges Grid */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 font-display">
          Curriculum Badges
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {BADGES.map((badge) => {
            const isUnlocked =
              progress.badgesEarned.includes(badge.id) ||
              progress.totalStars >= (badge.requiredStars || 3);

            return (
              <div
                key={badge.id}
                className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                  isUnlocked
                    ? 'bg-white border-amber-300 shadow-xs ring-1 ring-amber-100'
                    : 'bg-slate-50/70 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                    isUnlocked
                      ? 'bg-amber-100 text-amber-600 border border-amber-300'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {isUnlocked ? (
                    <Award className="w-6 h-6" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-slate-900 text-sm font-display">
                      {badge.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {badge.description}
                  </p>
                  <div className="text-[11px] font-mono font-semibold pt-1">
                    {isUnlocked ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Unlocked!
                      </span>
                    ) : (
                      <span className="text-slate-400">
                        Requires {badge.requiredStars} Stars
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Reset Progress Section */}
      <section className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          <span>Want to start over on this browser?</span>
        </div>

        {confirmReset ? (
          <div className="flex items-center gap-2">
            <span className="text-rose-600 font-bold">Reset all progress?</span>
            <button
              type="button"
              onClick={() => {
                onResetProgress();
                setConfirmReset(false);
              }}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition-colors"
            >
              Yes, Reset
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-rose-600 transition-colors font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Quest Progress
          </button>
        )}
      </section>
    </div>
  );
};
