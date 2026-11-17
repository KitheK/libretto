# Scorecard

Descriptive project manuals — what was built, what works, what doesn’t, how to run it. **Never a grade.**

## Setup once

```bash
cd scorecard
npm install
npx scorecard check
npx scorecard dev
```

Opens Write mode. Edit prose, Look, and Review in the browser. Publishing:

```bash
npx scorecard build
```

## Commands

| Command | Purpose |
|---------|---------|
| `npx scorecard dev` | Dev server → `/write` |
| `npx scorecard build` | Static `dist/` (read-only) |
| `npx scorecard export` | PDF via `/export` + README badge snippet |
| `npx scorecard refresh` | Reminder to re-scan via the Cursor skill |
| `npx scorecard check` | Validate JSON + provenance |
| `npx scorecard look` | Specimen gallery for Stage E |

## Cursor skill

Use `skills/scorecard` for the interview → scan → scaffold workflow.

## Content

JSON under `content/`. Write mode saves through a **dev-only** allowlisted endpoint. Production builds have no save API.

## Design

Paleologue fonts + Nouveau ornaments. Choose scheme/ornaments in the skill (Stage E) or Write → Look. `plain` turns ornaments off.

## Licence note

See `LICENSES/`. Record final public licences before release.
