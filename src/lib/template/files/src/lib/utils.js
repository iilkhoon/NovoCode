/** Sinif adlarını birləşdirir: cn("a", cond && "b") */
export function cn(...classes) {
  return classes.flat().filter(Boolean).join(" ");
}
