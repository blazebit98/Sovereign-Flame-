import { useState, useEffect, useCallback } from 'react';
import type { FortressCompletion } from '../types';
import { getTodayLog, saveEveningFortress } from '../store';

interface Props {
  dayNumber: number;
  curfewTime?: string;
  onComplete?: (completion: FortressCompletion) => void;
}

interface FortressItem {
  id: string;
  label: string;
  time: string;
  mechanism: string;
}

const EVENING_ITEMS: FortressItem[] = [
  {
    id: 'screen_curfew',
    label: 'Screen curfew — all devices off or grayscale',
    time: '7:00 PM',
    mechanism: 'Blue light suppressed → melatonin production begins → sleep architecture protected.',
  },
  {
    id: 'phone_away',
    label: 'Phone in another room (charging in kitchen)',
    time: '7:00 PM',
    mechanism: '50+ micro-decisions about phone use eliminated. The most dangerous device removed from reach.',
  },
  {
    id: 'analog',
    label: 'Analog engagement — book, journal, instrument, conversation',
    time: '7:00–8:30 PM',
    mechanism: 'Parasympathetic dominance begins. Mind winds down without digital stimulation.',
  },
  {
    id: 'pranayama',
    label: 'Evening pranayama — Sitali or 4-7-8 breathing (6 rounds)',
    time: '8:30 PM',
    mechanism: 'Extended exhale → vagal activation → parasympathetic shift → cortisol↓ → calm.',
  },
  {
    id: 'bandha_seal',
    label: 'Mula bandha (night seal) then full RELEASE',
    time: '8:30 PM',
    mechanism: 'Fascial tensioning seals energy upward → then full release relaxes pelvic floor for sleep.',
  },
  {
    id: 'bladder',
    label: 'Bladder emptied — no fluids 2h before bed',
    time: '8:30 PM',
    mechanism: 'Prevents nocturnal pressure on prostate/pelvic floor. Reduces nocturnal emission risk.',
  },
  {
    id: 'yoga_nidra',
    label: 'Yoga Nidra / Body Scan — crown to toes',
    time: '9:00 PM',
    mechanism: 'Progressive relaxation → theta state → sankalpa planted → subconscious aligned for retention during sleep.',
  },
  {
    id: 'sleep_position',
    label: 'Sleep position: back or side (NEVER prone)',
    time: '9:00 PM',
    mechanism: 'Prone position creates genital stimulation during sleep. Back/side eliminates this trigger entirely.',
  },
];

export function EveningFortress({ dayNumber, curfewTime, onComplete }: Props) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);
  const [existingCompletion, setExistingCompletion] = useState<FortressCompletion>('');

  // Load existing state
  useEffect(() => {
    const todayLog = getTodayLog();
    if (todayLog?.eveningFortress) {
      setExistingCompletion(todayLog.eveningFortress);
      if (todayLog.eveningFortress === 'full' || todayLog.eveningFortress === 'partial') {
        setSaved(true);
      }
    }
  }, []);

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const allChecked = checkedCount === EVENING_ITEMS.length;

  const toggleItem = useCallback((id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
    setSaved(false);
  }, []);

  const handleComplete = useCallback((completion: FortressCompletion) => {
    saveEveningFortress(completion, dayNumber);
    setExistingCompletion(completion);
    setSaved(true);
    onComplete?.(completion);
  }, [dayNumber, onComplete]);

  // Already completed
  if (saved && existingCompletion) {
    return (
      <div className="rounded-xl bg-[#141414] border border-[#2D8B4E44] p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold tracking-widest text-[#2D8B4E] uppercase">
              Evening Fortress
            </h2>
            <p className="text-sm text-[#E8E8E8] mt-1">
              {existingCompletion === 'full' ? '✅ Full Evening Fortress complete' :
               existingCompletion === 'partial' ? '⚡ Partial Evening Fortress' :
               '⬜ Evening Fortress skipped'}
            </p>
          </div>
          <button
            onClick={() => { setSaved(false); setExistingCompletion(''); }}
            className="text-xs text-[#666] px-3 py-1 rounded-lg border border-[#333] hover:border-[#666] transition-colors"
          >
            Edit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[#141414] border border-[#C4601D44] p-4 space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-sm font-bold tracking-widest text-[#C4601D] uppercase flex items-center gap-2">
          <span>⚠</span> Evening Fortress
        </h2>
        <p className="text-xs text-[#9A9A9A] mt-1">
          Defensive architecture. Protects through the vulnerability window.
          {curfewTime && <> Curfew: {curfewTime}.</>}
        </p>
      </div>

      {/* Why this matters */}
      <div className="p-3 rounded-lg bg-[#1A1A1A] border border-[#C4601D22]">
        <p className="text-xs text-[#9A9A9A] leading-relaxed">
          Most relapses occur between 10 PM and 2 AM: alone, tired, in bed, phone accessible, willpower at daily minimum. The Evening Fortress eliminates every variable simultaneously.
        </p>
      </div>

      {/* Checklist */}
      <div className="space-y-1">
        {EVENING_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className="flex items-start gap-3 w-full text-left py-2 group"
          >
            <div
              className="w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all"
              style={{
                borderColor: checked[item.id] ? '#2D8B4E' : '#444',
                backgroundColor: checked[item.id] ? '#2D8B4E' : 'transparent',
              }}
            >
              {checked[item.id] && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <div className="flex-1">
              <span
                className="text-sm leading-snug transition-colors block"
                style={{
                  color: checked[item.id] ? '#9A9A9A' : '#E8E8E8',
                  textDecoration: checked[item.id] ? 'line-through' : 'none',
                }}
              >
                {item.label}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-[#1E1E1E] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${(checkedCount / EVENING_ITEMS.length) * 100}%`,
              backgroundColor: allChecked ? '#2D8B4E' : '#C4601D',
            }}
          />
        </div>
        <span className="text-xs text-[#666] font-mono">{checkedCount}/{EVENING_ITEMS.length}</span>
      </div>

      {/* Completion buttons */}
      <div className="flex gap-2">
        {allChecked ? (
          <button
            onClick={() => handleComplete('full')}
            className="flex-1 py-3 rounded-xl bg-[#2D8B4E] text-white font-semibold text-sm transition-colors hover:bg-[#348F55]"
          >
            ✓ Mark Full Complete
          </button>
        ) : (
          <>
            <button
              onClick={() => handleComplete('partial')}
              className="flex-1 py-3 rounded-xl bg-[#1E1E1E] text-[#9A9A9A] font-medium text-sm border border-[#333] hover:border-[#666] transition-colors"
            >
              Mark Partial
            </button>
            <button
              onClick={() => handleComplete('skipped')}
              className="py-3 px-4 rounded-xl bg-[#1E1E1E] text-[#666] font-medium text-sm border border-[#333] hover:border-[#666] transition-colors"
            >
              Skip
            </button>
          </>
        )}
      </div>
    </div>
  );
}
