"use client";
import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import type { ProjectRuntime } from "@/lib/runtime/webcontainer";

/** Shows all runtime output and gives the user an interactive shell (jsh). */
export function TerminalPanel({ runtime, ready, visible }: { runtime: ProjectRuntime; ready: boolean; visible: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const term = useRef<Terminal | null>(null);
  const fit = useRef<FitAddon | null>(null);
  const shellStarted = useRef(false);

  useEffect(() => {
    const t = new Terminal({
      convertEol: true,
      fontFamily: "'JetBrains Mono Variable', ui-monospace, monospace",
      fontSize: 12.5,
      cursorBlink: true,
      theme: { background: "#f8f3ea", foreground: "#1c1f2e", cursor: "#a82a2d", cursorAccent: "#f8f3ea", selectionBackground: "#a82a2d33", black: "#1c1f2e", red: "#a82a2d", green: "#3e6b3f", yellow: "#9a6a10", blue: "#24386b", magenta: "#7a2a6b", cyan: "#2a6b6b", white: "#4d483e", brightBlack: "#6c6455" },
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
