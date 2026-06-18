# Genre Filtering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let visitors filter the portfolio grid by genre (Narrative, Music Videos, Commercials) from the top nav, with a smooth CSS-only transition; the default view shows all projects.

**Architecture:** A single `activeGenre` state (`Genre | null`) lives in `App`. `Header` renders the three genre nav items as clickable toggles with an active style; `ProjectGrid` filters the project list by `activeGenre` and remounts (React `key`) on change so each tile replays a staggered `riseIn` entrance. Genre becomes a structured field on `Project`.

**Tech Stack:** React 18 + TypeScript, Vite, plain CSS in `src/styles/global.css`. No new dependencies.

## Global Constraints

- No new dependencies (no animation libraries) — CSS-only transitions.
- Reuse the existing `riseIn` keyframe and `cubic-bezier(0.2, 0.7, 0.2, 1)` easing already in `global.css`.
- `Info` and `Stills` nav items remain inert (not genres).
- The Hero / featured plate is unchanged.
- Genre values are exactly: `'Narrative'`, `'Music Videos'`, `'Commercials'`.
- No test framework exists; per-task verification = `npm run typecheck` (and `npm run build` where noted). The final task adds manual browser verification.

## File Structure

- `src/components/types.ts` — add `Genre` union; add `genre` field to `Project`.
- `src/data/projects.ts` — backfill `genre`; add Music Videos sample projects.
- `src/components/ProjectTile.tsx` — accept an `index` prop, expose it as the `--i` CSS var.
- `src/components/Header.tsx` — accept `activeGenre`/`onSelectGenre`; clickable genre toggles + active state + brand reset.
- `src/App.tsx` — own `activeGenre` state; wire `Header` and `ProjectGrid`.
- `src/components/ProjectGrid.tsx` — accept `activeGenre`; filter list; keyed remount; pass stagger index.
- `src/styles/global.css` — active nav style, brand cursor, tile stagger animation, reduced-motion guard.

---

### Task 1: Data model — Genre type and project data

**Files:**
- Modify: `src/components/types.ts`
- Modify: `src/data/projects.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `Genre` type (`'Narrative' | 'Music Videos' | 'Commercials'`); `Project.genre: Genre`; an expanded `projects` array where every entry has a `genre`, including ≥3 `'Music Videos'` entries.

- [ ] **Step 1: Add the `Genre` type and `genre` field**

In `src/components/types.ts`, add the union above the `Project` interface and add the field:

```ts
export type Tone = 'warm' | 'cool' | 'dark' | 'neutral';

export type Genre = 'Narrative' | 'Music Videos' | 'Commercials';

export interface Project {
  /** Source filename, shown as the plate label. */
  file: string;
  tone: Tone;
  /** Aspect-ratio tag, e.g. "2.39:1". */
  tag: string;
  title: string;
  meta: string;
  /** Genre used for nav filtering. */
  genre: Genre;
}
```

(Leave the `Featured` interface unchanged.)

- [ ] **Step 2: Backfill genres and add Music Videos samples**

Replace the `projects` array in `src/data/projects.ts` with (keep the existing `featured` export and the `import type` line, adding `Genre` is not required since it is inferred):

```ts
export const projects: Project[] = [
  {
    file: "PROJECT.png",
    tone: "cool",
    tag: "2.39:1",
    title: "Hermès — Beauté",
    meta: "Dir. Rubberband · Commercial",
    genre: "Commercials",
  },
  {
    file: "PROJECT.png",
    tone: "dark",
    tag: "2.00:1",
    title: "Euphoria — S2",
    meta: "HBO / A24 · Narrative",
    genre: "Narrative",
  },
  {
    file: "PROJECT.png",
    tone: "warm",
    tag: "2.39:1",
    title: "O'Dessa",
    meta: "Searchlight · Narrative",
    genre: "Narrative",
  },
  {
    file: "PROJECT.png",
    tone: "neutral",
    tag: "1.85:1",
    title: "Nanny",
    meta: "Amazon Studios · Narrative",
    genre: "Narrative",
  },
  {
    file: "PROJECT.png",
    tone: "dark",
    tag: "2.00:1",
    title: "Top Boy III",
    meta: "Netflix · Narrative",
    genre: "Narrative",
  },
  {
    file: "PROJECT.png",
    tone: "warm",
    tag: "2.39:1",
    title: "The Fire Inside",
    meta: "MGM Studios · Narrative",
    genre: "Narrative",
  },
  {
    file: "PROJECT.png",
    tone: "cool",
    tag: "1.85:1",
    title: "The Weeknd — Sacrifice",
    meta: "Dir. Cliqua · Music Video",
    genre: "Music Videos",
  },
  {
    file: "PROJECT.png",
    tone: "dark",
    tag: "2.39:1",
    title: "FKA twigs — Eusexua",
    meta: "Dir. Jordan Hemingway · Music Video",
    genre: "Music Videos",
  },
  {
    file: "PROJECT.png",
    tone: "warm",
    tag: "1.78:1",
    title: "Rosalía — Saoko",
    meta: "Dir. Valentín & Marçal · Music Video",
    genre: "Music Videos",
  },
];
```

- [ ] **Step 3: Verify it type-checks**

Run: `npm run typecheck`
Expected: completes with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/types.ts src/data/projects.ts
git commit -m "feat: add structured genre to projects and Music Videos samples"
```

