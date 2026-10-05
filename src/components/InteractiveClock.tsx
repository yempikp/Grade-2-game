import React from 'react';

interface InteractiveClockProps {
  hours: number;
  minutes: number;
  size?: number;
  showMinuteAids?: boolean;
}

export const InteractiveClock: React.FC<InteractiveClockProps> = ({
  hours,
  minutes,
  size = 240,
  showMinuteAids = true,
}) => {
  // 12-hour clock: 360 degrees / 12 = 30 deg per hour, + 0.5 deg per minute
  const hourAngle = ((hours % 12) + minutes / 60) * 30;
  // Minute hand: 360 / 60 = 6 deg per minute
  const minuteAngle = minutes * 6;

  const radius = size / 2;
  const center = radius;

  // Numbers 1 to 12 coordinates
  const numbers = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center select-none">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-sm rounded-full bg-amber-50/40"
      >
        {/* Clock Outer Rim */}
        <circle
          cx={center}
          cy={center}
          r={radius - 8}
          className="fill-white stroke-amber-200"
          strokeWidth="6"
        />

        {/* Inner track */}
        <circle
          cx={center}
          cy={center}
          r={radius - 20}
          className="fill-none stroke-slate-100"
          strokeWidth="1.5"
          strokeDasharray="2,4"
        />

        {/* 60 Minute tick marks */}
        {Array.from({ length: 60 }).map((_, idx) => {
          const isFiveMin = idx % 5 === 0;
          const angle = idx * 6 * (Math.PI / 180);
          const r1 = radius - (isFiveMin ? 24 : 16);
          const r2 = radius - 12;
          const x1 = center + r1 * Math.sin(angle);
          const y1 = center - r1 * Math.cos(angle);
          const x2 = center + r2 * Math.sin(angle);
          const y2 = center - r2 * Math.cos(angle);

          return (
            <line
              key={idx}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isFiveMin ? '#94a3b8' : '#cbd5e1'}
              strokeWidth={isFiveMin ? 2.5 : 1}
              strokeLinecap="round"
            />
          );
        })}

        {/* Hour Numbers (1 to 12) */}
        {numbers.map((num) => {
          const angle = num * 30 * (Math.PI / 180);
          const numRadius = radius - 38;
          const x = center + numRadius * Math.sin(angle);
          const y = center - numRadius * Math.cos(angle) + 6;

          return (
            <text
              key={num}
              x={x}
              y={y}
              textAnchor="middle"
              className="font-bold fill-slate-800 text-[18px]"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {num}
            </text>
          );
        })}

        {/* Optional 5-Minute indicators for Grade 2 learners */}
        {showMinuteAids &&
          [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((min) => {
            const angle = (min / 5) * 30 * (Math.PI / 180);
            const mRadius = radius - 16;
            const x = center + mRadius * Math.sin(angle);
            const y = center - mRadius * Math.cos(angle) + 3;

            return (
              <text
                key={`min-${min}`}
                x={x}
                y={y}
                textAnchor="middle"
                className="fill-amber-600/80 font-mono text-[9px] font-semibold"
              >
                {min === 0 ? ':00' : `:${String(min).padStart(2, '0')}`}
              </text>
            );
          })}

        {/* Hour Hand (Thicker, shorter, Indigo) */}
        <line
          x1={center}
          y1={center}
          x2={center + (radius - 65) * Math.sin(hourAngle * (Math.PI / 180))}
          y2={center - (radius - 65) * Math.cos(hourAngle * (Math.PI / 180))}
          stroke="#4f46e5"
          strokeWidth="6.5"
          strokeLinecap="round"
        />

        {/* Minute Hand (Longer, slender, Emerald) */}
        <line
          x1={center}
          y1={center}
          x2={center + (radius - 32) * Math.sin(minuteAngle * (Math.PI / 180))}
          y2={center - (radius - 32) * Math.cos(minuteAngle * (Math.PI / 180))}
          stroke="#059669"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Center Pivot Pin */}
        <circle cx={center} cy={center} r="7" className="fill-slate-900" />
        <circle cx={center} cy={center} r="3" className="fill-amber-400" />
      </svg>

      <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-1.5 bg-indigo-600 rounded-sm inline-block" />
          Short Blue = Hour hand
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-1.5 bg-emerald-600 rounded-sm inline-block" />
          Long Green = Minute hand
        </span>
      </div>
    </div>
  );
};
