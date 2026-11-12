"use client";
import { useCallback, useSyncExternalStore } from "react";

export type ThemeName = "light" | "dark";
const KEY = "novo-theme";

/** Runs in <head> before paint so the page never flashes the wrong theme. */
export const THEME_BOOT = `(function(){try{var t=localStorage.getItem("${KEY}");if(t!=="dark"&&t!=="light")t="light";document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme="light";}})();`;

const listeners = new Set<() => void>();
function read(): ThemeName {
  return typeof document !== "undefined" && document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function setTheme(t: ThemeName) {
  document.documentElement.dataset.theme = t;
  try {
    localStorage.setItem(KEY, t);
  } catch {}
  listeners.forEach((l) => l());
}

export function useTheme() {
  const theme = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => "light" as ThemeName
  );
  const toggle = useCallback(() => setTheme(read() === "dark" ? "light" : "dark"), []);
  return { theme, toggle };
}
