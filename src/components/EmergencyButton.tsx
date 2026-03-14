interface Props {
  onClick: () => void;
}

export function EmergencyButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="fixed z-40 flex items-center justify-center rounded-full shadow-lg transition-transform active:scale-95"
      style={{
        width: 60,
        height: 60,
        bottom: 84,
        right: 16,
        backgroundColor: '#B82020',
        animation: 'emergency-pulse 2.5s ease-in-out infinite',
      }}
      aria-label="Emergency urge protocol"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <circle cx="12" cy="16" r="0.5" fill="white" />
      </svg>
    </button>
  );
}
