import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "white";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-300 ease-[var(--ease-out-expo)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45";

const variants: Record<Variant, string> = {
  primary:
    "bg-nar-gradient text-white shadow-[0_0_0_1px_rgb(255_255_255/0.12)_inset,0_8px_30px_-8px_rgb(255_59_92/0.7)] hover:shadow-[0_0_0_1px_rgb(255_255_255/0.2)_inset,0_12px_40px_-8px_rgb(255_59_92/0.9)] hover:-translate-y-0.5",
  secondary: "bg-ink-800 text-ink-100 ring-1 ring-inset ring-white/8 hover:bg-ink-750 hover:ring-white/15",
  outline: "text-ink-100 ring-1 ring-inset ring-white/12 hover:bg-white/5 hover:ring-white/25",
  ghost: "text-ink-300 hover:bg-white/5 hover:text-ink-100",
  white: "bg-ink-100 text-ink-950 hover:bg-white hover:-translate-y-0.5 shadow-[0_8px_30px_-10px_rgb(255_255_255/0.5)]",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3.5 text-[13px]",
  md: "h-10 px-5 text-sm",
  lg: "h-13 px-7 text-[15px]",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size };

export const Button = forwardRef<HTMLButtonElement, Props>(function Button({ variant, size, className, ...props }, ref) {
  return <button ref={ref} className={buttonClass(variant, size, className)} {...props} />;
});

export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
  ...rest
}: { href: string; variant?: Variant; size?: Size; className?: string; children: React.ReactNode } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}
