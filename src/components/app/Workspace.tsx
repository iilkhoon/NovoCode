"use client";
import { useEffect, useRef, useState } from "react";
import { AppWindow, ArrowUpRight, Copy, Database, FolderOpen, Globe2, LayoutGrid, List, MoreHorizontal, PanelsTopLeft, Pencil, Share2, Trash2 } from "lucide-react";
import { PromptBox } from "@/components/PromptBox";
import { useStartProject } from "@/components/landing/useStart";
import { EXAMPLES, TYPEWRITER } from "@/components/landing/data";
import { Button } from "@/components/ui/button";
import { EmptyState, Menu, MenuItem, MenuSeparator, Modal, Segmented, Skeleton } from "@/components/ui/kit";
import { toast } from "@/components/ui/toast";
import { deleteProject, listProjects, saveProject } from "@/lib/store/projects";
import { openModal, usePrefs } from "@/lib/ui-store";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/cn";
import { Sidebar, projectHue } from "./Sidebar";
import { Github } from "./Modals";
import { EXAMPLES_I18N, useT, type TKey } from "@/lib/i18n";
import { LangSwitch } from "@/components/ui/LangSwitch";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { GradientBackdrop } from "@/components/ui/GradientBackdrop";

type Kind = "site" | "landing" | "app" | "full";
const KINDS: { value: Kind; label: TKey; icon: React.ReactNode; hint: string }[] = [
  { value: "site", label: "kind.site", icon: <Globe2 />, hint: "" },
  { value: "landing", label: "kind.landing", icon: <PanelsTopLeft />, hint: "Build a single conversion-focused landing page." },
  { value: "app", label: "kind.app", icon: <AppWindow />, hint: "Build an interactive web app (dashboard / tool), not a marketing site." },
  { value: "full", label: "kind.full", icon: <Database />, hint: "Include a real data layer: auth, persistent collections and an admin view." },
];

function greeting(): TKey {
  const h = new Date().getHours();
  return h < 5 ? "greet.night" : h < 12 ? "greet.morning" : h < 18 ? "greet.day" : "greet.evening";
}

export function timeAgo(ts: number) {
  const s = (Date.now() - ts) / 1000;
  if (s < 60) return "indicə";
  if (s < 3600) return `${Math.floor(s / 60)} dəq əvvəl`;
  if (s < 86400) return `${Math.floor(s / 3600)} saat əvvəl`;
  return new Date(ts).toLocaleDateString("az-AZ", { day: "numeric", month: "long" });
}

