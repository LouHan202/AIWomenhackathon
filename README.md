# Aeria Studio — prototype

Clickable/functional prototype for Aeria, a scent-experience platform: a
static marketing landing page (`index.html`) leading into an offer-builder
app (`app/`). Built with vanilla HTML/CSS/JS for the landing page and React,
TypeScript, Vite, and Tailwind CSS v4 for the offer builder. All data is
mocked in-memory — no backend, no persistence.

## Run it

```bash
npm install
npm run dev
```

Opens on `http://localhost:5183`. The landing page is served at `/`; the
offer-builder app is at `/app/`.

## What's here

- `index.html`, `styles.css`, `app.js`, `assets/` — the static landing page.
  It can also be opened directly as a local file (no dev server needed).
- `app/` — the offer builder's HTML entry point.
- `src/screens/` — the offer builder's 6 screens: Brief Upload, AI Analysis
  Results, Suggestion (fragrance direction), Expert Review (internal), Offer
  Summary, Control Dashboard.
- `src/lib/` — mock "AI" layer (brief parsing heuristics, machine catalog,
  fragrance direction generator, cost calc) and app state (React context +
  reducer).
- `src/components/` — shared UI (`ui/`) and app chrome (nav, progress rail).
- `docs/design-contract.md` — the design system the offer builder follows
  (colors, type, shape rules). Read it before changing any styling.
- `SILLAGE-Website-Slack-Upload-v24/` — the original standalone landing page
  mockup the current landing page was adapted from (kept for reference).

## Other scripts

```bash
npm run build   # typecheck + production build (both the landing page and the app)
npm run preview # serve the production build locally
npm run lint    # oxlint
```
