import { LogoMark } from "@/components/Logo";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative isolate grid min-h-dvh place-items-center overflow-hidden px-5 text-center">
      <div aria-hidden className="aurora -z-10 opacity-60"><i /><i /><i /><i /></div>
      <div>
        <LogoMark className="mx-auto size-16" blink />
        <div className="mt-8 font-display text-[140px] leading-none tracking-[-0.04em] text-brand">404</div>
        <h1 className="mt-2 font-display text-3xl tracking-[-0.02em]">Bu səhifə hələ qurulmayıb</h1>
        <p className="mt-2 text-ink-400">Amma Novo onu bir dəqiqəyə qura bilər.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-2"><ButtonLink href="/" size="lg" variant="white">Ana səhifəyə qayıt</ButtonLink><ButtonLink href="/app" size="lg" variant="secondary">Layihələrim</ButtonLink></div>
      </div>
    </main>
  );
}
