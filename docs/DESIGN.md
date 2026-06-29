# Libretto — Design Spec

**Site name:** **Libretto** — *the blueprint to our capstone Canvas assistant*  
**Product:** Capstone application (`capstone-team-1` / `app/`) — agentic AI for instructors to manage Canvas courses via natural language  
**Source of truth (evidence):** [UBCO-COSC499-S2026/capstone-team-1](https://github.com/UBCO-COSC499-S2026/capstone-team-1)  
**Libretto repository:** [KitheK/libretto](https://github.com/KitheK/libretto) (personal project)  
**Course:** UBCO COSC499 S2026 (Summer)  
**Inspiration:** [Making Software](https://www.makingsoftware.com/)  
**Typography:** [Departure Mono](https://departuremono.com/) (SIL OFL)

---

## Repository split

| Repo | Contains | Does NOT contain |
|------|----------|------------------|
| **capstone-team-1** | Capstone application (`app/`), course docs, CI for services | Libretto site code, Vercel config, animated diagrams |
| **libretto** | Astro site, MDX chapters, SVG diagrams, evidence manifest, sync scripts | Capstone service source code |

**Cross-linking:** When ready, capstone `README.md` gets a single line linking to the deployed Libretto URL and this repo. No `website/` folder in capstone-team-1.

---

## Evidence-first content model

Every factual claim on Libretto must link to **verifiable evidence** in capstone-team-1. Libretto explains; the capstone repo proves.

### Evidence types

| Type | Link pattern | Example |
|------|--------------|---------|
| **File** | `https://github.com/UBCO-COSC499-S2026/capstone-team-1/blob/{branch}/{path}#L{line}` | Kong config line 12 |
| **File range** | `#L10-L25` | docker-compose services block |
| **Issue** | `https://github.com/UBCO-COSC499-S2026/capstone-team-1/issues/{n}` | #229 Canvas infra |
| **Pull request** | `https://github.com/UBCO-COSC499-S2026/capstone-team-1/pull/{n}` | #307 agent stack |
| **Commit** | `https://github.com/UBCO-COSC499-S2026/capstone-team-1/commit/{sha}` | gRPC refactor |
| **Branch** | `.../tree/{branch}` | `Documents`, `backend/agent-react-orchestrator` |

### UI pattern — `Evidence` block

Each section ends with one or more evidence chips:

```
┌─ EVIDENCE ─────────────────────────────────────────────┐
│ charter.md · §10.1 Pull Request Standards                │
│ ↳ github.com/.../charter.md?ref=Documents#L…             │
└──────────────────────────────────────────────────────────┘
```

Rendered as monospace Departure Mono footer under prose, with external-link icon.

### Evidence manifest

`evidence/manifest.yaml` maps stable IDs to URLs:

```yaml
EV-001:
  label: "Mission statement"
  url: https://github.com/UBCO-COSC499-S2026/capstone-team-1/blob/Documents/docs/charter/charter.md#21-mission-statement
EV-042:
  label: "Kong auth route"
  url: https://github.com/UBCO-COSC499-S2026/capstone-team-1/blob/development/app/infrastructure/api_gateway/config/kong.yaml#L14-L22
```

MDX chapters reference `EV-042` inline; build validates all IDs resolve.

### Sync strategy

At build time (local + CI):

1. `scripts/sync-conductor.sh` shallow-clones capstone-team-1 into `.cache/conductor/` (gitignored)
2. Fetches branches `development` and `Documents`
3. Copies read-only snapshots to `content/_sources/` for MDX quotes and image assets

**No write access** to capstone repo from Libretto automation.

---

## Naming

| Name | Use |
|------|-----|
| **Capstone application** | Product (`capstone-team-1` / `app/`) |
| **Libretto** | Blueprint website (this repo + deploy URL) |
| Tagline | *The blueprint to our capstone Canvas assistant* |

---

## Site purpose

1. **What** the application is — with charter/plan evidence  
2. **How** it was designed — architecture, flows, UI — linked to design docs + code  
3. **How** the team builds it — PR/CI process — linked to charter + `.github/`  
4. **When** — timeline — linked to weekly logs + issues/PRs  

Tone: technical manual (Making Software). Libretto is annotated commentary; capstone repo is the primary source.

---

## Visual language — Departure Mono

- `@import url("https://departuremono.com/mono.css");`
- 11px grid sizing; warm paper `#f4f1ea`; accent `#3D4EE8`
- FIG labels: `FIG_001` in Departure Mono

---

## Information architecture

| Route | Chapter |
|-------|---------|
| `/` | Landing |
| `/chapters/01-mission` | Mission & vision |
| `/chapters/02-requirements` | Requirements & personas |
| `/chapters/03-architecture` | System architecture |
| `/chapters/04-data-flows` | Data flows & API paths |
| `/chapters/05-database` | Database & ER |
| `/chapters/06-ui` | UI / Figma |
| `/chapters/07-agent` | Agentic service |
| `/chapters/08-canvas-bridge` | Canvas integration |
| `/chapters/09-dev-process` | Dev process & CI |
| `/chapters/10-history` | Project timeline |
| `/appendix/evidence` | Full evidence manifest |
| `/appendix/sources` | Synced source index |

Target: ≥12 animated SVG figures (`FIG_001` …).

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Astro 5 + MDX + React islands |
| Fonts | Departure Mono |
| Evidence | YAML manifest + `<Evidence id="EV-042" />` component |
| Sync | `scripts/sync-conductor.sh` → `.cache/conductor/` |
| CI | lint, validate evidence, build |
| Deploy | Vercel connected to **libretto repo only** |

---

## Success criteria

- [ ] Libretto lives in **separate repo**; zero deploy config in capstone-team-1  
- [ ] Every chapter section has ≥1 evidence link to capstone-team-1  
- [ ] Evidence manifest validates at build time (no broken IDs)  
- [ ] Departure Mono + Libretto branding  
- [ ] ≥12 animated SVG figures  
- [ ] Evaluator can verify any claim by clicking through to GitHub  

---

Implementation plan: [docs/DEVELOPMENT.md](./DEVELOPMENT.md)
