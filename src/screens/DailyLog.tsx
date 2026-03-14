import { useState, useEffect, useCallback } from 'react';
import type { DailyLog as DailyLogType } from '../types';
import { getTodayLog, updateTodayLog } from '../store';

interface Props {
  dayNumber: number;
  onSave?: (log: DailyLogType) => void;
}

interface MetricConfig {
  key: keyof Pick<DailyLogType, 'energy' | 'mentalClarity' | 'emotionalStability' | 'socialConfidence' | 'urgeIntensity' | 'sleepQuality'>;
  label: string;
  lowLabel: string;
  highLabel: string;
  invertDisplay?: boolean; // for urgeIntensity: lower is better
}

const METRICS: MetricConfig[] = [
  { key: 'energy', label: 'Energy', lowLabel: 'Depleted', highLabel: 'Vibrant' },
  { key: 'mentalClarity', label: 'Mental Clarity', lowLabel: 'Foggy', highLabel: 'Sharp' },
  { key: 'emotionalStability', label: 'Emotional Stability', lowLabel: 'Volatile', highLabel: 'Centered' },
  { key: 'socialConfidence', label: 'Social Confidence', lowLabel: 'Withdrawn', highLabel: 'Magnetic' },
  { key: 'urgeIntensity', label: 'Urge Intensity', lowLabel: 'None', highLabel: 'Overwhelming', invertDisplay: true },
  { key: 'sleepQuality', label: 'Sleep Quality (last night)', lowLabel: 'Terrible', highLabel: 'Restorative' },
];

const EXERCISE_TYPES = [
  'Heavy lifts', 'Sprint intervals', 'Yoga/mobility', 'Martial art/sport',
  'Nature walk', 'Swimming', 'Running', 'Bodyweight', 'Rest day', 'Other',
];

