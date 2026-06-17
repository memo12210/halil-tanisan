# Rina Yang Portfolio — Vite Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the standalone `Rina Yang Home.dc.html` (DC-runtime template) into a production-quality Vite + React + TypeScript app with identical visuals and behavior, no inline JS/CSS.

**Architecture:** Discard the DC runtime (`support.js`). Reimplement the cinematographer portfolio natively: a React component tree (Header / Hero / ProjectGrid → ProjectTile / Footer / Plate), CSS Modules per component, a typed theme/config module, and typed data. Hover state is local to Hero and each ProjectTile via `useState`.

**Tech Stack:** Vite 6, React 18, TypeScript 5 (strict), CSS Modules.

## Global Constraints

- No inline `style`/`<script>` in markup except the dynamic `backgroundImage` on `Plate` (a data-driven gradient). All other styling lives in `*.module.css` / `global.css`.
- TypeScript `strict: true`, `noUnusedLocals`, `noUnusedParameters` must pass.
- Preserve exact colors, fonts, spacing, letter-spacing, aspect ratios, animation timings from the source.
- Background `#faf9f6`; text `#15140f`; container `max-width:1480px; padding:0 40px`; page `min-height:100vh; padding-bottom:90px`.
- Font stacks: sans `'Helvetica Neue', Helvetica, Arial, sans-serif`; mono `ui-monospace, 'SF Mono', Menlo, monospace`.
- Editor props become the single tuning point in `src/config/theme.ts`: `restDim=0.5`, `accent='#b54a36'`, `captions=true`.
- Verification per task is `npm run typecheck`; final task adds `npm run build` + dev-server visual check. (Per spec, the app is static presentational UI; the test cycle is typecheck/build, not unit tests.)

---

### Task 1: Scaffold project, config, theme, global styles

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `.gitignore`, `index.html`
- Create: `src/vite-env.d.ts`, `src/config/theme.ts`, `src/styles/global.css`, `src/main.tsx`, `src/App.tsx`, `src/App.module.css`

**Interfaces:**
- Produces: `theme` (`{ restDim: number; accent: string; captions: boolean }`) from `src/config/theme.ts`; CSS vars `--rest-dim`, `--accent`, `--bg`, `--text`, `--font-sans`, `--font-mono` on `:root`; `App` default export.

- [ ] **Step 1: Initialize git + .gitignore**

```bash
cd "/home/memo/Downloads/cinematography"
git init
```

Create `.gitignore`:

```gitignore
node_modules
dist
dist-ssr
*.local
.DS_Store
```

- [ ] **Step 2: Create `package.json`**

```json
{
  "name": "rina-yang-portfolio",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "typecheck": "tsc -b --noEmit"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.6.3",
    "vite": "^6.0.5"
  }
}
```

- [ ] **Step 3: Create Vite + TS config**

`vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

`tsconfig.json`:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

`tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

`tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: Create `index.html` and `src/vite-env.d.ts`**

`index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Rina Yang — Cinematographer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`src/vite-env.d.ts`:

```ts
/// <reference types="vite/client" />
```

- [ ] **Step 5: Create theme config**

`src/config/theme.ts`:

```ts
export interface Theme {
  /** Opacity (0–1) of the resting dim overlay covering each plate. */
  restDim: number;
  /** Accent color. Exposed as the `--accent` CSS var; unused in the current
   *  layout (matches the original, where it is also not referenced). */
  accent: string;
  /** Whether project tiles reveal a caption on hover. */
  captions: boolean;
}

export const theme: Theme = {
  restDim: 0.5,
  accent: '#b54a36',
  captions: true,
};
```

- [ ] **Step 6: Create global styles**

`src/styles/global.css`:

