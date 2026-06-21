# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page cinematography portfolio (Halil Tanışan, Cinematographer) built to closely
mirror the reference site https://rinayang.com/. Vite 6 + React 18 + TypeScript. No router,
no state library, no UI framework — everything is hand-rolled.

## Commands

```bash
npm run dev        # Vite dev server at http://localhost:5173/
npm run build      # tsc -b (project refs) then vite build → dist/
npm run typecheck  # tsc -b --noEmit — run this to verify changes; there are no tests
npm run preview    # serve the production build
```

There is no test runner and no linter configured. `npm run typecheck` is the only
automated check.

## Architecture

### Routing is state, not URLs
[src/App.tsx](src/App.tsx) holds the entire navigation model in a single `useState` over a
`Route` union: `{ name: 'work'; genre }`, `{ name: 'info' }`, or `{ name: 'project'; project }`.
`go(next)` swaps the route and scrolls to top. There are no URLs, no hash, no browser Back —
navigation happens only through `Header` (logo/sections) and by clicking the hero/tiles
(`onOpen`). Adding shareable links or working Back means introducing real routing; don't
assume it exists.

### Projects are the single source of truth
[src/data/projects.ts](src/data/projects.ts) is one flat `projects: Project[]` array. Two
boolean flags drive a highlight hierarchy:
- `highlight` — one per genre; that project becomes the genre's hero.
- `featured` — exactly one site-wide; the Home hero (currently "Euphoria — S2").

Three selectors derive every view from that array — **use these, never filter inline elsewhere**:
- `heroFor(genre)` → the hero plate (genre highlight, or global `featured` on Home).
- `gridFor(genre)` → grid projects for the view, with the promoted hero removed to avoid duplication.
- `featured` → the global hero.

Invariant the data is expected to satisfy: ≥7 projects per genre, exactly one `highlight`
per genre, exactly one `featured` overall. Keep this when editing the array.

### Genres are a closed union
`Genre = 'Narrative' | 'Music Videos' | 'Commercials'` in
[src/components/types.ts](src/components/types.ts). Adding/renaming a genre means editing the
type, the `GENRES` array in [src/components/Header.tsx](src/components/Header.tsx), and the
data — all three stay in sync.

### Media is placeholder-only (`Plate`)
[src/components/Plate.tsx](src/components/Plate.tsx) renders a tone-gradient `<div role="img">`
standing in for real film stills/video — there are no `<img>` or video embeds anywhere.
`Tone = 'warm' | 'cool' | 'dark' | 'neutral'` maps to `.plate-*` gradients in CSS. The
project-detail "player" and the Info portrait are also Plates. Replacing placeholders with
real media is a deliberate, not-yet-done change.

### Styling: one global stylesheet + design tokens
All CSS lives in [src/styles/global.css](src/styles/global.css) (plain CSS, no modules/Tailwind).
Design tokens are CSS custom properties in `:root` (`--bg`, `--text`, `--muted`, `--accent`,
`--rest-dim`, `--font-sans`). Class names are BE-ish and component-scoped by convention
(`.hero-*`, `.tile-*`, `.detail-*`, `.info-*`). When adding a component, add its styles here
under a matching `/* ---------- Name ---------- */` section.

[src/config/theme.ts](src/config/theme.ts) is a small JS-side config (`restDim`, `accent`,
`captions`) — `captions` actually gates tile hover captions in `ProjectTile`; the others
mostly mirror CSS vars and are largely inert.

### Accessibility conventions (match these)
Clickable images are real `<button>` elements with button-reset CSS and `aria-label`s, not
divs (`.hero-frame`, `.tile`). Hover captions also trigger on focus/blur for keyboard users.
Grid entrance stagger uses `--i` per tile and is disabled under `prefers-reduced-motion`.

## Conventions

- Typography is Mulish, loaded via Google Fonts `<link>` in [index.html](index.html)
  (matches the reference's "Muli"). The visual target is monochrome, white background,
  ~1024px container, sentence-case centered nav.
- The "Stills" nav item is intentionally a static, non-interactive `<span>` (not yet wired).
- The reference site (rinayang.com) lazy-loads on scroll; when inspecting it with
  chrome-devtools MCP, scroll the page first and wait for entrance animations (~1s) before
  screenshotting, or you capture empty/half-faded states.
