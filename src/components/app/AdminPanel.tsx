"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, BookOpen, Cpu, KeyRound, Loader2, Lock, Plus, Save, Search, Server, Trash2, Upload, Users } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button, ButtonLink } from "@/components/ui/button";
import { Alert, EmptyState, Field, Input, Modal, Select, Tabs } from "@/components/ui/kit";
import { toast } from "@/components/ui/toast";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/cn";

/**
 * Admin panel. Providers, keys and model settings live on the server (/api/admin/config,
 * keys encrypted at rest) and are protected by NOVO_ADMIN_PASSWORD.
 */

interface Provider {
  id: string;
  name: string;
  baseUrl: string;
  key: string; // masked when it comes from the server
  hasKey?: boolean;
  enabled: boolean;
}
interface ModelSetting {
  id: string;
  label?: string;
  credits?: number;
  visible?: boolean;
}
interface Config {
  providers: Provider[];
  models: ModelSetting[];
  defaultModel?: string;
  nvidia: { configured: boolean };
  catalog: { provider: string; ids: string[]; error?: string }[];
}

const KINDS = [
  { id: "openrouter", name: "OpenRouter", url: "https://openrouter.ai/api/v1" },
  { id: "anthropic", name: "Anthropic", url: "https://api.anthropic.com/v1" },
  { id: "openai", name: "OpenAI", url: "https://api.openai.com/v1" },
  { id: "deepseek", name: "DeepSeek", url: "https://api.deepseek.com/v1" },
  { id: "own", name: "Öz serverim (OpenAI uyğun)", url: "http://" },
];

const PASS_KEY = "novo-admin-pass";

function useAdminApi() {
  const [pass, setPass] = useState<string | null>(null);
  useEffect(() => {
    try {
      setPass(sessionStorage.getItem(PASS_KEY));
    } catch {}
  }, []);
  const call = useCallback(
    async (method: "GET" | "PUT", body?: unknown, p = pass) => {
      const res = await fetch("/api/admin/config", { method, headers: { "content-type": "application/json", "x-novo-admin": p ?? "" }, body: body ? JSON.stringify(body) : undefined });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw Object.assign(new Error(d.error || `Xəta ${res.status}`), { status: res.status });
      return d as Config;
    },
    [pass]
  );
  const login = (p: string) => {
    setPass(p);
    try {
      sessionStorage.setItem(PASS_KEY, p);
    } catch {}
  };
  const logout = () => {
    setPass(null);
    try {
      sessionStorage.removeItem(PASS_KEY);
    } catch {}
  };
  return { pass, call, login, logout };
}

