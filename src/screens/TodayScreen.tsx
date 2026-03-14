import { useState, useCallback } from 'react';
import type { UserProfile, DailyLog as DailyLogType } from '../types';
import { getTimeOfDay, getGreeting, getTimeIcon, formatMorningsLeft, getPhaseLabel } from '../utils';
import { getDailyInsight, getTodayExercise, getCurrentWeekGuidance } from '../data/insights';
import { getAphorismForDay } from '../data/aphorisms';
import { isInChaserWindow, getTodayLog, analyzeRelapsePatterns } from '../store';
import { MorningFortress } from './MorningFortress';
import { EveningFortress } from './EveningFortress';
import { DailyLog } from './DailyLog';

interface Props {
  dayNumber: number;
  profile: UserProfile;
  onProfileUpdate?: (profile: UserProfile) => void;
}

// HALT+BLAST factors for evening self-check
const HALT_BLAST = [
  { key: 'H', label: 'Hungry' },
  { key: 'A', label: 'Angry' },
  { key: 'L', label: 'Lonely' },
  { key: 'T', label: 'Tired' },
  { key: 'B', label: 'Bored' },
  { key: 'L2', label: 'Late night' },
  { key: 'A2', label: 'Alcohol' },
  { key: 'S', label: 'Stressed' },
  { key: 'T2', label: 'Technology' },
];

