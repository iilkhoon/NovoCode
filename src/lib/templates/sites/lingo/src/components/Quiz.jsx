import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { LEVELS, QUIZ } from "../data";

export default function Quiz() {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const done = i >= QUIZ.length;

  const answer = (idx) => {
    if (picked !== null) return;
    setPicked(idx);
    const right = idx === QUIZ[i].a;
    setTimeout(() => {
      if (right) setScore((s) => s + 1);
      setPicked(null);
      setI((n) => n + 1);
    }, 650);
  };

  const restart = () => (setI(0), setScore(0), setPicked(null));

  return (
    <section id="test" className="mx-auto max-w-3xl scroll-mt-20 px-5 py-24">
      <h2 className="text-center font-display text-[clamp(30px,4.5vw,52px)] font-bold tracking-[-0.02em]">Səviyyənizi 1 dəqiqədə öyrənin</h2>
      <div className="mt-12 rounded-[2rem] border-2 border-foreground bg-card p-7 shadow-[8px_8px_0_0_#1f1a0e] sm:p-10">
        {done ? (
          <div className="text-center">
            <p className="text-sm font-semibold text-muted-foreground">Nəticəniz</p>
            <p className="mt-3 font-display text-4xl font-bold text-accent">{LEVELS[score]}</p>
            <p className="mt-3 text-muted-foreground">{score} / {QUIZ.length} düzgün cavab. Sizə uyğun qrupu məsləhətçimiz təklif edəcək.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href={`#qeydiyyat`} onClick={() => sessionStorage.setItem("lingo:level", LEVELS[score])} className="rounded-full bg-primary px-6 py-3 font-semibold">Bu səviyyədə qeydiyyat</a>
              <button onClick={restart} className="flex items-center gap-2 rounded-full border-2 border-foreground px-6 py-2.5 font-semibold"><RotateCcw className="size-4" /> Yenidən</button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>Sual {i + 1} / {QUIZ.length}</span>
              <span className="text-muted-foreground">İngilis dili</span>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${(i / QUIZ.length) * 100}%` }} /></div>
            <p className="mt-8 font-display text-2xl font-bold leading-snug">{QUIZ[i].q}</p>
            <div className="mt-6 grid gap-3">
              {QUIZ[i].options.map((o, idx) => {
                const state = picked === null ? "" : idx === QUIZ[i].a ? "border-emerald-500 bg-emerald-50" : idx === picked ? "border-red-400 bg-red-50" : "opacity-50";
                return (
                  <button key={o} onClick={() => answer(idx)} className={"rounded-2xl border-2 border-foreground/15 px-5 py-4 text-left font-medium transition-colors hover:border-foreground " + state}>
                    <span className="mr-3 font-display text-sm text-muted-foreground">{"ABC"[idx]}</span>{o}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
