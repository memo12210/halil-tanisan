# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A cinematography portfolio (Halil Tanışan, Cinematographer) built to closely mirror the
reference site https://rinayang.com/. Vite 6 + React 18 + TypeScript frontend, no router,
no state library, no UI framework — everything is hand-rolled. Pure static SPA: no backend,
no server, no auth — the entire site is `src/` built to `dist/` and served as static files
(GitHub Pages compatible). A hidden CMS login (`server/`, `/login`) was prototyped and then
removed — don't resurrect references to it.

## Commands

```bash
npm run dev         # Vite dev server (5173)
npm run build        # tsc -b then vite build → dist/
npm run typecheck    # tsc -b --noEmit — the only frontend check
npm run preview       # serve the production build locally
```

There is no linter configured.

## Architecture

### Static SPA, nothing else
The whole site is `src/` — no server dependency, no API, no auth. `npm run build` produces a
static `dist/` that can be deployed to any static host (GitHub Pages, Netlify, S3, etc.) with
no server-side runtime required.

### Routing is state, not URLs
[src/App.tsx](src/App.tsx) holds the public-site navigation model in a single `useState` over
a `Route` union: `{ name: 'work'; genre: Genre }`, `{ name: 'info' }`, or `{ name: 'stills' }`.
`go(next)` swaps the route and scrolls to top. There are no URLs/hash/Back for the portfolio —
navigation happens only through `Header`. The site is a pure showcase gallery: there is no
per-project detail page and the hero/rows are not clickable, just hover-captioned imagery
(a project-detail route/page was prototyped and then removed — don't resurrect it).

There is no "show everything" / all-genres state — `genre` on the `work` route is always a
concrete `Genre`, never `null`. The site boots straight into `{ name: 'work', genre:
'Narrative' }`, and both the brand/logo button and re-clicking the active genre tab just
land back on (or stay on) that genre — Narrative is the permanent fallback, not a transient
default.

### Projects are the single source of truth
[src/data/projects.ts](src/data/projects.ts) is one flat `projects: Project[]` array. A
`highlight` boolean — one per genre — marks the project that becomes that genre's hero.

Two selectors derive every view from that array — **use these, never filter inline elsewhere**:
- `heroFor(genre)` → the genre's highlighted project, shown large at the top.
- `gridFor(genre)` → every project in that genre as rows, with the hero project **kept but
  placed as the first row**, right below itself as the hero (not removed) — so it's visible
  both large up top and immediately below in row form.

Invariant the data is expected to satisfy: ≥7 projects per genre (currently under that while
placeholder data is being replaced with real projects), exactly one `highlight` per genre.
Keep this when editing the array.

### Genres are a closed union
`Genre = 'Narrative' | 'Commercials'` in [src/components/types.ts](src/components/types.ts)
(note: a third genre, "Music Videos", existed earlier and was removed — don't assume it's
still there). Adding/renaming a genre means editing the type, the `GENRES` array in
[src/components/Header.tsx](src/components/Header.tsx), and the data — all three stay in sync.

### Non-highlighted projects render as rows of three, not a tile grid
[src/components/ProjectRow.tsx](src/components/ProjectRow.tsx) renders each non-hero project
from `gridFor(genre)` as one full-width row containing all three of that project's `images` —
a single `<div>` wraps all three `<img>`s, so hovering dims and captions them together as one
unit (this is what signals "these three belong to one project," not a gap difference — the
row-to-row gap intentionally matches the within-row gap, 14px, same as the original tile
grid). `ProjectGrid.tsx` just maps `gridFor(genre)` over `ProjectRow`s inside a `.rows` column.
Neither the hero nor the rows are clickable — there's nothing to navigate to.

### Stills is a separate, title-less collection — not a `Genre`
[src/data/stills.ts](src/data/stills.ts) is its own flat `stills: Still[]` array — deliberately
not part of `projects.ts`/`Genre`, since a still has no `title`/`meta` and isn't grouped into a
project. It follows the same seed-plus-placeholder-fallback pattern (a `highlight` boolean picks
the one shown large at the top; `gridStills` is everything else, unlike genre pages the hero
is **not** repeated in the grid below). [src/components/Stills.tsx](src/components/Stills.tsx)
renders plain `<img>`s with no `<button>`, no hover state, and no caption at all — don't add
title/description text here even though the pattern elsewhere (`Hero`, `ProjectRow`) has one.

### Media: mostly real `<img>` now, still placeholder content for most projects
`Hero` and `ProjectRow` render real `<img className="media-img">` tags bound to each project's
`thumbnail` / `images` fields (`src/data/projects.ts` fills these in from the shared
`public/placeholder_image.png` when a seed doesn't specify its own). Only
[src/components/Plate.tsx](src/components/Plate.tsx) — a tone-gradient `<div role="img">` —
remains, used just for the Info-page portrait. `Tone = 'warm' | 'cool' | 'dark' | 'neutral'`
still maps to `.plate-*` gradients in CSS for that one spot. Replacing the placeholder image
files with real stills is the deliberate not-yet-done step for most projects; the wiring for
per-project media already exists. There is no video/detail-player anywhere in the site — the
`Project` type has no `video`/`tag` fields.

Projects with real per-project media live under `public/projects/<slug>/` (currently ferret,
hotel, kepler, ballet, cinili, bomonti — plus a shared `public/projects/stills/` for the
Stills page), keeping one project's stills cleanly separated from another's — as opposed to a
flat `public/<slug>_01.webp` naming. Non-highlighted projects number three images
`01`–`03.webp`; the seed's `thumbnail` points at `01` and `images` lists all three (e.g.
hotel). A genre's **highlighted** project needs a fourth, `04.webp`, since its hero
(`thumbnail`) already shows `01` and its bottom-row `images` must be the three *other* shots
— `02`, `03`, `04` — so nothing repeats between the hero and its own row (see ferret, cinili).
Follow this convention when wiring in real media for the remaining placeholder-only projects.

Some source files pillarbox their real content inside a wider canvas (e.g. a 4:3 photo
centered in a 1920x1080 file, leaving black bars down each side — check with a bounding-box
diff against a black background before assuming a file is clean). `Project.frameRatio` (e.g.
`"4 / 3"`) overrides the default hero/row frame aspect-ratio per project — set only on
projects whose files need it (cinili, bomonti); leave it unset for full-bleed media (ferret) so
those aren't cropped unnecessarily. It flows through as the `--frame-ratio` CSS custom
property set inline on `.hero-frame`/`.row` and consumed by `.hero-image`/`.row-image`'s
`aspect-ratio: var(--frame-ratio, <default>)`, letting `object-fit: cover` crop the bars away.
`.stills-hero`/`.stills-tile` hard-code `4 / 3` instead, since every still shares that ratio.

### Styling: one global stylesheet + design tokens
All CSS lives in [src/styles/global.css](src/styles/global.css) (plain CSS, no modules/Tailwind).
Design tokens are CSS custom properties in `:root` (`--bg`, `--text`, `--muted`, `--accent`,
`--rest-dim`, `--font-sans`). Class names are BE-ish and component-scoped by convention
(`.hero-*`, `.row-*`, `.info-*`, `.stills-*`). When adding a component, add its
styles here under a matching `/* ---------- Name ---------- */` section.

[src/config/theme.ts](src/config/theme.ts) is a small JS-side config (`restDim`, `accent`,
`captions`) — `captions` actually gates hover captions in `ProjectRow`; the others mostly
mirror CSS vars and are largely inert.

### Accessibility conventions (match these)
`.hero-frame` and `.row` are plain non-interactive `<div>`s (no `<button>`, no click handler,
no `aria-label`) — hover captions are a mouse-only decorative affordance, not a focusable
control, since there's nothing to navigate to. Grid entrance stagger uses `--i` per row and is
disabled under `prefers-reduced-motion`.

## Conventions

- Typography is Mulish, loaded via Google Fonts `<link>` in [index.html](index.html)
  (matches the reference's "Muli"). The visual target is monochrome, white background,
  ~1024px container, sentence-case centered nav.
- The reference site (rinayang.com) lazy-loads on scroll; when inspecting it with
  chrome-devtools MCP, scroll the page first and wait for entrance animations (~1s) before
  screenshotting, or you capture empty/half-faded states.
- Features are planned/designed under `docs/superpowers/` before implementation: a design
  spec in `docs/superpowers/specs/<date>-<feature>-design.md`, then a task-by-task plan in
  `docs/superpowers/plans/<date>-<feature>.md`. Follow the same pattern when planning a new
  non-trivial feature.
