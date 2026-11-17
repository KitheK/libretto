/**
 * Cold-load timings for Libretto routes (system Chrome/Edge via Playwright).
 * Run: npx playwright@1.48.2 test isn't needed — node scripts/speed-check.mjs
 */
import { chromium } from "playwright-core";
import { createRequire } from "module";

const BASE = process.env.LIBRETTO_URL ?? "http://localhost:5174";
const ROUTES = ["/", "/contents", "/chapters/01-shape", "/chapters/05-loop"];

async function launch() {
  for (const channel of ["chrome", "msedge", "chromium"]) {
    try {
      return await chromium.launch({ channel, headless: true });
    } catch {
      /* try next */
    }
  }
  // Last resort: bundled chromium if present
  const require = createRequire(import.meta.url);
  try {
    const pw = require("playwright");
    return await pw.chromium.launch({ headless: true });
  } catch {
    throw new Error("No Chrome/Edge/Chromium available for speed check");
  }
}

async function measure(page, path) {
  const url = `${BASE}${path}`;
  await page.goto("about:blank");
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(2000);
  return page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const paints = Object.fromEntries(performance.getEntriesByType("paint").map((p) => [p.name, p.startTime]));
    const lcp = performance.getEntriesByType("largest-contentful-paint").at(-1)?.startTime ?? null;
    const resources = performance.getEntriesByType("resource");
    const transfer = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
    return {
      fcp: paints["first-contentful-paint"] ?? null,
      lcp,
      dcl: nav?.domContentLoadedEventEnd ?? null,
      load: nav?.loadEventEnd ?? null,
      transferKB: Math.round(transfer / 1024),
      resources: resources.length,
    };
  }).then((m) => ({ path, ...m }));
}

const browser = await launch();
const page = await browser.newPage();
await page.addInitScript(() => {
  try {
    new PerformanceObserver(() => {}).observe({ type: "largest-contentful-paint", buffered: true });
  } catch {
    /* older engines */
  }
});

const rows = [];
for (const path of ROUTES) {
  rows.push(await measure(page, path));
}
await browser.close();

console.log(`Libretto speed check @ ${BASE}`);
console.table(
  rows.map((r) => ({
    path: r.path,
    FCP_ms: r.fcp != null ? Math.round(r.fcp) : "—",
    LCP_ms: r.lcp != null ? Math.round(r.lcp) : "—",
    DCL_ms: r.dcl != null ? Math.round(r.dcl) : "—",
    load_ms: r.load != null ? Math.round(r.load) : "—",
    transfer_KB: r.transferKB,
    resources: r.resources,
  })),
);
