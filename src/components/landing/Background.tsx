/** Animated aurora + grid + grain backdrop for the hero. */
export function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 grid-lines [mask-image:radial-gradient(ellipse_70%_55%_at_50%_0%,black,transparent_75%)]" />
      <div className="absolute left-1/2 top-[-12%] h-[620px] w-[1100px] -translate-x-1/2">
        <div className="absolute inset-0 animate-aurora rounded-full bg-[radial-gradient(closest-side,rgb(255_59_92/0.38),transparent)] blur-3xl" />
        <div className="absolute left-[8%] top-[20%] h-[70%] w-[50%] animate-aurora rounded-full bg-[radial-gradient(closest-side,rgb(193_60_207/0.28),transparent)] blur-3xl [animation-delay:-6s]" />
        <div className="absolute right-[6%] top-[10%] h-[65%] w-[45%] animate-aurora rounded-full bg-[radial-gradient(closest-side,rgb(255_154_92/0.28),transparent)] blur-3xl [animation-delay:-11s]" />
      </div>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-nar-500/50 to-transparent" />
      <div className="grain absolute inset-0" />
    </div>
  );
}