```css
:root {
  --bg: #faf9f6;
  --text: #15140f;
  --accent: #b54a36;
  --rest-dim: 0.5;
  --font-sans: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --font-mono: ui-monospace, 'SF Mono', Menlo, monospace;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

@keyframes riseIn {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

- [ ] **Step 7: Create `src/main.tsx` (applies theme → CSS vars, single source of truth)**

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { theme } from './config/theme';
import './styles/global.css';

const root = document.documentElement;
root.style.setProperty('--rest-dim', String(theme.restDim));
root.style.setProperty('--accent', theme.accent);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 8: Create placeholder `src/App.tsx` + `src/App.module.css`**

`src/App.tsx` (components are added in later tasks; placeholder keeps it buildable):

```tsx
import styles from './App.module.css';

export default function App() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>{/* sections added in later tasks */}</div>
    </div>
  );
}
```

`src/App.module.css`:

```css
.page {
  min-height: 100vh;
  padding: 0 0 90px;
}

.container {
  max-width: 1480px;
  margin: 0 auto;
  padding: 0 40px;
}
```

- [ ] **Step 9: Install dependencies**

Run: `npm install`
Expected: dependencies installed, no peer errors that fail the install.

- [ ] **Step 10: Verify build + dev server**

Run: `npm run build`
Expected: `tsc -b` and `vite build` succeed; `dist/` produced, no type errors.

Run: `npm run dev` (then stop it)
Expected: dev server starts on a local port, serves a blank page with no console errors.

- [ ] **Step 11: Remove obsolete DC source files**

The DC runtime and template are replaced; remove them so the repo has one source of truth.

```bash
git rm --cached "Rina Yang Home.dc.html" support.js 2>/dev/null || true
rm -f "Rina Yang Home.dc.html" support.js
```

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite + React + TS project with theme and global styles"
```

---

### Task 2: Types and project data

**Files:**
- Create: `src/components/types.ts`, `src/data/projects.ts`

**Interfaces:**
- Produces: `Tone = 'warm' | 'cool' | 'dark' | 'neutral'`; `Project { file: string; tone: Tone; tag: string; title: string; meta: string }`; `Featured { file: string; tone: Tone; tag: string; label: string; title: string; credit: string }`; `featured: Featured`; `projects: Project[]` (6 items).

- [ ] **Step 1: Create `src/components/types.ts`**

```ts
export type Tone = 'warm' | 'cool' | 'dark' | 'neutral';

export interface Project {
  /** Source filename, shown as the plate label. */
  file: string;
  tone: Tone;
  /** Aspect-ratio tag, e.g. "2.39:1". */
  tag: string;
  title: string;
  meta: string;
}

export interface Featured {
  file: string;
  tone: Tone;
  tag: string;
  /** Overlay eyebrow label, e.g. "FEATURED". */
  label: string;
  title: string;
  /** Director / studio credit line. */
  credit: string;
}
```

- [ ] **Step 2: Create `src/data/projects.ts`**

Values copied verbatim from the original `renderVals` `data` array and the hero block.

```ts
import type { Featured, Project } from '../components/types';

export const featured: Featured = {
  file: 'MOTHER_MARY_A24.jpg',
  tone: 'warm',
  tag: '2.39 : 1',
  label: 'FEATURED',
  title: 'MOTHER MARY',
  credit: 'DIR. DAVID LOWERY | A24',
};

export const projects: Project[] = [
  { file: 'HERMES_BEAUTE.jpg', tone: 'cool', tag: '2.39:1', title: 'Hermès — Beauté', meta: 'Dir. Rubberband · Commercial' },
  { file: 'EUPHORIA_S2E6.jpg', tone: 'dark', tag: '2.00:1', title: 'Euphoria — S2', meta: 'HBO / A24 · Narrative' },
  { file: 'ODESSA_STILL.jpg', tone: 'warm', tag: '2.39:1', title: "O'Dessa", meta: 'Searchlight · Narrative' },
  { file: 'NANNY_STILL.jpg', tone: 'neutral', tag: '1.85:1', title: 'Nanny', meta: 'Amazon Studios · Narrative' },
  { file: 'TOP_BOY_III.jpg', tone: 'dark', tag: '2.00:1', title: 'Top Boy III', meta: 'Netflix · Narrative' },
  { file: 'FIRE_INSIDE.jpg', tone: 'warm', tag: '2.39:1', title: 'The Fire Inside', meta: 'MGM Studios · Narrative' },
];
```

