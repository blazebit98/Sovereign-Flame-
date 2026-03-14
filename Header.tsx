import { FlameAnimation } from './FlameAnimation';
import { getPhaseLabel } from '../utils';

interface HeaderProps {
  dayNumber: number;
  onBladeOpen?: () => void;
  onSettingsOpen?: () => void;
}

export function Header({ dayNumber, onBladeOpen, onSettingsOpen }: HeaderProps) {
  const phase = getPhaseLabel(dayNumber);

  return (
    <header className="flex-shrink-0 px-4 pt-3 pb-2 border-b border-[#1E1E1E]" style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FlameAnimation dayNumber={dayNumber} size={32} />
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-[#E8E8E8]">Day {dayNumber}</span>
              <span className="text-xs font-medium text-[#D4A017] tracking-wider uppercase">{phase}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onBladeOpen}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#9A9A9A] hover:text-[#D4A017] hover:bg-[#1E1E1E] transition-colors"
            aria-label="View The Blade"
            title="The Blade"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14,2 14,8 20,8" />
            </svg>
          </button>
          <button
            onClick={onSettingsOpen}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#9A9A9A] hover:text-[#D4A017] hover:bg-[#1E1E1E] transition-colors"
            aria-label="Settings"
            title="Settings"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
