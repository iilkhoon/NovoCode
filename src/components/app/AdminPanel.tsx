"use client";
import { useEffect, useState } from "react";
import { Activity, BookOpen, Cpu, KeyRound, Plus, Server, Trash2, Upload, Users } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button, ButtonLink } from "@/components/ui/button";
import { Alert, EmptyState, Field, Input, Modal, Select, Tabs } from "@/components/ui/kit";
import { toast } from "@/components/ui/toast";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/cn";

/**
 * Admin panel (design + local config). Keys are only kept in this browser for now —
 * the server-side encrypted store arrives with accounts (roadmap G.32).
 */

interface Provider { id: string; name: string; kind: string; baseUrl: string; key: string; enabled: boolean }
interface ModelRow { id: string; provider: string; label: string; credits: number; visible: boolean; isDefault: boolean }

const KINDS = [
  { id: "nvidia", name: "NVIDIA", url: "https://integrate.api.nvidia.com/v1" },
  { id: "openrouter", name: "OpenRouter", url: "https://openrouter.ai/api/v1" },
  { id: "anthropic", name: "Anthropic", url: "https://api.anthropic.com/v1" },
  { id: "openai", name: "OpenAI", url: "https://api.openai.com/v1" },
  { id: "custom", name: "Öz serverim (OpenAI uyğun)", url: "http://" },
];

const SEED_PROVIDERS: Provider[] = [{ id: "p1", name: "NVIDIA", kind: "nvidia", baseUrl: KINDS[0].url, key: "server .env", enabled: true }];
const SEED_MODELS: ModelRow[] = [
  { id: "qwen/qwen3-coder-480b-a35b-instruct", provider: "NVIDIA", label: "Novo Standart", credits: 1, visible: true, isDefault: true },
  { id: "mistralai/mistral-large-4-1t-a52b", provider: "NVIDIA", label: "Novo Vision (şəkil oxuyur)", credits: 2, visible: true, isDefault: false },
  { id: "deepseek-ai/deepseek-v3.1", provider: "NVIDIA", label: "Novo Max", credits: 2, visible: true, isDefault: false },
  { id: "meta/llama-3.3-70b-instruct", provider: "NVIDIA", label: "Novo Sürətli", credits: 1, visible: false, isDefault: false },
];

function useLocal<T>(key: string, seed: T) {
  const [v, setV] = useState<T>(seed);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setV(JSON.parse(raw));
    } catch {}
  }, [key]);
  const set = (next: T) => {
    setV(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {}
  };
  return [v, set] as const;
}

const mask = (k: string) => (k.length > 12 ? `${k.slice(0, 6)}••••••${k.slice(-4)}` : k);

