import { Container, SectionHead } from "./Section";
import { DemoWindow } from "./DemoWindow";

export function StudioShowcase() {
  return (
    <section id="studio" className="relative scroll-mt-20 py-36">
      <Container>
        <div className="lg:w-[58%]">
          <SectionHead no="03" label="Studio" lines={["Siz danışırsınız.", "*Novo qurur.*"]} text="Solda söhbət, sağda canlı sayt. Kod yazılır, paketlər yüklənir — xəta çıxsa, Novo terminalı oxuyub özü düzəldir." />
        </div>
        <div className="mt-16">
          <DemoWindow />
        </div>
      </Container>
    </section>
  );
}
