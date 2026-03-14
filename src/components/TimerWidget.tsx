import { useState, useEffect, useCallback, useRef } from 'react';
import { formatTime, playBeep, vibrate } from '../utils';

interface TimerProps {
  duration: number;
  onComplete?: () => void;
  label?: string;
  size?: number;
  autoStart?: boolean;
  accentColor?: string;
}

export function TimerWidget({
  duration,
  onComplete,
  label,
  size = 140,
  autoStart = false,
  accentColor = '#D4A017',
}: TimerProps) {
  const [remaining, setRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isRunning && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearTimer();
            setIsRunning(false);
            setIsComplete(true);
            playBeep(528, 0.6);
            vibrate([200, 100, 200]);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return clearTimer;
  }, [isRunning, remaining, clearTimer, onComplete]);

  const handleStartPause = () => {
    if (isComplete) {
      setRemaining(duration);
      setIsComplete(false);
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  };

  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = remaining / duration;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-3">
      {label && (
        <div className="text-[#9A9A9A] text-sm font-medium tracking-wide uppercase">
          {label}
        </div>
      )}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1E1E1E"
            strokeWidth="6"
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={isComplete ? '#2D8B4E' : accentColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.3s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-mono font-semibold tabular-nums"
            style={{
              fontSize: size > 120 ? '2rem' : '1.5rem',
              color: isComplete ? '#2D8B4E' : '#E8E8E8',
              animation: isRunning ? undefined : isComplete ? undefined : 'timer-pulse 2s infinite',
            }}
          >
            {formatTime(remaining)}
          </span>
        </div>
      </div>
      <button
        onClick={handleStartPause}
        className="px-6 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-colors"
        style={{
          backgroundColor: isComplete ? '#2D8B4E' : isRunning ? '#1E1E1E' : accentColor,
          color: isRunning ? '#9A9A9A' : '#0A0A0A',
        }}
      >
        {isComplete ? 'RESTART' : isRunning ? 'PAUSE' : 'START'}
      </button>
    </div>
  );
}
