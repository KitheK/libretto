# Scorecard

**Descriptive project manuals for any codebase.**  
What was built, what works, what doesn’t, and how to run it — in about two minutes on the Scorecard page. **Never a grade.**

Scorecard is two things that ship together:

1. **A site kit** (`scorecard/`) — Vite + React app driven by JSON content, with local **Write mode** so authors edit like a diary, not a coding project.
2. **An agent skill** — interview → bounded repo scan → scaffold → provenance-tagged content → `npx scorecard dev`. Packaged for **Cursor**, **Claude Code**, and **Codex**.

Libretto (this monorepo’s Conductor manual) is the **first full Scorecard-shaped site**: the design language, plate grammar, and honesty rules were proven there, then generalized into this kit so other projects get the same kind of manual without starting from scratch.

---

## How Libretto was built from Scorecard

Chronologically, Libretto came first as a handmade Vite manual for COSC 499 / Conductor. It established the patterns Scorecard now packages:

| Libretto pattern | Scorecard generalization |
|------------------|--------------------------|
| Essay home + chapters + plates | Lite / Standard / Full sizes |
| Interactive architecture (`FIG_*`) + stack copy | `architecture.json` + `stack.json` (path-validated) |
| Branch river / history plate | Timeline forms: river · build-log · hourly |
| Live desk + motion | Optional live/demo slots when a build exists |
| Paleologue + Nouveau ornaments | `theme.json` + Stage E / Write → Look |
| Author voice in prose | Write mode over JSON (no hand-edited TypeScript) |

**Scorecard is the productized path.** A new project should not fork Libretto and delete Conductor chapters. Instead:

1. Run the **scorecard** skill against *that* repo.
2. Confirm interview answers (infer-first, confirm-or-correct).
3. Scaffold the kit, fill `content/*.json` with provenance tags.
4. Finish in Write mode; publish with `npx scorecard build`.

Libretto remains the reference **Full** manual and the living example linked from [`/make`](../src/components/MakeYourOwnPage.tsx) on the deployed site. Scorecard is what you use to make the next one.

---

## What a Scorecard site always says

On the home **Scorecard page**:

- **The job** — one sentence, what it does and for whom  
- **Brief and outcome** — intent vs what shipped  
- **Status per feature** — works / partial / stubbed / cut (+ biggest gap)  
- **Built vs borrowed** — authored work vs libraries, templates, APIs, starter code  
- **Proof** — demo, screenshot, test, or metric  
- **Run it** — setup + a 60-second demo script  
- **Next** — what you’d do with more time  

Everything else (architecture plate, APIs, timeline, decisions, requirements map, team, live demo) is **gated on evidence** or an explicit opt-in so a weekend hackathon never gets an empty branch history.

### Sizes

| Size | For | Shape |
|------|-----|--------|
| **Lite** | Hackathons, small assignments, scripts | One page. No chapters. |
| **Standard** | Most projects | Scorecard + Run + 4–6 chapters; plates only when evidenced |
| **Full** | Long-lived / multi-service | Libretto-scale: chapters, architecture, decisions, timeline, live slot |

---

## Honesty: provenance

Every claim carries:

| Field | Values | Meaning |
|-------|--------|---------|
| `provenance` | `confirmed` · `inferred` · `draft` | Author-verified · evidence-backed · unreviewed agent text |
| `source` | `generated` · `authored` | Skill-produced; Write mode flips to `authored` |

**Rules**

- Only the **author**, via Write → Review → Confirm, can set `confirmed`.
- The agent **never** promotes to `confirmed` — including “just fill it in, I trust you” (stays `draft`).
- `inferred` needs an `evidence` pointer (file path or commit).
- Re-runs update only `generated` items; `authored` content gets a proposed diff, never a silent overwrite.
- No invented contributions, metrics, or test results.

---

## Setup once (kit)

Requires **Node 20+**.

```bash
cd scorecard
npm install
npx scorecard check
npx scorecard dev
```

Opens the browser at **Write mode** (`/write`).

| Command | Purpose |
|---------|---------|
| `npx scorecard dev` | Install if needed, free port, open `/write` |
| `npx scorecard build` | Static `dist/` — **no** Write / save endpoint |
| `npx scorecard export` | Printable `/export` + README badge snippet |
| `npx scorecard refresh` | Reminder to re-scan via the skill (diff for authored) |
| `npx scorecard check` | Schema + provenance + path sanity |
| `npx scorecard look` | Local specimen gallery for Stage E |

Deploy `dist/` anywhere static (Cloudflare Pages/Workers assets, Netlify, Vercel, GitHub Pages). Edits always happen locally, then rebuild.

---

## Content model

JSON under `content/` (never hand-maintained TypeScript modules):

