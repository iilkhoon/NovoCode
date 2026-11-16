/**
 * Investor deck content. Everything shown on /pitch lives here so the founder can
 * edit numbers before a meeting without touching layout code.
 *
 * Rules for this file:
 *  - Facts carry a `source`. Estimates and assumptions are labelled as such.
 *  - Values wrapped in [brackets] are placeholders the founder must fill in.
 */

export type PitchLang = "az" | "en";
type L = Record<PitchLang, string>;

export interface Source {
  label: string;
  url: string;
}

export const SOURCES = {
  datareportal: { label: "DataReportal, Digital 2025: Azerbaijan", url: "https://datareportal.com/reports/digital-2025-azerbaijan" },
  sme: { label: "Report.az — Dövlət Vergi Xidməti məlumatı", url: "https://report.az/en/business/number-of-smes-in-azerbaijan-up-74-since-2018-kobia-says" },
  lovableRound: { label: "TechRepublic — Lovable $400M, $13.3B", url: "https://www.techrepublic.com/de/article/news-lovable-400m-funding-13-3b-valuation/" },
  lovableArr: { label: "Startup Fortune — Lovable $500M run-rate", url: "https://startupfortune.com/lovables-500-million-run-rate-makes-vibe-coding-harder-to-dismiss/" },
} satisfies Record<string, Source>;

export const DECK = {
  company: "Nova Group Azerbaijan",
  founder: "İlkin Rızayev",
  contact: "salam@novocode.az",
  year: "2026",
  /** What we are raising — fill in before the meeting. */
  ask: { amount: "[məbləğ]", instrument: { az: "[SAFE / pay]", en: "[SAFE / equity]" } as L, runway: { az: "18 ay", en: "18 months" } as L },
  useOfFunds: [
    { share: 40, label: { az: "Məhsul və AI infrastrukturu", en: "Product & AI infrastructure" } as L },
    { share: 30, label: { az: "Böyümə və marketinq", en: "Growth & marketing" } as L },
    { share: 20, label: { az: "Komanda", en: "Team" } as L },
    { share: 10, label: { az: "Hüquqi, ödəniş, server", en: "Legal, payments, servers" } as L },
  ],
};

/** Defaults for the interactive market + unit-economics slides. All are assumptions. */
export const MODEL_DEFAULTS = {
  smes: 822_000, // SME taxpayers (source: sme)
  adoption: 3, // % of SMEs paying for NovoCode within 3 years — assumption
  arpu: 35, // ₼ / month blended across Pro and Business — assumption
  aiCostPerMsg: 0.04, // ₼ per message, measured in admin → Usage once live — assumption
  msgsPerUser: 180, // messages a paying user sends per month — assumption
  price: 29, // Pro, ₼ / month
};

