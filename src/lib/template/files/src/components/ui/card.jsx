import { cn } from "@/lib/utils";

export function Card({ className, ...props }) {
  return <div className={cn("rounded-[var(--radius-lg)] border border-border bg-card p-6 shadow-sm", className)} {...props} />;
}
