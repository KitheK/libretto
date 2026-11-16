// Plain JS so the asset checks can use node:fs without adding @types/node to the typecheck.
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { chapters } from "./manual";
import { clipById, clips, LIVE_ENTRY } from "./live";
import { liveShots, shotById } from "./shots";

const pub = (path) => resolve(dirname(fileURLToPath(import.meta.url)), "../../public", path.replace(/^\//, ""));

describe("live Conductor", () => {
  it("ships the real frontend with the mock backend loaded first", () => {
    const html = readFileSync(pub(LIVE_ENTRY), "utf8");
    const mock = html.indexOf("mock-backend.js");
    expect(mock).toBeGreaterThan(-1);
    expect(mock).toBeLessThan(html.indexOf("canvas-ai-theme"));
    expect(existsSync(pub("/live/conductor/mock-backend.js"))).toBe(true);
  });

  it("has every clip's webm, gif, and poster, and says so when data is mock", () => {
    for (const clip of clips) {
      for (const file of [clip.webm, clip.gif, clip.poster]) expect(existsSync(pub(file)), file).toBe(true);
      expect(clip.caption.toLowerCase()).toMatch(/mock|recorded live/);
    }
  });

  it("has light and dark captures for every live shot", () => {
    for (const shot of liveShots) {
      expect(existsSync(pub(shot.src)), shot.src).toBe(true);
      expect(existsSync(pub(shot.srcDark || "")), shot.srcDark).toBe(true);
      expect(shot.caption).toContain("Mock data");
    }
  });

  it("only points chapters at clips and shots that exist", () => {
    for (const chapter of chapters) {
      for (const block of chapter.blocks) {
        if (block.type === "motion") expect(clipById(block.id), block.id).toBeDefined();
        if (block.type === "shot") expect(shotById(block.id), block.id).toBeDefined();
      }
    }
  });
});
