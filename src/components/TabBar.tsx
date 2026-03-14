import type { Tab } from '../types';

interface TabBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: (active: boolean) => React.ReactNode }[] = [
  {
    id: 'today',
    label: 'Today',
    icon: (a) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? '#D4A017' : 'none'} stroke={a ? '#D4A017' : '#666'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9,22 9,12 15,12 15,22" />
      </svg>
    ),
  },
  {
    id: 'protocol',
    label: 'Protocol',
    icon: (a) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? '#D4A017' : '#666'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10,9 9,9 8,9" />
      </svg>
    ),
  },
  {
    id: 'track',
    label: 'Track',
    icon: (a) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? '#D4A017' : '#666'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    id: 'map',
    label: 'Map',
    icon: (a) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? '#D4A017' : '#666'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
      </svg>
    ),
  },
  {
    id: 'depth',
    label: 'Depth',
    icon: (a) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? '#D4A017' : '#666'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="11" y1="8" x2="11" y2="14" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
  },
];

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav className="flex-shrink-0 fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-[#1E1E1E] z-30 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center gap-0.5 w-16 h-full transition-colors"
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.icon(isActive)}
              <span
                className="text-[10px] font-medium tracking-wide"
                style={{ color: isActive ? '#D4A017' : '#666' }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
