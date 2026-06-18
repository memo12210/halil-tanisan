# Genre Filtering for the Portfolio Grid — Design

Date: 2026-06-18

## Goal

Let visitors filter the cinematography portfolio by genre (Narrative, Music
Videos, Commercials) from the top navigation. The default home view shows all
projects in one mixed grid; selecting a genre filters that same grid down to the
matching projects with a smooth, low-fatigue transition.

## Scope

In scope:
- Structured `genre` data on every project.
- Sample Music Videos projects (the genre currently has no entries).
- Clickable genre nav items with an active state and toggle-to-reset behavior.
- Filtered rendering of the existing grid.
- A CSS-only entrance/crossfade transition when the filter changes.

Out of scope:
- The `Info` and `Stills` nav items remain inert (not genres).
- The Hero / featured plate is unchanged.
- No routing/URL state, no animation libraries.

## Data model

Add a `Genre` union and a structured `genre` field to `Project` in
`src/components/types.ts`:

```ts
export type Genre = 'Narrative' | 'Music Videos' | 'Commercials';

export interface Project {
  // ...existing fields...
  genre: Genre;
}
```

In `src/data/projects.ts`:
- Backfill `genre` on the six existing projects (five Narrative, one Commercial
  — matching the genre text already present in their `meta` strings).
- Add ~3 sample Music Videos projects (with `file`, `tone`, `tag`, `title`,
  `meta`, `genre: 'Music Videos'`) so the genre has content to demonstrate
  filtering.
- `meta` strings are left as display text; `genre` is the source of truth for
  filtering.

## State & data flow

Lift a single piece of state into `src/App.tsx`:

```ts
const [activeGenre, setActiveGenre] = useState<Genre | null>(null);
// null == "all" / home view
```

- `Header` receives `activeGenre` and an `onSelectGenre(genre: Genre | null)`
  callback.
  - The three genre nav items (Narrative, Music videos, Commercials) become
    clickable. The list of which nav items are genres is defined explicitly so
    `Info` / `Stills` stay inert.
  - The active genre item gets an active style using the existing `--accent`
    color.
  - Clicking the already-active genre calls `onSelectGenre(null)` (toggle back
    to all).
  - Clicking the brand name also resets to all (`onSelectGenre(null)`).
- `ProjectGrid` receives `activeGenre` and renders
  `activeGenre ? projects.filter(p => p.genre === activeGenre) : projects`.
- `Hero` is unchanged.

## The transition

Constraints: CSS-only, no new dependencies, reuse the existing `riseIn`
keyframe and `cubic-bezier(0.2, 0.7, 0.2, 1)` easing vocabulary already in
`global.css`.

Mechanism:
- The grid element is given `key={activeGenre ?? 'all'}` in `App`/`ProjectGrid`
  so React remounts it on every filter change, replaying its entrance
  animation rather than snapping to the new set.
- Each tile fades-and-rises in via the `riseIn` animation with a small
  **stagger**: tile index is passed as a CSS custom property (e.g. `--i`) and
  used for `animation-delay` (~50ms per tile, capped so large sets don't drag).
  This makes the new set settle gently.
- The overall effect reads as a crossfade-into-place rather than a hard cut.

Accessibility:
- Wrap the motion in `@media (prefers-reduced-motion: reduce)` to disable the
  animation/stagger (instant swap) for users who opt out.

## Components touched

- `src/components/types.ts` — add `Genre`, extend `Project`.
- `src/data/projects.ts` — backfill genres, add Music Videos samples.
- `src/App.tsx` — own `activeGenre` state, pass props down.
- `src/components/Header.tsx` — clickable genre items, active state, reset.
- `src/components/ProjectGrid.tsx` — accept `activeGenre`, filter, keyed remount,
  pass stagger index to tiles.
- `src/components/ProjectTile.tsx` — accept/apply stagger index custom property.
- `src/styles/global.css` — active nav style, tile stagger animation,
  reduced-motion guard.

## Testing / verification

- Default load shows all projects (existing six + new Music Videos samples).
- Clicking each genre shows only that genre's projects; Music Videos shows the
  new samples.
- Clicking the active genre again, or the brand name, returns to all.
- Active nav item is visually distinct.
- Transition plays smoothly on filter change; with `prefers-reduced-motion`
  the swap is instant.
- App builds/type-checks with no errors.
```
