#!/usr/bin/env node
/**
 * Build the real Conductor frontend (capstone-team-1 app/frontend) as a static
 * bundle under public/live/conductor/, with the in-browser mock backend
 * injected ahead of the app. The capstone source is not modified.
 *
 *   node tools/conductor-live/build-embed.mjs /path/to/capstone-team-1/app/frontend
 *
 * The capstone checkout needs `npm install` first.
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const frontend = resolve(process.argv[2] ?? "../capstone-team-1/app/frontend");
const out = resolve(root, "public/live/conductor");
const BASE = "/live/conductor/";

if (!existsSync(resolve(frontend, "src/main.tsx"))) {
  console.error(`No Conductor frontend at ${frontend}`);
  process.exit(1);
}

rmSync(out, { recursive: true, force: true });
execFileSync(
  resolve(frontend, "node_modules/.bin/vite"),
  ["build", "--base", BASE, "--outDir", out, "--emptyOutDir"],
  {
    cwd: frontend,
    stdio: "inherit",
    // Defaults point at Kong on localhost:8000; the mock answers those URLs.
    env: { ...process.env, VITE_API_BASE_URL: "http://localhost:8000/api", VITE_WS_BASE_URL: "ws://localhost:8000/api/notify" },
  },
);

copyFileSync(resolve(here, "mock-backend.js"), resolve(out, "mock-backend.js"));
const indexPath = resolve(out, "index.html");
const html = readFileSync(indexPath, "utf8").replace(
  "<head>",
  `<head>\n    <!-- Libretto: mock backend (demo data only). Must run before the theme script and the app. -->\n    <script src="${BASE}mock-backend.js"></script>`,
);
writeFileSync(indexPath, html);
console.log(`Conductor live embed written to ${out}`);
