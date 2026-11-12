"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/cn";

/** Sun ↔ moon. The icons cross-fade and rotate instead of snapping. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Gündüz rejimi" : "Gecə rejimi"}
      title={dark ? "Gündüz rejimi" : "Gecə rejimi"}
      className={cn("relative grid size-9 place-items-center rounded-full text-ink-300 transition-colors duration-200 hover:bg-ink-100/[0.06] hover:text-ink-100", className)}
    >
      <Sun className={cn("absolute size-[17px] transition-[transform,opacity] duration-500 ease-[var(--ease-out-expo)]", dark ? "rotate-90 scale-50 opacity-0" : "rotate-0 opacity-100")} strokeWidth={1.8} />
      <Moon className={cn("absolute size-[16px] transition-[transform,opacity] duration-500 ease-[var(--ease-out-expo)]", dark ? "rotate-0 opacity-100" : "-rotate-90 scale-50 opacity-0")} strokeWidth={1.8} />
    </button>
  );
}
