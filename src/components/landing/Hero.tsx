"use client";
import { useEffect, useRef, useState } from "react";
import { PromptBox } from "@/components/PromptBox";
import { EXAMPLES, HERO_STATS, TYPEWRITER } from "./data";
import { useStartProject } from "./useStart";
import { GradientBackdrop } from "@/components/ui/GradientBackdrop";

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
        const duration = 1400 + index * 80;
        timer = setTimeout(() => {
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            setValue(target * (1 - Math.pow(1 - t, 3)));
            if (t < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        }, 500 + index * 90);
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
    <span ref={ref} className="font-display text-[clamp(26px,3vw,36px)] font-[650] leading-none tracking-[-0.03em] text-ink-100 tabular-nums">
      {value.toFixed(decimals)}
      <span className="text-[0.6em] text-ink-400">{suffix}</span>
    </span>
  );
}

export function Hero() {
  const { start, starting } = useStartProject();
  const [value, setValue] = useState("");

  return (
    <section id="başla" className="paper relative isolate flex min-h-svh flex-col items-center overflow-hidden px-4 pb-8 pt-28 sm:px-8">
      {/* signature aurora: warm light rising from the horizon */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <GradientBackdrop reach={0.9} />
        <div className="absolute inset-0 dot-grid opacity-50 [mask-image:radial-gradient(ellipse_70%_55%_at_50%_40%,black,transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-wool" />
      </div>

      <div className="relative flex w-full max-w-[860px] flex-1 flex-col items-center justify-center py-6 text-center">
        <div className="nv-anim inline-flex items-center gap-2.5 rounded-full border border-ink-100/10 bg-ink-1000/70 py-1.5 pl-2 pr-4 shadow-[var(--shadow-card)] backdrop-blur-md" style={{ "--d": "0.05s" } as React.CSSProperties}>
          <span className="rounded-full bg-ink-100 px-2 py-0.5 font-label text-[9.5px] font-medium uppercase tracking-[0.08em] text-ink-1000">Beta</span>
          <span className="text-[13px] text-ink-300">Azərbaycan dilində AI sayt qurucusu</span>
        </div>

        <h1 className="mt-7 font-display text-[clamp(34px,5.2vw,68px)] font-[600] leading-[1.04] tracking-[-0.03em] text-ink-100 ">
          <span className="nv-line" style={{ "--d": "0.12s" } as React.CSSProperties}>
            Bir cümlə yaz,
          </span>
          <span className="nv-line" style={{ "--d": "0.28s" } as React.CSSProperties}>
            <em className="not-italic text-brand pr-[0.04em]">sayt hazırdır.</em>
          </span>
        </h1>

        <p className="nv-anim mt-6 max-w-[540px] text-[clamp(15.5px,1.5vw,18px)] leading-[1.6] text-ink-400" style={{ "--d": "0.4s" } as React.CSSProperties}>
          Fikrinizi yazın, deyin və ya şəklini atın. NovoCode dizaynı, kodu və məlumat bazasını qurur — xətaları özü tapıb düzəldir.
        </p>

        <div className="nv-anim mt-9 w-full max-w-[660px] text-left" style={{ "--d": "0.5s" } as React.CSSProperties}>
          <PromptBox size="lg" typewriter={TYPEWRITER} value={value} onValueChange={setValue} busy={starting} onSubmit={({ text, images, styleId }) => start(text, images, styleId)} />
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                type="button"
                onClick={() => setValue(ex.prompt)}
                className="rounded-full border border-ink-100/10 bg-ink-1000/60 px-3.5 py-1.5 text-[13px] text-ink-300 backdrop-blur-sm transition-[color,border-color,background-color,transform] duration-200 hover:-translate-y-px hover:border-nar/40 hover:bg-ink-1000 hover:text-ink-100 active:scale-[0.97]"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ul aria-label="NovoCode rəqəmlərlə" className="relative grid w-full max-w-[880px] shrink-0 grid-cols-4 border-t border-ink-100/10 pt-6 max-[720px]:grid-cols-2 max-[720px]:gap-y-6">
        {HERO_STATS.map((s, i) => (
          <li key={s.label} className="nv-anim flex flex-col items-center gap-2 text-center" style={{ "--d": `${0.6 + i * 0.07}s` } as React.CSSProperties}>
            <CountUp target={s.target} decimals={s.decimals} suffix={s.suffix} index={i} />
            <span className="label-mono whitespace-nowrap text-ink-400">{s.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
