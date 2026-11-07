"use client";
import { ArrowRight } from "lucide-react";
import { Logo, LogoMark, Wordmark } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Badge, Kbd } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { PromptBox } from "@/components/PromptBox";
import { Container, Glass, SectionHead } from "@/components/landing/Section";
import { SplitTitle } from "@/components/landing/SplitTitle";

const COLORS = [
  { name: "Səhnə", token: "ink-1000 / ink-950", hex: "#000000", note: "Qara səhnə — WebGL fonu" },
  { name: "Mətn", token: "ink", hex: "#fff6ed", note: "İsti ağ — başlıqlar və mətn" },
  { name: "Bürünc", token: "nar", hex: "#c98a52", note: "Yeganə vurğu rəngi" },
  { name: "Açıq bürünc", token: "nar-300", hex: "#e6b78f", note: "Kursiv vurğu, ikonlar" },
  { name: "Qızılı", token: "saffron", hex: "#e2b06a", note: "Kiçik işıq nöqtələri" },
  { name: "Sapfir", token: "indigo", hex: "#2c4a78", note: "Səhnənin soyuq tərəfi" },
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
          <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-400">Dizayn sistemi · Bürünc</span>
        </Container>
      </header>

      <Container className="py-24">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-400">
          <span className="text-nar-300">Novo Code</span> — Dizayn sistemi
        </div>
        <SplitTitle as="h1" immediate lines={["Qara səhnə,", "*bürünc işıq.*"]} className="mt-6 text-[clamp(3rem,9vw,8rem)] leading-[0.92]" />
        <p className="mt-8 max-w-2xl text-[17px] leading-relaxed text-ink-300">
          Novo-nun dünyası kinematikdir: qara səhnədə ərimiş bürüncdən bir forma, ətrafında qığılcımlar və yavaş dalğalar. İşıq CSS effektlərindən yox, səhnənin özündən gəlir. Tipoqrafiya zərif və nazikdir, tək vurğu rəngi bürüncdür.
        </p>
      </Container>

      <Container className="space-y-32 pb-32">
        <section>
          <SectionHead no="01" label="Brend" lines={["Disk və *orbit.*"]} text="Bürünc disk, içində N; ətrafında nazik orbit xətti — səhnədəki formanın kiçik əks-sədası." />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <Glass className="grid aspect-square place-items-center"><LogoMark className="size-36" /></Glass>
            <Glass className="grid place-items-center p-10"><Logo /></Glass>
            <div className="grid place-items-center rounded-2xl bg-ink p-10 text-ink-1000"><div className="flex items-center gap-2.5"><LogoMark className="size-7" /><Wordmark /></div></div>
          </div>
        </section>

        <section>
          <SectionHead no="02" label="Rənglər" lines={["Bir *vurğu.*"]} text="Neytral qaralar və isti ağ üzərində yalnız bürünc. Kodu kopyalamaq üçün klikləyin." />
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {COLORS.map((c) => (
              <button key={c.hex} onClick={() => copy(c.hex)} className="glass group rounded-2xl border border-ink-100/10 p-3 text-left transition-[border-color] duration-200 hover:border-ink-100/25">
                <div className="h-24 rounded-xl border border-ink-100/10" style={{ background: c.hex }} />
                <div className="mt-3 flex items-baseline justify-between px-1">
                  <span className="font-display text-2xl font-light">{c.name}</span>
                  <span className="font-mono text-[11px] text-ink-400 group-hover:text-nar-300">{c.hex}</span>
                </div>
                <div className="px-1 font-mono text-[10.5px] text-ink-500">{c.token}</div>
                <p className="px-1 pb-1 text-[13.5px] text-ink-400">{c.note}</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <SectionHead no="03" label="Tipoqrafiya" lines={["Cormorant, Onest,", "*JetBrains Mono.*"]} text="Hər üçü Azərbaycan əlifbasını (ə, ğ, ı, ş, ç, ö, ü) tam dəstəkləyir." />
          <Glass className="mt-12 divide-y divide-ink-100/[0.07]">
            {[
              { l: "Display · Cormorant Garamond 300", c: "font-display text-6xl font-light", t: "Sözlə de, sayt doğulsun." },
              { l: "Vurğu · Cormorant italic", c: "font-display text-4xl font-light italic text-nar-300", t: "bir cümlə uzaqlığındadır." },
              { l: "Mətn · Onest 400", c: "text-[16.5px] leading-relaxed text-ink-200", t: "Əə Ğğ Iı İi Öö Şş Çç Üü — hamısı düzgün və oxunaqlı." },
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
                <Button>Bürünc <ArrowRight className="size-4" /></Button>
                <Button variant="white">İsti ağ</Button>
                <Button variant="secondary">Şüşə</Button>
                <Button variant="outline">Kontur</Button>
                <Button variant="ghost">Şəffaf</Button>
              </div>
            </Glass>
            <Glass className="p-6">
              <div className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-500">Nişanlar · bildirişlər</div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge>Neytral</Badge>
                <Badge tone="nar">Bürünc</Badge>
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
              ["Səhnə", "Kamera scroll ilə formanın ətrafında 360° fırlanır, forma mətnə yer açmaq üçün sola-sağa keçir. Hamarlama: lerp."],
              ["Mətn", "Başlıqlar ekrana girəndə hərf-hərf qalxır: 0.5em, blur 10px → 0, 28ms fasilə, ease-out (0.23, 1, 0.32, 1)."],
              ["İnterfeys", "Düymələr basılanda 0.97-yə kiçilir; keçidlər 150–300ms. Klaviatura əməliyyatları animasiyasızdır. Azaldılmış hərəkət dəstəklənir."],
            ].map(([t, d]) => (
              <div key={t} className="p-6">
                <div className="font-display text-2xl font-light">{t}</div>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-400">{d}</p>
              </div>
            ))}
          </Glass>
        </section>
      </Container>
    </div>
  );
}
