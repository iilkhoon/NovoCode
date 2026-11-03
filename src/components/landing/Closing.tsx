"use client";
import { useMemo } from "react";
import { Knots } from "@/components/carpet/Knots";
import { medallion } from "@/components/carpet/patterns";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "./Section";

export function Closing() {
  const med = useMemo(() => medallion(25), []);
  return (
    <section className="bg-indigo py-24 text-wool">
      <Container className="grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-wool/60">
            <span className="text-saffron">№ 09</span> — Başlayın
          </div>
          <h2 className="mt-6 font-display text-[2.8rem] font-medium leading-[1] tracking-[-0.03em] sm:text-[4.4rem] [font-variation-settings:'SOFT'_50,'opsz'_144]">
            Növbəti saytınız bir cümlə <em className="text-saffron">uzaqlığındadır.</em>
          </h2>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-wool/75">Pulsuz başlayın, kart tələb olunmur. İlk versiya çayınız soyumadan hazır olacaq.</p>
          <ButtonLink href="#başla" size="lg" className="mt-9 !bg-saffron !text-ink hover:!bg-wool">
            İndi qurmağa başla
          </ButtonLink>
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <div className="border-[1.5px] border-wool/40 bg-wool p-5">
            <Knots pattern={med} weave speed={50} className="block w-full" />
          </div>
        </div>
      </Container>
    </section>
  );
}
