import type { SeverityLevel } from '../types';

export interface DailyInsightPhase {
  dayRange: [number, number]; // inclusive
  exactDays?: Record<number, string>; // override for specific critical days
  biologicalEvent: string;
  experientialPrediction: string;
  practicalGuidance: string;
  relevantChain: string; // which of the 7 master chains
  severityAdjustments?: Partial<Record<SeverityLevel, string>>;
}

const insightPhases: DailyInsightPhase[] = [
  // PHASE 1: THE VALLEY (Days 1-3)
  {
    dayRange: [1, 3],
    exactDays: {
      1: "Prolactin is normalizing. Dopamine is below baseline. The chaser effect may be intense. This is the hardest 24-hour window. Every subsequent day is easier. Survive this day.",
      2: "Dopamine still below baseline. Irritability and anxiety may peak. Maximum binge vulnerability — the chaser effect is at full force. Deploy exercise, cold exposure, accountability. Non-negotiable.",
      3: "You have passed through the valley. Prolactin is normalized. Dopamine is recovering. The first glimpses of clarity may appear — brief moments of unusual mental sharpness. These are D2 receptors beginning to upregulate.",
    },
    biologicalEvent: "Prolactin surge clearing. Dopamine below baseline. Chaser effect active.",
    experientialPrediction: "Intense cravings, irritability, possible anxiety. Difficulty concentrating.",
    practicalGuidance: "Survive. Exercise hard. Cold exposure. Call accountability partner. Stay in public spaces.",
    relevantChain: "DOPAMINERGIC",
    severityAdjustments: {
      severe: "With your history, the chaser effect may persist 4-5 days rather than 2-3. This is normal for your timeline. Extra vigilance is expected, not weakness.",
      extreme: "Your neural pathways are deeply grooved. The chaser may feel overwhelming. This is proportional to your depletion depth — not to your character. Deploy Level 4-5 emergency measures preemptively.",
    },
  },

  // PHASE 2: THE SURGE (Days 4-7)
  {
    dayRange: [4, 7],
    exactDays: {
      7: "Testosterone has peaked at approximately 146% of baseline. You may feel a powerful surge of energy, drive, and intense sexual energy. THIS MUST BE CHANNELED. Today's exercise should be the most intense of your week. The surge is fuel, not a command.",
    },
    biologicalEvent: "Testosterone accelerating toward Day 7 peak (146% of baseline). Androgen receptors sensitizing. Sleep architecture improving.",
    experientialPrediction: "Rising energy. First clarity. Social confidence emerging. Day 7: powerful surge that demands channeling.",
    practicalGuidance: "Channel the rising energy through exercise and creative work. Day 7 specifically: heaviest workout of the week. Do not mistake the surge for a signal to release.",
    relevantChain: "ENDOCRINE",
    severityAdjustments: {
      mild: "You may feel the testosterone surge quite strongly. Your receptors are relatively intact, so the effect will be pronounced.",
      severe: "The Day 7 surge may be muted due to receptor desensitization. This is expected. The receptors need more time to upregulate. The surge IS happening — you may just not feel it fully yet.",
    },
  },

  // PHASE 3: FALSE PLATEAU (Days 8-14)
  {
    dayRange: [8, 14],
    exactDays: {
      14: "Serum testosterone is normalizing, but androgen RECEPTOR sensitivity is increasing. You may feel benefits 'leveling off.' This is the FALSE PLATEAU. The invisible improvement — receptor upregulation — is continuing. Trust the timeline.",
    },
    biologicalEvent: "Serum testosterone returning toward baseline BUT androgen receptor sensitivity INCREASING — same T levels, greater cellular response. D2 upregulation accelerating. Sleep significantly improved.",
    experientialPrediction: "Benefits may seem to plateau or waver. Doubt arises: 'Was Day 7 the peak?' No. The visible hormones are normalizing while the invisible receptors are sensitizing.",
    practicalGuidance: "Trust the process. The real transformation is happening at the receptor level where you cannot feel it directly. Maintain every practice. Begin daily tracking if you haven't — you need data, not feelings, to see progress.",
    relevantChain: "ENDOCRINE",
    severityAdjustments: {
      significant: "Your receptor recovery timeline is longer. You may not feel the receptor sensitization until Day 21-30. This is normal for your depletion level.",
      severe: "Receptor upregulation for your history may take 4-8 weeks before becoming noticeable. Stay the course. The biology is working regardless of whether you can perceive it yet.",
    },
  },

  // PHASE 4: EARLY BUILD (Days 15-29)
  {
    dayRange: [15, 29],
    exactDays: {
      21: "Three weeks. Old neural pathways are measurably weakening. The 66-day habit formation clock is 1/3 complete. Emotional material may be surfacing — feelings previously numbed by ejaculation are now being felt. This is not a side effect. This is healing.",
    },
    biologicalEvent: "Old neural pathways weakening. New patterns forming. ΔFosB beginning to clear (half-life ~6-8 weeks). Emotional content surfacing as dopaminergic numbing lifts.",
    experientialPrediction: "Oscillation between clarity days and fog days. Emotional material surfacing — sadness, anger, loneliness previously masked by compulsive behavior. Flatline may begin.",
    practicalGuidance: "If the flatline begins — low energy, low libido, flat mood — THIS IS NOT FAILURE. It is neurological renovation. The brain is dismantling old circuits and building new ones. Maintain all practices, especially exercise. Do NOT 'test' whether things still work.",
    relevantChain: "NEUROPLASTIC",
    severityAdjustments: {
      mild: "Emotional surfacing may be mild. You may skip the flatline entirely or experience only a brief dip.",
      moderate: "The flatline may begin around Day 20-25. Expect 1-3 weeks of reduced energy and libido. This is the renovation period.",
      significant: "The flatline for your history may begin now and last 4-6 weeks. This is proportional to the depth of change occurring. More depletion = more renovation required = longer flatline.",
      severe: "Your flatline may be severe and prolonged (4-8 weeks). Consider it proportional evidence of how much your brain is changing. The deeper the renovation, the more dramatic the result.",
      extreme: "Extended flatline is expected for your timeline. Professional support alongside the practice is recommended if mood drops significantly. Distinguish flatline (temporary neural renovation) from clinical depression (persistent, worsening). If suicidal ideation occurs: seek professional help immediately.",
    },
  },

  // PHASE 5: THE CLEARING (Days 30-44)
  {
    dayRange: [30, 44],
    exactDays: {
      30: "Old neural pathways are measurably weakening. The flatline may begin or deepen. If energy and libido drop, this is RENOVATION, not regression. The brain is dismantling old circuits and building new ones. Maintain all practices, especially exercise.",
    },
    biologicalEvent: "ΔFosB approximately 25-40% cleared. D2 receptor recovery significant and accelerating. Synaptic pruning of old pathways in progress. New default mode network patterns emerging.",
    experientialPrediction: "Flatline may be at its deepest. Alternatively, the first wave of the sensitivity renaissance may be arriving — ordinary experiences becoming surprisingly vivid.",
    practicalGuidance: "Non-negotiable: exercise, morning fortress, evening fortress. The architecture holds you when motivation cannot. If in flatline — this is the hardest phase psychologically. It passes. Every practitioner who gets through this phase reports it was worth it.",
    relevantChain: "NEUROPLASTIC",
    severityAdjustments: {
      mild: "D2 recovery may already be producing the sensitivity renaissance. Notice: is food tasting better? Is music more moving?",
      severe: "You are still in early clearing. ΔFosB has deep grooves that take longer. Your recovery investment ratio suggests patience through Day 60 minimum before expecting clear perceptual shifts.",
    },
  },

  // PHASE 6: SENSITIVITY RENAISSANCE (Days 45-59)
  {
    dayRange: [45, 59],
    exactDays: {
      45: "ΔFosB is approximately 50% cleared — past one full half-life. The addiction circuitry is dismantling. D2 receptors are significantly upregulating. You may notice ordinary things becoming surprisingly enjoyable — food, music, conversation. This is the sensitivity renaissance beginning.",
    },
    biologicalEvent: "ΔFosB past one half-life (~50% cleared). D2 receptors substantially upregulated. Prefrontal-limbic power balance shifting. Anhedonia resolving. Natural reward sensitivity restoring.",
    experientialPrediction: "The world becoming genuinely more interesting without seeking stimulation. Colors brighter. Music richer. Conversations more engaging. Food more flavorful. These are D2 receptors coming back online.",
    practicalGuidance: "Notice what you notice. The sensitivity renaissance is not dramatic — it is subtle. The absence of anhedonia is not ecstasy. It is normality. The normality you have never experienced because you have been in deficit since puberty. Savor the ordinary. It is extraordinary.",
    relevantChain: "DOPAMINERGIC",
    severityAdjustments: {
      mild: "You may be well into the renaissance now. Deep work capacity noticeably enhanced.",
      significant: "The renaissance may just be beginning for your timeline. First hints — subtle shifts in how food tastes, how music lands.",
      severe: "Your D2 recovery timeline is longer. You may be entering early renaissance or still in clearing. Both are normal for your history. The curve will bend upward.",
      extreme: "If you're still in flatline, it is expected for your timeline. The clearing takes longer for deep depletion. Continue the architecture. Consider this your investment phase — returns are coming.",
    },
  },

  // PHASE 7: CONVERGENCE APPROACH (Days 60-73)
  {
    dayRange: [60, 73],
    exactDays: {
      60: "If the flatline occurred, it is likely lifting. The world is becoming more vivid. Deep work capacity is enhanced. Five independent biological clocks are approaching their convergence thresholds. The best is coming.",
    },
    biologicalEvent: "Multiple biological timelines converging. ΔFosB ~70-85% cleared. D2 receptors approaching full recovery. Habit formation threshold approaching (66 days average). Connectomic remodeling measurable. Spermatogenic cycle nearing completion.",
    experientialPrediction: "Deep work capacity noticeably enhanced. Creative output qualitatively different. Social interactions fundamentally changed. People responding differently — not because they changed, but because you did.",
    practicalGuidance: "Maintain the architecture. Complacency is the primary danger now — 'I've got this' leads to lowered vigilance leads to casual trigger exposure leads to surprise relapse. The fortress protects you. Do not dismantle it because the weather seems calm.",
    relevantChain: "FEEDBACK",
    severityAdjustments: {
      significant: "Five clocks may not converge simultaneously for your timeline. Some may arrive at Day 90, others at Day 120. This is normal — convergence is a process, not a single moment.",
      severe: "Your convergence window may extend to Day 120-180. The clocks are all ticking — they just started from different positions given your depletion depth.",
    },
  },

  // PHASE 8: SPERMATOGENIC COMPLETION (Day 74)
  {
    dayRange: [74, 74],
    exactDays: {
      74: "Your first complete spermatogenic cycle under retention conditions is complete. The body has produced an entire generation of reproductive cells without depleting them. The metabolic substrate is no longer being continuously replaced from a depleted state. Zinc, selenium, choline, SAM, carnitine, phospholipids — all conserved and available for systemic optimization.",
    },
    biologicalEvent: "First full spermatogenic cycle (74 days) completed under retention. Complete generation of reproductive cells produced without depletion.",
    experientialPrediction: "Metabolic surplus becoming tangible. The body is no longer in replacement mode — it is in optimization mode.",
    practicalGuidance: "Recognize this milestone quietly. No celebration that creates dopaminergic dependency. Simply note: the biology has crossed a threshold. Your body is now operating with a full metabolic reserve for the first time since regular ejaculation began.",
    relevantChain: "METABOLIC",
  },

  // PHASE 9: PRE-CONVERGENCE (Days 75-89)
  {
    dayRange: [75, 89],
    biologicalEvent: "All five convergence clocks in final approach. ΔFosB substantially cleared. D2 recovery approaching plateau. Habit automation threshold crossed. Connectomic remodeling substantial. Identity transformation consolidating.",
    experientialPrediction: "The retained state feeling natural rather than effortful. Energy stable and reliable rather than surging. Social presence qualitatively different. The 'new normal' feels normal — which IS the transformation.",
    practicalGuidance: "Maintain vigilance. Many advanced practitioners relapse in this window precisely because success breeds complacency. 'I've got this' is the most dangerous sentence. You've got this IF you maintain the architecture.",
    relevantChain: "FEEDBACK",
  },

  // PHASE 10: CONVERGENCE (Day 90)
  {
    dayRange: [90, 90],
    exactDays: {
      90: "CONVERGENCE. Five biological clocks have reached their thresholds simultaneously: ΔFosB cleared, D2 receptors upregulated, habit formation automated, spermatogenic cycle completed, connectomic remodeling measurable. The foundation is laid. The reboot is complete. What you build from here is limited only by the scale of your purpose.",
    },
    biologicalEvent: "Five-clock convergence threshold.",
    experientialPrediction: "Not a dramatic moment — a recognition. The work of 90 days crystallizes into a new baseline.",
    practicalGuidance: "Open the sealed envelope from Day 1 (if you wrote one). Compare. The contrast is the proof. Now decide: continue open-ended, or set a new milestone (Day 180)?",
    relevantChain: "VERTICAL",
  },

  // PHASE 11: INTEGRATION (Days 91-180)
  {
    dayRange: [91, 180],
    exactDays: {
      120: "Four months. Transmutation becoming semi-automatic. The twelve feedback loops are all running and self-reinforcing. Energy stable, not surging. The practice is transitioning from 'something you do' to 'something you are.' Primary danger: complacency and purpose insufficiency — your energy now exceeds what a small purpose can absorb.",
      150: "Five months. Deep structural changes becoming visible to others. Facial composition, posture, vocal timbre, eye clarity — slow variables changing. If you took a Day 0 photograph, compare now. The man in that photo and the man in the mirror are diverging.",
    },
    biologicalEvent: "Integration and deepening. Transmutation becoming semi-automatic. Twelve feedback loops self-reinforcing. Slow structural variables changing: body composition, facial definition, vocal depth.",
    experientialPrediction: "Energy stable rather than surging. Retention feeling effortless most days. Others noticing changes before you do. Purpose may need scaling up — the energy demands a larger vessel.",
    practicalGuidance: "Scale your purpose. A purpose too small for your energy will overflow into compulsion. The energy that was generating humans can generate books, businesses, communities. What will you build? Maintain the architecture — it remains your foundation even as the building grows.",
    relevantChain: "VERTICAL",
    severityAdjustments: {
      severe: "For your timeline, this may be where the convergence is actually occurring. What the mild practitioner experienced at Day 60-90, you may be experiencing now. This is not delay — it is depth. The transformation arriving now is proportional to the depth of your prior depletion.",
      extreme: "Your recovery curve may still be in its acceleration phase. The S-curve is bending upward now. What comes in the next 90 days may be more dramatic than everything before combined.",
    },
  },

  // PHASE 12: STRUCTURAL TRANSFORMATION (Days 181-365)
  {
    dayRange: [181, 365],
    exactDays: {
      180: "Six months. Deep structural changes becoming visible. Facial composition, vocal timbre, body composition, skin quality, eye clarity — slow variables invisible week-to-week, dramatic month-to-month. Compare photographs. The evidence is in the mirror.",
      270: "Nine months. Approaching establishment — Patanjali's pratisthayam. The practice is deeply encoded physiologically, psychologically, behaviorally. Not 'trying to retain' — retention IS who you are.",
      365: "One year. Establishment. The first coagulation. A new stable state. You have lived an entire solar cycle in retention. Seasons have passed. Holidays, stresses, celebrations, losses — all navigated without depletion. What lies beyond is genuinely unknown — territory explored by individual practitioners but never systematically mapped. The open frontier begins.",
    },
    biologicalEvent: "Deep structural changes manifesting physically. Epigenetic modifications stabilizing. Telomere maintenance optimized. Microbiome composition shifted. Neuroplastic changes approaching permanence.",
    experientialPrediction: "Retention as identity, not practice. Others experiencing you as fundamentally different. Professional capacity at new levels. Relationship quality transformed. Approaching pratisthayam — establishment.",
    practicalGuidance: "Deepen meditation. Expand service. The architecture can simplify now — the building stands on its own. But the foundation remains: morning practice, exercise, evening discipline, purpose. These are not scaffolding to remove. They are the structure itself.",
    relevantChain: "VERTICAL",
  },

  // PHASE 13: MASTERY (Days 366+)
  {
    dayRange: [366, 99999],
    biologicalEvent: "Open frontier. Sahaja — natural, effortless state. The distinction between 'practice' and 'life' dissolving. New territory that no document can map.",
    experientialPrediction: "What lies at two, five, ten years is genuinely unknown. Individual practitioners report phenomena for which no systematic framework exists. Consciousness recognizing itself in all its expressions. Including desire.",
    practicalGuidance: "Maintain the architecture. Deepen the meditation. Expand the service. Follow the energy into territory no document can map. The synthesis points toward an open horizon. This is not a closed system. It is an invitation.",
    relevantChain: "VERTICAL",
  },
];

