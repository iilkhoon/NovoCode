import { img } from "@/lib/img";
import { MASTERS } from "../data";

export default function Masters() {
  return (
    <section id="ustalar" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
      <h2 className="font-display text-[clamp(40px,5.5vw,64px)] font-medium leading-none">Ustalarımız</h2>
      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {MASTERS.map((m) => (
          <figure key={m.id}>
            <img src={img(m.photo, 700, 860)} alt={m.name} loading="lazy" className="aspect-[7/8.6] w-full rounded-[2rem] bg-muted object-cover" />
            <figcaption className="mt-4">
              <p className="font-display text-2xl font-semibold">{m.name}</p>
              <p className="text-sm text-muted-foreground">{m.role}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
