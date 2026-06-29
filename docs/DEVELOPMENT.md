# Libretto — Development Plan

> **For agentic workers:** Use superpowers:subagent-driven-development or superpowers:executing-plans for phased execution. Checkboxes track progress.

**Goal:** Build **Libretto** (*the blueprint to Conductor*) in this repository, with every claim backed by direct links to evidence in [UBCO-COSC499-S2026/capstone-team-1](https://github.com/UBCO-COSC499-S2026/capstone-team-1).

**Product:** Conductor (lives in capstone-team-1)  
**Site:** Libretto (this repo)  
**Typography:** [Departure Mono](https://departuremono.com/)  
**Design spec:** [DESIGN.md](./DESIGN.md)

**Status:** Phase 0a complete (repo created). Phase 0b (capstone cross-link) **deferred** — do not modify capstone-team-1 until explicitly requested.

---

## Repository layout

```
libretto/                          # repo root = site
  package.json
  astro.config.mjs
  README.md
  .env.example
  scripts/
    sync-conductor.sh              # clone capstone → .cache/conductor
    validate-evidence.mjs          # fail build if manifest IDs broken
  evidence/
    manifest.yaml                  # EV-001 … EV-NNN → GitHub URLs
  content/
    _sources/                      # gitignored snapshots from sync
    chapters/*.mdx
  src/
    components/
      evidence/Evidence.tsx
      diagrams/BlueprintFigure.tsx
      layout/SiteShell.astro
    data/timeline.yaml
    pages/
  docs/
    DESIGN.md
    DEVELOPMENT.md                 (this file)
  .github/workflows/ci.yml
  vercel.json
```

---

## Phase 0 — Repository bootstrap

### Task 0a: Create Libretto repository ✅

- [x] Create `UBCO-COSC499-S2026/libretto` on GitHub
- [x] Clone locally; add README, design spec, development plan
- [x] Bootstrap Astro 5 + React + MDX at repo root

### Task 0b: Cross-link from capstone-team-1 ⏸ DEFERRED

**Do not execute until the team asks.** When ready, a single PR to capstone `development`:

- Modify `README.md` — add "Libretto — project blueprint" section with repo + live URL
- Modify `docs/TOC.md` — add "External: Libretto blueprint site"

No `website/` folder or Vercel config in capstone-team-1.

---

## Phase 1 — Site foundation

### Task 1: Scaffold Astro ✅

### Task 2: Departure Mono + SiteShell ✅

### Task 3: Evidence component + manifest ✅

### Task 4: Sync conductor repo (read-only) ✅

### Task 5: MDX chapters + diagram primitives 🔄

---

## Phase 2 — Chapters with mandatory evidence (Tasks 6–12)

Each task adds manifest entries and writes MDX prose. Sync `content/_sources/` before quoting file contents.

### Task 6: `01-mission` + `02-requirements`

**Sources:** `content/_sources/docs/charter/`, `content/_sources/docs/plan/`

**Evidence to add:**
- EV-001 mission, EV-002 vision, EV-003 team members
- EV-004 project_planning.md personas

### Task 7: `03-architecture` + FIG_001

**Evidence:**
- EV-010 docker-compose.yaml
- EV-011 kong.yaml
- EV-012 SystemArchitecture.md
- EV-013 component_diagram.md

**Figure:** Animated service topology (frontend → Kong → microservices → Postgres/Redis/ClickHouse)

### Task 8: `04-data-flows`

**Evidence:**
- EV-020 App.tsx routes
- EV-021 auth canvas connect routes
- EV-022 frontend API client
- DFD PNGs from Documents branch

### Task 9: `05-database`

**Evidence:** EV-030 DATABASE.md, EV-031 ER diagram PNG

### Task 10: `06-ui`

**Evidence:** EV-040 Figma.md, EV-041 Frontend_Requirements.md

### Task 11: `07-agent`

**Evidence:**
- EV-050 canvas.proto
- EV-051 tool registry
- Issues #247, #248, #307

### Task 12: `08-canvas-bridge`

**Evidence:**
- EV-060 canvas_api.md
- EV-061 LOCAL_CANVAS.md
- EV-229 issue

---

## Phase 3 — Process & history (Tasks 13–14)

### Task 13: `09-dev-process` + FIG_010–011

**Claims → 2 approvals for `development` merges
- ≤200 LOC backend PRs
- Issue templates in `.github/ISSUE_TEMPLATE/`
- Per-service CI in `.github/workflows/`
- Week X.Y sprint labels

**Evidence table in manifest** — one entry per claim, linked to charter §10.1 and workflow files.

### Task 14: `10-history` + FIG_012

**File:** `src/data/timeline.yaml`

```yaml
- week: 6
  title: Dashboard + Canvas connection
  evidence:
    - id: EV-145   # example issue
    - id: EV-229
```

**Figure:** Scroll-driven timeline with nodes linking to issues/PRs.

---

## Phase 4 — Deploy (Tasks 15–17)

### Task 15: Landing page polish

- Hero: Libretto wordmark + Conductor one-liner
- Prominent link to Conductor GitHub repo
- "All evidence lives in the capstone repository" callout
- Chapter grid with completion badges

### Task 16: Accessibility

- `prefers-reduced-motion` for diagram animations
- Focusorporate/outlines on evidence chips and figures
- Keyboard nav for chapter index
-Color contrast on `#f4f1ea` paper

### Task 17: Vercel + CI

- `vercel.json` — static output `dist/`
- `.github/workflows/ci.yml` — `npm run validate` → `npm run build`
- Connect Vercel to `UBCO-COSC499-S2026/libretto`
- After first deploy: update README live URL; **then** optionally execute Task 0b

---

## Workflow

```text
capstone-team-1 (Conductor)          libretto (this repo)
├── app/                             ├── sync-conductor.sh ──read──► capstone repo
├── docs/ (Documents branch)         ├── content/_sources/ (snapshots)
├── .github/workflows/                 ├── evidence/manifest.yaml ──links──► GitHub URLs
└── (no Libretto link yet)      ├── MDX chapters + SVG diagrams
                                       └── Vercel deploy
```

---

## Effort estimate

| Phase | Days | Status |
|-------|------|--------|
| 0 — Repo bootstrap | 0.5 | ✅ Done |
| 1 — Foundation + evidence | 2 | 🔄 Stubs in place; chapters need content |
| 2 — Chapters 1–8 | 3–4 | ⏳ |
| 3 — Process + history | 2 | ⏳ |
| 4 — Deploy | 0.5 | ⏳ |
| **Total** | **8–9 days** | |

---

## Spec coverage

| Requirement | Task |
|-------------|------|
| Separate repo | 0a ✅ |
| Evidence links to capstone-team-1 | 3, 6–14 |
| No deploy in capstone repo | 0b deferred |
| Departure Mono + branding | 2 |
| Animated SVG ≥12 | 5, 7–14 |
| Appendix `/appendix/evidence` | 3, 17 |

---

## Next actions

1. Finish Task 2 (SiteShell + global styles) if not complete
2. Expand `evidence/manifest.yaml` as each chapter is written
3. Run `npm run sync:conductor` before quoting source files in MDX
4. Do **not** open capstone README PR until Phase 4 deploy URL exists
