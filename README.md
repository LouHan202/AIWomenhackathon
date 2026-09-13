# Scent Experience Platform — prototype

Clickable/functional prototype for the Scent Experience Platform MVP (see
`docs/design-contract.md` for the visual design system). Built with React,
TypeScript, Vite, and Tailwind CSS v4. All data is mocked in-memory — no
backend, no persistence.

## Run it

```bash
npm install
npm run dev
```

Opens on `http://localhost:5183`.

## What's here

- `src/screens/` — the 6 screens: Brief Upload, AI Analysis Results, Suggestion
  (fragrance direction), Expert Review (internal), Commercial Summary, Control
  Dashboard.
- `src/lib/` — mock "AI" layer (brief parsing heuristics, machine catalog,
  fragrance direction generator, cost calc) and app state (React context +
  reducer).
- `src/components/` — shared UI (`ui/`) and app chrome (nav, progress rail).
- `docs/design-contract.md` — the design system this prototype follows
  (colors, type, shape rules). Read it before changing any styling.

## Other scripts

```bash
npm run build   # typecheck + production build
npm run lint    # oxlint
```
