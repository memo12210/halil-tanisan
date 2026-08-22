# Project Setup

How to take a fresh clone of this repo to a fully running site.

## 1. Install dependencies

```bash
npm install
```

## 2. Run it in development

```bash
npm run dev
```

Starts the Vite dev server at http://localhost:5173.

## 3. Build for production

```bash
npm run build     # tsc -b && vite build -> dist/
npm run preview   # serve the production build locally
```

`dist/` is a static bundle — any static host works (GitHub Pages, Netlify, etc.).

## Sanity-checking the setup

```bash
npm run typecheck
```

Should be clean on a correctly initialized checkout.
