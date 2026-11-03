"use client";
import { useEffect, useRef, useState } from "react";
import { ExternalLink, Loader2, Monitor, RotateCw, Smartphone, Tablet } from "lucide-react";
import type { RuntimeStatus } from "@/lib/runtime/webcontainer";

const STATUS_TEXT: Record<RuntimeStatus, string> = {
  idle: "Hazırlanır…",
  booting: "Mühit işə düşür…",
  installing: "Paketlər yüklənir…",
  starting: "Sayt işə salınır…",
  ready: "",
  error: "Xəta baş verdi — Terminal bölməsinə baxın",
};

const DEVICES = { desktop: "100%", tablet: "820px", mobile: "390px" } as const;

export function PreviewPanel({
  url,
  status,
  onPreviewError,
}: {
  url: string | null;
  status: RuntimeStatus;
  onPreviewError: (msg: string) => void;
}) {
  const [device, setDevice] = useState<keyof typeof DEVICES>("desktop");
  const [path, setPath] = useState("/");
  const [nonce, setNonce] = useState(0);
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.data?.source !== "novo-preview") return;
      if (e.data.type === "error") onPreviewError([e.data.message, e.data.stack].filter(Boolean).join("\n"));
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [onPreviewError]);

  const src = url ? url.replace(/\/$/, "") + (path.startsWith("/") ? path : "/" + path) : undefined;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-2 border-b border-ink-800 px-3 py-2">
        <button aria-label="Yenilə" onClick={() => setNonce((n) => n + 1)} className="rounded-md p-1.5 text-ink-300 hover:bg-ink-800 hover:text-ink-100">
          <RotateCw className="size-4" />
        </button>
        <form
          className="flex min-w-0 flex-1 items-center rounded-lg bg-ink-850 px-3 py-1.5 text-xs text-ink-300 ring-1 ring-ink-700"
          onSubmit={(e) => {
            e.preventDefault();
            setNonce((n) => n + 1);
          }}
        >
          <span className="mr-1 text-ink-400">sayt.novocode.az</span>
          <input value={path} onChange={(e) => setPath(e.target.value)} className="min-w-0 flex-1 bg-transparent outline-none" aria-label="Səhifə yolu" />
        </form>
        <div className="hidden items-center rounded-lg bg-ink-850 p-0.5 ring-1 ring-ink-700 sm:flex">
          {([
            ["desktop", Monitor],
            ["tablet", Tablet],
            ["mobile", Smartphone],
          ] as const).map(([d, Icon]) => (
            <button
              key={d}
              aria-label={d}
              onClick={() => setDevice(d)}
              className={`rounded-md p-1.5 ${device === d ? "bg-ink-700 text-ink-100" : "text-ink-400 hover:text-ink-100"}`}
            >
              <Icon className="size-3.5" />
            </button>
          ))}
        </div>
        {url && (
          <a href={src} target="_blank" rel="noreferrer" aria-label="Yeni tabda aç" className="rounded-md p-1.5 text-ink-300 hover:bg-ink-800 hover:text-ink-100">
            <ExternalLink className="size-4" />
          </a>
        )}
      </div>
      <div className="relative min-h-0 flex-1 overflow-auto bg-ink-950 p-0 sm:p-3">
        {url ? (
          <iframe
            key={nonce}
            ref={frame}
            src={src}
            title="Önizləmə"
            className="mx-auto h-full rounded-none bg-white transition-[width] duration-300 sm:rounded-xl sm:ring-1 sm:ring-ink-700"
            style={{ width: DEVICES[device], maxWidth: "100%" }}
            allow="cross-origin-isolated; clipboard-write"
          />
        ) : null}
        {status !== "ready" && (
          <div className="absolute inset-0 grid place-items-center bg-ink-950/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3 text-sm text-ink-300">
              {status !== "error" && <Loader2 className="size-6 animate-spin text-nar-400" />}
              <span className={status === "error" ? "text-nar-400" : ""}>{STATUS_TEXT[status]}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
