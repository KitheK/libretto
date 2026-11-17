#!/usr/bin/env node
/** Copy canonical skills/scorecard → Cursor plugin, Claude, and Codex paths. */
import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "skills", "scorecard");
const dests = [
  join(root, "plugins", "scorecard", "skills", "scorecard"),
  join(root, ".claude", "skills", "scorecard"),
  join(root, ".agents", "skills", "scorecard"),
];

for (const dest of dests) {
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest, { recursive: true });
  console.log("synced", dest);
}
