# Libretto — Design System
### A technical-manual style guide for Group 1's capstone documentation site

This system is reverse-engineered from screenshots of *Making Software* (makingsoftware.com) and adapted for **Libretto** — the blueprint site documenting our capstone Canvas assistant. The source treats software internals like an electronics teardown manual: blueprint diagrams, exploded-view illustrations, a reference-book typesetting system, and a dry, curious narrator.

All hex values are estimated by eye from the screenshots, not sampled with a color picker. Treat them as a strong starting palette, not ground truth — pull exact values once you have the real site open in a browser.

---

## 1. Color

| Token | Approx. hex | Use |
|---|---|---|
| `bg-paper` | `#FAFAFC` | Page background. Near-white, faint cool gray, never pure `#FFF`. |
| `bg-panel` | `#FCFCFE` | Diagram panel background (sits inside the dot grid). |
| `grid-dot` | `#E6E8F2` | The faint dot-grid texture, both ambient (whole page, very low opacity) and dense (inside diagram panels). |
| `ink` | `#19191D` | Body text, headings. Near-black, not pure black. |
| `ink-muted` | `#9A9CA8` | Secondary metadata — word counts, timestamps, captions. |
| `signal` | `#3548E8` | Primary brand blue. Wordmark, diagram line art, labels, links, active state. This is the one color allowed to feel loud. |
| `signal-mid` | `#7C8AEE` | Mid-tone fill for diagram volumes/solids (the "filled in" parts of a schematic). |
| `signal-pale` | `#DCE2FB` | Light tint for diagram fills, hover states, panel borders. |
| `hairline` | `#E4E6ED` | 1px borders, dividers, table rules. |

Rule: color is functional, not decorative. Blue means "this is a label, a line, or an interactive thing." Everything else is ink, muted gray, or paper. Don't introduce a second accent color — the restraint is the point.

---

## 2. Typography

**Libretto uses [Departure Mono](https://departuremono.com/) (SIL OFL) for everything** — wordmark, body, labels, and diagram captions. Font files are bundled locally at `public/fonts/departure-mono/`. Use sizes in **11px increments** per the typeface README.

| Role | Size | Weight | Notes |
|---|---|---|---|
| Wordmark | 66px (6×11) | regular | Departure Mono, `signal` |
| Hero meta (subtitle) | 22px (2×11) | regular | Departure Mono, right-aligned, `ink` |
| Chapter index header | 14px | regular | mono, uppercase, `signal` |
| Body | 22px (2×11) | regular | Departure Mono, justified, `ink` |
| Drop cap | 66px | regular | Departure Mono, `ink` |
| Figure tag | 11px | regular | mono, uppercase, rotated 90° or vertical |
| Caption / word count | 11px | regular | mono, `ink-muted` |

---

## 3. Layout

- **Canvas:** generous side margins, content max-width ~1400–1600px. The page is allowed to breathe — whitespace is doing structural work, not just padding.
- **Hero block:** asymmetric two-column split. Wordmark occupies the left ~60%, a small right-aligned serif meta block (one-line description + credit line) sits top-right. Below that, a full-width divider rule.
- **Divider rule:** a horizontal row of a single repeating glyph (e.g. a small diamond or checker symbol) spanning the full content width, in `hairline`/`signal-pale`. Use only between major sections — never as a casual `<hr>`.
- **Body sections:** alternate between 2-column (prose + diagram side by side) and 3-column (independent self-contained blocks, each with its own small diagram and caption) depending on whether a concept needs a paired explanation or a gallery of short ones.
- **Diagram panels:** bordered box (1px `hairline`), `bg-panel` fill with the dense dot grid, a vertical `FIG-XXX` tag running along the left edge (rotated text), and optionally a bracketed vertical caption on the right edge (e.g. `[ AGENT POOL ]`). Labels inside the diagram connect to parts via thin dashed leader lines, mono `signal` text.
- **Table of contents:** styled like a book index, not a sitemap. Header is serif (`Table of Contents.`) with a horizontal rule extending from it, plus a small mono nav cluster top-right (e.g. `PROGRESS · STATUS`). Below, a 3-column list: each chapter is a bold mono blue numbered header; sub-items are serif topic names connected by a dotted leader line to a mono gray word/status count on the right.

```
ASCII WIREFRAME — hero
┌─────────────────────────────────────────────┐
│ LIBRETTO               A guide to how Group 1│
│ [Departure Mono]       built it. — Group 1   │
│ ▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦│
│  H ave you ever wondered   [FIG-001 panel]   │
│  how a request routes between agents?         │
└─────────────────────────────────────────────┘
```

---

## 4. Diagrams (the signature element)

This is the one thing the whole site should be remembered for: every concept gets a hand-drawn-feeling technical schematic, not a stock icon or screenshot. Line-art illustration, `signal`/`signal-mid` ink on a `bg-panel` dot-grid, arrows and dashed leaders pointing to mono-labeled parts, a `FIG-XXX` tag identifying it like a part number in a service manual.

Treat the capstone application's real architecture as the "hardware" — draw the literal shape of things: how a request enters the system, how it gets routed between agents or services, what the data structures actually look like exploded into parts, the same way the source draws an exploded floppy disk. The diagrams should look like they could've been pulled from internal engineering notes, not generated as decoration after the fact.

---

## 5. Motion

Use sparingly and only where it earns its keep:
- Diagrams fade/slide in (8–12px, ~200ms) as their panel enters the viewport — once, not looping.
- No parallax, no scroll-jacking, no ambient background animation.
- Respect `prefers-reduced-motion` — diagrams should simply appear, no fallback animation substituted.

---

## 6. Voice and copy

Second person, curious, dry. Open sections with a question the reader has plausibly had ("Have you ever wondered how the agent decides which tool handles a request?"), then answer it plainly and briefly, then let a short flat sentence land the point ("Pretty neat.").

Don't write like documentation, write like someone explaining something they find genuinely interesting to a curious friend. Short paragraphs. No bullet-point feature lists in body copy — make the prose carry it. It's fine for the tone to be a little informal as long as the explanation underneath is accurate.

---

## 7. Content structure (template — fill in with real architecture)

```
Table of Contents.

1. WHAT LIBRETTO COVERS                   4. AGENTS AND ROUTING
   - The problem it solves.                  - How a request is dispatched.
   - The shape of a request.                 - Agent-to-agent handoff.

2. ARCHITECTURE                           5. DATA AND STATE
   - System overview.                        - What gets persisted.
   - Services and boundaries.                - How state moves between steps.

3. [fill in real chapter]                 6. [fill in real chapter]
```

Mirror the source's pattern: each top-level chapter is a system area, each sub-item is one focused question with its own short answer and (ideally) its own diagram.

---

## 8. Implementation notes

- Suggested free font stack: `Press Start 2P` (display), `PT Serif` or `Source Serif 4` (body), `JetBrains Mono` (labels) — all on Google Fonts, no licensing cost for a student project.
- Build the dot grid as a repeating SVG/CSS background-image, not individual DOM elements.
- Keep the pixel display font to true pixel-multiple sizes (it'll look blurry/fuzzy otherwise).
- Accessibility floor: visible keyboard focus states in `signal` blue, body text contrast checked against `bg-paper` (should clear AA easily at `#19191D` on `#FAFAFC`), reduced-motion respected per above.
