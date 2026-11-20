/**
 * Free hosted models come and go: one day the top-ranked model answers in two seconds, the next
 * it hangs for minutes. This tries models in order and moves on when one errors or stays silent
 * past `firstEventMs` — but only before it has produced anything, so a reply is never mixed.
 */

export type FallbackEvent<E> = { kind: "switch"; model: string; reason: string } | { kind: "event"; event: E };

export async function* withFallback<E>(opts: {
  models: string[];
  /** called with each model that failed or stayed silent */
  onFail?: (model: string) => void;
  stream: (model: string, signal: AbortSignal) => AsyncIterable<E>;
  signal?: AbortSignal;
  firstEventMs?: number | ((model: string) => number);
  /** Reasoning/usage do not count as visible output. */
  isAnswer?: (event: E) => boolean;
}): AsyncGenerator<FallbackEvent<E>> {
  const { models, stream, signal, onFail, firstEventMs = 25_000 } = opts;
  let lastError: unknown = new Error("Heç bir model mövcud deyil");
  for (const [i, model] of models.entries()) {
    if (signal?.aborted) return;
    if (i > 0) yield { kind: "switch", model, reason: (lastError as Error)?.message ?? "" };
    const waitMs = typeof firstEventMs === "function" ? firstEventMs(model) : firstEventMs;
    const ac = new AbortController();
    const onAbort = () => ac.abort();
    signal?.addEventListener("abort", onAbort);
    let started = false;
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      ac.abort();
    }, waitMs);
    try {
      for await (const event of stream(model, ac.signal)) {
        if (!started && (opts.isAnswer?.(event) ?? true)) {
          started = true;
          clearTimeout(timer);
        }
        yield { kind: "event", event };
      }
      if (started) return;
      lastError = new Error(`${model} boş cavab qaytardı`);
      onFail?.(model);
    } catch (e) {
      if (started || signal?.aborted) throw e; // never splice two models into one reply
      lastError = timedOut ? new Error(`${model} ${Math.round(waitMs / 1000)} saniyədə cavab vermədi`) : e;
      onFail?.(model);
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
    }
  }
  throw lastError;
}

/** Models that just failed or hung, so the next requests try them last instead of waiting again. */
const down = new Map<string, number>();
const COOLDOWN_MS = 10 * 60_000;

export function markDown(model: string, now = Date.now()) {
  down.set(model, now);
}

/** Healthy models first (original order kept), recently failed ones at the end. */
export function orderByHealth(models: string[], now = Date.now()): string[] {
  const bad = (m: string) => (down.get(m) ?? -Infinity) > now - COOLDOWN_MS;
  return [...models.filter((m) => !bad(m)), ...models.filter(bad)];
}