| File | Role |
|------|------|
| `scorecard.json` | Job, brief, outcome, features, built/borrowed, proof, next |
| `run.json` | Setup steps, env **names** (never values), demo script |
| `decisions.json` | Decisions, dead ends, lessons |
| `requirements.json` | Optional rubric map — **no grades** |
| `team.json` | Optional contributors |
| `interview.json` | Saved profile answers (re-runs don’t re-ask) |
| `manual.json` | Parts, chapters, blocks |
| `stack.json` / `apis.json` / `architecture.json` / `branches.json` | Plates |
| `theme.json` | Scheme, fonts, ornaments, tone |

Write mode saves through a **dev-only** allowlisted `POST /__scorecard/save`. Production builds are read-only.

---

## Look and feel

Bundled **Paleologue** (+ Poster), Newsreader, Source Sans 3, Departure Mono, and **Nouveau** ornaments (plates 30 / 33 / 01 / 46).

Chosen in skill **Stage E** (linked specimens / `npx scorecard look`) or later in Write → **Look**:

- Schemes: `libretto` · `plate` · `poster` · `plain` (no ornaments) · `custom`
- Ornament slots: plate frame, demo frame, foot frieze, rail — each can be `none`

See `LICENSES/` before a public release; record final font/ornament licences.

---

## Agent skill (Cursor · Claude · Codex)

Same workflow everywhere. Canonical instructions: [`skills/scorecard/`](../skills/scorecard/).

### Ordered workflow

1. Stage A — project profile  
2. Bounded repo scan  
3. Stages B–D at Quick / Standard / Deep  
4. Stage E — look & feel  
5. Size + module gates  
6. Scaffold kit + `theme.json`  
7. Fill JSON with provenance  
8. Redaction + `scorecard check`  
9. `npx scorecard dev` → Write mode  

### Install by agent

| Agent | Path in this repo | How to use |
|-------|-------------------|------------|
| **Cursor** | `skills/scorecard/` + marketplace plugin under `plugins/scorecard/` | Invoke the **scorecard** skill, or install the plugin (see below) |
| **Claude Code** | `.claude/skills/scorecard/` | `/scorecard` or auto-load from description |
| **Codex** | `.agents/skills/scorecard/` | `$scorecard` or `/skills` picker |

### Cursor Marketplace

Plugin package: [`plugins/scorecard/`](../plugins/scorecard/).

1. Test locally: copy or symlink `plugins/scorecard` → `~/.cursor/plugins/local/scorecard`, then **Developer: Reload Window**.  
2. Push this repo (or a public plugin repo) to GitHub.  
3. Submit at [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish) (official review).  
4. Optional community listing: [cursor.directory/plugins/new](https://cursor.directory/plugins/new).

Checklist and manifest notes: [`plugins/scorecard/README.md`](../plugins/scorecard/README.md).

### Claude Code

```bash
# Project-scoped (already in this repo)
# .claude/skills/scorecard/SKILL.md

# Or personal
cp -r .claude/skills/scorecard ~/.claude/skills/
```

### Codex

```bash
# Project-scoped (already in this repo)
# .agents/skills/scorecard/SKILL.md

# Or personal
cp -r .agents/skills/scorecard ~/.agents/skills/
```

---

## Interview (short map)

- **A** — kind, builders, purpose, reader goal, scale, depth  
- **B** — job, brief, honest status, built/borrowed, hard problem, decisions, next, proof, redaction  
- **C** — adaptive (coursework / hackathon / team / work / OSS / research …)  
- **D** — technical shape only when the repo shows evidence  
- **E** — tone, colour, fonts, ornaments  

Principles: infer first; batches of 3–5; skip is valid; plain language; never assume services or teams unless the profile says so.

Full text: `skills/scorecard/interview.md` and the design spec under `docs/superpowers/specs/`.

---

## Redaction

Before any content write, scan for secrets, tokens, private URLs, emails, and names flagged in B9. Author approves redact/keep. Env **names** may appear; **values** never do. Planted-secret fixtures live under `skills/scorecard/fixtures/`.

---

## Repo layout (this monorepo)

```
libretto/                 # Reference Full manual (Conductor)
scorecard/                # Kit + CLI + sample content
skills/scorecard/         # Canonical skill source
plugins/scorecard/        # Cursor plugin package (marketplace)
.claude/skills/scorecard/ # Claude Code
.agents/skills/scorecard/ # Codex
```

---

## Success criteria (v1)

- Works on ≥4 project types without kit code changes per type  
- Every claim tagged; agent cannot set `confirmed`  
- Invalid architecture paths rejected; secrets caught before write  
- Re-run never overwrites authored content  
- `npx scorecard dev` → Write mode in one step  
- Lite stays small; plain scheme available for submissions  

---

## Out of scope (v1)

Hosted CMS · scoring/grading · AI-assistance disclosure · perfect static dependency graphs · auto-recorded demos · Write mode on production hosting · custom font uploads · desktop launcher wrapper  

---

## Licence

Kit code: same as the Libretto repository unless noted. Fonts and ornaments: see `LICENSES/`. Confirm public redistribution licences before marketplace release.
