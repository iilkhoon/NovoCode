"use client";
import { useEffect, useRef, useState } from "react";
import { ImagePlus, Mic, Type } from "lucide-react";
import { PromptBox } from "@/components/PromptBox";
import { EXAMPLES, HERO_STATS, TYPEWRITER } from "./data";
import { useStartProject } from "./useStart";

export const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4";

const TRUST = [
  { icon: Type, label: "Yazı ilə", lift: "group-hover:-translate-y-0.5", z: "z-[1]" },
  { icon: Mic, label: "Səslə", lift: "group-hover:-translate-y-1", z: "z-[2]" },
  { icon: ImagePlus, label: "Şəkildən", lift: "group-hover:-translate-y-0.5", z: "z-[4]" },
];

function BackgroundVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      return;
    }
    v.play().catch(() => {});
    const onVis = () => (document.hidden ? v.pause() : v.play().catch(() => {}));
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-black">
      <video ref={ref} className="pointer-events-none absolute inset-0 size-full object-cover" autoPlay muted loop playsInline preload="auto">
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>
      {/* keeps the prompt legible and hands off to the black sections below */}
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-b from-transparent to-black" />
    </div>
  );
}

/** Counts up from 0 once the value scrolls into view (easeOutCubic). */
function CountUp({ target, decimals, suffix, index }: { target: number; decimals: number; suffix: string; index: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let raf = 0;
    let timer: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const duration = 1500 + index * 80;
        timer = setTimeout(() => {
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            setValue(target * (1 - Math.pow(1 - t, 3)));
            if (t < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        }, 480 + index * 90);
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [target, index]);
  return (
    <span ref={ref} className="text-[clamp(18px,2.2vw,26px)] font-medium leading-tight tracking-[-0.025em] text-white tabular-nums">
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function Hero() {
  const { start, starting } = useStartProject();
  const [value, setValue] = useState("");

  return (
    <section id="başla" className="relative isolate flex min-h-svh scroll-mt-0 flex-col items-center px-[clamp(14px,3vw,32px)] pb-[clamp(16px,2.4vh,28px)] pt-[calc(clamp(16px,2.4vh,28px)+72px)]">
      <BackgroundVideo />

      <div className="relative z-[1] flex w-full max-w-[900px] flex-1 flex-col items-center justify-center py-8 text-center">
        {/* trust row */}
        <div className="nv-anim group mb-[clamp(16px,2.5vh,26px)] inline-flex items-center [--ts:clamp(36px,4.5vw,42px)] max-[420px]:[--ts:34px]" style={{ "--d": "0.05s" } as React.CSSProperties}>
          {TRUST.map(({ icon: Icon, label, lift, z }, i) => (
            <span
              key={label}
              title={label}
              className={`relative size-[var(--ts)] shrink-0 rounded-full border border-white/40 bg-pill p-[5px] transition-transform duration-[350ms] ease-[var(--ease-out-expo)] ${lift} ${z} ${i ? "-ml-[calc(var(--ts)*0.42)]" : ""}`}
            >
              <span className="grid size-full place-items-center rounded-full bg-white text-[#111]">
                <Icon className="size-[calc(var(--ts)*0.34)]" strokeWidth={2.2} aria-hidden />
              </span>
            </span>
          ))}
          <span className="relative z-0 -ml-[calc(var(--ts)*0.42)] inline-flex h-[var(--ts)] items-center whitespace-nowrap rounded-full border border-white/40 bg-pill pl-[calc(var(--ts)*0.58)] pr-4 text-[clamp(12px,1.4vw,13.5px)] font-medium text-ink-300 max-[720px]:text-[12px]">
            Azərbaycan dilində AI sayt qurucusu
          </span>
        </div>

        {/* headline — dot-matrix, solid white */}
        <h1 className="max-w-full overflow-hidden whitespace-nowrap font-display text-[clamp(30px,6.6vw,84px)] font-normal leading-[1.12] tracking-[-0.04em] text-white max-[720px]:text-[clamp(34px,10vw,64px)] max-[720px]:leading-[1.05] max-[720px]:tracking-[-0.06em] max-[420px]:leading-[1.04]">
          <span className="nv-line" style={{ "--d": "0.12s" } as React.CSSProperties}>
            Sözlə de,
          </span>
          <span className="nv-line" style={{ "--d": "0.3s" } as React.CSSProperties}>
            sayt doğulsun.
          </span>
        </h1>

        <p
          className="nv-anim mt-[clamp(14px,2.2vh,22px)] max-w-[min(540px,92%)] text-[clamp(15.5px,1.55vw,18.5px)] leading-[1.55] text-ink-200"
          style={{ "--d": "0.28s" } as React.CSSProperties}
        >
          <span className="opacity-80">
            Fikrinizi Azərbaycan dilində yazın, deyin və ya şəklini atın. Novo dizaynı, kodu və məlumat bazasını qurur — xətaları özü tapıb düzəldir.
          </span>
        </p>

        {/* the real CTA: the prompt itself */}
        <div className="nv-anim nv-pulse mt-[clamp(20px,3.2vh,32px)] w-full max-w-[640px] text-left" style={{ "--d": "0.4s" } as React.CSSProperties}>
          <PromptBox size="lg" typewriter={TYPEWRITER} value={value} onValueChange={setValue} busy={starting} onSubmit={({ text, images, styleId }) => start(text, images, styleId)} />
          <div className="mt-3.5 flex flex-wrap justify-center gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                type="button"
                onClick={() => setValue(ex.prompt)}
                className="rounded-full border border-white/15 bg-black/35 px-3.5 py-1.5 text-[12.5px] text-ink-300 backdrop-blur-sm transition-[color,border-color,background-color] duration-200 hover:border-white/40 hover:bg-black/50 hover:text-white"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* stats */}
      <ul aria-label="Novo Code rəqəmlərlə" className="relative z-[1] grid w-full max-w-[920px] shrink-0 grid-cols-4 gap-[clamp(12px,2vw,24px)] pb-[clamp(4px,1vh,10px)] max-[720px]:grid-cols-2 max-[720px]:gap-y-[clamp(14px,2.4vh,22px)]">
        {HERO_STATS.map((s, i) => (
          <li key={s.label} className="nv-anim flex flex-col items-center gap-[clamp(4px,0.8vh,8px)] text-center" style={{ "--d": `${0.5 + i * 0.08}s` } as React.CSSProperties}>
            <span aria-hidden className="font-display text-[clamp(22px,3vw,33px)] leading-none text-white">
              {s.glyph}
            </span>
            <CountUp target={s.target} decimals={s.decimals} suffix={s.suffix} index={i} />
            <span className="whitespace-nowrap text-[clamp(11px,1.2vw,12.5px)] text-ink-400">{s.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