---

### Task 2: ProjectTile accepts a stagger index

**Files:**
- Modify: `src/components/ProjectTile.tsx`

**Interfaces:**
- Consumes: `Project` (from Task 1, unchanged usage).
- Produces: `ProjectTile` now accepts `index: number` and sets it as the `--i` CSS custom property on the root `.tile` element. Defaulting keeps it backward-compatible until Task 4 passes the value.

- [ ] **Step 1: Add the `index` prop and apply the `--i` var**

Edit `src/components/ProjectTile.tsx`. Update the props interface and the root element:

```tsx
import { useState } from 'react';
import type { CSSProperties } from 'react';
import Plate from './Plate';
import { theme } from '../config/theme';
import type { Project } from './types';

interface ProjectTileProps {
  project: Project;
  /** Position in the visible grid; drives the staggered entrance animation. */
  index?: number;
}

export default function ProjectTile({ project, index = 0 }: ProjectTileProps) {
  const [hover, setHover] = useState(false);
  const showCaption = hover && theme.captions;

  return (
    <div
      className="tile"
      style={{ '--i': index } as CSSProperties}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="tile-image">
        <Plate tone={project.tone} label={project.file} tag={project.tag} />
      </div>
      <div className="tile-dim" data-active={hover} />
      <div className="tile-caption" data-active={showCaption}>
        <span className="tile-title">{project.title}</span>
        <span className="tile-meta">{project.meta}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify it type-checks**

Run: `npm run typecheck`
Expected: completes with no errors. (The `as CSSProperties` cast is required because `--i` is a custom property not in the typed style map.)

- [ ] **Step 3: Commit**

```bash
git add src/components/ProjectTile.tsx
git commit -m "feat: ProjectTile accepts stagger index as --i css var"
```

---

### Task 3: Header genre toggles

**Files:**
- Modify: `src/components/Header.tsx`

**Interfaces:**
- Consumes: `Genre` (from Task 1).
- Produces: `Header` accepts optional `activeGenre?: Genre | null` and `onSelectGenre?: (genre: Genre | null) => void`. The three genre items are clickable toggles (clicking the active one selects `null`); each carries `data-active`. The brand resets to `null`. `Info`/`Stills` render via `nav-item nav-item-static` and do nothing. Props are optional so the component still compiles before Task 4 wires it.

- [ ] **Step 1: Rewrite `Header.tsx`**

Replace the contents of `src/components/Header.tsx` with:

```tsx
import type { Genre } from './types';

const GENRES: Genre[] = ['Narrative', 'Music Videos', 'Commercials'];
const STATIC_ITEMS = ['Info', 'Stills'];

interface HeaderProps {
  activeGenre?: Genre | null;
  onSelectGenre?: (genre: Genre | null) => void;
}

export default function Header({ activeGenre = null, onSelectGenre }: HeaderProps) {
  const handleGenre = (genre: Genre) => {
    onSelectGenre?.(activeGenre === genre ? null : genre);
  };

  return (
    <header className="site-header">
      <div className="brand" onClick={() => onSelectGenre?.(null)}>
        <span className="brand-name">HALİL TANIŞAN</span>
        <span className="brand-role">CINEMATOGRAPHER</span>
      </div>
      <nav className="nav">
        {GENRES.map((genre) => (
          <span
            key={genre}
            className="nav-item"
            data-active={activeGenre === genre}
            onClick={() => handleGenre(genre)}
          >
            {genre}
          </span>
        ))}
        {STATIC_ITEMS.map((item) => (
          <span key={item} className="nav-item nav-item-static">
            {item}
          </span>
        ))}
      </nav>
    </header>
  );
}
```

Note: the displayed label is now `Music Videos` (was `Music videos`) so it matches the `Genre` value.

- [ ] **Step 2: Verify it type-checks**

Run: `npm run typecheck`
Expected: completes with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.tsx
git commit -m "feat: clickable genre toggles in Header"
```

---

### Task 4: Wire state in App and filter ProjectGrid

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/ProjectGrid.tsx`

**Interfaces:**
- Consumes: `Header` props (Task 3), `ProjectTile` `index` prop (Task 2), `Genre` and `projects` (Task 1).
- Produces: working filtering — `App` owns `activeGenre`; `ProjectGrid` requires `activeGenre: Genre | null`, renders the filtered list, remounts on change via `key`, and passes each tile its index.

- [ ] **Step 1: Add filtering to `ProjectGrid.tsx`**

Replace the contents of `src/components/ProjectGrid.tsx` with:

```tsx
import ProjectTile from './ProjectTile';
import { projects } from '../data/projects';
import type { Genre } from './types';

