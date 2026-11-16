"use client";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Bell, Check, Copy, CreditCard, Download, Globe2, Link2, Lock, Palette, Sparkles, User, Wand2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, Avatar, Checkbox, Field, Input, Modal, Progress, Radio, Segmented, Select, Switch } from "@/components/ui/kit";
import { toast } from "@/components/ui/toast";
import { PLANS } from "@/components/landing/data";
import { setTheme, useTheme } from "@/lib/theme";
import { LANGS, USAGE, closeModal, openModal, setPrefs, useModal, usePrefs } from "@/lib/ui-store";
import { cn } from "@/lib/cn";
import { authEnabled, signInWith } from "@/lib/supabase";

/** Mount once (root layout). Any component opens a dialog with `openModal("upgrade")`. */
export function GlobalModals() {
  const { name, arg } = useModal();
  return (
    <>
      <UpgradeModal open={name === "upgrade"} />
      <ShareModal open={name === "share"} url={arg.url} name={arg.name} />
      <SettingsModal open={name === "settings"} initialTab={arg.tab} />
      <ImportModal open={name === "import"} initialTab={arg.tab} />
    </>
  );
}

const soon = (what: string) => toast.info(`${what} tezliklə`, "Bu bölmə hazırlanır — beta yeniləmələrində açılacaq.");

/* ---------------- Upgrade ---------------- */

function UpgradeModal({ open }: { open: boolean }) {
  const [cycle, setCycle] = useState<"monthly" | "yearly">("yearly");
  return (
    <Modal open={open} onClose={closeModal} size="xl" title="Daha çox yarat" description="Kreditlər hər ay yenilənir. İstənilən vaxt plan dəyişə və ya ləğv edə bilərsiniz." icon={<Sparkles />}>
      <div className="flex flex-col items-center gap-4">
        <Segmented
          label="Ödəniş dövrü"
          value={cycle}
          onChange={setCycle}
          options={[
            { value: "monthly", label: "Aylıq" },
            { value: "yearly", label: <>İllik <span className="ml-1 rounded-full bg-success/15 px-1.5 py-px text-[10.5px] text-success">−20%</span></> },
          ]}
        />
        <div className="grid w-full gap-3 md:grid-cols-3">
          {PLANS.map((p) => {
            const price = p.price[cycle];
            return (
              <div key={p.name} className={cn("relative flex flex-col rounded-3xl border p-5", p.highlight ? "border-nar/50 bg-nar/[0.04] shadow-[var(--shadow-glow)]" : "border-ink-100/10")}>
                {p.highlight && <span className="absolute -top-2.5 left-5 rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-medium text-white">Ən çox seçilən</span>}
                <p className="text-[15px] font-medium text-ink-100">{p.name}</p>
                <p className="mt-0.5 text-[12.5px] text-ink-400">{p.description}</p>
                <p className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-[38px] font-[650] leading-none tracking-[-0.03em] text-ink-100">{price}</span>
                  <span className="text-[14px] text-ink-400">₼ / ay</span>
                </p>
                <p className="mt-1 text-[12.5px] font-medium text-nar">{p.credits}</p>
                <ul className="mt-4 flex flex-1 flex-col gap-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px] text-ink-300">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-success" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={p.highlight ? "white" : price === 0 ? "secondary" : "primary"}
                  className="mt-5 w-full"
                  disabled={price === 0}
                  onClick={() => {
                    closeModal();
                    toast.success("Beta dövründə hamısı pulsuzdur", "Ödənişli planlar açılanda sizə xəbər verəcəyik.");
                  }}
                >
                  {price === 0 ? "Hazırkı plan" : `${p.name} planına keç`}
                </Button>
              </div>
            );
          })}
        </div>
        <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-2xl bg-ink-100/[0.04] px-4 py-3">
          <div className="flex items-center gap-3">
            <Zap className="size-4 text-nar" />
            <p className="text-[13px] text-ink-300">
              Əlavə kredit lazımdır? <span className="text-ink-100">100 mesaj — 9 ₼</span>, plan dəyişmədən.
            </p>
          </div>
          <Button size="sm" variant="secondary" onClick={() => soon("Kredit paketləri")}>
            Kredit al
          </Button>
        </div>
        <p className="flex items-center gap-1.5 text-[12px] text-ink-500">
          <Lock className="size-3" /> Təhlükəsiz ödəniş · Beta dövründə bütün imkanlar pulsuzdur
        </p>
      </div>
    </Modal>
  );
}

