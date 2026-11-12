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
        <Reveal className="label-mono text-ink-400">
          <span className="text-nar-600">09</span> — Başlayın
        </Reveal>
        <SplitTitle
          lines={["Növbəti saytınız", "*bir cümlə uzaqlığındadır.*"]}
          className="mx-auto mt-6 text-[clamp(2.2rem,6vw,5.4rem)] leading-[1.05] text-ink-100"
        />
        <Reveal delay={0.3} className="mx-auto mt-6 max-w-md text-[16px] leading-relaxed text-ink-400">
          Pulsuz başlayın, kart tələb olunmur. İlk versiya çayınız soyumadan hazır olacaq.
        </Reveal>
        <Reveal delay={0.45} className="mt-10 flex justify-center">
          <ButtonLink href="#başla" size="lg" variant="white">
            İndi qurmağa başla <ArrowRight className="size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  );
}
