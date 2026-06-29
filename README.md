# Libretto

*The blueprint to our capstone Canvas assistant.*

Personal documentation site (not affiliated with the course org). Animated technical manual documenting how the application was designed, built, and reviewed.
Every claim links to verifiable evidence in the capstone repository.

| | |
|---|---|
| **Repo** | [KitheK/libretto](https://github.com/KitheK/libretto) |
| **Live site** | TBD after Vercel deploy |
| **Evidence source** | [UBCO-COSC499-S2026/capstone-team-1](https://github.com/UBCO-COSC499-S2026/capstone-team-1) |
| **Design spec** | [docs/DESIGN.md](docs/DESIGN.md) |
| **Development plan** | [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) |

## Quick start

```bash
npm install
npm run sync:conductor   # optional — pulls read-only snapshots from capstone-team-1
npm run dev
```

## Fonts

Departure Mono v1.500 is bundled locally at `public/fonts/departure-mono/` (SIL OFL).
Use font sizes in **11px increments** per the typeface README.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local dev server |
| `npm run build` | Validate evidence + production build |
| `npm run validate` | Check evidence manifest and MDX references |
| `npm run sync:conductor` | Clone capstone branches into `.cache/` and snapshot to `content/_sources/` |

## Repository split

- **Capstone application** — code lives in `capstone-team-1`
- **Libretto** — this repo; site code, diagrams, evidence manifest only
