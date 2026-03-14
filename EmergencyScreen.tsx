import { useState, useCallback } from 'react';
import { TimerWidget } from './TimerWidget';

type Stage =
  | 'initial'
  | 'wave'
  | 'tsunami-1'
  | 'tsunami-2'
  | 'tsunami-3'
  | 'tsunami-4'
  | 'tsunami-5'
  | 'tsunami-6'
  | 'passed'
  | 'relapse';

interface Props {
  onClose: () => void;
  onRelapse: () => void;
  partnerName: string;
  partnerPhone: string;
}

const tsunamiLevels: {
  level: number;
  duration: number;
  title: string;
  instructions: string[];
  timerLabel: string;
}[] = [
  {
    level: 1,
    duration: 30,
    title: 'BREATHE + BANDHA + EYES AWAY',
    instructions: [
      'Three deep breaths. Right now.',
      'Engage mula bandha HARD — contract the perineum.',
      'Eyes away from any trigger.',
      '"This is a wave. I am watching it."',
    ],
    timerLabel: '30 seconds',
  },
  {
    level: 2,
    duration: 120,
    title: 'STAND UP. MOVE. NOW.',
    instructions: [
      'STAND UP immediately. Leave the room.',
      'Cold water on face and wrists.',
      '20 pushups RIGHT NOW. Non-negotiable.',
      'The physical exertion redirects the energy.',
    ],
    timerLabel: '2 minutes',
  },
  {
    level: 3,
    duration: 300,
    title: 'COLD SHOWER + SITALI BREATHING',
    instructions: [
      'Full cold shower. Step in NOW.',
      'Sitali breathing: curl tongue, inhale through mouth, exhale through nose.',
      'The cold shocks the nervous system out of the arousal pattern.',
      'Stay in until the urge subsides or the timer completes.',
    ],
    timerLabel: '5 minutes',
  },
  {
    level: 4,
    duration: 900,
    title: 'CALL SOMEONE. LEAVE THE BUILDING.',
    instructions: [
      'Call your accountability partner NOW.',
      'Leave the building. Walk outside.',
      'Say your purpose statement aloud.',
      'Movement + social connection + purpose = triple override.',
    ],
    timerLabel: '15 minutes',
  },
  {
    level: 5,
    duration: 1800,
    title: 'GO TO A PUBLIC PLACE',
    instructions: [
      'Go somewhere acting out is impossible.',
      'Gym. Library. Park. Coffee shop.',
      'Vigorous physical activity if possible.',
      'The environment does what willpower cannot.',
    ],
    timerLabel: '30 minutes',
  },
  {
    level: 6,
    duration: 0,
    title: 'GO TO SOMEONE\'S HOME',
    instructions: [
      'Go to a friend\'s or family member\'s home.',
      'Stay until the wave passes completely.',
      'You do not need to explain why you are there.',
      'Your presence in a safe environment is enough.',
      'This is the nuclear option. It works. Every time.',
    ],
    timerLabel: '',
  },
];

const HALT_BLAST_FACTORS = [
  { key: 'H', label: 'Hungry', desc: 'Blood sugar low, haven\'t eaten' },
  { key: 'A', label: 'Angry', desc: 'Frustrated, irritated, resentful' },
  { key: 'L', label: 'Lonely', desc: 'Isolated, disconnected, craving contact' },
  { key: 'T', label: 'Tired', desc: 'Exhausted, sleep-deprived, depleted' },
  { key: 'B', label: 'Bored', desc: 'Understimulated, no engagement' },
  { key: 'L2', label: 'Late night', desc: 'Past curfew, willpower at minimum' },
  { key: 'A2', label: 'Alcohol', desc: 'Inhibition lowered, judgment impaired' },
  { key: 'S', label: 'Stressed', desc: 'Overwhelmed, cortisol elevated' },
  { key: 'T2', label: 'Technology', desc: 'Phone in hand, screens accessible' },
];

