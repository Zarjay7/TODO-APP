import * as React from 'react';

interface ProgressRingProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
}

export function ProgressRing({ percent, size = 120, strokeWidth = 10 }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;

  // Trigger a subtle pop animation when percent changes
  const [popKey, setPopKey] = React.useState(0);
  const prevPercent = React.useRef(percent);

  React.useEffect(() => {
    if (percent !== prevPercent.current) {
      setPopKey(k => k + 1);
      prevPercent.current = percent;
    }
  }, [percent]);

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background track - recessed look */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--surface-alt)"
        strokeWidth={strokeWidth}
        style={{ filter: 'url(#shadow-inset)' }}
      />
      
      {/* Progress arc with stronger skeuomorphic depth + pop on change */}
      <circle
        key={popKey}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#progress-gradient)"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="progress-arc-pop"
        style={{ 
          transition: 'stroke-dashoffset 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
        }}
      />

      {/* Stronger inner highlight for embossed tactile feel */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius - 2}
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="2"
        style={{ opacity: 0.7 }}
      />

      {/* Definitions for gradients and filters */}
      <defs>
        <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent-weak)" />
        </linearGradient>
        
        <filter id="shadow-inset" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
        </filter>
      </defs>
    </svg>
  );
}