/* ---------------- Share ---------------- */

function ShareModal({ open, url, name }: { open: boolean; url?: string; name?: string }) {
  const link = url || "https://layihe.novocode.app";
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState(false);
  const [isPublic, setPublic] = useState(true);
  useEffect(() => {
    if (!open) return;
    QRCode.toDataURL(link, { margin: 1, width: 360, color: { dark: "#0b0b12", light: "#ffffff" } }).then(setQr).catch(() => setQr(""));
  }, [open, link]);
  const copy = () =>
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      toast.success("Link kopyalandı");
      setTimeout(() => setCopied(false), 1600);
    });
  return (
    <Modal open={open} onClose={closeModal} title={name ? `“${name}” paylaş` : "Layihəni paylaş"} description="Linki göndərin və ya telefonla QR kodu oxudub saytı yoxlayın." icon={<Link2 />}>
      <div className="flex flex-col gap-5">
        <div className="flex gap-2">
          <Input readOnly value={link} icon={<Globe2 />} className="flex-1" aria-label="Paylaşma linki" onFocus={(e) => e.currentTarget.select()} />
          <Button variant="primary" className="h-11 shrink-0" onClick={copy}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Kopyalandı" : "Kopyala"}
          </Button>
        </div>
        <div className="flex items-center gap-5 rounded-3xl border border-ink-100/10 p-4">
          <div className="grid size-[132px] shrink-0 place-items-center overflow-hidden rounded-2xl bg-white p-2 ring-1 ring-ink-100/10">
            {qr ? <img src={qr} alt="Saytın QR kodu" className="size-full" /> : <span className="size-full animate-pulse rounded-xl bg-ink-100/10" />}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[14.5px] font-medium text-ink-100">Telefonda yoxlayın</p>
            <p className="text-[13px] leading-relaxed text-ink-400">Kameranı QR koda tutun — sayt telefonunuzda açılacaq. Dəyişikliklər avtomatik yenilənir.</p>
            {qr && (
              <a href={qr} download="novocode-qr.png" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-nar hover:underline">
                <Download className="size-3.5" /> QR kodu yüklə
              </a>
            )}
          </div>
        </div>
        <Switch checked={isPublic} onChange={(e) => setPublic(e.target.checked)} label="Hamı görə bilər" description={isPublic ? "Linki olan hər kəs saytı aça bilər." : "Yalnız siz və dəvət etdikləriniz."} />
        <div className="flex flex-col gap-2">
          <p className="text-[13px] font-medium text-ink-200">Komandaya dəvət et</p>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              soon("Birgə redaktə");
            }}
          >
            <Input type="email" placeholder="ad@şirkət.az" className="flex-1" aria-label="E-poçt" />
            <Select defaultValue="edit" aria-label="İcazə" className="w-[130px] shrink-0">
              <option value="edit">Redaktə</option>
              <option value="view">Baxış</option>
            </Select>
            <Button type="submit" variant="secondary" className="h-11 shrink-0">
              Dəvət et
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  );
}

/* ---------------- Settings ---------------- */

const SETTINGS_TABS = [
  { id: "account", label: "Hesab", icon: User },
  { id: "look", label: "Görünüş və dil", icon: Palette },
  { id: "ai", label: "AI", icon: Wand2 },
  { id: "notify", label: "Bildirişlər", icon: Bell },
  { id: "billing", label: "Plan və kredit", icon: CreditCard },
] as const;

