"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { Check, Code2, Eye, FileCode2, Loader2, Monitor, RotateCw, Smartphone, SquareTerminal, Wrench } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { EASE } from "@/components/ui/motion";

const PROMPT = "Dəmlə adlı kofe şopu üçün sayt qur: menyu, qiymətlər və masa rezervasiyası olsun.";
const FILES = ["src/index.css", "src/components/Header.jsx", "src/components/Hero.jsx", "src/components/Menu.jsx", "src/components/Reservation.jsx", "src/App.jsx"];

/** Scripted, looping product demo shown under the hero. */
export function DemoWindow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-100px" });
  const [t, setT] = useState(0); // timeline step
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
        if (char < PROMPT.length) return (timer = setTimeout(run, 28));
        step = 1;
        setT(1);
        return (timer = setTimeout(run, 700));
      }
      step++;
      setT(step);
      if (step >= 14) {
        // reset loop
        timer = setTimeout(() => {
          step = 0;
          char = 0;
          setT(0);
          setTyped("");
          timer = setTimeout(run, 600);
        }, 3800);
        return;
      }
      timer = setTimeout(run, step < 9 ? 520 : 900);
    };
    timer = setTimeout(run, 500);
    return () => clearTimeout(timer);
  }, [inView]);

  const filesDone = Math.max(0, Math.min(FILES.length, t - 2));
  const built = (n: number) => t >= n + 3; // preview blocks appear with files
  const showError = t >= 10 && t < 12;
  const fixed = t >= 12;

  return (
    <div ref={ref} className="relative">
      {/* glow under window */}
      <div aria-hidden className="absolute -inset-x-10 -top-10 bottom-0 -z-10 rounded-[40px] bg-[radial-gradient(60%_50%_at_50%_30%,rgb(255_59_92/0.25),transparent)] blur-2xl" />
      <div className="overflow-hidden rounded-[22px] border border-white/10 bg-ink-900/90 shadow-[0_0_0_1px_rgb(255_255_255/0.03),0_50px_120px_-30px_rgb(0_0_0/0.9)] backdrop-blur">
        {/* window chrome */}
        <div className="flex h-11 items-center gap-3 border-b border-white/6 px-4">
          <div className="flex gap-1.5">
            <span className="size-3 rounded-full bg-[#ff5f57]" />
            <span className="size-3 rounded-full bg-[#febc2e]" />
            <span className="size-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="mx-auto flex h-7 w-full max-w-sm items-center justify-center gap-2 rounded-lg bg-white/[0.04] text-xs text-ink-400">
            <LogoMark className="size-3.5" /> novocode.az/studio
          </div>
          <div className="w-12" />
        </div>

        <div className="grid h-[440px] grid-cols-1 sm:h-[520px] md:grid-cols-[340px_1fr]">
          {/* chat */}
          <div className="hidden flex-col border-r border-white/6 bg-ink-950/40 md:flex">
            <div className="flex-1 space-y-4 overflow-hidden p-4 text-[13px]">
              {typed && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="ml-8 rounded-2xl rounded-br-md bg-ink-700 px-3.5 py-2.5 leading-relaxed text-ink-100">
                  {typed}
                  {t === 0 && <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 animate-blink bg-nar-400" />}
                </motion.div>
              )}
              {t >= 1 && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: EASE }} className="flex gap-2.5">
                  <LogoMark className="mt-0.5 size-5 shrink-0" />
                  <div className="min-w-0 flex-1 space-y-2.5">
                    <p className="text-ink-200">Əla fikir! İsti, premium kofe üslubunda sayt qururam ☕</p>
                    {t >= 2 && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden rounded-xl border border-white/8 bg-ink-850">
                        {FILES.slice(0, Math.min(FILES.length, t - 1)).map((f, i) => (
                          <motion.div key={f} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 border-b border-white/5 px-3 py-1.5 font-mono text-[11px] text-ink-300 last:border-0">
                            {i < filesDone ? <Check className="size-3 text-success" /> : <Loader2 className="size-3 animate-spin text-nar-400" />}
                            <FileCode2 className="size-3 text-ink-400" />
                            {f}
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
              <AnimatePresence>
                {t >= 10 && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-[12px] ${fixed ? "border-success/25 bg-success/8 text-success" : "border-gold-500/25 bg-gold-500/8 text-gold-400"}`}>
                    {fixed ? <Check className="size-3.5" /> : <Wrench className="size-3.5 animate-pulse" />}
                    {fixed ? "Xəta avtomatik düzəldildi" : "Xəta tapıldı — avtomatik düzəldirəm…"}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="m-3 rounded-2xl border border-white/8 bg-ink-850 px-3.5 py-3 text-[12px] text-ink-400">Dəyişiklik istəyin…</div>
          </div>

          {/* workspace */}
          <div className="flex min-w-0 flex-col">
            <div className="flex items-center gap-1 border-b border-white/6 px-3 py-2 text-[11px]">
              <span className="flex items-center gap-1.5 rounded-md bg-white/8 px-2.5 py-1 text-ink-100"><Eye className="size-3" /> Önizləmə</span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 text-ink-400"><Code2 className="size-3" /> Kod</span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 text-ink-400"><SquareTerminal className="size-3" /> Terminal</span>
              <span className="ml-auto hidden items-center gap-2 text-ink-400 sm:flex">
                <RotateCw className="size-3" /> <Monitor className="size-3 text-ink-100" /> <Smartphone className="size-3" />
              </span>
            </div>
            <div className="relative flex-1 overflow-hidden bg-ink-950 p-3">
              <div className="relative h-full overflow-hidden rounded-xl bg-[#f6eee4] text-[#2b1d14]">
                {/* mini site */}
                <AnimatePresence>
                  {built(0) && (
                    <motion.div key="nav" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center justify-between px-5 py-3 text-[10px]">
                      <span className="font-display text-[13px] font-semibold tracking-tight">dəmlə.</span>
                      <span className="hidden gap-4 opacity-70 sm:flex"><span>Menyu</span><span>Haqqımızda</span><span>Əlaqə</span></span>
                      <span className="rounded-full bg-[#b4532a] px-3 py-1 text-white">Rezerv et</span>
                    </motion.div>
                  )}
                  {built(1) && (
                    <motion.div key="hero" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ ease: EASE, duration: 0.8 }} className="grid grid-cols-5 gap-4 px-5 pt-3">
                      <div className="col-span-3 space-y-2.5">
                        <div className="text-[9px] uppercase tracking-[0.25em] text-[#b4532a]">Bakı · 2019-dan</div>
                        <div className="font-serif text-[22px] leading-[1.05] tracking-tight sm:text-[30px]" style={{ fontFamily: "Georgia, serif" }}>
                          Hər qurtumda <i className="text-[#b4532a]">isti</i> bir hekayə.
                        </div>
                        <div className="max-w-[260px] text-[10px] leading-relaxed text-[#8c7464]">Təzə qovrulmuş dənələr, ev şirniyyatları və rahat künclər — Nizami küçəsində.</div>
                        <div className="flex gap-2 pt-1 text-[9px]">
                          <span className="rounded-full bg-[#2b1d14] px-3 py-1.5 text-[#f6eee4]">Menyuya bax</span>
                          <span className="rounded-full border border-[#2b1d14]/20 px-3 py-1.5">Masa sifarişi</span>
                        </div>
                      </div>
                      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ ease: EASE, duration: 1 }} className="col-span-2 aspect-[4/5] rounded-2xl bg-[radial-gradient(circle_at_30%_30%,#e6a575,#7a3b1d_60%,#2b1d14)] shadow-xl" />
                    </motion.div>
                  )}
                  {built(2) && (
                    <motion.div key="menu" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ ease: EASE, duration: 0.8 }} className="mt-5 grid grid-cols-3 gap-2.5 px-5">
                      {[["Kapuçino", "5,50"], ["Flat white", "6,00"], ["Paxlava", "4,00"]].map(([n, p], i) => (
                        <motion.div key={n} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, ease: EASE }} className="rounded-xl bg-[#fffaf3] p-2.5 shadow-sm">
                          <div className="mb-2 aspect-[4/3] rounded-lg" style={{ background: ["#c98a5b", "#a0663f", "#d9b26b"][i] }} />
                          <div className="flex justify-between text-[10px] font-medium"><span>{n}</span><span className="text-[#b4532a]">{p} ₼</span></div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                {!built(0) && (
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="flex flex-col items-center gap-3 text-[11px] text-[#8c7464]">
                      <LogoMark className="size-10" animated />
                      {t >= 1 ? "Sayt qurulur…" : "Fikrinizi gözləyirəm"}
                    </div>
                  </div>
                )}
                {/* error overlay (vite style) */}
                <AnimatePresence>
                  {showError && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: "blur(8px)" }} className="absolute inset-0 grid place-items-center bg-black/70 p-6 backdrop-blur-[2px]">
                      <div className="w-full max-w-sm rounded-xl border border-danger/40 bg-[#1a0d10] p-4 font-mono text-[10px] text-danger shadow-2xl">
                        <div className="mb-1 font-semibold">[vite] Internal server error</div>
                        <div className="text-ink-300">Failed to resolve import &quot;./Reservation&quot; from &quot;src/App.jsx&quot;</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {t >= 13 && (
                    <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 22 }} className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[#2b1d14] px-4 py-2 text-[11px] text-[#f6eee4] shadow-xl">
                      <Check className="size-3.5 text-success" /> Saytınız hazırdır — 2 dəq 41 san
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
