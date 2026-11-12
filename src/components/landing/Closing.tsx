import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/motion";
import { Container } from "./Section";
import { SplitTitle } from "./SplitTitle";

/** Finale: the form settles centre-stage, the call to action sits beneath it. */
export function Closing() {
  return (
    <section className="relative py-40">
      <Container className="text-center">
        <Reveal className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-400">
          <span className="text-white">09</span> — Başlayın
        </Reveal>
        <SplitTitle
          lines={["Növbəti saytınız", "*bir cümlə uzaqlığındadır.*"]}
          className="mx-auto mt-6 text-[clamp(2.2rem,6vw,5.4rem)] leading-[1.05] text-ink [text-shadow:0_2px_60px_rgb(0_0_0/0.7)]"
        />
        <Reveal delay={0.3} className="mx-auto mt-6 max-w-md text-[16px] leading-relaxed text-ink-200/85">
          Pulsuz başlayın, kart tələb olunmur. İlk versiya çayınız soyumadan hazır olacaq.
        </Reveal>
        <Reveal delay={0.45} className="mt-10 flex justify-center">
          <ButtonLink href="#başla" size="lg" variant="white" className="shadow-[var(--shadow-glow)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow-strong)]">
            İndi qurmağa başla <ArrowRight className="size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  );
}
