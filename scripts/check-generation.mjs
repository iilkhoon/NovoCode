// Browser smoke test for deterministic generation fixtures (not live provider responses).
// NOVO_GENERATION_OUT=/tmp/novo-generation-smoke npm test
// node scripts/check-generation.mjs
// Requires playwright on Node's module search path and a local Chromium binary.
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync, writeFileSync, symlinkSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { build, preview } from 'vite';
const { chromium } = createRequire(import.meta.url)('playwright');
const fixtures = process.env.NOVO_GENERATION_OUT || '/tmp/novo-generation-smoke';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
try {
  for (const model of ['deepseek-v4-flash', 'deepseek-v4-pro']) {
    const files = JSON.parse(readFileSync(path.join(fixtures, `${model}.json`), 'utf8'));
    const root = mkdtempSync(path.join(tmpdir(), 'novo-generated-'));
    for (const [name, body] of Object.entries(files)) {
      mkdirSync(path.dirname(path.join(root, name)), { recursive: true });
      writeFileSync(path.join(root, name), body);
    }
    symlinkSync(path.resolve('node_modules'), path.join(root, 'node_modules'), 'dir');
    await build({ root, configFile: false, logLevel: 'error' });
    const server = await preview({ root, configFile: false, preview: { port: 0, host: '127.0.0.1' }, logLevel: 'error' });
    try {
      const address = server.httpServer.address();
      for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
        const page = await browser.newPage({ viewport });
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        await page.goto(`http://127.0.0.1:${address.port}`, { waitUntil: 'networkidle' });
        await page.getByRole('heading', { name: 'Hesabla' }).waitFor({ state: 'visible' });
        await page.getByText('Aylıq 19 AZN').waitFor({ state: 'visible' });
        const dialog = page.waitForEvent('dialog');
        const clicking = page.getByRole('button', { name: 'Əlaqə saxla' }).click();
        const opened = await dialog;
        if (opened.message() !== 'Müraciət qəbul edildi') throw new Error('Contact action did not execute');
        await opened.accept();
        await clicking;
        if (errors.length) throw new Error(errors.join('\n'));
        await page.close();
      }
      console.log(`${model}: fixture builds and renders on desktop/mobile; contact action works`);
    } finally { await new Promise((resolve) => server.httpServer.close(resolve)); }
  }
} finally { await browser.close(); }
