interface Props {
  onClose: () => void;
}

const TEN_SENTENCES = [
  "Your body spends 74 days and extraordinary metabolic resources transforming food through seven refinement stages into reproductive essence — the most informationally dense substance you produce, containing the complete blueprint for a new human being.",
  "Ejaculation destroys in three seconds what took 74 days to build; retention preserves it, and the body — finding no external use for this terminal output — redirects its constituents toward internal renovation: brain, immune system, endocrine system, every organ, every cell.",
  "Chronic ejaculation, especially combined with pornography, hijacks the brain's dopamine system through supranormal stimulation → receptor downregulation → baseline collapse → progressive inability to enjoy anything → escalation → addiction architecture identical to cocaine or heroin at the neural level.",
  "Retention reverses this: receptor upregulation → sensitivity restoration → the world becomes vivid, music rich, food flavorful, work engaging, people fascinating — not because anything external changed but because your brain can finally FEEL again.",
  "Five civilizations with zero contact — Vedic India, Taoist China, Classical Greece, Vajrayana Tibet, the Christian Desert — independently discovered the identical principle: conserve this substance, redirect its energy, and the human organism transforms toward its maximum expression.",
  "The energy does not disappear when retained — it MUST be channeled: upward through the spine via breath and meditation, outward through the heart via creative work and service, downward through the legs via physical exercise — all three channels active, always.",
  "Twelve self-amplifying feedback loops make retention progressively easier: better sleep → higher testosterone → easier retention; dopamine sensitivity → more pleasure from life → less craving; creative output → purpose → meaning → no need to escape.",
  "The practice propagates through seventeen levels of organization simultaneously — from mitochondrial efficiency to connectomic topology to hormonal optimization to identity transformation to relationship deepening to civilizational contribution.",
  "The protocol: Morning (breathwork + meditation + cold + purpose), Midday (vigorous exercise), Evening (screens off + analog + sleep optimization), Always (mula bandha, whole food nutrition, digital hygiene, accountability).",
  "Conserve the seed; transform the energy; serve the world; know thyself.",
];

const SEVEN_CHAINS = [
  { label: 'DOPAMINERGIC', chain: 'Retention → D2↑ → sensitivity restored → anhedonia reversed → motivation redirects to purpose → life becomes vivid' },
  { label: 'ENDOCRINE', chain: 'Retention → pregnenolone freed → T↑ + DHEA↑ + neurosteroids↑ + cortisol normalized → mood + energy + cognition + immunity ALL optimized' },
  { label: 'NEUROPLASTIC', chain: 'Retention → old pathways weaken → new pathways strengthen → 90 days → connectomic remodeling → identity transforms → retention becomes nature' },
  { label: 'METABOLIC', chain: 'Retention → Zn + Se + choline + SAM + carnitine + phospholipids conserved → every enzyme, membrane, methylation reaction benefits' },
  { label: 'AUTONOMIC', chain: 'Retention → cortisol↓ → vagal tone↑ → HRV↑ → polyvagal social engagement → calm confidence → presence → magnetism' },
  { label: 'FEEDBACK', chain: 'Each day of retention strengthens 12 positive loops → each loop strengthens every other → practice accelerates → gets easier, never harder' },
  { label: 'VERTICAL', chain: 'Retention propagates: quantum → molecular → cellular → organ → system → organism → behavior → psychology → relationship → profession → generation → civilization' },
];

export function BladeModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0A] overflow-y-auto animate-fade-in-fast">
      <div className="max-w-2xl mx-auto p-5 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-[#0A0A0A] py-3 z-10">
          <h1 className="text-xl font-bold text-[#D4A017] tracking-wide">THE BLADE</h1>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#666] hover:text-[#E8E8E8] hover:bg-[#1E1E1E] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Ten Sentences */}
        <div className="space-y-4 mb-10">
          {TEN_SENTENCES.map((sentence, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-[#8B6914] text-xs font-bold mt-1 flex-shrink-0 w-6 text-right">
                {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][i]}.
              </span>
              <p className="text-sm text-[#E8E8E8] leading-relaxed">{sentence}</p>
            </div>
          ))}
        </div>

        {/* Seven Chains */}
        <div className="mb-10">
          <h2 className="text-sm font-bold tracking-widest text-[#D4A017] uppercase mb-4">
            THE SEVEN CHAINS
          </h2>
          <div className="space-y-3">
            {SEVEN_CHAINS.map((c, i) => (
              <div key={i} className="rounded-lg bg-[#141414] border border-[#1E1E1E] p-3">
                <div className="text-xs font-bold text-[#8B6914] tracking-wider mb-1">
                  CHAIN {i + 1} — {c.label}
                </div>
                <p className="text-xs text-[#9A9A9A] font-mono leading-relaxed">{c.chain}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Compressed Protocol */}
        <div className="mb-8">
          <h2 className="text-sm font-bold tracking-widest text-[#D4A017] uppercase mb-4">
            THE PROTOCOL
          </h2>
          <div className="rounded-lg bg-[#141414] border border-[#1E1E1E] p-4 space-y-2 font-mono text-xs text-[#9A9A9A]">
            <p><span className="text-[#D4A017]">MORNING:</span>  Breathe (20m) → Meditate (20m) → Cold (3m) → Purpose (2m)</p>
            <p><span className="text-[#D4A017]">MIDDAY:</span>   Exercise hard (45-60m, rotate: lift/sprint/yoga/martial/nature)</p>
            <p><span className="text-[#D4A017]">EVENING:</span>  Screens off 9PM → Analog → Pranayama → Mula bandha → Sleep by 10</p>
            <p><span className="text-[#D4A017]">ALWAYS:</span>   Whole food + fasting 16:8 + digital hygiene + accountability</p>
            <p><span className="text-[#B82020]">EMERGENCY:</span> Breath → Bandha → Leave → Pushups → Cold → Call someone</p>
          </div>
        </div>
      </div>
    </div>
  );
}