interface ProjectGridProps {
  activeGenre: Genre | null;
}

export default function ProjectGrid({ activeGenre }: ProjectGridProps) {
  const visible = activeGenre
    ? projects.filter((project) => project.genre === activeGenre)
    : projects;

  return (
    <div className="grid" key={activeGenre ?? 'all'}>
      {visible.map((project, index) => (
        <ProjectTile key={project.title} project={project} index={index} />
      ))}
    </div>
  );
}
```

Note: the tile `key` changes from `project.file` (which is `"PROJECT.png"` for every entry — duplicate keys) to `project.title`, which is unique.

- [ ] **Step 2: Add state and wiring in `App.tsx`**

Replace the contents of `src/App.tsx` with:

```tsx
import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProjectGrid from './components/ProjectGrid';
import Footer from './components/Footer';
import type { Genre } from './components/types';

export default function App() {
  const [activeGenre, setActiveGenre] = useState<Genre | null>(null);

  return (
    <div className="page">
      <div className="container">
        <Header activeGenre={activeGenre} onSelectGenre={setActiveGenre} />
        <Hero />
        <ProjectGrid activeGenre={activeGenre} />
        <Footer />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify it type-checks and builds**

Run: `npm run typecheck && npm run build`
Expected: both complete with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/components/ProjectGrid.tsx
git commit -m "feat: filter project grid by active genre"
```

---

### Task 5: CSS — active nav style and staggered transition

**Files:**
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: the `--i` var set by `ProjectTile` (Task 2), `data-active` on `.nav-item` (Task 3), the keyed grid remount (Task 4), and the existing `riseIn` keyframe.
- Produces: visual active state for the selected genre, a brand pointer cursor, and a staggered fade/rise entrance replayed on every filter change, disabled under `prefers-reduced-motion`.

- [ ] **Step 1: Add the active-nav and brand-cursor rules**

In `src/styles/global.css`, immediately after the existing `.nav-item:hover { ... }` block (around line 90), add:

```css
.nav-item[data-active='true'] {
  color: var(--accent);
  opacity: 1;
}

.nav-item-static {
  cursor: default;
}

.nav-item-static:hover {
  opacity: 1;
}

.brand {
  cursor: pointer;
}
```

(The existing `.brand` rule sets `display/justify-content/align-items/gap`; this adds `cursor` — alternatively append `cursor: pointer;` inside that existing rule. Either is fine; do not duplicate the other properties.)

- [ ] **Step 2: Add the staggered tile entrance and reduced-motion guard**

At the end of `src/styles/global.css`, append:

```css
/* ---------- Grid filter transition ---------- */
.grid .tile {
  animation: riseIn 0.55s cubic-bezier(0.2, 0.7, 0.2, 1) both;
  animation-delay: calc(var(--i, 0) * 0.05s);
}

@media (prefers-reduced-motion: reduce) {
  .grid .tile {
    animation: none;
  }
}
```

Because `ProjectGrid` remounts (via `key`) on every filter change, each tile re-runs this entrance with its per-index delay, producing the staggered settle. It also plays once on initial load.

- [ ] **Step 3: Verify it builds**

Run: `npm run build`
Expected: completes with no errors.

- [ ] **Step 4: Manual browser verification**

Run: `npm run dev` and open the printed local URL.
Confirm:
- Default load shows all 9 projects; each tile fades/rises in with a slight stagger.
- Clicking **Narrative** shows only the 5 Narrative projects; **Music Videos** shows the 3 samples; **Commercials** shows the 1 Hermès project.
- The selected nav item is shown in the accent color.
- Clicking the active genre again, or clicking the brand name, returns to all 9.
- `Info` / `Stills` do nothing.
- Filtering replays the staggered entrance smoothly (no hard cut, no layout jump of the Hero).
- With OS "reduce motion" enabled, the grid swaps instantly without animation.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: active nav style and staggered grid filter transition"
```

---

## Self-Review

**Spec coverage:**
- Structured genre data → Task 1.
- Sample Music Videos projects → Task 1.
- Clickable genre nav + active state + toggle/brand reset → Task 3 (style in Task 5).
- Filtered grid rendering → Task 4.
- CSS-only staggered/crossfade transition + reduced-motion → Tasks 2 (index plumbing) + 5.
- `Info`/`Stills` inert, Hero unchanged, no new deps → enforced across Tasks 3–5 and Global Constraints.

**Placeholder scan:** No TBD/TODO; every code step shows complete code.

**Type consistency:** `Genre` defined in Task 1 and consumed identically in Tasks 3–4. `index?: number` produced in Task 2 matches the `index={index}` passed in Task 4. `activeGenre`/`onSelectGenre` signatures in Task 3 match the props passed by `App` in Task 4. `--i` var set in Task 2 matches `var(--i, 0)` read in Task 5.
