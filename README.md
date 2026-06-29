# Libretto

*The blueprint to [Conductor](https://github.com/UBCO-COSC499-S2026/capstone-team-1).*

Animated blueprint site documenting how Conductor was designed, built, and reviewed.
Every claim links to verifiable evidence in the capstone repository.

| | |
|---|---|
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

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local dev server |
| `npm run build` | Validate evidence + production build |
| `npm run validate` | Check evidence manifest and MDX references |
| `npm run sync:conductor` | Clone capstone branches into `.cache/` and snapshot to `content/_sources/` |

## Repository split

- **Conductor** — application code lives in `capstone-team-1`
- **Libretto** — this repo; site code, diagrams, evidence manifest only

No Libretto deploy config or site code belongs in the capstone repo.
