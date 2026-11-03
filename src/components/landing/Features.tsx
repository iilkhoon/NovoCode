"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Database, Download, History, ImageIcon, Lock, Mic, Monitor, ShoppingCart, Smartphone, Tablet, Wand2 } from "lucide-react";
import { Reveal, SpotlightCard, EASE } from "@/components/ui/motion";
import { SectionHeading } from "./SectionHeading";
import { cn } from "@/lib/cn";

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <SpotlightCard className={cn("group overflow-hidden rounded-3xl border border-white/8 bg-ink-900/70 transition-colors duration-500 hover:border-white/15", className)}>
      {children}
    </SpotlightCard>
  );
}

function CardText({ icon: Icon, title, text }: { icon: React.ComponentType<{ className?: string }>; title: string; text: string }) {
  return (
    <div className="relative p-6 sm:p-7">
      <div className="mb-4 grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-nar-400 transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-rotate-6 group-hover:scale-110">
        <Icon className="size-5" />
      </div>
      <h3 className="font-display text-lg font-medium tracking-tight">{title}</h3>
      <p className="mt-2 text-[14.5px] leading-relaxed text-ink-300">{text}</p>
    </div>
  );
}

/* ---- mini animations ---- */

function VoiceVisual() {
  const lines = ["Salam Novo! 👋", "Gözəllik salonum üçün sayt lazımdır.", "Randevu sistemi də olsun, çəhrayı tonlarda."];
  const [n, setN] = useState(1);
  useEffect(() => {
    const t = setInterval(() => setN((x) => (x % lines.length) + 1), 1800);
    return () => clearInterval(t);
  }, [lines.length]);
  return (
    <div className="relative mx-6 mb-6 h-48 overflow-hidden rounded-2xl border border-white/6 bg-ink-950/60 p-4 sm:mx-7">
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {lines.slice(0, n).map((l) => (
            <motion.div key={l} layout initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ ease: EASE, duration: 0.5 }} className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-ink-700 px-3 py-2 text-[13px]">
              {l}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-full border border-white/8 bg-ink-850 px-3 py-2">
        <span className="relative grid size-7 place-items-center rounded-full bg-nar-gradient">
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-nar-500/60" />
          <Mic className="relative size-3.5 text-white" />
        </span>
        <div className="flex h-6 flex-1 items-center gap-[3px]">
          {Array.from({ length: 36 }).map((_, i) => (
            <motion.span
              key={i}
              className="w-[3px] rounded-full bg-gradient-to-t from-nar-500 to-gold-400"
              animate={{ height: ["20%", `${30 + ((i * 37) % 70)}%`, "25%"] }}
              transition={{ duration: 0.9 + (i % 5) * 0.15, repeat: Infinity, ease: "easeInOut", delay: i * 0.03 }}
            />
          ))}
        </div>
        <span className="font-mono text-[11px] text-ink-400">az-AZ</span>
      </div>
    </div>
  );
}

function HealVisual() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPhase((p) => (p + 1) % 4), 1500);
    return () => clearInterval(t);
  }, []);
  const lines = [
    { c: "text-ink-400", t: "$ npm run dev" },
    { c: "text-ink-300", t: "VITE v6 ready in 412 ms" },
    ...(phase >= 1 ? [{ c: "text-danger", t: "✗ Failed to resolve import \"./Cart\"" }] : []),
    ...(phase >= 2 ? [{ c: "text-gold-400", t: "◆ Novo: səbəb tapıldı, Cart.jsx yaradılır…" }] : []),
    ...(phase >= 3 ? [{ c: "text-success", t: "✓ hmr update /src/App.jsx — xəta yoxdur" }] : []),
  ];
  return (
    <div className="mx-6 mb-6 h-40 rounded-2xl border border-white/6 bg-ink-950/80 p-4 font-mono text-[11.5px] leading-6 sm:mx-7">
      <AnimatePresence initial={false}>
        {lines.map((l) => (
          <motion.div key={l.t} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className={cn("truncate", l.c)}>
            {l.t}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function ScreenshotVisual() {
  return (
    <div className="relative mx-6 mb-6 h-40 sm:mx-7">
      <motion.div
        className="absolute left-0 top-2 w-[55%] rotate-[-6deg] rounded-xl border border-white/10 bg-white p-2 shadow-2xl"
        whileInView={{ rotate: -6 }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="mb-1.5 flex items-center gap-1 text-[8px] text-zinc-400"><ImageIcon className="size-2.5" /> ekran.png</div>
        <div className="space-y-1.5 rounded-md border-2 border-dashed border-zinc-300 p-2">
          <div className="h-2 w-2/3 rounded bg-zinc-300" />
          <div className="h-6 rounded bg-zinc-200" />
          <div className="grid grid-cols-3 gap-1">
            <div className="h-5 rounded bg-zinc-200" /><div className="h-5 rounded bg-zinc-200" /><div className="h-5 rounded bg-zinc-200" />
          </div>
        </div>
      </motion.div>
      <motion.div className="absolute left-[42%] top-[38%] z-10 grid size-9 place-items-center rounded-full bg-nar-gradient shadow-[var(--shadow-glow)]" animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 2, repeat: Infinity }}>
        <Wand2 className="size-4 text-white" />
      </motion.div>
      <motion.div
        className="absolute right-0 top-6 w-[55%] rotate-[4deg] overflow-hidden rounded-xl border border-white/10 bg-[#0f1020] shadow-2xl"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <div className="h-14 bg-[linear-gradient(120deg,#7c5cff,#ff3b5c)] p-2">
          <div className="h-1.5 w-1/2 rounded bg-white/80" />
          <div className="mt-1 h-1.5 w-1/3 rounded bg-white/50" />
        </div>
        <div className="grid grid-cols-3 gap-1 p-2">
          <div className="h-6 rounded bg-white/10" /><div className="h-6 rounded bg-white/10" /><div className="h-6 rounded bg-white/10" />
        </div>
      </motion.div>
    </div>
  );
}

function DevicesVisual() {
  const devices = [
    { icon: Monitor, w: "100%" },
    { icon: Tablet, w: "62%" },
    { icon: Smartphone, w: "34%" },
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % 3), 1800);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="mx-6 mb-6 sm:mx-7">
      <div className="mb-3 flex gap-1 rounded-lg bg-white/[0.04] p-1 w-fit">
        {devices.map((d, j) => (
          <span key={j} className={cn("grid size-7 place-items-center rounded-md transition", i === j ? "bg-white/10 text-ink-100" : "text-ink-400")}>
            <d.icon className="size-3.5" />
          </span>
        ))}
      </div>
      <div className="flex h-36 justify-center rounded-2xl border border-white/6 bg-ink-950/60 p-3">
        <motion.div animate={{ width: devices[i].w }} transition={{ type: "spring", stiffness: 120, damping: 18 }} className="overflow-hidden rounded-lg bg-[#f2f7fb] p-2">
          <div className="mb-2 flex justify-between"><div className="h-1.5 w-8 rounded bg-[#0d2a3f]" /><div className="h-1.5 w-5 rounded bg-[#1d8fd8]" /></div>
          <div className="h-1.5 w-3/4 rounded bg-[#0d2a3f]/80" />
          <div className="mt-1 h-1.5 w-1/2 rounded bg-[#0d2a3f]/40" />
          <div className={cn("mt-2 grid gap-1", i === 2 ? "grid-cols-1" : "grid-cols-3")}>
            <div className="h-8 rounded bg-white" /><div className="h-8 rounded bg-white" /><div className="h-8 rounded bg-white" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function FunctionalVisual() {
  const items = [
    { icon: Lock, t: "Qeydiyyat / giriş" },
    { icon: ShoppingCart, t: "Səbət və sifariş" },
    { icon: Database, t: "Məlumat bazası" },
    { icon: Check, t: "Formalar və rezerv" },
  ];
  return (
    <div className="mx-6 mb-6 grid grid-cols-2 gap-2 sm:mx-7">
      {items.map((x, i) => (
        <motion.div
          key={x.t}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, ease: EASE, duration: 0.6 }}
          className="flex items-center gap-2 rounded-xl border border-white/6 bg-ink-950/60 px-3 py-2.5 text-[12.5px] text-ink-200"
        >
          <x.icon className="size-3.5 text-success" />
          {x.t}
        </motion.div>
      ))}
    </div>
  );
}

function HistoryVisual() {
  const v = ["İlk versiya", "Rəngləri isti et", "Rezervasiya əlavə et", "Mobil menyu"];
  return (
    <div className="mx-6 mb-6 space-y-2 sm:mx-7">
      {v.map((x, i) => (
        <motion.div
          key={x}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.12, ease: EASE, duration: 0.6 }}
          className={cn("flex items-center gap-3 rounded-xl px-3 py-2 text-[12.5px]", i === 3 ? "bg-nar-500/10 text-ink-100 ring-1 ring-nar-500/30" : "text-ink-300")}
        >
          <span className={cn("size-2 rounded-full", i === 3 ? "bg-nar-400" : "bg-ink-500")} />
          v{i + 1} · {x}
          {i < 3 && <span className="ml-auto text-[11px] text-ink-400">Bərpa et</span>}
        </motion.div>
      ))}
    </div>
  );
}