export const T = {
  nav: { az: "Təqdimat", en: "Pitch" },
  cover: {
    kicker: { az: "İnvestor təqdimatı", en: "Investor presentation" },
    title: { az: "Bir cümlə yaz,\nsayt hazırdır.", en: "Write one sentence.\nYour site is ready." },
    sub: {
      az: "Azərbaycan dilində danışan AI sayt qurucusu — kiçik biznes üçün, manatla.",
      en: "The AI website builder that speaks Azerbaijani — for small businesses, priced in manat.",
    },
  },
  problem: {
    kicker: { az: "Problem", en: "Problem" },
    title: { az: "Kiçik biznesin saytı\nya bahadır, ya da gecikir.", en: "For a small business, a website\nis either expensive or late." },
    points: [
      { big: "1 500–5 000 ₼", text: { az: "veb agentlikdə sadə sayt (Bakı, təxmini)", en: "for a simple agency site (Baku, estimate)" } },
      { big: { az: "3–8 həftə", en: "3–8 weeks" }, text: { az: "ilk versiyanı görənə qədər", en: "until the first version" } },
      { big: "EN · USD", text: { az: "qlobal AI alətləri ingiliscə və dollarla, yerli ödəniş yoxdur", en: "global AI builders are English-only, USD-priced, no local payments" } },
    ],
  },
  solution: {
    kicker: { az: "Həll", en: "Solution" },
    title: { az: "Danış — Novo qurur,\nyayımlayır, dəstəkləyir.", en: "Talk — Novo builds,\npublishes and maintains it." },
    steps: [
      { az: "Ana dilində təsvir et (yaz, de və ya şəkil at)", en: "Describe it in your language (type, speak or drop a screenshot)" },
      { az: "AI plan qurur, kodu yazır, xətanı özü düzəldir", en: "AI plans, writes the code and fixes its own errors" },
      { az: "Söhbətlə dəyiş: “başlığı qısalt”, “rezervasiya əlavə et”", en: "Edit by chatting: “shorter headline”, “add booking”" },
      { az: "Bir kliklə yayımla — ünvan, QR kod, öz domenin", en: "Publish in one click — link, QR code, your own domain" },
    ],
  },
  product: {
    kicker: { az: "Məhsul — bu gün işləyir", en: "Product — working today" },
    title: { az: "Lovable səviyyəsində studiya,\nyerli bazar üçün.", en: "A Lovable-grade studio,\nbuilt for the local market." },
    features: [
      { t: { az: "Canlı önizləmə", en: "Live preview" }, d: { az: "Kod brauzerdə işləyir — server xərci yoxdur", en: "Code runs in the browser — no server cost" } },
      { t: { az: "Qur · Planla · Söhbət", en: "Build · Plan · Chat" }, d: { az: "Üç rejim, hər cavabdan sonra təkliflər", en: "Three modes, suggestions after every reply" } },
      { t: { az: "Elementi seç və dəyiş", en: "Pick & edit" }, d: { az: "Önizləmədə klikləyib dəyişiklik istə", en: "Click any element in the preview and ask" } },
      { t: { az: "4 dil", en: "4 languages" }, d: { az: "Azərbaycan, türk, rus, ingilis", en: "Azerbaijani, Turkish, Russian, English" } },
      { t: { az: "Çoxlu AI provayder", en: "Multi-provider AI" }, d: { az: "Admin paneldən model və xərc idarəsi", en: "Models and cost managed from admin" } },
      { t: { az: "Yayım + QR", en: "Publishing + QR" }, d: { az: "ad.novocode.app ünvanında canlı sayt", en: "Live at name.novocode.app" } },
      { t: { az: "GitHub və saytdan idxal", en: "GitHub & URL import" }, d: { az: "Mövcud layihəni gətir, davam et", en: "Bring an existing project, keep going" } },
      { t: { az: "Kod sizindir", en: "You own the code" }, d: { az: "React + Tailwind, ZIP kimi yüklə", en: "React + Tailwind, download as ZIP" } },
    ],
  },
  whyNow: {
    kicker: { az: "Niyə indi", en: "Why now" },
    title: { az: "Kateqoriya artıq\nsübut olunub.", en: "The category\nis proven." },
    stats: [
      { v: "$13.3B", l: { az: "Lovable dəyəri, avqust 2026", en: "Lovable valuation, Aug 2026" }, src: "lovableRound" },
      { v: "$500M+", l: { az: "Lovable illik gəlir tempi, 2026 ortası", en: "Lovable revenue run-rate, mid-2026" }, src: "lovableArr" },
      { v: "9.23M", l: { az: "Azərbaycanda internet istifadəçisi (89%)", en: "internet users in Azerbaijan (89%)" }, src: "datareportal" },
    ],
    note: {
      az: "Qlobal liderlər ingilis dilli bazara fokuslanıb. Azərbaycan, Türkiyə və MDB-nin türk/rus dilli kiçik biznesi hələ boşdur.",
      en: "Global leaders focus on English-speaking markets. Turkic- and Russian-speaking small businesses in Azerbaijan, Türkiye and the CIS are still underserved.",
    },
  },
  market: {
    kicker: { az: "Bazar", en: "Market" },
    title: { az: "Yalnız Azərbaycanla başlayırıq.", en: "We start with Azerbaijan alone." },
    smes: { az: "KOS (vergi ödəyicisi)", en: "SMEs (taxpayers)" },
    adoption: { az: "3 ildə ödənişli istifadəçi payı", en: "Paying share within 3 years" },
    arpu: { az: "Orta aylıq gəlir / müştəri", en: "Avg. monthly revenue / customer" },
    result: { az: "İllik gəlir potensialı", en: "Annual revenue potential" },
    customers: { az: "ödənişli müştəri", en: "paying customers" },
    next: { az: "Sonra: Türkiyə və Mərkəzi Asiya — məhsul artıq türk və rus dilindədir.", en: "Next: Türkiye and Central Asia — the product already speaks Turkish and Russian." },
  },
  model: {
    kicker: { az: "Biznes modeli", en: "Business model" },
    title: { az: "Freemium → abunə.\nAI xərci hər mesajda ölçülür.", en: "Freemium → subscription.\nAI cost is metered per message." },
    price: { az: "Plan qiyməti", en: "Plan price" },
    msgs: { az: "Mesaj / ay", en: "Messages / month" },
    cost: { az: "AI xərci / mesaj", en: "AI cost / message" },
    margin: { az: "Brüt marja", en: "Gross margin" },
    perUser: { az: "AI xərci / istifadəçi", en: "AI cost / user" },
    extra: { az: "Əlavə gəlir: kredit paketləri, öz domen, agentlik planı, şablon mağazası.", en: "Extra revenue: credit packs, custom domains, agency plan, template store." },
  },
  compete: {
    kicker: { az: "Rəqabət", en: "Competition" },
    title: { az: "Eyni texnologiya —\nyerli üstünlük.", en: "Same technology —\nlocal advantage." },
    cols: ["NovoCode", "Lovable", "Bolt", "v0", { az: "Agentlik", en: "Agency" }],
    rows: [
      { l: { az: "Azərbaycan dilində interfeys və dəstək", en: "Azerbaijani interface and support" }, v: [true, false, false, false, true] },
      { l: { az: "Manatla qiymət, yerli ödəniş", en: "Priced in AZN, local payments" }, v: [true, false, false, false, true] },
      { l: { az: "Dəqiqələr içində sayt", en: "A site in minutes" }, v: [true, true, true, true, false] },
      { l: { az: "Söhbətlə dəyişiklik", en: "Edits by chat" }, v: [true, true, true, true, false] },
      { l: { az: "Yerli dəstək və hostinq", en: "Local support & hosting" }, v: [true, false, false, false, true] },
    ],
  },
  gtm: {
    kicker: { az: "Bazara çıxış", en: "Go-to-market" },
    title: { az: "Kiçik biznesin olduğu yerdə.", en: "Where small businesses already are." },
    items: [
      { t: { az: "“Made with Novo” nişanı", en: "“Made with Novo” badge" }, d: { az: "Hər pulsuz sayt yeni istifadəçi gətirir", en: "Every free site brings new users" } },
      { t: { az: "Instagram və TikTok", en: "Instagram & TikTok" }, d: { az: "“60 saniyədə sayt” videoları, Azərbaycan dilində", en: "“A site in 60 seconds” videos in Azerbaijani" } },
      { t: { az: "Tərəfdaşlar", en: "Partners" }, d: { az: "Banklar, KOBİA, kovorkinqlər, mühasiblər", en: "Banks, SME agency, coworkings, accountants" } },
      { t: { az: "Agentliklər", en: "Agencies" }, d: { az: "Freelancer və agentliklər üçün komanda planı", en: "Team plan for freelancers and agencies" } },
    ],
  },
  roadmap: {
    kicker: { az: "Yol xəritəsi", en: "Roadmap" },
    title: { az: "Növbəti 12 ay.", en: "The next 12 months." },
    phases: [
      { when: { az: "İndi", en: "Now" }, items: { az: ["Studiya, yayım, QR", "4 dil, admin, xərc ölçümü", "GitHub / URL idxalı"], en: ["Studio, publishing, QR", "4 languages, admin, cost metering", "GitHub / URL import"] } },
      { when: { az: "1–3 ay", en: "Months 1–3" }, items: { az: ["Açıq beta, ilk 1 000 istifadəçi", "Yerli ödəniş (Payriff / Epoint)", "Öz domen qoşulması"], en: ["Open beta, first 1,000 users", "Local payments (Payriff / Epoint)", "Custom domains"] } },
      { when: { az: "4–8 ay", en: "Months 4–8" }, items: { az: ["Mobil tətbiq (iOS / Android)", "Onlayn mağaza və rezervasiya modulları", "Agentlik planı"], en: ["Mobile app (iOS / Android)", "Store and booking modules", "Agency plan"] } },
      { when: { az: "9–12 ay", en: "Months 9–12" }, items: { az: ["Türkiyə və Mərkəzi Asiya", "Şablon mağazası", "Öz AI modelimiz (xərc ↓)"], en: ["Türkiye and Central Asia", "Template store", "Own fine-tuned model (cost ↓)"] } },
    ],
  },
  team: {
    kicker: { az: "Komanda", en: "Team" },
    title: { az: "Nova Group Azerbaijan", en: "Nova Group Azerbaijan" },
    role: { az: "Təsisçi", en: "Founder" },
    hiring: { az: "İşə alırıq: AI mühəndisi, böyümə meneceri, dəstək", en: "Hiring: AI engineer, growth lead, support" },
  },
  ask: {
    kicker: { az: "Sərmayə", en: "The ask" },
    title: { az: "Azərbaycanın AI sayt\nplatformasını birlikdə quraq.", en: "Let’s build the region’s\nAI website platform together." },
    raising: { az: "Cəlb edirik", en: "Raising" },
    runway: { az: "Müddət", en: "Runway" },
    use: { az: "Vəsaitin istifadəsi", en: "Use of funds" },
    cta: { az: "Canlı demoya keç", en: "Go to live demo" },
  },
  ui: {
    assumption: { az: "Fərziyyə — dəyişdirin", en: "Assumption — adjust" },
    source: { az: "Mənbə", en: "Source" },
    keys: { az: "← → keçid · F tam ekran · P PDF", en: "← → navigate · F fullscreen · P PDF" },
    print: { az: "PDF yüklə", en: "Download PDF" },
    full: { az: "Tam ekran", en: "Fullscreen" },
    demo: { az: "Demo", en: "Demo" },
  },
};

export function tr(v: L | string, lang: PitchLang): string {
  return typeof v === "string" ? v : v[lang];
}

/** Market + unit economics maths, kept pure so it is testable. */
export function marketSize(smes: number, adoptionPct: number, arpu: number) {
  const customers = Math.round(smes * (adoptionPct / 100));
  return { customers, annual: customers * arpu * 12 };
}

export function unitEconomics(price: number, msgs: number, costPerMsg: number) {
  const cost = msgs * costPerMsg;
  const margin = price > 0 ? (price - cost) / price : 0;
  return { cost, margin };
}

export function formatAzn(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M ₼`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k ₼`;
  return `${n.toFixed(n < 10 ? 2 : 0)} ₼`;
}