export function Workspace() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [value, setValue] = useState("");
  const [kind, setKind] = useState<Kind>("site");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [confirm, setConfirm] = useState<Project | null>(null);
  const [rename, setRename] = useState<Project | null>(null);
  const { start, starting } = useStartProject();
  const prefs = usePrefs();
  const top = useRef<HTMLDivElement>(null);
  const t = useT();
  const examples = t.lang === "az" ? EXAMPLES : EXAMPLES_I18N[t.lang];

  useEffect(() => {
    listProjects()
      .then(setProjects)
      .catch(() => setProjects([]));
  }, []);

  const focusPrompt = () => {
    top.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => document.querySelector<HTMLTextAreaElement>("#workspace-prompt textarea")?.focus(), 250);
  };

  const submit = (text: string, images: string[], styleId: string) => {
    const hint = KINDS.find((k) => k.value === kind)?.hint;
    start(hint ? `${text}\n\n(${hint})` : text, images, styleId);
  };

  const remove = async (p: Project) => {
    await deleteProject(p.id);
    setProjects((x) => x?.filter((i) => i.id !== p.id) ?? null);
    setConfirm(null);
    toast.show({
      tone: "success",
      title: "Layihə silindi",
      description: p.name,
      action: {
        label: "Geri qaytar",
        onClick: async () => {
          await saveProject(p);
          setProjects((x) => [p, ...(x ?? [])]);
        },
      },
    });
  };

  const duplicate = async (p: Project) => {
    const copy = { ...p, id: Math.random().toString(36).slice(2, 10), name: `${p.name} (surət)`, createdAt: Date.now(), updatedAt: Date.now() };
    await saveProject(copy);
    setProjects((x) => [copy, ...(x ?? [])]);
    toast.success("Surət yaradıldı");
  };

  const firstName = (prefs.name || "").split(" ")[0];

  return (
    <div className="flex min-h-dvh bg-wool max-md:flex-col">
      <Sidebar projects={projects ?? []} onNew={focusPrompt} />

      <main className="relative min-w-0 flex-1">
        {/* hero */}
        <section ref={top} className="paper relative isolate overflow-hidden px-4 pb-16 pt-16 sm:px-8 md:pt-24">
          <GradientBackdrop className="-z-10 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]" intensity={0.9} reach={1.05} />
          <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-b from-transparent to-wool" />
          <div className="absolute right-4 top-4 hidden items-center gap-1 md:flex">
            <LangSwitch />
            <ThemeToggle />
          </div>
          <div className="mx-auto flex max-w-[720px] flex-col items-center text-center">
            <h1 className="nv-anim font-display text-[clamp(32px,5vw,52px)] font-[650] leading-[1.05] tracking-[-0.03em] text-ink-100 ">
              {t(greeting())}
              {firstName && firstName !== "Qonaq" ? `, ${firstName}` : ""}.
              <br />
              <span className="text-brand">{t("app.ask")}</span>
            </h1>
            <div id="workspace-prompt" className="nv-anim mt-8 w-full text-left" style={{ "--d": "0.12s" } as React.CSSProperties}>
              <div className="mb-3 flex justify-center">
                <Segmented size="sm" label="Layihə növü" value={kind} onChange={setKind} options={KINDS.map(({ value, label, icon }) => ({ value, label: t(label), icon }))} />
              </div>
              <PromptBox key={t.lang} size="lg" typewriter={t.lang === "az" ? TYPEWRITER : examples.map((e) => e.prompt.split(":")[0] + "…")} value={value} onValueChange={setValue} busy={starting} onSubmit={({ text, images, styleId }) => submit(text, images, styleId)} />
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {examples.slice(0, 4).map((ex) => (
                  <button key={ex.label} type="button" onClick={() => setValue(ex.prompt)} className="rounded-full border border-ink-100/10 bg-ink-1000/70 px-3.5 py-1.5 text-[13px] text-ink-300 backdrop-blur-sm transition-[color,border-color,transform] hover:-translate-y-px hover:border-nar/40 hover:text-ink-100">
                    {ex.label}
                  </button>
                ))}
                <span className="mx-1 h-4 w-px bg-ink-100/15" />
                <button type="button" onClick={() => openModal("import", { tab: "github" })} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] text-ink-400 transition-colors hover:text-ink-100">
                  <Github className="size-3.5" /> {t("app.fromGithub")}
                </button>
                <button type="button" onClick={() => openModal("import", { tab: "url" })} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] text-ink-400 transition-colors hover:text-ink-100">
                  <Globe2 className="size-3.5" /> {t("app.cloneSite")}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* projects */}
        <section id="layihələr" className="mx-auto max-w-[1180px] scroll-mt-6 px-4 pb-24 sm:px-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-[26px] font-[650] tracking-[-0.02em] text-ink-100">{t("app.myProjects")}</h2>
              <p className="text-[13px] text-ink-400">{projects ? t("app.count", { n: projects.length }) : t("app.loading")}</p>
            </div>
            <Segmented
              size="sm"
              label="Görünüş"
              value={view}
              onChange={setView}
              options={[
                { value: "grid", label: <span className="sr-only">Kartlar</span>, icon: <LayoutGrid /> },
                { value: "list", label: <span className="sr-only">Siyahı</span>, icon: <List /> },
              ]}
            />
          </div>

          {projects === null ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="overflow-hidden rounded-3xl border border-ink-100/8 bg-ink-1000">
                  <Skeleton className="aspect-[16/10] rounded-none" />
                  <div className="space-y-2 p-4">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <EmptyState
              icon={<FolderOpen />}
              title={t("app.emptyTitle")}
              action={
                <Button variant="white" onClick={focusPrompt}>
                  {t("app.startTyping")}
                </Button>
              }
            >
              {t("app.emptyBody")}
            </EmptyState>
          ) : view === "grid" ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p.id} p={p} onDelete={() => setConfirm(p)} onDuplicate={() => duplicate(p)} onRename={() => setRename(p)} />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-ink-100/8 overflow-hidden rounded-3xl border border-ink-100/8 bg-ink-1000">
              {projects.map((p) => (
                <div key={p.id} className="group flex items-center gap-4 px-4 py-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl font-display text-[15px] text-white" style={{ background: `linear-gradient(135deg, hsl(${projectHue(p.id)} 80% 62%), hsl(${projectHue(p.id) + 30} 70% 45%))` }}>
                    {p.name[0]?.toUpperCase()}
                  </span>
                  <a href={`/studio/${p.id}`} className="min-w-0 flex-1">
                    <span className="block truncate text-[14.5px] font-medium text-ink-100 group-hover:text-nar">{p.name}</span>
                    <span className="block text-[12px] text-ink-500">{Object.keys(p.files).length} fayl · {timeAgo(p.updatedAt)}</span>
                  </a>
                  <CardMenu onDelete={() => setConfirm(p)} onDuplicate={() => duplicate(p)} onRename={() => setRename(p)} p={p} />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        size="sm"
        title="Layihə silinsin?"
        description={confirm ? `“${confirm.name}” və onun bütün söhbət tarixçəsi silinəcək.` : ""}
        icon={<Trash2 />}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirm(null)}>
              Ləğv et
            </Button>
            <Button className="!bg-danger !text-white" onClick={() => confirm && remove(confirm)}>
              Sil
            </Button>
          </>
        }
      />

      <RenameModal
        project={rename}
        onClose={() => setRename(null)}
        onSave={async (p, name) => {
          const next = { ...p, name, updatedAt: Date.now() };
          await saveProject(next);
          setProjects((x) => x?.map((i) => (i.id === p.id ? next : i)) ?? null);
          setRename(null);
          toast.success("Ad dəyişdirildi");
        }}
      />
    </div>
  );
}

