import { useState, useEffect, useCallback } from 'react';
import type { FortressCompletion } from '../types';
import { getTodayLog, saveMorningFortress } from '../store';

interface Props {
  dayNumber: number;
  onComplete?: (completion: FortressCompletion) => void;
}

type Tier = 'minimum' | 'standard' | 'maximum';

interface FortressItem {
  id: string;
  label: string;
  detail: string;
  mechanism: string;
  tiers: Tier[]; // which tiers include this item
}

const FORTRESS_ITEMS: FortressItem[] = [
  // WAKE
  {
    id: 'wake',
    label: 'Wake — no phone, cold water on face',
    detail: 'Rise without touching your phone. Splash cold water on face to activate the mammalian dive reflex.',
    mechanism: 'Dive reflex → HR stabilized → cortisol regulated → clean neural boot.',
    tiers: ['minimum', 'standard', 'maximum'],
  },
  // BREATH
  {
    id: 'nadi',
    label: 'Nadi Shodhana (alternate nostril)',
    detail: 'Minimum: 5 min. Standard: 10 min. Close right nostril → inhale left 4s → close both → hold 4s → exhale right 4s → inhale right → hold → exhale left. One cycle.',
    mechanism: 'Vagal stimulation → parasympathetic → cortisol↓ → autonomic balance → clarity.',
    tiers: ['minimum', 'standard', 'maximum'],
  },
  {
    id: 'bhastrika',
    label: 'Bhastrika (bellows breath, 3 min)',
    detail: 'Rapid forceful inhale/exhale through nose, 1 sec each. 30 breaths per round. 3 rounds with 30s rest between.',
    mechanism: 'Sympathetic activation → energy mobilized → stagnant prana moved → furnace ignited.',
    tiers: ['standard', 'maximum'],
  },
  {
    id: 'kumbhaka',
    label: 'Kumbhaka with Mula Bandha',
    detail: 'Minimum: skip. Standard: 2 min. Maximum: 10 min with all bandhas. Inhale 4s → hold 16s (engage mula bandha) → exhale 8s.',
    mechanism: 'Breath retention → CO₂ tolerance↑ → prana compressed into spine → energy redirected upward.',
    tiers: ['standard', 'maximum'],
  },
  // MEDITATION
  {
    id: 'bodyscan',
    label: 'Body scan / Vipassana',
    detail: 'Minimum: 10 min. Standard: 10 min. Maximum: 10 min. Systematic attention from crown to toes. Dissolve tension. Identify holding patterns.',
    mechanism: 'Interoceptive awareness↑ → tension released → residue dissolved → somatic intelligence restored.',
    tiers: ['minimum', 'standard', 'maximum'],
  },
  {
    id: 'concentration',
    label: 'Concentration / Sankalpa',
    detail: 'Standard: 10 min focus + plant sankalpa. Maximum: 10 min focus + 10 min open awareness. Sankalpa: "I am a vessel of transformed power."',
    mechanism: 'PFC strengthened → DMN decoupled → dopamine↑65% → sankalpa planted → subconscious aligned.',
    tiers: ['standard', 'maximum'],
  },
  {
    id: 'open_awareness',
    label: 'Open awareness meditation (10 min)',
    detail: 'Sit without object. Allow awareness to rest as awareness itself. Microcosmic orbit or mantra if preferred.',
    mechanism: 'DMN integration → self-referential processing optimized → identity consolidation.',
    tiers: ['maximum'],
  },
  // COLD
  {
    id: 'cold',
    label: 'Cold exposure',
    detail: 'Minimum: 1 min cold at end of shower. Standard: 3 min full cold shower. Maximum: 5 min cold immersion.',
    mechanism: 'Norepinephrine↑300% → Dopamine↑250% (sustained hours) → willpower trained → symbolic commitment.',
    tiers: ['minimum', 'standard', 'maximum'],
  },
  // PURPOSE
  {
    id: 'purpose_read',
    label: 'Read purpose statement',
    detail: 'Read your written purpose statement aloud. Feel it in your body, not just your mind.',
    mechanism: 'PFC activated → goal encoded → dopamine directed toward purpose → identity reinforced.',
    tiers: ['minimum', 'standard', 'maximum'],
  },
  {
    id: 'purpose_visualize',
    label: 'Visualize purpose outcome (1 min)',
    detail: 'Close eyes. See the outcome of your purpose as already achieved. Feel the future state.',
    mechanism: 'Mental rehearsal → motor cortex pre-activation → motivation pathway strengthened.',
    tiers: ['standard', 'maximum'],
  },
  {
    id: 'purpose_journal',
    label: 'Purpose journal (3 min)',
    detail: 'Write freely about your purpose. What will you build today? What energy will you direct?',
    mechanism: 'Written encoding → explicit processing → commitment deepened → clarity↑.',
    tiers: ['maximum'],
  },
  // DEATH MEDITATION
  {
    id: 'death_med',
    label: 'Death meditation (1 min)',
    detail: '"If today were my last day, would I spend it in fog? Or fully alive?" 60 seconds with the Five Remembrances.',
    mechanism: 'Mortality salience → temporal discounting collapsed → every hour becomes precious → waste unthinkable.',
    tiers: ['standard', 'maximum'],
  },
  // BANDHA
  {
    id: 'bandha_basic',
    label: 'Mula Bandha (10 contractions)',
    detail: 'Contract the perineum — the point between genitals and anus. 5 sec hold, 5 sec release. 10 reps.',
    mechanism: 'Fascial piezoelectric → energy redirected upward → spinal ejaculation generator overridden → containment sealed.',
    tiers: ['minimum'],
  },
  {
    id: 'bandha_full',
    label: 'Mula Bandha 3×10 with breath sync',
    detail: 'Three sets of 10 contractions. Coordinate with breath: contract on inhale, release on exhale. Rest 30s between sets.',
    mechanism: 'Fascial piezoelectric → energy redirected upward → spinal ejaculation generator overridden → containment sealed.',
    tiers: ['standard'],
  },
  {
    id: 'bandha_maha',
    label: 'Maha Bandha (3×10 + Uddiyana + Jalandhara)',
    detail: 'Full triple lock. After exhale: mula bandha + draw navel up (uddiyana) + chin to chest (jalandhara). Hold 10s. Release in reverse. 3 rounds.',
    mechanism: 'Sealed pressurized vessel → CSF hydraulics activated → energy compressed upward → alchemical athanor engaged.',
    tiers: ['maximum'],
  },
];

