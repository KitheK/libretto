# Libretto

A manual of the capstone Canvas assistant. It explains the containers in `capstone-team-1`: which box a sentence passes through, which service is allowed to call Canvas, and where the record of that work is kept.

The visual system follows [Making Software](https://www.makingsoftware.com/): paper ground, one blue, a serif for reading, and Departure Mono for everything a machine would print. The plan is in [docs/superpowers/plans/2026-11-15-libretto-manual.md](docs/superpowers/plans/2026-11-15-libretto-manual.md).

```bash
npm install
npm run dev
```

| Command | Purpose |
|---|---|
| `npm run dev` | Local manual |
| `npm test` | Check that every chapter names the stack it claims to explain |
| `npm run build` | Typecheck and production build |

Departure Mono 1.500 is bundled in `public/fonts/` under the SIL Open Font License. Set it in 11px steps.

## Live Conductor

`public/live/conductor/` is the real Conductor frontend (development @ 9893400a), built unmodified and run against an in-browser mock backend. The homepage and chapter 02 embed it with a working light/dark switch; chapters 02 and 05 show clips recorded from it. Rebuild and re-record with the scripts in [tools/conductor-live/](tools/conductor-live/README.md). All data in the embed, the clips, and the `public/conductor/live/` screenshots is mock data.

