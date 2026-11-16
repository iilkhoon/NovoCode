"use client";
import { useState } from "react";
import { ArrowRight, Bell, Download, Inbox, Link2, Plus, Rocket, Settings, Sparkles, Trash2 } from "lucide-react";
import { Logo, LogoMark, Wordmark } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, Avatar, Checkbox, EmptyState, Field, Input, Kbd, Menu, MenuItem, MenuSeparator, Modal, Progress, Radio, Segmented, Select, Skeleton, Spinner, Switch, Tabs, Textarea, Tooltip } from "@/components/ui/kit";
import { toast } from "@/components/ui/toast";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { PromptBox } from "@/components/PromptBox";
import { openModal } from "@/lib/ui-store";
import { cn } from "@/lib/cn";

/** Brand palette with the reasoning behind each colour. */
const COLORS = [
  { name: "Novo bənövşəyi", token: "nar", hex: "#6447ff", cls: "bg-nar", note: "Əsas vurğu. Texnologiya, yaradıcılıq və premium hissi; ağ mətnlə yüksək kontrast. Əsas düymələr və aktiv hallar." },
  { name: "Qradiyent", token: "bg-brand", hex: "#3b82f6 → #ff9a5a", cls: "bg-brand", note: "Göy → bənövşəyi → çəhrayı → narıncı. Reklam, “Yüksəlt”, loqo, hero işığı." },
  { name: "Fon", token: "wool", hex: "#f7f7f8", cls: "bg-wool ring-1 ring-inset ring-ink-100/10", note: "Neytral, sakit fon — məzmun və rənglər önə çıxır." },
  { name: "Səth", token: "ink-1000", hex: "#ffffff", cls: "bg-ink-1000 ring-1 ring-inset ring-ink-100/10", note: "Kartlar, pəncərələr, panellər." },
  { name: "Mürəkkəb", token: "ink-100", hex: "#0b0b12", cls: "bg-ink-100", note: "Mətn və tünd əsas düymə." },
  { name: "Səssiz", token: "ink-400", hex: "#5f5f6b", cls: "bg-ink-400", note: "İkinci dərəcəli mətn, ipucları." },
];
const STATUS = [
  { name: "Uğur", cls: "bg-success" },
  { name: "Xəbərdarlıq", cls: "bg-warning" },
  { name: "Xəta", cls: "bg-danger" },
  { name: "Məlumat", cls: "bg-info" },
];

