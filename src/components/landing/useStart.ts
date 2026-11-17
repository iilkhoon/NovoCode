"use client";
import { useState } from "react";
import { createProject, createProjectFromFiles } from "@/lib/store/projects";
import type { Template } from "./data";
import { applyStyle } from "@/lib/styles";
import { toast } from "@/components/ui/toast";

/** Creates a project and opens the studio (full load: studio needs cross-origin isolation). */
export function useStartProject() {
  const [starting, setStarting] = useState(false);
  async function start(text: string, images: string[] = [], styleId = "auto") {
    setStarting(true);
    try {
      const p = await createProject(applyStyle(text, styleId), images);
      window.location.assign(`/studio/${p.id}`);
    } catch {
      // IndexedDB can be unavailable (private mode, full disk, blocked storage)
      setStarting(false);
      toast.error("Layihə yaradılmadı: brauzer yaddaşı əlçatan deyil. Gizli rejimdən çıxıb yenidən cəhd edin.");
    }
  }
  /** Opens a ready-made, tested template instantly — no AI round-trip. */
  async function startTemplate(t: Template) {
    setStarting(true);
    try {
      const [{ SITE_TEMPLATES }, { welcomeMessage }] = await Promise.all([import("@/lib/templates"), import("@/lib/templates/start")]);
      const files = SITE_TEMPLATES[t.id];
      if (!files) return start(t.prompt); // unknown id: let the AI build it
      const p = await createProjectFromFiles(t.name, files, [welcomeMessage(t.id, t.name)]);
      window.location.assign(`/studio/${p.id}`);
    } catch {
      setStarting(false);
      toast.error("Layihə yaradılmadı: brauzer yaddaşı əlçatan deyil. Gizli rejimdən çıxıb yenidən cəhd edin.");
    }
  }
  return { start, startTemplate, starting };
}
