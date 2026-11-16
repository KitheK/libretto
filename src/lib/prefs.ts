export type ReadingFace = "serif" | "sans";

const KEYS = {
  reading: "libretto.reading",
  face: "libretto.face",
  sound: "libretto.sound",
} as const;

function readFlag(key: string, fallback: boolean): boolean {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return raw === "1" || raw === "true";
  } catch {
    return fallback;
  }
}

function writeFlag(key: string, value: boolean) {
  try {
    localStorage.setItem(key, value ? "1" : "0");
  } catch {
    /* private mode */
  }
}

export function getReadingMode(): boolean {
  return readFlag(KEYS.reading, false);
}

export function setReadingMode(on: boolean) {
  writeFlag(KEYS.reading, on);
}

export function getReadingFace(): ReadingFace {
  try {
    const raw = localStorage.getItem(KEYS.face);
    return raw === "sans" ? "sans" : "serif";
  } catch {
    return "serif";
  }
}

export function setReadingFace(face: ReadingFace) {
  try {
    localStorage.setItem(KEYS.face, face);
  } catch {
    /* private mode */
  }
}

export function getSoundEnabled(): boolean {
  return readFlag(KEYS.sound, true);
}

export function setSoundEnabled(on: boolean) {
  writeFlag(KEYS.sound, on);
}

export function applyDocumentPrefs(reading: boolean, face: ReadingFace) {
  const root = document.documentElement;
  root.classList.toggle("reading", reading);
  root.classList.toggle("font-sans", face === "sans");
  root.classList.toggle("font-serif", face === "serif");
  root.dataset.reading = reading ? "on" : "off";
  root.dataset.face = face;
}