export function AdminPanel() {
  const api = useAdminApi();
  const [cfg, setCfg] = useState<Config | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"providers" | "models" | "skills" | "users" | "usage">("providers");
  const [adding, setAdding] = useState(false);

  const load = useCallback(
    async (p?: string) => {
      setError(null);
      try {
        setCfg(await api.call("GET", undefined, p));
        setDirty(false);
        if (p) api.login(p);
      } catch (e) {
        const err = e as Error & { status?: number };
        if (err.status === 401) api.logout();
        setError(err.message);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [api.call]
  );
  useEffect(() => {
    if (api.pass) load();
  }, [api.pass, load]);

  const update = (patch: Partial<Config>) => {
    setCfg((c) => (c ? { ...c, ...patch } : c));
    setDirty(true);
  };

  const save = async () => {
    if (!cfg) return;
    setSaving(true);
    try {
      await api.call("PUT", { providers: cfg.providers, models: cfg.models, defaultModel: cfg.defaultModel });
      await load();
      toast.success("Yadda saxlanıldı", "Dəyişikliklər dərhal qüvvəyə minir.");
    } catch (e) {
      toast.error("Saxlamaq alınmadı", (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (!api.pass || !cfg) return <Gate error={error} onLogin={(p) => load(p)} loading={!!api.pass && !cfg && !error} />;

  const activeProviders = cfg.providers.filter((p) => p.enabled).length + (cfg.nvidia.configured ? 1 : 0);
  const visibleModels = cfg.catalog.reduce((n, c) => n + c.ids.filter((id) => isVisible(cfg, c.provider, id)).length, 0);

  return (
    <div className="min-h-dvh bg-wool">
      <header className="sticky top-0 z-30 border-b border-ink-100/8 bg-wool/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center gap-3 px-4 sm:px-8">
          <Logo href="/app" />
          <span className="rounded-full bg-ink-100 px-2 py-0.5 font-label text-[9.5px] uppercase tracking-[0.08em] text-ink-1000">Admin</span>
          <div className="ml-auto flex items-center gap-2">
            {dirty && (
              <Button variant="white" size="sm" onClick={save} disabled={saving}>
                {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />} Yadda saxla
              </Button>
            )}
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => (api.logout(), setCfg(null))}>
              Çıxış
            </Button>
            <ButtonLink href="/app" variant="secondary" size="sm" className="hidden sm:inline-flex">
              Tətbiqə qayıt
            </ButtonLink>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-4 py-10 sm:px-8">
        <h1 className="font-display text-[36px] tracking-[-0.025em] text-ink-100">İdarəetmə</h1>
        <p className="mt-1 text-[14px] text-ink-400">AI provayderləri, modellər, skill-lər və xərclər.</p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={<Server />} label="Aktiv provayder" value={String(activeProviders)} />
          <Stat icon={<Cpu />} label="İstifadəçiyə görünən model" value={String(visibleModels)} />
          <Stat icon={<Users />} label="İstifadəçi (bu gün)" value="—" note="Hesablar qoşulanda" />
          <Stat icon={<Activity />} label="AI xərci (bu ay)" value="—" note="Ölçmə tezliklə" />
        </div>

        <Tabs
          className="mt-10"
          value={tab}
          onChange={setTab}
          tabs={[
            { value: "providers", label: "Provayderlər", count: activeProviders },
            { value: "models", label: "Modellər", count: visibleModels },
            { value: "skills", label: "Skill-lər" },
            { value: "users", label: "İstifadəçilər" },
            { value: "usage", label: "Xərc" },
          ]}
        />

        <div className="mt-6">
          {tab === "providers" && (
            <div className="flex flex-col gap-4">
              <div className="overflow-hidden rounded-3xl border border-ink-100/8 bg-ink-1000">
                <Row icon={<KeyRound />} title="NVIDIA" sub={`integrate.api.nvidia.com · ${cfg.nvidia.configured ? "açar serverin .env faylındadır" : "NVIDIA_API_KEY təyin edilməyib"}`} on={cfg.nvidia.configured} />
                {cfg.providers.map((p) => (
                  <Row
                    key={p.id}
                    icon={<KeyRound />}
                    title={p.name}
                    sub={`${p.baseUrl} · ${p.hasKey ? p.key : "açar yoxdur"}`}
                    on={p.enabled}
                    onToggle={(v) => update({ providers: cfg.providers.map((x) => (x.id === p.id ? { ...x, enabled: v } : x)) })}
                    onDelete={() => update({ providers: cfg.providers.filter((x) => x.id !== p.id), models: cfg.models.filter((m) => !m.id.startsWith(p.id + "::")) })}
                    error={cfg.catalog.find((c) => c.provider === p.id)?.error}
                  />
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" onClick={() => setAdding(true)}>
                  <Plus className="size-4" /> Provayder əlavə et
                </Button>
                <p className="text-[12.5px] text-ink-500">Açarlar serverdə şifrələnmiş saxlanılır və heç vaxt brauzerə qaytarılmır.</p>
              </div>
            </div>
          )}

          {tab === "models" && <ModelsTab cfg={cfg} update={update} />}

          {tab === "skills" && (
            <div className="flex flex-col gap-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {["core", "design-excellence", "azerbaijani-content", "ecommerce", "restaurant", "landing-page", "portfolio", "booking", "dashboard", "auth-and-data", "screenshot-to-code", "astryx-ui"].map((s) => (
                  <div key={s} className="flex items-center gap-3 rounded-2xl border border-ink-100/8 bg-ink-1000 p-4">
                    <BookOpen className="size-4 text-nar" />
                    <span className="flex-1 font-mono text-[13px] text-ink-200">{s}.md</span>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => toast.info("Skill yükləmə tezliklə", "Hələlik skills/ qovluğuna .md faylı əlavə edin — avtomatik qoşulur.")} className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-ink-100/20 px-6 py-10 text-center transition-colors hover:border-nar/50 hover:bg-nar/[0.03]">
                <Upload className="size-5 text-ink-400" />
                <span className="text-[14px] font-medium text-ink-100">Skill yüklə</span>
                <span className="text-[12.5px] text-ink-500">.md fayl: ad, təsvir, açar sözlər və təlimat</span>
              </button>
            </div>
          )}

          {tab === "users" && <EmptyState icon={<Users />} title="İstifadəçilər">Supabase qoşulanda istifadəçilər, planları və limitləri burada görünəcək.</EmptyState>}
          {tab === "usage" && <UsageTab pass={api.pass} />}
        </div>
      </main>

      <AddProvider
        open={adding}
        taken={cfg.providers.map((p) => p.id)}
        onClose={() => setAdding(false)}
        onAdd={(p) => {
          update({ providers: [...cfg.providers, p] });
          setAdding(false);
          toast.info(`${p.name} əlavə olundu`, "Yadda saxlayın, sonra Modellər bölməsində istədiyiniz modelləri açın.");
        }}
      />
    </div>
  );
}

interface Usage {
  month: string;
  calls: number;
  failed: number;
  tokens: number;
  users: number;
  days: { day: string; calls: number; tokens: number }[];
  models: { model: string; calls: number; tokens: number }[];
}

const fmt = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}k` : String(n));

/** Monthly AI usage from the server log: calls, tokens, unique users, per day and per model. */
function UsageTab({ pass }: { pass: string }) {
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [u, setU] = useState<Usage | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    setU(null);
    fetch(`/api/admin/usage?month=${month}`, { headers: { "x-novo-admin": pass } })
      .then(async (r) => ((await r.json()) as Usage & { error?: string }))
      .then((d) => (d.error ? setErr(d.error) : setU(d)))
      .catch((e) => setErr(String(e)));
  }, [month, pass]);
  if (err) return <Alert tone="danger" title="Statistika alınmadı">{err}</Alert>;
  if (!u) return <p className="py-10 text-center text-[13px] text-ink-500">Yüklənir…</p>;
  const max = Math.max(1, ...u.days.map((d) => d.tokens));
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <input type="month" value={month} onChange={(e) => e.target.value && setMonth(e.target.value)} aria-label="Ay" className="h-10 rounded-xl border border-ink-100/12 bg-ink-1000 px-3 text-[14px] text-ink-100 focus:border-nar focus:outline-none" />
        <p className="text-[12.5px] text-ink-500">Token sayı provayderin hesabatından; hesabat verməyənlər üçün təxmini.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={<Activity />} label="AI sorğusu" value={fmt(u.calls)} note={u.failed ? `${u.failed} uğursuz` : undefined} />
        <Stat icon={<Cpu />} label="Token" value={fmt(u.tokens)} />
        <Stat icon={<Users />} label="Unikal istifadəçi" value={String(u.users)} />
        <Stat icon={<Server />} label="Sorğu başına token" value={u.calls ? fmt(Math.round(u.tokens / u.calls)) : "—"} />
      </div>
      {u.calls === 0 ? (
        <EmptyState icon={<Activity />} title="Bu ay hələ AI sorğusu yoxdur">Studio-da ilk mesaj göndəriləndə statistika burada görünəcək.</EmptyState>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl border border-ink-100/8 bg-ink-1000 p-5">
            <p className="text-[14px] font-medium text-ink-100">Günlük token</p>
            <div className="mt-5 flex h-40 items-end gap-1.5" role="img" aria-label="Günlük token qrafiki">
              {u.days.map((d) => (
                <div key={d.day} className="group relative flex h-full flex-1 flex-col justify-end">
                  <div className="rounded-t-md bg-nar/80 transition-colors group-hover:bg-nar" style={{ height: `${Math.max(3, (d.tokens / max) * 100)}%` }} />
                  <span className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink-100 px-2 py-1 text-[11px] text-ink-1000 opacity-0 group-hover:opacity-100">
                    {d.day.slice(5)} · {fmt(d.tokens)} · {d.calls} sorğu
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-ink-500">
              <span>{u.days[0]?.day.slice(5)}</span>
              <span>{u.days[u.days.length - 1]?.day.slice(5)}</span>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-ink-100/8 bg-ink-1000">
            <p className="px-5 pt-5 text-[14px] font-medium text-ink-100">Modellər üzrə</p>
            <table className="mt-3 w-full text-left text-[13px]">
              <tbody>
                {u.models.map((m) => (
                  <tr key={m.model} className="border-t border-ink-100/8">
                    <td className="max-w-0 truncate px-5 py-2.5 font-mono text-[12px] text-ink-200">{m.model}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-ink-400">{m.calls}</td>
                    <td className="px-5 py-2.5 text-right tabular-nums text-ink-100">{fmt(m.tokens)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function isVisible(cfg: Config, provider: string, id: string) {
  const s = cfg.models.find((m) => m.id === id);
  return provider === "nvidia" ? s?.visible !== false : s?.visible === true;
}

function ModelsTab({ cfg, update }: { cfg: Config; update: (p: Partial<Config>) => void }) {
  const [q, setQ] = useState("");
  const setting = (id: string) => cfg.models.find((m) => m.id === id);
  const patch = (id: string, p: Partial<ModelSetting>) => {
    const exists = cfg.models.some((m) => m.id === id);
    update({ models: exists ? cfg.models.map((m) => (m.id === id ? { ...m, ...p } : m)) : [...cfg.models, { id, ...p }] });
  };
  const rows = useMemo(
    () =>
      cfg.catalog.flatMap((c) =>
        c.ids
          .filter((id) => id.toLowerCase().includes(q.trim().toLowerCase()))
          .slice(0, q ? 200 : c.provider === "nvidia" ? 60 : 40)
          .map((id) => ({ id, provider: c.provider }))
      ),
    [cfg.catalog, q]
  );
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input icon={<Search />} placeholder="Model axtar (məs. claude, gpt, qwen)" value={q} onChange={(e) => setQ(e.target.value)} className="w-full max-w-sm" aria-label="Model axtar" />
        <p className="text-[12.5px] text-ink-500">NVIDIA modelləri standart olaraq görünür; digər provayderlərin modellərini özünüz açın.</p>
      </div>
      <div className="overflow-x-auto rounded-3xl border border-ink-100/8 bg-ink-1000">
        <table className="w-full min-w-[760px] text-left text-[13.5px]">
          <thead className="border-b border-ink-100/8 text-[12px] text-ink-500">
            <tr>
              <th className="px-5 py-3 font-medium">Model</th>
              <th className="px-3 py-3 font-medium">İstifadəçiyə görünən ad</th>
              <th className="px-3 py-3 font-medium">Kredit</th>
              <th className="px-3 py-3 font-medium">Standart</th>
              <th className="px-5 py-3 font-medium">Görünür</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ id, provider }) => {
              const s = setting(id);
              const visible = isVisible(cfg, provider, id);
              return (
                <tr key={id} className="border-t border-ink-100/8 first:border-t-0">
                  <td className="px-5 py-2.5">
                    <span className="font-mono text-[12px] text-ink-200">{id.replace(/^[a-z0-9-]+::/, "")}</span>
                    <span className="ml-2 rounded-full bg-ink-100/[0.06] px-2 py-0.5 text-[11px] text-ink-400">{provider}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <input aria-label="Görünən ad" placeholder="avtomatik" value={s?.label ?? ""} onChange={(e) => patch(id, { label: e.target.value || undefined })} className="w-full rounded-lg bg-transparent px-2 py-1 text-ink-100 placeholder:text-ink-500 hover:bg-ink-100/[0.04] focus:bg-ink-100/[0.06] focus:outline-none" />
                  </td>
                  <td className="px-3 py-2.5">
                    <input type="number" min={0} aria-label="Kredit" value={s?.credits ?? 1} onChange={(e) => patch(id, { credits: Number(e.target.value) })} className="w-16 rounded-lg border border-ink-100/12 bg-ink-1000 px-2 py-1 text-ink-100 focus:border-nar focus:outline-none" />
                  </td>
                  <td className="px-3 py-2.5">
                    <input type="radio" name="default-model" aria-label="Standart model" className="nv-radio" checked={cfg.defaultModel === id} onChange={() => update({ defaultModel: id })} />
                  </td>
                  <td className="px-5 py-2.5">
                    <input type="checkbox" role="switch" aria-label="Görünür" className="nv-switch" checked={visible} onChange={(e) => patch(id, { visible: e.target.checked })} />
                  </td>
                </tr>
              );
            })}
            {!rows.length && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-ink-500">
                  {q ? "Heç nə tapılmadı" : "Model siyahısı alınmadı — provayder açarlarını yoxlayın."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Gate({ onLogin, error, loading }: { onLogin: (p: string) => void; error: string | null; loading: boolean }) {
  const [p, setP] = useState("");
  return (
    <main className="grid min-h-dvh place-items-center bg-wool px-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (p) onLogin(p);
        }}
        className="w-full max-w-[380px] rounded-[28px] border border-ink-100/10 bg-ink-1000 p-7 shadow-[var(--shadow-panel)]"
      >
        <span className="grid size-11 place-items-center rounded-2xl bg-nar/10 text-nar">
          <Lock className="size-5" />
        </span>
        <h1 className="mt-5 font-display text-[26px] tracking-[-0.02em] text-ink-100">Admin panel</h1>
        <p className="mt-1 text-[13.5px] text-ink-400">Serverdəki NOVO_ADMIN_PASSWORD şifrəsini daxil edin.</p>
        <Field label="Şifrə" error={error ?? undefined} className="mt-6">
          {(id, d) => <Input id={id} aria-describedby={d} aria-invalid={!!error} type="password" autoComplete="current-password" value={p} onChange={(e) => setP(e.target.value)} autoFocus />}
        </Field>
        <Button type="submit" variant="white" className="mt-4 w-full" disabled={!p || loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : null} Daxil ol
        </Button>
        <ButtonLink href="/app" variant="ghost" className="mt-2 w-full">
          Tətbiqə qayıt
        </ButtonLink>
      </form>
    </main>
  );
}

function Row({ icon, title, sub, on, onToggle, onDelete, error }: { icon: React.ReactNode; title: string; sub: string; on: boolean; onToggle?: (v: boolean) => void; onDelete?: () => void; error?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-4 border-t border-ink-100/8 px-5 py-4 first:border-t-0">
      <span className="grid size-10 place-items-center rounded-xl bg-ink-100/[0.06] text-ink-300 [&>svg]:size-[18px]">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[14.5px] font-medium text-ink-100">{title}</p>
        <p className="truncate font-mono text-[12px] text-ink-500">{sub}</p>
        {error && <p className="mt-0.5 text-[12px] text-danger">{error}</p>}
      </div>
      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px]", on ? "bg-success/10 text-success" : "bg-ink-100/[0.06] text-ink-400")}>
        <span className={cn("size-1.5 rounded-full", on ? "bg-success" : "bg-ink-500")} />
        {on ? "Aktiv" : "Söndürülüb"}
      </span>
      {onToggle && <input type="checkbox" role="switch" aria-label={`${title} aktiv`} className="nv-switch" checked={on} onChange={(e) => onToggle(e.target.checked)} />}
      {onDelete && (
        <button type="button" aria-label="Sil" onClick={onDelete} className="grid size-8 place-items-center rounded-full text-ink-500 hover:bg-danger/10 hover:text-danger">
          <Trash2 className="size-4" />
        </button>
      )}
    </div>
  );
}

function Stat({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: string; note?: string }) {
  return (
    <div className="rounded-3xl border border-ink-100/8 bg-ink-1000 p-5 shadow-[var(--shadow-card)]">
      <span className="grid size-9 place-items-center rounded-xl bg-nar/10 text-nar [&>svg]:size-[18px]">{icon}</span>
      <p className="mt-4 font-display text-[30px] leading-none tracking-[-0.02em] text-ink-100">{value}</p>
      <p className="mt-1.5 text-[13px] text-ink-400">{label}</p>
      {note && <p className="text-[11.5px] text-ink-500">{note}</p>}
    </div>
  );
}

function AddProvider({ open, taken, onClose, onAdd }: { open: boolean; taken: string[]; onClose: () => void; onAdd: (p: Provider) => void }) {
  const [kind, setKind] = useState("openrouter");
  const [url, setUrl] = useState(KINDS[0].url);
  const [key, setKey] = useState("");
  const k = KINDS.find((x) => x.id === kind)!;
  let id = kind;
  for (let i = 2; taken.includes(id); i++) id = `${kind}-${i}`;
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
          <Button
            variant="primary"
            disabled={!key.trim() || !/^https?:\/\/.+/.test(url)}
            onClick={() => {
              onAdd({ id, name: k.name, baseUrl: url, key: key.trim(), enabled: true });
              setKey("");
            }}
          >
            Əlavə et
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Field label="Provayder">
          {(fid) => (
            <Select
              id={fid}
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
        <Field label="API ünvanı" hint="OpenAI uyğun /v1 ünvanı (…/chat/completions və …/models olmalıdır).">
          {(fid, d) => <Input id={fid} aria-describedby={d} value={url} onChange={(e) => setUrl(e.target.value)} className="font-mono" />}
        </Field>
        <Field label="API açarı" hint="Serverdə şifrələnmiş saxlanılır, istifadəçilərə heç vaxt göstərilmir.">
          {(fid, d) => <Input id={fid} aria-describedby={d} type="password" autoComplete="off" value={key} onChange={(e) => setKey(e.target.value)} placeholder="sk-…" icon={<KeyRound />} />}
        </Field>
        <Alert tone="info" title="Model id-si">
          Bu provayderin modelləri “{id}::model-adı” kimi görünəcək.
        </Alert>
      </div>
    </Modal>
  );
}
