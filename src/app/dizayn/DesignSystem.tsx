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
  { name: "Səhnə", token: "ink-1000", hex: "#000000", note: "Qara səhnə və video fon" },
  { name: "Mətn", token: "ink / ink-100", hex: "#ffffff", note: "Başlıqlar, ağ pill-lər, əsas düymə" },
  { name: "Qrafit pill", token: "pill / ink-700", hex: "#28282a", note: "Tünd pill, trust halqaları, burger" },
  { name: "Yumşaq mətn", token: "ink-200", hex: "#d0d0d0", note: "Alt başlıqlar (80% şəffaflıq)" },
  { name: "Trust mətni", token: "ink-300", hex: "#c4c2c3", note: "İkinci dərəcəli mətn" },
  { name: "Səssiz", token: "ink-400", hex: "#8e8e8e", note: "Etiketlər, statistika adları" },
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
          <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-400">Dizayn sistemi · Nöqtə</span>
        </Container>
      </header>

      <Container className="py-24">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-400">
          <span className="text-white">Novo Code</span> — Dizayn sistemi
        </div>
        <SplitTitle as="h1" immediate lines={["Qara səhnə,", "*nöqtəli işıq.*"]} className="mt-6 text-[clamp(2.4rem,7vw,6rem)] leading-[1.04]" />
        <p className="mt-8 max-w-2xl text-[17px] leading-relaxed text-ink-300">
          Novo-nun dünyası monoxromdur: qara səhnədə tam ekran video, üstündə nöqtəli (dot-matrix) başlıqlar, ağ pill-lər və tək yumşaq ağ parıltı — əsas düymə üçün. Rəng istifadəçinin saytına aiddir, bizim interfeysə yox.
        </p>
      </Container>

      <Container className="space-y-32 pb-32">
        <section>
          <SectionHead no="01" label="Brend" lines={["Ağ disk, *nöqtəli N.*"]} text="7×7 nöqtə şəbəkəsində N hərfi — başlıq şriftinin piksel dili. Ağ diskdə, yumşaq kölgə ilə." />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <Glass className="grid aspect-square place-items-center"><LogoMark className="size-36" /></Glass>
            <Glass className="grid place-items-center p-10"><Logo /></Glass>
            <div className="grid place-items-center rounded-2xl bg-ink p-10 text-ink-1000"><div className="flex items-center gap-2.5"><LogoMark className="size-7" /><Wordmark /></div></div>
          </div>
        </section>

        <section>
          <SectionHead no="02" label="Rənglər" lines={["Rəngsiz, *amma soyuq deyil.*"]} text="Qara, ağ və qrafit. Vurğu rəng yox, işıqdır. Kodu kopyalamaq üçün klikləyin." />
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {COLORS.map((c) => (
              <button key={c.hex} onClick={() => copy(c.hex)} className="glass group rounded-2xl border border-ink-100/10 p-3 text-left transition-[border-color] duration-200 hover:border-ink-100/25">
                <div className="h-24 rounded-xl border border-ink-100/10" style={{ background: c.hex }} />
                <div className="mt-3 flex items-baseline justify-between px-1">
                  <span className="font-display text-2xl">{c.name}</span>
                  <span className="font-mono text-[11px] text-ink-400 group-hover:text-white">{c.hex}</span>
                </div>
                <div className="px-1 font-mono text-[10.5px] text-ink-500">{c.token}</div>
                <p className="px-1 pb-1 text-[13.5px] text-ink-400">{c.note}</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <SectionHead no="03" label="Tipoqrafiya" lines={["Geist Pixel, Inter,", "*JetBrains Mono.*"]} text="Hər üçü Azərbaycan əlifbasını (ə, ğ, ı, ş, ç, ö, ü) tam dəstəkləyir və açıq lisenziyalıdır (OFL)." />
          <Glass className="mt-12 divide-y divide-ink-100/[0.07]">
            {[
              { l: "Display · Geist Pixel Circle", c: "font-display text-6xl tracking-[-0.04em]", t: "Sözlə de, sayt doğulsun." },
              { l: "Vurğu · Geist Pixel, səssiz ton", c: "font-display text-4xl tracking-[-0.04em] text-ink-400", t: "bir cümlə uzaqlığındadır." },
              { l: "Mətn · Inter 400", c: "text-[16.5px] leading-relaxed text-ink-200", t: "Əə Ğğ Iı İi Öö Şş Çç Üü — hamısı düzgün və oxunaqlı." },
              { l: "Etiket · JetBrains Mono", c: "font-mono text-[11px] uppercase tracking-[0.2em] text-ink-400", t: "02 — Necə işləyir" },
            ].map((x) => (
              <div key={x.l} className="grid gap-3 p-6 md:grid-cols-12">
                <span className="font-mono text-[10.5px] text-ink-500 md:col-span-3">{x.l}</span>
                <span className={`${x.c} md:col-span-9`}>{x.t}</span>
              </div>
            ))}
          </Glass>
        </section>

        <section>
          <SectionHead no="04" label="Komponentlər" lines={["Sakit, *dəqiq.*"]} />
          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            <Glass className="p-6">
              <div className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-500">Düymələr</div>
              <div className="flex flex-wrap gap-3">
                <Button className="shadow-[var(--shadow-glow)]">Əsas <ArrowRight className="size-4" /></Button>
                <Button variant="white">Ağ</Button>
                <Button variant="secondary">Şüşə</Button>
                <Button variant="outline">Kontur</Button>
                <Button variant="ghost">Şəffaf</Button>
              </div>
            </Glass>
            <Glass className="p-6">
              <div className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-500">Nişanlar · bildirişlər</div>
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
              <div className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-500">Sorğu qutusu</div>
              <div className="max-w-2xl"><PromptBox onSubmit={() => toast.info("Bu nümunədir")} placeholder="Yazın, səslə deyin və ya şəkil atın…" /></div>
            </Glass>
          </div>
        </section>

        <section>
          <SectionHead no="05" label="Hərəkət" lines={["Hər animasiyanın *səbəbi var.*"]} />
          <Glass className="mt-12 grid gap-px overflow-hidden md:grid-cols-3">
            {[
              ["Səhnə", "Tam ekran video fon dövrə vurur; azaldılmış hərəkətdə dayanır, tab gizlənəndə pauza edir."],
              ["Mətn", "Hero sətir-sətir gəlir (14px → 0); qalan elementlər blur 6px → 0, 0.98 → 1, ease-out (0.22, 1, 0.36, 1). Rəqəmlər easeOutCubic ilə sayılır."],
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
            lines={["Meta-nın sistemi,", "*bizim nöqtə.*"]}
            text="Studiyanın əmr paleti, dialoqları və tooltip-ləri Astryx (Meta, MIT) üzərində qurulub. Novo mövzusu eyni monoxrom tokenlərdən yığılıb: src/themes/burunc."
          />
          <AstryxShowcase />
        </section>
      </Container>
    </div>
  );
}
