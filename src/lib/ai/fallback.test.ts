import { describe, expect, it } from "vitest";
import { markDown, orderByHealth, withFallback } from "./fallback";

const sleep = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => (clearTimeout(t), reject(new Error("aborted"))));
  });

async function collect<E>(it: AsyncIterable<E>) {
  const out: E[] = [];
  for await (const e of it) out.push(e);
  return out;
}

describe("withFallback", () => {
  it("uses the first model when it answers", async () => {
    const out = await collect(withFallback({ models: ["a", "b"], stream: async function* (m) { yield `${m}1`; yield `${m}2`; } }));
    expect(out).toEqual([{ kind: "event", event: "a1" }, { kind: "event", event: "a2" }]);
  });

  it("moves on when a model errors before answering", async () => {
    const out = await collect(
      withFallback({
        models: ["bad", "good"],
        stream: async function* (m) {
          if (m === "bad") throw new Error("503");
          yield "ok";
        },
      })
    );
    expect(out).toEqual([{ kind: "switch", model: "good", reason: "503" }, { kind: "event", event: "ok" }]);
  });

  it("moves on when a model stays silent too long", async () => {
    const out = await collect(
      withFallback({
        models: ["slow", "fast"],
        firstEventMs: 30,
        stream: async function* (m, signal) {
          if (m === "slow") await sleep(5_000, signal);
          yield m;
        },
      })
    );
    expect(out.at(-1)).toEqual({ kind: "event", event: "fast" });
    expect(out[0]).toMatchObject({ kind: "switch", model: "fast" });
  });

  it("never switches once a model has started answering", async () => {
    const run = collect(
      withFallback({
        models: ["a", "b"],
        stream: async function* () {
          yield "partial";
          throw new Error("dropped");
        },
      })
    );
    await expect(run).rejects.toThrow("dropped");
  });

  it("throws the last error when every model fails", async () => {
    const run = collect(withFallback({ models: ["a", "b"], stream: async function* (m) { throw new Error(`${m} down`); } }));
    await expect(run).rejects.toThrow("b down");
  });
});

describe("orderByHealth", () => {
  it("tries recently failed models last, then forgives them", () => {
    markDown("x", 1_000);
    expect(orderByHealth(["x", "y", "z"], 2_000)).toEqual(["y", "z", "x"]);
    expect(orderByHealth(["x", "y", "z"], 1_000 + 11 * 60_000)).toEqual(["x", "y", "z"]);
  });
});

it("switches away from endless reasoning before any answer text", async () => {
  const out = await collect(withFallback({
    models: ["thinking", "answering"],
    firstEventMs: (model) => model === "thinking" ? 30 : 100,
    isAnswer: (e: { kind: string }) => e.kind === "delta",
    stream: async function* (model, signal) {
      if (model === "thinking") {
        yield { kind: "reasoning" };
        await sleep(5_000, signal);
      }
      yield { kind: "delta" };
    },
  }));
  expect(out).toContainEqual(expect.objectContaining({ kind: "switch", model: "answering" }));
  expect(out.at(-1)).toEqual({ kind: "event", event: { kind: "delta" } });
});
