"use client";
import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import type { ProjectRuntime } from "@/lib/runtime/webcontainer";
import { useTheme } from "@/lib/theme";

const THEMES = {
  dark: { background: "#1c1814", foreground: "#f5eee4", cursor: "#ef7444", selectionBackground: "#ef744444", black: "#29231d", red: "#ff7b6b", green: "#6fbf8e", yellow: "#e2b06a", blue: "#8fb4ff", magenta: "#f49a6e", cyan: "#8fd0d0", white: "#e3d9cc", brightBlack: "#85796c" },
  light: { background: "#fffcf6", foreground: "#1d1814", cursor: "#e0602f", selectionBackground: "#e0602f33", black: "#1d1814", red: "#cf3b2b", green: "#2f8a55", yellow: "#946412", blue: "#4a63b3", magenta: "#c24a22", cyan: "#2a7f86", white: "#51473e", brightBlack: "#8d8173" },
};

/** Shows all runtime output and gives the user an interactive shell (jsh). */
export function TerminalPanel({ runtime, ready, visible }: { runtime: ProjectRuntime; ready: boolean; visible: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const term = useRef<Terminal | null>(null);
  const fit = useRef<FitAddon | null>(null);
  const shellStarted = useRef(false);
  const { theme } = useTheme();

  useEffect(() => {
    const t = new Terminal({
      convertEol: true,
      fontFamily: "'JetBrains Mono Variable', ui-monospace, monospace",
      fontSize: 12.5,
      cursorBlink: true,
      theme: THEMES[document.documentElement.dataset.theme === "dark" ? "dark" : "light"],
    });
    const f = new FitAddon();
    t.loadAddon(f);
    t.open(host.current!);
    term.current = t;
    fit.current = f;
    const off = runtime.onOutput((d) => t.write(d));
    const ro = new ResizeObserver(() => {
      try { f.fit(); } catch {}
    });
    ro.observe(host.current!);
    return () => {
      off();
      ro.disconnect();
      t.dispose();
    };
  }, [runtime]);

  useEffect(() => {
    if (term.current) term.current.options.theme = THEMES[theme];
  }, [theme]);

  useEffect(() => {
    if (visible) setTimeout(() => { try { fit.current?.fit(); } catch {} }, 30);
  }, [visible]);

  useEffect(() => {
    if (!ready || shellStarted.current || !term.current) return;
    shellStarted.current = true;
    const t = term.current;
    runtime.shell(t.cols, t.rows).then((proc) => {
      proc.output.pipeTo(new WritableStream({ write: (d) => t.write(d) })).catch(() => {});
      const input = proc.input.getWriter();
      t.onData((d) => input.write(d));
      t.onResize(({ cols, rows }) => proc.resize({ cols, rows }));
    }).catch(() => {});
  }, [ready, runtime]);

  return <div ref={host} className="h-full w-full bg-ink-1000" />;
}
