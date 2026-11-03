"use client";
import { Briefcase, GraduationCap, Megaphone, Rocket, Store, User } from "lucide-react";
import { SpotlightCard, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "./SectionHeading";
import { PERSONAS } from "./data";

const ICONS = { store: Store, user: User, rocket: Rocket, briefcase: Briefcase, graduation: GraduationCap, megaphone: Megaphone } as const;

export function Personas() {
  return (
    <section className="relative mx-auto max-w-6xl px-5 py-28">
      <SectionHeading eyebrow="Kimlər üçün" title={<>Sayt lazım olan hər kəs üçün.</>} text="Developer olmağınıza ehtiyac yoxdur — amma developersinizsə, Novo sizi 10 dəfə sürətləndirir." />
      <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PERSONAS.map((p) => {
          const Icon = ICONS[p.icon as keyof typeof ICONS];
          return (
            <StaggerItem key={p.title}>
              <SpotlightCard className="group h-full rounded-3xl border border-white/8 bg-ink-900/60 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-white/15">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-nar-500/20 to-gold-500/10 text-nar-300 ring-1 ring-inset ring-nar-500/20 transition-transform duration-500 group-hover:scale-110">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="font-display text-[17px] font-medium tracking-tight">{p.title}</h3>
                </div>
                <p className="mt-4 text-[14.5px] leading-relaxed text-ink-300">{p.text}</p>
              </SpotlightCard>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}
