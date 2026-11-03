import { Knots } from "@/components/carpet/Knots";
import { GLYPHS } from "@/components/carpet/patterns";
import { Reveal } from "@/components/ui/motion";
import { Container, SectionHead } from "./Section";

const ITEMS = [
  { g: "voice", t: "Ana dilinizdə danışın", d: "Yazın və ya mikrofonu basıb deyin. Texniki termin lazım deyil — Novo Azərbaycan dilini anlayır." },
  { g: "heal", t: "Xətanı özü düzəldir", d: "Hər dəyişiklikdən sonra terminalı və brauzeri yoxlayır. Xəta tapanda səbəbini oxuyur və düzəldir." },
  { g: "image", t: "Şəkildən sayt", d: "Bəyəndiyiniz saytın ekran görüntüsünü və ya kağızdakı eskizi atın — eyni üslubda işlək sayt alın." },
  { g: "data", t: "Görüntü yox, işlək məhsul", d: "Formalar göndərilir, səbət hesablayır, istifadəçilər qeydiyyatdan keçir, rezervlər yadda qalır." },
  { g: "history", t: "Hər addım yadda qalır", d: "Bəyənmədiniz? İstənilən əvvəlki versiyaya bir kliklə qayıdın." },
  { g: "code", t: "Kod sizindir", d: "Təmiz React və Tailwind. ZIP yükləyin, developerə verin, istənilən hostinqə qoyun." },
];

export function Capabilities() {
  return (
    <section className="py-24">
      <Container>
        <SectionHead no="04" label="Bacarıqlar" title={<>Agentliyin işi — <em className="text-nar">söhbət sürətində.</em></>} />
        <div className="mt-14 grid border-t border-ink-100/15 md:grid-cols-2">
          {ITEMS.map((x, i) => (
            <Reveal key={x.t} delay={(i % 2) * 0.06} className="flex gap-6 border-b border-ink-100/15 py-8 md:px-8 md:[&:nth-child(odd)]:border-r md:[&:nth-child(odd)]:pl-0">
              <Knots pattern={GLYPHS[x.g]} className="size-10 shrink-0" gap={0.12} />
              <div>
                <h3 className="font-display text-[1.45rem] font-medium tracking-[-0.01em]">{x.t}</h3>
                <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink-300">{x.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
