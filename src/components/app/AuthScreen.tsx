"use client";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Mail, MailCheck, Check } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Field, Input, Spinner } from "@/components/ui/kit";
import { toast } from "@/components/ui/toast";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Github, GoogleIcon } from "./Modals";

export function AuthScreen() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("E-poçt ünvanı düzgün deyil");
    setError("");
    setState("sending");
    setTimeout(() => setState("sent"), 900);
  };
  const oauth = (p: string) => toast.info(`${p} ilə giriş tezliklə`, "Hələlik qonaq kimi davam edə bilərsiniz — layihələr bu brauzerdə saxlanılır.");

  return (
    <div className="grid min-h-dvh bg-wool lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* form side */}
      <div className="flex flex-col px-5 py-5 sm:px-10">
        <header className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </header>
        <main className="mx-auto flex w-full max-w-[380px] flex-1 flex-col justify-center py-10">
          <AnimatePresence mode="wait">
            {state === "sent" ? (
              <motion.div key="sent" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-success/12 text-success">
                  <MailCheck className="size-6" />
                </span>
                <h1 className="mt-6 font-display text-[30px] font-[500] tracking-[-0.02em] text-ink-100">Poçtunuzu yoxlayın</h1>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink-400">
                  <span className="font-medium text-ink-100">{email}</span> ünvanına giriş linki göndərdik. Link 15 dəqiqə etibarlıdır.
                </p>
                <Button variant="ghost" className="mt-6" onClick={() => setState("idle")}>
                  <ArrowLeft className="size-4" /> Başqa ünvan
                </Button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h1 className="font-display text-[34px] font-[500] leading-tight tracking-[-0.025em] text-ink-100">{mode === "login" ? "Yenidən xoş gəldiniz" : "Pulsuz başlayın"}</h1>
                <p className="mt-2 text-[14.5px] text-ink-400">{mode === "login" ? "Layihələrinizə qayıtmaq üçün daxil olun." : "Kart tələb olunmur. İlk saytınız bir neçə dəqiqəyə hazır."}</p>

                <div className="mt-8 flex flex-col gap-2.5">
                  <Button variant="secondary" size="lg" className="w-full" onClick={() => oauth("Google")}>
                    <GoogleIcon /> Google ilə davam et
                  </Button>
                  <Button variant="secondary" size="lg" className="w-full" onClick={() => oauth("GitHub")}>
                    <Github className="size-4" /> GitHub ilə davam et
                  </Button>
                </div>

                <div className="my-6 flex items-center gap-3 text-[12px] text-ink-500">
                  <span className="h-px flex-1 bg-ink-100/10" />
                  və ya e-poçtla
                  <span className="h-px flex-1 bg-ink-100/10" />
                </div>

                <form onSubmit={send} noValidate className="flex flex-col gap-3">
                  <Field label="E-poçt" error={error}>
                    {(id, d) => <Input id={id} aria-describedby={d} aria-invalid={!!error} type="email" autoComplete="email" placeholder="ad@nümunə.az" icon={<Mail />} value={email} onChange={(e) => setEmail(e.target.value)} />}
                  </Field>
                  <Button type="submit" variant="white" size="lg" className="w-full" disabled={state === "sending"}>
                    {state === "sending" ? <Spinner /> : null}
                    {state === "sending" ? "Göndərilir…" : "Giriş linki göndər"}
                  </Button>
                </form>

                <p className="mt-6 text-center text-[13.5px] text-ink-400">
                  {mode === "login" ? "Hesabınız yoxdur?" : "Artıq hesabınız var?"}{" "}
                  <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="font-medium text-ink-100 underline-offset-4 hover:underline">
                    {mode === "login" ? "Qeydiyyatdan keçin" : "Daxil olun"}
                  </button>
                </p>
                <p className="mt-3 text-center text-[13px]">
                  <Link href="/app" className="text-ink-500 underline-offset-4 hover:text-ink-100 hover:underline">
                    Qonaq kimi davam et
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        <footer className="text-center text-[12px] leading-relaxed text-ink-500">
          Davam etməklə <a href="#" className="underline underline-offset-2">İstifadə şərtləri</a> və <a href="#" className="underline underline-offset-2">Məxfilik siyasəti</a> ilə razılaşırsınız.
        </footer>
      </div>

      {/* brand side */}
      <aside className="relative isolate m-3 hidden overflow-hidden rounded-[32px] bg-[#1d1814] lg:flex lg:flex-col lg:justify-end">
        <div aria-hidden className="aurora aurora-high -z-10 [&>i]:!opacity-90">
          <i />
          <i />
          <i />
          <i />
        </div>
        <div aria-hidden className="absolute inset-0 -z-10 dot-grid opacity-30" />
        <div className="p-12">
          <div className="mb-10 w-[min(440px,100%)] rounded-2xl border border-white/15 bg-white/10 p-4 text-white backdrop-blur-xl">
            <p className="label-mono text-white/60">Novo yazır</p>
            <p className="mt-2 text-[14.5px] leading-relaxed text-white/90">“Kofe evi” üçün sayt qurdum: menyu, onlayn sifariş və xəritə ilə əlaqə bölməsi. Sizcə rəngləri bir az isti edim?</p>
            <div className="mt-3 flex gap-2">
              <span className="rounded-full bg-white/15 px-3 py-1 text-[12px]">Bəli, isti et</span>
              <span className="rounded-full bg-white/15 px-3 py-1 text-[12px]">Yayımla</span>
            </div>
          </div>
          <p className="max-w-[520px] font-display text-[40px] font-[400] leading-[1.1] tracking-[-0.025em] text-white">
            Fikrinizi yazın. <span className="italic text-[#ffc08a]">Saytınız dəqiqələr içində hazırdır.</span>
          </p>
          <ul className="mt-6 flex flex-wrap gap-2 text-[13px] text-white/85">
            {["Azərbaycan, Türk, Rus, İngilis dilləri", "Canlı önizləmə", "Bir kliklə yayım"].map((t) => (
              <li key={t} className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1">
                <Check className="size-3.5 text-[#ffc08a]" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
