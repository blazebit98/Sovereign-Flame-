import type { UserProfile, DailyLog, EmergencyLogEntry, FortressCompletion } from './types';

const PROFILE_KEY = 'sf_profile';
const LOGS_KEY = 'sf_daily_logs';
const EMERGENCY_KEY = 'sf_emergency_logs';

// ────────────────────────────────────────────────────────────
// PROFILE CRUD
// ────────────────────────────────────────────────────────────

export function getProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: UserProfile): void {
  profile.lastActiveDate = new Date().toISOString().split('T')[0];
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function initializeProfile(): UserProfile {
  const today = new Date().toISOString().split('T')[0];
  return {
    depletionSeverityIndex: {
      duration: 0, peakFrequency: 0, contentEscalation: 0,
      ageFirstExposure: 0, currentAge: 0, substanceUse: 0,
      sleepHistory: 0, exerciseHistory: 0, totalScore: 0,
      severity: 'moderate', estimatedRecoveryDays: 90,
    },
    purposeStatement: '',
    constitution: 'unknown',
    chronotype: 'unknown',
    relationshipStatus: 'solo',
    gatesCompleted: {},
    currentStreak: { startDate: today, currentDay: 1, isActive: true },
    streakHistory: [],
    longestStreak: 0,
    totalRetentionDays: 0,
    totalRelapses: 0,
    ratchetClicks: 0,
    morningAlarmTime: '05:00',
    eveningCurfewTime: '21:00',
    accountabilityPartnerName: '',
    accountabilityPartnerPhone: '',
    commitmentDays: 90,
    createdAt: today,
    lastActiveDate: today,
    onboardingComplete: false,
  };
}

// ────────────────────────────────────────────────────────────
// DAY CALCULATIONS
// ────────────────────────────────────────────────────────────

export function getDayNumber(profile: UserProfile): number {
  const start = new Date(profile.currentStreak.startDate + 'T00:00:00');
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays + 1);
}

export function updateDayNumber(profile: UserProfile): UserProfile {
  return {
    ...profile,
    currentStreak: {
      ...profile.currentStreak,
      currentDay: getDayNumber(profile),
    },
  };
}

// ────────────────────────────────────────────────────────────
// DAILY LOGS
// ────────────────────────────────────────────────────────────