function ProjectCard({ p, onDelete, onDuplicate, onRename }: { p: Project; onDelete: () => void; onDuplicate: () => void; onRename: () => void }) {
  const t = useT();
  const hue = projectHue(p.id);
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-ink-100/8 bg-ink-1000 shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-[var(--shadow-panel)]">
      <a href={`/studio/${p.id}`} className="block" aria-label={`${p.name} — studioda aç`}>
        <div className="relative aspect-[16/10] overflow-hidden" style={{ background: `linear-gradient(140deg, hsl(${hue} 85% 92%), hsl(${hue + 25} 70% 80%))` }}>
          {/* a miniature "website" sketch */}
          <div className="absolute inset-x-5 top-5 bottom-0 rounded-t-xl bg-white/85 p-3 shadow-[0_10px_30px_-10px_rgb(0_0_0/0.25)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-8 rounded-full" style={{ background: `hsl(${hue} 70% 45%)` }} />
              <span className="ml-auto h-1.5 w-5 rounded-full bg-black/10" />
              <span className="h-1.5 w-5 rounded-full bg-black/10" />
            </div>
            <div className="mt-4 h-2.5 w-3/5 rounded-full bg-black/75" />
            <div className="mt-1.5 h-2.5 w-2/5 rounded-full bg-black/75" />
            <div className="mt-3 h-1.5 w-4/5 rounded-full bg-black/10" />
            <div className="mt-3 h-4 w-16 rounded-full" style={{ background: `hsl(${hue} 75% 52%)` }} />
            <div className="mt-4 grid grid-cols-3 gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="aspect-[4/3] rounded-md" style={{ background: `hsl(${hue + i * 12} 50% ${85 - i * 5}%)` }} />
              ))}
            </div>
          </div>
          <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white/90 text-ink-100 opacity-0 shadow transition-opacity group-hover:opacity-100">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </a>
      <div className="flex items-center gap-2 p-4">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[14.5px] font-medium text-ink-100">{p.name}</h3>
          <p className="flex items-center gap-1.5 text-[12px] text-ink-500">
            {p.publish && (
              <a href={p.publish.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full bg-success/10 px-1.5 py-px font-medium text-success hover:bg-success/15">
                <span className="size-1.5 rounded-full bg-success" /> {t("app.live")}
              </a>
            )}
            {t("app.edited", { t: timeAgo(p.updatedAt) })}
          </p>
        </div>
        <CardMenu p={p} onDelete={onDelete} onDuplicate={onDuplicate} onRename={onRename} />
      </div>
    </article>
  );
}

