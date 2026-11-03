"use client";
import { Trash2 } from "lucide-react";
import { deleteProject } from "@/lib/store/projects";
import type { Project } from "@/lib/types";
import { toast } from "@/components/ui/toast";
import { Container } from "./Section";

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
    <section id="layihələrim" className="scroll-mt-20 pb-16">
      <Container>
        <div className="flex items-baseline justify-between border-b-[1.5px] border-ink pb-3">
          <h2 className="font-display text-2xl font-medium">Layihələrim</h2>
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-400">{projects.length} layihə · bu brauzerdə</span>
        </div>
        <ul>
          {projects.slice(0, 8).map((p, i) => (
            <li key={p.id} className="group flex items-center gap-4 border-b border-ink-100/15">
              <a href={`/studio/${p.id}`} className="flex flex-1 items-baseline gap-5 py-4">
                <span className="font-mono text-[12px] text-nar">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 truncate text-[16px] group-hover:text-nar">{p.name}</span>
                <span className="font-mono text-[11.5px] text-ink-400">{timeAgo(p.updatedAt)}</span>
              </a>
              <button
                aria-label="Layihəni sil"
                onClick={async () => {
                  if (!confirm(`"${p.name}" silinsin?`)) return;
                  await deleteProject(p.id);
                  onChange(projects.filter((x) => x.id !== p.id));
                  toast.success("Layihə silindi");
                }}
                className="p-2 text-ink-500 opacity-0 transition hover:text-danger group-hover:opacity-100"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
