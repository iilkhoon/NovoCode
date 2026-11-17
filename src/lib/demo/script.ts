/**
 * Scripted agent replies for demo mode (NOVO_DEMO).
 *
 * A live investor demo must not depend on a third-party AI being up. In demo
 * mode — always, or only as a fallback when the provider fails — the chat route
 * streams one of these replies in the exact protocol a real model uses, so the
 * studio plans, writes files, runs the preview and shows suggestions as usual.
 */

export type DemoIntent = "build" | "plan" | "chat" | "compact";

export interface DemoInput {
  intent: DemoIntent;
  prompt: string; // the latest user message
  firstPrompt: string; // the first user message of the project
  files: Record<string, string>;
}

const file = (path: string, body: string) => `<novo-file path="${path}">\n${body.trim()}\n</novo-file>\n`;

/** Brand name: the first quoted word in the prompt, else a sensible default. */
export function brandFrom(prompt: string) {
  const m = prompt.match(/['"“‘«]([^'"”’»]{2,30})['"”’»]/);
  return (m?.[1] ?? "Dəmlə").trim();
}

function css() {
  return `@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Fraunces", Georgia, serif;

  --color-background: oklch(0.97 0.015 75);
  --color-foreground: oklch(0.24 0.03 50);
  --color-muted: oklch(0.93 0.02 75);
  --color-muted-foreground: oklch(0.5 0.03 55);
  --color-primary: oklch(0.55 0.15 45);
  --color-primary-foreground: oklch(0.98 0.01 75);
  --color-accent: oklch(0.8 0.1 75);
  --color-border: oklch(0.88 0.02 70);
  --color-card: oklch(0.99 0.01 80);

  --radius-lg: 1.25rem;
}

html { scroll-behavior: smooth; }
body { font-family: var(--font-sans); -webkit-font-smoothing: antialiased; }`;
}

function header(name: string) {
  return `import { useState } from "react";
import { Menu as MenuIcon, X } from "lucide-react";

const LINKS = [
  ["Menyu", "#menyu"],
  ["Haqqımızda", "#haqqimizda"],
  ["Rezervasiya", "#rezervasiya"],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#" className="font-display text-2xl italic tracking-tight">${name.toLowerCase()}.</a>
        <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
          {LINKS.map(([l, h]) => <a key={h} href={h} className="transition-colors hover:text-foreground">{l}</a>)}
        </nav>
        <a href="#rezervasiya" className="hidden rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 md:inline-block">Masa sifarişi</a>
        <button onClick={() => setOpen(!open)} className="md:hidden" aria-label="Menyu">{open ? <X /> : <MenuIcon />}</button>
      </div>
      {open && (
        <nav className="flex flex-col gap-4 border-t border-border px-5 py-4 md:hidden">
          {LINKS.map(([l, h]) => <a key={h} href={h} onClick={() => setOpen(false)}>{l}</a>)}
        </nav>
      )}
    </header>
  );
}`;
}

function hero(name: string) {
  return `import { motion } from "motion/react";
import { Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-14 md:grid-cols-[1.1fr_0.9fr] md:pt-24">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Bakı · 2019-dan</p>
        <h1 className="mt-5 font-display text-5xl leading-[1.02] tracking-tight md:text-7xl">
          Hər qurtumda <em className="text-primary">isti</em> bir hekayə.
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
          ${name} — təzə qovrulmuş dənələr, ev şirniyyatları və şəhərin ən rahat küncləri.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a href="#menyu" className="rounded-full bg-primary px-7 py-3.5 font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:-translate-y-0.5">Menyuya bax</a>
          <a href="#rezervasiya" className="rounded-full border border-foreground/20 px-7 py-3.5 font-medium transition-colors hover:bg-foreground/5">Masa sifarişi</a>
        </div>
        <div className="mt-10 flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex text-accent">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="size-4 fill-current" />)}</div>
          4.9 · 320+ rəy
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.1 }} className="relative">
        <img src="https://img.novo/900x1100/latte-art-coffee-cup-on-wooden-table" alt="Latte art ilə kofe" className="aspect-[4/5] w-full rounded-[2rem] bg-primary/30 object-cover shadow-2xl" />
        <div className="absolute -bottom-6 -left-6 rounded-2xl bg-card p-4 shadow-xl">
          <p className="text-xs text-muted-foreground">Bu gün açığıq</p>
          <p className="font-display text-xl">08:00 – 23:00</p>
        </div>
      </motion.div>
    </section>
  );
}`;
}