/**
 * Get the daily insight for a specific day number, optionally adjusted for severity level.
 */
export function getDailyInsight(dayNumber: number, severity: SeverityLevel = 'moderate'): {
  text: string;
  biologicalEvent: string;
  experientialPrediction: string;
  practicalGuidance: string;
  relevantChain: string;
  severityNote: string | null;
} {
  const phase = insightPhases.find(
    (p) => dayNumber >= p.dayRange[0] && dayNumber <= p.dayRange[1]
  ) || insightPhases[insightPhases.length - 1];

  // Check for exact day override
  const exactText = phase.exactDays?.[dayNumber];
  const mainText = exactText || phase.biologicalEvent;

  // Get severity adjustment
  const severityNote = phase.severityAdjustments?.[severity] || null;

  return {
    text: mainText,
    biologicalEvent: phase.biologicalEvent,
    experientialPrediction: phase.experientialPrediction,
    practicalGuidance: phase.practicalGuidance,
    relevantChain: phase.relevantChain,
    severityNote,
  };
}

/**
 * Get the exercise for today based on day of week
 */
export function getTodayExercise(): { name: string; mechanism: string; dayName: string } {
  const dow = new Date().getDay(); // 0=Sun, 1=Mon...
  const exercises = [
    { name: 'Rest / gentle movement', mechanism: 'Recovery. Integration. The system upgrades during rest.', dayName: 'Sunday' },
    { name: 'Heavy compound lifts', mechanism: 'Osteocalcin↑ → T↑ → cognition↑. Type II fiber recruitment.', dayName: 'Monday' },
    { name: 'Sprint intervals', mechanism: 'GH↑ 400-700%. Aggression channeled into movement.', dayName: 'Tuesday' },
    { name: 'Yoga / mobility', mechanism: 'Fascial release. Energy circulation. Parasympathetic.', dayName: 'Wednesday' },
    { name: 'Martial art / sport', mechanism: 'Warrior archetype. Full-body integration. Social.', dayName: 'Thursday' },
    { name: 'Heavy compound lifts (B)', mechanism: 'Osteocalcin↑ → T↑ → cognition↑. Different exercises, same principle.', dayName: 'Friday' },
    { name: 'Nature immersion 2h+', mechanism: 'Grounding. Schumann resonance. Vitamin D. Vagal tone.', dayName: 'Saturday' },
  ];
  return exercises[dow];
}