- [ ] **Step 3: Verify typecheck**

Run: `npm run typecheck`
Expected: PASS, no errors. (Files are not yet imported; this confirms they compile.)

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add typed project data and shared types"
```

---

### Task 3: Plate component (tone-gradient image placeholder)

**Files:**
- Create: `src/components/Plate.tsx`, `src/components/Plate.module.css`

**Interfaces:**
- Consumes: `Tone` from `./types`.
- Produces: `Plate` default export, props `{ tone: Tone; label: string; tag?: string }`. Renders a div filling its parent (`width/height:100%`) with a tone gradient and centered label/tag.

- [ ] **Step 1: Create `src/components/Plate.tsx`**

```tsx
import type { Tone } from './types';
import styles from './Plate.module.css';

const TONE_GRADIENT: Record<Tone, string> = {
  warm: 'linear-gradient(135deg, #3a2a1d 0%, #7a4e30 55%, #b9844f 100%)',
  cool: 'linear-gradient(135deg, #1d2733 0%, #33485c 55%, #6f8ea8 100%)',
  dark: 'linear-gradient(135deg, #0e0e10 0%, #24232a 60%, #3a3742 100%)',
  neutral: 'linear-gradient(135deg, #34322c 0%, #6a655b 55%, #a39d90 100%)',
};

interface PlateProps {
  tone: Tone;
  /** Filename label shown faintly over the placeholder. */
  label: string;
  /** Optional aspect-ratio tag, e.g. "2.39:1". */
  tag?: string;
}

export default function Plate({ tone, label, tag }: PlateProps) {
  return (
    <div className={styles.plate} style={{ backgroundImage: TONE_GRADIENT[tone] }}>
      <span className={styles.label}>{label}</span>
      {tag && <span className={styles.tag}>{tag}</span>}
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/Plate.module.css`**

```css
.plate {
  position: relative;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(245, 242, 235, 0.5);
}

.tag {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  color: rgba(245, 242, 235, 0.35);
}
```

- [ ] **Step 3: Verify typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Plate tone-gradient placeholder component"
```

---

### Task 4: Header and Footer

**Files:**
- Create: `src/components/Header.tsx`, `src/components/Header.module.css`
- Create: `src/components/Footer.tsx`, `src/components/Footer.module.css`

**Interfaces:**
- Produces: `Header` and `Footer` default exports (no props).

- [ ] **Step 1: Create `src/components/Header.tsx`**

```tsx
import styles from './Header.module.css';

const NAV_ITEMS = ['Narrative', 'Music videos', 'Commercials', 'Info', 'Stills'];

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.name}>RINA YANG</span>
        <span className={styles.role}>CINEMATOGRAPHER</span>
      </div>
      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <span key={item} className={styles.navItem}>
            {item}
          </span>
        ))}
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Create `src/components/Header.module.css`**

```css
.header {
  padding: 42px 0 30px;
  text-align: center;
  animation: riseIn 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}

.brand {
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 12px;
}

.name {
  font-size: 23px;
  font-weight: 600;
  letter-spacing: 0.2em;
}

.role {
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.26em;
}

.nav {
  display: flex;
  justify-content: center;
  gap: 46px;
  margin-top: 28px;
  font-size: 17px;
}

.navItem {
  cursor: pointer;
  transition: opacity 0.3s;
}

.navItem:hover {
  opacity: 0.5;
}
```

- [ ] **Step 3: Create `src/components/Footer.tsx`**

```tsx
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span>Rina Yang — Cinematographer</span>
      <span>London / Tokyo</span>
      <span>Lux · Iconic</span>
    </footer>
  );
}
```

- [ ] **Step 4: Create `src/components/Footer.module.css`**

```css
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 60px;
  padding-top: 24px;
  border-top: 1px solid #e7e4dd;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #8a857c;
}
```

- [ ] **Step 5: Verify typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Header and Footer components"
```

---

### Task 5: Hero (featured plate with hover focus effect)

**Files:**
- Create: `src/components/Hero.tsx`, `src/components/Hero.module.css`

