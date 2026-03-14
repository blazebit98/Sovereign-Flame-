// ────────────────────────────────────────────────────────────
// DEPLETION SEVERITY INDEX — Exact scoring from source
// ────────────────────────────────────────────────────────────

import type { SeverityLevel } from '../types';

export interface DSIQuestion {
  id: string;
  title: string;
  description: string;
  options: { label: string; value: number }[];
}

export const dsiQuestions: DSIQuestion[] = [
  {
    id: 'duration',
    title: 'Duration of Habit',
    description: 'How many years have you been regularly engaging in this behavior?',
    options: [
      { label: 'Less than 2 years', value: 2 },
      { label: '2–5 years', value: 5 },
      { label: '5–10 years', value: 8 },
      { label: '10–15 years', value: 11 },
      { label: '15–20 years', value: 14 },
      { label: '20+ years', value: 17 },
    ],
  },
  {
    id: 'peakFrequency',
    title: 'Peak Frequency',
    description: 'At your worst, how frequently were you ejaculating?',
    options: [
      { label: 'Once a week or less', value: 2 },
      { label: '2–3 times per week', value: 4 },
      { label: 'Once daily', value: 7 },
      { label: '2–3 times daily', value: 10 },
      { label: '4+ times daily', value: 13 },
    ],
  },
  {
    id: 'contentEscalation',
    title: 'Content Escalation',
    description: 'Did you escalate to content that would have shocked your earlier self?',
    options: [
      { label: 'Never used pornography', value: 0 },
      { label: 'Mainstream / vanilla only', value: 3 },
      { label: 'Moderate escalation over time', value: 7 },
      { label: 'Significant escalation to extreme content', value: 11 },
      { label: 'Escalation to content that disturbed you even during use', value: 14 },
    ],
  },
  {
    id: 'ageFirstExposure',
    title: 'Age of First Exposure',
    description: 'How old were you when regular use or compulsive behavior began?',
    options: [
      { label: '18 or older', value: 3 },
      { label: '14–17', value: 7 },
      { label: '11–13', value: 11 },
      { label: 'Under 11', value: 14 },
    ],
  },
  {
    id: 'currentAge',
    title: 'Current Age',
    description: 'Recovery pace adjusts with age — not a judgment, a calibration.',
    options: [
      { label: 'Under 25', value: 3 },
      { label: '25–35', value: 5 },
      { label: '35–45', value: 8 },
      { label: '45–55', value: 10 },
      { label: '55+', value: 12 },
    ],
  },
  {
    id: 'substanceUse',
    title: 'Concurrent Substance Use',
    description: 'Alcohol, cannabis, stimulants, or other substances that compound neurological impact.',
    options: [
      { label: 'None or rare social use', value: 1 },
      { label: 'Regular alcohol (3+ drinks/week)', value: 4 },
      { label: 'Regular cannabis', value: 5 },
      { label: 'Regular alcohol + cannabis or combinations', value: 8 },
      { label: 'Heavy polysubstance use', value: 10 },
    ],
  },
  {
    id: 'sleepHistory',
    title: 'Sleep Quality History',
    description: 'Chronic sleep deprivation compounds every dimension of depletion.',
    options: [
      { label: 'Consistently good (7–9 hours, regular schedule)', value: 1 },
      { label: 'Moderately disrupted (6–7 hours, irregular)', value: 4 },
      { label: 'Chronically poor (under 6 hours or severely disrupted)', value: 8 },
    ],
  },
  {
    id: 'exerciseHistory',
    title: 'Exercise History',
    description: 'Physical fitness provides recovery capacity.',
    options: [
      { label: 'Regular vigorous exercise (4+ days/week, years)', value: 1 },
      { label: 'Moderate exercise (2–3 days/week)', value: 4 },
      { label: 'Minimal exercise (occasional)', value: 7 },
      { label: 'Sedentary lifestyle (years)', value: 10 },
    ],
  },
];

export interface DSIResult {
  totalScore: number;
  severity: SeverityLevel;
  estimatedRecoveryDays: number;
  timelineLabel: string;
  interpretation: string;
}

export function calculateDSI(answers: Record<string, number>): DSIResult {
  const total = Object.values(answers).reduce((sum, v) => sum + v, 0);

  if (total <= 20) {
    return {
      totalScore: total,
      severity: 'mild',
      estimatedRecoveryDays: 45,
      timelineLabel: '30–60 days',
      interpretation:
        'Relatively little neuroplastic damage to reverse. Benefits will appear quickly. Your primary challenge will be complacency — "this is easy" can lead to lowered vigilance.',
    };
  }
  if (total <= 40) {
    return {
      totalScore: total,
      severity: 'moderate',
      estimatedRecoveryDays: 90,
      timelineLabel: '60–120 days',
      interpretation:
        'Moderate depletion requiring genuine neuroplastic remodeling. The flatline will likely occur and may last 2–4 weeks. Benefits will emerge noticeably around Day 45–60 and accelerate from there.',
    };
  }
  if (total <= 60) {
    return {
      totalScore: total,
      severity: 'significant',
      estimatedRecoveryDays: 150,
      timelineLabel: '120–180 days',
      interpretation:
        'Deep neurological grooves that require extended rewiring. Your flatline may be severe and prolonged (4–8 weeks). Do not judge the practice at Day 30. The compound recovery curve means Days 60–180 will show dramatic transformation.',
    };
  }
  if (total <= 80) {
    return {
      totalScore: total,
      severity: 'severe',
      estimatedRecoveryDays: 270,
      timelineLabel: '180–365 days',
      interpretation:
        'Profound depletion built over many years. This is a multi-season project, not a sprint. When recovery begins accelerating around Day 90–120, the contrast with your depleted state will be dramatic. The deeper the hole, the more remarkable the ascent.',
    };
  }
  return {
    totalScore: total,
    severity: 'extreme',
    estimatedRecoveryDays: 450,
    timelineLabel: '365+ days',
    interpretation:
      'Deep, long-standing, compounded depletion. This is a multi-year project that will reshape your entire life. Every dimension you address — substance use, sleep, exercise, decades of habit — accelerates recovery in ALL dimensions simultaneously. Consider professional support alongside the practice. You are not broken. You are a complex system reconfiguring.',
  };
}

// Severity colors for UI
export function getSeverityColor(severity: SeverityLevel): string {
  switch (severity) {
    case 'mild': return '#2D8B4E';
    case 'moderate': return '#D4A017';
    case 'significant': return '#C4601D';
    case 'severe': return '#B82020';
    case 'extreme': return '#8B2252';
  }
}

// Severity to human-readable timeline label
export function getSeverityTimelineLabel(severity: SeverityLevel): string {
  switch (severity) {
    case 'mild': return '30–60 days';
    case 'moderate': return '60–120 days';
    case 'significant': return '120–180 days';
    case 'severe': return '180–365 days';
    case 'extreme': return '365+ days';
  }
}