function menu() {
  return `import { useState } from "react";

const MENU = {
  Kofe: [
    ["Espresso", "3,50", "espresso-shot-cup"],
    ["Kapuçino", "5,50", "cappuccino-foam-cup"],
    ["Flat white", "6,00", "flat-white-coffee"],
    ["Soyuq brü", "6,50", "cold-brew-coffee-glass"],
  ],
  Çay: [
    ["Armudu stəkanda çay", "2,50", "azerbaijani-tea-armudu-glass"],
    ["Matça latte", "7,00", "matcha-latte"],
    ["Zəncəfil-limon", "4,50", "ginger-lemon-tea"],
    ["Bitki çayı", "4,00", "herbal-tea-pot"],
  ],
  Şirniyyat: [
    ["Paxlava", "4,00", "baklava-dessert"],
    ["Şəkərbura", "3,50", "shekerbura-pastry"],
    ["Kruassan", "4,50", "butter-croissant"],
    ["Çizkeyk", "6,50", "cheesecake-slice"],
  ],
};

export default function Menu() {
  const [tab, setTab] = useState("Kofe");
  return (
    <section id="menyu" className="bg-muted/60 py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Menyu</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Bu gün nə içirik?</h2>
          </div>
          <div className="flex gap-1 rounded-full bg-card p-1 shadow-sm">
            {Object.keys(MENU).map((k) => (
              <button key={k} onClick={() => setTab(k)} className={"rounded-full px-5 py-2 text-sm transition-colors " + (tab === k ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}>{k}</button>
            ))}
          </div>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MENU[tab].map(([name, price, img]) => (
            <article key={name} className="group overflow-hidden rounded-[1.25rem] bg-card shadow-sm transition-shadow hover:shadow-xl">
              <div className="overflow-hidden">
                <img src={"https://img.novo/600x450/" + img} alt={name} className="aspect-[4/3] w-full bg-primary/20 object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="flex items-center justify-between p-5">
                <h3 className="font-medium">{name}</h3>
                <span className="font-display text-lg text-primary">{price} ₼</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}`;
}

function reservation() {
  return `import { useState } from "react";
import { CalendarCheck, Check } from "lucide-react";
import { db } from "@/lib/db";

export default function Reservation() {
  const [sent, setSent] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    db.collection("reservations").add(Object.fromEntries(new FormData(e.currentTarget)));
    setSent(true);
  };
  return (
    <section id="rezervasiya" className="mx-auto grid max-w-6xl gap-12 px-5 py-24 md:grid-cols-2">
      <div id="haqqimizda">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Rezervasiya</p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">Sizin üçün masa saxlayaq.</h2>
        <p className="mt-5 max-w-md text-muted-foreground">Nizami küçəsi 42, Bakı. Həftənin hər günü 08:00–23:00. Qruplar üçün 10 nəfərə qədər.</p>
        <img src="https://img.novo/900x600/cozy-coffee-shop-interior" alt="Kofe şopun interyeri" className="mt-8 aspect-[3/2] w-full rounded-[1.5rem] bg-primary/20 object-cover" />
      </div>
      <form onSubmit={submit} className="self-center rounded-[1.75rem] bg-card p-8 shadow-xl">
        {sent ? (
          <div className="py-12 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary/10 text-primary"><Check /></span>
            <h3 className="mt-5 font-display text-2xl">Masanız rezerv olundu!</h3>
            <p className="mt-2 text-muted-foreground">Təsdiq üçün sizə zəng edəcəyik.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            <input required name="name" placeholder="Adınız" className="rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" />
            <input required name="phone" type="tel" placeholder="+994 50 000 00 00" className="rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" />
            <div className="grid grid-cols-2 gap-4">
              <input required name="date" type="date" className="rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" />
              <select name="guests" className="rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary">
                {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => <option key={n}>{n} nəfər</option>)}
              </select>
            </div>
            <button className="mt-2 flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 font-medium text-primary-foreground transition-transform hover:-translate-y-0.5">
              <CalendarCheck className="size-5" /> Masa sifariş et
            </button>
          </div>
        )}
      </form>
    </section>
  );
}`;
}

function footer(name: string) {
  return `export default function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 text-sm text-muted-foreground">
        <span className="font-display text-xl italic text-foreground">${name.toLowerCase()}.</span>
        <span>Nizami küçəsi 42, Bakı · +994 12 000 00 00</span>
        <span>© ${new Date().getFullYear()} ${name}</span>
      </div>
    </footer>
  );
}`;
}

function reviews() {
  return `import { Star } from "lucide-react";

const REVIEWS = [
  ["Leyla M.", "Şəhərin ən yaxşı flat white-ı. Səhərlərim artıq burada başlayır."],
  ["Orxan Ə.", "İşləmək üçün sakit, Wi-Fi sürətli, paxlava isə nənəminki kimi."],
  ["Aynur H.", "Masanı onlayn sifariş etdim, gələndə hər şey hazır idi. Təşəkkürlər!"],
];

export default function Reviews() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Rəylər</p>
      <h2 className="mt-3 font-display text-4xl md:text-5xl">Qonaqlarımız nə deyir?</h2>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {REVIEWS.map(([who, text]) => (
          <figure key={who} className="rounded-[1.5rem] bg-card p-7 shadow-sm">
            <div className="flex text-accent">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="size-4 fill-current" />)}</div>
            <blockquote className="mt-4 leading-relaxed">“{text}”</blockquote>
            <figcaption className="mt-5 text-sm font-medium text-muted-foreground">{who}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}`;
}