**Interfaces:**
- Consumes: `Plate` from `./Plate`; `featured` from `../data/projects`.
- Produces: `Hero` default export (no props). Owns a local `hover` boolean.

- [ ] **Step 1: Create `src/components/Hero.tsx`**

```tsx
import { useState } from 'react';
import Plate from './Plate';
import { featured } from '../data/projects';
import styles from './Hero.module.css';

export default function Hero() {
  const [hover, setHover] = useState(false);

  return (
    <section className={styles.hero}>
      <div
        className={styles.frame}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className={styles.image}>
          <Plate tone={featured.tone} label={featured.file} tag={featured.tag} />
        </div>
        <div className={styles.baseDim} />
        <div className={styles.focusVeil} data-active={hover} />
        <div className={styles.overlay} data-active={hover}>
          <div className={styles.featuredTag}>{featured.label}</div>
          <div className={styles.caption}>
            <div className={styles.title}>{featured.title}</div>
            <div className={styles.credit}>{featured.credit}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `src/components/Hero.module.css`**

```css
.hero {
  animation: riseIn 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) 0.06s both;
}

.frame {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.image {
  aspect-ratio: 2.4 / 1;
  width: 100%;
  background: #e7e3db;
}

.baseDim {
  position: absolute;
  inset: 0;
  background: rgba(18, 15, 9, var(--rest-dim));
  pointer-events: none;
}

.focusVeil {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(10, 8, 5, 0.5), rgba(8, 6, 4, 0.66));
  opacity: 0;
  transition: opacity 0.6s ease;
  pointer-events: none;
}

.focusVeil[data-active='true'] {
  opacity: 1;
}

.overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -46%);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: #f4f1ea;
  opacity: 0;
  transition: opacity 0.5s ease, transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
  pointer-events: none;
  width: max-content;
}

.overlay[data-active='true'] {
  opacity: 1;
  transform: translate(-50%, -50%);
}

.featuredTag {
  padding: 17px 38px;
  padding-left: calc(38px + 0.46em);
  border: 1px solid rgba(245, 242, 235, 0.6);
  font-size: 15px;
  font-weight: 300;
  letter-spacing: 0.46em;
  white-space: nowrap;
}

.caption {
  margin-top: 24px;
}

.title {
  font-size: 27px;
  font-weight: 300;
  letter-spacing: 0.08em;
}

.credit {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.18em;
  margin-top: 9px;
  opacity: 0.85;
}
```

- [ ] **Step 3: Verify typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Hero featured plate with hover focus effect"
```

---

### Task 6: ProjectTile and ProjectGrid

**Files:**
- Create: `src/components/ProjectTile.tsx`, `src/components/ProjectTile.module.css`
- Create: `src/components/ProjectGrid.tsx`, `src/components/ProjectGrid.module.css`

**Interfaces:**
- Consumes: `Plate` from `./Plate`; `theme` from `../config/theme`; `Project` from `./types`; `projects` from `../data/projects`.
- Produces: `ProjectTile` (props `{ project: Project }`, owns local `hover`); `ProjectGrid` default export (no props).

- [ ] **Step 1: Create `src/components/ProjectTile.tsx`**

```tsx
import { useState } from 'react';
import Plate from './Plate';
import { theme } from '../config/theme';
import type { Project } from './types';
import styles from './ProjectTile.module.css';

interface ProjectTileProps {
  project: Project;
}

export default function ProjectTile({ project }: ProjectTileProps) {
  const [hover, setHover] = useState(false);
  const showCaption = hover && theme.captions;

  return (
    <div
      className={styles.tile}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className={styles.image}>
        <Plate tone={project.tone} label={project.file} tag={project.tag} />
      </div>
      <div className={styles.dim} data-active={hover} />
      <div className={styles.caption} data-active={showCaption}>
        <span className={styles.title}>{project.title}</span>
        <span className={styles.meta}>{project.meta}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/ProjectTile.module.css`**

`.dim` rests at opacity 1 and fades to 0 on hover (matches original `opacity: on ? 0 : 1`).

