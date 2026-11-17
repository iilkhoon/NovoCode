import { cn } from "@/lib/utils";

export function Separator({ className, orientation = "horizontal", ...props }) {
  return <div role="separator" className={cn("bg-border", orientation === "vertical" ? "h-full w-px" : "h-px w-full", className)} {...props} />;
}
export default Separator;
