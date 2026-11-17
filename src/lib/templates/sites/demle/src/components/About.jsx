import { img } from "@/lib/img";

const STATS = [
  ["6", "il Bakıda"],
  ["14", "çeşid dənə"],
  ["320+", "5 ulduzlu rəy"],
];

export default function About() {
  return (
    <section id="hekaye" className="mx-auto grid max-w-6xl scroll-mt-20 items-center gap-14 px-5 py-24 md:grid-cols-2 md:py-32">
      <div className="grid grid-cols-2 gap-4">
        <img src={img("1554118811-1e0d58224f24", 700, 900)} alt="Kofe evinin interyeri" loading="lazy" className="aspect-[3/4] w-full rounded-[1.75rem] bg-muted object-cover" />
        <img src={img("1501339847302-ac426a4a7cbb", 700, 900)} alt="Bar və kofe maşını" loading="lazy" className="mt-12 aspect-[3/4] w-full rounded-[1.75rem] bg-muted object-cover" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Hekayəmiz</p>
        <h2 className="mt-4 font-display text-[clamp(36px,5vw,56px)] leading-[1.02] tracking-[-0.02em]">Kiçik bir bardan, böyük bir ailəyə.</h2>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          Dəmlə 2019-da üç masalı bir bar kimi açıldı. Bu gün də eyni qaydaya sadiqik: dənəni özümüz qovururuq, şirniyyatı hər səhər özümüz bişiririk, hər qonağı adı ilə tanıyırıq.
        </p>
        <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
          {STATS.map(([v, l]) => (
            <div key={l}>
              <dt className="font-display text-4xl">{v}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{l}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
