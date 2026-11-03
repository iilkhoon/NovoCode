import { Reveal } from "@/components/ui/motion";
import { Container, SectionHead } from "./Section";
import { STEPS } from "./data";

export function HowItWorks() {
  return (
    <section id="necə-işləyir" className="scroll-mt-20 py-24">
      <Container>
        <SectionHead
          no="02"
          label="Necə işləyir"
          title={<>Sıra-sıra, <em className="text-nar">xalça kimi.</em></>}
          text="Brif yazmaq, dizayner axtarmaq, həftələrlə gözləmək yoxdur. Bütün proses bir söhbətdir."
        />
        <ol className="mt-16 grid border-t border-ink-100/15 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal
              key={s.n}
              delay={i * 0.06}
              className="border-b border-ink-100/15 py-8 sm:px-6 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:[&:not(:last-child)]:border-r lg:first:pl-0"
            >
              <li className="list-none">
                <div className="font-display text-[3.5rem] font-light leading-none text-nar [font-variation-settings:'opsz'_144]">{s.n}</div>
                <h3 className="mt-6 font-display text-[1.45rem] font-medium tracking-[-0.01em]">{s.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-300">{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
