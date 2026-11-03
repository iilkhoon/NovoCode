"use client";
import { useState } from "react";
import { createProject } from "@/lib/store/projects";
import { applyStyle } from "@/lib/styles";

/** Creates a project and opens the studio (full load: studio needs cross-origin isolation). */
export function useStartProject() {
  const [starting, setStarting] = useState(false);
  async function start(text: string, images: string[] = [], styleId = "auto") {
    setStarting(true);
    const p = await createProject(applyStyle(text, styleId), images);
    window.location.assign(`/studio/${p.id}`);
  }
  return { start, starting };
}
