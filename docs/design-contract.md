# Design Contract — Osmo-derived

Approved 2026-09-12. Source of truth for all visual/UI decisions in this prototype.
Supersedes the earlier invented "Luxury/refined bronze-on-charcoal" direction.

## Provenance

Extracted from **live computed styles** on osmo.ai (root homepage, `/for-brands`,
and the contact form) via browser devtools — not guessed. One theme throughout;
the earlier dark/light screen split ("ceremony"/"instrument") is retired.

## Colors

| Token | Value | Used for |
|---|---|---|
| `paper` | `#FFFFFF` | page background — the dominant surface, everywhere |
| `ink` | `#212121` | the *only* text color, both headings and body — hierarchy comes from size/weight, not a gray scale |
| `ink-muted` | derived, ~55% L | labels, hints, secondary chrome ONLY — never body copy |
| `surface-sunken` | derived, ~97% L | off-white fill for inputs/textareas |
| `line` | derived, ~89% L | hairline borders |
| `coral` | `#FF8D5C` | **the primary CTA only** — see Amendment below |
| `coral-soft` | `#FFA178` | the decorative hero-blob gradient only, never an interactive state |

Functional/status colors (`signal-amber`, `signal-green`, `signal-red`) are unrelated
to brand identity and unaffected by this contract — they mean pending/confirmed/error
regardless of theme.

### Amendment on approval: coral is CTA-only

The user's approval came with one change from the initial draft: **coral must not be
used as a general accent** (nav active-state, selected cards, dosage pills, progress
rail, etc.). Every one of those now uses `ink` instead. Coral appears in exactly two
places in this app: the primary action button on each screen (Analyze brief, Continue
to X, Confirm setup, Confirm & install) and the decorative hero blob on Brief Upload.

## Typography

- Display: **Tenor Sans** (400 only) — big headlines. Tight tracking (`-0.03em`),
  tight leading (line-height ≈ font-size, ~1.0–1.05).
- Body/UI: **DM Sans** (400/500/700) — nav, buttons, paragraphs, forms.
- Two faces only. No third font introduced anywhere.

## Shape & components

- **Buttons**: full pill (`rounded-full`). Only the primary/coral variant is
  uppercase; secondary and ghost stay normal case (a row of secondary chips
  shouldn't read as three competing CTAs).
- **Inputs**: pill-shaped (`rounded-full`) for single-line fields, softly rounded
  (`rounded-2xl`) for multi-line textareas. No border — filled with `surface-sunken`
  against the `paper` background; contrast comes from the fill, not a border.
- **Cards**: `rounded-2xl`, thin `line` border, `paper` background.
- **Labels**: uppercase, tracked (`0.08em`), `ink-muted` — matches Osmo's own form
  label style (verified on their contact form).

## Signature motif

A large, soft, blurred coral radial-gradient blob behind the Brief Upload hero
headline — translucent, out-of-focus, decorative only, never a hard edge. This is
the one place `coral-soft` appears; it does not recur on other screens.

## What this replaced

Removed entirely: the bronze/amber accent family, the dark "ceremony" theme
(Brief Upload / AI Analysis / Suggestion / Commercial Summary used to render on a
bronze-tinted near-black background), Libre Caslon Display + Figtree, and the
ceremony/instrument dual-tone prop on every UI primitive (`Card`, `Field`,
`Button`, `Tag`, `Switch`, `Inputs` no longer take a `tone` prop — there is only
one theme now).

## Applying this contract

- Tokens live in `src/index.css` (`@theme` block) — `--color-paper`, `--color-ink`,
  `--color-ink-muted`, `--color-surface-sunken`, `--color-line`, `--color-coral`,
  `--color-coral-soft`, plus the unrelated `--color-signal-*` status colors.
- Fonts loaded in `index.html` (Tenor Sans + DM Sans via Google Fonts).
- `Button` variants: `primary` (coral, CTA-only) / `secondary` (ink outline) /
  `ghost` (ink text, no fill). Never add a fourth variant that reintroduces coral.
- When adding a new screen or component: default to `ink` for anything
  interactive/selected/stateful. Reach for `coral` only for the single primary
  action a screen offers — if a screen already has a coral button, nothing else
  on it should be coral.
