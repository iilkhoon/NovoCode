import { useState } from "react";
import { Clock, Users } from "lucide-react";
import { COURSES } from "../data";

export default function Courses() {
  const langs = Object.keys(COURSES);
  const [lang, setLang] = useState(langs[0]);
  return (
    <section id="kurslar" className="scroll-mt-20 border-y-2 border-foreground bg-muted py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-[clamp(30px,4.5vw,52px)] font-bold tracking-[-0.02em]">Kurslar və qiymətlər</h2>
          <div className="flex gap-2">
            {langs.map((l) => (
              <button key={l} onClick={() => setLang(l)} className={"rounded-full border-2 border-foreground px-5 py-2 text-sm font-semibold transition-colors " + (lang === l ? "bg-foreground text-background" : "bg-card hover:bg-primary")}>{l}</button>
            ))}
          </div>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {COURSES[lang].map((c) => (
            <article key={c.name} className="flex flex-col rounded-3xl border-2 border-foreground bg-card p-7 shadow-[6px_6px_0_0_#1f1a0e] transition-transform hover:-translate-y-1">
              <span className="w-fit rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">{c.level}</span>
              <h3 className="mt-5 font-display text-xl font-bold">{c.name}</h3>
              <div className="mt-4 flex gap-5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Clock className="size-4" />{c.weeks} həftə</span>
                <span className="flex items-center gap-1.5"><Users className="size-4" />{c.seats} yer qalıb</span>
              </div>
              <p className="mt-8 font-display text-4xl font-bold">{c.price} ₼<span className="font-sans text-base font-normal text-muted-foreground"> / ay</span></p>
              <a href="#qeydiyyat" className="mt-6 rounded-full bg-primary py-3 text-center font-semibold">Yer tut</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