export function AdminPanel() {
  const [tab, setTab] = useState<"providers" | "models" | "skills" | "users" | "usage">("providers");
  const [providers, setProviders] = useLocal("novo-admin-providers", SEED_PROVIDERS);
  const [models, setModels] = useLocal("novo-admin-models", SEED_MODELS);
  const [adding, setAdding] = useState(false);

  return (
    <div className="min-h-dvh bg-wool">
      <header className="sticky top-0 z-30 border-b border-ink-100/8 bg-wool/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center gap-3 px-4 sm:px-8">
          <Logo href="/app" />
          <span className="rounded-full bg-ink-100 px-2 py-0.5 font-label text-[9.5px] uppercase tracking-[0.08em] text-ink-1000">Admin</span>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <ButtonLink href="/app" variant="secondary" size="sm">
              Tətbiqə qayıt
            </ButtonLink>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-4 py-10 sm:px-8">
        <h1 className="font-display text-[36px] font-[500] tracking-[-0.025em] text-ink-100">İdarəetmə</h1>
        <p className="mt-1 text-[14px] text-ink-400">AI provayderləri, modellər, skill-lər və xərclər.</p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={<Server />} label="Aktiv provayder" value={String(providers.filter((p) => p.enabled).length)} />
          <Stat icon={<Cpu />} label="Görünən model" value={String(models.filter((m) => m.visible).length)} />
          <Stat icon={<Users />} label="İstifadəçi (bu gün)" value="—" note="Hesablar açılanda" />
          <Stat icon={<Activity />} label="AI xərci (bu ay)" value="—" note="Ölçmə tezliklə" />
        </div>

        <Tabs
          className="mt-10"
          value={tab}
          onChange={setTab}
          tabs={[
            { value: "providers", label: "Provayderlər", count: providers.length },
            { value: "models", label: "Modellər", count: models.length },
            { value: "skills", label: "Skill-lər" },
            { value: "users", label: "İstifadəçilər" },
            { value: "usage", label: "Xərc" },
          ]}
        />

        <div className="mt-6">
          {tab === "providers" && (
            <div className="flex flex-col gap-4">
              <Alert tone="warning" title="Açarlar hələlik yalnız bu brauzerdə saxlanılır">
                Əsl açar serverdəki <code className="font-mono text-[12px]">.env.local</code> faylındadır. Şifrəli server anbarı hesablarla birlikdə gələcək.
              </Alert>
              <div className="overflow-hidden rounded-3xl border border-ink-100/8 bg-ink-1000">
                {providers.map((p, i) => (
                  <div key={p.id} className={cn("flex flex-wrap items-center gap-4 px-5 py-4", i > 0 && "border-t border-ink-100/8")}>
                    <span className="grid size-10 place-items-center rounded-xl bg-ink-100/[0.06] text-ink-300">
                      <KeyRound className="size-[18px]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14.5px] font-medium text-ink-100">{p.name}</p>
                      <p className="truncate font-mono text-[12px] text-ink-500">
                        {p.baseUrl} · {mask(p.key)}
                      </p>
                    </div>
                    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px]", p.enabled ? "bg-success/10 text-success" : "bg-ink-100/[0.06] text-ink-400")}>
                      <span className={cn("size-1.5 rounded-full", p.enabled ? "bg-success" : "bg-ink-500")} />
                      {p.enabled ? "Aktiv" : "Söndürülüb"}
                    </span>
                    <input type="checkbox" role="switch" aria-label={`${p.name} aktiv`} className="nv-switch" checked={p.enabled} onChange={(e) => setProviders(providers.map((x) => (x.id === p.id ? { ...x, enabled: e.target.checked } : x)))} />
                    <button type="button" aria-label="Sil" onClick={() => setProviders(providers.filter((x) => x.id !== p.id))} className="grid size-8 place-items-center rounded-full text-ink-500 hover:bg-danger/10 hover:text-danger">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div>
                <Button variant="primary" onClick={() => setAdding(true)}>
                  <Plus className="size-4" /> Provayder əlavə et
                </Button>
              </div>
            </div>
          )}

          {tab === "models" && (
            <div className="overflow-x-auto rounded-3xl border border-ink-100/8 bg-ink-1000">
              <table className="w-full min-w-[720px] text-left text-[13.5px]">
                <thead className="border-b border-ink-100/8 text-[12px] text-ink-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">İstifadəçiyə görünən ad</th>
                    <th className="px-3 py-3 font-medium">Model</th>
                    <th className="px-3 py-3 font-medium">Kredit / mesaj</th>
                    <th className="px-3 py-3 font-medium">Standart</th>
                    <th className="px-5 py-3 font-medium">Görünür</th>
                  </tr>
                </thead>
                <tbody>
                  {models.map((m) => (
                    <tr key={m.id} className="border-t border-ink-100/8 first:border-t-0">
                      <td className="px-5 py-3">
                        <input aria-label="Ad" value={m.label} onChange={(e) => setModels(models.map((x) => (x.id === m.id ? { ...x, label: e.target.value } : x)))} className="w-full rounded-lg bg-transparent px-2 py-1 font-medium text-ink-100 hover:bg-ink-100/[0.04] focus:bg-ink-100/[0.06] focus:outline-none" />
                      </td>
                      <td className="px-3 py-3">
                        <span className="font-mono text-[12px] text-ink-400">{m.id}</span>
                        <span className="ml-2 rounded-full bg-ink-100/[0.06] px-2 py-0.5 text-[11px] text-ink-400">{m.provider}</span>
                      </td>
                      <td className="px-3 py-3">
                        <input type="number" min={0} aria-label="Kredit" value={m.credits} onChange={(e) => setModels(models.map((x) => (x.id === m.id ? { ...x, credits: Number(e.target.value) } : x)))} className="w-16 rounded-lg border border-ink-100/12 bg-ink-1000 px-2 py-1 text-ink-100 focus:border-nar focus:outline-none" />
                      </td>
                      <td className="px-3 py-3">
                        <input type="radio" name="default-model" aria-label="Standart model" className="nv-radio" checked={m.isDefault} onChange={() => setModels(models.map((x) => ({ ...x, isDefault: x.id === m.id })))} />
                      </td>
                      <td className="px-5 py-3">
                        <input type="checkbox" role="switch" aria-label="Görünür" className="nv-switch" checked={m.visible} onChange={(e) => setModels(models.map((x) => (x.id === m.id ? { ...x, visible: e.target.checked } : x)))} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "skills" && (
            <div className="flex flex-col gap-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {["core", "design-excellence", "azerbaijani-content", "ecommerce", "restaurant", "landing-page", "portfolio", "booking", "dashboard"].map((s) => (
                  <div key={s} className="flex items-center gap-3 rounded-2xl border border-ink-100/8 bg-ink-1000 p-4">
                    <BookOpen className="size-4 text-nar" />
                    <span className="flex-1 font-mono text-[13px] text-ink-200">{s}.md</span>
                    <input type="checkbox" role="switch" aria-label={`${s} aktiv`} className="nv-switch" defaultChecked />
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => toast.info("Skill yükləmə tezliklə", "Markdown faylı: ad, təsvir, açar sözlər və təlimat.")} className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-ink-100/20 px-6 py-10 text-center transition-colors hover:border-nar/50 hover:bg-nar/[0.03]">
                <Upload className="size-5 text-ink-400" />
                <span className="text-[14px] font-medium text-ink-100">Skill yüklə</span>
                <span className="text-[12.5px] text-ink-500">.md faylını bura atın və ya klikləyin</span>
              </button>
            </div>
          )}

          {tab === "users" && <EmptyState icon={<Users />} title="Hələ istifadəçi yoxdur">Google/GitHub ilə giriş açılanda istifadəçilər, planları və limitləri burada görünəcək.</EmptyState>}
          {tab === "usage" && <EmptyState icon={<Activity />} title="Xərc ölçümü hazırlanır">Hər istifadəçi və layihə üzrə token və manat xərci, model bölgüsü və gündəlik qrafik.</EmptyState>}
        </div>
      </main>

      <AddProvider
        open={adding}
        onClose={() => setAdding(false)}
        onAdd={(p) => {
          setProviders([...providers, p]);
          setAdding(false);
          toast.success(`${p.name} əlavə edildi`);
        }}
      />
    </div>
  );
}

function Stat({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: string; note?: string }) {
  return (
    <div className="rounded-3xl border border-ink-100/8 bg-ink-1000 p-5 shadow-[var(--shadow-card)]">
      <span className="grid size-9 place-items-center rounded-xl bg-nar/10 text-nar [&>svg]:size-[18px]">{icon}</span>
      <p className="mt-4 font-display text-[30px] font-[500] leading-none tracking-[-0.02em] text-ink-100">{value}</p>
      <p className="mt-1.5 text-[13px] text-ink-400">{label}</p>
      {note && <p className="text-[11.5px] text-ink-500">{note}</p>}
    </div>
  );
}

function AddProvider({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (p: Provider) => void }) {
  const [kind, setKind] = useState("openrouter");
  const [url, setUrl] = useState(KINDS[1].url);
  const [key, setKey] = useState("");
  const k = KINDS.find((x) => x.id === kind)!;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Provayder əlavə et"
      description="OpenAI ilə uyğun API olan istənilən xidməti və ya öz serverinizi qoşun."
      icon={<KeyRound />}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Ləğv et
          </Button>
          <Button variant="primary" disabled={!key.trim()} onClick={() => onAdd({ id: Math.random().toString(36).slice(2), name: k.name, kind, baseUrl: url, key: key.trim(), enabled: true })}>
            Əlavə et
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Field label="Provayder">
          {(id) => (
            <Select
              id={id}
              value={kind}
              onChange={(e) => {
                setKind(e.target.value);
                setUrl(KINDS.find((x) => x.id === e.target.value)!.url);
              }}
            >
              {KINDS.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label="API ünvanı">{(id) => <Input id={id} value={url} onChange={(e) => setUrl(e.target.value)} className="font-mono" />}</Field>
        <Field label="API açarı" hint="Açar heç vaxt istifadəçilərə göstərilmir.">
          {(id, d) => <Input id={id} aria-describedby={d} type="password" autoComplete="off" value={key} onChange={(e) => setKey(e.target.value)} placeholder="sk-…" icon={<KeyRound />} />}
        </Field>
      </div>
    </Modal>
  );
}