```css
.tile {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.image {
  aspect-ratio: 16 / 9;
  width: 100%;
  background: #e7e3db;
}

.dim {
  position: absolute;
  inset: 0;
  background: rgba(18, 15, 9, var(--rest-dim));
  opacity: 1;
  transition: opacity 0.55s ease;
  pointer-events: none;
}

.dim[data-active='true'] {
  opacity: 0;
}

.caption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 18px;
  background: linear-gradient(to top, rgba(8, 6, 3, 0.66), rgba(8, 6, 3, 0));
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.5s ease, transform 0.5s ease;
  pointer-events: none;
}

.caption[data-active='true'] {
  opacity: 1;
  transform: translateY(0);
}

.title {
  font-size: 16px;
  color: #fff;
  letter-spacing: 0.02em;
}

.meta {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.82);
}
```

- [ ] **Step 3: Create `src/components/ProjectGrid.tsx`**

```tsx
import ProjectTile from './ProjectTile';
import { projects } from '../data/projects';
import styles from './ProjectGrid.module.css';

export default function ProjectGrid() {
  return (
    <div className={styles.grid}>
      {projects.map((project) => (
        <ProjectTile key={project.file} project={project} />
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Create `src/components/ProjectGrid.module.css`**

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 30px;
}
```

- [ ] **Step 5: Verify typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add ProjectTile and ProjectGrid with hover captions"
```

---

### Task 7: Compose App and verify end-to-end

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `Header`, `Hero`, `ProjectGrid`, `Footer`.

- [ ] **Step 1: Replace `src/App.tsx` body with full composition**

```tsx
import Header from './components/Header';
import Hero from './components/Hero';
import ProjectGrid from './components/ProjectGrid';
import Footer from './components/Footer';
import styles from './App.module.css';

export default function App() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Header />
        <Hero />
        <ProjectGrid />
        <Footer />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + build**

Run: `npm run build`
Expected: `tsc -b` + `vite build` succeed with zero errors; `dist/` produced.

- [ ] **Step 3: Visual verification against the original**

Run: `npm run dev`, open the served URL.
Confirm, comparing to the original `Rina Yang Home.dc.html` render:
- Centered `RINA YANG` / `CINEMATOGRAPHER` header + 5-item nav; nav items dim to 0.5 opacity on hover.
- Hero 2.4:1 plate dimmed at rest; on hover a darker veil fades in and the `FEATURED` / `MOTHER MARY` / credit block fades and rises into the center.
- 3-column grid of six 16:9 tiles, each dimmed at rest; on hover the dim lifts and a bottom caption (title + meta) fades and slides up.
- Footer row: `Rina Yang — Cinematographer` / `London / Tokyo` / `Lux · Iconic` in uppercase mono.
- Entrance: header then hero rise in with the staggered `riseIn` animation.
- Background `#faf9f6`, `max-width:1480px` centered with 40px side padding.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: compose App from Header, Hero, ProjectGrid, Footer"
```

---

## Self-Review

**Spec coverage:**
- Project setup (Vite + TS, ES modules, folder structure, no inline CSS/JS) → Task 1.
- Typed config/theme (restDim/accent/captions) → Task 1 (theme.ts + main.tsx CSS vars).
- Typed data + types → Task 2.
- Plate tone placeholders (replaces `dc-import`) → Task 3.
- Header/Footer → Task 4. Hero hover focus → Task 5. Tile/Grid hover captions → Task 6.
- App composition + entrance animations + visual fidelity check → Task 7.
- Discard DC runtime → Task 1 Step 11.
- Verification (build/typecheck + visual) → per-task typecheck, Task 7 build + visual.

**Placeholder scan:** No TBD/TODO; every file's full content is inline.

**Type consistency:** `Tone`, `Project`, `Featured` defined in Task 2 are consumed with matching shapes in Tasks 3/5/6. `theme` shape (`restDim/accent/captions`) consistent between Task 1 and Task 6. `Plate` prop names (`tone/label/tag`) consistent between Task 3 definition and Task 5/6 usage. Default exports consumed in Task 7 match component definitions.
