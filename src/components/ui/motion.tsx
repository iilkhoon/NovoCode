"use client";
import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/cn";

export const EASE = [0.16, 1, 0.3, 1] as const;

/** Quiet fade + small lift into view, once. */
export function Reveal({ delay = 0, y = 14, className, children, ...rest }: { delay?: number; y?: number } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Plain container kept for API compatibility (no cursor effects). */
export function SpotlightCard({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(className)} {...rest}>
      {children}
    </div>
  );
}
