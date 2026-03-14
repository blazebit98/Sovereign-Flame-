import type { TimeOfDay } from './types';

export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 10) return 'morning';
  if (hour >= 10 && hour < 17) return 'midday';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
}

export function getGreeting(timeOfDay: TimeOfDay): string {
  switch (timeOfDay) {
    case 'morning': return 'Good morning';
    case 'midday': return 'Stay focused';
    case 'evening': return 'Entering vulnerability window';
    case 'night': return 'Guard the night';
  }
}

export function getTimeIcon(timeOfDay: TimeOfDay): string {
  switch (timeOfDay) {
    case 'morning': return '☀️';
    case 'midday': return '⚡';
    case 'evening': return '⚠️';
    case 'night': return '🌙';
  }
}

export function getMorningsLeft(currentAge: number = 30): number {
  const expectedLifespan = 76;
  const yearsLeft = Math.max(1, expectedLifespan - currentAge);
  return yearsLeft * 365;
}

export function formatMorningsLeft(currentAge: number = 30): string {
  const mornings = getMorningsLeft(currentAge);
  return mornings.toLocaleString();
}

export function getPhaseLabel(dayNumber: number): string {
  if (dayNumber <= 3) return 'The Valley';
  if (dayNumber <= 7) return 'The Surge';
  if (dayNumber <= 14) return 'The False Plateau';
  if (dayNumber <= 30) return 'The Build';
  if (dayNumber <= 60) return 'The Clearing';
  if (dayNumber <= 90) return 'The Renaissance';
  if (dayNumber <= 180) return 'Integration';
  if (dayNumber <= 365) return 'Establishment';
  return 'Mastery';
}

export function getDailyInsightPreview(dayNumber: number): string {
  if (dayNumber === 1) return "Prolactin is normalizing. Dopamine is below baseline. The chaser effect may be intense. This is the hardest 24-hour window. Every subsequent day is easier. Survive this day.";
  if (dayNumber === 2) return "Dopamine still below baseline. Irritability and anxiety may peak. Maximum binge vulnerability. Deploy exercise, cold exposure, accountability. Non-negotiable.";
  if (dayNumber === 3) return "You have passed through the valley. Prolactin is normalized. Dopamine is recovering. The first glimpses of clarity may appear — brief moments of unusual mental sharpness. These are D2 receptors beginning to upregulate.";
  if (dayNumber <= 6) return "Testosterone accelerating. Energy building. First clarity emerging. Social confidence beginning to surface. Channel this energy — do not let it stagnate.";
  if (dayNumber === 7) return "Testosterone has peaked at approximately 146% of baseline. You may feel a powerful surge of energy, drive, and intense sexual energy. THIS MUST BE CHANNELED. Today's exercise should be the most intense of your week. The surge is fuel, not a command.";
  if (dayNumber <= 13) return "Serum testosterone returning toward baseline BUT receptor sensitivity INCREASING — same T, greater effect. Sleep significantly better. D2 upregulation accelerating.";
  if (dayNumber === 14) return "Serum testosterone is normalizing, but androgen RECEPTOR sensitivity is increasing. You may feel benefits 'leveling off.' This is the FALSE PLATEAU. The invisible improvement — receptor upregulation — is continuing. Trust the timeline.";
  if (dayNumber <= 29) return "Old neural pathways measurably weakening. New patterns forming. Emotional material surfacing. If the flatline begins — low energy, low libido, flat mood — THIS IS NOT FAILURE. It is renovation. The factory is retooling.";
  if (dayNumber === 30) return "Old neural pathways are measurably weakening. The flatline may begin. If energy and libido drop, this is RENOVATION, not regression. The brain is dismantling old circuits and building new ones. Maintain all practices, especially exercise.";
  if (dayNumber <= 44) return "ΔFosB is clearing. D2 recovery underway. The world may start becoming more interesting without seeking stimulation. Maintain every practice through this phase.";
  if (dayNumber === 45) return "ΔFosB is approximately 50% cleared — past one full half-life. The addiction circuitry is dismantling. D2 receptors are significantly upregulating. You may notice ordinary things becoming surprisingly enjoyable — food, music, conversation. This is the sensitivity renaissance beginning.";
  if (dayNumber <= 59) return "The sensitivity renaissance is deepening. Notice what you notice. Is food tasting better? Is music more moving? These are D2 receptors coming back online. The world is becoming vivid again.";
  if (dayNumber === 60) return "If the flatline occurred, it is likely lifting. The world is becoming more vivid. Deep work capacity is enhanced. Five independent biological clocks are approaching their convergence thresholds. The best is coming.";
  if (dayNumber <= 73) return "Multiple biological timelines converging. Deep work capacity noticeably enhanced. Creative output qualitatively different. Social interactions fundamentally changed.";
  if (dayNumber === 74) return "Your first complete spermatogenic cycle under retention conditions is complete. The body has produced an entire generation of reproductive cells without depleting them. The metabolic substrate is no longer being continuously replaced from a depleted state.";
  if (dayNumber <= 89) return "All five convergence clocks approaching threshold. Identity transformation consolidating. The retained state is becoming your natural state. Maintain vigilance against complacency.";
  if (dayNumber === 90) return "CONVERGENCE. Five biological clocks have reached their thresholds simultaneously: ΔFosB cleared, D2 receptors upregulated, habit formation automated, spermatogenic cycle completed, connectomic remodeling measurable. The foundation is laid. The reboot is complete. What you build from here is limited only by the scale of your purpose.";
  if (dayNumber <= 180) return "Integration phase. Transmutation becoming semi-automatic. Energy stable, not surging. Identity consolidating. Maintain the architecture — complacency is the primary danger now.";
  if (dayNumber <= 365) return "Deep structural changes manifesting: facial composition, vocal timbre, body composition, skin quality, eye clarity. Slow variables invisible week-to-week, dramatic month-to-month. Approaching establishment — pratisthayam.";
  return "Open frontier. The practice is yours. Maintain the architecture. Deepen the meditation. Expand the service. Follow the energy into territory no document can map.";
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

let audioCtx: AudioContext | null = null;

export function playBeep(frequency: number = 440, duration: number = 0.4): void {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + duration);
  } catch {
    // Silent fallback
  }
}

export function vibrate(pattern: number | number[] = 200): void {
  try {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch {
    // Silent fallback
  }
}
