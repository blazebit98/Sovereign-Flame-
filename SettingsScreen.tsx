import { useState, useCallback } from 'react';
import type { UserProfile } from '../types';
import { getSeverityColor, getSeverityTimelineLabel } from '../data/dsi';

interface Props {
  profile: UserProfile;
  onClose: () => void;
  onProfileUpdate: (profile: UserProfile) => void;
  onResetAllData: () => void;
}

export function SettingsScreen({ profile, onClose, onProfileUpdate, onResetAllData }: Props) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');

  const dsi = profile.depletionSeverityIndex;
  const severityColor = getSeverityColor(dsi.severity);
  const timelineLabel = getSeverityTimelineLabel(dsi.severity);

  const startEdit = useCallback((field: string, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  }, []);

  const saveEdit = useCallback((field: string) => {
    const updated = { ...profile };
    switch (field) {
      case 'purposeStatement':
        updated.purposeStatement = tempValue;
        break;
      case 'partnerName':
        updated.accountabilityPartnerName = tempValue;
        break;
      case 'partnerPhone':
        updated.accountabilityPartnerPhone = tempValue;
        break;
      case 'morningAlarm':
        updated.morningAlarmTime = tempValue;
        break;
      case 'eveningCurfew':
        updated.eveningCurfewTime = tempValue;
        break;
    }
    onProfileUpdate(updated);
    setEditingField(null);
    setTempValue('');
  }, [profile, tempValue, onProfileUpdate]);

  const cancelEdit = useCallback(() => {
    setEditingField(null);
    setTempValue('');
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0A] overflow-y-auto">
      <div className="min-h-full p-4 max-w-lg mx-auto animate-fade-in" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-[#E8E8E8]">Settings</h1>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#9A9A9A] hover:text-[#E8E8E8] hover:bg-[#1E1E1E] transition-colors"
            aria-label="Close settings"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ─── DSI SUMMARY ─── */}
        <section className="mb-6">
          <h2 className="text-xs font-bold tracking-widest text-[#9A9A9A] uppercase mb-3">Depletion Severity Index</h2>
          <div className="rounded-xl bg-[#141414] border border-[#1E1E1E] p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-3xl font-bold" style={{ color: severityColor }}>{dsi.totalScore}</span>
                <span className="text-sm text-[#9A9A9A]"> / 98</span>
              </div>
              <span
                className="text-sm font-semibold px-3 py-1 rounded-lg capitalize"
                style={{ backgroundColor: severityColor + '18', color: severityColor }}
              >
                {dsi.severity}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#1E1E1E] mb-3">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (dsi.totalScore / 98) * 100)}%`,
                  backgroundColor: severityColor,
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-[#9A9A9A]">Recovery timeline:</div>
              <div className="text-[#E8E8E8] font-medium">{timelineLabel}</div>
              <div className="text-[#9A9A9A]">Estimated days:</div>
              <div className="text-[#E8E8E8] font-medium">{dsi.estimatedRecoveryDays}</div>
            </div>
            <div className="mt-3 pt-3 border-t border-[#1E1E1E]">
              <div className="grid grid-cols-2 gap-1 text-xs text-[#666]">
                <span>Duration: {dsi.duration}</span>
                <span>Frequency: {dsi.peakFrequency}</span>
                <span>Escalation: {dsi.contentEscalation}</span>
                <span>First exposure: {dsi.ageFirstExposure}</span>
                <span>Age factor: {dsi.currentAge}</span>
                <span>Substances: {dsi.substanceUse}</span>
                <span>Sleep: {dsi.sleepHistory}</span>
                <span>Exercise: {dsi.exerciseHistory}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── PURPOSE ─── */}
        <section className="mb-6">
          <h2 className="text-xs font-bold tracking-widest text-[#9A9A9A] uppercase mb-3">Purpose Statement</h2>
          <div className="rounded-xl bg-[#141414] border border-[#1E1E1E] p-4">
            {editingField === 'purposeStatement' ? (
              <div className="space-y-3">
                <textarea
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#333] text-[#E8E8E8] text-sm resize-none placeholder:text-[#666] focus:outline-none focus:border-[#D4A017]"
                  rows={3}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button onClick={() => saveEdit('purposeStatement')} className="flex-1 py-2 rounded-lg bg-[#D4A017] text-[#0A0A0A] text-sm font-semibold">Save</button>
                  <button onClick={cancelEdit} className="flex-1 py-2 rounded-lg bg-[#1E1E1E] text-[#9A9A9A] text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-[#E8E8E8] leading-relaxed italic flex-1">
                  &ldquo;{profile.purposeStatement || 'No purpose statement set'}&rdquo;
                </p>
                <button
                  onClick={() => startEdit('purposeStatement', profile.purposeStatement)}
                  className="shrink-0 text-xs text-[#D4A017] px-2 py-1 rounded hover:bg-[#1E1E1E]"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ─── ACCOUNTABILITY PARTNER ─── */}
        <section className="mb-6">
          <h2 className="text-xs font-bold tracking-widest text-[#9A9A9A] uppercase mb-3">Accountability Partner</h2>
          <div className="rounded-xl bg-[#141414] border border-[#1E1E1E] p-4 space-y-3">
            {/* Name */}
            {editingField === 'partnerName' ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#333] text-[#E8E8E8] text-sm placeholder:text-[#666] focus:outline-none focus:border-[#D4A017]"
                  placeholder="Partner name"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button onClick={() => saveEdit('partnerName')} className="flex-1 py-2 rounded-lg bg-[#D4A017] text-[#0A0A0A] text-sm font-semibold">Save</button>
                  <button onClick={cancelEdit} className="flex-1 py-2 rounded-lg bg-[#1E1E1E] text-[#9A9A9A] text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#9A9A9A]">Name: </span>
                  <span className="text-sm text-[#E8E8E8]">{profile.accountabilityPartnerName || 'Not set'}</span>
                </div>
                <button onClick={() => startEdit('partnerName', profile.accountabilityPartnerName)} className="text-xs text-[#D4A017] px-2 py-1 rounded hover:bg-[#1E1E1E]">Edit</button>
              </div>
            )}
            {/* Phone */}
            {editingField === 'partnerPhone' ? (
              <div className="space-y-2">
                <input
                  type="tel"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#333] text-[#E8E8E8] text-sm placeholder:text-[#666] focus:outline-none focus:border-[#D4A017]"
                  placeholder="Phone number"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button onClick={() => saveEdit('partnerPhone')} className="flex-1 py-2 rounded-lg bg-[#D4A017] text-[#0A0A0A] text-sm font-semibold">Save</button>
                  <button onClick={cancelEdit} className="flex-1 py-2 rounded-lg bg-[#1E1E1E] text-[#9A9A9A] text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#9A9A9A]">Phone: </span>
                  <span className="text-sm text-[#E8E8E8]">{profile.accountabilityPartnerPhone || 'Not set'}</span>
                </div>
                <button onClick={() => startEdit('partnerPhone', profile.accountabilityPartnerPhone)} className="text-xs text-[#D4A017] px-2 py-1 rounded hover:bg-[#1E1E1E]">Edit</button>
              </div>
            )}
            {!profile.accountabilityPartnerName && !profile.accountabilityPartnerPhone && (
              <p className="text-xs text-[#C4601D] leading-relaxed">
                Finding an accountability partner is your highest-leverage support action. One person who knows. One person you can call at Level 4.
              </p>
            )}
          </div>
        </section>

        {/* ─── DAILY ARCHITECTURE ─── */}
        <section className="mb-6">
          <h2 className="text-xs font-bold tracking-widest text-[#9A9A9A] uppercase mb-3">Daily Architecture</h2>
          <div className="rounded-xl bg-[#141414] border border-[#1E1E1E] p-4 space-y-3">
            {/* Morning Alarm */}
            {editingField === 'morningAlarm' ? (
              <div className="space-y-2">
                <label className="text-xs text-[#9A9A9A]">Morning Fortress starts at:</label>
                <input
                  type="time"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#333] text-[#E8E8E8] text-sm focus:outline-none focus:border-[#D4A017]"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button onClick={() => saveEdit('morningAlarm')} className="flex-1 py-2 rounded-lg bg-[#D4A017] text-[#0A0A0A] text-sm font-semibold">Save</button>
                  <button onClick={cancelEdit} className="flex-1 py-2 rounded-lg bg-[#1E1E1E] text-[#9A9A9A] text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#9A9A9A]">Morning Fortress: </span>
                  <span className="text-sm text-[#E8E8E8] font-medium">{profile.morningAlarmTime}</span>
                </div>
                <button onClick={() => startEdit('morningAlarm', profile.morningAlarmTime)} className="text-xs text-[#D4A017] px-2 py-1 rounded hover:bg-[#1E1E1E]">Edit</button>
              </div>
            )}
            {/* Evening Curfew */}
            {editingField === 'eveningCurfew' ? (
              <div className="space-y-2">
                <label className="text-xs text-[#9A9A9A]">Screen curfew at:</label>
                <input
                  type="time"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#333] text-[#E8E8E8] text-sm focus:outline-none focus:border-[#D4A017]"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button onClick={() => saveEdit('eveningCurfew')} className="flex-1 py-2 rounded-lg bg-[#D4A017] text-[#0A0A0A] text-sm font-semibold">Save</button>
                  <button onClick={cancelEdit} className="flex-1 py-2 rounded-lg bg-[#1E1E1E] text-[#9A9A9A] text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#9A9A9A]">Screen Curfew: </span>
                  <span className="text-sm text-[#E8E8E8] font-medium">{profile.eveningCurfewTime}</span>
                </div>
                <button onClick={() => startEdit('eveningCurfew', profile.eveningCurfewTime)} className="text-xs text-[#D4A017] px-2 py-1 rounded hover:bg-[#1E1E1E]">Edit</button>
              </div>
            )}
          </div>
        </section>

        {/* ─── COMMITMENT ─── */}
        <section className="mb-6">
          <h2 className="text-xs font-bold tracking-widest text-[#9A9A9A] uppercase mb-3">Commitment</h2>
          <div className="rounded-xl bg-[#141414] border border-[#1E1E1E] p-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-[#9A9A9A]">Started:</div>
              <div className="text-[#E8E8E8]">{profile.createdAt}</div>
              <div className="text-[#9A9A9A]">Commitment:</div>
              <div className="text-[#E8E8E8]">{profile.commitmentDays} days</div>
              <div className="text-[#9A9A9A]">Current streak:</div>
              <div className="text-[#D4A017] font-semibold">{profile.currentStreak.currentDay} days</div>
              <div className="text-[#9A9A9A]">Longest streak:</div>
              <div className="text-[#E8E8E8]">{profile.longestStreak} days</div>
              <div className="text-[#9A9A9A]">Total retained:</div>
              <div className="text-[#E8E8E8]">{profile.totalRetentionDays + profile.currentStreak.currentDay} days</div>
              <div className="text-[#9A9A9A]">Ratchet clicks:</div>
              <div className="text-[#D4A017]">{profile.ratchetClicks}</div>
              <div className="text-[#9A9A9A]">Relationship:</div>
              <div className="text-[#E8E8E8] capitalize">{profile.relationshipStatus.replace('-', ' ')}</div>
            </div>
          </div>
        </section>

        {/* ─── STREAK HISTORY ─── */}
        {profile.streakHistory.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold tracking-widest text-[#9A9A9A] uppercase mb-3">
              Streak History ({profile.streakHistory.length} previous)
            </h2>
            <div className="space-y-2">
              {profile.streakHistory.slice().reverse().map((streak, i) => (
                <div key={i} className="rounded-xl bg-[#141414] border border-[#1E1E1E] p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-[#E8E8E8]">{streak.duration} days</span>
                    <span className="text-xs text-[#666]">{streak.startDate} → {streak.endDate}</span>
                  </div>
                  {streak.relapseAnalysis.trigger && (
                    <div className="text-xs text-[#9A9A9A]">
                      Trigger: <span className="text-[#C4601D]">{streak.relapseAnalysis.trigger}</span>
                      {streak.relapseAnalysis.emotionalState && (
                        <> · State: <span className="text-[#C4601D]">{streak.relapseAnalysis.emotionalState}</span></>
                      )}
                    </div>
                  )}
                  {streak.relapseAnalysis.patchImplemented && (
                    <p className="text-xs text-[#2D8B4E] mt-1">Patch: {streak.relapseAnalysis.patchImplemented}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── DATA MANAGEMENT ─── */}
        <section className="mb-6">
          <h2 className="text-xs font-bold tracking-widest text-[#9A9A9A] uppercase mb-3">Data & Privacy</h2>
          <div className="rounded-xl bg-[#141414] border border-[#1E1E1E] p-4 space-y-3">
            <p className="text-xs text-[#666] leading-relaxed">
              All data is stored locally on your device. No server. No tracking. No analytics. Nobody will ever see this data except you.
            </p>
            
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full py-2.5 rounded-lg border border-[#B82020] text-[#B82020] text-sm font-medium hover:bg-[#B8202010]"
              >
                Reset All Data
              </button>
            ) : (
              <div className="space-y-3 p-3 rounded-lg border border-[#B82020] bg-[#B8202008]">
                <p className="text-sm text-[#B82020] font-semibold">
                  This will permanently delete ALL data — profile, logs, streak history, everything. This cannot be undone.
                </p>
                <p className="text-xs text-[#9A9A9A]">
                  Type <strong className="text-[#B82020]">RESET</strong> to confirm:
                </p>
                <input
                  type="text"
                  value={resetConfirmText}
                  onChange={(e) => setResetConfirmText(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#B82020] text-[#E8E8E8] text-sm placeholder:text-[#666] focus:outline-none"
                  placeholder="Type RESET"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (resetConfirmText === 'RESET') {
                        onResetAllData();
                      }
                    }}
                    disabled={resetConfirmText !== 'RESET'}
                    className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                    style={{
                      backgroundColor: resetConfirmText === 'RESET' ? '#B82020' : '#1E1E1E',
                      color: resetConfirmText === 'RESET' ? 'white' : '#666',
                    }}
                  >
                    Delete Everything
                  </button>
                  <button
                    onClick={() => { setShowResetConfirm(false); setResetConfirmText(''); }}
                    className="flex-1 py-2.5 rounded-lg bg-[#1E1E1E] text-[#9A9A9A] text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ─── ABOUT ─── */}
        <section className="mb-8">
          <div className="text-center text-xs text-[#555] space-y-1">
            <p className="text-[#D4A017] font-semibold">The Sovereign Flame</p>
            <p>A field tool, not a textbook.</p>
            <p>Built for the 11:47 PM user.</p>
          </div>
        </section>

        {/* Bottom safe area */}
        <div className="h-8" />
      </div>
    </div>
  );
}
