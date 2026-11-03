"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import JSZip from "jszip";
import { Check, Code2, Globe, Loader2, PackageCheck, Rocket, X } from "lucide-react";
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
}: {
  open: boolean;
  onClose: () => void;
  projectName: string;
  runtime: ProjectRuntime;
  files: Record<string, string>;
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
      `# ${projectName}\n\nNovo Code ilə yaradılıb.\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n`
    );
    download(await zip.generateAsync({ type: "blob" }), `${slug}-kod.zip`);
    toast.success("Mənbə kodu yükləndi");
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] grid place-items-center bg-ink-1000/70 p-4 backdrop-blur-sm" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-ink-900 shadow-[var(--shadow-panel)]"
          >
            <div aria-hidden className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(60%_100%_at_50%_0%,rgb(255_59_92/0.25),transparent)]" />
            <button onClick={onClose} aria-label="Bağla" className="absolute right-4 top-4 z-10 grid size-8 place-items-center rounded-full text-ink-400 transition hover:bg-white/5 hover:text-ink-100">
              <X className="size-4" />
            </button>
            <div className="relative p-7">
              <div className="grid size-12 place-items-center rounded-2xl bg-nar-gradient shadow-[var(--shadow-glow)]">
                <Rocket className="size-5 text-white" />
              </div>
              <h2 className="mt-5 font-display text-2xl font-semibold tracking-tight">Saytı yayımla</h2>
              <p className="mt-1.5 text-[14px] text-ink-400">Saytınızı dünyaya göstərməyin üç yolu.</p>

              <div className="mt-6 space-y-3">
                {/* subdomain — coming soon */}
                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 opacity-80">
                  <div className="flex items-center gap-2">
                    <Globe className="size-4 text-nar-300" />
                    <span className="font-medium">Bir kliklə yayım</span>
                    <Badge tone="gold" className="ml-auto">Tezliklə</Badge>
                  </div>
                  <div className="mt-3 flex items-center overflow-hidden rounded-xl bg-ink-950 text-sm ring-1 ring-white/8">
                    <span className="px-3 py-2.5 text-ink-200">{slug}</span>
                    <span className="py-2.5 pr-3 text-ink-500">.novocode.az</span>
                  </div>
                  <p className="mt-2 text-xs text-ink-500">Avtomatik SSL sertifikatı ilə öz subdomeniniz.</p>
                </div>

                {/* static build */}
                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2">
                    <PackageCheck className="size-4 text-success" />
                    <span className="font-medium">Hazır sayt faylları</span>
                    <Badge tone="success" className="ml-auto">Tövsiyə</Badge>
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-400">
                    Optimallaşdırılmış statik saytı yükləyin və{" "}
                    <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="text-ink-200 underline decoration-white/20 underline-offset-2 hover:decoration-white/60">
                      Netlify Drop
                    </a>
                    -a sürüşdürün — saniyələr içində canlıdır. İstənilən hostinqdə də işləyir.
                  </p>
                  <Button onClick={buildStatic} disabled={building || runtime.status !== "ready"} className="mt-3 w-full">
                    {building ? <Loader2 className="size-4 animate-spin" /> : built ? <Check className="size-4" /> : <PackageCheck className="size-4" />}
                    {building ? "Build olunur…" : built ? "Yenidən yüklə" : "Build et və yüklə"}
                  </Button>
                </div>

                {/* source */}
                <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                  <Code2 className="size-4 text-info" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">Mənbə kodu</div>
                    <div className="text-[12px] text-ink-500">React + Tailwind layihəsi, developer üçün</div>
                  </div>
                  <Button variant="secondary" size="sm" onClick={sourceZip}>
                    ZIP yüklə
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