function SettingsModal({ open, initialTab }: { open: boolean; initialTab?: string }) {
  const [tab, setTab] = useState<string>("account");
  useEffect(() => {
    if (open) setTab(initialTab ?? "account");
  }, [open, initialTab]);
  const p = usePrefs();
  const { theme } = useTheme();

  return (
    <Modal open={open} onClose={closeModal} size="lg" title="Parametrlər">
      <div className="flex flex-col gap-6 md:flex-row">
        <nav aria-label="Parametr bölmələri" className="-mx-1 flex shrink-0 gap-1 overflow-x-auto pb-1 md:mx-0 md:w-[180px] md:flex-col md:overflow-visible">
          {SETTINGS_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id ? "page" : undefined}
              className={cn("flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13.5px] transition-colors", tab === t.id ? "bg-ink-100/[0.07] font-medium text-ink-100" : "text-ink-400 hover:bg-ink-100/[0.04] hover:text-ink-100")}
            >
              <t.icon className="size-4" />
              {t.label}
            </button>
          ))}
        </nav>

        <div className="min-h-[360px] min-w-0 flex-1">
          {tab === "account" && (
            <Section title="Hesab" desc="Bu məlumatlar layihələrinizdə və dəvətlərdə görünür.">
              <div className="flex items-center gap-4">
                <Avatar name={p.name || "Qonaq"} size={56} />
                <div>
                  <p className="text-[15px] font-medium text-ink-100">{p.name || "Qonaq"}</p>
                  <p className="text-[13px] text-ink-400">Qonaq rejimi · layihələr bu brauzerdə saxlanılır</p>
                </div>
              </div>
              <Field label="Ad">{(id) => <Input id={id} value={p.name} onChange={(e) => setPrefs({ name: e.target.value })} />}</Field>
              <Field label="E-poçt" hint="Giriş sistemi açılanda hesabınız bu ünvana bağlanacaq.">
                {(id, d) => <Input id={id} aria-describedby={d} type="email" placeholder="ad@nümunə.az" value={p.email} onChange={(e) => setPrefs({ email: e.target.value })} />}
              </Field>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => (authEnabled() ? signInWith("google") : soon("Google ilə giriş"))}>
                  <GoogleIcon /> Google ilə bağla
                </Button>
                <Button variant="secondary" onClick={() => (authEnabled() ? signInWith("github") : soon("GitHub ilə giriş"))}>
                  <Github className="size-4" /> GitHub ilə bağla
                </Button>
              </div>
            </Section>
          )}

          {tab === "look" && (
            <Section title="Görünüş və dil">
              <div className="flex flex-col gap-2">
                <p className="text-[13px] font-medium text-ink-200">Tema</p>
                <div className="grid grid-cols-2 gap-3">
                  {(["light", "dark"] as const).map((t) => (
                    <button key={t} type="button" onClick={() => setTheme(t)} aria-pressed={theme === t} className={cn("overflow-hidden rounded-2xl border-2 text-left transition-colors", theme === t ? "border-nar" : "border-ink-100/10 hover:border-ink-100/25")}>
                      <span data-theme={t} className="block bg-wool p-3">
                        <span className="block h-2 w-10 rounded-full bg-ink-100/80" />
                        <span className="mt-2 block h-2 w-16 rounded-full bg-ink-100/25" />
                        <span className="mt-3 block h-5 w-12 rounded-full bg-nar" />
                      </span>
                      <span className="block px-3 py-2 text-[13px] font-medium text-ink-100">{t === "light" ? "Gündüz" : "Gecə"}</span>
                    </button>
                  ))}
                </div>
              </div>
              <fieldset className="flex flex-col gap-2.5">
                <legend className="mb-1 text-[13px] font-medium text-ink-200">İnterfeys dili</legend>
                <div className="grid grid-cols-2 gap-2.5">
                  {LANGS.map((l) => (
                    <Radio key={l.id} name="lang" checked={p.lang === l.id} onChange={() => setPrefs({ lang: l.id })} label={l.label} className="rounded-xl border border-ink-100/10 px-3 py-2.5" />
                  ))}
                </div>
              </fieldset>
            </Section>
          )}

          {tab === "ai" && (
            <Section title="AI" desc="Novo-nun necə işlədiyini seçin.">
              <Field label="Model" hint="Avtomatik rejim hər tapşırığa uyğun modeli özü seçir.">
                {(id, d) => (
                  <Select id={id} aria-describedby={d} value={p.model} onChange={(e) => setPrefs({ model: e.target.value })}>
                    <option value="auto">Avtomatik (tövsiyə olunur)</option>
                    <option value="fast">Sürətli — kiçik düzəlişlər üçün</option>
                    <option value="max">Max — ən güclü, 2× kredit</option>
                  </Select>
                )}
              </Field>
              <Field label="Cavab dili">
                {(id) => (
                  <Select id={id} value={p.replyLang} onChange={(e) => setPrefs({ replyLang: e.target.value as typeof p.replyLang })}>
                    <option value="auto">Yazdığım dildə</option>
                    {LANGS.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.label}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
              <div className="flex flex-col gap-4 rounded-2xl border border-ink-100/10 p-4">
                <Switch checked={p.autoFix} onChange={(e) => setPrefs({ autoFix: e.target.checked })} label="Xətaları avtomatik düzəlt" description="Önizləmədə xəta çıxanda Novo özü düzəldir." />
                <Switch checked={p.autoCompact} onChange={(e) => setPrefs({ autoCompact: e.target.checked })} label="Söhbəti avtomatik yığcamlaşdır" description="Kontekst 80%-ə çatanda köhnə mesajlar xülasə olunur." />
                <Switch checked={p.suggestions} onChange={(e) => setPrefs({ suggestions: e.target.checked })} label="Növbəti addım təklifləri" description="Hər cavabdan sonra 2–3 təklif göstər." />
              </div>
            </Section>
          )}

          {tab === "notify" && (
            <Section title="Bildirişlər" desc="Nə vaxt xəbər verək?">
              <div className="flex flex-col gap-4">
                <Checkbox checked={p.notifyDone} onChange={(e) => setPrefs({ notifyDone: e.target.checked })} label="Sayt hazır olanda" description="Uzun qurulmalar bitəndə brauzer bildirişi." />
                <Checkbox checked={p.notifyBilling} onChange={(e) => setPrefs({ notifyBilling: e.target.checked })} label="Kredit azalanda" description="Limitin 80%-i istifadə olunanda." />
                <Checkbox checked={p.notifyNews} onChange={(e) => setPrefs({ notifyNews: e.target.checked })} label="Yeniliklər və təkliflər" description="Ayda ən çox bir məktub." />
                <Checkbox checked={p.sound} onChange={(e) => setPrefs({ sound: e.target.checked })} label="Səs siqnalı" />
              </div>
            </Section>
          )}

          {tab === "billing" && (
            <Section title="Plan və kredit">
              <div className="rounded-3xl bg-brand p-5 text-white">
                <p className="label-mono opacity-80">Hazırkı plan</p>
                <p className="mt-1 font-display text-[28px] font-[650] tracking-[-0.02em]">{USAGE.plan}</p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/25">
                  <div className="h-full rounded-full bg-white" style={{ width: `${(USAGE.used / USAGE.limit) * 100}%` }} />
                </div>
                <p className="mt-2 text-[13px] opacity-90">
                  {USAGE.period} {USAGE.used} / {USAGE.limit} mesaj · {USAGE.resets}
                </p>
              </div>
              <Alert tone="info" title="Beta dövrü">
                Ödənişli planlar hələ aktiv deyil — bütün imkanlardan pulsuz istifadə edə bilərsiniz.
              </Alert>
              <Button variant="white" onClick={() => openModal("upgrade")}>
                <Sparkles className="size-4" /> Planları gör
              </Button>
            </Section>
          )}
        </div>
      </div>
    </Modal>
  );
}

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-5">
      <header>
        <h3 className="text-[16px] font-medium text-ink-100">{title}</h3>
        {desc && <p className="mt-0.5 text-[13px] text-ink-400">{desc}</p>}
      </header>
      {children}
    </section>
  );
}

