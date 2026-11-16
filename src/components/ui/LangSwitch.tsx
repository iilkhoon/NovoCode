"use client";
import { useState } from "react";
import { Check, Globe } from "lucide-react";
import { Menu, MenuItem } from "@/components/ui/kit";
import { LANGS, setPrefs, usePrefs } from "@/lib/ui-store";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/cn";

/** Compact language picker: globe + current code, opens a menu of the four languages. */
export function LangSwitch({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const { lang } = usePrefs();
  const t = useT();
  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("nav.language")}
        className="inline-flex h-9 items-center gap-1.5 rounded-full px-2.5 text-[13px] font-medium text-ink-300 transition-colors hover:bg-ink-100/[0.06] hover:text-ink-100"
      >
        <Globe className="size-4" />
        {lang.toUpperCase()}
      </button>
      <Menu open={open} onClose={() => setOpen(false)} className="min-w-[180px]">
        {LANGS.map((l) => (
          <MenuItem key={l.id} onClick={() => (setPrefs({ lang: l.id }), setOpen(false))} hint={l.id === lang ? <Check className="size-3.5 text-nar" /> : l.native}>
            {l.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
