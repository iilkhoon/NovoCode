import { Award } from "lucide-react";
import { img } from "@/lib/img";
import { DOCTORS } from "../data";

export default function Doctors() {
  return (
    <section id="hekimler" className="scroll-mt-20 bg-muted py-24">
      <div className="mx-auto max-w-6xl px-5">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Həkimlərimiz</p>
        <h2 className="mt-3 text-[clamp(32px,4.5vw,48px)] font-extrabold tracking-[-0.03em]">Sizə güvənəcəyiniz komanda.</h2>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {DOCTORS.map((d) => (
            <article key={d.id} className="overflow-hidden rounded-3xl bg-card shadow-sm">
              <img src={img(d.photo, 700, 760)} alt={d.name} loading="lazy" className="aspect-[7/7.6] w-full bg-border object-cover object-top" />
              <div className="p-6">
                <h3 className="text-lg font-bold">{d.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{d.role}</p>
                <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"><Award className="size-3.5" /> {d.years} il təcrübə</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
