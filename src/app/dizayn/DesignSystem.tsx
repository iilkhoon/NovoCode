"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Copy, Rocket, Sparkles } from "lucide-react";
import { Logo, LogoMark, Wordmark } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Badge, Eyebrow, Kbd } from "@/components/ui/badge";
import { Reveal, SpotlightCard, Magnetic } from "@/components/ui/motion";
import { toast } from "@/components/ui/toast";
import { PromptBox } from "@/components/PromptBox";
import { cn } from "@/lib/cn";

const BRAND = [
  { name: "nar-500", hex: "#ff3b5c", note: "Əsas brend rəngi" },
  { name: "nar-400", hex: "#ff5c7a", note: "Hover, vurğu" },
  { name: "saffron-500", hex: "#ff7a45", note: "Qradiyent ortası" },
  { name: "gold-500", hex: "#ffc24b", note: "Qradiyent sonu, xəbərdarlıq" },
  { name: "orchid-500", hex: "#c13ccf", note: "Aurora dərinliyi" },
  { name: "violet-500", hex: "#7c5cff", note: "Köməkçi soyuq ton" },
];
const INK = ["1000:#050408", "950:#08070c", "900:#0d0c13", "850:#121119", "800:#18171f", "700:#27252f", "600:#36333f", "500:#4f4b5a", "400:#6f6a7c", "300:#a6a1b2", "200:#cfcbd8", "100:#f4f2f7"];
const SEMANTIC = [
  { name: "success", hex: "#3ddc97" },
  { name: "warning", hex: "#ffc24b" },
  { name: "danger", hex: "#ff5470" },
  { name: "info", hex: "#6ea8ff" },
];

const NAV = ["Brend", "Rənglər", "Tipoqrafiya", "Komponentlər", "Hərəkət", "Prinsiplər"];

function copy(v: string) {
  navigator.clipboard.writeText(v).then(() => toast.success(`${v} kopyalandı`));
}

function Section({ id, title, text, children }: { id: string; title: string; text: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-white/6 py-16">
      <Reveal>
        <h2 className="font-display text-3xl font-semibold tracking-[-0.03em]">{title}</h2>
        <p className="mt-2 max-w-2xl text-ink-400">{text}</p>
      </Reveal>
      <div className="mt-10">{children}</div>
    </section>
  );
}

