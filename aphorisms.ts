export const aphorisms: string[] = [
  "Three seconds of discharge undoes seventy-four days of construction.",
  "You are not resisting forever. You are resisting for twenty minutes. The wave always passes.",
  "Every man who has tremendous will and magnetic personality has large ojas stored up. — Vivekananda",
  "Repression is a sealed vessel with no channel. Transmutation is a sealed vessel with a turbine.",
  "The flatline is the factory floor torn up and rebuilt. Production will resume. At higher capacity.",
  "The energy does not ask your permission to transform you. It only asks for a channel.",
  "Twelve loops compound daily. Each day easier than the last. Relapse resets all twelve.",
  "You have never experienced your own baseline. You have been in permanent deficit since puberty.",
  "Five civilizations. Zero contact. Identical conclusion. This is not culture. This is physics.",
  "The generative energy, which, when we are loose, dissipates and makes us unclean, when we are continent invigorates and inspires us. — Thoreau",
  "If retention makes you rigid, judgmental, or isolated, you are doing it wrong. The test is always: more love, not less.",
  "D2 receptors upregulate. The world becomes vivid. This is not philosophy. This is receptor pharmacology.",
  "The retained man is not denying himself pleasure. He is choosing the ocean over the puddle.",
  "The depth of your shame is the measure of the height of your aspiration. What hurts most is what matters most.",
  "Your body already knows how to retain. Stop overriding its wisdom and start listening to its intelligence.",
  "You have [X] mornings left. How many do you want to spend in fog?",
  "The streak is a metric. The mastery is the identity. Metrics reset. Identity ratchets forward.",
  "A purpose too small for your energy will overflow into compulsion. Dream bigger than your current capacity. Retention will fund the difference.",
  "Conserve the seed. Transform the energy. Serve the world. Know thyself.",
  "Begin.",
  "Where compulsion was, there sovereignty shall be.",
  "You are not fighting your body. You are remembering what your body already knows.",
  "74 days to build. 3 seconds to destroy.",
];

export function getAphorismForDay(dayNumber: number): string {
  const index = (dayNumber - 1) % aphorisms.length;
  return aphorisms[index];
}

export function getRandomAphorism(): string {
  return aphorisms[Math.floor(Math.random() * aphorisms.length)];
}
