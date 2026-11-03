"use client";
import { get, set, del, keys } from "idb-keyval";
import type { Project } from "../types";
import { TEMPLATE_FILES } from "../template";

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
  return p;
}

export const getProject = (id: string) => get<Project>(K(id));

export async function saveProject(p: Project) {
  await set(K(p.id), { ...p, updatedAt: Date.now() });
}

export const deleteProject = (id: string) => del(K(id));

export async function listProjects(): Promise<Project[]> {
  const all = (await keys()).filter((k) => String(k).startsWith("project:"));
  const items = await Promise.all(all.map((k) => get<Project>(k)));
  return items.filter((x): x is Project => !!x).sort((a, b) => b.updatedAt - a.updatedAt);
}