export function getDailyLogs(): DailyLog[] {
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveDailyLog(log: DailyLog): void {
  const logs = getDailyLogs();
  const existingIndex = logs.findIndex((l) => l.date === log.date);
  if (existingIndex >= 0) {
    logs[existingIndex] = log;
  } else {
    logs.push(log);
  }
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

/**
 * Get today's log entry, or null if none exists yet
 */
export function getTodayLog(): DailyLog | null {
  const today = new Date().toISOString().split('T')[0];
  const logs = getDailyLogs();
  return logs.find((l) => l.date === today) || null;
}

/**
 * Create a blank daily log template for today
 */
export function createBlankLog(dayNumber: number): DailyLog {
  return {
    date: new Date().toISOString().split('T')[0],
    dayNumber,
    energy: 0,
    mentalClarity: 0,
    emotionalStability: 0,
    socialConfidence: 0,
    urgeIntensity: 0,
    sleepQuality: 0,
    morningFortress: '',
    exerciseCompleted: false,
    exerciseType: '',
    eveningFortress: '',
    mulaBandha: false,
    dietaryProtocol: false,
    triggers: '',
    dreams: '',
    notes: '',
    hrvRMSSD: null,
    overallScore: 0,
  };
}

/**
 * Update today's log with partial data, creating it if it doesn't exist.
 * Returns the updated log.
 */
export function updateTodayLog(updates: Partial<DailyLog>, dayNumber: number): DailyLog {
  const existing = getTodayLog();
  const base = existing || createBlankLog(dayNumber);

  const log: DailyLog = {
    ...base,
    ...updates,
    date: new Date().toISOString().split('T')[0],
    dayNumber,
  };

  // Compute overall score from the 5 positive metrics (excluding urge intensity)
  const metrics = [log.energy, log.mentalClarity, log.emotionalStability, log.socialConfidence, log.sleepQuality];
  const filled = metrics.filter((m) => m > 0);
  log.overallScore = filled.length > 0
    ? Math.round((filled.reduce((a, b) => a + b, 0) / filled.length) * 10) / 10
    : 0;

  saveDailyLog(log);
  return log;
}

/**
 * Update just the morning fortress completion for today
 */
export function saveMorningFortress(completion: FortressCompletion, dayNumber: number): DailyLog {
  return updateTodayLog({ morningFortress: completion }, dayNumber);
}

/**
 * Update just the evening fortress completion for today
 */
export function saveEveningFortress(completion: FortressCompletion, dayNumber: number): DailyLog {
  return updateTodayLog({ eveningFortress: completion }, dayNumber);
}

/**
 * Get logs for a date range (inclusive). Returns sorted by date ascending.
 */
export function getLogsForRange(startDate: string, endDate: string): DailyLog[] {
  const logs = getDailyLogs();
  return logs
    .filter((l) => l.date >= startDate && l.date <= endDate)
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Get the last N logs, sorted most recent first
 */
export function getRecentLogs(count: number): DailyLog[] {
  const logs = getDailyLogs();
  return logs
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, count);
}

/**
 * Compute streak statistics from daily logs
 */
export function computeLogStats(logs: DailyLog[]): {
  avgEnergy: number;
  avgClarity: number;
  avgStability: number;
  avgConfidence: number;
  avgUrge: number;
  avgSleep: number;
  fortressFullRate: number;
  exerciseRate: number;
  totalLogs: number;
} {
  if (logs.length === 0) {
    return {
      avgEnergy: 0, avgClarity: 0, avgStability: 0, avgConfidence: 0,
      avgUrge: 0, avgSleep: 0, fortressFullRate: 0, exerciseRate: 0, totalLogs: 0,
    };
  }

  const filled = (arr: number[]) => arr.filter((v) => v > 0);
  const avg = (arr: number[]) => {
    const f = filled(arr);
    return f.length > 0 ? Math.round((f.reduce((a, b) => a + b, 0) / f.length) * 10) / 10 : 0;
  };

  return {
    avgEnergy: avg(logs.map((l) => l.energy)),
    avgClarity: avg(logs.map((l) => l.mentalClarity)),
    avgStability: avg(logs.map((l) => l.emotionalStability)),
    avgConfidence: avg(logs.map((l) => l.socialConfidence)),
    avgUrge: avg(logs.map((l) => l.urgeIntensity)),
    avgSleep: avg(logs.map((l) => l.sleepQuality)),
    fortressFullRate: Math.round(
      (logs.filter((l) => l.morningFortress === 'full' || l.morningFortress === 'minimum').length / logs.length) * 100
    ),
    exerciseRate: Math.round(
      (logs.filter((l) => l.exerciseCompleted).length / logs.length) * 100
    ),
    totalLogs: logs.length,
  };
}

/**
 * Analyze relapse patterns from streak history.
 * Returns the most common trigger, time, and environment.
 */
export function analyzeRelapsePatterns(profile: UserProfile): {
  mostCommonTrigger: string | null;
  mostCommonTime: string | null;
  mostCommonEnvironment: string | null;
  avgStreakBeforeRelapse: number;
  totalRelapses: number;
} {
  const history = profile.streakHistory;
  if (history.length === 0) {
    return {
      mostCommonTrigger: null, mostCommonTime: null,
      mostCommonEnvironment: null, avgStreakBeforeRelapse: 0, totalRelapses: 0,
    };
  }

  const countMax = (arr: string[]): string | null => {
    const counts: Record<string, number> = {};
    arr.filter(Boolean).forEach((v) => { counts[v] = (counts[v] || 0) + 1; });
    const entries = Object.entries(counts);
    if (entries.length === 0) return null;
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0][0];
  };

  return {
    mostCommonTrigger: countMax(history.map((h) => h.relapseAnalysis.trigger)),
    mostCommonTime: countMax(history.map((h) => h.relapseAnalysis.timeOfDay)),
    mostCommonEnvironment: countMax(history.map((h) => h.relapseAnalysis.environment)),
    avgStreakBeforeRelapse: Math.round(
      history.reduce((sum, h) => sum + h.duration, 0) / history.length
    ),
    totalRelapses: history.length,
  };
}

/**
 * Check if the user is in a chaser window (within 72 hours of most recent relapse)
 */
export function isInChaserWindow(profile: UserProfile): boolean {
  if (profile.streakHistory.length === 0) return false;
  const lastRelapse = profile.streakHistory[profile.streakHistory.length - 1];
  const relapseDate = new Date(lastRelapse.endDate + 'T00:00:00');
  const now = new Date();
  const hoursSinceRelapse = (now.getTime() - relapseDate.getTime()) / (1000 * 60 * 60);
  return hoursSinceRelapse <= 72;
}

// ────────────────────────────────────────────────────────────
// EMERGENCY LOGS
// ────────────────────────────────────────────────────────────

export function getEmergencyLogs(): EmergencyLogEntry[] {
  try {
    const raw = localStorage.getItem(EMERGENCY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveEmergencyLog(entry: EmergencyLogEntry): void {
  const logs = getEmergencyLogs();
  logs.push(entry);
  localStorage.setItem(EMERGENCY_KEY, JSON.stringify(logs));
}

// ────────────────────────────────────────────────────────────
// STREAK MANAGEMENT
// ────────────────────────────────────────────────────────────

export function resetStreak(profile: UserProfile, analysis: {
  trigger: string; emotionalState: string; environment: string;
  timeOfDay: string; earliestInterventionPoint: string; patchImplemented: string;
}): UserProfile {
  const currentDay = getDayNumber(profile);
  const today = new Date().toISOString().split('T')[0];

  const record = {
    startDate: profile.currentStreak.startDate,
    endDate: today,
    duration: currentDay,
    relapseAnalysis: analysis,
  };

  return {
    ...profile,
    currentStreak: { startDate: today, currentDay: 1, isActive: true },
    streakHistory: [...profile.streakHistory, record],
    longestStreak: Math.max(profile.longestStreak, currentDay),
    totalRetentionDays: profile.totalRetentionDays + currentDay,
    totalRelapses: profile.totalRelapses + 1,
    ratchetClicks: profile.ratchetClicks + Math.floor(currentDay / 7) + 1,
  };
}