function getItemsForTier(tier: Tier): FortressItem[] {
  return FORTRESS_ITEMS.filter((item) => item.tiers.includes(tier));
}

function getTierDuration(tier: Tier): string {
  switch (tier) {
    case 'minimum': return '~20 min';
    case 'standard': return '~45 min';
    case 'maximum': return '~90 min';
  }
}

function getTierRiseTime(tier: Tier): string {
  switch (tier) {
    case 'minimum': return '5:30 AM';
    case 'standard': return '5:00 AM';
    case 'maximum': return '4:30 AM';
  }
}

export function MorningFortress({ dayNumber, onComplete }: Props) {
  const [tier, setTier] = useState<Tier>('standard');
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [existingCompletion, setExistingCompletion] = useState<FortressCompletion>('');

  // Load existing state
  useEffect(() => {
    const todayLog = getTodayLog();
    if (todayLog?.morningFortress) {
      setExistingCompletion(todayLog.morningFortress);
      if (todayLog.morningFortress === 'full' || todayLog.morningFortress === 'minimum') {
        setSaved(true);
      }
    }
  }, []);

  const items = getItemsForTier(tier);
  const checkedCount = items.filter((item) => checked[item.id]).length;
  const allChecked = checkedCount === items.length;

  const toggleItem = useCallback((id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
    setSaved(false);
  }, []);

  const handleComplete = useCallback((completion: FortressCompletion) => {
    saveMorningFortress(completion, dayNumber);
    setExistingCompletion(completion);
    setSaved(true);
    onComplete?.(completion);
  }, [dayNumber, onComplete]);

  // Already completed for today
  if (saved && existingCompletion) {
    const completionLabels: Record<string, string> = {
      full: '✅ Full Morning Fortress complete',
      minimum: '✅ Minimum Morning Fortress complete',
      partial: '⚡ Partial Morning Fortress',
      skipped: '⬜ Morning Fortress skipped',
    };

    return (
      <div className="rounded-xl bg-[#141414] border border-[#2D8B4E44] p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold tracking-widest text-[#2D8B4E] uppercase">
              Morning Fortress
            </h2>
            <p className="text-sm text-[#E8E8E8] mt-1">
              {completionLabels[existingCompletion] || existingCompletion}
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
    <div className="rounded-xl bg-[#141414] border border-[#1E1E1E] p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-widest text-[#D4A017] uppercase">
          Morning Fortress
        </h2>
        <span className="text-xs text-[#666]">{getTierDuration(tier)} · Rise by {getTierRiseTime(tier)}</span>
      </div>

      {/* Tier selector */}
      <div className="flex gap-2">
        {(['minimum', 'standard', 'maximum'] as Tier[]).map((t) => (
          <button
            key={t}
            onClick={() => setTier(t)}
            className="flex-1 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide transition-colors"
            style={{
              backgroundColor: tier === t ? '#D4A01722' : '#1E1E1E',
              color: tier === t ? '#D4A017' : '#666',
              border: `1px solid ${tier === t ? '#D4A01744' : '#333'}`,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Checklist */}
      <div className="space-y-1 stagger-children">
        {items.map((item) => (
          <div key={item.id}>
            <button
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
              <span
                className="text-sm leading-snug transition-colors"
                style={{ color: checked[item.id] ? '#9A9A9A' : '#E8E8E8', textDecoration: checked[item.id] ? 'line-through' : 'none' }}
              >
                {item.label}
              </span>
            </button>
            {/* Expandable detail */}
            <button
              onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
              className="ml-8 text-xs text-[#666] hover:text-[#9A9A9A] transition-colors mb-1"
            >
              {expandedItem === item.id ? '▾ hide detail' : '▸ how & why'}
            </button>
            {expandedItem === item.id && (
              <div className="ml-8 mb-2 p-3 rounded-lg bg-[#1A1A1A] border border-[#1E1E1E] animate-fade-in-fast">
                <p className="text-xs text-[#9A9A9A] leading-relaxed mb-2">{item.detail}</p>
                <p className="text-xs text-[#8B6914] font-mono leading-relaxed">{item.mechanism}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-[#1E1E1E] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#D4A017] rounded-full transition-all duration-300"
            style={{ width: `${items.length > 0 ? (checkedCount / items.length) * 100 : 0}%` }}
          />
        </div>
        <span className="text-xs text-[#666] font-mono">{checkedCount}/{items.length}</span>
      </div>

      {/* Completion buttons */}
      <div className="flex gap-2">
        {allChecked ? (
          <button
            onClick={() => handleComplete(tier === 'minimum' ? 'minimum' : 'full')}
            className="flex-1 py-3 rounded-xl bg-[#2D8B4E] text-white font-semibold text-sm transition-colors hover:bg-[#348F55]"
          >
            ✓ Mark {tier === 'minimum' ? 'Minimum' : 'Full'} Complete
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

      {/* Non-negotiable reminder */}
      <p className="text-xs text-[#666] text-center italic">
        Non-negotiable means non-negotiable. Sick? Minimum. Tired? Minimum. Traveling? Minimum.
      </p>
    </div>
  );
}
