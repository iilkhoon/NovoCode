import { img } from "@/lib/img";
import { TEACHERS } from "../data";

export default function Teachers() {
  return (
    <section id="muellimler" className="scroll-mt-20 bg-foreground py-24 text-background">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="font-display text-[clamp(30px,4.5vw,52px)] font-bold tracking-[-0.02em]">Müəllimlər</h2>
        <p className="mt-3 text-background/60">Hamısı beynəlxalq sertifikatlı, ən azı 5 il təcrübəli.</p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TEACHERS.map((t) => (
            <figure key={t.name} className="rounded-3xl bg-background/5 p-4 ring-1 ring-background/10">
              <img src={img(t.photo, 600, 600)} alt={t.name} loading="lazy" className="aspect-square w-full rounded-2xl bg-background/10 object-cover" />
              <figcaption className="px-2 pb-2 pt-5">
                <p className="font-display text-lg font-bold">{t.name}</p>
                <p className="mt-1 text-sm text-primary">{t.lang}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
