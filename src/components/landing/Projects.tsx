"use client";
import { ArrowUpRight, Trash2 } from "lucide-react";
import { deleteProject } from "@/lib/store/projects";
import type { Project } from "@/lib/types";
import { toast } from "@/components/ui/toast";
import { Container, Glass } from "./Section";

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
    <section id="layihələrim" className="relative scroll-mt-24 py-16">
      <Container>
        <div className="mb-5 flex items-baseline justify-between label-mono text-ink-400">
          <span>Layihələrim</span>
          <span>{projects.length} · bu brauzerdə</span>
        </div>
        <Glass className="divide-y divide-ink-100/[0.07]">
          {projects.slice(0, 6).map((p) => (
            <div key={p.id} className="group flex items-center gap-4 px-5">
              <a href={`/studio/${p.id}`} className="flex flex-1 items-center gap-4 py-4">
                <span className="flex-1 truncate text-[15px] transition-colors duration-200 group-hover:text-nar-600">{p.name}</span>
                <span className="font-mono text-[11px] text-ink-500">{timeAgo(p.updatedAt)}</span>
                <ArrowUpRight className="size-4 text-ink-500" />
              </a>
              <button
                aria-label="Layihəni sil"
                onClick={async () => {
                  if (!confirm(`"${p.name}" silinsin?`)) return;
                  await deleteProject(p.id);
                  onChange(projects.filter((x) => x.id !== p.id));
                  toast.success("Layihə silindi");
                }}
                className="p-2 text-ink-500 opacity-0 transition-opacity duration-200 hover:text-danger group-hover:opacity-100 focus-visible:opacity-100"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </Glass>
      </Container>
    </section>
  );
}
