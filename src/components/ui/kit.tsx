"use client";
/**
 * NovoCode UI kit — every form control, overlay and feedback primitive in one place.
 * All colours come from tokens (globals.css), so light/dark work automatically.
 */
import { AnimatePresence, motion } from "motion/react";
import { forwardRef, useEffect, useId, useRef } from "react";
import { AlertTriangle, CheckCircle2, Info, Loader2, X, XCircle } from "lucide-react";
import { cn } from "@/lib/cn";

/* ---------------- text inputs ---------------- */

const fieldBase =
  "w-full rounded-xl border border-ink-100/12 bg-ink-1000 px-3.5 text-[14.5px] text-ink-100 placeholder:text-ink-500 transition-[border-color,box-shadow] duration-150 hover:border-ink-100/25 focus:border-nar focus:outline-none focus:ring-4 focus:ring-nar/15 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-danger aria-[invalid=true]:ring-danger/15";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ReactNode }>(function Input(
  { className, icon, ...p },
  ref
) {
  if (!icon) return <input ref={ref} className={cn(fieldBase, "h-11", className)} {...p} />;
  return (
    <span className={cn("relative block", className)}>
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 [&>svg]:size-4">{icon}</span>
      <input ref={ref} className={cn(fieldBase, "h-11 pl-10")} {...p} />
    </span>
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea({ className, ...p }, ref) {
  return <textarea ref={ref} className={cn(fieldBase, "min-h-24 resize-y py-3 leading-relaxed", className)} {...p} />;
});

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(function Select({ className, children, ...p }, ref) {
  return (
    <span className={cn("relative block", className)}>
      <select ref={ref} className={cn(fieldBase, "h-11 cursor-pointer appearance-none pr-10")} {...p}>
        {children}
      </select>
      <svg viewBox="0 0 16 16" className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-500" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="m4 6 4 4 4-4" />
      </svg>
    </span>
  );
});

/** Label + control + hint/error, wired for screen readers. */
export function Field({ label, hint, error, children, className }: { label: string; hint?: string; error?: string; children: (id: string, describedBy?: string) => React.ReactNode; className?: string }) {
  const id = useId();
  const hintId = hint || error ? `${id}-d` : undefined;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-[13px] font-medium text-ink-200">
        {label}
      </label>
      {children(id, hintId)}
      {(error || hint) && (
        <p id={hintId} className={cn("text-[12.5px]", error ? "text-danger" : "text-ink-500")}>
          {error || hint}
        </p>
      )}
    </div>
  );
}

/* ---------------- choice controls ---------------- */

type ChoiceProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & { label: React.ReactNode; description?: string };

function Choice({ kind, label, description, className, ...p }: ChoiceProps & { kind: "checkbox" | "radio" | "switch" }) {
  const cls = kind === "switch" ? "nv-switch" : kind === "radio" ? "nv-radio" : "nv-check";
  return (
    <label className={cn("group flex cursor-pointer items-start gap-3 text-[14px] text-ink-200", p.disabled && "cursor-not-allowed opacity-60", className)}>
      <input type={kind === "radio" ? "radio" : "checkbox"} role={kind === "switch" ? "switch" : undefined} className={cn(cls, kind !== "switch" && "mt-[1px]")} {...p} />
      <span className="flex flex-col gap-0.5 leading-snug">
        <span className="text-ink-100">{label}</span>
        {description && <span className="text-[12.5px] text-ink-500">{description}</span>}
      </span>
    </label>
  );
}
export const Checkbox = (p: ChoiceProps) => <Choice kind="checkbox" {...p} />;
export const Radio = (p: ChoiceProps) => <Choice kind="radio" {...p} />;
export const Switch = (p: ChoiceProps) => <Choice kind="switch" {...p} />;

/** Pill segmented control (single choice). */
export function Segmented<T extends string>({ value, onChange, options, size = "md", className, label }: { value: T; onChange: (v: T) => void; options: { value: T; label: React.ReactNode; icon?: React.ReactNode }[]; size?: "sm" | "md"; className?: string; label: string }) {
  const id = useId();
  return (
    <div role="radiogroup" aria-label={label} className={cn("inline-flex items-center gap-0.5 rounded-full bg-ink-100/[0.06] p-1", className)}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={cn(
              "relative inline-flex items-center gap-1.5 rounded-full font-medium transition-colors duration-200 [&>svg]:size-3.5",
              size === "sm" ? "h-7 px-3 text-[12.5px]" : "h-8 px-3.5 text-[13px]",
              on ? "text-ink-100" : "text-ink-400 hover:text-ink-100"
            )}
          >
            {on && <motion.span layoutId={`seg-${id}`} className="absolute inset-0 -z-0 rounded-full bg-ink-1000 shadow-[var(--shadow-card)]" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
            <span className="relative inline-flex items-center gap-1.5 [&>svg]:size-3.5">
              {o.icon}
              {o.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Underlined tabs. */
export function Tabs<T extends string>({ value, onChange, tabs, className }: { value: T; onChange: (v: T) => void; tabs: { value: T; label: string; count?: number }[]; className?: string }) {
  const id = useId();
  return (
    <div role="tablist" className={cn("scroll-thin flex items-center gap-1 overflow-x-auto border-b border-ink-100/10 [scrollbar-width:none]", className)}>
      {tabs.map((t) => {
        const on = t.value === value;
        return (
          <button key={t.value} role="tab" aria-selected={on} type="button" onClick={() => onChange(t.value)} className={cn("relative shrink-0 whitespace-nowrap px-3 pb-2.5 pt-1 text-[13.5px] font-medium transition-colors", on ? "text-ink-100" : "text-ink-400 hover:text-ink-200")}>
            {t.label}
            {t.count != null && <span className="ml-1.5 rounded-full bg-ink-100/[0.07] px-1.5 py-px text-[11px] text-ink-400">{t.count}</span>}
            {on && <motion.span layoutId={`tab-${id}`} className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-nar" />}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- small display pieces ---------------- */

export function Avatar({ name, src, size = 32, className }: { name: string; src?: string; size?: number; className?: string }) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span className={cn("inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-brand font-medium text-white", className)} style={{ width: size, height: size, fontSize: size * 0.38 }} aria-label={name}>
      {src ? <img src={src} alt="" className="size-full object-cover" /> : initials}
    </span>
  );
}

export function Progress({ value, max = 100, className, tone = "nar", label }: { value: number; max?: number; className?: string; tone?: "nar" | "success" | "warning" | "danger"; label?: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const bg = { nar: "bg-nar", success: "bg-success", warning: "bg-warning", danger: "bg-danger" }[tone];
  return (
    <div role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} className={cn("h-1.5 w-full overflow-hidden rounded-full bg-ink-100/[0.08]", className)}>
      <div className={cn("h-full rounded-full transition-[width] duration-700 ease-[var(--ease-out-expo)]", bg)} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse rounded-lg bg-ink-100/[0.07]", className)} />;
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 aria-hidden className={cn("size-4 animate-spin", className)} />;
}

export function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return <kbd className={cn("inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-ink-100/12 bg-ink-1000 px-1.5 font-mono text-[10.5px] text-ink-400 shadow-[0_1px_0_var(--color-ink-800)]", className)}>{children}</kbd>;
}

const ALERT = {
  info: { icon: Info, cls: "border-info/25 bg-info/[0.07] text-info" },
  success: { icon: CheckCircle2, cls: "border-success/25 bg-success/[0.07] text-success" },
  warning: { icon: AlertTriangle, cls: "border-warning/30 bg-warning/[0.08] text-warning" },
  danger: { icon: XCircle, cls: "border-danger/25 bg-danger/[0.07] text-danger" },
};
export function Alert({ tone = "info", title, children, action, className }: { tone?: keyof typeof ALERT; title: string; children?: React.ReactNode; action?: React.ReactNode; className?: string }) {
  const { icon: Icon, cls } = ALERT[tone];
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cn("flex items-start gap-3 rounded-2xl border px-4 py-3.5", cls, className)}>
      <Icon className="mt-0.5 size-[18px] shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-medium text-ink-100">{title}</p>
        {children && <div className="mt-0.5 text-[13px] leading-relaxed text-ink-400">{children}</div>}
      </div>
      {action}
    </div>
  );
}

/** Hover/focus tooltip (pure CSS, no portal). */
export function Tooltip({ label, children, side = "top" }: { label: string; children: React.ReactNode; side?: "top" | "bottom" | "right" }) {
  const pos = { top: "bottom-full left-1/2 mb-2 -translate-x-1/2", bottom: "top-full left-1/2 mt-2 -translate-x-1/2", right: "left-full top-1/2 ml-2 -translate-y-1/2" }[side];
  return (
    <span className="group/tt relative inline-flex">
      {children}
      <span role="tooltip" className={cn("pointer-events-none absolute z-50 whitespace-nowrap rounded-lg bg-ink-100 px-2.5 py-1.5 text-[12px] font-medium text-ink-1000 opacity-0 shadow-[var(--shadow-card)] transition-[opacity,transform] delay-0 duration-150 group-focus-within/tt:opacity-100 group-hover/tt:opacity-100 group-hover/tt:delay-300", pos)}>
        {label}
      </span>
    </span>
  );
}

/* ---------------- overlays ---------------- */

/**
 * Modal — centred dialog on desktop, bottom sheet on phones.
 * Escape / backdrop closes; focus moves in on open and back on close; page scroll is locked.
 */
export function Modal({ open, onClose, title, description, children, footer, size = "md", icon }: { open: boolean; onClose: () => void; title: string; description?: string; children?: React.ReactNode; footer?: React.ReactNode; size?: "sm" | "md" | "lg" | "xl"; icon?: React.ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) (e.preventDefault(), last.focus());
        else if (!e.shiftKey && document.activeElement === last) (e.preventDefault(), first.focus());
      }
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>("[data-autofocus],input,textarea,select")?.focus() ?? panel.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
  }, [open, onClose]);
  const w = { sm: "sm:max-w-[420px]", md: "sm:max-w-[520px]", lg: "sm:max-w-[760px]", xl: "sm:max-w-[1000px]" }[size];
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6">
          <motion.div aria-hidden className="absolute inset-0 bg-ink-100/30 backdrop-blur-[3px] dark:bg-black/55" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className={cn("relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[28px] border border-ink-100/10 bg-ink-1000 shadow-[var(--shadow-panel)] outline-none sm:rounded-[28px]", w)}
          >
            <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-ink-100/15 sm:hidden" />
            <header className="flex shrink-0 items-start gap-3.5 px-6 pb-2 pt-5 sm:pt-6">
              {icon && <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-nar/10 text-nar [&>svg]:size-5">{icon}</span>}
              <div className="min-w-0 flex-1">
                <h2 id={titleId} className="font-display text-[22px] font-[650] leading-tight tracking-[-0.02em] text-ink-100">
                  {title}
                </h2>
                {description && <p className="mt-1 text-[13.5px] leading-relaxed text-ink-400">{description}</p>}
              </div>
              <button type="button" onClick={onClose} aria-label="Bağla" className="-mr-2 -mt-1 grid size-9 shrink-0 place-items-center rounded-full text-ink-400 transition-colors hover:bg-ink-100/[0.06] hover:text-ink-100">
                <X className="size-[18px]" />
              </button>
            </header>
            {children ? <div className="scroll-thin min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-3">{children}</div> : <div className="h-4" />}
            {footer && <footer className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-ink-100/8 bg-ink-950/50 px-6 py-4">{footer}</footer>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/** Dropdown menu anchored to its trigger. */
export function Menu({ open, onClose, children, align = "end", className }: { open: boolean; onClose: () => void; children: React.ReactNode; align?: "start" | "end"; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !ref.current?.parentElement?.contains(e.target as Node) && onClose();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          role="menu"
          initial={{ opacity: 0, y: -6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className={cn("absolute top-full z-50 mt-2 min-w-[200px] origin-top rounded-2xl border border-ink-100/10 bg-ink-1000 p-1.5 shadow-[var(--shadow-panel)]", align === "end" ? "right-0" : "left-0", className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function MenuItem({ icon, children, onClick, danger, hint }: { icon?: React.ReactNode; children: React.ReactNode; onClick?: () => void; danger?: boolean; hint?: React.ReactNode }) {
  return (
    <button type="button" role="menuitem" onClick={onClick} className={cn("flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[13.5px] transition-colors [&>svg]:size-4 [&>svg]:shrink-0", danger ? "text-danger hover:bg-danger/[0.08]" : "text-ink-200 hover:bg-ink-100/[0.06] hover:text-ink-100")}>
      {icon}
      <span className="flex-1">{children}</span>
      {hint && <span className="text-[11.5px] text-ink-500">{hint}</span>}
    </button>
  );
}

export const MenuSeparator = () => <div role="separator" className="my-1 h-px bg-ink-100/8" />;

/** Empty state block for lists. */
export function EmptyState({ icon, title, children, action, className }: { icon: React.ReactNode; title: string; children?: React.ReactNode; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center rounded-3xl border border-dashed border-ink-100/15 px-6 py-12 text-center", className)}>
      <span className="grid size-12 place-items-center rounded-2xl bg-ink-100/[0.05] text-ink-400 [&>svg]:size-5">{icon}</span>
      <p className="mt-4 font-display text-[19px] font-[650] tracking-[-0.01em] text-ink-100">{title}</p>
      {children && <p className="mt-1.5 max-w-sm text-[13.5px] leading-relaxed text-ink-400">{children}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
