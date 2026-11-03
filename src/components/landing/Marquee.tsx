"use client";
import { CountUp, Reveal } from "@/components/ui/motion";
import { INDUSTRIES } from "./data";

function Row({ items, reverse }: { items: string[]; reverse?: boolean }) {
  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
      <div className={`flex shrink-0 animate-marquee gap-3 pr-3 ${reverse ? "[animation-direction:reverse]" : ""}`}>
        {[...items, ...items].map((x, i) => (
          <span key={i} className="whitespace-nowrap rounded-full border border-white/8 bg-white/[0.02] px-4 py-2 text-sm text-ink-300">
            <span className="mr-2 inline-block size-1.5 -translate-y-px rounded-full bg-nar-gradient" />
            {x}
          </span>
        ))}
      </div>
    </div>
  );
}

export function IndustryMarquee() {
  const half = Math.ceil(INDUSTRIES.length / 2);
  return (
    <section className="relative py-14">
      <Reveal className="mb-8 text-center text-sm text-ink-400">Hər sahə üçün sayt — bir cümlə ilə</Reveal>
      <div className="space-y-3">
        <Row items={INDUSTRIES.slice(0, half)} />
        <Row items={INDUSTRIES.slice(half)} reverse />
      </div>
    </section>
  );
}

export function Stats() {
  const stats = [
    { v: <CountUp to={3} prefix="~" suffix=" dəq" />, l: "İlk versiyaya qədər orta vaxt" },
    { v: <CountUp to={3} suffix="×" />, l: "Avtomatik təmir cəhdi hər addımda" },
    { v: <CountUp to={11} suffix="+" />, l: "Peşəkar dizayn və kod skill-i" },
    { v: <CountUp to={100} suffix="%" />, l: "Azərbaycan dilində interfeys" },
  ];
  return (
    <section className="mx-auto max-w-6xl px-5">
      <div className="grid grid-cols-2 overflow-hidden rounded-3xl border border-white/8 bg-white/[0.015] md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={i} delay={i * 0.08} className="border-white/6 p-6 sm:p-8 [&:nth-child(-n+2)]:border-b md:[&:nth-child(-n+2)]:border-b-0 [&:not(:last-child)]:border-r max-md:[&:nth-child(2)]:border-r-0">
            <div className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{s.v}</div>
            <div className="mt-2 text-[13px] leading-snug text-ink-400">{s.l}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
