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
  /** silence allowed before the first event of any kind */
  firstEventMs?: number;
  /** which events are real reply text (others, like hidden reasoning, only prove the model is alive) */
  isContent?: (event: E) => boolean;
  /** time allowed until the first content event, even while the model keeps thinking */
  contentMs?: number;
}): AsyncGenerator<FallbackEvent<E>> {
  const { models, stream, signal, onFail, firstEventMs = 25_000, isContent = () => true, contentMs = 120_000 } = opts;
  let lastError: unknown = new Error("Heç bir model mövcud deyil");
  for (const [i, model] of models.entries()) {
    if (signal?.aborted) return;
    if (i > 0) yield { kind: "switch", model, reason: (lastError as Error)?.message ?? "" };
    const ac = new AbortController();
    const onAbort = () => ac.abort();
    signal?.addEventListener("abort", onAbort);
    let alive = false; // any event seen
    let started = false; // reply text seen — from here on we never switch
    let timedOut = "";
    const timer = setTimeout(() => ((timedOut = `${Math.round(firstEventMs / 1000)} saniyədə cavab vermədi`), ac.abort()), firstEventMs);
    const contentTimer = setTimeout(() => ((timedOut = `${Math.round(contentMs / 1000)} saniyədə mətn yazmadı`), ac.abort()), contentMs);
    try {
      for await (const event of stream(model, ac.signal)) {
        if (!alive) {
          alive = true;
          clearTimeout(timer);
        }
        if (!started && isContent(event)) {
          started = true;
          clearTimeout(contentTimer);
        }
        yield { kind: "event", event };
      }
      if (started) return;
      lastError = new Error(`${model} boş cavab qaytardı`);
      onFail?.(model);
    } catch (e) {
      if (started || signal?.aborted) throw e; // never splice two models into one reply
      lastError = timedOut ? new Error(`${model} ${timedOut}`) : e;
      onFail?.(model);
    } finally {
      clearTimeout(timer);
      clearTimeout(contentTimer);
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
