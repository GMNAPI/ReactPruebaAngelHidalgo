# Range Component — Technical Test

Custom `<Range />` React component in two modes, served at `localhost:8080`.

## Exercises

| Route | Mode | Behaviour |
|-------|------|-----------|
| `/exercise1` | Normal | Two draggable bullets, editable min/max currency labels, bounds from API |
| `/exercise2` | Fixed | Two draggable bullets snapping to fixed values, read-only labels, values from API |

Both routes fetch data from MSW-intercepted endpoints so no real server is needed.

## Stack

| Tool | Version | Role |
|------|---------|------|
| React | 18.3 | UI |
| TypeScript | 5.6 | Type safety |
| Vite | 5.4 | Dev server + bundler |
| React Router | 6.28 | Client-side routing |
| MSW | 2.6 | HTTP mocking (browser + test) |
| Vitest | 2.1 | Test runner |
| React Testing Library | 16.1 | Component tests |

### Why Vite

Vite serves source files as native ES modules during development — the browser resolves imports directly without a bundle step. This means a cold start in under a second and instant HMR regardless of project size, compared to webpack-based tools (CRA, Next.js without Turbopack) that bundle the whole graph on startup.

For this project specifically, Vite's first-class MSW support matters: the service worker is served from `public/` during `npm run dev` and MSW intercepts fetch calls before they leave the browser, with zero extra configuration. Vitest also reuses the same Vite pipeline so test transforms and aliases stay consistent with the dev build.

## Setup

```bash
npm install
npm run dev       # Dev server → localhost:8080
npm run test      # Run all tests (31 tests, 5 files)
npm run build     # Production build (tsc + vite build)
```

## Architecture

```
src/
  components/
    Range/
      Range.tsx           # Shared component — normal and fixed modes
      Range.module.css    # Grab/grabbing cursors, hover scale-up
      Range.test.tsx
  hooks/
    useRangeDrag.ts       # Mouse drag logic — document-level listeners during drag
    useRangeDrag.test.ts
  services/
    rangeApi.ts           # Typed fetch calls, intercepted by MSW
    rangeApi.test.ts
  mocks/
    handlers.ts           # GET /api/range, GET /api/range-fixed
    browser.ts            # MSW browser worker (dev)
    server.ts             # MSW Node server (tests)
  pages/
    Exercise1.tsx         # Fetches {min, max} → <Range mode="normal" />
    Exercise2.tsx         # Fetches {rangeValues} → <Range mode="fixed" />
  App.tsx                 # Lazy-loaded routes with Suspense
  main.tsx                # MSW start → ReactDOM render
```

## Key Implementation Notes

- `<Range />` does **not** use `<input type="range">` — fully custom DOM with `role="slider"` for accessibility
- Bullet positions are expressed as CSS `left` percentages computed from value/index state
- Drag logic attaches `mousemove`/`mouseup` to `document` (not the track) so fast cursor movement outside the component doesn't drop the drag
- Fixed mode uses index-based state (`minIndex`, `maxIndex`) so snap-to-value and cross-prevention are simple integer comparisons
- Normal mode currency labels are `<input>` (editable, clamped on blur); fixed mode labels are `<span>` (read-only)

## MSW Endpoints

| Method | Path | Response |
|--------|------|----------|
| GET | `/api/range` | `{ min: 1, max: 100 }` |
| GET | `/api/range-fixed` | `{ rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99] }` |
