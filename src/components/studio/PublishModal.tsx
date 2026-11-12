"use client";
import { useState } from "react";
import { Dialog, DialogHeader } from "@astryxdesign/core/Dialog";
import JSZip from "jszip";
import { Check, Code2, Globe, Loader2, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import type { ProjectRuntime } from "@/lib/runtime/webcontainer";

function slugify(s: string) {
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

export function PublishModal({
  open,
  onClose,
  projectName,
  runtime,
  files,
  dev = true,
}: {
  open: boolean;
  onClose: () => void;
  projectName: string;
  runtime: ProjectRuntime;
  files: Record<string, string>;
  dev?: boolean;
}) {
  const slug = slugify(projectName);
  const [building, setBuilding] = useState(false);
  const [built, setBuilt] = useState(false);

  async function buildStatic() {
    setBuilding(true);
    try {
      const out = await runtime.buildStatic();
      const zip = new JSZip();
      for (const [p, c] of Object.entries(out)) zip.file(p, c);
      download(await zip.generateAsync({ type: "blob" }), `${slug}-sayt.zip`);
      setBuilt(true);
      toast.success("Hazır sayt yükləndi");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBuilding(false);
    }
  }

  async function sourceZip() {
    const zip = new JSZip();
    for (const [p, c] of Object.entries(files)) zip.file(p, c);
    zip.file(
      "README.md",
      `# ${projectName}\n\nNovoCode ilə yaradılıb.\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n`
    );
    download(await zip.generateAsync({ type: "blob" }), `${slug}-kod.zip`);
    toast.success("Mənbə kodu yükləndi");
  }

  return (
    <Dialog isOpen={open} onOpenChange={(v) => !v && onClose()} width={520}>
      <DialogHeader title="Saytı yayımla" subtitle={dev ? "Saytınızı dünyaya göstərməyin üç yolu." : "Saytınızı dünyaya göstərməyin iki yolu."} onOpenChange={(v) => !v && onClose()} />
      <div className="space-y-3 pt-4">
        {/* subdomain — coming soon */}
        <div className="rounded-2xl border border-ink-100/[0.08] bg-ink-950 p-4 opacity-80">
          <div className="flex items-center gap-2">
            <Globe className="size-4 text-nar-600" />
            <span className="font-medium">Bir kliklə yayım</span>
            <Badge tone="gold" className="ml-auto">Tezliklə</Badge>
          </div>
          <div className="mt-3 flex items-center overflow-hidden rounded-xl bg-ink-1000 text-sm ring-1 ring-ink-100/[0.08]">
            <span className="px-3 py-2.5 text-ink-200">{slug}</span>
            <span className="py-2.5 pr-3 text-ink-500">.novocode.az</span>
          </div>
          <p className="mt-2 text-xs text-ink-500">Avtomatik SSL sertifikatı ilə öz subdomeniniz.</p>
        </div>

        {/* static build */}
        <div className="rounded-2xl border border-ink-100/[0.08] bg-ink-950 p-4">
          <div className="flex items-center gap-2">
            <PackageCheck className="size-4 text-success" />
            <span className="font-medium">Hazır sayt faylları</span>
            <Badge tone="success" className="ml-auto">Tövsiyə</Badge>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-400">
            Optimallaşdırılmış statik saytı yükləyin və{" "}
            <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="text-ink-200 underline decoration-ink-100/20 underline-offset-2 hover:decoration-ink-100/60">
              Netlify Drop
            </a>
            -a sürüşdürün — saniyələr içində canlıdır. İstənilən hostinqdə də işləyir.
          </p>
          <Button variant="white" onClick={buildStatic} disabled={building || runtime.status !== "ready"} className="mt-3 w-full">
            {building ? <Loader2 className="size-4 animate-spin" /> : built ? <Check className="size-4" /> : <PackageCheck className="size-4" />}
            {building ? "Build olunur…" : built ? "Yenidən yüklə" : "Build et və yüklə"}
          </Button>
        </div>

        {/* source */}
        {dev && <div className="flex items-center gap-3 rounded-2xl border border-ink-100/[0.08] bg-ink-950 p-4">
          <Code2 className="size-4 text-info" />
          <div className="min-w-0 flex-1">
            <div className="font-medium">Mənbə kodu</div>
            <div className="text-[12px] text-ink-500">React + Tailwind layihəsi, developer üçün</div>
          </div>
          <Button variant="secondary" size="sm" onClick={sourceZip}>
            ZIP yüklə
          </Button>
        </div>}
      </div>
    </Dialog>
  );
}
