interface FlameProps {
  dayNumber: number;
  size?: number;
}

export function FlameAnimation({ dayNumber, size }: FlameProps) {
  const scale = dayNumber <= 7 ? 0.7 : dayNumber <= 30 ? 0.85 : dayNumber <= 90 ? 1 : 1.15;
  const computedSize = size ?? (dayNumber <= 7 ? 28 : dayNumber <= 30 ? 34 : dayNumber <= 90 ? 40 : 48);

  return (
    <svg
      width={computedSize}
      height={computedSize}
      viewBox="0 0 40 48"
      fill="none"
      style={{ transform: `scale(${scale})` }}
      aria-hidden="true"
    >
      {/* Base layer — slowest, widest */}
      <path
        d="M20 46C20 46 6 32 6 20C6 10 12 2 20 2C28 2 34 10 34 20C34 32 20 46 20 46Z"
        fill="url(#flame-base)"
        style={{ animation: 'flame-dance-1 1.8s ease-in-out infinite', transformOrigin: 'center bottom' }}
      />
      {/* Mid layer */}
      <path
        d="M20 44C20 44 10 32 10 22C10 14 14 6 20 6C26 6 30 14 30 22C30 32 20 44 20 44Z"
        fill="url(#flame-mid)"
        style={{ animation: 'flame-dance-2 1.4s ease-in-out infinite', transformOrigin: 'center bottom' }}
      />
      {/* Core layer — fastest, brightest */}
      <path
        d="M20 40C20 40 14 32 14 24C14 18 16 12 20 12C24 12 26 18 26 24C26 32 20 40 20 40Z"
        fill="url(#flame-core)"
        style={{ animation: 'flame-dance-3 1.1s ease-in-out infinite', transformOrigin: 'center bottom' }}
      />
      <defs>
        <radialGradient id="flame-base" cx="0.5" cy="0.7" r="0.6">
          <stop offset="0%" stopColor="#D4A017" />
          <stop offset="100%" stopColor="#B82020" stopOpacity="0.8" />
        </radialGradient>
        <radialGradient id="flame-mid" cx="0.5" cy="0.6" r="0.5">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#D4A017" stopOpacity="0.9" />
        </radialGradient>
        <radialGradient id="flame-core" cx="0.5" cy="0.5" r="0.4">
          <stop offset="0%" stopColor="#FFF4CC" />
          <stop offset="100%" stopColor="#FFD700" />
        </radialGradient>
      </defs>
    </svg>
  );
}
