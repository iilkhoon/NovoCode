import { Code2, History, ImageIcon, LayoutTemplate, Mic, Wrench } from "lucide-react";
import { Reveal } from "@/components/ui/motion";
import { Container, SectionHead } from "./Section";

const ITEMS = [
  { icon: Mic, t: "Ana dilinizdə danışın", d: "Yazın və ya mikrofonu basıb deyin. Novo Azərbaycan dilini anlayır — texniki termin lazım deyil." },
  { icon: Wrench, t: "Xətanı özü düzəldir", d: "Hər dəyişiklikdən sonra terminalı və brauzeri yoxlayır, xətanın səbəbini tapıb düzəldir." },
  { icon: ImageIcon, t: "Şəkildən sayt", d: "Bəyəndiyiniz saytın ekran görüntüsünü və ya kağızdakı eskizi atın — eyni üslubda işlək sayt alın." },
  { icon: LayoutTemplate, t: "Görüntü yox, məhsul", d: "Formalar göndərilir, səbət hesablayır, istifadəçilər qeydiyyatdan keçir, rezervlər yadda qalır." },
  { icon: History, t: "Hər addım yadda qalır", d: "Bəyənmədiniz? İstənilən əvvəlki versiyaya bir kliklə qayıdın." },
  { icon: Code2, t: "Kod sizindir", d: "Təmiz React və Tailwind. ZIP yükləyin, developerə verin, istənilən hostinqə qoyun." },
];

export function Capabilities() {
  return (
    <section className="relative py-36">
      <Container>
        <div className="lg:w-[55%]">
          <SectionHead no="04" label="Bacarıqlar" lines={["Agentliyin işi —", "*söhbət sürətində.*"]} />
        </div>
        <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((x, i) => (
            <Reveal key={x.t} delay={(i % 2) * 0.08} className="surface group rounded-[22px] border border-ink-100/[0.08] p-7 transition-[border-color,transform] duration-300 ease-out hover:-translate-y-1 hover:border-nar/30">
              <div className="grid size-10 place-items-center rounded-xl bg-dawn text-white shadow-[var(--shadow-glow)]">
                <x.icon className="size-[18px]" strokeWidth={1.6} />
              </div>
              <h3 className="mt-5 text-[17px] font-medium">{x.t}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-400">{x.d}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
