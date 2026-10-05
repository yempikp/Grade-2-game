import React, { useState } from 'react';
import { InteractiveClock } from './InteractiveClock';
import { PlaceValueBuilder } from './PlaceValueBuilder';
import { speakText } from '../utils/sound';
import {
  BookOpen,
  Clock,
  Boxes,
  Coins,
  Sparkles,
  FlaskConical,
  Volume2,
  Compass,
} from 'lucide-react';

export const KnowledgeDex: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'clock' | 'placeValue' | 'money' | 'grammar' | 'science'>('clock');

  // Clock interactive state
  const [clockHours, setClockHours] = useState(3);
  const [clockMinutes, setClockMinutes] = useState(30);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-indigo-600" />
          Grade 2 Learning Dex
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Interactive concept guides, visual manipulatives, and audio lessons.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-xl max-w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('clock')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'clock'
              ? 'bg-white text-indigo-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Analog Clock</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('placeValue')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'placeValue'
              ? 'bg-white text-emerald-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Place Value Blocks</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('money')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'money'
              ? 'bg-white text-amber-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Coin Guide</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('grammar')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'grammar'
              ? 'bg-white text-purple-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Parts of Speech</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('science')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'science'
              ? 'bg-white text-sky-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>States of Matter</span>
        </button>
      </div>

      {/* Tab 1: Interactive Clock Manipulative */}
      {activeTab === 'clock' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-xs">
          <div className="md:col-span-5 flex flex-col items-center">
            <InteractiveClock hours={clockHours} minutes={clockMinutes} size={260} />
            <div className="mt-4 text-center">
              <div className="text-3xl font-extrabold font-mono text-slate-900">
                {clockHours}:{String(clockMinutes).padStart(2, '0')}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">
                {clockMinutes === 0
                  ? `${clockHours} o'clock`
                  : clockMinutes === 15
                  ? `Quarter past ${clockHours}`
                  : clockMinutes === 30
                  ? `Half past ${clockHours}`
                  : clockMinutes === 45
                  ? `Quarter to ${((clockHours % 12) + 1)}`
                  : `${clockMinutes} minutes past ${clockHours}`}
              </div>
            </div>
          </div>

          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 font-display">
                How to Read an Analog Clock
              </h3>
              <button
                type="button"
                onClick={() =>
                  speakText(
                    "The short hand points to the hour. The long hand points to the minutes. Count by fives for each big number around the clock."
                  )
                }
                className="text-indigo-600 hover:text-indigo-700 p-2 rounded-lg hover:bg-indigo-50"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              In Grade 2, we tell time to the nearest 5 minutes! The short blue hand tells the hour, and the long green hand counts minutes around the circle.
            </p>

            {/* Quick Presets */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Try setting these times:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { h: 3, m: 0, label: '3:00 (O’clock)' },
                  { h: 4, m: 15, label: '4:15 (Quarter past)' },
                  { h: 7, m: 30, label: '7:30 (Half past)' },
                  { h: 9, m: 45, label: '9:45 (Quarter to 10)' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setClockHours(item.h);
                      setClockMinutes(item.m);
                    }}
                    className="p-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl text-xs font-semibold text-slate-800 transition-colors text-center"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Minute step adjust */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  let nextMin = clockMinutes - 5;
                  if (nextMin < 0) {
                    nextMin = 55;
                    setClockHours((h) => (h === 1 ? 12 : h - 1));
                  }
                  setClockMinutes(nextMin);
                }}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
              >
                - 5 Minutes
              </button>
              <button
                type="button"
                onClick={() => {
                  let nextMin = clockMinutes + 5;
                  if (nextMin >= 60) {
                    nextMin = 0;
                    setClockHours((h) => (h === 12 ? 1 : h + 1));
                  }
                  setClockMinutes(nextMin);
                }}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
              >
                + 5 Minutes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Place Value Manipulative */}
      {activeTab === 'placeValue' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-display">
              Base-Ten Blocks (Hundreds, Tens, Ones)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Test building any 3-digit number below by tapping + and - on each block type!
            </p>
          </div>

          <PlaceValueBuilder
            mode="build"
            initialHundreds={3}
            initialTens={4}
            initialOnes={6}
          />
        </div>
      )}

      {/* Tab 3: Coin Guide */}
      {activeTab === 'money' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-display">
              U.S. Coin Guide & Values
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Every 2nd grader learns to identify and count these 4 coins:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Penny */}
            <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/40 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-700 text-amber-100 mx-auto flex items-center justify-center font-bold text-sm shadow-md border-2 border-amber-900">
                1¢
              </div>
              <div className="font-bold text-slate-900">Penny</div>
              <div className="text-xs text-slate-600 leading-relaxed">
                Copper-colored · Features Abraham Lincoln · Worth <span className="font-bold">1 cent (1¢)</span>
              </div>
            </div>

            {/* Nickel */}
            <div className="p-4 rounded-xl border border-slate-300 bg-slate-50 text-center space-y-3">
              <div className="w-18 h-18 rounded-full bg-slate-300 text-slate-800 mx-auto flex items-center justify-center font-bold text-sm shadow-md border-2 border-slate-400">
                5¢
              </div>
              <div className="font-bold text-slate-900">Nickel</div>
              <div className="text-xs text-slate-600 leading-relaxed">
                Thick silver coin · Smooth edge · Features Thomas Jefferson · Worth <span className="font-bold">5 cents (5¢)</span>
              </div>
            </div>

            {/* Dime */}
            <div className="p-4 rounded-xl border border-slate-300 bg-slate-50 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-slate-300 text-slate-800 mx-auto flex items-center justify-center font-bold text-xs shadow-md border-2 border-slate-400">
                10¢
              </div>
              <div className="font-bold text-slate-900">Dime</div>
              <div className="text-xs text-slate-600 leading-relaxed">
                Smallest silver coin · Ridged edge · Features FDR · Worth <span className="font-bold">10 cents (10¢)</span>
              </div>
            </div>

            {/* Quarter */}
            <div className="p-4 rounded-xl border border-slate-300 bg-slate-50 text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-slate-300 text-slate-800 mx-auto flex items-center justify-center font-bold text-base shadow-md border-2 border-slate-400">
                25¢
              </div>
              <div className="font-bold text-slate-900">Quarter</div>
              <div className="text-xs text-slate-600 leading-relaxed">
                Largest common silver coin · George Washington · Worth <span className="font-bold">25 cents (25¢)</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs sm:text-sm text-amber-900 space-y-1">
            <span className="font-bold">Pro-tip for 2nd Graders:</span>
            <p>
              4 quarters = $1.00 · 10 dimes = $1.00 · 20 nickels = $1.00 · 100 pennies = $1.00!
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Parts of Speech Guide */}
      {activeTab === 'grammar' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-display">
              Parts of Speech Super Guide
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Every word in a sentence has a special job to do:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2">
              <div className="text-base font-bold text-blue-950 font-display">
                Noun
              </div>
              <p className="text-xs text-blue-800 font-medium">
                Names a Person, Place, or Thing.
              </p>
              <div className="pt-2 text-xs text-slate-700 space-y-1">
                <div><span className="font-semibold">Person:</span> teacher, sister, astronaut</div>
                <div><span className="font-semibold">Place:</span> playground, zoo, bedroom</div>
                <div><span className="font-semibold">Thing:</span> puppy, pencil, backpack</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
              <div className="text-base font-bold text-emerald-950 font-display">
                Verb
              </div>
              <p className="text-xs text-emerald-800 font-medium">
                An Action Word (what someone does).
              </p>
              <div className="pt-2 text-xs text-slate-700 space-y-1">
                <div><span className="font-semibold">Active:</span> run, jump, gallop, swim</div>
                <div><span className="font-semibold">Quiet:</span> sleep, think, whisper, read</div>
                <div><span className="font-semibold">Creative:</span> build, paint, sing, dance</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
              <div className="text-base font-bold text-amber-950 font-display">
                Adjective
              </div>
              <p className="text-xs text-amber-800 font-medium">
                A Describing Word (tells how it looks, feels, tastes).
              </p>
              <div className="pt-2 text-xs text-slate-700 space-y-1">
                <div><span className="font-semibold">Color:</span> golden, emerald, violet</div>
                <div><span className="font-semibold">Texture:</span> fluffy, prickly, smooth</div>
                <div><span className="font-semibold">Size:</span> enormous, tiny, microscopic</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: States of Matter */}
      {activeTab === 'science' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-display">
              The Three States of Matter
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Everything around us in the universe is made of matter!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-3">
              <div className="text-lg font-bold text-indigo-950 font-display">
                Solid 🧊
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Holds its own fixed shape. The tiny particles are tightly packed together and only vibrate in place.
              </p>
              <div className="text-xs font-semibold text-indigo-900 pt-1">
                Examples: Ice cubes, wooden tables, stones, crayons.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-cyan-50/50 border border-cyan-200 space-y-3">
              <div className="text-lg font-bold text-cyan-950 font-display">
                Liquid 💧
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Flows smoothly and takes the shape of whatever cup or container it is in. Particles slide past each other.
              </p>
              <div className="text-xs font-semibold text-cyan-900 pt-1">
                Examples: Fresh water, orange juice, milk, honey.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-violet-50/50 border border-violet-200 space-y-3">
              <div className="text-lg font-bold text-violet-950 font-display">
                Gas 🎈
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Spreads out quickly in all directions to completely fill any container or room. Particles zoom freely.
              </p>
              <div className="text-xs font-semibold text-violet-900 pt-1">
                Examples: Air we breathe, balloon helium, steam from a tea kettle.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
