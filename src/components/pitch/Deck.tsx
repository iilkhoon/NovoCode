"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Download, Maximize2, Minus, Play } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { GradientBackdrop } from "@/components/ui/GradientBackdrop";
import { TemplatePreview } from "@/components/landing/TemplatePreview";
import { TEMPLATES, PLANS } from "@/components/landing/data";
import { DECK, MODEL_DEFAULTS, SOURCES, T, formatAzn, marketSize, tr, unitEconomics, type PitchLang } from "@/lib/pitch";
import { cn } from "@/lib/cn";

const SW = 1600;
const SH = 900;

type Ctx = { lang: PitchLang };

/* ───────────────────────── building blocks ───────────────────────── */

function Frame({ children, dark, className }: { children: React.ReactNode; dark?: boolean; className?: string }) {
  return (
    <div className={cn("relative h-full w-full overflow-hidden px-[110px] py-[90px]", dark ? "bg-[#0b0b12] text-white" : "bg-[#f7f7f8] text-[#0b0b12]", className)}>
      {children}
    </div>
  );
}

function Kicker({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={cn("flex items-center gap-4 font-label text-[17px] uppercase tracking-[0.18em]", dark ? "text-white/60" : "text-[#6447ff]")}>
      <span className={cn("h-px w-12", dark ? "bg-white/30" : "bg-[#6447ff]/40")} />
      {children}
    </div>
  );
}

function Title({ children, className }: { children: string; className?: string }) {
  return <h2 className={cn("mt-7 whitespace-pre-line font-display text-[76px] font-[650] leading-[1.02] tracking-[-0.035em]", className)}>{children}</h2>;
}

function Foot({ n, total, dark }: { n: number; total: number; dark?: boolean }) {
  return (
    <div className={cn("absolute inset-x-[110px] bottom-[44px] flex items-center justify-between font-label text-[14px] tracking-[0.12em]", dark ? "text-white/40" : "text-[#0b0b12]/35")}>
      <span className="flex items-center gap-3">
        <LogoMark className="size-6" /> NOVOCODE · {DECK.company.toUpperCase()}
      </span>
      <span>
        {String(n).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
    </div>
  );
}

function SourceNote({ keys, lang }: { keys: (keyof typeof SOURCES)[]; lang: PitchLang }) {
  return (
    <p className="absolute bottom-[86px] left-[110px] right-[110px] text-[13px] leading-relaxed text-[#0b0b12]/40">
      {tr(T.ui.source, lang)}:{" "}
      {keys.map((k, i) => (
        <span key={k}>
          <a href={SOURCES[k].url} target="_blank" rel="noreferrer" className="underline decoration-dotted underline-offset-2 hover:text-[#6447ff]">
            {SOURCES[k].label}
          </a>
          {i < keys.length - 1 ? " · " : ""}
        </span>
      ))}
    </p>
  );
}

function Slider({ label, value, min, max, step, onChange, format }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; format: (v: number) => string }) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between text-[20px]">
        <span className="text-[#0b0b12]/60">{label}</span>
        <span className="font-display text-[30px] font-[650] tabular-nums">{format(value)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="pitch-range mt-3 w-full"
        style={{ "--p": `${((value - min) / (max - min)) * 100}%` } as React.CSSProperties}
      />
    </label>
  );
}

/* ───────────────────────── slides ───────────────────────── */

function Cover({ lang }: Ctx) {
  return (
    <Frame dark className="flex flex-col justify-center">
      <div aria-hidden className="absolute inset-0">
        <GradientBackdrop bg="#0b0b12" reach={1} intensity={1.1} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b12] via-transparent to-transparent" />
      </div>
      <div className="relative">
        <div className="flex items-center gap-4">
          <LogoMark className="size-14" />
          <span className="font-display text-[34px] font-[650] tracking-[-0.02em]">
            Novo<span className="text-white/50">code</span>
          </span>
        </div>
        <div className="mt-16"><Kicker dark>{tr(T.cover.kicker, lang)}</Kicker></div>
        <h1 className="mt-8 whitespace-pre-line font-display text-[124px] font-[650] leading-[0.98] tracking-[-0.045em]">{tr(T.cover.title, lang)}</h1>
        <p className="mt-10 max-w-[900px] text-[30px] leading-[1.4] text-white/70">{tr(T.cover.sub, lang)}</p>
        <p className="mt-16 font-label text-[16px] uppercase tracking-[0.16em] text-white/50">
          {DECK.founder} · {DECK.company} · {DECK.year}
        </p>
      </div>
    </Frame>
  );
}

