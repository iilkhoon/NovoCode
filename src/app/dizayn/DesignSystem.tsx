"use client";
import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { Logo, LogoMark, Wordmark } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Badge, Eyebrow, Kbd } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { PromptBox } from "@/components/PromptBox";
import { Knots } from "@/components/carpet/Knots";
import { GLYPHS, borderBand, medallion } from "@/components/carpet/patterns";
import { Container, SectionHead } from "@/components/landing/Section";
import { Border } from "@/components/landing/Border";

const DYES = [
  { name: "Yun", token: "wool", hex: "#f1e9da", note: "Boyanmamış yun — səhifə fonu", dark: false },
  { name: "Mürəkkəb", token: "ink", hex: "#1c1f2e", note: "Mətn, xətlər, əsas düymə", dark: true },
  { name: "Nar", token: "nar", hex: "#a82a2d", note: "Boyaq kökü qırmızısı — vurğu", dark: true },
  { name: "İndiqo", token: "indigo", hex: "#24386b", note: "Dərin fon, ikinci rəng", dark: true },
  { name: "Zəfəran", token: "saffron", hex: "#d29a2e", note: "Kiçik vurğular, tünd fonda", dark: false },
  { name: "Qoz", token: "walnut", hex: "#4e5b36", note: "Uğur, təsdiq", dark: true },
];

function copy(v: string) {
  navigator.clipboard.writeText(v).then(() => toast.success(`${v} kopyalandı`));
}

