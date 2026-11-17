# Libretto Manual Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a digital technical manual in the emptied `libretto` repo that explains every running component of the capstone Canvas assistant, in the visual language of [Making Software](https://www.makingsoftware.com/).

**Architecture:** A Vite + React client app. Chapter prose and plate metadata live in one typed module. Each plate is an inline SVG schematic. The browser renders a book: a homepage without a sidebar, and chapter pages with a fixed contents column, a centered header, and a reading ruler.

**Tech Stack:** Vite 6, React 19, React Router 7, TypeScript, Vitest. Newsreader (reading face) from Google Fonts. Departure Mono 1.500 (SIL OFL, Helena Zhang) self-hosted for labels, navigation, and the pixel wordmark.

## Global Constraints

- Canvas background `#FBFBFB`, ink `#000000`, muted ink `#0C0A09`, action blue `#103DFF`. No second accent color. No dark theme.
- Reading text is Newsreader at weight 400. ABC Arizona Mix is the Making Software body face and is a commercial Dinamo license, so it is not shipped here.
- Machine text is Departure Mono. Set it at 11px or 22px so the pixel grid stays crisp. Do not bold it.
- Hierarchy comes from size and family, not from font weight.
- Homepage has no sidebar. Chapter pages use a fixed left contents column (~20% width), a centered chapter opening, a dashed rule, and a right-edge tick ruler with a `0.00`–`1.00` readout.
- Plates are blue line drawings on the paper ground, with a vertical `FIG_00N` index, a `[ NAME ]` title block, and a caption that states the idea.
- The pixel wordmark is drawn as integer SVG rectangles. Do not anti-alias it.
- Claims describe the compose stack in `capstone-team-1` `app/docker-compose.yaml` and the service files cited in each chapter. Link sources to `https://github.com/UBCO-COSC499-S2026/capstone-team-1/blob/development/`.
- HTTP from the frontend ends at Kong (`VITE_API_BASE_URL` defaults to `http://localhost:8000/api`). The live socket opens on the notification service (`VITE_WS_BASE_URL` defaults to `ws://localhost:8004`).
- Approval stays in the agentic service. The compose file has no separate HITL container.
- Only the connector calls the Canvas REST API. `mcp-canvas` calls the connector over gRPC.
- The OpenTelemetry pipeline in `otel-collector-config.yaml` is logs-only, exported to ClickHouse table `otel_logs`, with a 336h TTL.
- Below 860px the contents column becomes a drawer and the ruler hides.

## File structure

- `index.html` — document shell, Newsreader, favicon
- `src/styles.css` — tokens, homepage, chapter, plates, drawer
- `src/content/manual.ts` — parts, chapters, FAQ, word count
- `src/content/manual.test.ts` — inventory and shape checks
- `src/figures/kit.tsx` — SVG text, boxes, arrows
- `src/figures/plates.tsx` — nine plates
- `src/components/PixelWordmark.tsx`
- `src/components/Plate.tsx`
- `src/components/RichText.tsx`
- `src/components/HomePage.tsx`
- `src/components/ContentsPage.tsx`
- `src/components/ChapterPage.tsx`
- `src/components/ManualLayout.tsx`
- `src/App.tsx` — routes `/`, `/contents`, `/chapters/:slug`
- `public/fonts/DepartureMono-Regular.woff2` and `public/fonts/LICENSE`

## Chapters

| Route | Plate | Must name |
|---|---|---|
| `/` | `FIG_001` assembly | The product, both browser conversations, link into the contents |
| `01-shape` | `FIG_002` two wires | Kong `:8000`, notification `:8004`, `canvas-lms` network |
| `02-desk` | `FIG_003` rooms | Login, onboarding, instructor routes, admin routes, settings |
| `03-door` | `FIG_004` Kong | DB-less Kong, port 8000, declarative config, `host.docker.internal` |
| `04-asking` | `FIG_005` auth | FastAPI `:8002`, gRPC `:50052`, Postgres, Redis blacklist, mTLS cert script |
| `05-loop` | `FIG_006` cycle | Agentic `:8003`, HITL pause, Postgres checkpoints, Redis conversation, Celery worker, `/data/documents` |
| `06-canvas` | `FIG_007` corridor | `mcp-canvas` `:8100` localhost and gRPC `:50056`, connector `:8005` / `:50055`, Canvas REST only there |
| `07-wire` | `FIG_008` fan-out | `session:*:steps`, `session:*:hitl`, websocket, email subscribers, Resend webhook |
| `08-kept` | `FIG_009` cabinets | Postgres `:15432`, Redis `:6379`, ClickHouse, OTel `:4317`/`:4318`, 14-day log TTL, Adminer `:8081`, `db-migrate` |

## Tasks

- [x] Scaffold Vite, React, Router, and Vitest at the repo root.
- [x] Add the design tokens, Departure Mono, and the pixel wordmark.
- [x] Write `manual.ts` so every row in the chapter table is present and linked to a source file.
- [x] Draw `FIG_001` through `FIG_009` with the shared plate chrome.
- [x] Build the homepage, contents page, and chapter page, including the mobile drawer and reading ruler.
- [x] Run `npm test` and `npm run build`. Open the homepage, one chapter, and the contents page and confirm the plates, the active contents item, and the FAQ selection.

## Verification

```bash
npm test
npm run build
npm run dev
```

Expected: tests pass, production build finishes, and `/`, `/contents`, and `/chapters/05-loop` render the serif column, mono labels, and blue plates.
