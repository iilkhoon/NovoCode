"use client";
import { ArrowRight } from "lucide-react";
import { Logo, LogoMark, Wordmark } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Badge, Kbd } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { PromptBox } from "@/components/PromptBox";
import { Container, Glass, SectionHead } from "@/components/landing/Section";
import { SplitTitle } from "@/components/landing/SplitTitle";
import { AstryxShowcase } from "./AstryxShowcase";

const COLORS = [
  { name: "Kağız", token: "wool / ink-950", hex: "#f4efe6", note: "Səhifə fonu — isti, yumşaq kağız" },
  { name: "Səth", token: "ink-1000", hex: "#fffcf6", note: "Kartlar, popoverlər, söhbət paneli" },
  { name: "Mürəkkəb", token: "ink / ink-100", hex: "#1d1814", note: "Mətn və əsas (tünd) düymə" },
  { name: "Alov", token: "nar", hex: "#e0602f", note: "Vurğu — hər ekranda bir dəfə" },
  { name: "Səssiz", token: "ink-400", hex: "#6e6358", note: "İkinci dərəcəli mətn" },
  { name: "Gecə", token: "[data-theme=dark] ink-950", hex: "#14110e", note: "Gecə rejiminin fonu" },
];

function copy(v: string) {
  navigator.clipboard.writeText(v).then(() => toast.success(`${v} kopyalandı`));
}

