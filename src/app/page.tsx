"use client";
import { useEffect, useState } from "react";
import { listProjects } from "@/lib/store/projects";
import type { Project } from "@/lib/types";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Projects } from "@/components/landing/Projects";
import { IndustryMarquee, Stats } from "@/components/landing/Marquee";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Templates } from "@/components/landing/Templates";
import { Compare } from "@/components/landing/Compare";
import { Personas } from "@/components/landing/Personas";
import { Pricing } from "@/components/landing/Pricing";
import { Faq } from "@/components/landing/Faq";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => {
    listProjects().then(setProjects).catch(() => {});
  }, []);

  return (
    <div className="relative overflow-x-clip">
      <Navbar hasProjects={projects.length > 0} />
      <main>
        <Hero />
        <Projects projects={projects} onChange={setProjects} />
        <IndustryMarquee />
        <Stats />
        <Features />
        <HowItWorks />
        <Templates />
        <Compare />
        <Personas />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
