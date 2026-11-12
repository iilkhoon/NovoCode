import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "white";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[transform,background-color,color,box-shadow] duration-200 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45";

const variants: Record<Variant, string> = {
  /** dark ink pill — the default action */
  primary: "bg-pill text-wool hover:-translate-y-px hover:shadow-[var(--shadow-nav)]",
  secondary: "bg-ink-1000 text-ink-100 ring-1 ring-inset ring-ink-100/12 hover:ring-ink-100/25",
  outline: "text-ink-100 ring-1 ring-inset ring-ink-100/25 hover:bg-ink-100/[0.05]",
  ghost: "text-ink-300 hover:bg-ink-100/[0.06] hover:text-ink-100",
  /** the flame — one per screen, the most important action (name kept from v1) */
  white: "bg-nar text-white shadow-[var(--shadow-glow)] hover:-translate-y-px hover:shadow-[var(--shadow-glow-strong)]",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3.5 text-[13px]",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[15px]",
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