export function EmergencyScreen({ onClose, onRelapse, partnerName, partnerPhone }: Props) {
  const [stage, setStage] = useState<Stage>('initial');
  const [triggerNote, setTriggerNote] = useState('');
  const [maxLevelReached, setMaxLevelReached] = useState(0);
  const [haltBlastOpen, setHaltBlastOpen] = useState(false);
  const [activeFactors, setActiveFactors] = useState<Set<string>>(new Set());

  const toggleFactor = useCallback((key: string) => {
    setActiveFactors(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }, []);

  const goToLevel = useCallback((level: number) => {
    setMaxLevelReached((prev) => Math.max(prev, level));
    setStage(`tsunami-${level}` as Stage);
  }, []);

  const wavePassed = useCallback(() => {
    setStage('passed');
  }, []);

  // ──── INITIAL: Wave or Tsunami ────
  if (stage === 'initial') {
    return (
      <div className="fixed inset-0 z-50 bg-[#0A0A0A] overflow-y-auto">
        <div className="min-h-full flex flex-col items-center justify-center p-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[#B82020] flex items-center justify-center mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <circle cx="12" cy="16" r="0.5" fill="white" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-[#E8E8E8] mb-2">EMERGENCY PROTOCOL</h1>
          <p className="text-[#9A9A9A] text-center mb-6 max-w-xs">
            You are here because an urge has hit. That takes courage. Now — assess its intensity.
          </p>

          {/* HALT+BLAST Quick Check */}
          <div className="w-full max-w-sm mb-6">
            <button
              onClick={() => setHaltBlastOpen(!haltBlastOpen)}
              className="w-full text-left px-4 py-3 rounded-xl bg-[#141414] border border-[#1E1E1E] flex items-center justify-between"
            >
              <span className="text-xs font-bold tracking-widest text-[#9A9A9A] uppercase">
                HALT+BLAST Check {activeFactors.size > 0 && `(${activeFactors.size} active)`}
              </span>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"
                style={{ transform: haltBlastOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
              >
                <polyline points="6,9 12,15 18,9" />
              </svg>
            </button>
            {haltBlastOpen && (
              <div className="mt-2 p-3 rounded-xl bg-[#141414] border border-[#1E1E1E] space-y-1.5 animate-fade-in">
                <p className="text-xs text-[#666] mb-2">Tap each factor that is active right now:</p>
                {HALT_BLAST_FACTORS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => toggleFactor(f.key)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors"
                    style={{
                      backgroundColor: activeFactors.has(f.key) ? '#C4601D18' : 'transparent',
                      borderLeft: activeFactors.has(f.key) ? '3px solid #C4601D' : '3px solid transparent',
                    }}
                  >
                    <span className="text-sm font-bold w-5" style={{ color: activeFactors.has(f.key) ? '#C4601D' : '#666' }}>
                      {f.key.replace('2', '')}
                    </span>
                    <div className="flex-1">
                      <span className="text-sm" style={{ color: activeFactors.has(f.key) ? '#E8E8E8' : '#9A9A9A' }}>
                        {f.label}
                      </span>
                      <span className="text-xs text-[#666] ml-2">{f.desc}</span>
                    </div>
                  </button>
                ))}
                {activeFactors.size >= 3 && (
                  <div className="mt-2 p-3 rounded-lg bg-[#C4601D18] border border-[#C4601D44]">
                    <p className="text-xs text-[#C4601D] font-semibold">
                      ⚠ {activeFactors.size} factors active — elevated risk. Consider starting at Level 2+ (STAND UP, leave room, pushups).
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="w-full max-w-sm space-y-4">
            <button
              onClick={() => setStage('wave')}
              className="w-full py-5 px-6 rounded-xl text-left transition-colors"
              style={{ backgroundColor: '#1E1E1E', border: '1px solid #333' }}
            >
              <div className="text-lg font-bold text-[#D4A017] mb-1">WAVE</div>
              <div className="text-sm text-[#9A9A9A]">Manageable. I can feel it but I can think clearly.</div>
            </button>

            <button
              onClick={() => goToLevel(1)}
              className="w-full py-5 px-6 rounded-xl text-left transition-colors"
              style={{ backgroundColor: '#1A0808', border: '1px solid #B82020' }}
            >
              <div className="text-lg font-bold text-[#B82020] mb-1">TSUNAMI</div>
              <div className="text-sm text-[#9A9A9A]">Overwhelming. Prefrontal cortex offline. Need escalating protocol.</div>
            </button>
          </div>

          <button
            onClick={onClose}
            className="mt-10 text-sm text-[#666] underline"
          >
            False alarm — go back
          </button>
        </div>
      </div>
    );
  }

  // ──── WAVE: Simple protocol ────
  if (stage === 'wave') {
    return (
      <div className="fixed inset-0 z-50 bg-[#0A0A0A] overflow-y-auto">
        <div className="min-h-full p-6 max-w-lg mx-auto animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-[#D4A017]">WAVE PROTOCOL</h2>
            <button onClick={onClose} className="text-[#666] text-sm">✕</button>
          </div>

          <div className="space-y-4 mb-8 stagger-children">
            {[
              '1. Three deep breaths. Right now.',
              '2. Engage mula bandha HARD.',
              '3. Eyes away from trigger.',
              '4. "This wave passes in 20 minutes. I am watching."',
              '5. Continue what you were doing.',
            ].map((step, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#141414] border border-[#1E1E1E]">
                <p className="text-[#E8E8E8] text-base leading-relaxed">{step}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center mb-8">
            <TimerWidget
              duration={1200}
              label="Wave timer — 20 minutes"
              onComplete={wavePassed}
              size={160}
            />
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-[#9A9A9A] italic">
              "You are not resisting forever. You are resisting for twenty minutes. The wave always passes."
            </p>
            <button
              onClick={wavePassed}
              className="w-full py-3.5 rounded-xl bg-[#2D8B4E] text-white font-semibold text-base"
            >
              Wave passed — I survived
            </button>
            <button
              onClick={() => goToLevel(1)}
              className="w-full py-3 rounded-xl text-[#B82020] border border-[#B82020] font-semibold text-sm"
            >
              Escalating — switch to Tsunami protocol
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ──── TSUNAMI: Escalating levels ────
  if (stage.startsWith('tsunami-')) {
    const levelNum = parseInt(stage.split('-')[1]);
    const levelData = tsunamiLevels[levelNum - 1];
    const isLastLevel = levelNum === 6;
    const hasPartner = partnerName && partnerPhone;

    return (
      <div className="fixed inset-0 z-50 bg-[#0A0A0A] overflow-y-auto">
        <div className="min-h-full p-6 max-w-lg mx-auto animate-fade-in" key={stage}>
          {/* Level indicator */}
          <div className="flex items-center gap-2 mb-6">
            {tsunamiLevels.map((_, i) => (
              <div
                key={i}
                className="h-1.5 flex-1 rounded-full"
                style={{
                  backgroundColor: i < levelNum ? '#B82020' : '#1E1E1E',
                }}
              />
            ))}
          </div>

          <div className="mb-2">
            <span className="text-xs font-bold tracking-widest text-[#B82020]">
              LEVEL {levelData.level} OF 6
            </span>
          </div>

          <h2 className="text-xl font-bold text-[#E8E8E8] mb-6">
            {levelData.title}
          </h2>

          <div className="space-y-3 mb-8 stagger-children">
            {levelData.instructions.map((inst, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#141414] border border-[#1E1E1E]">
                <p className="text-[#E8E8E8] text-base leading-relaxed">{inst}</p>
              </div>
            ))}

            {/* Phone call button for Level 4 */}
            {levelNum === 4 && hasPartner && (
              <a
                href={`tel:${partnerPhone}`}
                className="flex items-center justify-center gap-3 p-4 rounded-xl bg-[#2D6B8B] text-white font-semibold text-lg"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Call {partnerName}
              </a>
            )}

            {levelNum === 4 && !hasPartner && (
              <div className="p-4 rounded-xl bg-[#1E1E1E] border border-[#C4601D]">
                <p className="text-[#C4601D] text-sm">
                  No accountability partner set. Call anyone you trust — friend, family, anyone. You are not meant to fight alone.
                </p>
              </div>
            )}
          </div>

          {/* Timer */}
          {levelData.duration > 0 && (
            <div className="flex flex-col items-center mb-8">
              <TimerWidget
                duration={levelData.duration}
                label={levelData.timerLabel}
                size={140}
                autoStart={true}
                accentColor="#B82020"
              />
            </div>
          )}

          {/* Navigation */}
          <div className="space-y-3 mt-6">
            <button
              onClick={wavePassed}
              className="w-full py-3.5 rounded-xl bg-[#2D8B4E] text-white font-semibold text-base"
            >
              Wave passed — I survived
            </button>

            {!isLastLevel && (
              <button
                onClick={() => goToLevel(levelNum + 1)}
                className="w-full py-3 rounded-xl text-[#B82020] border border-[#B82020] font-semibold text-sm"
              >
                Still overwhelming → Level {levelNum + 1}
              </button>
            )}
          </div>

          <p className="text-center text-xs text-[#666] mt-6">
            Waves peak and fall in 15–40 minutes IF NOT FED.
            <br />You never resist forever. You resist for ONE WAVE.
          </p>
        </div>
      </div>
    );
  }

  // ──── WAVE PASSED ────
  if (stage === 'passed') {
    return (
      <div className="fixed inset-0 z-50 bg-[#0A0A0A] overflow-y-auto">
        <div className="min-h-full p-6 max-w-lg mx-auto animate-fade-in">
          <div className="flex flex-col items-center mb-8 pt-12">
            <div className="w-20 h-20 rounded-full bg-[#2D8B4E] flex items-center justify-center mb-4">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20,6 9,17 4,12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#2D8B4E] mb-2">Wave passed.</h2>
            <p className="text-[#E8E8E8] text-center text-lg">You survived.</p>
            <p className="text-[#9A9A9A] text-center text-sm mt-2">
              Each wave survived weakens the next.<br />
              This is extinction learning — you are rewiring your brain right now.
            </p>
          </div>

          {maxLevelReached > 0 && (
            <div className="p-4 rounded-xl bg-[#141414] border border-[#1E1E1E] mb-6">
              <p className="text-xs text-[#9A9A9A] mb-1">Max escalation reached</p>
              <p className="text-[#D4A017] font-semibold">Level {maxLevelReached} of 6</p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm text-[#9A9A9A] mb-2">
              Log the trigger — data, not judgment:
            </label>
            <textarea
              value={triggerNote}
              onChange={(e) => setTriggerNote(e.target.value)}
              placeholder="What triggered this wave? (environment, emotion, time, stimulus...)"
              className="w-full p-4 rounded-xl bg-[#141414] border border-[#1E1E1E] text-[#E8E8E8] text-sm resize-none placeholder:text-[#666] focus:outline-none focus:border-[#D4A017]"
              rows={3}
            />
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl bg-[#D4A017] text-[#0A0A0A] font-semibold text-base mb-4"
          >
            Return to Today
          </button>

          <div className="border-t border-[#1E1E1E] pt-6 mt-4">
            <button
              onClick={() => {
                onRelapse();
              }}
              className="w-full py-3 rounded-xl text-[#666] text-sm"
            >
              If relapse occurred — tap here. No shame, just data.
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
