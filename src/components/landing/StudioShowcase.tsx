import { Container, SectionHead } from "./Section";
import { DemoWindow } from "./DemoWindow";

export function StudioShowcase() {
  return (
    <section id="studio" className="scroll-mt-20 py-24">
      <Container>
        <SectionHead
          no="03"
          label="Studio"
          title={<>Siz danışırsınız. <em className="text-nar">Novo toxuyur.</em></>}
          text="Solda söhbət, sağda canlı sayt. Kod yazılır, paketlər yüklənir, xəta çıxsa Novo terminalı oxuyub özü düzəldir — siz yalnız nəticəni görürsünüz."
        />
        <figure className="mt-14">
          <DemoWindow />
          <figcaption className="mt-4 flex gap-3 font-mono text-[11.5px] text-ink-400">
            <span className="whitespace-nowrap text-nar">Şək. 2</span> Studio-da bir sorğunun yolu: plan → fayllar → xəta → avtomatik təmir → hazır sayt.
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
