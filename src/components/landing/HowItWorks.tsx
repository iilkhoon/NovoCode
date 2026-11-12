import { Reveal } from "@/components/ui/motion";
import { Container, Glass, SectionHead } from "./Section";
import { STEPS } from "./data";

export function HowItWorks() {
  return (
    <section id="necə-işləyir" className="relative scroll-mt-20 py-36">
      <Container>
        <div className="lg:w-[60%]">
          <SectionHead no="02" label="Necə işləyir" lines={["Fikirdən", "*canlı sayta.*"]} text="Brif yazmaq, dizayner axtarmaq, həftələrlə gözləmək yoxdur. Bütün proses bir söhbətdir." />
        </div>
        <Glass className="mt-16 grid overflow-hidden sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06} className="border-ink-100/10 p-7 sm:p-8 max-lg:sm:[&:nth-child(-n+2)]:border-b max-lg:sm:[&:nth-child(odd)]:border-r lg:[&:not(:last-child)]:border-r max-sm:[&:not(:last-child)]:border-b">
              <div className="font-display text-5xl text-white">{s.n}</div>
              <h3 className="mt-5 text-[17px] font-medium">{s.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-300">{s.text}</p>
            </Reveal>
          ))}
        </Glass>
      </Container>
    </section>
  );
}