/**
 * Get the current week number (1-13+) and its guidance from the 90-day map
 */
export function getCurrentWeekGuidance(dayNumber: number): {
  week: number;
  title: string;
  focus: string;
  risk: string;
} {
  const week = Math.ceil(dayNumber / 7);
  
  if (week === 1) return { week, title: 'SURVIVE', focus: 'Digital lockdown. Morning Fortress. Exercise daily. Emergency protocol memorized.', risk: 'Chaser effect (Days 1-3). Day 7 T surge.' };
  if (week === 2) return { week, title: 'STABILIZE', focus: 'Expand Morning Fortress. Establish dietary protocol. Begin daily tracking.', risk: 'Doubt as T normalizes. "Was Day 7 the peak?"' };
  if (week <= 4) return { week, title: 'BUILD', focus: 'Full protocol engagement. Exercise rotation established. Mula bandha habitual.', risk: 'Flatline may begin. Emotional material surfacing.' };
  if (week <= 8) return { week, title: 'DEEPEN', focus: 'Navigate flatline. Creative/service channel producing output.', risk: 'Flatline tempts "testing." Emotional content surfacing.' };
  if (week <= 13) return { week, title: 'CONVERGE', focus: 'Multiple biological timelines approaching threshold. Identity consolidating.', risk: 'Complacency from success → lowered vigilance → surprise relapse.' };
  return { week, title: 'OPEN ROAD', focus: 'Maintain architecture. Deepen meditation. Expand service.', risk: 'Complacency. Purpose insufficiency.' };
}
