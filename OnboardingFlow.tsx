import { useState, useCallback } from 'react';
import type { UserProfile, RelationshipStatus } from '../types';
import { dsiQuestions, calculateDSI, getSeverityColor } from '../data/dsi';
import type { DSIResult } from '../data/dsi';

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void;
}

const TOTAL_STEPS = 8;

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);

  // DSI state — one answer per question
  const [dsiAnswers, setDsiAnswers] = useState<Record<string, number>>({});
  const [dsiSubStep, setDsiSubStep] = useState(0);

  // Profile fields
  const [purposeStatement, setPurposeStatement] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState<RelationshipStatus>('solo');
  const [partnerName, setPartnerName] = useState('');
  const [partnerPhone, setPartnerPhone] = useState('');
  const [morningAlarm, setMorningAlarm] = useState('05:00');
  const [eveningCurfew, setEveningCurfew] = useState('21:00');
  const [commitmentDays, setCommitmentDays] = useState(30);

  const dsiResult: DSIResult | null =
    Object.keys(dsiAnswers).length === dsiQuestions.length
      ? calculateDSI(dsiAnswers)
      : null;

  const dsiPartialScore = Object.values(dsiAnswers).reduce((s, v) => s + v, 0);

  const canAdvance = useCallback((): boolean => {
    switch (step) {
      case 0: return true; // Welcome
      case 1: return Object.keys(dsiAnswers).length === dsiQuestions.length; // DSI complete
      case 2: return true; // Purpose (optional text)
      case 3: return true; // Relationship
      case 4: return true; // Accountability (optional)
      case 5: return true; // Times
      case 6: return true; // Commitment
      case 7: return true; // Final
      default: return false;
    }
  }, [step, dsiAnswers]);

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleCommit = () => {
    const dsi = dsiResult || calculateDSI(dsiAnswers);
    const today = new Date().toISOString().split('T')[0];

    const profile: UserProfile = {
      depletionSeverityIndex: {
        duration: dsiAnswers['duration'] || 0,
        peakFrequency: dsiAnswers['peakFrequency'] || 0,
        contentEscalation: dsiAnswers['contentEscalation'] || 0,
        ageFirstExposure: dsiAnswers['ageFirstExposure'] || 0,
        currentAge: dsiAnswers['currentAge'] || 0,
        substanceUse: dsiAnswers['substanceUse'] || 0,
        sleepHistory: dsiAnswers['sleepHistory'] || 0,
        exerciseHistory: dsiAnswers['exerciseHistory'] || 0,
        totalScore: dsi.totalScore,
        severity: dsi.severity,
        estimatedRecoveryDays: dsi.estimatedRecoveryDays,
      },
      purposeStatement: purposeStatement || 'I will discover what I am meant to build.',
      constitution: 'unknown',
      chronotype: 'unknown',
      relationshipStatus,
      gatesCompleted: {},
      currentStreak: { startDate: today, currentDay: 1, isActive: true },
      streakHistory: [],
      longestStreak: 0,
      totalRetentionDays: 0,
      totalRelapses: 0,
      ratchetClicks: 0,
      morningAlarmTime: morningAlarm,
      eveningCurfewTime: eveningCurfew,
      accountabilityPartnerName: partnerName,
      accountabilityPartnerPhone: partnerPhone,
      commitmentDays,
      createdAt: today,
      lastActiveDate: today,
      onboardingComplete: true,
    };

    onComplete(profile);
  };

  const selectDSIAnswer = (questionId: string, value: number) => {
    setDsiAnswers((prev) => ({ ...prev, [questionId]: value }));
    // Auto-advance to next question after brief pause
    if (dsiSubStep < dsiQuestions.length - 1) {
      setTimeout(() => setDsiSubStep((s) => s + 1), 200);
    }
  };

  // ── STEP RENDERERS ──────────────────────────────────────────

  const renderWelcome = () => (
    <div className="animate-fade-in space-y-6">
      <div className="w-16 h-16 mx-auto rounded-full bg-[#1E1E1E] flex items-center justify-center mb-2">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C8 7 4 10 4 14a8 8 0 0016 0c0-4-4-7-8-12z" fill="#D4A017" opacity="0.8"/>
          <path d="M12 6C10 9 8 11 8 13.5a4 4 0 008 0C16 11 14 9 12 6z" fill="#FFD700" opacity="0.9"/>
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-center text-[#E8E8E8]">The Sovereign Flame</h1>
      <div className="space-y-4 text-[#9A9A9A] text-[15px] leading-relaxed">
        <p>This app is a field tool, not a textbook. It operates your daily practice.</p>
        <p className="text-[#E8E8E8] font-medium">5 minutes morning. 2 minutes evening. Emergency access when needed.</p>
        <p>Let's calibrate it to your specific situation. Eight questions. Honest answers. Your timeline depends on accurate data.</p>
      </div>
      <div className="bg-[#1E1E1E] rounded-xl p-4 border border-[#2A2A2A]">
        <p className="text-xs text-[#9A9A9A] leading-relaxed">
          <span className="text-[#D4A017] font-semibold">Privacy:</span> All data stays on this device. No servers. No analytics. No tracking. Nobody will ever see your data but you.
        </p>
      </div>
    </div>
  );

  const renderDSI = () => {
    const currentQ = dsiQuestions[dsiSubStep];
    const answeredCount = Object.keys(dsiAnswers).length;
    const allAnswered = answeredCount === dsiQuestions.length;

    if (allAnswered && dsiResult) {
      return (
        <div className="animate-fade-in space-y-5">
          <h2 className="text-lg font-bold text-center">Your Depletion Severity Index</h2>

          <div className="flex flex-col items-center gap-2">
            <div className="text-5xl font-bold" style={{ color: getSeverityColor(dsiResult.severity) }}>
              {dsiResult.totalScore}
            </div>
            <div className="text-xs text-[#9A9A9A] tracking-wider uppercase">/ 98</div>
            <div
              className="text-sm font-semibold tracking-wider uppercase mt-1 px-3 py-1 rounded-full"
              style={{
                color: getSeverityColor(dsiResult.severity),
                backgroundColor: getSeverityColor(dsiResult.severity) + '18',
              }}
            >
              {dsiResult.severity}
            </div>
          </div>

          <div className="bg-[#1E1E1E] rounded-xl p-4 border border-[#2A2A2A] space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#9A9A9A]">Expected recovery timeline</span>
              <span className="text-[#E8E8E8] font-semibold">{dsiResult.timelineLabel}</span>
            </div>
            <div className="h-px bg-[#2A2A2A]" />
            <p className="text-[13px] text-[#9A9A9A] leading-relaxed">{dsiResult.interpretation}</p>
          </div>

          <div className="bg-[#141414] rounded-xl p-4 border border-[#D4A01730]">
            <p className="text-[13px] text-[#D4A017] leading-relaxed font-medium">
              Recovery is not linear — it follows an S-curve. Slow initial progress, then dramatic acceleration, then plateau at a new elevated baseline. The twelve feedback loops create compound returns: each week of recovery makes the next week faster.
            </p>
          </div>

          <button
            onClick={() => {
              setDsiSubStep(0); // Reset to allow review
            }}
            className="text-xs text-[#9A9A9A] underline mx-auto block"
          >
            Review answers
          </button>
        </div>
      );
    }

    return (
      <div className="animate-fade-in space-y-4">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-bold text-[#E8E8E8]">Calibration</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#9A9A9A]">{answeredCount}/{dsiQuestions.length}</span>
            <span className="text-xs font-mono text-[#D4A017]">{dsiPartialScore}</span>
          </div>
        </div>

        {/* Question nav dots */}
        <div className="flex gap-1.5 justify-center">
          {dsiQuestions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setDsiSubStep(i)}
              className="w-2 h-2 rounded-full transition-all duration-200"
              style={{
                backgroundColor:
                  i === dsiSubStep
                    ? '#D4A017'
                    : dsiAnswers[q.id] !== undefined
                      ? '#2D8B4E'
                      : '#333',
                transform: i === dsiSubStep ? 'scale(1.4)' : 'scale(1)',
              }}
              aria-label={`Question ${i + 1}`}
            />
          ))}
        </div>

        <div className="mt-3">
          <div className="text-xs text-[#D4A017] tracking-wider uppercase mb-1">
            {dsiSubStep + 1} of {dsiQuestions.length}
          </div>
          <h3 className="text-[15px] font-semibold text-[#E8E8E8] mb-1">{currentQ.title}</h3>
          <p className="text-[13px] text-[#9A9A9A] mb-4">{currentQ.description}</p>

          <div className="space-y-2">
            {currentQ.options.map((opt) => {
              const isSelected = dsiAnswers[currentQ.id] === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => selectDSIAnswer(currentQ.id, opt.value)}
                  className="w-full text-left px-4 py-3 rounded-xl transition-all duration-150 border text-[14px]"
                  style={{
                    backgroundColor: isSelected ? '#D4A01715' : '#141414',
                    borderColor: isSelected ? '#D4A017' : '#2A2A2A',
                    color: isSelected ? '#E8E8E8' : '#9A9A9A',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt.label}</span>
                    {isSelected && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#D4A017">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* DSI sub-navigation */}
        <div className="flex justify-between pt-2">
          <button
            onClick={() => setDsiSubStep((s) => Math.max(0, s - 1))}
            className="text-sm text-[#9A9A9A] px-3 py-1.5 rounded-lg hover:bg-[#1E1E1E] disabled:opacity-30"
            disabled={dsiSubStep === 0}
          >
            ← Prev
          </button>
          <button
            onClick={() => setDsiSubStep((s) => Math.min(dsiQuestions.length - 1, s + 1))}
            className="text-sm text-[#D4A017] px-3 py-1.5 rounded-lg hover:bg-[#1E1E1E] disabled:opacity-30"
            disabled={dsiSubStep === dsiQuestions.length - 1 || dsiAnswers[currentQ.id] === undefined}
          >
            Next →
          </button>
        </div>
      </div>
    );
  };

  const renderPurpose = () => (
    <div className="animate-fade-in space-y-5">
      <h2 className="text-lg font-bold text-[#E8E8E8]">What Will You Build?</h2>
      <p className="text-[14px] text-[#9A9A9A] leading-relaxed">
        Retention without purpose is a car in gear with no destination. Purpose provides direction. Retention provides fuel.
      </p>

      <textarea
        value={purposeStatement}
        onChange={(e) => setPurposeStatement(e.target.value)}
        placeholder="I will channel retained energy into..."
        className="w-full h-28 bg-[#141414] border border-[#2A2A2A] rounded-xl p-4 text-[15px] text-[#E8E8E8] placeholder-[#555] resize-none focus:outline-none focus:border-[#D4A017] transition-colors"
      />

      <div className="bg-[#1E1E1E] rounded-xl p-4 border border-[#2A2A2A] space-y-3">
        <p className="text-xs font-semibold text-[#D4A017] uppercase tracking-wider">If unclear, three exercises:</p>
        <div className="space-y-2 text-[13px] text-[#9A9A9A] leading-relaxed">
          <p><span className="text-[#E8E8E8] font-medium">Flow Signature:</span> What makes you forget to eat, check your phone, lose track of time?</p>
          <p><span className="text-[#E8E8E8] font-medium">Anger Test:</span> What injustice viscerally enrages you? Anger at injustice is purpose seeking corrective action.</p>
          <p><span className="text-[#E8E8E8] font-medium">Deathbed Directive:</span> Six months to live — what would you create, repair, or complete?</p>
        </div>
      </div>

      <p className="text-xs text-[#666] text-center">
        If none yield clarity: your purpose for now is to find your purpose. Retention provides the energy and clarity to discover it.
      </p>
    </div>
  );

  const renderRelationship = () => {
    const options: { value: RelationshipStatus; label: string; desc: string }[] = [
      { value: 'solo', label: 'Solo Practice', desc: 'Practicing without a romantic partner.' },
      { value: 'partnered-supportive', label: 'Partnered — Supportive', desc: 'Partner is aware and supportive of your practice.' },
      { value: 'partnered-resistant', label: 'Partnered — Resistant', desc: 'Partner is unaware or resistant. Requires specific navigation.' },
      { value: 'exploring', label: 'Exploring', desc: 'Open to partnership but not currently in one.' },
    ];

    return (
      <div className="animate-fade-in space-y-5">
        <h2 className="text-lg font-bold text-[#E8E8E8]">Relationship Context</h2>
        <p className="text-[14px] text-[#9A9A9A] leading-relaxed">
          This helps personalize protocol guidance — especially around the attraction paradox and relational transmutation.
        </p>
        <div className="space-y-2">
          {options.map((opt) => {
            const sel = relationshipStatus === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setRelationshipStatus(opt.value)}
                className="w-full text-left px-4 py-3.5 rounded-xl transition-all duration-150 border"
                style={{
                  backgroundColor: sel ? '#D4A01715' : '#141414',
                  borderColor: sel ? '#D4A017' : '#2A2A2A',
                }}
              >
                <div className="text-[14px] font-medium" style={{ color: sel ? '#E8E8E8' : '#9A9A9A' }}>
                  {opt.label}
                </div>
                <div className="text-[12px] mt-0.5" style={{ color: sel ? '#9A9A9A' : '#666' }}>
                  {opt.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAccountability = () => (
    <div className="animate-fade-in space-y-5">
      <h2 className="text-lg font-bold text-[#E8E8E8]">Accountability Partner</h2>
      <p className="text-[14px] text-[#9A9A9A] leading-relaxed">
        Human accountability is the single highest-leverage retention support. With it, you are 3× more likely to succeed.
      </p>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-[#9A9A9A] uppercase tracking-wider block mb-1.5">Name</label>
          <input
            type="text"
            value={partnerName}
            onChange={(e) => setPartnerName(e.target.value)}
            placeholder="Who will hold you accountable?"
            className="w-full bg-[#141414] border border-[#2A2A2A] rounded-xl px-4 py-3 text-[15px] text-[#E8E8E8] placeholder-[#555] focus:outline-none focus:border-[#D4A017] transition-colors"
          />
        </div>
        <div>
          <label className="text-xs text-[#9A9A9A] uppercase tracking-wider block mb-1.5">Phone Number</label>
          <input
            type="tel"
            value={partnerPhone}
            onChange={(e) => setPartnerPhone(e.target.value)}
            placeholder="For Level 4 emergency — one tap to call"
            className="w-full bg-[#141414] border border-[#2A2A2A] rounded-xl px-4 py-3 text-[15px] text-[#E8E8E8] placeholder-[#555] focus:outline-none focus:border-[#D4A017] transition-colors"
          />
        </div>
      </div>

      {!partnerName && (
        <div className="bg-[#1E1E1E] rounded-xl p-4 border border-[#C4601D30]">
          <p className="text-[13px] text-[#C4601D] leading-relaxed">
            If you don't have one yet, finding one is your first action. Text someone you trust today: "I'm doing an experiment with energy conservation. Can I check in with you weekly?"
          </p>
        </div>
      )}
    </div>
  );

  const renderTimes = () => (
    <div className="animate-fade-in space-y-5">
      <h2 className="text-lg font-bold text-[#E8E8E8]">Daily Architecture</h2>
      <p className="text-[14px] text-[#9A9A9A] leading-relaxed">
        The Morning Fortress begins your day. The Evening Curfew protects through the vulnerability window.
      </p>

      <div className="space-y-4">
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-4">
          <label className="text-xs text-[#D4A017] uppercase tracking-wider block mb-2">Morning Fortress begins</label>
          <input
            type="time"
            value={morningAlarm}
            onChange={(e) => setMorningAlarm(e.target.value)}
            className="w-full bg-[#1E1E1E] border border-[#333] rounded-lg px-4 py-3 text-xl text-[#E8E8E8] text-center focus:outline-none focus:border-[#D4A017] transition-colors"
          />
          <p className="text-[12px] text-[#666] mt-2 text-center">
            No phone. Cold water on face. Then breathe.
          </p>
        </div>

        <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-4">
          <label className="text-xs text-[#D4A017] uppercase tracking-wider block mb-2">Evening screen curfew</label>
          <input
            type="time"
            value={eveningCurfew}
            onChange={(e) => setEveningCurfew(e.target.value)}
            className="w-full bg-[#1E1E1E] border border-[#333] rounded-lg px-4 py-3 text-xl text-[#E8E8E8] text-center focus:outline-none focus:border-[#D4A017] transition-colors"
          />
          <p className="text-[12px] text-[#666] mt-2 text-center">
            All devices in another room. Analog engagement begins.
          </p>
        </div>
      </div>
    </div>
  );

  const renderCommitment = () => {
    const durations = [
      { days: 7, label: '7 Days', desc: 'Prove to yourself you can do this.' },
      { days: 14, label: '14 Days', desc: 'Past the false plateau.' },
      { days: 30, label: '30 Days', desc: 'Old pathways measurably weakening.' },
      { days: 90, label: '90 Days', desc: 'Full convergence. Five clocks aligned.' },
    ];

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + commitmentDays);
    const endStr = endDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    return (
      <div className="animate-fade-in space-y-5">
        <h2 className="text-lg font-bold text-[#E8E8E8]">Your Commitment</h2>
        <p className="text-[14px] text-[#9A9A9A] leading-relaxed">
          This is a commitment to yourself. Not a hope. A commitment.
        </p>

        <div className="grid grid-cols-2 gap-2">
          {durations.map((d) => {
            const sel = commitmentDays === d.days;
            return (
              <button
                key={d.days}
                onClick={() => setCommitmentDays(d.days)}
                className="text-left px-3 py-3 rounded-xl transition-all duration-150 border"
                style={{
                  backgroundColor: sel ? '#D4A01715' : '#141414',
                  borderColor: sel ? '#D4A017' : '#2A2A2A',
                }}
              >
                <div className="text-lg font-bold" style={{ color: sel ? '#D4A017' : '#9A9A9A' }}>
                  {d.label}
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: sel ? '#9A9A9A' : '#666' }}>
                  {d.desc}
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-[#1E1E1E] rounded-xl p-4 border border-[#2A2A2A] text-center">
          <div className="text-xs text-[#9A9A9A] uppercase tracking-wider mb-1">End date</div>
          <div className="text-[15px] font-semibold text-[#E8E8E8]">{endStr}</div>
        </div>
      </div>
    );
  };

  const renderFinal = () => {
    const dsi = dsiResult || calculateDSI(dsiAnswers);

    return (
      <div className="animate-fade-in space-y-5">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#D4A01718] flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8 7 4 10 4 14a8 8 0 0016 0c0-4-4-7-8-12z" fill="#D4A017"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#E8E8E8]">Day 1 Begins Now</h2>
        </div>

        {/* Summary */}
        <div className="bg-[#141414] rounded-xl border border-[#2A2A2A] divide-y divide-[#2A2A2A]">
          <div className="px-4 py-3 flex justify-between items-center">
            <span className="text-[13px] text-[#9A9A9A]">Depletion Score</span>
            <span className="text-[14px] font-bold" style={{ color: getSeverityColor(dsi.severity) }}>
              {dsi.totalScore} — {dsi.severity}
            </span>
          </div>
          <div className="px-4 py-3 flex justify-between items-center">
            <span className="text-[13px] text-[#9A9A9A]">Recovery timeline</span>
            <span className="text-[14px] font-semibold text-[#E8E8E8]">{dsi.timelineLabel}</span>
          </div>
          <div className="px-4 py-3 flex justify-between items-center">
            <span className="text-[13px] text-[#9A9A9A]">Commitment</span>
            <span className="text-[14px] font-semibold text-[#D4A017]">{commitmentDays} days</span>
          </div>
          {partnerName && (
            <div className="px-4 py-3 flex justify-between items-center">
              <span className="text-[13px] text-[#9A9A9A]">Partner</span>
              <span className="text-[14px] text-[#E8E8E8]">{partnerName}</span>
            </div>
          )}
          <div className="px-4 py-3">
            <span className="text-[13px] text-[#9A9A9A] block mb-1">Purpose</span>
            <span className="text-[14px] text-[#E8E8E8] italic">
              "{purposeStatement || 'I will discover what I am meant to build.'}"
            </span>
          </div>
        </div>

        <div className="bg-[#141414] rounded-xl p-4 border border-[#D4A01730]">
          <p className="text-[14px] text-[#D4A017] leading-relaxed text-center font-medium">
            "Conserve the seed. Transform the energy. Serve the world. Know thyself."
          </p>
        </div>

        <button
          onClick={handleCommit}
          className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 active:scale-[0.98]"
          style={{
            backgroundColor: '#D4A017',
            color: '#0A0A0A',
          }}
        >
          I Commit — Begin Day 1
        </button>

        <p className="text-[11px] text-[#666] text-center">
          All data stored locally on this device. No accounts. No servers.
        </p>
      </div>
    );
  };

  const steps = [renderWelcome, renderDSI, renderPurpose, renderRelationship, renderAccountability, renderTimes, renderCommitment, renderFinal];

  const stepLabels = ['Welcome', 'Calibrate', 'Purpose', 'Context', 'Partner', 'Schedule', 'Commit', 'Begin'];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E8E8E8] flex flex-col">
      {/* Progress bar */}
      <div className="flex-shrink-0 px-4 pt-3 pb-2" style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#9A9A9A] tracking-wider uppercase">{stepLabels[step]}</span>
          <span className="text-xs text-[#666]">{step + 1} / {TOTAL_STEPS}</span>
        </div>
        <div className="h-1 bg-[#1E1E1E] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#D4A017] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {steps[step]()}
      </div>

      {/* Navigation */}
      {step < TOTAL_STEPS - 1 && (
        <div className="flex-shrink-0 px-4 pb-4 flex gap-3" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
          {step > 0 && (
            <button
              onClick={handleBack}
              className="px-5 py-3 rounded-xl bg-[#1E1E1E] text-[#9A9A9A] font-medium text-[15px] transition-colors hover:bg-[#2A2A2A]"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canAdvance()}
            className="flex-1 py-3 rounded-xl font-semibold text-[15px] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
            style={{
              backgroundColor: canAdvance() ? '#D4A017' : '#333',
              color: canAdvance() ? '#0A0A0A' : '#666',
            }}
          >
            {step === 0 ? 'Begin Calibration' : 'Continue'}
          </button>
        </div>
      )}
    </div>
  );
}