export function DesignSystem() {
  return (
    <div className="min-h-dvh bg-ink-950">
      <header className="sticky top-0 z-40 border-b border-ink-100/10 bg-ink-1000/70 backdrop-blur-md">
        <Container className="flex h-[70px] items-center justify-between">
          <Logo />
          <span className="label-mono text-ink-400">Dizayn sistemi · Şəfəq</span>
        </Container>
      </header>

      <Container className="py-24">
        <div className="label-mono text-ink-400">
          <span className="text-nar-600">NovoCode</span> — Dizayn sistemi
        </div>
        <SplitTitle as="h1" immediate lines={["İsti kağız,", "*bir alov.*"]} className="mt-6 text-[clamp(2.4rem,7vw,6rem)] leading-[1.04]" />
        <p className="mt-8 max-w-2xl text-[17px] leading-relaxed text-ink-300">
          NovoCode-un dünyası şəfəq rəngindədir: isti kağız fon, mürəkkəb rəngli mətn və tək bir terrakota alovu — ən vacib hərəkət üçün. Başlıqlar redaksiya serifi ilə (insan dili), etiketlər mono şriftlə (maşın dili). Gündüz və gecə rejimi eyni tokenlərdən qurulur.
        </p>
      </Container>

      <Container className="space-y-32 pb-32">
        <section>
          <SectionHead no="01" label="Brend" lines={["n, sonra *kursor.*"]} text="Kiçik “n” hərfi və yanında yanıb-sönən kursor — yazılmaqda olan cümlə. Ad “Novo” serifdə, “code” mono şriftdə: insan dili koda çevrilir." />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <Glass className="grid aspect-square place-items-center"><LogoMark className="size-36" blink /></Glass>
            <Glass className="grid place-items-center p-10"><Logo className="text-[22px]" /></Glass>
            <div data-theme="dark" className="grid place-items-center rounded-[22px] bg-ink-950 p-10"><div className="flex items-center gap-2.5 text-[20px]"><LogoMark className="size-9" /><Wordmark /></div></div>
          </div>
        </section>

        <section>
          <SectionHead no="02" label="Rənglər" lines={["Az rəng, *çox istilik.*"]} text="Kağız, mürəkkəb və alov. Qradiyent yalnız brend anlarında (loqo, hero). Kodu kopyalamaq üçün klikləyin." />
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {COLORS.map((c) => (
              <button key={c.hex} onClick={() => copy(c.hex)} className="surface group rounded-[22px] border border-ink-100/[0.08] p-3 text-left transition-[border-color] duration-200 hover:border-nar/30">
                <div className="h-24 rounded-xl border border-ink-100/10" style={{ background: c.hex }} />
                <div className="mt-3 flex items-baseline justify-between px-1">
                  <span className="font-display text-2xl">{c.name}</span>
                  <span className="font-mono text-[11px] text-ink-400 group-hover:text-nar-600">{c.hex}</span>
                </div>
                <div className="px-1 font-mono text-[10.5px] text-ink-500">{c.token}</div>
                <p className="px-1 pb-1 text-[13.5px] text-ink-400">{c.note}</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <SectionHead no="03" label="Tipoqrafiya" lines={["Fraunces, Onest,", "*Martian Mono.*"]} text="Hamısı Azərbaycan əlifbasını (ə, ğ, ı, ş, ç, ö, ü) tam dəstəkləyir və açıq lisenziyalıdır (OFL). Onest ₼ işarəsini də daşıyır." />
          <Glass className="mt-12 divide-y divide-ink-100/[0.07]">
            {[
              { l: "Başlıq · Fraunces 420", c: "font-display text-6xl tracking-[-0.035em]", t: "Sözlə de, sayt doğulsun." },
              { l: "Vurğu · Fraunces italic, şəfəq", c: "font-display text-4xl italic text-dawn", t: "bir cümlə uzaqlığındadır." },
              { l: "Mətn · Onest 400", c: "text-[16.5px] leading-relaxed text-ink-200", t: "Əə Ğğ Iı İi Öö Şş Çç Üü — 29,90 ₼. Hamısı düzgün və oxunaqlı." },
              { l: "Etiket · Martian Mono", c: "label-mono text-ink-400", t: "02 — Necə işləyir" },
              { l: "Kod · JetBrains Mono", c: "font-mono text-[13px] text-ink-300", t: "export default function App() {}" },
            ].map((x) => (
              <div key={x.l} className="grid gap-3 p-6 md:grid-cols-12">
                <span className="label-mono text-ink-500 md:col-span-3">{x.l}</span>
                <span className={`${x.c} md:col-span-9`}>{x.t}</span>
              </div>
            ))}
          </Glass>
        </section>

        <section>
          <SectionHead no="04" label="Komponentlər" lines={["Sakit, *dəqiq.*"]} />
          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            <Glass className="p-6">
              <div className="mb-4 label-mono text-ink-500">Düymələr</div>
              <div className="flex flex-wrap gap-3">
                <Button>Əsas <ArrowRight className="size-4" /></Button>
                <Button variant="white">Alov</Button>
                <Button variant="secondary">Səth</Button>
                <Button variant="outline">Kontur</Button>
                <Button variant="ghost">Şəffaf</Button>
              </div>
            </Glass>
            <Glass className="p-6">
              <div className="mb-4 label-mono text-ink-500">Nişanlar · bildirişlər</div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge>Neytral</Badge>
                <Badge tone="nar">Vurğu</Badge>
                <Badge tone="success">Hazır</Badge>
                <Badge tone="gold">Tezliklə</Badge>
                <span className="flex items-center gap-1 text-sm text-ink-400"><Kbd>Ctrl</Kbd>+<Kbd>1</Kbd></span>
              </div>
              <div className="mt-5 flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => toast.success("Yadda saxlanıldı")}>Bildiriş</Button>
                <Button size="sm" variant="secondary" onClick={() => toast.error("Xəta baş verdi")}>Xəta</Button>
              </div>
            </Glass>
            <Glass className="p-6 lg:col-span-2">
              <div className="mb-4 label-mono text-ink-500">Sorğu qutusu</div>
              <div className="max-w-2xl"><PromptBox onSubmit={() => toast.info("Bu nümunədir")} placeholder="Yazın, səslə deyin və ya şəkil atın…" /></div>
            </Glass>
          </div>
        </section>

        <section>
          <SectionHead no="05" label="Hərəkət" lines={["Hər animasiyanın *səbəbi var.*"]} />
          <Glass className="mt-12 grid gap-px overflow-hidden md:grid-cols-3">
            {[
              ["Səhnə", "Hero arxasında iki isti işıq yavaş üzür, kənarlarda zəif simvol sahəsi kursora reaksiya verir. Zəif cihazda sıxlıq azalır, tab gizlənəndə dayanır."],
              ["Mətn", "Başlıq sətir-sətir, blur 8px → 0 ilə gəlir; qalan elementlər 18px yuxarı qalxır, ease-out (0.22, 1, 0.36, 1). Rəqəmlər easeOutCubic ilə sayılır."],
              ["İnterfeys", "Düymələr basılanda 0.97-yə kiçilir; keçidlər 150–300ms. Klaviatura əməliyyatları animasiyasızdır. Azaldılmış hərəkət dəstəklənir."],
            ].map(([t, d]) => (
              <div key={t} className="p-6">
                <div className="font-display text-2xl">{t}</div>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-400">{d}</p>
              </div>
            ))}
          </Glass>
        </section>

        <section>
          <SectionHead
            no="06"
            label="Astryx"
            lines={["Meta-nın sistemi,", "*bizim şəfəq.*"]}
            text="Studiyanın əmr paleti, dialoqları və tooltip-ləri Astryx (Meta, MIT) üzərində qurulub. NovoCode mövzusu eyni CSS tokenlərinə istinad edir, ona görə gündüz/gecə rejimi avtomatik keçir: src/themes/burunc."
          />
          <AstryxShowcase />
        </section>
      </Container>
    </div>
  );
}