function app(withReviews: boolean) {
  return `import Header from "./components/Header";
import Hero from "./components/Hero";
import Menu from "./components/Menu";
${withReviews ? 'import Reviews from "./components/Reviews";\n' : ""}import Reservation from "./components/Reservation";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Menu />
${withReviews ? "        <Reviews />\n" : ""}        <Reservation />
      </main>
      <Footer />
    </div>
  );
}`;
}

/** The full scripted reply for one turn, in the agent protocol. */
export function demoReply({ intent, prompt, firstPrompt, files }: DemoInput): string {
  const name = brandFrom(firstPrompt || prompt);
  if (intent === "compact") return `Layihə: ${name} kofe şopu saytı — hero, menyu (kofe/çay/şirniyyat), rezervasiya forması, footer. İsti, premium üslub.`;
  if (intent === "chat") {
    return `Yaxşı sual. ${name} saytı React və Tailwind ilə qurulub: hər bölmə ayrıca komponentdir, rezervasiyalar layihənin verilənlər bazasında saxlanılır. İstəsəniz növbəti addımda onlayn sifariş və ya rəylər bölməsi əlavə edə bilərəm.\n<novo-next>Rəylər bölməsi əlavə et | Onlayn sifariş qoş | Rəngləri tündləşdir</novo-next>`;
  }
  if (intent === "plan") {
    return `${name} üçün planım belədir:\n<novo-plan>\n1. İsti, premium üslub: krem fon, karamel aksent, Fraunces başlıqlar\n2. Hero — güclü başlıq, iki düymə, real foto, iş saatları\n3. Menyu — Kofe / Çay / Şirniyyat tabları, manatla qiymətlər, hər məhsula foto\n4. Masa rezervasiyası — ad, telefon, tarix, qonaq sayı; məlumat bazaya yazılır\n5. Haqqımızda və ünvan, footer\n6. Mobil üçün tam uyğun menyu və hamar animasiyalar\n</novo-plan>\nBaşlayım?\n<novo-next>Planı icra et | Planı dəyiş</novo-next>`;
  }

  const built = "src/components/Hero.jsx" in files;
  if (!built) {
    return (
      `Əla fikir — ${name} üçün isti, premium kofe üslubunda sayt qururam.\n` +
      `<novo-plan>\n1. Dizayn tokenləri: krem fon, karamel aksent, Fraunces başlıqlar\n2. Hero, menyu tabları və manatla qiymətlər\n3. Masa rezervasiyası forması (bazaya yazılır)\n4. Mobil menyu, footer və animasiyalar\n</novo-plan>\n` +
      file("src/index.css", css()) +
      file("src/components/Header.jsx", header(name)) +
      file("src/components/Hero.jsx", hero(name)) +
      file("src/components/Menu.jsx", menu()) +
      file("src/components/Reservation.jsx", reservation()) +
      file("src/components/Footer.jsx", footer(name)) +
      file("src/App.jsx", app(false)) +
      `Sayt hazırdır: menyu, qiymətlər və işlək masa rezervasiyası. Önizləmədə yoxlayın.\n<novo-next>Rəylər bölməsi əlavə et | Onlayn sifariş qoş | Rəngləri tündləşdir</novo-next>`
    );
  }
  if (!("src/components/Reviews.jsx" in files)) {
    return (
      `Rəylər bölməsini menyudan sonra əlavə edirəm.\n` +
      file("src/components/Reviews.jsx", reviews()) +
      file("src/App.jsx", app(true)) +
      `Hazırdır — üç real görünüşlü rəy və ulduz reytinqi.\n<novo-next>Onlayn sifariş qoş | Qalereya əlavə et | Yayımla</novo-next>`
    );
  }
  return `Bu dəyişikliyi demo rejimində göstərə bilmirəm — real AI qoşulanda istənilən dəyişikliyi edəcəyəm. Sayt yayıma hazırdır.\n<novo-next>Yayımla</novo-next>`;
}

/** Splits a reply into small chunks so it streams like a real model. */
export function* chunks(text: string, size = 24) {
  for (let i = 0; i < text.length; i += size) yield text.slice(i, i + size);
}

/** NOVO_DEMO: "1" / "always" → scripted replies only; "fallback" → only when the AI fails. */
export function demoMode(): "off" | "always" | "fallback" {
  const v = (process.env.NOVO_DEMO ?? "").toLowerCase();
  if (v === "1" || v === "true" || v === "always") return "always";
  if (v === "fallback") return "fallback";
  return "off";
}

/** What the model picker shows while scripted replies stand in for the AI. */
export const DEMO_MODEL = { id: "novo-demo", label: "Novo AI", vision: true, rank: 0 };
