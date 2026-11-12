"use client";
import { WebContainer, type WebContainerProcess } from "@webcontainer/api";
import { toFileSystemTree } from "./tree";
import { extractErrors } from "./errors";

export type RuntimeStatus = "idle" | "booting" | "installing" | "starting" | "ready" | "error";

type Listener<T> = (v: T) => void;

let bootPromise: Promise<WebContainer> | null = null;
function boot(): Promise<WebContainer> {
  bootPromise ??= WebContainer.boot({ workdirName: "project", coep: "credentialless" });
  return bootPromise;
}

/**
 * Wraps a single WebContainer: mounts files, installs deps, runs the Vite dev
 * server, streams terminal output and remembers it so errors can be detected.
 */
export class ProjectRuntime {
  private wc: WebContainer | null = null;
  private dev: WebContainerProcess | null = null;
  private log = "";
  private total = 0;
  private mark = 0;
  private lastOutputAt = 0;
  private previewErrors: string[] = [];
  private installedPkgJson = "";
  private devDead = false;

  private mounted: Promise<void>;
  private resolveMounted!: () => void;
  private serving: Promise<void>;
  private resolveServing!: () => void;

  status: RuntimeStatus = "idle";

  constructor() {
    this.mounted = new Promise((r) => (this.resolveMounted = r));
    this.serving = new Promise((r) => (this.resolveServing = r));
  }
  url: string | null = null;

  private outL = new Set<Listener<string>>();
  private statusL = new Set<Listener<RuntimeStatus>>();
  private urlL = new Set<Listener<string>>();

  onOutput(fn: Listener<string>) { this.outL.add(fn); return () => this.outL.delete(fn); }
  onStatus(fn: Listener<RuntimeStatus>) { this.statusL.add(fn); return () => this.statusL.delete(fn); }
  onUrl(fn: Listener<string>) { this.urlL.add(fn); if (this.url) fn(this.url); return () => this.urlL.delete(fn); }

  private setStatus(s: RuntimeStatus) { this.status = s; this.statusL.forEach((f) => f(s)); }
  private emit(text: string) {
    this.log = (this.log + text).slice(-60_000);
    this.total += text.length;
    this.lastOutputAt = Date.now();
    this.outL.forEach((f) => f(text));
  }
  private pipe(p: WebContainerProcess) {
    p.output.pipeTo(new WritableStream({ write: (d) => this.emit(d) })).catch(() => {});
  }

  async start(files: Record<string, string>) {
    this.setStatus("booting");
    this.emit("\x1b[38;5;203m◆ NovoCode\x1b[0m runtime işə düşür…\r\n");
    if (typeof window !== "undefined" && !window.crossOriginIsolated) {
      this.emit("\x1b[31mBrauzer cross-origin isolation dəstəkləmir. Chrome, Edge və ya Brave istifadə edin.\x1b[0m\r\n");
      this.setStatus("error");
      this.resolveMounted();
      this.resolveServing();
      return;
    }
    try {
      this.wc = await Promise.race([
        boot(),
        new Promise<never>((_, rej) => setTimeout(() => rej(new Error("WebContainer 60 saniyəyə işə düşmədi (stackblitz.com əlçatandırmı?)")), 60_000)),
      ]);
    } catch (e) {
      this.emit(`\x1b[31m${(e as Error).message}\x1b[0m\r\n`);
      this.setStatus("error");
      this.resolveMounted();
      this.resolveServing();
      return;
    }
    try {
      await this.wc.mount(toFileSystemTree(files));
    } catch (e) {
      // without this the agent would wait on `mounted` forever
      this.emit(`\x1b[31mFayllar yüklənmədi: ${(e as Error).message}\x1b[0m\r\n`);
      this.wc = null;
      this.setStatus("error");
      this.resolveMounted();
      this.resolveServing();
      return;
    }
    this.resolveMounted();
    this.wc.on("server-ready", (_port, url) => {
      this.url = url;
      this.urlL.forEach((f) => f(url));
      this.setStatus("ready");
      this.resolveServing();
    });
    this.wc.on("error", (e) => this.emit(`\r\n[runtime] ${e.message}\r\n`));
    try {
      await this.install(files["package.json"]);
      await this.startDev();
    } catch (e) {
      this.emit(`\r\n\x1b[31m${(e as Error).message}\x1b[0m\r\n`);
      this.setStatus("error");
      this.resolveServing();
    }
  }