function Block({ id, n, title, desc, children }: { id: string; n: string; title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-ink-100/8 py-16">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <header>
          <p className="label-mono text-nar">{n}</p>
          <h2 className="mt-2 font-display text-[30px] font-[650] tracking-[-0.025em] text-ink-100">{title}</h2>
          {desc && <p className="mt-2 text-[14px] leading-relaxed text-ink-400">{desc}</p>}
        </header>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => <div className={cn("rounded-3xl border border-ink-100/8 bg-ink-1000 p-6 shadow-[var(--shadow-card)]", className)}>{children}</div>;
const Label = ({ children }: { children: React.ReactNode }) => <p className="mb-3 text-[12px] font-medium text-ink-500">{children}</p>;

const NAV = [
  ["brend", "Brend"],
  ["reng", "Rəng"],
  ["sriftler", "Şriftlər"],
  ["duymeler", "Düymələr"],
  ["formalar", "Formalar"],
  ["secim", "Seçim"],
  ["naviqasiya", "Naviqasiya"],
  ["bildirisler", "Bildirişlər"],
  ["pencereler", "Pəncərələr"],
  ["melumat", "Məlumat"],
  ["hereket", "Hərəkət"],
];

export function DesignSystem() {
  const [seg, setSeg] = useState<"site" | "landing" | "app">("site");
  const [tab, setTab] = useState<"a" | "b" | "c">("a");
  const [menu, setMenu] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [emailErr, setEmailErr] = useState(true);

  return (
    <div className="min-h-dvh bg-wool">
      <header className="sticky top-0 z-40 border-b border-ink-100/8 bg-wool/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-4 px-4 sm:px-8">
          <Logo />
          <span className="hidden label-mono text-ink-400 sm:inline">Dizayn sistemi · v3</span>
          <nav className="scroll-thin ml-auto hidden gap-1 overflow-x-auto xl:flex">
            {NAV.map(([id, l]) => (
              <a key={id} href={`#${id}`} className="rounded-full px-2.5 py-1 text-[12.5px] text-ink-400 hover:bg-ink-100/[0.05] hover:text-ink-100">
                {l}
              </a>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-[1240px] px-4 sm:px-8">
        {/* intro */}
        <section className="relative isolate overflow-hidden py-20">
          <div aria-hidden className="aurora -z-10 opacity-60">
            <i />
            <i />
            <i />
            <i />
          </div>
          <p className="label-mono text-ink-400">NovoCode · v2</p>
          <h1 className="mt-4 max-w-[900px] font-display text-[clamp(40px,7vw,88px)] font-[650] leading-[1] tracking-[-0.035em] text-ink-100 ">
            Sadə forma, <em className="not-italic text-brand">canlı rəng.</em>
          </h1>
          <p className="mt-6 max-w-[620px] text-[17px] leading-relaxed text-ink-400">
            Bir vurğu rəngi, sakit neytrallar, bir həndəsi şrift və yumşaq hərəkət. Hər ekran eyni qaydalarla qurulur: bir əsas əməliyyat, aydın iyerarxiya, heç bir səs-küy.
          </p>
        </section>

        <Block id="brend" n="01" title="Brend" desc="“n” hərfi və yanıb-sönən kursor: yazılmaqda olan bir cümlə. Qradiyent kafel — dan yeri.">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="grid place-items-center py-12">
              <LogoMark className="size-24" blink />
            </Card>
            <Card className="grid place-items-center py-12 text-[34px]">
              <Wordmark />
            </Card>
            <Card className="grid place-items-center bg-ink-100 py-12 text-[26px] [&_*]:!text-wool">
              <Logo />
            </Card>
          </div>
          <div className="mt-4 h-28 rounded-3xl bg-brand shadow-[var(--shadow-glow)]" />
          <p className="mt-2 text-[12.5px] text-ink-500">bg-brand · #ffb070 → #f2783a → #e4561f → #c2335a → #7a2e58 · reklam, kredit kartı, “Yüksəlt”</p>
        </Block>

        <Block id="reng" n="02" title="Rəng" desc="Niyə bənövşəyi? AI və texnologiya ilə assosiasiya olunur, etibar (göy) və enerjini (çəhrayı-narıncı) birləşdirir; qradiyent reklamda yadda qalır.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {COLORS.map((c) => (
              <button key={c.name} type="button" onClick={() => navigator.clipboard.writeText(c.hex).then(() => toast.success(`${c.hex} kopyalandı`))} className="overflow-hidden rounded-3xl border border-ink-100/8 bg-ink-1000 text-left transition-transform hover:-translate-y-0.5">
                <div className={cn("h-24", c.cls)} />
                <div className="p-4">
                  <p className="flex items-baseline justify-between text-[14.5px] font-medium text-ink-100">
                    {c.name} <span className="font-mono text-[11.5px] text-ink-500">{c.hex}</span>
                  </p>
                  <p className="font-mono text-[11.5px] text-nar">{c.token}</p>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-ink-400">{c.note}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {STATUS.map((s) => (
              <span key={s.name} className="flex items-center gap-2 rounded-full border border-ink-100/8 bg-ink-1000 px-3 py-1.5 text-[13px] text-ink-300">
                <span className={cn("size-3 rounded-full", s.cls)} />
                {s.name}
              </span>
            ))}
          </div>
        </Block>

        <Block id="sriftler" n="03" title="Şriftlər" desc="Hamısı Azərbaycan hərflərini (ə ğ ı ş ç ö ü) və ₼ işarəsini dəstəkləyir.">
          <Card className="flex flex-col gap-6">
            <div>
              <Label>Plus Jakarta Sans — başlıqlar (650)</Label>
              <p className="font-display text-[56px] font-[650] leading-none tracking-[-0.03em] text-ink-100">Sözlə de, <em className=" text-brand">doğulsun.</em></p>
            </div>
            <div>
              <Label>Plus Jakarta Sans — interfeys və mətn</Label>
              <p className="text-[18px] leading-relaxed text-ink-200">Gözəl, işlək sayt — dəqiqələr içində. Qiymət: 29 ₼ / ay. Şəkil, ğ, ı, ə, ö, ü, ç, ş.</p>
            </div>
            <div>
              <Label>JetBrains Mono — etiketlər və kod</Label>
              <p className="label-mono text-ink-400">№ 02 — Necə işləyir</p>
            </div>
            <div className="grid min-w-0 gap-2 overflow-hidden border-t border-ink-100/8 pt-5 text-ink-100">
              {[
                ["Display", "font-display text-[44px] tracking-[-0.03em]"],
                ["H1", "font-display text-[34px] tracking-[-0.025em]"],
                ["H2", "font-display text-[26px] tracking-[-0.02em]"],
                ["Başlıq", "text-[16px] font-medium"],
                ["Mətn", "text-[14.5px]"],
                ["Kiçik", "text-[12.5px] text-ink-400"],
              ].map(([n, c]) => (
                <div key={n} className="flex items-baseline gap-6">
                  <span className="w-16 shrink-0 font-mono text-[11px] text-ink-500">{n}</span>
                  <span className={cn("min-w-0 flex-1 truncate leading-tight", c)}>Sayt qurmaq heç bu qədər asan olmayıb</span>
                </div>
              ))}
            </div>
          </Card>
        </Block>

        <Block id="duymeler" n="04" title="Düymələr" desc="Hər ekranda yalnız bir “alov” düyməsi — ən vacib əməliyyat.">
          <Card className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="white">
                <Rocket className="size-4" /> Yayımla
              </Button>
              <Button variant="primary">
                Davam et <ArrowRight className="size-4" />
              </Button>
              <Button variant="secondary">İkinci dərəcəli</Button>
              <Button variant="outline">Kontur</Button>
              <Button variant="ghost">Xəyali</Button>
              <Button className="!bg-danger !text-white">
                <Trash2 className="size-4" /> Sil
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Kiçik</Button>
              <Button size="md">Orta</Button>
              <Button size="lg">Böyük</Button>
              <Button disabled>Deaktiv</Button>
              <Button variant="secondary" disabled>
                <Spinner /> Yüklənir…
              </Button>
              <Tooltip label="Yeni layihə">
                <button type="button" aria-label="Yeni layihə" className="grid size-10 place-items-center rounded-full bg-ink-100/[0.06] text-ink-200 transition-colors hover:bg-ink-100/[0.1]">
                  <Plus className="size-4" />
                </button>
              </Tooltip>
            </div>
          </Card>
        </Block>

        <Block id="formalar" n="05" title="Formalar" desc="Fokus halında alov haşiyəsi; xəta mətni sahənin altında, ekran oxuyucuları üçün bağlı.">
          <Card className="grid gap-5 md:grid-cols-2">
            <Field label="Layihənin adı" hint="Sonra da dəyişə bilərsiniz.">
              {(id, d) => <Input id={id} aria-describedby={d} placeholder="Kofe evi" />}
            </Field>
            <Field label="E-poçt" error={emailErr ? "E-poçt ünvanı düzgün deyil" : undefined}>
              {(id, d) => <Input id={id} aria-describedby={d} aria-invalid={emailErr} defaultValue="ad@" onChange={(e) => setEmailErr(!/^\S+@\S+\.\S+$/.test(e.target.value))} />}
            </Field>
            <Field label="Kateqoriya">
              {(id) => (
                <Select id={id} defaultValue="shop">
                  <option value="shop">Mağaza</option>
                  <option value="food">Restoran</option>
                  <option value="clinic">Klinika</option>
                </Select>
              )}
            </Field>
            <Field label="Deaktiv sahə">{(id) => <Input id={id} disabled value="Redaktə olunmur" readOnly />}</Field>
            <Field label="Təsvir" className="md:col-span-2">
              {(id) => <Textarea id={id} placeholder="Biznesiniz haqqında bir-iki cümlə…" />}
            </Field>
            <div className="md:col-span-2">
              <Label>Əsas sorğu qutusu</Label>
              <PromptBox onSubmit={() => toast.info("Bu nümunədir")} placeholder="Yazın, səslə deyin və ya şəkil atın…" />
            </div>
          </Card>
        </Block>

        <Block id="secim" n="06" title="Seçim" desc="Checkbox, radio və açar — eyni ölçü, eyni animasiya, klaviatura ilə tam idarə.">
          <Card className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col gap-4">
              <Label>Checkbox</Label>
              <Checkbox defaultChecked label="Dizaynı götür" />
              <Checkbox label="Mətnləri köçür" description="Yalnız öz saytınız üçün" />
              <Checkbox disabled label="Deaktiv" />
              <label className="flex items-center gap-3 text-[14px] text-ink-100">
                <input type="checkbox" className="nv-check" ref={(el) => void (el && (el.indeterminate = true))} /> Qarışıq hal
              </label>
            </div>
            <div className="flex flex-col gap-4">
              <Label>Radio</Label>
              <Radio name="r" defaultChecked label="Aylıq" />
              <Radio name="r" label="İllik" description="20% endirim" />
              <Radio name="r" disabled label="Deaktiv" />
            </div>
            <div className="flex flex-col gap-4">
              <Label>Açar</Label>
              <Switch defaultChecked label="Avtomatik düzəliş" />
              <Switch label="Səs siqnalı" description="Sayt hazır olanda" />
              <Switch disabled label="Deaktiv" />
            </div>
          </Card>
        </Block>

        <Block id="naviqasiya" n="07" title="Naviqasiya">
          <Card className="flex flex-col gap-8">
            <div>
              <Label>Seqment</Label>
              <Segmented label="Layihə növü" value={seg} onChange={setSeg} options={[{ value: "site", label: "Sayt" }, { value: "landing", label: "Landing" }, { value: "app", label: "Web tətbiq" }]} />
            </div>
            <div>
              <Label>Tablar</Label>
              <Tabs value={tab} onChange={setTab} tabs={[{ value: "a", label: "Önizləmə" }, { value: "b", label: "Kod", count: 12 }, { value: "c", label: "Fayllar" }]} />
            </div>
            <div className="relative w-fit">
              <Label>Menyu</Label>
              <Button variant="secondary" onClick={() => setMenu((m) => !m)} aria-expanded={menu}>
                Əməliyyatlar
              </Button>
              <Menu open={menu} onClose={() => setMenu(false)} align="start">
                <MenuItem icon={<Settings />} hint="⌘,">Parametrlər</MenuItem>
                <MenuItem icon={<Link2 />}>Paylaş</MenuItem>
                <MenuItem icon={<Download />}>Kodu yüklə</MenuItem>
                <MenuSeparator />
                <MenuItem icon={<Trash2 />} danger>
                  Sil
                </MenuItem>
              </Menu>
            </div>
          </Card>
        </Block>

        <Block id="bildirisler" n="08" title="Bildirişlər" desc="Qısa bildirişlər sağ altda, vacib xəbərdarlıqlar səhifənin içində.">
          <div className="flex flex-col gap-4">
            <Card className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={() => toast.success("Yadda saxlanıldı")}>Uğur</Button>
              <Button size="sm" variant="secondary" onClick={() => toast.error("Yayımlamaq alınmadı", "İnternet bağlantısını yoxlayın.")}>Xəta</Button>
              <Button size="sm" variant="secondary" onClick={() => toast.warning("Kredit azalır", "Bu gün 1 mesaj qalıb.")}>Xəbərdarlıq</Button>
              <Button size="sm" variant="secondary" onClick={() => toast.show({ tone: "success", title: "Layihə silindi", description: "Kofe evi", action: { label: "Geri qaytar", onClick: () => toast.success("Bərpa edildi") } })}>Əməliyyatla</Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  const id = toast.loading("Yayımlanır…", "kofe-evi.novocode.app");
                  setTimeout(() => (toast.dismiss(id), toast.success("Sayt yayımlandı", "kofe-evi.novocode.app")), 1800);
                }}
              >
                Yüklənmə
              </Button>
            </Card>
            <Alert tone="info" title="Beta dövrü">Bütün imkanlar pulsuzdur.</Alert>
            <Alert tone="success" title="Sayt yayımlandı">kofe-evi.novocode.app ünvanında açıqdır.</Alert>
            <Alert tone="warning" title="Kredit azalır" action={<Button size="sm" variant="secondary" onClick={() => openModal("upgrade")}>Yüksəlt</Button>}>
              Bu gün 1 mesajınız qalıb.
            </Alert>
            <Alert tone="danger" title="Önizləmə açılmadı">Chrome, Edge və ya Brave brauzerindən istifadə edin.</Alert>
          </div>
        </Block>

        <Block id="pencereler" n="09" title="Pəncərələr" desc="Masaüstündə mərkəzdə, telefonda aşağıdan açılan vərəq. Esc bağlayır, fokus içəridə qalır.">
          <Card className="flex flex-wrap gap-2">
            <Button variant="white" onClick={() => openModal("upgrade")}>
              <Sparkles className="size-4" /> Yüksəlt
            </Button>
            <Button variant="secondary" onClick={() => openModal("share", { name: "Kofe evi", url: "https://kofe-evi.novocode.app" })}>Paylaş + QR</Button>
            <Button variant="secondary" onClick={() => openModal("settings")}>Parametrlər</Button>
            <Button variant="secondary" onClick={() => openModal("import")}>Layihə gətir</Button>
            <Button variant="secondary" onClick={() => setConfirm(true)}>Təsdiq</Button>
          </Card>
        </Block>

        <Block id="melumat" n="10" title="Məlumat">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <Avatar name="İlkin Rızayev" size={40} />
                <Avatar name="Nova Group" size={32} />
                <Avatar name="Qonaq" size={24} />
                <Badge tone="nar">Yeni</Badge>
                <Badge tone="success">Aktiv</Badge>
                <Badge>Qaralama</Badge>
              </div>
              <div>
                <Label>Proqres</Label>
                <Progress value={3} max={5} label="Kredit" />
                <Progress value={92} tone="warning" className="mt-3" label="Kontekst" />
              </div>
              <div className="flex items-center gap-2 text-[13px] text-ink-400">
                Axtarış <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Skelet</Label>
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </Card>
            <EmptyState icon={<Inbox />} title="Hələ layihə yoxdur" action={<Button variant="white">Yazmağa başla</Button>}>
              Biznesinizi bir-iki cümlə ilə yazın — qalanını Novo edəcək.
            </EmptyState>
          </div>
        </Block>

        <Block id="hereket" n="11" title="Hərəkət" desc="150–400 ms, yumşaq çıxış əyrisi. Heç nə istifadəçini gözlətmir; “azaldılmış hərəkət” rejimində animasiyalar söndürülür.">
          <Card className="grid gap-4 sm:grid-cols-3">
            {[
              ["Mikro", "150 ms", "hover, düymə basılması"],
              ["Panel", "250–320 ms", "menyu, tab, vərəq"],
              ["Səhnə", "600–900 ms", "səhifə girişi, başlıqlar"],
            ].map(([n, t, d]) => (
              <div key={n} className="rounded-2xl bg-ink-100/[0.04] p-4">
                <p className="text-[14.5px] font-medium text-ink-100">{n}</p>
                <p className="font-mono text-[12px] text-nar">{t}</p>
                <p className="mt-1 text-[12.5px] text-ink-400">{d}</p>
              </div>
            ))}
          </Card>
        </Block>

        <footer className="flex items-center justify-between border-t border-ink-100/8 py-10 text-[12.5px] text-ink-500">
          <span>© {new Date().getFullYear()} Nova Group Azerbaijan</span>
          <span className="flex items-center gap-1.5">
            <Bell className="size-3.5" /> Dizayn sistemi v2
          </span>
        </footer>
      </main>

      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        size="sm"
        title="Layihə silinsin?"
        description="“Kofe evi” və onun bütün söhbət tarixçəsi silinəcək. Bu əməliyyat geri qaytarılmır."
        icon={<Trash2 />}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirm(false)}>
              Ləğv et
            </Button>
            <Button className="!bg-danger !text-white" onClick={() => (setConfirm(false), toast.success("Layihə silindi"))}>
              Sil
            </Button>
          </>
        }
      />
    </div>
  );
}
