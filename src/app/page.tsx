"use client";
import { useEffect, useState } from "react";
import { Coffee, ShoppingBag, Stethoscope, Briefcase, Camera, LayoutDashboard, Trash2, Sparkles, Wrench, Rocket, ScanEye } from "lucide-react";
import { Logo } from "@/components/Logo";
import { PromptBox } from "@/components/PromptBox";
import { createProject, listProjects, deleteProject } from "@/lib/store/projects";
import type { Project } from "@/lib/types";

const EXAMPLES = [
  { icon: Coffee, label: "Kofe şop", prompt: "Bakıda 'Dəmlə' adlı kofe şopu üçün sayt: menyu kateqoriyaları, qiymətlər manatla, masa rezervasiyası və əlaqə bölməsi. İsti, premium dizayn." },
  { icon: ShoppingBag, label: "Onlayn mağaza", prompt: "Əl işi keramika satan 'Gil' mağazası: kataloq, filtr, səbət, sifariş forması və admin panel." },
  { icon: Stethoscope, label: "Klinika randevu", prompt: "Stomatologiya klinikası üçün sayt: xidmətlər, həkimlər, onlayn randevu (tarix və saat seçimi) və rəylər." },
  { icon: Briefcase, label: "Startap landing", prompt: "Kiçik bizneslər üçün mühasibat tətbiqi 'Hesabla' üçün landing: hero, imkanlar, qiymət planları, FAQ və müraciət forması." },
  { icon: Camera, label: "Fotoqraf portfolio", prompt: "Toy fotoqrafı Aysel Məmmədova üçün minimal, zərif portfolio: qalereya, paketlər, rəylər, əlaqə." },
  { icon: LayoutDashboard, label: "CRM panel", prompt: "Kiçik satış komandası üçün CRM: giriş/qeydiyyat, müştərilər cədvəli, sövdələşmə mərhələləri və statistika paneli." },
];

const FEATURES = [
  { icon: Sparkles, title: "Azərbaycan dilində danış", text: "Texniki bilik lazım deyil — nə istədiyinizi adi dildə yazın." },
  { icon: Wrench, title: "Xətanı özü düzəldir", text: "AI terminalı oxuyur, xəta görəndə insan müdaxiləsi olmadan təmir edir." },
  { icon: ScanEye, title: "Şəkildən sayt", text: "Bəyəndiyiniz saytın ekran görüntüsünü və ya əl eskizini atın." },
  { icon: Rocket, title: "Canlı önizləmə", text: "Sayt brauzerinizdə real vaxtda qurulur və işləyir." },
];

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    listProjects().then(setProjects).catch(() => {});
  }, []);

  async function start(text: string, images: string[] = []) {
    setCreating(true);
    const p = await createProject(text, images);
    // tam yükləmə: studiya cross-origin isolation başlıqlarını tələb edir
    window.location.assign(`/studio/${p.id}`);
  }

  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 nar-glow" />
      <div className="pointer-events-none absolute inset-0 grid-bg" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Logo />
        <nav className="flex items-center gap-1 text-sm text-ink-300">
          <a href="#layiheler" className="rounded-lg px-3 py-2 hover:text-ink-100">Layihələrim</a>
          <a href="#necə" className="hidden rounded-lg px-3 py-2 hover:text-ink-100 sm:block">Necə işləyir</a>
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-5 pt-14 sm:pt-24">
        <div className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-ink-700 bg-ink-900/70 px-3 py-1 text-xs text-ink-300 backdrop-blur">
            <span className="size-1.5 rounded-full bg-nar-500 shadow-[0_0_10px_var(--color-nar-500)]" />
            Azərbaycanın ilk AI sayt qurucusu
          </span>
        </div>
        <h1 className="text-balance text-center text-4xl font-semibold tracking-tight sm:text-6xl">
          Danış, <span className="bg-gradient-to-br from-nar-400 to-saffron bg-clip-text text-transparent">saytın qurulsun.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-balance text-center text-ink-300 sm:text-lg">
          Fikrinizi Azərbaycan dilində yazın — Novo Code bir neçə dəqiqəyə dizaynı, funksionallığı və məlumat bazası olan tam işlək sayt qursun.
        </p>

        <div className="mt-10">
          <PromptBox size="lg" autoFocus busy={creating} onSubmit={start} />
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => start(ex.prompt)}
              disabled={creating}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink-700 bg-ink-900/60 px-3 py-1.5 text-xs text-ink-300 transition hover:border-ink-600 hover:text-ink-100"
            >
              <ex.icon className="size-3.5" />
              {ex.label}
            </button>
          ))}
        </div>
      </main>

      <section id="layiheler" className="relative z-10 mx-auto mt-24 max-w-6xl px-5">
        {projects.length > 0 && (
          <>
            <h2 className="mb-4 text-sm font-medium text-ink-300">Layihələrim</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <div key={p.id} className="group relative rounded-2xl border border-ink-700 bg-ink-900/70 p-4 transition hover:border-ink-600">
                  <button className="block w-full text-left" onClick={() => window.location.assign(`/studio/${p.id}`)}>
                    <div className="mb-3 aspect-[16/9] rounded-xl bg-gradient-to-br from-ink-800 to-ink-850 ring-1 ring-ink-700 grid place-items-center text-ink-600">
                      <Sparkles className="size-6" />
                    </div>
                    <div className="truncate font-medium">{p.name}</div>
                    <div className="mt-0.5 text-xs text-ink-400">
                      {new Date(p.updatedAt).toLocaleString("az-AZ", { dateStyle: "medium", timeStyle: "short" })} · {p.messages.filter((m) => m.role === "user" && !m.auto).length} mesaj
                    </div>
                  </button>
                  <button
                    aria-label="Layihəni sil"
                    onClick={async () => {
                      if (!confirm(`"${p.name}" silinsin?`)) return;
                      await deleteProject(p.id);
                      setProjects((x) => x.filter((y) => y.id !== p.id));
                    }}
                    className="absolute right-3 top-3 hidden rounded-lg bg-ink-850/90 p-1.5 text-ink-400 hover:text-nar-400 group-hover:block"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <section id="necə" className="relative z-10 mx-auto mt-20 max-w-6xl px-5 pb-24">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-ink-700/70 bg-ink-900/50 p-5">
              <f.icon className="mb-3 size-5 text-nar-400" />
              <div className="font-medium">{f.title}</div>
              <p className="mt-1 text-sm text-ink-400">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-ink-800 py-6 text-center text-xs text-ink-400">
        © {new Date().getFullYear()} Novo Code · Bakı
      </footer>
    </div>
  );
}
