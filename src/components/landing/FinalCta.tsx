"use client";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { LogoMark } from "@/components/Logo";
import { ButtonLink } from "@/components/ui/button";
import { Magnetic, Reveal } from "@/components/ui/motion";

export function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <Reveal>
        <div className="relative overflow-hidden rounded-[36px] border border-white/10 px-6 py-20 text-center sm:px-16 sm:py-28">
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(80%_80%_at_50%_120%,rgb(255_59_92/0.55),rgb(193_60_207/0.18)_45%,transparent_75%)]" />
          <div aria-hidden className="absolute inset-0 -z-10 dot-grid [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          <motion.div aria-hidden animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="absolute -right-24 -top-24 -z-10 size-72 rounded-full border border-dashed border-white/10" />
          <motion.div initial={{ scale: 0.6, opacity: 0, rotate: -20 }} whileInView={{ scale: 1, opacity: 1, rotate: 0 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 120, damping: 12 }} className="mx-auto mb-8 w-fit animate-float">
            <LogoMark className="size-20 drop-shadow-[0_20px_40px_rgb(255_59_92/0.5)]" />
          </motion.div>
          <h2 className="mx-auto max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-6xl">
            Növbəti saytınız bir cümlə uzaqlığındadır.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-balance text-[17px] text-ink-200/80">Pulsuz başlayın. Kart tələb olunmur. İlk saytınız qəhvəniz soyumadan hazır olacaq.</p>
          <div className="mt-10 flex justify-center">
            <Magnetic>
              <ButtonLink href="#başla" size="lg" variant="white">
                İndi qurmağa başla <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
              </ButtonLink>
            </Magnetic>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
