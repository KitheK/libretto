import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  applyDocumentPrefs,
  getReadingFace,
  getReadingMode,
  getSoundEnabled,
  setReadingFace,
  setReadingMode,
  setSoundEnabled,
} from "./prefs";

const memory = new Map<string, string>();
const classes = new Set<string>();
const dataset: Record<string, string> = {};

beforeEach(() => {
  memory.clear();
  classes.clear();
  for (const key of Object.keys(dataset)) delete dataset[key];

  vi.stubGlobal("localStorage", {
    getItem: (key: string) => memory.get(key) ?? null,
    setItem: (key: string, value: string) => {
      memory.set(key, value);
    },
    removeItem: (key: string) => {
      memory.delete(key);
    },
    clear: () => memory.clear(),
    key: () => null,
    get length() {
      return memory.size;
    },
  });

  vi.stubGlobal("document", {
    documentElement: {
      classList: {
        toggle: (name: string, force?: boolean) => {
          if (force === undefined) {
            if (classes.has(name)) classes.delete(name);
            else classes.add(name);
            return;
          }
          if (force) classes.add(name);
          else classes.delete(name);
        },
        contains: (name: string) => classes.has(name),
        remove: (...names: string[]) => {
          for (const name of names) classes.delete(name);
        },
      },
      dataset,
    },
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("prefs", () => {
  it("persists reading mode, face, and sound", () => {
    setReadingMode(true);
    setReadingFace("sans");
    setSoundEnabled(false);
    expect(getReadingMode()).toBe(true);
    expect(getReadingFace()).toBe("sans");
    expect(getSoundEnabled()).toBe(false);
  });

  it("applies classes on the document element", () => {
    applyDocumentPrefs(true, "sans");
    expect(document.documentElement.classList.contains("reading")).toBe(true);
    expect(document.documentElement.classList.contains("font-sans")).toBe(true);
    expect(document.documentElement.dataset.reading).toBe("on");
    expect(document.documentElement.dataset.face).toBe("sans");
  });
});
