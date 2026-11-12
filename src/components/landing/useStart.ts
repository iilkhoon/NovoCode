"use client";
import { useState } from "react";
import { createProject } from "@/lib/store/projects";
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
  return { start, starting };
}
