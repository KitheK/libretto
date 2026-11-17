# Libretto

A manual of Conductor — the safe Canvas management platform (COSC 499 Team 1). Paper ground, one blue, Newsreader for reading, Departure Mono for machine print.

## Develop

```bash
npm install
npm run dev
```

| Command | Purpose |
|---|---|
| `npm run dev` | Local manual |
| `npm test` | Content and unit checks |
| `npm run build` | Typecheck and production build |
| `npm run deploy` | Build and upload to Cloudflare Pages |

## Deploy

Production: [499team1.com](https://499team1.com) · Pages: [libretto-745.pages.dev](https://libretto-745.pages.dev)

```bash
npx wrangler login   # once
npm run deploy
```

SPA deep links use `public/_redirects` (`/* → /index.html` 200).

DNS (zone already on Cloudflare): proxied CNAMEs for `499team1.com` and `www` → `libretto-745.pages.dev`.

## Live Conductor

`public/live/conductor/` is the real Conductor frontend (development @ 9893400a), built unmodified against an in-browser mock backend. Rebuild and re-record with [tools/conductor-live/](tools/conductor-live/README.md).

## Scorecard

Descriptive project manuals (skill + kit): [`scorecard/README.md`](scorecard/README.md) and Cursor skill [`skills/scorecard/`](skills/scorecard/).

```bash
cd scorecard
npm install
npx scorecard dev
```