export function Features() {
  return (
    <section id="imkanlar" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-28">
      <SectionHeading
        eyebrow="İmkanlar"
        title={<>Agentliyin işini görür.<br /><span className="text-ink-400">Söhbət sürətində.</span></>}
        text="Novo sadəcə şəkil çəkmir — dizayn sistemi qurur, kod yazır, paketləri yükləyir, işə salır və yoxlayır."
      />
      <div className="mt-16 grid gap-4 md:grid-cols-6">
        <Reveal className="md:col-span-4">
          <Card className="h-full">
            <CardText icon={Mic} title="Azərbaycan dilində yazın və ya danışın" text="Texniki terminlər lazım deyil. Mikrofonu basın və saytınızı danışaraq təsvir edin — Novo ana dilinizi anlayır." />
            <VoiceVisual />
          </Card>
        </Reveal>
        <Reveal className="md:col-span-2" delay={0.08}>
          <Card className="h-full">
            <CardText icon={Wrench2} title="Xətanı özü düzəldir" text="Terminalı oxuyur, səbəbi tapır, düzəldir. Siz heç nə görmürsünüz." />
            <HealVisual />
          </Card>
        </Reveal>
        <Reveal className="md:col-span-2">
          <Card className="h-full">
            <CardText icon={ImageIcon} title="Şəkildən sayt" text="Bəyəndiyiniz saytın ekran görüntüsünü və ya əl eskizini atın." />
            <ScreenshotVisual />
          </Card>
        </Reveal>
        <Reveal className="md:col-span-2" delay={0.08}>
          <Card className="h-full">
            <CardText icon={Monitor} title="Hər ekranda mükəmməl" text="Telefon, planşet, kompüter — bir kliklə yoxlayın." />
            <DevicesVisual />
          </Card>
        </Reveal>
        <Reveal className="md:col-span-2" delay={0.16}>
          <Card className="h-full">
            <CardText icon={Database} title="Görüntü yox — işlək məhsul" text="Formalar göndərilir, səbət hesablayır, istifadəçilər qeydiyyatdan keçir." />
            <FunctionalVisual />
          </Card>
        </Reveal>
        <Reveal className="md:col-span-3">
          <Card className="h-full">
            <CardText icon={History} title="Versiya tarixçəsi" text="Hər dəyişiklik yadda qalır. Bəyənmədiniz? Bir kliklə əvvəlki versiyaya qayıdın." />
            <HistoryVisual />
          </Card>
        </Reveal>
        <Reveal className="md:col-span-3" delay={0.08}>
          <Card className="h-full">
            <CardText icon={Download} title="Kod tamamilə sizindir" text="Təmiz React + Tailwind kodu. ZIP yükləyin, developerə verin, istənilən hostinqə qoyun. Heç bir kilid yoxdur." />
            <div className="mx-6 mb-6 overflow-hidden rounded-2xl border border-white/6 bg-ink-950/80 p-4 font-mono text-[11.5px] leading-6 sm:mx-7">
              <div><span className="text-[#c678dd]">export default function</span> <span className="text-[#61afef]">Hero</span>() {"{"}</div>
              <div className="pl-4"><span className="text-[#c678dd]">return</span> (</div>
              <div className="pl-8 text-ink-300">&lt;<span className="text-nar-300">section</span> <span className="text-gold-400">className</span>=<span className="text-success">&quot;py-28 bg-background&quot;</span>&gt;</div>
              <div className="pl-12 text-ink-300">&lt;<span className="text-nar-300">h1</span>&gt;Hər qurtumda isti hekayə&lt;/<span className="text-nar-300">h1</span>&gt;</div>
              <div className="pl-4">);</div>
              <div>{"}"}</div>
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}

function Wrench2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      <path d="m19 15 2 2-4 4" className="text-success" stroke="#3ddc97" />
    </svg>
  );
}
