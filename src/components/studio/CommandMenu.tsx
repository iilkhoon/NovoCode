"use client";
import { useMemo, useRef } from "react";
import { CommandPalette, CommandPaletteFooter, CommandPaletteInput } from "@astryxdesign/core/CommandPalette";
import { createStaticSource } from "@astryxdesign/core/Typeahead";
import type { SearchableItem } from "@astryxdesign/core/Typeahead";

export type Command = {
  id: string;
  label: string;
  group: string;
  hint?: string;
  keywords?: string[];
  run: () => void;
};

type Item = SearchableItem<{ group: string; hint?: string; keywords?: string[] }>;

/** Ctrl/⌘ + K — studiyanın bütün əmrləri bir yerdə (Astryx CommandPalette). */
export function CommandMenu({ open, onOpenChange, commands }: { open: boolean; onOpenChange: (v: boolean) => void; commands: Command[] }) {
  // Studio re-renders on every streamed token; keep the search source stable
  // unless the command list itself changes, and read actions from a ref.
  const latest = useRef(commands);
  latest.current = commands;
  const key = commands.map((c) => `${c.id}\u0000${c.label}`).join("\u0001");
  const source = useMemo(
    () =>
      createStaticSource<Item>(
        commands.map((c) => ({ id: c.id, label: c.label, auxiliaryData: { group: c.group, hint: c.hint, keywords: c.keywords } })),
        { keywords: (i) => i.auxiliaryData?.keywords ?? [] }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key]
  );

  // Astryx leaves nothing highlighted after typing, so Enter would do nothing.
  // In a launcher Enter should run the top match: pick the first item then.
  const onKeyDownCapture = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter" || e.nativeEvent.isComposing) return;
    const root = e.currentTarget;
    if (root.querySelector(".astryx-command-palette-item[data-highlighted]")) return;
    const first = root.querySelector<HTMLElement>(".astryx-command-palette-item:not([data-disabled])");
    if (!first) return;
    e.preventDefault();
    e.stopPropagation();
    first.click();
  };

  return (
    <div onKeyDownCapture={onKeyDownCapture} className="contents">
    <CommandPalette<Item>
      isOpen={open}
      onOpenChange={onOpenChange}
      searchSource={source}
      label="Əmrlər"
      width={560}
      input={<CommandPaletteInput placeholder="Əmr axtarın…" />}
      footer={
        <CommandPaletteFooter>
          <span className="flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-400">
            <span>↑↓ seç</span>
            <span>↵ icra et</span>
            <span>Esc bağla</span>
          </span>
        </CommandPaletteFooter>
      }
      emptySearchText="Belə əmr tapılmadı"
      emptyBootstrapText="Yazmağa başlayın"
      renderItem={(item) => (
        <span className="flex w-full items-center justify-between gap-4">
          <span>{item.label}</span>
          {item.auxiliaryData?.hint && <span className="font-mono text-[11px] text-ink-400">{item.auxiliaryData.hint}</span>}
        </span>
      )}
      onValueChange={(id) => {
        const cmd = latest.current.find((c) => c.id === id);
        onOpenChange(false);
        // let the dialog close (and return focus) before running the action
        if (cmd) requestAnimationFrame(() => cmd.run());
      }}
    />
    </div>
  );
}
