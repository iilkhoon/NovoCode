"use client";
import { motion } from "motion/react";
import { ArrowUpRight, Trash2 } from "lucide-react";
import { deleteProject } from "@/lib/store/projects";
import type { Project } from "@/lib/types";
import { EASE } from "@/components/ui/motion";
import { toast } from "@/components/ui/toast";

function timeAgo(ts: number) {
  const s = (Date.now() - ts) / 1000;
  if (s < 60) return "indicə";
  if (s < 3600) return `${Math.floor(s / 60)} dəq əvvəl`;
  if (s < 86400) return `${Math.floor(s / 3600)} saat əvvəl`;
  return new Date(ts).toLocaleDateString("az-AZ", { day: "numeric", month: "long" });
}

export function Projects({ projects, onChange }: { projects: Project[]; onChange: (p: Project[]) => void }) {
  if (!projects.length) return null;
  return (
    <section id="layihələrim" className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-6 pt-16">
      <div className="mb-5 flex items-end justify-between">
        <h2 className="font-display text-xl font-medium tracking-tight">Layihələrim</h2>
        <span className="text-sm text-ink-400">{projects.length} layihə · bu brauzerdə saxlanılır</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {projects.slice(0, 8).map((p, i) => {
          const hue = (p.id.charCodeAt(0) * 37 + p.id.charCodeAt(1) * 13) % 360;
          return (
            <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, ease: EASE, duration: 0.6 }} className="group relative">
              <a href={`/studio/${p.id}`} className="block rounded-2xl border border-white/8 bg-ink-900/70 p-3 transition-all duration-300 hover:-translate-y-1 hover:border-white/18">
                <div
                  className="relative mb-3 aspect-[16/9] overflow-hidden rounded-xl"
                  style={{ background: `radial-gradient(120% 120% at 0% 0%, hsl(${hue} 80% 60% / 0.35), transparent 60%), radial-gradient(100% 100% at 100% 100%, hsl(${(hue + 60) % 360} 80% 55% / 0.3), transparent 60%), #121119` }}
                >
                  <span className="absolute bottom-3 left-3 font-display text-3xl font-semibold tracking-tight text-white/80">{p.name.slice(0, 1).toUpperCase()}</span>
                  <ArrowUpRight className="absolute right-3 top-3 size-4 text-white/0 transition group-hover:text-white/80" />
                </div>
                <div className="truncate px-1 text-[14px] font-medium">{p.name}</div>
                <div className="px-1 text-xs text-ink-400">{timeAgo(p.updatedAt)}</div>
              </a>
              <button
                aria-label="Layihəni sil"
                onClick={async () => {
                  if (!confirm(`"${p.name}" silinsin?`)) return;
                  await deleteProject(p.id);
                  onChange(projects.filter((x) => x.id !== p.id));
                  toast.success("Layihə silindi");
                }}
                className="absolute right-5 top-5 rounded-lg bg-ink-950/70 p-1.5 text-ink-300 opacity-0 backdrop-blur transition hover:text-danger group-hover:opacity-100"
              >
                <Trash2 className="size-3.5" />
              </button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
