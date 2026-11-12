"use client";
import "@astryxdesign/core/astryx.css";
import { Theme } from "@astryxdesign/core/theme";
import { themes, defaultThemeSlug } from "@/astryx-themes";
import { useTheme } from "@/lib/theme";

/** Astryx components (dialogs, command palette) follow the app's day/night theme. */
export function AstryxTheme({ children, className }: { children: React.ReactNode; className?: string }) {
  const { theme } = useTheme();
  return (
    <Theme theme={themes[defaultThemeSlug]} mode={theme}>
      <div className={className}>{children}</div>
    </Theme>
  );
}
