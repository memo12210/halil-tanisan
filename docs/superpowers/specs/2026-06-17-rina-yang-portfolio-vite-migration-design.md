# Rina Yang Portfolio — Vite + React + TypeScript Migration

**Date:** 2026-06-17
**Status:** Approved

## Goal

Convert the standalone `Rina Yang Home.dc.html` (rendered by the custom "Design
Component" runtime in `support.js`) into a production-quality Vite + React +
TypeScript project. Preserve all functionality and visual appearance. Eliminate
inline JS/CSS. Organize into modular, maintainable, scalable code.

## Context: what the source is

`Rina Yang Home.dc.html` is a template for a custom runtime (`support.js`, the
"DC" framework). The runtime:

- Loads React 18 UMD from a CDN.
- Parses the `<x-dc>` template, doing `{{ }}` interpolation against the output of
  a `renderVals()` method.
- Runs a `class Component extends DCLogic` (a thin wrapper over
  `React.Component`) that holds hover state and computes inline style objects.
- Resolves `<dc-import name="Plate" .../>` as sibling components (a `Plate.dc.html`
  that does not exist here — it renders tinted image placeholders).

The **application** being rendered is a single-page cinematographer portfolio
homepage for "Rina Yang": a centered header + nav, a featured hero plate with a
hover focus effect, a 3-column grid of six project tiles with hover captions, and
a footer.

The DC runtime (`support.js`) is **discarded**. We reimplement the application
natively in React + TypeScript. The original `renderVals()` logic maps directly
onto React component state and CSS.

## Decisions (resolved during brainstorming)

1. **Framework:** React + TypeScript (the original logic is literally a React
   component; the mapping is the most faithful).
2. **Images:** Tone-gradient placeholders. There are no real image assets and no
   `Plate.dc.html`. A `Plate` component renders a tinted gradient per `tone`
   (warm / cool / dark / neutral) with the filename + aspect-ratio tag overlay,
   matching how the DC runtime visually renders an unresolved plate.
3. **Editor props** (`restDim`, `accent`, `captions`): centralized in a typed
   `config/theme.ts` plus CSS custom properties — one tuning point, no editor.

## Architecture

Standard Vite React+TS app.

```
index.html                     # minimal: #root + module script, no inline CSS/JS
src/
  main.tsx                     # React root mount
  App.tsx                      # page composition + entrance animation wrappers
  config/
    theme.ts                   # restDim, accent, captions, colors, fonts (typed)
  data/
    projects.ts                # featured hero + 6 tiles (typed)
  components/
    types.ts                   # Project, Tone, shared types
    Header.tsx                 # name + nav
    Hero.tsx                   # featured plate: hover veil + FEATURED overlay
    ProjectGrid.tsx            # 3-column grid
    ProjectTile.tsx            # one tile: hover dim + caption reveal
    Plate.tsx                  # tone-gradient image placeholder (replaces dc-import)
    Footer.tsx
  styles/
    global.css                 # reset, riseIn keyframe, body base, font/theme vars
    *.module.css               # per-component CSS Modules
```

### Component responsibilities

- **`Plate`** — props `{ tone, label, tag?, meta? }`. Renders a `position:absolute
  inset:0` tinted gradient by tone with a monospace filename + aspect tag overlay.
  No internal state. Replaces every `<dc-import name="Plate">`.
- **`Hero`** — owns its own `hover` boolean (`useState`). Renders the 2.4:1 plate,
  a base rest dim, a focus veil that fades in on hover, and the FEATURED overlay
  that fades + rises on hover. Reads `restDim`/`captions` from theme.
- **`ProjectTile`** — props `{ project }`, owns its own `hover` boolean. Renders a
  16:9 plate, a rest dim that fades out on hover, and a caption (title + meta) that
  fades + slides up on hover, gated by `theme.captions`.
- **`ProjectGrid`** — maps `projects` to `ProjectTile`s in a 3-col grid.
- **`Header`** / **`Footer`** — static presentational.

### State mapping

The original kept one global state `{ hero, tile }`. We localize hover state to
each `Hero`/`ProjectTile`. Same visual result; cleaner boundaries, no prop
drilling.

### Style mapping

- All inline `style="..."` becomes CSS Modules.
- The dim opacity (`restDim`) is exposed as a CSS custom property `--rest-dim` on
  `:root` from `theme.ts`, consumed by `.module.css` via `rgba(18,15,9,var(--rest-dim))`.
- Hover-driven transitions use a `data-active` attribute (or `:hover`) + CSS
  transitions matching the original timings.
- `accent` (#b54a36) is exposed as `--accent` for fidelity/future use; it is not
  referenced in the current render output (same as the original).

## Visual fidelity checklist

- Background `#faf9f6`, text `#15140f`, container `max-width:1480px; padding:0 40px`.
- Font stack `'Helvetica Neue',Helvetica,Arial,sans-serif`; monospace labels
  `ui-monospace,'SF Mono',Menlo,monospace`.
- `riseIn` keyframe entrance with original staggered delays/easings (header .7s,
  hero block .9s @ .06s, `cubic-bezier(.2,.7,.2,1)`).
- Hero: rest dim `rgba(18,15,9,.5)`; hover focus veil
  `linear-gradient(to bottom, rgba(10,8,5,.5), rgba(8,6,4,.66))` fade-in; FEATURED
  block transform from `translate(-50%,-46%)` to `translate(-50%,-50%)` + fade.
- Tiles: rest dim fades out on hover (.55s); caption gradient
  `linear-gradient(to top, rgba(8,6,3,.66), rgba(8,6,3,0))` fades + slides up 8px.
- Aspect ratios: hero 2.4/1, tiles 16/9; grid gap 20px; nav gap 46px; etc.
- Exact letter-spacing/weights/sizes from the source inline styles.

## Data

`src/data/projects.ts` carries the featured hero and the six tiles exactly as in
the original `data` array (file, tone, tag, title, meta), typed against `types.ts`.

## Out of scope

- The DC runtime / streaming / editor bridge (`support.js`) — discarded.
- Real image assets (placeholders only).
- Routing / nav targets (nav items are presentational, as in the original).
- Tests beyond a build/typecheck verification (static presentational UI).

## Verification

- `npm run build` and `tsc --noEmit` pass with no errors.
- `npm run dev` renders the page; visual comparison against the original shows
  matching layout, colors, typography, entrance animation, and hover behavior.
