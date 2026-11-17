import { beforeEach, describe, expect, it, vi } from "vitest";

const mock = vi.hoisted(() => ({
  handlers: {} as Record<string, (...args: any[]) => void>,
  mount: vi.fn(), mkdir: vi.fn(), rm: vi.fn(), spawn: vi.fn(), get: vi.fn(), del: vi.fn(),
}));
vi.mock("@webcontainer/api", () => ({ WebContainer: { boot: async () => ({
  mount: mock.mount,
  fs: { mkdir: mock.mkdir, rm: mock.rm },
  on: (name: string, fn: (...args: any[]) => void) => { mock.handlers[name] = fn; },
  spawn: mock.spawn,
}) } }));
vi.mock("idb-keyval", () => ({ get: mock.get, del: mock.del, keys: async () => [], set: vi.fn() }));
import { ProjectRuntime } from "./webcontainer";

beforeEach(() => {
  vi.clearAllMocks();
  mock.del.mockResolvedValue(undefined);
  mock.mount.mockResolvedValue(undefined);
  mock.mkdir.mockResolvedValue(undefined);
  mock.rm.mockResolvedValue(undefined);
  mock.get.mockResolvedValue(new Uint8Array([1]));
  mock.spawn.mockImplementation(async (_cmd, args) => ({
    output: new ReadableStream({ start(c) { c.close(); } }),
    exit: args[0] === "install" ? Promise.resolve(0) : new Promise(() => {}),
    kill: vi.fn(),
  }));
});
const files = { "package.json": '{"dependencies":{"react":"19"}}' };

describe("runtime startup", () => {
  it("creates the cache mount directory and publishes the server URL to a resubscribed listener", async () => {
    const runtime = new ProjectRuntime();
    const stale = vi.fn();
    runtime.onUrl(stale)(); // React development cleanup
    const listener = vi.fn();
    runtime.onUrl(listener);
    await runtime.start(files);
    expect(mock.mkdir).toHaveBeenCalledWith("node_modules", { recursive: true });
    expect(mock.mkdir.mock.invocationCallOrder[0]).toBeLessThan(mock.mount.mock.invocationCallOrder[1]);
    mock.handlers["server-ready"](5173, "https://preview.example");
    expect(listener).toHaveBeenCalledWith("https://preview.example");
    expect(stale).not.toHaveBeenCalled();
    expect(runtime.status).toBe("ready");
  });

  it("reinstalls when mounting a cached snapshot fails", async () => {
    mock.mount.mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error("invalid mount point"));
    const runtime = new ProjectRuntime();
    await runtime.start(files);
    expect(mock.del).toHaveBeenCalled();
    expect(mock.spawn.mock.calls.map((call) => call[1][0])).toEqual(["install", "run"]);
    expect(runtime.status).toBe("starting");
  });

  it("does not start the dev server after installation fails", async () => {
    mock.get.mockResolvedValue(undefined);
    mock.spawn.mockResolvedValue({ output: new ReadableStream({ start(c) { c.close(); } }), exit: Promise.resolve(1) });
    const runtime = new ProjectRuntime();
    await runtime.start(files);
    expect(mock.spawn).toHaveBeenCalledTimes(1);
    expect(runtime.status).toBe("error");
  });
});