export function DesignSystem() {
  const [ease, setEase] = useState(false);
  return (
    <div className="relative">
      <header className="sticky top-0 z-40 border-b border-white/6 bg-ink-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-5">
          <Logo />
          <span className="hidden text-sm text-ink-400 sm:inline">Dizayn sistemi · Nar 2.0</span>
          <nav className="ml-auto hidden gap-1 lg:flex">
            {NAV.map((n) => (
              <a key={n} href={`#${n}`} className="rounded-full px-3 py-1.5 text-[13px] text-ink-300 transition hover:bg-white/5 hover:text-ink-100">
                {n}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5">
        <section className="relative py-20">
          <div aria-hidden className="absolute -top-20 left-0 -z-10 h-80 w-[600px] bg-[radial-gradient(closest-side,rgb(255_59_92/0.25),transparent)] blur-3xl" />
          <Eyebrow>
            <span className="rounded-full bg-nar-gradient px-2 py-0.5 text-[10px] font-semibold text-white">v2.0</span> Nar dizayn sistemi
          </Eyebrow>
          <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-7xl">
            Bir nar,<br />
            <span className="text-nar-gradient">min dənə.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-300">
            Nar Azərbaycanda bolluğun və bərəkətin simvoludur. Novo Code-un dizaynı da bu ideyadan doğur: bir platforma — saysız-hesabsız sayt. İsti
            qradiyent (nar → zəfəran → qızıl) dərin mürəkkəb fonda parlayır.
          </p>
        </section>

        <Section id="Brend" title="Brend" text="Loqo narın tacından və gövdəsindən ibarətdir; gövdədə qalın N hərfi var. 16px-dən 512px-ə qədər oxunaqlıdır.">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="grid aspect-square place-items-center rounded-3xl border border-white/8 bg-ink-900 md:col-span-1">
              <LogoMark className="size-40 drop-shadow-[0_30px_60px_rgb(255_59_92/0.4)]" />
            </div>
            <div className="grid gap-4 md:col-span-2 md:grid-cols-2">
              <div className="grid place-items-center rounded-3xl border border-white/8 bg-ink-900 p-8"><Logo /></div>
              <div className="grid place-items-center rounded-3xl bg-ink-100 p-8 text-ink-950"><div className="flex items-center gap-2"><LogoMark /><Wordmark className="[&>span]:text-ink-500" /></div></div>
              <div className="flex items-center justify-center gap-6 rounded-3xl border border-white/8 bg-ink-900 p-8">
                {[48, 32, 24, 16].map((s) => (
                  <div key={s} style={{ width: s, height: s }}>
                    <LogoMark className="size-full" />
                  </div>
                ))}
              </div>
              <div className="grid place-items-center rounded-3xl bg-nar-gradient p-8"><span className="font-display text-2xl font-semibold tracking-tight text-white">novo<span className="font-normal opacity-70">code</span></span></div>
            </div>
          </div>
        </Section>

        <Section id="Rənglər" title="Rənglər" text="Bütün rənglər Tailwind tokenləri kimi təyin olunub (bg-nar-500, text-ink-300…). Kopyalamaq üçün klikləyin.">
          <div className="mb-4 h-28 rounded-3xl bg-nar-gradient p-6 shadow-[var(--shadow-glow)]">
            <div className="font-display text-xl font-semibold text-white">bg-nar-gradient</div>
            <div className="text-sm text-white/80">120° · nar-500 → saffron-500 → gold-500</div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {BRAND.map((c) => (
              <button key={c.name} onClick={() => copy(c.hex)} className="group overflow-hidden rounded-2xl border border-white/8 text-left transition hover:-translate-y-1 hover:border-white/20">
                <div className="h-24" style={{ background: c.hex }} />
                <div className="bg-ink-900 p-3">
                  <div className="flex items-center justify-between text-sm font-medium">{c.name}<Copy className="size-3 text-ink-500 opacity-0 transition group-hover:opacity-100" /></div>
                  <div className="font-mono text-[11px] text-ink-400">{c.hex}</div>
                  <div className="mt-1 text-[11px] text-ink-500">{c.note}</div>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-8 text-sm font-medium text-ink-300">Ink — neytral tonlar (bənövşəyi çalarlı)</div>
          <div className="mt-3 grid grid-cols-6 overflow-hidden rounded-2xl border border-white/8 sm:grid-cols-12">
            {INK.map((x) => {
              const [n, hex] = x.split(":");
              return (
                <button key={n} onClick={() => copy(hex)} className="group h-24 p-2 text-left transition hover:scale-y-105" style={{ background: hex }}>
                  <span className={cn("block font-mono text-[10px]", +n <= 300 ? "text-ink-900" : "text-ink-300")}>{n}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SEMANTIC.map((c) => (
              <button key={c.name} onClick={() => copy(c.hex)} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-ink-900 p-3 text-left transition hover:border-white/20">
                <span className="size-9 rounded-xl" style={{ background: c.hex }} />
                <span><span className="block text-sm">{c.name}</span><span className="font-mono text-[11px] text-ink-400">{c.hex}</span></span>
              </button>
            ))}
          </div>
        </Section>

        <Section id="Tipoqrafiya" title="Tipoqrafiya" text="Unbounded — başlıqlar üçün cəsur, geniş; Onest — mətn üçün təmiz və oxunaqlı; JetBrains Mono — kod. Hər üçü Azərbaycan əlifbasını tam dəstəkləyir.">
          <div className="space-y-4">
            {[
              { cls: "font-display text-6xl font-semibold tracking-[-0.045em]", label: "Display · Unbounded 600 · -4.5%", t: "Şəkildən sayt" },
              { cls: "font-display text-4xl font-semibold tracking-[-0.04em]", label: "H2 · Unbounded 600 · -4%", t: "Xətanı özü düzəldir" },
              { cls: "font-display text-xl font-medium tracking-tight", label: "H3 · Unbounded 500", t: "Versiya tarixçəsi" },
              { cls: "text-lg leading-relaxed text-ink-300", label: "Body L · Onest 400", t: "Fikrinizi Azərbaycan dilində yazın — Novo qalanını edir." },
              { cls: "text-[14.5px] leading-relaxed text-ink-300", label: "Body · Onest 400", t: "Əə Ğğ Iı İi Öö Şş Çç Üü — hamısı mükəmməl görünür." },
              { cls: "font-mono text-sm text-ink-300", label: "Mono · JetBrains Mono", t: "<novo-file path=\"src/App.jsx\">" },
            ].map((x) => (
              <Reveal key={x.label} className="flex flex-col gap-2 rounded-2xl border border-white/6 p-5 sm:flex-row sm:items-baseline sm:gap-8">
                <span className="w-56 shrink-0 font-mono text-[11px] text-ink-500">{x.label}</span>
                <span className={x.cls}>{x.t}</span>
              </Reveal>
            ))}
          </div>
        </Section>

        <Section id="Komponentlər" title="Komponentlər" text="Bütün komponentlər src/components/ui qovluğundadır və bütün platformada eyni görünür.">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/8 bg-ink-900/60 p-6">
              <div className="mb-4 text-sm text-ink-400">Düymələr</div>
              <div className="flex flex-wrap items-center gap-3">
                <Button>Pulsuz başla <ArrowRight className="size-4" /></Button>
                <Button variant="white">Ağ</Button>
                <Button variant="secondary">İkinci dərəcəli</Button>
                <Button variant="outline">Kontur</Button>
                <Button variant="ghost">Şəffaf</Button>
                <Button size="sm"><Rocket className="size-3.5" /> Kiçik</Button>
                <Button size="lg">Böyük</Button>
                <Magnetic><Button variant="secondary">Maqnit ✨</Button></Magnetic>
              </div>
            </div>
            <div className="rounded-3xl border border-white/8 bg-ink-900/60 p-6">
              <div className="mb-4 text-sm text-ink-400">Nişanlar və klaviatura</div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge>Neytral</Badge>
                <Badge tone="nar">Nar</Badge>
                <Badge tone="success">Uğurlu</Badge>
                <Badge tone="gold">Tezliklə</Badge>
                <Eyebrow><Sparkles className="ml-2 size-3.5 text-gold-400" />Eyebrow</Eyebrow>
                <span className="flex items-center gap-1 text-sm text-ink-400"><Kbd>Ctrl</Kbd>+<Kbd>1</Kbd></span>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={() => toast.success("Uğurlu bildiriş")}>Toast: uğur</Button>
                <Button variant="secondary" size="sm" onClick={() => toast.error("Xəta bildirişi")}>Toast: xəta</Button>
                <Button variant="secondary" size="sm" onClick={() => toast.info("Məlumat bildirişi")}>Toast: info</Button>
              </div>
            </div>
            <SpotlightCard className="rounded-3xl border border-white/8 bg-ink-900/60 p-6">
              <div className="mb-2 text-sm text-ink-400">Spotlight kart</div>
              <p className="text-ink-200">Siçanı üzərində gəzdirin — işıq kursoru izləyir.</p>
            </SpotlightCard>
            <div className="rounded-3xl border border-white/8 bg-ink-900/60 p-6">
              <div className="mb-4 text-sm text-ink-400">Prompt qutusu</div>
              <PromptBox onSubmit={() => toast.info("Bu nümunədir")} placeholder="Yazın, səslə deyin və ya şəkil atın…" />
            </div>
          </div>
        </Section>

        <Section id="Hərəkət" title="Hərəkət" text="Animasiyalar məqsədlidir: məzmunu təqdim edir, diqqəti yönləndirir, heç vaxt yormur. prefers-reduced-motion hörmətlə qarşılanır.">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { n: "ease-out-expo", v: "cubic-bezier(0.16, 1, 0.3, 1)", d: "Görünmə, səhifə keçidləri", t: { duration: 1, ease: [0.16, 1, 0.3, 1] as const } },
              { n: "spring", v: "stiffness 400 · damping 32", d: "Tab/pill keçidləri, toggle", t: { type: "spring" as const, stiffness: 400, damping: 32 } },
              { n: "ease-spring", v: "cubic-bezier(0.34, 1.56, 0.64, 1)", d: "İkon hover, mikro-oyun", t: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] as const } },
            ].map((m) => (
              <button key={m.n} onClick={() => setEase((e) => !e)} className="rounded-3xl border border-white/8 bg-ink-900/60 p-6 text-left">
                <div className="h-14 rounded-2xl bg-white/[0.03] p-2">
                  <motion.div animate={{ x: ease ? "calc(100% * 4)" : 0 }} transition={m.t} className="size-10 rounded-xl bg-nar-gradient" />
                </div>
                <div className="mt-4 font-medium">{m.n}</div>
                <div className="font-mono text-[11px] text-ink-400">{m.v}</div>
                <div className="mt-1 text-xs text-ink-500">{m.d}</div>
              </button>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-ink-500">Kartlara klikləyin ↑</p>
        </Section>

        <Section id="Prinsiplər" title="Prinsiplər" text="Hər qərarı yoxlamaq üçün beş sual.">
          <div className="grid gap-4 md:grid-cols-5">
            {[
              ["Sadə", "Proqramçı olmayan biri 5 saniyədə başa düşürmü?"],
              ["Yerli", "Azərbaycan dilində təbii səslənirmi? ₼, +994, ə hərfi düzgündürmü?"],
              ["Canlı", "Hərəkət mənalıdırmı və istifadəçiyə nə baş verdiyini göstərirmi?"],
              ["Etibarlı", "Vəd etdiyimizi edirikmi? Uydurma rəy, saxta rəqəm yoxdur."],
              ["Gözəl", "Ekran görüntüsünü paylaşmaq istəyərdinizmi?"],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.06} className="rounded-3xl border border-white/8 bg-ink-900/60 p-5">
                <div className="font-mono text-xs text-nar-400">0{i + 1}</div>
                <div className="mt-3 font-display text-lg font-medium">{t}</div>
                <p className="mt-2 text-sm text-ink-400">{d}</p>
              </Reveal>
            ))}
          </div>
        </Section>
      </main>
      <footer className="border-t border-white/6 py-10 text-center text-xs text-ink-500">Novo Code · Nar 2.0 dizayn sistemi</footer>
    </div>
  );
}
