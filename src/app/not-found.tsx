import { LogoMark } from "@/components/Logo";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-5 text-center">
      <div>
        <LogoMark className="mx-auto size-16" />
        <div className="mt-8 font-display text-[140px] font-light leading-none tracking-[-0.04em] text-nar [font-variation-settings:'opsz'_144]">404</div>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight">Bu səhifə hələ qurulmayıb</h1>
        <p className="mt-2 text-ink-400">Amma Novo onu bir dəqiqəyə qura bilər 😉</p>
        <ButtonLink href="/" className="mt-8" size="lg">Ana səhifəyə qayıt</ButtonLink>
      </div>
    </main>
  );
}
