# Scorecard Design Spec

Nov 16, 2026 · Frozen from Kithe’s Scorecard Project Plan.

## Purpose

Cursor Agent Skill + kit that generates a descriptive project site (what was built, what works, what doesn’t, how to run it). Never grades. Works for personal, coursework, hackathon, team, work, OSS, research.

## Locked decisions

- Descriptive only; optional requirements map without grades
- No AI-assistance disclosure
- Launcher: `npx scorecard dev` (and build/export/refresh/check)
- Paleologue + Nouveau bundled with licences
- Write mode local JSON under `content/`; production read-only
- Sizes: Lite | Standard | Full
- Provenance on every claim; agent cannot set `confirmed`

## Sizes

| Size | Contents |
|------|----------|
| Lite | Scorecard page + Run + 2–3 sections; no chapters |
| Standard | + 4–6 chapters; plates when evidenced |
| Full | Libretto-style manual + architecture + timeline + live slot |

## Interview

Stages A–E as in the project plan. Infer first; batches of 3–5; depth Quick/Standard/Deep; save to `interview.json`.

Stage E shown via linked local specimens + optional look gallery; Write Look panel is primary visual UX.

## Content files

`scorecard.json`, `run.json`, `decisions.json`, `requirements.json`, `team.json`, `interview.json`, `manual.json`, `stack.json`, `apis.json`, `architecture.json`, `branches.json`, `theme.json` — each with `schemaVersion`, provenance rules.

## Module gating

See `skills/scorecard/references/project-profiles.md`.

## Launcher

`dev` · `build` · `export` · `refresh` · `check` — Node prerequisite documented.

## Out of scope v1

Hosted CMS, scoring, AI disclosure, perfect dep graphs, auto demos, Write on prod, custom fonts, desktop wrapper.
