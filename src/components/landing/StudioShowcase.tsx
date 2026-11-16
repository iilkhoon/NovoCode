import { useCopy } from "./copy";
import { Container, SectionHead } from "./Section";
import { DemoWindow } from "./DemoWindow";

export function StudioShowcase() {
  const c = useCopy();
  return (
    <section id="studio" className="relative scroll-mt-20 py-36">
      <Container>
        <div className="lg:w-[58%]">
          <SectionHead key={c.studio.label} no="03" label={c.studio.label} lines={c.studio.lines} text={c.studio.text} />
        </div>
        <div className="mt-16">
          <DemoWindow />
        </div>
      </Container>
    </section>
  );
}
