---
name: scorecard
description: >
  Use when asked to summarise, document, present, or build a Scorecard / project
  manual / diary site for what a repository built; when the user wants Lite,
  Standard, or Full descriptive docs with Write mode; or when scaffolding a
  scorecard app from an interview. Also use when they mention provenance,
  built-vs-borrowed, or npx scorecard.
---

# Scorecard

Descriptive project manuals only. Never grade. Never invent metrics or contributions. Never set `provenance: confirmed` (only the author via Write mode).

## Hard rules

- Infer first, ask second (confirm-or-correct).
- Batches of 3–5 questions; skip is valid → tag `draft` / `inferred`.
- Content is JSON under `content/`, never hand-written `manual.ts`.
- Honour “no ornaments” via the **plain** scheme — do not abandon the kit for Inter.
- “Just fill it in, I trust you” → still `draft`.
- Re-runs update only `generated`; propose diffs for `authored`.
- Run redaction before writing files; env **names** only, never values.

## Ordered workflow

1. Stage A (profile) — see `interview.md`
2. Bounded repo scan — see `references/analysis.md`
3. Stages B–D at chosen depth
4. Stage E look & feel — link specimens / `npx scorecard look`; or E6 defaults
5. Propose size Lite|Standard|Full; apply module gates from `references/project-profiles.md`
6. Scaffold / fill `scorecard/` kit; write `theme.json`
7. Fill content JSON with provenance tags
8. Redaction pass + `npx scorecard check`
9. Hand off: `npx scorecard dev` → Write mode

## References

- `interview.md`
- `references/schema.md`
- `references/theme-presets.md`
- `references/project-profiles.md`
- `references/analysis.md`
