"use client";
import { get, set, del, keys } from "idb-keyval";
import type { Project } from "../types";
import { TEMPLATE_FILES } from "../template";
import { supabase } from "../supabase";

/* ---------- optional cloud sync (Supabase, signed-in users only) ---------- */
async function remote() {
  const sb = supabase();
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  const uid = data.session?.user.id;
  return uid ? { sb, uid } : null;
}
function pushRemote(p: Project) {
  remote()
    .then((r) => r && r.sb.from("projects").upsert({ id: p.id, user_id: r.uid, name: p.name, data: p, updated_at: new Date(p.updatedAt).toISOString() }))
    .catch(() => {});
}

const K = (id: string) => `project:${id}`;
export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

export async function createProject(prompt: string, images?: string[]): Promise<Project> {
  const now = Date.now();
  const p: Project = {
    id: uid(),
    name: prompt.trim().split(/\s+/).slice(0, 5).join(" ").slice(0, 40) || "Yeni layihə",
    files: { ...TEMPLATE_FILES },
    messages: [],
    pendingPrompt: { text: prompt, images },
    createdAt: now,
    updatedAt: now,
  };
  await set(K(p.id), p);
  pushRemote(p);
  return p;
}

/** A project from existing files (GitHub import). Missing template files are filled in. */
export async function createProjectFromFiles(name: string, files: Record<string, string>): Promise<Project> {
  const now = Date.now();
  const runnable = "package.json" in files;
  const p: Project = { id: uid(), name: name.slice(0, 40) || "Gətirilmiş layihə", files: runnable ? files : { ...TEMPLATE_FILES, ...files }, messages: [], createdAt: now, updatedAt: now };
  await set(K(p.id), p);
  pushRemote(p);
  return p;
}

export const getProject = (id: string) => get<Project>(K(id));

export async function saveProject(p: Project) {
  const next = { ...p, updatedAt: Date.now() };
  await set(K(p.id), next);
  pushRemote(next);
}

export async function deleteProject(id: string) {
  await del(K(id));
  remote()
    .then((r) => r && r.sb.from("projects").delete().eq("id", id))
    .catch(() => {});
}

export async function listProjects(): Promise<Project[]> {
  const all = (await keys()).filter((k) => String(k).startsWith("project:"));
  const items = (await Promise.all(all.map((k) => get<Project>(k)))).filter((x): x is Project => !!x);
  // signed in: bring down projects from other devices / newer versions
  try {
    const r = await remote();
    if (r) {
      const { data } = await r.sb.from("projects").select("data").eq("user_id", r.uid).order("updated_at", { ascending: false }).limit(200);
      const byId = new Map(items.map((p) => [p.id, p]));
      for (const row of data ?? []) {
        const rp = row.data as Project;
        const lp = byId.get(rp.id);
        if (!lp || rp.updatedAt > lp.updatedAt) {
          byId.set(rp.id, rp);
          await set(K(rp.id), rp);
        } else if (lp.updatedAt > rp.updatedAt) pushRemote(lp);
      }
      for (const lp of items) if (!(data ?? []).some((row) => (row.data as Project).id === lp.id)) pushRemote(lp);
      return [...byId.values()].sort((a, b) => b.updatedAt - a.updatedAt);
    }
  } catch {
    /* offline or not configured — local list is the source of truth */
  }
  return items.sort((a, b) => b.updatedAt - a.updatedAt);
}
