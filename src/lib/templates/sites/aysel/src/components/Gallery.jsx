import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { img } from "@/lib/img";
import { PHOTOS } from "../data";

const CATS = ["Hamısı", "Toy", "Nişan", "Love story"];

export default function Gallery() {
  const [cat, setCat] = useState("Hamısı");
  const [open, setOpen] = useState(-1);
  const list = PHOTOS.filter((p) => cat === "Hamısı" || p.cat === cat);

  useEffect(() => {
    if (open < 0) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(-1);
      if (e.key === "ArrowRight") setOpen((i) => (i + 1) % list.length);
      if (e.key === "ArrowLeft") setOpen((i) => (i - 1 + list.length) % list.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, list.length]);

  return (
    <section id="qalereya" className="mx-auto max-w-7xl scroll-mt-10 px-5 py-24 sm:px-8 md:py-32">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <h2 className="font-display text-[clamp(36px,5vw,64px)] leading-none">Seçilmiş işlər</h2>
        <div className="flex flex-wrap gap-6 text-xs uppercase tracking-[0.2em]">
          {CATS.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={"border-b pb-1 transition-colors " + (cat === c ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>{c}</button>
          ))}
        </div>
      </div>
      <div className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3">
        {list.map((p, i) => (
          <button key={p.id} onClick={() => setOpen(i)} className="group mb-5 block w-full overflow-hidden break-inside-avoid" aria-label={`Böyüt: ${p.alt}`}>
            <img src={img(p.id, 800, p.tall ? 1100 : 640)} alt={p.alt} loading="lazy" className={"w-full bg-muted object-cover transition-transform duration-1000 group-hover:scale-105 " + (p.tall ? "aspect-[8/11]" : "aspect-[5/4]")} />
          </button>
        ))}
      </div>

      {open >= 0 && list[open] && (
        <div role="dialog" aria-label="Foto" className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4" onClick={() => setOpen(-1)}>
          <img src={img(list[open].id, 1800)} alt={list[open].alt} className="max-h-[88vh] max-w-full object-contain" onClick={(e) => e.stopPropagation()} />
          <button className="absolute right-5 top-5 grid size-11 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Bağla"><X /></button>
          <button onClick={(e) => (e.stopPropagation(), setOpen((open - 1 + list.length) % list.length))} className="absolute left-4 grid size-12 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Əvvəlki"><ChevronLeft /></button>
          <button onClick={(e) => (e.stopPropagation(), setOpen((open + 1) % list.length))} className="absolute right-4 grid size-12 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Növbəti"><ChevronRight /></button>
          <p className="absolute bottom-6 text-xs tracking-[0.2em] text-white/60">{open + 1} / {list.length}</p>
        </div>
      )}
    </section>
  );
}