export function DesignSystem() {
  const med = useMemo(() => medallion(25), []);
  const band = useMemo(() => borderBand(48), []);
  return (
    <div className="grain relative">
      <header className="sticky top-0 z-40 border-b border-ink-100/15 bg-wool">
        <Container className="flex h-16 items-center justify-between">
          <Logo />
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400">Dizayn sistemi · Xalça</span>
        </Container>
      </header>

      <Container className="py-16">
        <Eyebrow>
          <span className="text-nar">Novo Code</span> — Dizayn sistemi
        </Eyebrow>
        <h1 className="mt-6 max-w-4xl font-display text-[3.2rem] font-medium leading-[0.98] tracking-[-0.03em] sm:text-[5rem] [font-variation-settings:'SOFT'_50,'opsz'_144]">
          Hər düyün <em className="text-nar">bir piksel.</em>
        </h1>
        <p className="mt-6 max-w-2xl text-[17.5px] leading-relaxed text-ink-300">
          Xalça düyün-düyün toxunur; sayt da piksel-piksel. Bu sistem Azərbaycan xalçasının təbii boyalarından, həndəsəsindən və toxuma ritmindən götürülüb. Qradiyent, parıltı, şüşə effekti yoxdur — yalnız düz rəng, xətt və düyün.
        </p>
      </Container>
      <Border />

      <Container className="space-y-24 py-24">
        <section>
          <SectionHead no="01" label="Brend" title="Loqo — kiçik göl" text="9×9 düyündən toxunmuş pilləli romb; mərkəzində nar dənəsi. Ölçüsündən asılı olmayaraq kəskin görünür." />
          <div className="mt-12 grid gap-px border-[1.5px] border-ink bg-ink md:grid-cols-3">
            <div className="grid aspect-square place-items-center bg-ink-1000 p-10"><LogoMark className="size-40" /></div>
            <div className="grid place-items-center bg-wool p-10"><Logo /></div>
            <div className="grid place-items-center bg-indigo p-10 text-wool"><div className="flex items-center gap-2.5"><LogoMark className="size-7" /><Wordmark /></div></div>
          </div>
        </section>

        <section>
          <SectionHead no="02" label="Rənglər" title="Təbii boyalar" text="Altı rəng — xalçaçıların əsrlərlə istifadə etdiyi boyalar. Kodu kopyalamaq üçün klikləyin." />
          <div className="mt-12 grid border-t-[1.5px] border-ink sm:grid-cols-2 lg:grid-cols-3">
            {DYES.map((d) => (
              <button key={d.token} onClick={() => copy(d.hex)} className="group border-b border-ink-100/15 py-5 text-left sm:px-5 sm:[&:nth-child(odd)]:pl-0">
                <div className="h-24 border border-ink-100/15" style={{ background: d.hex }} />
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="font-display text-xl">{d.name}</span>
                  <span className="font-mono text-[11.5px] text-ink-400 group-hover:text-nar">{d.hex}</span>
                </div>
                <div className="font-mono text-[11px] text-ink-500">--color-{d.token}</div>
                <p className="mt-1 text-[14px] text-ink-400">{d.note}</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <SectionHead no="03" label="Tipoqrafiya" title="Fraunces, Onest, JetBrains Mono" text="Hər üçü Azərbaycan əlifbasını (ə, ğ, ı, ş, ç, ö, ü) tam dəstəkləyir." />
          <div className="mt-12 border-t-[1.5px] border-ink">
            {[
              { l: "Başlıq · Fraunces 500 · opsz 144", c: "font-display text-[3.4rem] font-medium leading-none tracking-[-0.03em]", t: "Sözlə deyin." },
              { l: "Vurğu · Fraunces italic · WONK", c: "font-display text-[2.4rem] italic text-nar [font-variation-settings:'SOFT'_100,'WONK'_1]", t: "saytınız toxunsun." },
              { l: "Mətn · Onest 400 · 17px", c: "text-[17px] leading-relaxed text-ink-300", t: "Əə Ğğ Iı İi Öö Şş Çç Üü — hamısı düzgün və oxunaqlı." },
              { l: "Etiket · JetBrains Mono · böyük hərf", c: "font-mono text-[11.5px] uppercase tracking-[0.14em] text-ink-400", t: "№ 02 — Necə işləyir" },
            ].map((x) => (
              <div key={x.l} className="grid gap-3 border-b border-ink-100/15 py-6 md:grid-cols-12">
                <span className="font-mono text-[11px] text-ink-500 md:col-span-3">{x.l}</span>
                <span className={`${x.c} md:col-span-9`}>{x.t}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionHead no="04" label="Naxışlar" title="Düyün kitabxanası" text="Bütün naxışlar koddan yaranır (src/components/carpet). İkon əvəzinə kiçik 7×7 motivlər istifadə olunur." />
          <div className="mt-12 grid gap-8 lg:grid-cols-12">
            <figure className="lg:col-span-5">
              <div className="border-[1.5px] border-ink bg-ink-1000 p-5"><Knots pattern={med} weave className="block w-full" /></div>
              <figcaption className="mt-3 font-mono text-[11px] text-ink-400"><span className="text-nar">medallion(25)</span> — göl naxışı</figcaption>
            </figure>
            <div className="space-y-8 lg:col-span-7">
              <figure>
                <div className="border-[1.5px] border-ink bg-ink-1000 p-4"><Knots pattern={band} className="block w-full" /></div>
                <figcaption className="mt-3 font-mono text-[11px] text-ink-400"><span className="text-nar">borderBand()</span> — haşiyə zolağı</figcaption>
              </figure>
              <div className="grid grid-cols-4 gap-px border-[1.5px] border-ink bg-ink">
                {Object.entries(GLYPHS).map(([k, g]) => (
                  <div key={k} className="flex flex-col items-center gap-2 bg-ink-1000 p-5">
                    <Knots pattern={g} className="size-10" gap={0.12} />
                    <span className="font-mono text-[10.5px] text-ink-400">{k}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section>
          <SectionHead no="05" label="Komponentlər" title="Düz, kəskin, toxunaqlı" />
          <div className="mt-12 grid gap-px border-[1.5px] border-ink bg-ink lg:grid-cols-2">
            <div className="bg-ink-1000 p-6">
              <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400">Düymələr</div>
              <div className="flex flex-wrap gap-3">
                <Button>Başla <ArrowRight className="size-4" /></Button>
                <Button variant="white">Mürəkkəb</Button>
                <Button variant="outline">Kontur</Button>
                <Button variant="secondary">İkinci dərəcəli</Button>
                <Button variant="ghost">Şəffaf</Button>
              </div>
            </div>
            <div className="bg-ink-1000 p-6">
              <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400">Nişanlar · bildirişlər</div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge>Neytral</Badge>
                <Badge tone="nar">Nar</Badge>
                <Badge tone="success">Hazır</Badge>
                <Badge tone="gold">Tezliklə</Badge>
                <span className="flex items-center gap-1 text-sm text-ink-400"><Kbd>Ctrl</Kbd>+<Kbd>1</Kbd></span>
              </div>
              <div className="mt-5 flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => toast.success("Yadda saxlanıldı")}>Bildiriş</Button>
                <Button size="sm" variant="secondary" onClick={() => toast.error("Xəta baş verdi")}>Xəta</Button>
              </div>
            </div>
            <div className="bg-wool p-6 lg:col-span-2">
              <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400">Sorğu qutusu</div>
              <div className="max-w-2xl"><PromptBox onSubmit={() => toast.info("Bu nümunədir")} placeholder="Yazın, səslə deyin və ya şəkil atın…" /></div>
            </div>
          </div>
        </section>

        <section>
          <SectionHead no="06" label="Qaydalar" title="Nə edirik, nə etmirik" />
          <div className="mt-12 grid border-t-[1.5px] border-ink md:grid-cols-2">
            <div className="border-b border-ink-100/15 py-6 md:border-r md:pr-8">
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-success">Edirik</div>
              <ul className="mt-4 space-y-2 text-[15px] text-ink-300">
                {["Düz təbii boya rəngləri", "Nazik xətlər və nömrələnmiş bölmələr", "Sola düzülmüş, jurnal kimi oxunan mətn", "Mənalı hərəkət: toxuma, sıra-sıra görünmə", "Real məhsul ekranı və dürüst rəqəmlər"].map((x) => <li key={x}>— {x}</li>)}
              </ul>
            </div>
            <div className="border-b border-ink-100/15 py-6 md:pl-8">
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-nar">Etmirik</div>
              <ul className="mt-4 space-y-2 text-[15px] text-ink-300">
                {["Qradiyent, parıltı, şüşə effekti", "Emoji və ✨ ikonları", "Bulanıqlıqla görünən mətn", "Uydurma rəylər və saxta statistika", "Hər şeyi mərkəzə düzmək"].map((x) => <li key={x}>— {x}</li>)}
              </ul>
            </div>
          </div>
        </section>
      </Container>
      <Border weave={false} />
    </div>
  );
}