export function DailyLog({ dayNumber, onSave }: Props) {
  const [log, setLog] = useState<Partial<DailyLogType>>({});
  const [saved, setSaved] = useState(false);
  const [showExerciseTypes, setShowExerciseTypes] = useState(false);

  // Load existing log
  useEffect(() => {
    const existing = getTodayLog();
    if (existing) {
      setLog(existing);
      // Check if previously saved (has at least one metric filled)
      const hasMetrics = existing.energy > 0 || existing.mentalClarity > 0;
      if (hasMetrics) setSaved(true);
    }
  }, []);

  const updateMetric = useCallback((key: string, value: number) => {
    setLog((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }, []);

  const updateField = useCallback((key: string, value: string | boolean | number | null) => {
    setLog((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }, []);

  const handleSave = useCallback(() => {
    const savedLog = updateTodayLog(log, dayNumber);
    setSaved(true);
    onSave?.(savedLog);
  }, [log, dayNumber, onSave]);

  // Calculate overall score for preview
  const metricValues = [log.energy || 0, log.mentalClarity || 0, log.emotionalStability || 0, log.socialConfidence || 0, log.sleepQuality || 0];
  const filledMetrics = metricValues.filter((v) => v > 0);
  const overallScore = filledMetrics.length > 0
    ? Math.round((filledMetrics.reduce((a, b) => a + b, 0) / filledMetrics.length) * 10) / 10
    : 0;

  if (saved) {
    return (
      <div className="rounded-xl bg-[#141414] border border-[#2D8B4E44] p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold tracking-widest text-[#2D8B4E] uppercase">
              Daily Log
            </h2>
            <p className="text-sm text-[#E8E8E8] mt-1">
              ✅ Day {dayNumber} logged · Score: {overallScore}/10
            </p>
          </div>
          <button
            onClick={() => setSaved(false)}
            className="text-xs text-[#666] px-3 py-1 rounded-lg border border-[#333] hover:border-[#666] transition-colors"
          >
            Edit
          </button>
        </div>
        {/* Mini summary */}
        <div className="grid grid-cols-3 gap-2 text-center">
          {METRICS.slice(0, 6).map((m) => {
            const val = (log[m.key] as number) || 0;
            return val > 0 ? (
              <div key={m.key} className="p-2 rounded-lg bg-[#1A1A1A]">
                <p className="text-xs text-[#666]">{m.label.split(' ')[0]}</p>
                <p className="text-sm font-bold" style={{ color: m.invertDisplay ? (val <= 3 ? '#2D8B4E' : val <= 6 ? '#D4A017' : '#C4601D') : (val >= 7 ? '#2D8B4E' : val >= 4 ? '#D4A017' : '#C4601D') }}>{val}</p>
              </div>
            ) : null;
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[#141414] border border-[#1E1E1E] p-4 space-y-5">
      <div>
        <h2 className="text-sm font-bold tracking-widest text-[#D4A017] uppercase">
          Daily Log — Day {dayNumber}
        </h2>
        <p className="text-xs text-[#666] mt-1">2 minutes. Honest data. No judgment.</p>
      </div>

      {/* Self-Assessment Metrics */}
      {METRICS.map((metric) => {
        const currentVal = (log[metric.key] as number) || 0;
        return (
          <div key={metric.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-[#E8E8E8] font-medium">{metric.label}</label>
              {currentVal > 0 && (
                <span
                  className="text-sm font-bold"
                  style={{
                    color: metric.invertDisplay
                      ? (currentVal <= 3 ? '#2D8B4E' : currentVal <= 6 ? '#D4A017' : '#C4601D')
                      : (currentVal >= 7 ? '#2D8B4E' : currentVal >= 4 ? '#D4A017' : '#C4601D'),
                  }}
                >
                  {currentVal}
                </span>
              )}
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => updateMetric(metric.key, n)}
                  className="flex-1 py-2 rounded text-xs font-bold transition-all"
                  style={{
                    backgroundColor: currentVal === n
                      ? (metric.invertDisplay
                        ? (n <= 3 ? '#2D8B4E' : n <= 6 ? '#D4A017' : '#C4601D')
                        : (n >= 7 ? '#2D8B4E' : n >= 4 ? '#D4A017' : '#C4601D'))
                      : currentVal > 0 && currentVal >= n && !metric.invertDisplay ? '#1E1E1E' : '#1A1A1A',
                    color: currentVal === n ? '#fff' : '#666',
                    border: `1px solid ${currentVal === n ? 'transparent' : '#2A2A2A'}`,
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-[#555]">{metric.lowLabel}</span>
              <span className="text-[10px] text-[#555]">{metric.highLabel}</span>
            </div>
          </div>
        );
      })}

      {/* Divider */}
      <div className="border-t border-[#1E1E1E]" />

      {/* Protocol Adherence */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold tracking-widest text-[#9A9A9A] uppercase">Protocol Adherence</h3>

        {/* Exercise */}
        <div>
          <button
            onClick={() => {
              const newVal = !log.exerciseCompleted;
              updateField('exerciseCompleted', newVal);
              if (newVal) setShowExerciseTypes(true);
            }}
            className="flex items-center gap-3 w-full text-left py-1"
          >
            <div
              className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all"
              style={{
                borderColor: log.exerciseCompleted ? '#2D8B4E' : '#444',
                backgroundColor: log.exerciseCompleted ? '#2D8B4E' : 'transparent',
              }}
            >
              {log.exerciseCompleted && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span className="text-sm text-[#E8E8E8]">Exercise completed</span>
          </button>
          {(log.exerciseCompleted && showExerciseTypes) && (
            <div className="ml-8 mt-2 flex flex-wrap gap-1.5 animate-fade-in-fast">
              {EXERCISE_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => { updateField('exerciseType', t); setShowExerciseTypes(false); }}
                  className="px-2.5 py-1 rounded text-xs transition-colors"
                  style={{
                    backgroundColor: log.exerciseType === t ? '#D4A01722' : '#1E1E1E',
                    color: log.exerciseType === t ? '#D4A017' : '#9A9A9A',
                    border: `1px solid ${log.exerciseType === t ? '#D4A01744' : '#333'}`,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
          {log.exerciseType && !showExerciseTypes && (
            <button
              onClick={() => setShowExerciseTypes(true)}
              className="ml-8 mt-1 text-xs text-[#D4A017]"
            >
              {log.exerciseType} ✎
            </button>
          )}
        </div>

        {/* Mula Bandha */}
        <button
          onClick={() => updateField('mulaBandha', !log.mulaBandha)}
          className="flex items-center gap-3 w-full text-left py-1"
        >
          <div
            className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              borderColor: log.mulaBandha ? '#2D8B4E' : '#444',
              backgroundColor: log.mulaBandha ? '#2D8B4E' : 'transparent',
            }}
          >
            {log.mulaBandha && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <span className="text-sm text-[#E8E8E8]">Mula Bandha practiced (3×10)</span>
        </button>

        {/* Dietary Protocol */}
        <button
          onClick={() => updateField('dietaryProtocol', !log.dietaryProtocol)}
          className="flex items-center gap-3 w-full text-left py-1"
        >
          <div
            className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              borderColor: log.dietaryProtocol ? '#2D8B4E' : '#444',
              backgroundColor: log.dietaryProtocol ? '#2D8B4E' : 'transparent',
            }}
          >
            {log.dietaryProtocol && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <span className="text-sm text-[#E8E8E8]">Dietary protocol followed</span>
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-[#1E1E1E]" />

      {/* HRV (Optional) */}
      <div>
        <label className="text-sm text-[#9A9A9A] font-medium block mb-1.5">
          Morning HRV — RMSSD <span className="text-[#555]">(optional)</span>
        </label>
        <input
          type="number"
          value={log.hrvRMSSD ?? ''}
          onChange={(e) => updateField('hrvRMSSD', e.target.value ? Number(e.target.value) : null)}
          placeholder="e.g., 42"
          className="w-32 p-2.5 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] text-[#E8E8E8] text-sm placeholder:text-[#555] focus:outline-none focus:border-[#D4A017] transition-colors"
        />
      </div>

      {/* Qualitative */}
      <div className="space-y-3">
        <div>
          <label className="text-sm text-[#9A9A9A] font-medium block mb-1.5">Triggers encountered</label>
          <textarea
            value={log.triggers ?? ''}
            onChange={(e) => updateField('triggers', e.target.value)}
            placeholder="What triggered urges today? (Even mild ones — data, not judgment.)"
            className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] text-[#E8E8E8] text-sm resize-none placeholder:text-[#555] focus:outline-none focus:border-[#D4A017] transition-colors"
            rows={2}
          />
        </div>

        <div>
          <label className="text-sm text-[#9A9A9A] font-medium block mb-1.5">Dreams <span className="text-[#555]">(optional)</span></label>
          <textarea
            value={log.dreams ?? ''}
            onChange={(e) => updateField('dreams', e.target.value)}
            placeholder="Any notable dreams? (Dream content often shifts during retention.)"
            className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] text-[#E8E8E8] text-sm resize-none placeholder:text-[#555] focus:outline-none focus:border-[#D4A017] transition-colors"
            rows={2}
          />
        </div>

        <div>
          <label className="text-sm text-[#9A9A9A] font-medium block mb-1.5">Notes <span className="text-[#555]">(optional)</span></label>
          <textarea
            value={log.notes ?? ''}
            onChange={(e) => updateField('notes', e.target.value)}
            placeholder="Anything else worth recording. Insights, gratitude, observations."
            className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] text-[#E8E8E8] text-sm resize-none placeholder:text-[#555] focus:outline-none focus:border-[#D4A017] transition-colors"
            rows={2}
          />
        </div>
      </div>

      {/* Overall Score Preview */}
      {overallScore > 0 && (
        <div className="flex items-center justify-center gap-3 p-3 rounded-lg bg-[#1A1A1A]">
          <span className="text-xs text-[#666]">Day Score:</span>
          <span
            className="text-xl font-bold"
            style={{ color: overallScore >= 7 ? '#2D8B4E' : overallScore >= 4 ? '#D4A017' : '#C4601D' }}
          >
            {overallScore}
          </span>
          <span className="text-xs text-[#666]">/ 10</span>
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full py-3.5 rounded-xl bg-[#D4A017] text-[#0A0A0A] font-bold text-base transition-colors hover:bg-[#E0AC1F]"
      >
        Save Daily Log
      </button>
    </div>
  );
}
