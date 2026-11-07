import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "white";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[transform,background-color,color] duration-150 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45";

const variants: Record<Variant, string> = {
  primary: "bg-nar text-ink-1000 hover:bg-nar-400",
  secondary: "bg-ink-100/[0.06] text-ink-100 ring-1 ring-inset ring-ink-100/12 hover:bg-ink-100/10",
  outline: "text-ink-100 ring-1 ring-inset ring-ink-100/30 hover:bg-ink-100/8",
  ghost: "text-ink-300 hover:bg-ink-100/6 hover:text-ink-100",
  white: "bg-ink text-ink-1000 hover:bg-white",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-4 text-[12px] uppercase tracking-[0.08em]",
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