export function TodayScreen({ dayNumber, profile }: Props) {
  const timeOfDay = getTimeOfDay();
  const greeting = getGreeting(timeOfDay);
  const timeIcon = getTimeIcon(timeOfDay);
  const severity = profile.depletionSeverityIndex.severity;
  const insight = getDailyInsight(dayNumber, severity);
  const aphorism = getAphorismForDay(dayNumber);
  const morningsLeft = formatMorningsLeft(profile.depletionSeverityIndex.currentAge || 30);
  const exercise = getTodayExercise();
  const weekGuidance = getCurrentWeekGuidance(dayNumber);
  const chaserActive = isInChaserWindow(profile);
  const todayLog = getTodayLog();
  const relapsePatterns = analyzeRelapsePatterns(profile);
  const phaseLabel = getPhaseLabel(dayNumber);
  const estimatedDays = profile.depletionSeverityIndex.estimatedRecoveryDays;

  // Track midday energy check-in
  const [energyCheckedIn, setEnergyCheckedIn] = useState(false);
  const [middayEnergy, setMiddayEnergy] = useState(0);

  // HALT+BLAST check state
  const [haltFactors, setHaltFactors] = useState<Set<string>>(new Set());
  const [haltChecked, setHaltChecked] = useState(false);

  // Morning fortress status from today's log
  const morningDone = todayLog?.morningFortress === 'full' || todayLog?.morningFortress === 'minimum';
  const eveningDone = todayLog?.eveningFortress === 'full' || todayLog?.eveningFortress === 'partial' || todayLog?.eveningFortress === 'skipped';

  const handleLogSaved = useCallback((_log: DailyLogType) => {
    // Visual feedback handled internally by DailyLog
  }, []);

  const toggleHalt = useCallback((key: string) => {
    setHaltFactors(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }, []);

  // Recovery progress percentage
  const recoveryProgress = Math.min(100, Math.round((dayNumber / estimatedDays) * 100));
  const isAdvancedPractitioner = dayNumber > 365;
  const isPostConvergence = dayNumber > 90;

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      {/* ─── GREETING + STREAK ─── */}
      <div className="pt-1">
        <h1 className="text-2xl font-bold text-[#E8E8E8]">
          {timeIcon} {greeting}. Day {dayNumber}.
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-[#9A9A9A]">
            {phaseLabel}
            {profile.longestStreak > 0 && dayNumber > 1 && ` · Best: ${profile.longestStreak}d`}
          </span>
          {weekGuidance.week <= 13 && (
            <span className="text-xs px-2 py-0.5 rounded bg-[#1E1E1E] text-[#D4A017] font-medium">
              Week {weekGuidance.week}: {weekGuidance.title}
            </span>
          )}
        </div>
      </div>

      {/* ─── DAY 1 WELCOME ─── */}
      {dayNumber === 1 && (
        <div className="rounded-xl bg-[#141414] border border-[#D4A01744] p-4 animate-fade-in">
          <h3 className="text-sm font-bold text-[#D4A017] mb-2">🔥 Welcome to Day 1</h3>
          <p className="text-sm text-[#E8E8E8] leading-relaxed mb-3">
            This is the hardest 24-hour window. Every subsequent day is easier. The chaser effect may be intense — this is prolactin normalizing and dopamine recovering. It is neurochemistry, not weakness.
          </p>
          <div className="space-y-1.5 text-xs text-[#9A9A9A]">
            <p>Your severity: <strong className="text-[#E8E8E8] capitalize">{severity}</strong> (DSI: {profile.depletionSeverityIndex.totalScore})</p>
            <p>Estimated recovery: <strong className="text-[#E8E8E8]">{estimatedDays} days</strong></p>
            <p className="text-[#8B6914] italic mt-2">
              &ldquo;You are not resisting forever. You are resisting for twenty minutes. The wave always passes.&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* ─── RECOVERY TIMELINE ─── */}
      {dayNumber > 1 && dayNumber <= estimatedDays && (
        <div className="rounded-xl bg-[#0D0D0D] border border-[#1E1E1E] p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-[#9A9A9A]">Recovery progress</span>
            <span className="text-xs font-medium text-[#D4A017]">Day {dayNumber} of ~{estimatedDays}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#1E1E1E]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${recoveryProgress}%`,
                backgroundColor: recoveryProgress >= 100 ? '#2D8B4E' : '#D4A017',
              }}
            />
          </div>
          {recoveryProgress < 30 && (
            <p className="text-xs text-[#666] mt-1.5">
              You are in the slow initial phase. The S-curve will bend upward. It always does.
            </p>
          )}
          {recoveryProgress >= 30 && recoveryProgress < 70 && (
            <p className="text-xs text-[#666] mt-1.5">
              Acceleration phase. The 12 feedback loops are compounding. Each week easier than the last.
            </p>
          )}
          {recoveryProgress >= 70 && (
            <p className="text-xs text-[#666] mt-1.5">
              Approaching your estimated threshold. The foundation is nearly complete.
            </p>
          )}
        </div>
      )}

      {/* ─── CHASER WARNING ─── */}
      {chaserActive && (
        <div className="rounded-xl bg-[#B8202015] border border-[#B8202044] p-4 animate-fade-in">
          <h3 className="text-sm font-bold text-[#B82020] mb-1">⚠️ CHASER WINDOW ACTIVE</h3>
          <p className="text-xs text-[#E8E8E8] leading-relaxed mb-2">
            You are within 72 hours of your last relapse. The chaser effect is creating intense craving. This is neurochemistry — prolactin elevated, dopamine crashed. It WILL pass.
          </p>
          <div className="space-y-1">
            {[
              'Exercise today (non-negotiable)',
              'Cold exposure 2×/day',
              'Screens off by 7 PM (strict)',
              'Stay in public spaces during peak vulnerability',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[#B82020] text-xs">▪</span>
                <span className="text-xs text-[#E8E8E8]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TRIGGER PATTERN ALERT ─── */}
      {relapsePatterns.mostCommonTrigger && relapsePatterns.totalRelapses >= 2 && (
        <div className="rounded-xl bg-[#C4601D11] border border-[#C4601D33] p-3">
          <p className="text-xs text-[#C4601D] leading-relaxed">
            📊 Pattern detected: Your most common trigger is <strong>{relapsePatterns.mostCommonTrigger.toLowerCase()}</strong>
            {relapsePatterns.mostCommonEnvironment && <>, usually in <strong>{relapsePatterns.mostCommonEnvironment.toLowerCase()}</strong></>}.
            {relapsePatterns.avgStreakBeforeRelapse > 0 && <> Average streak before relapse: <strong>{relapsePatterns.avgStreakBeforeRelapse} days</strong>.</>}
          </p>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          TIME-ADAPTIVE CONTENT
          ═══════════════════════════════════════════ */}

      {/* ─── MORNING: Fortress + Exercise + Insight ─── */}
      {timeOfDay === 'morning' && (
        <>
          <MorningFortress dayNumber={dayNumber} />

          {/* Exercise for today */}
          <div className="rounded-xl bg-[#141414] border border-[#1E1E1E] p-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-bold tracking-widest text-[#9A9A9A] uppercase">
                Today's Exercise
              </h3>
              <span className="text-xs text-[#666]">{exercise.dayName}</span>
            </div>
            <p className="text-sm text-[#E8E8E8] font-medium">{exercise.name}</p>
            <p className="text-xs text-[#8B6914] font-mono mt-1">{exercise.mechanism}</p>
          </div>
        </>
      )}

      {/* ─── MIDDAY: Status + Exercise + Bandha reminder + Energy check ─── */}
      {timeOfDay === 'midday' && (
        <>
          {/* Morning status */}
          {morningDone ? (
            <div className="rounded-xl bg-[#141414] border border-[#2D8B4E44] p-3">
              <p className="text-sm text-[#2D8B4E]">
                ✅ Morning Fortress: {todayLog?.morningFortress === 'full' ? 'Full' : 'Minimum'} complete
              </p>
            </div>
          ) : (
            <MorningFortress dayNumber={dayNumber} />
          )}

          {/* Exercise card */}
          <div className="rounded-xl bg-[#141414] border border-[#1E1E1E] p-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-bold tracking-widest text-[#D4A017] uppercase">
                Exercise — {exercise.dayName}
              </h3>
              {todayLog?.exerciseCompleted && (
                <span className="text-xs text-[#2D8B4E] font-medium">✅ Done</span>
              )}
            </div>
            <p className="text-sm text-[#E8E8E8] font-medium">{exercise.name}</p>
            <p className="text-xs text-[#8B6914] font-mono mt-1">{exercise.mechanism}</p>
          </div>

          {/* Mula Bandha reminder */}
          <div className="rounded-xl bg-[#141414] border border-[#1E1E1E] p-4">
            <h3 className="text-xs font-bold tracking-widest text-[#D4A017] uppercase mb-2">
              ⚡ Midday Reminder
            </h3>
            <p className="text-sm text-[#E8E8E8] leading-relaxed">
              Mula bandha. Right now. 10 contractions. 5 sec hold, 5 sec release. Nobody can see it.
            </p>
          </div>

          {/* Energy check-in */}
          {!energyCheckedIn ? (
            <div className="rounded-xl bg-[#141414] border border-[#1E1E1E] p-4">
              <h3 className="text-xs font-bold tracking-widest text-[#9A9A9A] uppercase mb-3">
                Energy Check-in
              </h3>
              <p className="text-xs text-[#666] mb-2">How are you feeling right now?</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <button
                    key={n}
                    onClick={() => { setMiddayEnergy(n); setEnergyCheckedIn(true); }}
                    className="flex-1 py-2.5 rounded text-xs font-bold transition-all bg-[#1A1A1A] text-[#666] border border-[#2A2A2A] hover:border-[#D4A017] hover:text-[#D4A017]"
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-[#141414] border border-[#1E1E1E] p-3 text-center">
              <p className="text-sm text-[#9A9A9A]">
                Energy: <span className="font-bold" style={{ color: middayEnergy >= 7 ? '#2D8B4E' : middayEnergy >= 4 ? '#D4A017' : '#C4601D' }}>{middayEnergy}/10</span>
              </p>
            </div>
          )}
        </>
      )}

      {/* ─── EVENING: Vulnerability warning + Fortress + HALT+BLAST + Log ─── */}
      {timeOfDay === 'evening' && (
        <>
          {/* Morning status (if done) */}
          {morningDone && (
            <div className="rounded-xl bg-[#141414] border border-[#2D8B4E44] p-3 flex items-center justify-between">
              <p className="text-sm text-[#2D8B4E]">
                ✅ Morning Fortress: {todayLog?.morningFortress === 'full' ? 'Full' : 'Minimum'}
              </p>
              {todayLog?.exerciseCompleted && (
                <p className="text-sm text-[#2D8B4E]">✅ Exercise</p>
              )}
            </div>
          )}

          <EveningFortress
            dayNumber={dayNumber}
            curfewTime={profile.eveningCurfewTime}
          />

          {/* HALT+BLAST Evening Check */}
          {!haltChecked ? (
            <div className="rounded-xl bg-[#141414] border border-[#1E1E1E] p-4">
              <h3 className="text-xs font-bold tracking-widest text-[#C4601D] uppercase mb-2">
                HALT+BLAST Check
              </h3>
              <p className="text-xs text-[#9A9A9A] mb-3">
                Tap each factor active right now. 3+ active = heightened vulnerability.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {HALT_BLAST.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => toggleHalt(f.key)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    style={{
                      backgroundColor: haltFactors.has(f.key) ? '#C4601D22' : '#1A1A1A',
                      color: haltFactors.has(f.key) ? '#C4601D' : '#666',
                      border: `1px solid ${haltFactors.has(f.key) ? '#C4601D44' : '#2A2A2A'}`,
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              {haltFactors.size >= 3 && (
                <div className="p-3 rounded-lg bg-[#C4601D18] border border-[#C4601D33] mb-3">
                  <p className="text-xs text-[#C4601D] font-semibold">
                    ⚠ {haltFactors.size} factors active — elevated risk. Deploy preemptive measures: leave the room, cold water, mula bandha, call partner.
                  </p>
                </div>
              )}
              <button
                onClick={() => setHaltChecked(true)}
                className="w-full py-2 rounded-lg bg-[#1E1E1E] text-[#9A9A9A] text-sm font-medium"
              >
                Checked ({haltFactors.size} active) — Continue
              </button>
            </div>
          ) : (
            haltFactors.size >= 3 && (
              <div className="rounded-xl bg-[#C4601D11] border border-[#C4601D33] p-3">
                <p className="text-xs text-[#C4601D]">
                  ⚠ HALT+BLAST: {haltFactors.size} factors active. Stay vigilant. Emergency protocol is one tap away.
                </p>
              </div>
            )
          )}

          {/* Daily Log — only show if evening fortress addressed */}
          {!eveningDone ? (
            <div className="rounded-xl bg-[#141414] border border-[#1E1E1E] p-4">
              <p className="text-xs text-[#666] text-center">
                Complete the Evening Fortress first, then log your day.
              </p>
            </div>
          ) : (
            <DailyLog dayNumber={dayNumber} onSave={handleLogSaved} />
          )}
        </>
      )}

      {/* ─── NIGHT: Calming + Minimal ─── */}
      {timeOfDay === 'night' && (
        <>
          {/* If evening not done, show fortress */}
          {!eveningDone && (
            <EveningFortress
              dayNumber={dayNumber}
              curfewTime={profile.eveningCurfewTime}
            />
          )}

          {/* Daily log if not done */}
          {!todayLog?.overallScore && (
            <DailyLog dayNumber={dayNumber} onSave={handleLogSaved} />
          )}

          {/* Calming message */}
          <div className="rounded-xl bg-[#141414] border border-[#1E1E1E] p-4">
            <p className="text-sm text-[#9A9A9A] leading-relaxed">
              If you cannot sleep: 4-7-8 breathing (8 rounds). Inhale 4 seconds through the nose, hold 7 seconds, exhale 8 seconds through the mouth. Mula bandha then full release. Body scan from crown to toes. The night is for recovery. Trust the process.
            </p>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════
          ALWAYS-VISIBLE CONTENT
          ═══════════════════════════════════════════ */}

      {/* ─── DAY INSIGHT ─── */}
      <div className="rounded-xl bg-[#141414] border border-[#1E1E1E] p-4">
        <h3 className="text-xs font-bold tracking-widest text-[#D4A017] uppercase mb-2">
          Day {dayNumber} — {insight.relevantChain} Chain
        </h3>
        <p className="text-sm text-[#E8E8E8] leading-relaxed">
          {insight.text}
        </p>
        {insight.severityNote && (
          <p className="text-xs text-[#9A9A9A] leading-relaxed mt-2 pt-2 border-t border-[#1E1E1E]">
            <span className="text-[#8B6914]">For your timeline:</span> {insight.severityNote}
          </p>
        )}
      </div>

      {/* ─── PRACTICAL GUIDANCE ─── */}
      {timeOfDay === 'morning' && (
        <div className="rounded-xl bg-[#0D0D0D] border border-[#1E1E1E] p-4">
          <h3 className="text-xs font-bold tracking-widest text-[#9A9A9A] uppercase mb-2">
            What to expect
          </h3>
          <p className="text-xs text-[#9A9A9A] leading-relaxed mb-2">{insight.experientialPrediction}</p>
          <p className="text-xs text-[#E8E8E8] leading-relaxed">{insight.practicalGuidance}</p>
        </div>
      )}

      {/* ─── WEEK FOCUS ─── */}
      {weekGuidance.week <= 13 && (
        <div className="rounded-xl bg-[#0D0D0D] border border-[#1E1E1E] p-4">
          <h3 className="text-xs font-bold tracking-widest text-[#9A9A9A] uppercase mb-2">
            Week {weekGuidance.week} Focus
          </h3>
          <p className="text-xs text-[#E8E8E8] leading-relaxed mb-2">{weekGuidance.focus}</p>
          <p className="text-xs text-[#C4601D]">⚠ Risk: {weekGuidance.risk}</p>
        </div>
      )}

      {/* ─── ADVANCED: POST-CONVERGENCE GUIDANCE ─── */}
      {isPostConvergence && dayNumber <= 365 && (
        <div className="rounded-xl bg-[#0D0D0D] border border-[#8B691422] p-4">
          <h3 className="text-xs font-bold tracking-widest text-[#8B6914] uppercase mb-2">
            Post-Convergence
          </h3>
          <p className="text-xs text-[#9A9A9A] leading-relaxed">
            The 5 clocks have converged. Your practice is now LIFESTYLE, not intervention. Maintain the architecture — it is load-bearing. Complacency is the primary danger.
            {dayNumber > 180 && ' Deep structural changes are manifesting: facial composition, vocal timbre, body composition. Slow variables, dramatic over months.'}
          </p>
          {dayNumber > 120 && (
            <p className="text-xs text-[#D4A017] mt-2">
              Purpose check: Is your dream big enough for your energy? If restlessness returns without urges, the container needs scaling. A purpose too small for your energy will overflow into compulsion.
            </p>
          )}
        </div>
      )}

      {/* ─── ADVANCED: MASTERY (365+) ─── */}
      {isAdvancedPractitioner && (
        <div className="rounded-xl bg-[#0D0D0D] border border-[#D4A01722] p-4">
          <h3 className="text-xs font-bold tracking-widest text-[#D4A017] uppercase mb-2">
            {dayNumber > 730 ? 'Sahaja — Natural State' : 'Pratisthayam — Establishment'}
          </h3>
          <p className="text-xs text-[#9A9A9A] leading-relaxed">
            {dayNumber > 730
              ? 'The scaffolding can release — the building stands on its own. Retention without effort. Transmutation without technique. Presence without practice. What lies beyond is genuinely unknown territory. Follow the energy into what no document can map.'
              : 'The practice is deeply encoded — physiologically, psychologically, behaviorally. Not "trying to retain" — retention is who you are. The energy simply directs. The architecture simply operates. Purpose simply absorbs.'
            }
          </p>
          <div className="mt-3 space-y-2">
            <p className="text-xs text-[#D4A017]">
              Advanced checks:
            </p>
            <div className="text-xs text-[#9A9A9A] space-y-1">
              <p>→ Love Test: More loving or more proud? More open or more rigid?</p>
              <p>→ Service intensity: Is your contribution scaling with your energy?</p>
              <p>→ Ego audit: Has the practice dissolved ego or inflated it?</p>
              <p>→ Architecture: Are the load-bearing walls still standing?</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── APHORISM ─── */}
      <div className="rounded-xl bg-[#0D0D0D] border border-[#8B691422] p-4">
        <h3 className="text-xs font-bold tracking-widest text-[#8B6914] uppercase mb-2">
          🔥 Aphorism
        </h3>
        <p className="text-sm text-[#D4A017] leading-relaxed italic">
          &ldquo;{aphorism}&rdquo;
        </p>
      </div>

      {/* ─── RATCHET STATS ─── */}
      {(profile.ratchetClicks > 0 || profile.totalRelapses > 0) && (
        <div className="rounded-xl bg-[#141414] border border-[#1E1E1E] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#9A9A9A]">Ratchet clicks</p>
              <p className="text-lg font-bold text-[#D4A017]">{profile.ratchetClicks}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#9A9A9A]">Total days retained</p>
              <p className="text-lg font-bold text-[#E8E8E8]">{profile.totalRetentionDays + dayNumber}</p>
            </div>
          </div>
          <p className="text-xs text-[#555] mt-2 text-center italic">
            The streak is a metric. The mastery is the identity. Metrics reset. Identity ratchets forward.
          </p>
        </div>
      )}

      {/* ─── EVENING/NIGHT MORTALITY REMINDER ─── */}
      {(timeOfDay === 'evening' || timeOfDay === 'night') && (
        <div className="py-3 text-center">
          <p className="text-sm text-[#555] italic">
            🌙 You have {morningsLeft} mornings left.
            <br />Today was one of them. {todayLog?.overallScore ? 'Well spent.' : 'Spend it well.'}
          </p>
        </div>
      )}

      {/* ─── MORNING DEATH MEDITATION ─── */}
      {timeOfDay === 'morning' && (
        <div className="py-3 text-center">
          <p className="text-sm text-[#555] italic">
            You have {morningsLeft} mornings left.
            <br />If today were your last, would you spend it in fog?
          </p>
        </div>
      )}

      {/* Bottom spacer */}
      <div className="h-4" />
    </div>
  );
}
