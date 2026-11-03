"use client";
import { useMemo } from "react";
import { Knots } from "@/components/carpet/Knots";
import { borderBand } from "@/components/carpet/patterns";

/** Full-width carpet border band used between chapters. */
export function Border({ weave = true }: { weave?: boolean }) {
  const band = useMemo(() => borderBand(160), []);
  return (
    <div className="overflow-hidden">
      <Knots pattern={band} weave={weave} speed={60} gap={0.06} className="block h-auto w-[max(100%,1100px)]" />
    </div>
  );
}
