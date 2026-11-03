import { LogoMark } from "@/components/Logo";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-5 text-center">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(50%_40%_at_50%_40%,rgb(255_59_92/0.2),transparent)]" />
      <div>
        <LogoMark className="mx-auto size-16 animate-float" />
        <div className="mt-8 font-display text-[120px] font-bold leading-none tracking-[-0.06em] text-nar-gradient">404</div>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight">Bu səhifə hələ qurulmayıb</h1>
        <p className="mt-2 text-ink-400">Amma Novo onu bir dəqiqəyə qura bilər 😉</p>
        <ButtonLink href="/" className="mt-8" size="lg">Ana səhifəyə qayıt</ButtonLink>
      </div>
    </main>
  );
}
