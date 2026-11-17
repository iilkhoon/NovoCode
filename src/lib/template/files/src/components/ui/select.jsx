import { cn } from "@/lib/utils";

/** Native select styled like Input: <Select value onChange><option>…</option></Select> */
export function Select({ className, children, ...props }) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-xl border border-border bg-card px-4 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
export default Select;
