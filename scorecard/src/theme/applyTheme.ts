import type { ThemeJson } from "../lib/schemas";

const DISPLAY: Record<ThemeJson["fonts"]["display"], string> = {
  paleologue: '"Libretto Paléologue", Georgia, serif',
  "paleologue-poster": '"Libretto Paléologue Poster", "Libretto Paléologue", Georgia, serif',
};

export function applyTheme(theme: ThemeJson) {
  const root = document.documentElement;
  root.style.setProperty("--canvas", theme.tokens.canvas);
  root.style.setProperty("--ink", theme.tokens.ink);
  root.style.setProperty("--action", theme.tokens.action);
  root.style.setProperty("--rule", theme.tokens.rule);
  root.style.setProperty("--muted", theme.tokens.muted);
  root.style.setProperty("--font-display", DISPLAY[theme.fonts.display]);
  root.style.setProperty("--font-body", '"Newsreader", Georgia, serif');
  root.style.setProperty("--font-ui", '"Source Sans 3", system-ui, sans-serif');
  root.style.setProperty("--font-mono", '"Departure Mono", ui-monospace, monospace');
  root.dataset.scheme = theme.scheme;
  root.dataset.tone = theme.tone;
  root.dataset.ornamentPalette = theme.ornaments.ornamentPalette;
}
