import { img } from "@/lib/img";

const PICS = [
  ["1560066984-138dadb4c035", "Salonun interyeri"],
  ["1570172619644-dfd03ed5d881", "Üz baxımı"],
  ["1604654894610-df63bc536371", "Dırnaq dizaynı"],
  ["1521590832167-7bcbfaa6381f", "İş yerlərimiz"],
];

export default function Gallery() {
  return (
    <section id="qalereya" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-[clamp(40px,5.5vw,64px)] font-medium leading-none">@nergiz.salon</h2>
        <p className="text-muted-foreground">Hər gün yeni işlər</p>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        {PICS.map(([id, alt]) => <img key={id} src={img(id, 600, 600)} alt={alt} loading="lazy" className="aspect-square w-full rounded-3xl bg-muted object-cover" />)}
      </div>
    </section>
  );
}
