"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { Check, Loader2, Wrench } from "lucide-react";
import { LogoMark } from "@/components/Logo";

const PROMPT = "Dəmlə adlı kofe şopu üçün sayt qur: menyu, qiymətlər və masa rezervasiyası olsun.";
const FILES = ["src/index.css", "src/components/Header.jsx", "src/components/Hero.jsx", "src/components/Menu.jsx", "src/components/Reservation.jsx", "src/App.jsx"];
const ROWS = 14; // the preview is revealed in 14 steps

/** Scripted, looping product demo — the preview builds from the bottom up as files land. */
export function DemoWindow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-120px" });
  const [t, setT] = useState(0);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!inView) return;
    let step = 0;
    let char = 0;
    let timer: ReturnType<typeof setTimeout>;
    const run = () => {
      if (step === 0) {
        char++;
        setTyped(PROMPT.slice(0, char));
        if (char < PROMPT.length) return (timer = setTimeout(run, 26));
        step = 1;
        setT(1);
        return (timer = setTimeout(run, 600));
      }
      step++;
      setT(step);
      if (step >= 26) {
        timer = setTimeout(() => {
          step = 0;
          char = 0;
          setT(0);
          setTyped("");
          timer = setTimeout(run, 500);
        }, 4000);
        return;
      }
      timer = setTimeout(run, step < 8 ? 450 : 260);
    };
    timer = setTimeout(run, 400);
    return () => clearTimeout(timer);
  }, [inView]);

  const filesShown = Math.max(0, Math.min(FILES.length, t - 1));
  const filesDone = Math.max(0, Math.min(FILES.length, t - 2));
  const woven = Math.max(0, Math.min(ROWS, t - 8)); // rows revealed: steps 9..22
  const showError = t >= 15 && t < 18;
  const fixed = t >= 18;

  return (
    <div ref={ref} className="overflow-hidden rounded-[22px] border border-ink-100/10 bg-ink-1000 shadow-[var(--shadow-panel)]">
      <div className="flex h-10 items-center gap-3 border-b border-ink-100/10 px-4 font-mono text-[11px] text-ink-400">
        <LogoMark className="size-4" />
        <span className="text-ink-300">novocode.az/studio</span>
        <span className="ml-auto hidden sm:inline">Önizləmə · Kod · Terminal</span>
      </div>
      <div className="grid md:grid-cols-[320px_1fr]">
        <div className="hidden border-r border-ink-100/10 p-4 text-[13px] md:block">
          {typed && (
            <div className="ml-6 rounded-2xl rounded-br-md bg-ink-900 px-3 py-2.5 leading-relaxed">
              {typed}
              {t === 0 && <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 animate-blink bg-nar" />}
            </div>
          )}
          {t >= 1 && (
            <div className="mt-4 flex gap-2.5">
              <LogoMark className="mt-0.5 size-5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-ink-200">Əla fikir. İsti, premium kofe üslubunda qururam.</p>
                {filesShown > 0 && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-ink-100/10">
                    {FILES.slice(0, filesShown).map((f, i) => (
                      <div key={f} className="flex items-center gap-2 border-b border-ink-100/10 px-2.5 py-1.5 font-mono text-[11px] text-ink-300 last:border-0">
                        {i < filesDone ? <Check className="size-3 text-success" /> : <Loader2 className="size-3 animate-spin text-nar-600" />}
                        {f}
                      </div>
                    ))}
                  </div>
                )}
                <AnimatePresence>
                  {t >= 15 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mt-3 flex items-center gap-2 rounded-xl border px-2.5 py-2 text-[12px] ${fixed ? "border-success/40 text-success" : "border-warning/50 text-warning"}`}>
                      {fixed ? <Check className="size-3.5" /> : <Wrench className="size-3.5" />}
                      {fixed ? "Xəta avtomatik düzəldildi" : "Xəta tapıldı — düzəldirəm…"}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        <div className="relative h-[400px] overflow-hidden p-3 sm:h-[460px]">
          <div className="relative h-full overflow-hidden rounded-xl bg-[#f6eee4] text-[#2b1d14]">
            {/* the site, woven from the bottom up */}
            <div className="h-full transition-[clip-path] duration-300 ease-out" style={{ clipPath: `inset(${100 - (woven / ROWS) * 100}% 0 0 0)` }}>
              <div className="flex items-center justify-between px-5 py-3 text-[10px]">
                <span style={{ fontFamily: "var(--font-display)" }} className="text-[15px] font-semibold italic">dəmlə.</span>
                <span className="hidden gap-4 opacity-70 sm:flex"><span>Menyu</span><span>Haqqımızda</span><span>Əlaqə</span></span>
                <span className="bg-[#2b1d14] px-3 py-1 text-[#f6eee4]">Rezerv et</span>
              </div>
              <div className="grid grid-cols-5 gap-4 px-5 pt-4">
                <div className="col-span-3 space-y-2.5">
                  <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#b4532a]">Bakı · 2019-dan</div>
                  <div style={{ fontFamily: "var(--font-display)" }} className="text-[26px] leading-[1.02] sm:text-[34px]">
                    Hər qurtumda <em className="text-[#b4532a]">isti</em> bir hekayə.
                  </div>
                  <div className="max-w-[260px] text-[10px] leading-relaxed text-[#8c7464]">Təzə qovrulmuş dənələr, ev şirniyyatları və rahat künclər — Nizami küçəsində.</div>
                  <div className="flex gap-2 pt-1 text-[9px]">
                    <span className="bg-[#2b1d14] px-3 py-1.5 text-[#f6eee4]">Menyuya bax</span>
                    <span className="border border-[#2b1d14]/30 px-3 py-1.5">Masa sifarişi</span>
                  </div>
                </div>
                <div className="col-span-2 aspect-[4/5] bg-[#7a3b1d]" style={{ backgroundImage: "repeating-linear-gradient(45deg, rgb(0 0 0 / .08) 0 6px, transparent 6px 12px)" }} />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2.5 px-5">
                {[["Kapuçino", "5,50"], ["Flat white", "6,00"], ["Paxlava", "4,00"]].map(([n, p], i) => (
                  <div key={n} className="bg-[#fffaf3] p-2.5">
                    <div className="mb-2 aspect-[4/3]" style={{ background: ["#c98a5b", "#a0663f", "#d9b26b"][i] }} />
                    <div className="flex justify-between text-[10px] font-medium"><span>{n}</span><span className="text-[#b4532a]">{p} ₼</span></div>
                  </div>
                ))}
              </div>
            </div>
            {/* the "shuttle" line */}
            {woven > 0 && woven < ROWS && (
              <div className="absolute inset-x-0 h-[2px] bg-[#b4532a] transition-[top] duration-300" style={{ top: `${100 - (woven / ROWS) * 100}%` }} />
            )}
            {woven === 0 && (
              <div className="absolute inset-0 grid place-items-center font-mono text-[11px] text-[#8c7464]">{t >= 1 ? "qurulur…" : "fikrinizi gözləyir"}</div>
            )}
            <AnimatePresence>
              {showError && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-x-6 bottom-6 rounded-lg border border-danger/60 bg-[#1a0d0c] p-3 font-mono text-[10.5px] text-danger">
                  [vite] Failed to resolve import &quot;./Reservation&quot; from &quot;src/App.jsx&quot;
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {t >= 23 && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[#2b1d14] px-3.5 py-2 text-[11px] text-[#f6eee4]">
                  <Check className="size-3.5 text-[#e2b06a]" /> Sayt hazırdır
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
