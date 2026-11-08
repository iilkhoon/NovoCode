"use client";
import "@astryxdesign/core/astryx.css";
import { Theme } from "@astryxdesign/core/theme";
import { themes, defaultThemeSlug } from "@/astryx-themes";

/** Astryx komponentləri üçün Bürünc mövzusu (həmişə qaranlıq). */
export function AstryxTheme({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Theme theme={themes[defaultThemeSlug]} mode="dark">
      <div className={className}>{children}</div>
    </Theme>
  );
}
