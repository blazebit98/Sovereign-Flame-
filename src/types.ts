export interface DepletionSeverityIndex {
  duration: number;
  peakFrequency: number;
  contentEscalation: number;
  ageFirstExposure: number;
  currentAge: number;
  substanceUse: number;
  sleepHistory: number;
  exerciseHistory: number;
  totalScore: number;
  severity: SeverityLevel;
  estimatedRecoveryDays: number;
}

export type SeverityLevel = 'mild' | 'moderate' | 'significant' | 'severe' | 'extreme';
export type Constitution = 'vata' | 'pitta' | 'kapha' | 'unknown';
export type Chronotype = 'lion' | 'bear' | 'wolf' | 'dolphin' | 'unknown';
export type RelationshipStatus = 'solo' | 'partnered-supportive' | 'partnered-resistant' | 'exploring';
export type FortressCompletion = 'full' | 'minimum' | 'partial' | 'skipped' | '';
export type TimeOfDay = 'morning' | 'midday' | 'evening' | 'night';
export type Tab = 'today' | 'protocol' | 'track' | 'map' | 'depth';

export interface GateProgress {
  completed: boolean;
  completedDate: string;
  actions: boolean[];
}

export interface RelapseAnalysis {
  trigger: string;
  emotionalState: string;
  environment: string;
  timeOfDay: string;
  earliestInterventionPoint: string;
  patchImplemented: string;
}

export interface StreakRecord {
  startDate: string;
  endDate: string;
  duration: number;
  relapseAnalysis: RelapseAnalysis;
}

export interface UserProfile {
  depletionSeverityIndex: DepletionSeverityIndex;
  purposeStatement: string;
  constitution: Constitution;
  chronotype: Chronotype;
  relationshipStatus: RelationshipStatus;
  gatesCompleted: Record<string, GateProgress>;
  currentStreak: {
    startDate: string;
    currentDay: number;
    isActive: boolean;
  };
  streakHistory: StreakRecord[];
  longestStreak: number;
  totalRetentionDays: number;
  totalRelapses: number;
  ratchetClicks: number;
  morningAlarmTime: string;
  eveningCurfewTime: string;
  accountabilityPartnerName: string;
  accountabilityPartnerPhone: string;
  commitmentDays: number;
  createdAt: string;
  lastActiveDate: string;
  onboardingComplete: boolean;
}

export interface DailyLog {
  date: string;
  dayNumber: number;
  energy: number;
  mentalClarity: number;
  emotionalStability: number;
  socialConfidence: number;
  urgeIntensity: number;
  sleepQuality: number;
  morningFortress: FortressCompletion;
  exerciseCompleted: boolean;
  exerciseType: string;
  eveningFortress: FortressCompletion;
  mulaBandha: boolean;
  dietaryProtocol: boolean;
  triggers: string;
  dreams: string;
  notes: string;
  hrvRMSSD: number | null;
  overallScore: number;
}

export interface EmergencyLogEntry {
  date: string;
  dayNumber: number;
  type: 'wave' | 'tsunami';
  maxLevel: number;
  survived: boolean;
  trigger: string;
  duration: number;
}
