// Builds every site template with Vite, opens it in Chromium and fails on any error.
//   node scripts/check-templates.mjs [id…]   (NOVO_TPL_MODULES=/path/to/node_modules, NOVO_TPL_OUT=/dir for screenshots)
import { execFileSync, spawn } from "node:child_process";
import { mkdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import { createRequire } from "node:module";
import { fullSite, siteIds } from "./templates-lib.mjs";

const modules = process.env.NOVO_TPL_MODULES;
if (!modules) throw new Error("Set NOVO_TPL_MODULES to a node_modules dir with the template's dependencies installed");
const out = process.env.NOVO_TPL_OUT || path.join(os.tmpdir(), "novo-templates");
const ids = process.argv.slice(2).length ? process.argv.slice(2) : siteIds();
const { chromium } = createRequire(import.meta.url)("playwright"); // CJS lookup also finds a globally installed copy
const browser = await chromium.launch();
let failed = 0;

for (const [i, id] of ids.entries()) {
  const dir = path.join(out, id);
  rmSync(dir, { recursive: true, force: true });
  for (const [file, body] of Object.entries(fullSite(id))) {
    mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    writeFileSync(path.join(dir, file), body);
  }
  symlinkSync(modules, path.join(dir, "node_modules"), "dir");
  try {
    execFileSync("npx", ["vite", "build", "--logLevel", "error"], { cwd: dir, stdio: "pipe" });
  } catch (e) {
    failed++;
    console.log(`✗ ${id}: build failed\n${e.stderr}${e.stdout}`);
    continue;
  }
  const port = 4600 + i;
  const server = spawn("npx", ["vite", "preview", "--port", String(port), "--strictPort"], { cwd: dir, stdio: "ignore", detached: true });
  await new Promise((r) => setTimeout(r, 2500));
  const errors = [];
  for (const [name, viewport] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
    const page = await browser.newPage({ viewport });
    page.on("pageerror", (e) => errors.push(`${name}: ${e.message}`));
    page.on("console", (m) => m.type() === "error" && !/Failed to load resource/.test(m.text()) && errors.push(`${name}: ${m.text()}`));
    await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle" });
    // scroll through so lazy images load
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 600) await page.evaluate((v) => window.scrollTo(0, v), y), await page.waitForTimeout(80);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 1) errors.push(`${name}: horizontal overflow ${overflow}px`);
    const broken = await page.evaluate(() => [...document.images].filter((im) => im.complete && im.naturalWidth === 0).map((im) => im.src));
    if (broken.length) errors.push(`${name}: broken images ${broken.join(", ")}`);
    await page.screenshot({ path: path.join(out, `${id}-${name}.png`), fullPage: true });
    if (name === "desktop" && process.env.NOVO_TPL_THUMBS) {
      // card thumbnail: first screen at a 4:3 desktop size, without the badge
      await page.setViewportSize({ width: 1280, height: 960 });
      await page.evaluate(() => document.getElementById("novo-badge")?.remove());
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(process.env.NOVO_TPL_THUMBS, `${id}.jpg`), type: "jpeg", quality: 82 });
    }
    await page.close();
  }
  process.kill(-server.pid); // the whole group: npx and the vite child
  if (errors.length) failed++;
  console.log(errors.length ? `✗ ${id}\n  ${errors.join("\n  ")}` : `✓ ${id}`);
}
await browser.close();
process.exit(failed ? 1 : 0);
