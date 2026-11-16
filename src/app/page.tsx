"use client";
import { useEffect, useState } from "react";
import { listProjects } from "@/lib/store/projects";
import type { Project } from "@/lib/types";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Projects } from "@/components/landing/Projects";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { StudioShowcase } from "@/components/landing/StudioShowcase";
import { Capabilities } from "@/components/landing/Capabilities";
import { Templates } from "@/components/landing/Templates";
import { Compare } from "@/components/landing/Compare";
import { Pricing } from "@/components/landing/Pricing";
import { Faq } from "@/components/landing/Faq";
import { Closing } from "@/components/landing/Closing";
import { Footer } from "@/components/landing/Footer";
import { useT } from "@/lib/i18n";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const t = useT();
  useEffect(() => {
    listProjects().then(setProjects).catch(() => {});
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">{t("nav.skip")}</a>
      <Navbar hasProjects={projects.length > 0} />
      <main id="main" tabIndex={-1} className="relative outline-none">
        <Hero />
        <Projects projects={projects} onChange={setProjects} />
        <Templates />
        <HowItWorks />
        <StudioShowcase />
        <Capabilities />
        <Compare />
        <Pricing />
        <Faq />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