function Problem({ lang }: Ctx) {
  return (
    <Frame>
      <Kicker>{tr(T.problem.kicker, lang)}</Kicker>
      <Title>{tr(T.problem.title, lang)}</Title>
      <div className="mt-20 grid grid-cols-3 gap-8">
        {T.problem.points.map((p, i) => (
          <div key={i} className="rounded-[32px] border border-black/[0.06] bg-white p-10 shadow-[0_20px_50px_-30px_rgb(0_0_0/0.25)]">
            <div className="font-display text-[52px] font-[650] leading-none tracking-[-0.03em] text-brand">{tr(p.big, lang)}</div>
            <p className="mt-6 text-[23px] leading-[1.45] text-[#0b0b12]/65">{tr(p.text, lang)}</p>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function Solution({ lang }: Ctx) {
  return (
    <Frame>
      <div className="grid h-full grid-cols-[1fr_700px] items-center gap-20">
        <div>
          <Kicker>{tr(T.solution.kicker, lang)}</Kicker>
          <Title className="text-[58px]">{tr(T.solution.title, lang)}</Title>
          <ol className="mt-14 space-y-6">
            {T.solution.steps.map((s, i) => (
              <li key={i} className="flex items-start gap-5 text-[25px] leading-snug">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand font-display text-[19px] font-[650] text-white">{i + 1}</span>
                <span className="pt-1.5">{tr(s, lang)}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="overflow-hidden rounded-[28px] border border-black/[0.08] bg-white shadow-[0_40px_90px_-40px_rgb(40_20_120/0.45)]">
          <div className="flex h-11 items-center gap-2 border-b border-black/[0.06] px-5">
            {[0, 1, 2].map((i) => <span key={i} className="size-3 rounded-full bg-black/10" />)}
            <span className="ml-4 font-label text-[13px] text-black/40">demle.novocode.app</span>
          </div>
          <div className="aspect-[4/3]"><TemplatePreview t={TEMPLATES[0]} /></div>
        </div>
      </div>
    </Frame>
  );
}

function Product({ lang }: Ctx) {
  return (
    <Frame>
      <Kicker>{tr(T.product.kicker, lang)}</Kicker>
      <Title className="text-[64px]">{tr(T.product.title, lang)}</Title>
      <div className="mt-14 grid grid-cols-4 gap-5">
        {T.product.features.map((f, i) => (
          <div key={i} className="rounded-[26px] border border-black/[0.06] bg-white p-7">
            <span className="grid size-10 place-items-center rounded-xl bg-[#6447ff]/10 text-[#6447ff]"><Check className="size-5" /></span>
            <div className="mt-5 text-[23px] font-semibold tracking-[-0.01em]">{tr(f.t, lang)}</div>
            <p className="mt-2 text-[18px] leading-snug text-[#0b0b12]/55">{tr(f.d, lang)}</p>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function WhyNow({ lang }: Ctx) {
  return (
    <Frame>
      <Kicker>{tr(T.whyNow.kicker, lang)}</Kicker>
      <Title>{tr(T.whyNow.title, lang)}</Title>
      <div className="mt-16 grid grid-cols-3 gap-8">
        {T.whyNow.stats.map((s) => (
          <div key={s.v} className="border-t-2 border-[#0b0b12] pt-8">
            <div className="font-display text-[96px] font-[650] leading-none tracking-[-0.045em]">{s.v}</div>
            <p className="mt-5 text-[22px] leading-snug text-[#0b0b12]/60">{tr(s.l, lang)}</p>
          </div>
        ))}
      </div>
      <p className="mt-16 max-w-[1150px] text-[26px] leading-[1.45]">{tr(T.whyNow.note, lang)}</p>
      <SourceNote keys={["lovableRound", "lovableArr", "datareportal"]} lang={lang} />
    </Frame>
  );
}

function Market({ lang }: Ctx) {
  const [adoption, setAdoption] = useState(MODEL_DEFAULTS.adoption);
  const [arpu, setArpu] = useState(MODEL_DEFAULTS.arpu);
  const { customers, annual } = marketSize(MODEL_DEFAULTS.smes, adoption, arpu);
  return (
    <Frame>
      <div className="grid h-full grid-cols-[1fr_620px] gap-20">
        <div>
          <Kicker>{tr(T.market.kicker, lang)}</Kicker>
          <Title className="text-[68px]">{tr(T.market.title, lang)}</Title>
          <div className="mt-14 flex items-end gap-5">
            <span className="font-display text-[150px] font-[650] leading-[0.85] tracking-[-0.05em] text-brand">{formatAzn(annual)}</span>
          </div>
          <p className="mt-6 text-[26px] text-[#0b0b12]/60">
            {tr(T.market.result, lang)} · {customers.toLocaleString("en-US")} {tr(T.market.customers, lang)}
          </p>
          <p className="mt-12 max-w-[700px] text-[22px] leading-snug">{tr(T.market.next, lang)}</p>
        </div>
        <div className="self-center rounded-[32px] border border-black/[0.06] bg-white p-10 shadow-[0_20px_50px_-30px_rgb(0_0_0/0.25)]">
          <div className="flex items-baseline justify-between text-[20px]">
            <span className="text-[#0b0b12]/60">{tr(T.market.smes, lang)}</span>
            <span className="font-display text-[30px] font-[650]">{MODEL_DEFAULTS.smes.toLocaleString("en-US")}</span>
          </div>
          <div className="my-8 h-px bg-black/[0.06]" />
          <div className="space-y-9">
            <Slider label={tr(T.market.adoption, lang)} value={adoption} min={0.5} max={10} step={0.5} onChange={setAdoption} format={(v) => `${v}%`} />
            <Slider label={tr(T.market.arpu, lang)} value={arpu} min={10} max={80} step={1} onChange={setArpu} format={(v) => `${v} ₼`} />
          </div>
          <p className="mt-8 rounded-2xl bg-[#6447ff]/[0.07] px-5 py-3 text-[16px] text-[#6447ff]">{tr(T.ui.assumption, lang)}</p>
        </div>
      </div>
      <SourceNote keys={["sme"]} lang={lang} />
    </Frame>
  );
}

function Model({ lang }: Ctx) {
  const [price, setPrice] = useState(MODEL_DEFAULTS.price);
  const [msgs, setMsgs] = useState(MODEL_DEFAULTS.msgsPerUser);
  const [cost, setCost] = useState(MODEL_DEFAULTS.aiCostPerMsg);
  const u = unitEconomics(price, msgs, cost);
  return (
    <Frame>
      <Kicker>{tr(T.model.kicker, lang)}</Kicker>
      <Title className="text-[60px]">{tr(T.model.title, lang)}</Title>
      <div className="mt-12 grid grid-cols-[1fr_560px] gap-12">
        <div>
          <div className="grid grid-cols-3 gap-5">
            {PLANS.map((p) => (
              <div key={p.name} className={cn("rounded-[26px] border bg-white p-7", p.highlight ? "border-[#6447ff]/50 shadow-[0_20px_50px_-25px_rgb(100_71_255/0.5)]" : "border-black/[0.06]")}>
                <div className="text-[22px] font-semibold">{p.name}</div>
                <div className="mt-3 font-display text-[54px] font-[650] leading-none tracking-[-0.03em]">
                  {p.price.monthly}
                  <span className="ml-1 text-[22px] text-black/40">₼/ay</span>
                </div>
                <div className="mt-4 text-[17px] text-[#6447ff]">{p.credits}</div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[21px] leading-snug text-[#0b0b12]/60">{tr(T.model.extra, lang)}</p>
        </div>
        <div className="rounded-[32px] border border-black/[0.06] bg-white p-9">
          <div className="space-y-7">
            <Slider label={tr(T.model.price, lang)} value={price} min={9} max={99} step={1} onChange={setPrice} format={(v) => `${v} ₼`} />
            <Slider label={tr(T.model.msgs, lang)} value={msgs} min={20} max={500} step={10} onChange={setMsgs} format={(v) => `${v}`} />
            <Slider label={tr(T.model.cost, lang)} value={cost} min={0.005} max={0.2} step={0.005} onChange={setCost} format={(v) => `${v.toFixed(3)} ₼`} />
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-black/[0.06] pt-7">
            <div>
              <div className="text-[17px] text-black/50">{tr(T.model.perUser, lang)}</div>
              <div className="font-display text-[40px] font-[650]">{formatAzn(u.cost)}</div>
            </div>
            <div>
              <div className="text-[17px] text-black/50">{tr(T.model.margin, lang)}</div>
              <div className={cn("font-display text-[40px] font-[650]", u.margin >= 0.6 ? "text-[#0f9d6b]" : u.margin >= 0.3 ? "text-[#c58a00]" : "text-[#e5484d]")}>{Math.round(u.margin * 100)}%</div>
            </div>
          </div>
          <p className="mt-5 text-[15px] text-[#6447ff]">{tr(T.ui.assumption, lang)}</p>
        </div>
      </div>
    </Frame>
  );
}

function Compete({ lang }: Ctx) {
  return (
    <Frame>
      <Kicker>{tr(T.compete.kicker, lang)}</Kicker>
      <Title className="text-[64px]">{tr(T.compete.title, lang)}</Title>
      <div className="mt-12 overflow-hidden rounded-[28px] border border-black/[0.06] bg-white">
        <div className="grid grid-cols-[1.8fr_repeat(5,1fr)] border-b border-black/[0.06] text-[19px] font-semibold">
          <div className="px-8 py-5" />
          {T.compete.cols.map((c, i) => (
            <div key={i} className={cn("px-4 py-5 text-center", i === 0 && "bg-[#6447ff]/[0.07] text-[#6447ff]")}>{tr(c, lang)}</div>
          ))}
        </div>
        {T.compete.rows.map((r, ri) => (
          <div key={ri} className="grid grid-cols-[1.8fr_repeat(5,1fr)] border-b border-black/[0.06] text-[21px] last:border-0">
            <div className="px-8 py-5">{tr(r.l, lang)}</div>
            {r.v.map((v, i) => (
              <div key={i} className={cn("grid place-items-center", i === 0 && "bg-[#6447ff]/[0.07]")}>
                {v ? <Check className={cn("size-7", i === 0 ? "text-[#6447ff]" : "text-black/70")} /> : <Minus className="size-6 text-black/20" />}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Frame>
  );
}

function Gtm({ lang }: Ctx) {
  return (
    <Frame>
      <Kicker>{tr(T.gtm.kicker, lang)}</Kicker>
      <Title>{tr(T.gtm.title, lang)}</Title>
      <div className="mt-16 grid grid-cols-2 gap-6">
        {T.gtm.items.map((it, i) => (
          <div key={i} className="flex items-start gap-6 rounded-[28px] border border-black/[0.06] bg-white p-9">
            <span className="font-display text-[44px] font-[650] leading-none text-brand">0{i + 1}</span>
            <div>
              <div className="text-[28px] font-semibold tracking-[-0.01em]">{tr(it.t, lang)}</div>
              <p className="mt-2 text-[21px] text-[#0b0b12]/55">{tr(it.d, lang)}</p>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function Roadmap({ lang }: Ctx) {
  return (
    <Frame>
      <Kicker>{tr(T.roadmap.kicker, lang)}</Kicker>
      <Title>{tr(T.roadmap.title, lang)}</Title>
      <div className="relative mt-20 grid grid-cols-4 gap-6">
        <div className="absolute left-0 right-0 top-[11px] h-[3px] rounded-full bg-gradient-to-r from-[#3b82f6] via-[#c04cfd] to-[#ff9a5a]" />
        {T.roadmap.phases.map((p, i) => (
          <div key={i} className="relative">
            <span className={cn("block size-[25px] rounded-full border-[5px] border-[#f7f7f8]", i === 0 ? "bg-[#6447ff]" : "bg-[#0b0b12]/25")} />
            <div className="mt-7 font-label text-[16px] uppercase tracking-[0.14em] text-[#6447ff]">{tr(p.when, lang)}</div>
            <ul className="mt-5 space-y-3">
              {p.items[lang].map((it) => (
                <li key={it} className="text-[22px] leading-snug">{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function Team({ lang }: Ctx) {
  return (
    <Frame className="flex flex-col">
      <Kicker>{tr(T.team.kicker, lang)}</Kicker>
      <Title>{tr(T.team.title, lang)}</Title>
      <div className="mt-16 flex items-center gap-10 rounded-[32px] border border-black/[0.06] bg-white p-10">
        <span className="grid size-36 shrink-0 place-items-center rounded-full bg-brand font-display text-[56px] font-[650] text-white">
          {DECK.founder.split(" ").map((w) => w[0]).join("")}
        </span>
        <div>
          <div className="font-display text-[48px] font-[650] tracking-[-0.03em]">{DECK.founder}</div>
          <div className="mt-2 text-[24px] text-[#0b0b12]/55">{tr(T.team.role, lang)} · {DECK.company}</div>
          <div className="mt-4 font-label text-[17px] text-[#6447ff]">{DECK.contact}</div>
        </div>
      </div>
      <p className="mt-10 text-[24px] text-[#0b0b12]/60">{tr(T.team.hiring, lang)}</p>
    </Frame>
  );
}

function Ask({ lang }: Ctx) {
  return (
    <Frame dark>
      <div aria-hidden className="absolute inset-0 opacity-70">
        <GradientBackdrop bg="#0b0b12" reach={0.7} />
      </div>
      <div className="relative grid h-full grid-cols-[1fr_560px] gap-20">
        <div>
          <Kicker dark>{tr(T.ask.kicker, lang)}</Kicker>
          <Title className="text-[64px]">{tr(T.ask.title, lang)}</Title>
          <div className="mt-16 flex gap-16">
            <div>
              <div className="font-label text-[15px] uppercase tracking-[0.14em] text-white/50">{tr(T.ask.raising, lang)}</div>
              <div className="mt-3 font-display text-[64px] font-[650] tracking-[-0.03em]">{DECK.ask.amount}</div>
              <div className="text-[20px] text-white/60">{tr(DECK.ask.instrument, lang)}</div>
            </div>
            <div>
              <div className="font-label text-[15px] uppercase tracking-[0.14em] text-white/50">{tr(T.ask.runway, lang)}</div>
              <div className="mt-3 font-display text-[64px] font-[650] tracking-[-0.03em]">{tr(DECK.ask.runway, lang)}</div>
            </div>
          </div>
          <a href="/app" className="mt-16 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-[22px] font-semibold text-[#0b0b12] print:hidden">
            <Play className="size-5 fill-current" /> {tr(T.ask.cta, lang)}
          </a>
        </div>
        <div className="self-center rounded-[32px] border border-white/10 bg-white/[0.06] p-10 backdrop-blur-xl">
          <div className="font-label text-[15px] uppercase tracking-[0.14em] text-white/50">{tr(T.ask.use, lang)}</div>
          <div className="mt-8 flex h-4 overflow-hidden rounded-full">
            {DECK.useOfFunds.map((u, i) => (
              <span key={i} style={{ width: `${u.share}%`, background: ["#6447ff", "#c04cfd", "#ff5c8a", "#ff9a5a"][i] }} />
            ))}
          </div>
          <ul className="mt-8 space-y-5">
            {DECK.useOfFunds.map((u, i) => (
              <li key={i} className="flex items-center gap-4 text-[22px]">
                <span className="size-3.5 rounded-full" style={{ background: ["#6447ff", "#c04cfd", "#ff5c8a", "#ff9a5a"][i] }} />
                <span className="flex-1 text-white/80">{tr(u.label, lang)}</span>
                <span className="font-display font-[650]">{u.share}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Frame>
  );
}

const SLIDES: { C: (p: Ctx) => React.ReactNode; dark?: boolean }[] = [
  { C: Cover, dark: true },
  { C: Problem },
  { C: Solution },
  { C: Product },
  { C: WhyNow },
  { C: Market },
  { C: Model },
  { C: Compete },
  { C: Gtm },
  { C: Roadmap },
  { C: Team },
  { C: Ask, dark: true },
];

/* ───────────────────────── deck shell ───────────────────────── */

export function Deck() {
  const [i, setI] = useState(0);
  const [lang, setLang] = useState<PitchLang>("az");
  const [scale, setScale] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const total = SLIDES.length;

  const go = useCallback((n: number) => setI(Math.max(0, Math.min(total - 1, n))), [total]);

  // restore slide + language from the URL hash (#3, #en-3)
  useEffect(() => {
    const read = () => {
      const m = location.hash.match(/^#(?:(az|en)-)?(\d+)$/);
      if (m) {
        setLang((m[1] as PitchLang) ?? "az");
        setI(Math.max(0, Math.min(total - 1, Number(m[2]) - 1)));
      }
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, [total]);
  useEffect(() => {
    history.replaceState(null, "", `#${lang === "en" ? "en-" : ""}${i + 1}`);
  }, [i, lang]);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(Math.min(e.contentRect.width / SW, e.contentRect.height / SH)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      if (["ArrowRight", "PageDown", " "].includes(e.key)) (e.preventDefault(), go(i + 1));
      else if (["ArrowLeft", "PageUp"].includes(e.key)) (e.preventDefault(), go(i - 1));
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(total - 1);
      else if (e.key.toLowerCase() === "f") toggleFull();
      else if (e.key.toLowerCase() === "p" && !e.metaKey && !e.ctrlKey) window.print();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [i, go, total]);

  // swipe on phones and tablets
  const touch = useRef<number | null>(null);

  return (
    <div className="pitch-root fixed inset-0 flex flex-col bg-[#e9e9ee] text-[#0b0b12] dark:bg-[#050507]">
      <header className="flex h-14 shrink-0 items-center gap-3 px-4 sm:px-6 print:hidden">
        <a href="/" className="flex items-center gap-2 font-display text-[17px] font-[650] tracking-[-0.02em] dark:text-white">
          <LogoMark className="size-7" /> <span className="max-sm:hidden">Novocode</span>
          <span className="rounded-full bg-black/[0.06] px-2.5 py-0.5 font-sans text-[12px] font-medium text-black/60 dark:bg-white/10 dark:text-white/60">{tr(T.nav, lang)}</span>
        </a>
        <span className="ml-auto hidden font-label text-[11.5px] text-black/40 lg:inline dark:text-white/40">{tr(T.ui.keys, lang)}</span>
        <div className="flex rounded-full bg-black/[0.06] p-0.5 text-[12.5px] font-medium dark:bg-white/10">
          {(["az", "en"] as const).map((l) => (
            <button key={l} onClick={() => setLang(l)} className={cn("rounded-full px-3 py-1 uppercase transition-colors", lang === l ? "bg-white text-black shadow-sm" : "text-black/50 dark:text-white/60")}>
              {l}
            </button>
          ))}
        </div>
        <button onClick={() => window.print()} className="grid size-9 place-items-center rounded-full text-black/60 hover:bg-black/[0.06] dark:text-white/60 dark:hover:bg-white/10" title={tr(T.ui.print, lang)} aria-label={tr(T.ui.print, lang)}>
          <Download className="size-[18px]" />
        </button>
        <button onClick={toggleFull} className="grid size-9 place-items-center rounded-full text-black/60 hover:bg-black/[0.06] dark:text-white/60 dark:hover:bg-white/10" title={tr(T.ui.full, lang)} aria-label={tr(T.ui.full, lang)}>
          <Maximize2 className="size-[18px]" />
        </button>
        <a href="/app" className="rounded-full bg-[#0b0b12] px-4 py-2 text-[13px] font-semibold text-white dark:bg-white dark:text-black">{tr(T.ui.demo, lang)} →</a>
      </header>

      <div
        ref={stage}
        className="pitch-stage relative min-h-0 flex-1"
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touch.current === null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1));
          touch.current = null;
        }}
      >
        {SLIDES.map(({ C }, n) => (
          <section
            key={n}
            aria-roledescription="slide"
            aria-label={`${n + 1} / ${total}`}
            aria-hidden={n !== i}
            className={cn("pitch-slide absolute left-1/2 top-1/2 overflow-hidden rounded-[18px] shadow-[0_30px_80px_-30px_rgb(0_0_0/0.35)] transition-opacity duration-300", n === i ? "opacity-100" : "pointer-events-none opacity-0")}
            style={{ width: SW, height: SH, transform: `translate(-50%, -50%) scale(${scale || 0.0001})` }}
          >
            <C lang={lang} />
            <Foot n={n + 1} total={total} dark={SLIDES[n].dark} />
          </section>
        ))}
      </div>

      <footer className="flex h-14 shrink-0 items-center justify-center gap-4 print:hidden">
        <button onClick={() => go(i - 1)} disabled={i === 0} aria-label="Əvvəlki" className="grid size-9 place-items-center rounded-full bg-white text-black shadow-sm disabled:opacity-30">
          <ChevronLeft className="size-5" />
        </button>
        <div className="flex items-center gap-1.5">
          {SLIDES.map((_, n) => (
            <button key={n} onClick={() => go(n)} aria-label={`${n + 1}`} className={cn("h-1.5 rounded-full transition-all duration-300", n === i ? "w-7 bg-[#6447ff]" : "w-1.5 bg-black/20 hover:bg-black/40 dark:bg-white/25")} />
          ))}
        </div>
        <button onClick={() => go(i + 1)} disabled={i === total - 1} aria-label="Növbəti" className="grid size-9 place-items-center rounded-full bg-white text-black shadow-sm disabled:opacity-30">
          <ChevronRight className="size-5" />
        </button>
      </footer>
    </div>
  );
}

function toggleFull() {
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  else document.documentElement.requestFullscreen().catch(() => {});
}
