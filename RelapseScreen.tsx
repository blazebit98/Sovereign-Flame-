import { useState } from 'react';
import type { UserProfile } from '../types';

interface Props {
  profile: UserProfile;
  dayNumber: number;
  onComplete: (analysis: {
    trigger: string;
    emotionalState: string;
    environment: string;
    timeOfDay: string;
    earliestInterventionPoint: string;
    patchImplemented: string;
  }) => void;
  onCancel: () => void;
}

const TRIGGERS = [
  'Late-night scrolling',
  'Loneliness',
  'Stress',
  'Boredom',
  'Alcohol',
  'Social/romantic encounter',
  'Morning arousal',
  'Explicit content (accidental)',
  'Other',
];

const EMOTIONS = [
  'Anxious',
  'Lonely',
  'Stressed',
  'Bored',
  'Angry',
  'Sad',
  'Celebrating',
  'Numb',
  'Other',
];

const ENVIRONMENTS = [
  'Home alone',
  'Bedroom',
  'Bathroom',
  'Work/office',
  'Other',
];

export function RelapseScreen({ profile, dayNumber, onComplete, onCancel }: Props) {
  const [trigger, setTrigger] = useState('');
  const [emotion, setEmotion] = useState('');
  const [environment, setEnvironment] = useState('');
  const [intervention, setIntervention] = useState('');
  const [patch, setPatch] = useState('');
  const [stage, setStage] = useState<'debrief' | 'chaser'>('debrief');

  const handleSubmit = () => {
    onComplete({
      trigger,
      emotionalState: emotion,
      environment,
      timeOfDay: new Date().toLocaleTimeString(),
      earliestInterventionPoint: intervention,
      patchImplemented: patch,
    });
  };

  if (stage === 'chaser') {
    return (
      <div className="fixed inset-0 z-50 bg-[#0A0A0A] overflow-y-auto">
        <div className="min-h-full p-6 max-w-lg mx-auto animate-fade-in">
          <h2 className="text-xl font-bold text-[#C4601D] mb-2 pt-6">⚠️ CHASER ALERT</h2>
          <p className="text-sm text-[#E8E8E8] mb-6 leading-relaxed">
            The next 72 hours are maximum binge danger. The chaser effect will create intense craving. This is neurochemistry — prolactin is elevated, dopamine is crashed. It WILL pass.
          </p>

          <div className="rounded-xl bg-[#141414] border border-[#C4601D44] p-4 mb-6">
            <h3 className="text-sm font-bold text-[#C4601D] mb-3">72-Hour Emergency Protocol:</h3>
            <div className="space-y-2">
              {[
                'Exercise daily (non-negotiable)',
                'Cold exposure 2×/day',
                'Screens off by 7 PM (strict)',
                'Call accountability partner daily',
                'Stay in public spaces during peak vulnerability',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-[#C4601D] mt-0.5">□</span>
                  <span className="text-sm text-[#E8E8E8]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-[#141414] border border-[#1E1E1E] p-4 mb-6">
            <p className="text-xs text-[#9A9A9A] mb-1">Previous streak</p>
            <p className="text-lg font-bold text-[#E8E8E8]">{dayNumber} days</p>
            <p className="text-xs text-[#9A9A9A] mt-2 mb-1">Ratchet clicks earned (never resets)</p>
            <p className="text-lg font-bold text-[#D4A017]">{profile.ratchetClicks + Math.floor(dayNumber / 7) + 1}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#8B691433] mb-6">
            <p className="text-sm text-[#D4A017] italic leading-relaxed">
              "The streak is a metric. The mastery is the identity. Metrics reset. Identity ratchets forward."
            </p>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-4 rounded-xl bg-[#D4A017] text-[#0A0A0A] font-bold text-base"
          >
            Begin New Streak — Day 1 starts NOW
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0A] overflow-y-auto">
      <div className="min-h-full p-6 max-w-lg mx-auto animate-fade-in">
        <div className="flex items-center justify-between mb-6 pt-4">
          <h2 className="text-xl font-bold text-[#E8E8E8]">⚡ Relapse Recovery</h2>
          <button onClick={onCancel} className="text-[#666] text-sm">✕</button>
        </div>

        <p className="text-sm text-[#D4A017] italic mb-6 leading-relaxed">
          "Data, not judgment. Your identity ratchets forward. The streak resets. You do not."
        </p>

        {/* Trigger */}
        <div className="mb-5">
          <label className="text-sm text-[#9A9A9A] font-medium block mb-2">What triggered this?</label>
          <div className="flex flex-wrap gap-2">
            {TRIGGERS.map((t) => (
              <button
                key={t}
                onClick={() => setTrigger(t)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={{
                  backgroundColor: trigger === t ? '#D4A01733' : '#1E1E1E',
                  color: trigger === t ? '#D4A017' : '#9A9A9A',
                  border: `1px solid ${trigger === t ? '#D4A017' : '#333'}`,
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Emotion */}
        <div className="mb-5">
          <label className="text-sm text-[#9A9A9A] font-medium block mb-2">Emotional state before relapse:</label>
          <div className="flex flex-wrap gap-2">
            {EMOTIONS.map((e) => (
              <button
                key={e}
                onClick={() => setEmotion(e)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={{
                  backgroundColor: emotion === e ? '#D4A01733' : '#1E1E1E',
                  color: emotion === e ? '#D4A017' : '#9A9A9A',
                  border: `1px solid ${emotion === e ? '#D4A017' : '#333'}`,
                }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Environment */}
        <div className="mb-5">
          <label className="text-sm text-[#9A9A9A] font-medium block mb-2">Environment:</label>
          <div className="flex flex-wrap gap-2">
            {ENVIRONMENTS.map((env) => (
              <button
                key={env}
                onClick={() => setEnvironment(env)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={{
                  backgroundColor: environment === env ? '#D4A01733' : '#1E1E1E',
                  color: environment === env ? '#D4A017' : '#9A9A9A',
                  border: `1px solid ${environment === env ? '#D4A017' : '#333'}`,
                }}
              >
                {env}
              </button>
            ))}
          </div>
        </div>

        {/* Intervention point */}
        <div className="mb-5">
          <label className="text-sm text-[#9A9A9A] font-medium block mb-2">
            Earliest point you COULD have intervened:
          </label>
          <textarea
            value={intervention}
            onChange={(e) => setIntervention(e.target.value)}
            placeholder="e.g., When I picked up my phone at 11 PM..."
            className="w-full p-3 rounded-xl bg-[#141414] border border-[#1E1E1E] text-[#E8E8E8] text-sm resize-none placeholder:text-[#666] focus:outline-none focus:border-[#D4A017]"
            rows={2}
          />
        </div>

        {/* Countermeasure */}
        <div className="mb-8">
          <label className="text-sm text-[#9A9A9A] font-medium block mb-2">
            Specific countermeasure for this trigger:
          </label>
          <textarea
            value={patch}
            onChange={(e) => setPatch(e.target.value)}
            placeholder="e.g., Phone charges in kitchen after 9 PM from now on..."
            className="w-full p-3 rounded-xl bg-[#141414] border border-[#1E1E1E] text-[#E8E8E8] text-sm resize-none placeholder:text-[#666] focus:outline-none focus:border-[#D4A017]"
            rows={2}
          />
        </div>

        <button
          onClick={() => setStage('chaser')}
          className="w-full py-3.5 rounded-xl bg-[#C4601D] text-white font-semibold text-base"
        >
          Continue to Chaser Protocol →
        </button>
      </div>
    </div>
  );
}
