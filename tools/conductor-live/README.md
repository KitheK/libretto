# Conductor live embed and recordings

Libretto ships the **real** Conductor frontend (capstone-team-1 `app/frontend`, development @ `9893400a`, PR #946) as a static build in `public/live/conductor/`. The capstone source is not changed. `mock-backend.js` is injected as the first script in that build's `index.html`; it answers the frontend's calls to Kong (`http://localhost:8000/api/...`) and its notification WebSockets in the browser. Every course, student, count, and agent step it returns is **mock data**. Nothing reaches Canvas, a model provider, or a server.

What the mock does:

- issues an unsigned demo JWT (`role: Instructor`) and a profile with onboarding completed;
- serves four mock courses, assignments, a 12-student roster, submissions, to-dos, and action history;
- simulates agent sessions on the REST polling path that `useAgentConversation` uses (steps spaced under its 2.5 s poll). A question runs `list_my_courses` → `list_course_assignments` → `get_submission_status` → `final_answer`. A request that mentions an announcement or posting pauses on `create_announcement` (a WRITE tool) for HITL review;
- `?route=/dashboard` picks the start page (rewritten with `history.replaceState` before React boots, since the bundle lives under `/live/conductor/`), `?theme=light|dark` seeds `canvas-ai-theme`;
- host bridge: `postMessage({type: "conductor:set-theme", theme})` clicks Conductor's own `button.theme-toggle`; the embed posts `{type: "conductor:theme", theme, path}` whenever `<html class="dark">` or the route changes.

## Rebuild

```bash
# 1. the capstone frontend at the commit you want, with deps
cd ../capstone-team-1/app/frontend && npm install
# 2. build it into public/live/conductor with the mock injected
cd ../../../libretto && node tools/conductor-live/build-embed.mjs ../capstone-team-1/app/frontend
```

## Re-record the clips and screenshots

```bash
npm run dev -- --port 5180 --strictPort        # serves public/live/conductor
npm i --no-save playwright && npx playwright install chromium
node tools/conductor-live/record.mjs           # or: greeting think review theme tour shots
tools/conductor-live/encode.sh                 # needs ffmpeg; writes public/conductor/motion/*
```

`record.mjs` writes raw 1280×800 takes to `takes/` (git-ignored) and still captures to `public/conductor/live/*-{light,dark}.png`. It draws a small blue dot where the scripted pointer moves, because Playwright video has no cursor. `encode.sh` cuts long agent waits (cut points are listed in the script), crops, and produces a VP9 webm, a 12 fps palette GIF, and a poster per clip. If the mock timing or the UI changes, check the cut points against a contact sheet.
