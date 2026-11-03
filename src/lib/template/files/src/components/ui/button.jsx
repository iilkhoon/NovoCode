import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-sm",
  secondary: "bg-muted text-foreground hover:bg-border",
  outline: "border border-border bg-transparent hover:bg-muted",
  ghost: "hover:bg-muted",
};
const sizes = { sm: "h-9 px-3 text-sm", md: "h-11 px-5", lg: "h-13 px-7 text-lg" };

export function Button({ variant = "primary", size = "md", className, as: Tag = "button", ...props }) {
  return (
    <Tag
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
