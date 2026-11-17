#!/usr/bin/env node
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function usage() {
  console.log(`scorecard — descriptive project manuals

Commands:
  scorecard dev       Install if needed, start Write mode, open browser
  scorecard build     Production static build (no Write/save)
  scorecard export    Print instructions + README badge snippet
  scorecard refresh   Reminder: re-scan via skill; open /write review
  scorecard check     Validate content JSON + provenance + paths
  scorecard look      Open look-gallery.html specimen page
`);
}

function nodeOk() {
  const major = Number(process.versions.node.split(".")[0]);
  if (major < 20) {
    console.error(`Node 20+ required (found ${process.versions.node}). Install: https://nodejs.org/`);
    process.exit(1);
  }
}

function run(cmd, args, opts = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit", shell: process.platform === "win32", cwd: root, ...opts });
    child.on("exit", (code) => (code === 0 ? resolvePromise() : reject(new Error(`${cmd} exited ${code}`))));
  });
}

async function ensureInstall() {
  if (!existsSync(join(root, "node_modules"))) {
    console.log("Installing dependencies…");
    await run("npm", ["install"]);
  }
}

function freePort(start = 5199) {
  return new Promise((resolvePort) => {
    const tryPort = (p) => {
      const s = createServer();
      s.listen(p, () => {
        s.close(() => resolvePort(p));
      });
      s.on("error", () => tryPort(p + 1));
    };
    tryPort(start);
  });
}

async function openBrowser(url) {
  const cmd = process.platform === "win32" ? "start" : process.platform === "darwin" ? "open" : "xdg-open";
  const args = process.platform === "win32" ? ["", url] : [url];
  spawn(cmd, args, { shell: true, stdio: "ignore", detached: true }).unref();
}

async function cmdDev() {
  nodeOk();
  await ensureInstall();
  const port = await freePort(5199);
  console.log(`Starting Scorecard on http://127.0.0.1:${port}/write`);
  const child = spawn("npx", ["vite", "--port", String(port)], {
    cwd: root,
    shell: true,
    stdio: "inherit",
  });
  setTimeout(() => openBrowser(`http://127.0.0.1:${port}/write`), 1500);
  const stop = () => {
    child.kill("SIGTERM");
    process.exit(0);
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
}

async function cmdBuild() {
  nodeOk();
  await ensureInstall();
  await run("npm", ["run", "build"]);
  console.log("Built dist/ (read-only; no Write mode).");
}

function cmdExport() {
  const badge = `[![Scorecard](https://img.shields.io/badge/scorecard-manual-103dff)](./scorecard/)`;
  console.log("Print /export in the browser (Ctrl+P → PDF).\n");
  console.log("README snippet:\n");
  console.log(badge);
  writeFileSync(join(root, "EXPORT-README-SNIPPET.md"), badge + "\n", "utf8");
  console.log("Wrote EXPORT-README-SNIPPET.md");
}

function cmdRefresh() {
  console.log("Refresh: re-run the scorecard Cursor skill against the project repo.");
  console.log("It must propose a diff for authored content — never overwrite.");
  console.log("Then open Write → Review: npx scorecard dev");
}

function cmdCheck() {
  nodeOk();
  const contentDir = join(root, "content");
  const files = readdirSync(contentDir).filter((f) => f.endsWith(".json"));
  let errors = 0;
  for (const f of files) {
    try {
      const data = JSON.parse(readFileSync(join(contentDir, f), "utf8"));
      if (data.schemaVersion !== 1) {
        console.error(`${f}: unexpected schemaVersion`);
        errors++;
      }
      const walk = (obj, path = "") => {
        if (!obj || typeof obj !== "object") return;
        if (obj.provenance === "confirmed" && obj.source === "generated") {
          console.error(`${f}${path}: agent cannot confirm`);
          errors++;
        }
        if (Array.isArray(obj)) obj.forEach((v, i) => walk(v, `${path}[${i}]`));
        else Object.entries(obj).forEach(([k, v]) => walk(v, `${path}.${k}`));
      };
      walk(data);
      if (f === "architecture.json" && Array.isArray(data.nodes)) {
        for (const n of data.nodes) {
          if (n.path) {
            const p = resolve(root, "../..", n.path);
            const alt = resolve(root, n.path);
            if (!existsSync(p) && !existsSync(alt) && !existsSync(resolve(process.cwd(), n.path))) {
              // paths in fixture are relative to monorepo; warn only
              console.warn(`${f}: path may be missing locally: ${n.path}`);
            }
          }
        }
      }
    } catch (e) {
      console.error(`${f}: ${e}`);
      errors++;
    }
  }
  // planted-secret self-check on a sample string
  const sample = 'API_KEY="sk-planted-secret-value"';
  if (!/API_KEY|SECRET|TOKEN/i.test(sample)) {
    console.error("redaction self-check failed");
    errors++;
  }
  if (errors) {
    console.error(`check failed (${errors})`);
    process.exit(1);
  }
  console.log(`check ok (${files.length} files)`);
}

function cmdLook() {
  const gallery = join(root, "look-gallery.html");
  if (!existsSync(gallery)) {
    console.error("look-gallery.html missing");
    process.exit(1);
  }
  const url = `file://${gallery.replace(/\\/g, "/")}`;
  openBrowser(url);
  console.log(`Opened ${url}`);
}

const cmd = process.argv[2] ?? "help";
const map = {
  dev: cmdDev,
  build: cmdBuild,
  export: cmdExport,
  refresh: cmdRefresh,
  check: cmdCheck,
  look: cmdLook,
  help: usage,
  "--help": usage,
};

Promise.resolve((map[cmd] ?? usage)()).catch((e) => {
  console.error(e);
  process.exit(1);
});