/* ---------------- Import ---------------- */

function ImportModal({ open, initialTab }: { open: boolean; initialTab?: string }) {
  const [tab, setTab] = useState<"github" | "url" | "figma">("github");
  useEffect(() => {
    if (open) setTab((initialTab as typeof tab) ?? "github");
  }, [open, initialTab]);
  const [url, setUrl] = useState("");
  return (
    <Modal
      open={open}
      onClose={closeModal}
      title="Layihə gətir"
      description="Mövcud kodu və ya bəyəndiyiniz saytı gətirin — Novo üzərində işləməyə davam etsin."
      icon={<Download />}
      footer={
        <>
          <Button variant="ghost" onClick={closeModal}>
            Ləğv et
          </Button>
          <Button
            variant="white"
            onClick={() => {
              closeModal();
              soon(tab === "github" ? "GitHub importu" : tab === "url" ? "Saytdan kopyalama" : "Figma importu");
            }}
          >
            Gətir
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <Segmented
          label="Mənbə"
          value={tab}
          onChange={setTab}
          options={[
            { value: "github", label: "GitHub", icon: <Github /> },
            { value: "url", label: "Sayt linki", icon: <Globe2 /> },
            { value: "figma", label: "Figma", icon: <FigmaIcon /> },
          ]}
        />
        {tab === "github" && (
          <>
            <button type="button" onClick={() => soon("GitHub hesabı")} className="flex items-center gap-3 rounded-2xl border border-ink-100/10 p-4 text-left transition-colors hover:border-ink-100/25">
              <span className="grid size-10 place-items-center rounded-xl bg-ink-100 text-ink-1000">
                <Github className="size-5" />
              </span>
              <span className="flex-1">
                <span className="block text-[14.5px] font-medium text-ink-100">GitHub hesabını qoş</span>
                <span className="block text-[12.5px] text-ink-400">Repolarınızı seçin, dəyişiklikləri geri göndərin.</span>
              </span>
            </button>
            <Field label="və ya repo linki" hint="Açıq (public) repolar hesab qoşmadan da gətirilə bilər.">
              {(id, d) => <Input id={id} aria-describedby={d} placeholder="https://github.com/ad/layihə" icon={<Github />} />}
            </Field>
          </>
        )}
        {tab === "url" && (
          <>
            <Field label="Saytın ünvanı" hint="Novo saytı açıb oxuyur və oxşar dizaynla sizin üçün yenisini qurur.">
              {(id, d) => <Input id={id} aria-describedby={d} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://nümunə.az" icon={<Globe2 />} />}
            </Field>
            <div className="flex flex-col gap-3 rounded-2xl border border-ink-100/10 p-4">
              <Checkbox defaultChecked label="Dizayn və rəngləri götür" />
              <Checkbox defaultChecked label="Bölmələrin quruluşunu götür" />
              <Checkbox label="Mətnləri də köçür" description="Yalnız öz saytınız üçün — başqasının mətnini köçürməyin." />
            </div>
          </>
        )}
        {tab === "figma" && <Alert tone="info" title="Figma importu hazırlanır">Figma faylının linkini yapışdıracaqsınız — dizayn işlək koda çevriləcək.</Alert>}
      </div>
    </Modal>
  );
}

/* ---------------- brand icons (lucide has none) ---------------- */

export function Github({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.29-1.69-1.29-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.39-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z" />
    </svg>
  );
}


export function GoogleIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.6 10.6 0 0 0 12 1 11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function FigmaIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path fill="#F24E1E" d="M8 24a4 4 0 0 0 4-4v-4H8a4 4 0 0 0 0 8z" />
      <path fill="#A259FF" d="M4 12a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4z" />
      <path fill="#F24E1E" d="M4 4a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4z" />
      <path fill="#FF7262" d="M12 0h4a4 4 0 0 1 0 8h-4z" />
      <path fill="#1ABCFE" d="M20 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
    </svg>
  );
}
