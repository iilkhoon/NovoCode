/** Design style presets the user can attach to a request. */
export interface StylePreset {
  id: string;
  name: string;
  hint: string;
  swatch: [string, string, string];
  instruction: string;
}

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: "auto",
    name: "Avtomatik",
    hint: "AI biznesə uyğun seçsin",
    swatch: ["#ff3b5c", "#ff7a45", "#ffc24b"],
    instruction: "",
  },
  {
    id: "minimal",
    name: "Minimal",
    hint: "Ağ fon, çoxlu boşluq, sakit",
    swatch: ["#fafaf9", "#18181b", "#a1a1aa"],
    instruction: "Design style: refined minimalism — near-white background, black type, one restrained accent, generous whitespace, thin dividers, editorial grotesk typography (e.g. Onest/Inter Tight), subtle fade-in motion.",
  },
  {
    id: "luxury",
    name: "Lüks",
    hint: "Tünd, qızılı, zərif serif",
    swatch: ["#0c0a09", "#d4af37", "#f5f0e6"],
    instruction: "Design style: luxury — deep charcoal/near-black background, champagne-gold accent, elegant high-contrast serif display font (e.g. Playfair Display or Cormorant with Azerbaijani glyph support — fallback Fraunces), wide letter-spacing for labels, slow elegant reveal animations, full-bleed photography.",
  },
  {
    id: "vibrant",
    name: "Canlı",
    hint: "Parlaq rənglər, enerjili",
    swatch: ["#7c3aed", "#f43f5e", "#facc15"],
    instruction: "Design style: vibrant and playful — bold saturated palette, big rounded shapes, chunky display font (e.g. Unbounded), colorful gradients and stickers, bouncy spring micro-animations, oversized buttons.",
  },
  {
    id: "corporate",
    name: "Korporativ",
    hint: "Etibarlı, mavi, peşəkar",
    swatch: ["#0b1f3a", "#2563eb", "#e2e8f0"],
    instruction: "Design style: trustworthy corporate — navy and clean blue palette, crisp sans-serif (Inter), structured grid, data/number highlights, logos row, case-study cards, calm subtle motion.",
  },
  {
    id: "dark-tech",
    name: "Tünd Tech",
    hint: "Neon, qaranlıq, futuristik",
    swatch: ["#05050a", "#22d3ee", "#a855f7"],
    instruction: "Design style: dark tech — near-black background, neon cyan/violet glows, glassmorphism panels, grid/noise textures, monospace accents, animated gradient borders, glowing hover states.",
  },
  {
    id: "warm",
    name: "İsti / Təbii",
    hint: "Krem, terrakota, rahat",
    swatch: ["#f6efe6", "#c2410c", "#3f3f2e"],
    instruction: "Design style: warm and natural — cream/sand background, terracotta and olive accents, friendly serif headlines (Fraunces), rounded organic shapes, soft shadows, cozy photography.",
  },
];

export function applyStyle(prompt: string, styleId?: string) {
  const s = STYLE_PRESETS.find((x) => x.id === styleId);
  return s?.instruction ? `${prompt}\n\n[${s.name} üslub] ${s.instruction}` : prompt;
}
