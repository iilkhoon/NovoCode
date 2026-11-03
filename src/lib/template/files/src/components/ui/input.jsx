import { cn } from "@/lib/utils";

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-border bg-card px-4 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-xl border border-border bg-card px-4 py-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15",
        className
      )}
      {...props}
    />
  );
}
