"use client";
import { useEffect, useState } from "react";
import { listProjects } from "@/lib/store/projects";
import type { Project } from "@/lib/types";
import { Stage } from "@/components/landing/Stage";
import { Overlay } from "@/components/landing/Overlay";
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

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => {
    listProjects().then(setProjects).catch(() => {});
    document.documentElement.classList.add("landing");
    return () => document.documentElement.classList.remove("landing");
  }, []);

  return (
    <>
      <Stage />
      <Overlay />
      <Navbar hasProjects={projects.length > 0} />
      <main className="relative z-10">
        <Hero />
        <Projects projects={projects} onChange={setProjects} />
        <HowItWorks />
        <StudioShowcase />
        <Capabilities />
        <Templates />
        <Compare />
        <Pricing />
        <Faq />
        <Closing />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}
