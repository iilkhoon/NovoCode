"use client";
import { useEffect, useState } from "react";
import JSZip from "jszip";
import { Check, Code2, Copy, ExternalLink, Globe, Loader2, PackageCheck, QrCode, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, Modal } from "@/components/ui/kit";
import { toast } from "@/components/ui/toast";
import { openModal } from "@/lib/ui-store";
import type { ProjectRuntime } from "@/lib/runtime/webcontainer";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/cn";

export function slugify(s: string) {
  const map: Record<string, string> = { ə: "e", ı: "i", ö: "o", ü: "u", ş: "s", ç: "c", ğ: "g" };
  return (
    s
      .toLowerCase()
      .replace(/[əıöüşçğ]/g, (c) => map[c])
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 30) || "layihe"
  );
}

function download(blob: Blob, name: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

function toBase64(bytes: Uint8Array) {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

type Step = "idle" | "build" | "upload" | "done";

export function PublishModal({
  open,
  onClose,
  project,
  runtime,
  files,
  dev = true,
  onPublished,
}: {
  open: boolean;
  onClose: () => void;
  project: Project | null;
  runtime: ProjectRuntime;
  files: Record<string, string>;
  dev?: boolean;
  onPublished: (info: NonNullable<Project["publish"]>) => void;
}) {
  const name = project?.name ?? "layihe";
  const prev = project?.publish;
  const [slug, setSlug] = useState("");
  const [step, setStep] = useState<Step>("idle");
  const [error, setError] = useState<string | null>(null);
  const [zipping, setZipping] = useState(false);
  const host = typeof window === "undefined" ? "localhost" : window.location.hostname;
  const root = host === "localhost" || host === "127.0.0.1" ? "localhost" : host.replace(/^www\./, "");

  useEffect(() => {
    if (!open) return;
    setSlug(prev?.slug ?? `${slugify(name)}-${(project?.id ?? "xxxx").slice(0, 4)}`);
    setStep(prev ? "done" : "idle");
    setError(null);
  }, [open, prev, name, project?.id]);

  const ready = runtime.status === "ready";
  const busy = step === "build" || step === "upload";

  async function publish() {
    setError(null);
    try {
      setStep("build");
      const out = await runtime.buildStatic();
      setStep("upload");
      const payload: Record<string, string> = {};
      for (const [p, c] of Object.entries(out)) payload[p] = toBase64(c);
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug, name, token: prev?.slug === slug ? prev.token : undefined, files: payload }),
      });
      const d = await res.json();
      if (!res.ok) {
        if (d.suggestion) setSlug(d.suggestion);
        throw new Error(d.suggestion ? `${d.error}. Yeni ünvan təklif etdik: ${d.suggestion}` : d.error || "Yayımlamaq alınmadı");
      }
      onPublished({ slug: d.slug, url: d.url, token: d.token, at: d.updatedAt });
      setStep("done");
      toast.success(prev ? "Sayt yeniləndi" : "Sayt yayımlandı", d.url);
    } catch (e) {
      setStep(prev ? "done" : "idle");
      setError((e as Error).message);
    }
  }

  async function buildZip() {
    setZipping(true);
    try {
      const out = await runtime.buildStatic();
      const zip = new JSZip();
      for (const [p, c] of Object.entries(out)) zip.file(p, c);
      download(await zip.generateAsync({ type: "blob" }), `${slugify(name)}-sayt.zip`);
      toast.success("Hazır sayt yükləndi");
    } catch (e) {
      toast.error("Build alınmadı", (e as Error).message);
    } finally {
      setZipping(false);
    }
  }

  async function sourceZip() {
    const zip = new JSZip();
    for (const [p, c] of Object.entries(files)) zip.file(p, c);
    zip.file("README.md", `# ${name}\n\nNovoCode ilə yaradılıb.\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n`);
    download(await zip.generateAsync({ type: "blob" }), `${slugify(name)}-kod.zip`);
    toast.success("Mənbə kodu yükləndi");
  }

  const url = project?.publish?.url;

  return (
    <Modal open={open} onClose={onClose} title={step === "done" ? "Saytınız canlıdır" : "Saytı yayımla"} description={step === "done" ? "Linki paylaşın, dəyişikliklərdən sonra bir kliklə yeniləyin." : "Bir kliklə internetdə — öz ünvanınızla."} icon={<Rocket />}>
      <div className="flex flex-col gap-4">
        {step === "done" && url && (
          <div className="rounded-3xl border border-success/25 bg-success/[0.06] p-4">
            <div className="flex items-center gap-2 text-[13px] font-medium text-success">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              Canlı
            </div>
            <a href={url} target="_blank" rel="noreferrer" className="mt-1.5 block truncate text-[16px] font-medium text-ink-100 hover:text-nar">
              {url.replace(/^https?:\/\//, "")}
            </a>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText(url).then(() => toast.success("Link kopyalandı"))}>
                <Copy className="size-3.5" /> Kopyala
              </Button>
              <a href={url} target="_blank" rel="noreferrer" className="inline-flex h-8 items-center gap-1.5 rounded-full bg-ink-1000 px-3.5 text-[13px] font-medium text-ink-100 ring-1 ring-inset ring-ink-100/12 hover:ring-ink-100/25">
                <ExternalLink className="size-3.5" /> Aç
              </a>
              <Button size="sm" variant="secondary" onClick={() => (onClose(), openModal("share", { url, name }))}>
                <QrCode className="size-3.5" /> QR və paylaş
              </Button>
            </div>
          </div>
        )}

        <div className="rounded-3xl border border-ink-100/10 p-4">
          <label htmlFor="pub-slug" className="text-[13px] font-medium text-ink-200">
            Ünvan
          </label>
          <div className="mt-2 flex items-center overflow-hidden rounded-xl border border-ink-100/12 bg-ink-1000 focus-within:border-nar focus-within:ring-4 focus-within:ring-nar/15">
            <Globe className="ml-3 size-4 shrink-0 text-ink-500" />
            <input
              id="pub-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 40))}
              className="h-11 min-w-0 flex-1 bg-transparent px-2 text-[14.5px] text-ink-100 outline-none"
              aria-describedby="pub-hint"
            />
            <span className="shrink-0 pr-3 text-[14px] text-ink-500">.{root}</span>
          </div>
          <p id="pub-hint" className="mt-1.5 text-[12px] text-ink-500">
            Kiçik hərf, rəqəm və “-”. Öz domeninizi (məs. kofe.az) bağlamaq tezliklə.
          </p>
          {error && <Alert tone="danger" title="Alınmadı" className="mt-3">{error}</Alert>}
          {!ready && <p className="mt-3 text-[12.5px] text-warning">Önizləmə hazır olanda yayımlamaq olar.</p>}
          <Button variant="white" size="lg" className="mt-4 w-full" disabled={!ready || busy || slug.length < 3} onClick={publish}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Rocket className="size-4" />}
            {step === "build" ? "Build olunur…" : step === "upload" ? "Yüklənir…" : prev ? "Yenilə" : "Yayımla"}
          </Button>
          {busy && (
            <ol className="mt-3 flex items-center justify-center gap-4 text-[12px]">
              {(["build", "upload"] as const).map((s, i) => (
                <li key={s} className={cn("flex items-center gap-1.5", step === s ? "text-ink-100" : i === 0 ? "text-success" : "text-ink-500")}>
                  {step === s ? <Loader2 className="size-3 animate-spin" /> : i === 0 ? <Check className="size-3" /> : <span className="size-1.5 rounded-full bg-ink-500" />}
                  {s === "build" ? "Optimallaşdırılır" : "Serverə yüklənir"}
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" onClick={buildZip} disabled={!ready || zipping}>
            {zipping ? <Loader2 className="size-3.5 animate-spin" /> : <PackageCheck className="size-3.5" />} Hazır saytı ZIP yüklə
          </Button>
          {dev && (
            <Button variant="ghost" size="sm" onClick={sourceZip}>
              <Code2 className="size-3.5" /> Mənbə kodu (ZIP)
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
