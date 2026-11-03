import { cn } from "@/lib/utils";

export function Badge({ className, ...props }) {
  return <span className={cn("inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium", className)} {...props} />;
}