  async install(pkgJson?: string) {
    if (!this.wc) return;
    this.setStatus("installing");
    this.emit("\r\n\x1b[2m$ npm install\x1b[0m\r\n");
    const p = await this.wc.spawn("npm", ["install", "--no-audit", "--no-fund", "--loglevel=error"]);
    this.pipe(p);
    const code = await p.exit;
    if (pkgJson) this.installedPkgJson = pkgJson;
    if (code !== 0) {
      this.emit(`\r\n\x1b[31mnpm install uğursuz oldu (kod ${code})\x1b[0m\r\n`);
      this.setStatus("error");
    }
    return code;
  }

  async startDev() {
    if (!this.wc) return;
    this.dev?.kill();
    this.setStatus("starting");
    this.emit("\r\n\x1b[2m$ npm run dev\x1b[0m\r\n");
    const dev = await this.wc.spawn("npm", ["run", "dev"]);
    this.dev = dev;
    this.pipe(dev);
    dev.exit.then((code) => {
      if (this.dev !== dev) return; // replaced by a restart
      this.emit(`\r\n\x1b[31mDev server dayandı (kod ${code})\x1b[0m\r\n`);
      this.devDead = true;
      this.setStatus("error");
      this.resolveServing();
    });
  }

  async writeFile(path: string, contents: string) {
    await this.mounted;
    if (!this.wc) return;
    const dir = path.split("/").slice(0, -1).join("/");
    if (dir) await this.wc.fs.mkdir(dir, { recursive: true });
    await this.wc.fs.writeFile(path, contents);
    if (path === "package.json" && contents !== this.installedPkgJson) {
      await this.install(contents);
      await this.startDev();
    } else if (this.devDead) {
      this.devDead = false;
      await this.startDev();
    }
  }

  async readFile(path: string): Promise<string | null> {
    try { return (await this.wc?.fs.readFile(path, "utf-8")) ?? null; } catch { return null; }
  }

  async deleteFile(path: string) {
    await this.mounted;
    await this.wc?.fs.rm(path, { force: true, recursive: true });
  }

  /** Runs a shell command (e.g. "npm install recharts") and resolves with its exit code. */
  async run(command: string): Promise<number> {
    await this.mounted;
    if (!this.wc) return 1;
    this.emit(`\r\n\x1b[2m$ ${command}\x1b[0m\r\n`);
    const p = await this.wc.spawn("jsh", ["-c", command]);
    this.pipe(p);
    return p.exit;
  }

  /** Runs a production build and returns the static files from dist/. */
  async buildStatic(): Promise<Record<string, Uint8Array>> {
    await this.mounted;
    if (!this.wc) throw new Error("Runtime hazır deyil");
    this.emit("\r\n\x1b[2m$ npm run build\x1b[0m\r\n");
    const p = await this.wc.spawn("npm", ["run", "build"]);
    this.pipe(p);
    const code = await p.exit;
    if (code !== 0) throw new Error("Build alınmadı — Terminal bölməsinə baxın");
    const out: Record<string, Uint8Array> = {};
    const walk = async (dir: string) => {
      const entries = await this.wc!.fs.readdir(dir, { withFileTypes: true });
      for (const e of entries) {
        const full = `${dir}/${e.name}`;
        if (e.isDirectory()) await walk(full);
        else out[full.replace(/^dist\//, "")] = await this.wc!.fs.readFile(full);
      }
    };
    await walk("dist");
    return out;
  }

  /** Interactive shell for the terminal tab. */
  async shell(cols: number, rows: number) {
    if (!this.wc) throw new Error("runtime not started");
    return this.wc.spawn("jsh", { terminal: { cols, rows } });
  }

  reportPreviewError(msg: string) {
    this.previewErrors.push(msg);
  }

  /** Starts a new observation window (call before applying an AI change). */
  markChange() {
    this.mark = this.total;
    this.previewErrors = [];
  }

  /** Waits until output is quiet, then returns errors seen since markChange(). */
  async collectErrors(quietMs = 2500, maxWait = 20_000): Promise<string | null> {
    // first wait until the dev server is up (initial npm install can take a while)
    await Promise.race([this.serving, new Promise((r) => setTimeout(r, 120_000))]);
    const started = Date.now();
    await new Promise((r) => setTimeout(r, 1200));
    while (Date.now() - this.lastOutputAt < quietMs && Date.now() - started < maxWait) {
      await new Promise((r) => setTimeout(r, 300));
    }
    const fresh = this.log.slice(Math.max(0, this.log.length - (this.total - this.mark)));
    const fromLog = extractErrors(fresh);
    const fromPreview = [...new Set(this.previewErrors)]
      .filter((e) => !/Download the React DevTools|favicon/.test(e))
      .slice(0, 5)
      .join("\n");
    const all = [fromLog, fromPreview && `Browser runtime errors:\n${fromPreview}`].filter(Boolean).join("\n\n");
    return all || null;
  }
}