function CardMenu({ p, onDelete, onDuplicate, onRename }: { p: Project; onDelete: () => void; onDuplicate: () => void; onRename: () => void }) {
  const [open, setOpen] = useState(false);
  const t = useT();
  const run = (fn: () => void) => () => (setOpen(false), fn());
  return (
    <div className="relative">
      <button type="button" aria-label="Layihə əməliyyatları" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)} className={cn("grid size-8 place-items-center rounded-full text-ink-400 transition-colors hover:bg-ink-100/[0.06] hover:text-ink-100", open && "bg-ink-100/[0.06] text-ink-100")}>
        <MoreHorizontal className="size-4" />
      </button>
      <Menu open={open} onClose={() => setOpen(false)}>
        <MenuItem icon={<ArrowUpRight />} onClick={run(() => (window.location.href = `/studio/${p.id}`))}>
          {t("menu.open")}
        </MenuItem>
        <MenuItem icon={<Pencil />} onClick={run(onRename)}>
          {t("menu.rename")}
        </MenuItem>
        <MenuItem icon={<Copy />} onClick={run(onDuplicate)}>
          {t("menu.duplicate")}
        </MenuItem>
        <MenuItem icon={<Share2 />} onClick={run(() => openModal("share", { name: p.name, url: p.publish?.url ?? `https://${slug(p.name)}.novocode.app` }))}>
          {t("menu.share")}
        </MenuItem>
        <MenuSeparator />
        <MenuItem icon={<Trash2 />} danger onClick={run(onDelete)}>
          {t("menu.delete")}
        </MenuItem>
      </Menu>
    </div>
  );
}

export function slug(name: string) {
  const map: Record<string, string> = { ə: "e", ı: "i", ö: "o", ü: "u", ş: "s", ç: "c", ğ: "g" };
  return (
    name
      .toLowerCase()
      .replace(/[əıöüşçğ]/g, (c) => map[c])
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 30) || "layihe"
  );
}

function RenameModal({ project, onClose, onSave }: { project: Project | null; onClose: () => void; onSave: (p: Project, name: string) => void }) {
  const [name, setName] = useState("");
  useEffect(() => setName(project?.name ?? ""), [project]);
  return (
    <Modal
      open={!!project}
      onClose={onClose}
      size="sm"
      title="Adını dəyiş"
      icon={<Pencil />}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Ləğv et
          </Button>
          <Button variant="primary" disabled={!name.trim()} onClick={() => project && onSave(project, name.trim())}>
            Saxla
          </Button>
        </>
      }
    >
      <form onSubmit={(e) => (e.preventDefault(), project && name.trim() && onSave(project, name.trim()))}>
        <input value={name} onChange={(e) => setName(e.target.value)} aria-label="Layihənin adı" className="h-11 w-full rounded-xl border border-ink-100/12 bg-ink-1000 px-3.5 text-[14.5px] text-ink-100 focus:border-nar focus:outline-none focus:ring-4 focus:ring-nar/15" />
      </form>
    </Modal>
  );
}
